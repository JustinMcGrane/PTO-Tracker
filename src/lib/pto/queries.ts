import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { AccrualConfig } from "@/lib/pto/types";
import type { PtoBucket, PtoPolicy } from "@prisma/client";

export function bucketToAccrualConfig(bucket: PtoBucket, hoursPerDayMinutes: number): AccrualConfig {
  return {
    startingBalanceMinutes: bucket.startingBalanceMinutes,
    asOfDate: bucket.balanceAsOfDate,
    annualAccrualMinutes: bucket.accrualAmountMinutes,
    frequency: bucket.accrualFrequency,
    maxBalanceMinutes: bucket.maxBalanceMinutes,
    hoursPerDayMinutes,
    hoursWorkedPerWeek: bucket.hoursWorkedPerWeek,
  };
}

/** The user's primary policy with its default bucket, or null if they
 * haven't completed onboarding yet. Scoped to the given userId only. */
export async function getPrimaryPolicy(userId: string) {
  return prisma.ptoPolicy.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { buckets: { orderBy: { createdAt: "asc" } } },
  });
}

export function getDefaultBucket(policy: (PtoPolicy & { buckets: PtoBucket[] }) | null) {
  if (!policy) return null;
  return policy.buckets.find((b) => b.isDefault) ?? policy.buckets[0] ?? null;
}

/** For dashboard pages that need a policy/bucket to function; redirects to
 * onboarding if the user hasn't set one up yet. */
export async function requirePolicyWithBucket(userId: string) {
  const policy = await getPrimaryPolicy(userId);
  const bucket = getDefaultBucket(policy);
  if (!policy || !bucket) {
    redirect("/dashboard/onboarding");
  }
  return { policy, bucket };
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({ where: { userId } });
}

export async function listVacations(userId: string) {
  return prisma.plannedVacation.findMany({
    where: { userId },
    orderBy: { startDate: "asc" },
  });
}

export async function listTransactions(bucketId: string, limit = 25) {
  return prisma.ptoTransaction.findMany({
    where: { bucketId },
    orderBy: { occurredOn: "desc" },
    take: limit,
  });
}
