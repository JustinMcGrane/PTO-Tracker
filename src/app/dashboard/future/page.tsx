import { requireActiveSubscription } from "@/lib/auth";
import { bucketToAccrualConfig, listVacations, requirePolicyWithBucket } from "@/lib/pto/queries";
import { FutureCalculator } from "@/components/dashboard/FutureCalculator";

export default async function FuturePtoPage() {
  const user = await requireActiveSubscription();
  const { policy, bucket } = await requirePolicyWithBucket(user.id);
  const vacations = await listVacations(user.id);

  const config = bucketToAccrualConfig(bucket, policy.hoursPerDayMinutes);
  const vacationImpacts = vacations.map((v) => ({
    startDate: v.startDate,
    hoursRequiredMinutes: v.hoursRequiredMinutes,
  }));

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl">Future PTO calculator</h1>
        <p className="mt-1 text-ink-600">Pick any date and see exactly how much PTO you&apos;ll have.</p>
      </div>
      <FutureCalculator config={config} vacations={vacationImpacts} />
    </div>
  );
}
