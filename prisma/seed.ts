import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

async function main() {
  const user = await prisma.user.upsert({
    where: { id: DEMO_USER_ID },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: "demo@pto-tracker.app",
    },
  });

  const policy = await prisma.ptoPolicy.upsert({
    where: { id: "demo-policy" },
    update: {},
    create: {
      id: "demo-policy",
      userId: user.id,
      name: "Acme Corp PTO",
      employmentStartDate: new Date("2023-03-15T00:00:00.000Z"),
      hoursPerDayMinutes: 480,
    },
  });

  const bucket = await prisma.ptoBucket.upsert({
    where: { id: "demo-bucket-vacation" },
    update: {},
    create: {
      id: "demo-bucket-vacation",
      policyId: policy.id,
      type: "VACATION",
      name: "Vacation",
      isDefault: true,
      startingBalanceMinutes: 60 * 72, // 72 hours
      balanceAsOfDate: new Date(),
      accrualAmountMinutes: 60 * 120, // 120 hours/year
      accrualFrequency: "BIWEEKLY",
      maxBalanceMinutes: 60 * 200, // 200 hour cap
      nextAccrualDate: null,
    },
  });

  await prisma.ptoTransaction.createMany({
    data: [
      {
        bucketId: bucket.id,
        type: "EARNED",
        amountMinutes: 60 * 4.6,
        occurredOn: new Date(Date.now() - 14 * 86_400_000),
        note: "Biweekly accrual",
      },
      {
        bucketId: bucket.id,
        type: "USED",
        amountMinutes: -60 * 16,
        occurredOn: new Date(Date.now() - 45 * 86_400_000),
        note: "Long weekend",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.plannedVacation.upsert({
    where: { id: "demo-vacation-1" },
    update: {},
    create: {
      id: "demo-vacation-1",
      userId: user.id,
      bucketId: bucket.id,
      name: "Summer trip to Portugal",
      startDate: new Date(Date.now() + 60 * 86_400_000),
      endDate: new Date(Date.now() + 67 * 86_400_000),
      hoursRequiredMinutes: 60 * 40,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      tier: "FREE",
      status: "ACTIVE",
    },
  });

  console.log("Seed complete. Demo user:", user.email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
