"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActiveSubscription } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hoursToMinutes, projectBalanceMinutes } from "@/lib/pto/calculations";
import { bucketToAccrualConfig, getDefaultBucket, getPrimaryPolicy } from "@/lib/pto/queries";
import { track } from "@/lib/analytics";

export type ActionState = { error: string | null; success?: boolean };

const policySchema = z.object({
  name: z.string().trim().min(1, "Give your policy a name.").max(100),
  hoursPerDay: z.coerce.number().min(1).max(24),
  employmentStartDate: z.string().optional().nullable(),
  startingBalanceHours: z.coerce.number().min(0),
  annualAccrualHours: z.coerce.number().min(0),
  accrualFrequency: z.enum(["WEEKLY", "BIWEEKLY", "SEMIMONTHLY", "MONTHLY", "ANNUALLY", "PER_HOUR_WORKED"]),
  hoursWorkedPerWeek: z.coerce.number().min(1).max(80).default(40),
  maxBalanceHours: z.string().optional(),
  nextAccrualDate: z.string().optional().nullable(),
});

/** Creates the user's PTO policy and default Vacation bucket, or updates
 * them if they already exist (there's only ever one policy in the MVP UI). */
export async function savePolicy(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireActiveSubscription();

  const parsed = policySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const existing = await getPrimaryPolicy(user.id);
  const hoursPerDayMinutes = hoursToMinutes(data.hoursPerDay);
  const maxBalanceMinutes = data.maxBalanceHours ? hoursToMinutes(Number(data.maxBalanceHours)) : null;
  const nextAccrualDate = data.nextAccrualDate ? new Date(`${data.nextAccrualDate}T00:00:00.000Z`) : null;
  const employmentStartDate = data.employmentStartDate
    ? new Date(`${data.employmentStartDate}T00:00:00.000Z`)
    : null;

  const bucketFields = {
    startingBalanceMinutes: hoursToMinutes(data.startingBalanceHours),
    balanceAsOfDate: new Date(),
    accrualAmountMinutes: hoursToMinutes(data.annualAccrualHours),
    accrualFrequency: data.accrualFrequency,
    hoursWorkedPerWeek: Math.round(data.hoursWorkedPerWeek),
    maxBalanceMinutes,
    nextAccrualDate,
  };

  if (existing) {
    await prisma.ptoPolicy.update({
      where: { id: existing.id },
      data: { name: data.name, hoursPerDayMinutes, employmentStartDate },
    });
    const defaultBucket = getDefaultBucket(existing);
    if (defaultBucket) {
      await prisma.ptoBucket.update({ where: { id: defaultBucket.id }, data: bucketFields });
    } else {
      await prisma.ptoBucket.create({
        data: { policyId: existing.id, type: "VACATION", name: "Vacation", isDefault: true, ...bucketFields },
      });
    }
  } else {
    await prisma.ptoPolicy.create({
      data: {
        userId: user.id,
        name: data.name,
        hoursPerDayMinutes,
        employmentStartDate,
        buckets: {
          create: { type: "VACATION", name: "Vacation", isDefault: true, ...bucketFields },
        },
      },
    });
  }

  revalidatePath("/dashboard");
  return { error: null, success: true };
}

const vacationSchema = z
  .object({
    name: z.string().trim().min(1, "Give your trip a name.").max(100),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().min(1, "End date is required."),
    hoursRequired: z.coerce.number().min(0.5, "Enter how many PTO hours the trip needs."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });

export async function createVacation(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireActiveSubscription();

  const policy = await getPrimaryPolicy(user.id);
  const bucket = getDefaultBucket(policy);
  if (!bucket) return { error: "Set up your PTO policy first." };

  const parsed = vacationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  await prisma.plannedVacation.create({
    data: {
      userId: user.id,
      bucketId: bucket.id,
      name: data.name,
      startDate: new Date(`${data.startDate}T00:00:00.000Z`),
      endDate: new Date(`${data.endDate}T00:00:00.000Z`),
      hoursRequiredMinutes: hoursToMinutes(data.hoursRequired),
    },
  });

  track({ name: "vacation_created", hoursRequired: data.hoursRequired });
  revalidatePath("/dashboard/vacations");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function deleteVacation(vacationId: string) {
  const user = await requireActiveSubscription();
  await prisma.plannedVacation.deleteMany({ where: { id: vacationId, userId: user.id } });
  revalidatePath("/dashboard/vacations");
  revalidatePath("/dashboard");
}

const transactionSchema = z.object({
  type: z.enum(["EARNED", "USED", "ADJUSTMENT"]),
  direction: z.enum(["increase", "decrease"]).default("increase"),
  amountHours: z.coerce.number().positive("Enter an amount greater than 0."),
  occurredOn: z.string().min(1, "Date is required."),
  note: z.string().trim().max(280).optional(),
});

export async function createTransaction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireActiveSubscription();

  const policy = await getPrimaryPolicy(user.id);
  const bucket = getDefaultBucket(policy);
  if (!bucket || !policy) return { error: "Set up your PTO policy first." };

  const parsed = transactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const data = parsed.data;

  const magnitudeMinutes = hoursToMinutes(data.amountHours);
  const isNegative = data.type === "USED" || (data.type === "ADJUSTMENT" && data.direction === "decrease");
  const signedMinutes = isNegative ? -magnitudeMinutes : magnitudeMinutes;

  await prisma.ptoTransaction.create({
    data: {
      bucketId: bucket.id,
      type: data.type,
      amountMinutes: signedMinutes,
      occurredOn: new Date(`${data.occurredOn}T00:00:00.000Z`),
      note: data.note || null,
    },
  });

  // Rebase the bucket's baseline so the computed balance reflects this
  // entry going forward, keeping the accrual formula the single source of
  // truth for projections.
  const config = bucketToAccrualConfig(bucket, policy.hoursPerDayMinutes);
  const now = new Date();
  const newBalance = projectBalanceMinutes(config, now) + signedMinutes;

  await prisma.ptoBucket.update({
    where: { id: bucket.id },
    data: { startingBalanceMinutes: newBalance, balanceAsOfDate: now },
  });

  revalidatePath("/dashboard/activity");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}
