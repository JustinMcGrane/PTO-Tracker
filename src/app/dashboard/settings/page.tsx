import { requireActiveSubscription } from "@/lib/auth";
import { requirePolicyWithBucket } from "@/lib/pto/queries";
import { minutesToHours } from "@/lib/pto/calculations";
import { Card } from "@/components/ui/Card";
import { PolicyForm, type PolicyFormDefaults } from "@/components/dashboard/PolicyForm";

function toDateInputValue(date: Date | null): string {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function SettingsPage() {
  const user = await requireActiveSubscription();
  const { policy, bucket } = await requirePolicyWithBucket(user.id);

  const defaults: PolicyFormDefaults = {
    name: policy.name,
    hoursPerDay: minutesToHours(policy.hoursPerDayMinutes),
    employmentStartDate: toDateInputValue(policy.employmentStartDate),
    startingBalanceHours: minutesToHours(bucket.startingBalanceMinutes),
    annualAccrualHours: minutesToHours(bucket.accrualAmountMinutes),
    accrualFrequency: bucket.accrualFrequency,
    hoursWorkedPerWeek: bucket.hoursWorkedPerWeek,
    maxBalanceHours: bucket.maxBalanceMinutes != null ? String(minutesToHours(bucket.maxBalanceMinutes)) : "",
    nextAccrualDate: toDateInputValue(bucket.nextAccrualDate),
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl">Policy settings</h1>
      <p className="mt-2 text-ink-600">
        Update your PTO policy. Changing your balance here resets the baseline your projections are
        calculated from.
      </p>
      <Card className="mt-6">
        <PolicyForm defaults={defaults} submitLabel="Save changes" />
      </Card>
    </div>
  );
}
