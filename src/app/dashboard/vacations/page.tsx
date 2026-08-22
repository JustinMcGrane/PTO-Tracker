import { requireUser } from "@/lib/auth";
import { bucketToAccrualConfig, getSubscription, listVacations, requirePolicyWithBucket } from "@/lib/pto/queries";
import { calculateVacationPlan, minutesToDays, minutesToHours } from "@/lib/pto/calculations";
import { formatDate } from "@/lib/pto/format";
import { FREE_PLAN_LIMITS, isPremium } from "@/lib/plan";
import { deleteVacation } from "@/app/dashboard/actions";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { VacationForm } from "@/components/dashboard/VacationForm";

export default async function VacationsPage() {
  const user = await requireUser();
  const { policy, bucket } = await requirePolicyWithBucket(user.id);
  const [vacations, subscription] = await Promise.all([listVacations(user.id), getSubscription(user.id)]);

  const config = bucketToAccrualConfig(bucket, policy.hoursPerDayMinutes);
  const premium = isPremium(subscription);
  const atLimit = !premium && vacations.length >= FREE_PLAN_LIMITS.maxVacations;

  const plans = vacations.map((vacation) => {
    const others = vacations
      .filter((v) => v.id !== vacation.id)
      .map((v) => ({ startDate: v.startDate, hoursRequiredMinutes: v.hoursRequiredMinutes }));
    const result = calculateVacationPlan(
      config,
      { startDate: vacation.startDate, hoursRequiredMinutes: vacation.hoursRequiredMinutes },
      others
    );
    return { vacation, result };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Vacation planner</h1>
        <p className="mt-1 text-ink-600">
          See your projected PTO balance before and after each trip, accounting for what you&apos;ll
          earn between now and then.
        </p>
      </div>

      <Card>
        <h2 className="mb-4 text-lg text-ink-900">Plan a new vacation</h2>
        {atLimit ? (
          <div className="rounded-lg bg-ink-50 p-4 text-sm text-ink-600">
            Free accounts can plan up to {FREE_PLAN_LIMITS.maxVacations} vacations at a time.{" "}
            <ButtonLink href="/dashboard/billing" size="sm" className="mt-3">
              Upgrade for unlimited planning
            </ButtonLink>
          </div>
        ) : (
          <VacationForm />
        )}
      </Card>

      <div className="space-y-4">
        {plans.length === 0 && (
          <p className="text-sm text-ink-500">No vacations planned yet.</p>
        )}
        {plans.map(({ vacation, result }) => {
          const shortfall = result.balanceAfterMinutes < 0;
          return (
            <Card key={vacation.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base text-ink-900">{vacation.name}</h3>
                  <p className="text-sm text-ink-600">
                    {formatDate(vacation.startDate)} – {formatDate(vacation.endDate)}
                  </p>
                </div>
                <form action={deleteVacation.bind(null, vacation.id)}>
                  <button type="submit" className="text-sm text-ink-400 hover:text-red-600">
                    Remove
                  </button>
                </form>
              </div>

              <div className="mt-4 grid gap-3 rounded-lg bg-ink-50 p-4 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-ink-500">Projected before</p>
                  <p className="font-medium text-ink-900">
                    {minutesToHours(result.balanceBeforeMinutes).toFixed(1)} hrs
                  </p>
                </div>
                <div>
                  <p className="text-ink-500">Trip requires</p>
                  <p className="font-medium text-ink-900">
                    {minutesToHours(result.hoursRequiredMinutes).toFixed(1)} hrs
                  </p>
                </div>
                <div>
                  <p className="text-ink-500">Projected after</p>
                  <p className={`font-medium ${shortfall ? "text-red-600" : "text-ink-900"}`}>
                    {minutesToHours(result.balanceAfterMinutes).toFixed(1)} hrs
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-ink-600">
                You&apos;re projected to have {minutesToHours(result.balanceBeforeMinutes).toFixed(1)} hours
                available. Your trip requires {minutesToHours(result.hoursRequiredMinutes).toFixed(1)} hours.
                {shortfall ? (
                  <> You&apos;re projected to be short by {minutesToHours(-result.balanceAfterMinutes).toFixed(1)} hours.</>
                ) : (
                  <>
                    {" "}
                    You&apos;ll have approximately {minutesToHours(result.balanceAfterMinutes).toFixed(1)} hours (
                    {minutesToDays(result.balanceAfterMinutes, config.hoursPerDayMinutes).toFixed(1)} days) remaining.
                  </>
                )}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
