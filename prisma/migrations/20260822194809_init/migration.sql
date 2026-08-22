
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AccrualFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'ANNUALLY', 'PER_HOUR_WORKED');

-- CreateEnum
CREATE TYPE "PtoBucketType" AS ENUM ('VACATION', 'SICK', 'PERSONAL', 'FLOATING_HOLIDAY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('EARNED', 'USED', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'INCOMPLETE', 'UNPAID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PtoPolicy" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My PTO Policy',
    "employmentStartDate" TIMESTAMP(3),
    "hoursPerDayMinutes" INTEGER NOT NULL DEFAULT 480,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PtoPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PtoBucket" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "type" "PtoBucketType" NOT NULL DEFAULT 'VACATION',
    "name" TEXT NOT NULL DEFAULT 'Vacation',
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "startingBalanceMinutes" INTEGER NOT NULL DEFAULT 0,
    "balanceAsOfDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accrualAmountMinutes" INTEGER NOT NULL DEFAULT 0,
    "accrualFrequency" "AccrualFrequency" NOT NULL DEFAULT 'BIWEEKLY',
    "hoursWorkedPerWeek" INTEGER NOT NULL DEFAULT 40,
    "maxBalanceMinutes" INTEGER,
    "nextAccrualDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PtoBucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PtoTransaction" (
    "id" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amountMinutes" INTEGER NOT NULL,
    "occurredOn" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PtoTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedVacation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "hoursRequiredMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlannedVacation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "PlanTier" NOT NULL DEFAULT 'FREE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "PtoPolicy_userId_idx" ON "PtoPolicy"("userId");

-- CreateIndex
CREATE INDEX "PtoBucket_policyId_idx" ON "PtoBucket"("policyId");

-- CreateIndex
CREATE INDEX "PtoTransaction_bucketId_idx" ON "PtoTransaction"("bucketId");

-- CreateIndex
CREATE INDEX "PtoTransaction_bucketId_occurredOn_idx" ON "PtoTransaction"("bucketId", "occurredOn");

-- CreateIndex
CREATE INDEX "PlannedVacation_userId_idx" ON "PlannedVacation"("userId");

-- CreateIndex
CREATE INDEX "PlannedVacation_bucketId_idx" ON "PlannedVacation"("bucketId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "PtoPolicy" ADD CONSTRAINT "PtoPolicy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PtoBucket" ADD CONSTRAINT "PtoBucket_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "PtoPolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PtoTransaction" ADD CONSTRAINT "PtoTransaction_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "PtoBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedVacation" ADD CONSTRAINT "PlannedVacation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedVacation" ADD CONSTRAINT "PlannedVacation_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "PtoBucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

