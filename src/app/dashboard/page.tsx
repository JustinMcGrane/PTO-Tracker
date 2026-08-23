import { requireActiveSubscription } from "@/lib/auth";
import { bucketToAccrualConfig, listVacations, requirePolicyWithBucket } from "@/lib/pto/queries";
import {
  accrualPerPeriodMinutes,
  estimateNextAccrualDate,
  minutesToHours,
  perHourWorkedRateMinutes,
  projectBalanceSeries,
  projectBalanceWithVacations,
} from "@/lib/pto/calculations";
import { formatBalanceSummary, formatDate } from "@/lib/pto/format";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { BalanceTimelineChart } from "@/components/dashboard/BalanceTimelineChart";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireActiveSubscription();
  const { policy, bucket } = await requirePolicyWithBucket(user.id);
  const vacations = await listVacations(user.id);

  const config = bucketToAccrualConfig(bucket, policy.hoursPerDayMinutes);
  const vacationImpacts = vacations.map((v) => ({
    startDate: v.startDate,
    hoursRequiredMinutes: v.hoursRequiredMinutes,
  }));

  const now = new Date();
  const currentBalanceMinutes = projectBalanceWithVacations(config, now, vacationImpacts);
  const in30Minutes = projectBalanceWithVacations(config, addDays(now, 30), vacationImpacts);
  const in90Minutes = projectBalanceWithVacations(config, addDays(now, 90), vacationImpacts);
  const yearEnd = new Date(Date.UTC(now.getUTCFullYear(), 11, 31));
  const yearEndMinutes = projectBalanceWithVacations(config, yearEnd, vacationImpacts);

  const nextAccrual = bucket.nextAccrualDate ?? estimateNextAccrualDate(config, now);
  const perPeriodMinutes =
    config.frequency === "PER_HOUR_WORKED"
      ? null
      : accrualPerPeriodMinutes(config.annualAccrualMinutes, config.frequency);
  const perHourMinutes =
    config.frequency === "PER_HOUR_WORKED"
      ? perHourWorkedRateMinutes(config.annualAccrualMinutes, config.hoursWorkedPerWeek)
      : null;

  const series = projectBalanceSeries(config, now, addDays(now, 365), 30, vacationImpacts).map((p) => ({
    date: formatShort(p.date),
    hours: Number(minutesToHours(p.balanceMinutes).toFixed(1)),
  }));

  const balance = formatBalanceSummary(currentBalanceMinutes, config.hoursPerDayMinutes);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl">{policy.name}</h1>
        <ButtonLink href="/dashboard/settings" variant="secondary" size="sm">
          Edit policy
        </ButtonLink>
      </div>

      <Card className="bg-brand-50">
        <p className="text-sm font-medium text-brand-800">Current PTO Balance</p>
        <p className="mt-1 text-5xl font-semibold text-brand-900">{balance.hours} hours</p>
        <p className="mt-1 text-lg text-brand-700">{balance.days} days</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Next accrual"
          value={nextAccrual ? formatDate(nextAccrual) : "Varies"}
          sub={
            perPeriodMinutes != null
              ? `+${minutesToHours(perPeriodMinutes).toFixed(1)} hrs`
              : perHourMinutes != null
                ? `+${minutesToHours(perHourMinutes).toFixed(2)} hrs / hour worked`
                : undefined
          }
        />
        <Stat label="In 30 days" value={`${minutesToHours(in30Minutes).toFixed(1)} hrs`} />
        <Stat label="In 90 days" value={`${minutesToHours(in90Minutes).toFixed(1)} hrs`} />
        <Stat label="Year-end estimate" value={`${minutesToHours(yearEndMinutes).toFixed(1)} hrs`} />
      </div>

      <Card>
        <h2 className="text-lg text-ink-900">Projected balance over the next year</h2>
        <p className="mt-1 text-sm text-ink-600">Accounts for accrual and any planned vacations.</p>
        <div className="mt-4">
          <BalanceTimelineChart data={series} />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/dashboard/vacations" title="Plan a vacation" description="See your balance before and after a trip." />
        <QuickLink href="/dashboard/future" title="Check a future date" description="Project your balance on any date you choose." />
        <QuickLink href="/dashboard/activity" title="Log activity" description="Record PTO earned, used, or adjusted." />
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink-900">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-ink-600">{sub}</p>}
    </Card>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <h3 className="text-base text-ink-900">{title}</h3>
        <p className="mt-1 text-sm text-ink-600">{description}</p>
      </Card>
    </Link>
  );
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

function formatShort(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}
