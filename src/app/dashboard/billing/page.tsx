import { requireUser } from "@/lib/auth";
import { getPrimaryPolicy, getSubscription } from "@/lib/pto/queries";
import { isPremium, PREMIUM_PRICE } from "@/lib/plan";
import { startCheckout, openBillingPortal } from "@/lib/billing-actions";
import { formatDate } from "@/lib/pto/format";
import { Card } from "@/components/ui/Card";
import { Button, ButtonLink } from "@/components/ui/Button";

const FEATURES = [
  "Unlimited vacation planning",
  "Unlimited PTO projections",
  "Multiple PTO buckets (vacation, sick, personal, floating holiday)",
  "Full PTO history and CSV export",
  "Advanced year-end projections",
];

export default async function BillingPage() {
  const user = await requireUser();
  const [subscription, policy] = await Promise.all([getSubscription(user.id), getPrimaryPolicy(user.id)]);
  const subscribed = isPremium(subscription);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl">Subscription</h1>
        <p className="mt-1 text-ink-600">
          {subscribed
            ? "You're subscribed — thanks for supporting PTO Tracker."
            : `Start tracking your PTO for $${PREMIUM_PRICE.monthly}/month or $${PREMIUM_PRICE.annual}/year.`}
        </p>
      </div>

      {subscribed ? (
        <Card>
          <h2 className="text-lg text-ink-900">Your subscription</h2>
          {subscription?.currentPeriodEnd && (
            <p className="mt-1 text-sm text-ink-600">
              {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"} on{" "}
              {formatDate(subscription.currentPeriodEnd)}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {!policy && (
              <ButtonLink href="/dashboard/onboarding" size="sm">
                Set up your PTO policy
              </ButtonLink>
            )}
            <form action={openBillingPortal}>
              <Button type="submit" variant="secondary" size="sm">
                Manage billing
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-sm font-medium text-ink-500">Monthly</p>
            <p className="mt-1 text-3xl font-semibold text-ink-900">
              ${PREMIUM_PRICE.monthly}
              <span className="text-base font-normal text-ink-500">/mo</span>
            </p>
            <form action={startCheckout.bind(null, "monthly")} className="mt-4">
              <Button type="submit" className="w-full">
                Subscribe monthly
              </Button>
            </form>
          </Card>
          <Card className="border-brand-300">
            <p className="text-sm font-medium text-brand-700">Annual · Save ~33%</p>
            <p className="mt-1 text-3xl font-semibold text-ink-900">
              ${PREMIUM_PRICE.annual}
              <span className="text-base font-normal text-ink-500">/yr</span>
            </p>
            <form action={startCheckout.bind(null, "annual")} className="mt-4">
              <Button type="submit" className="w-full">
                Subscribe annually
              </Button>
            </form>
          </Card>
        </div>
      )}

      <Card>
        <h2 className="text-lg text-ink-900">What&apos;s included</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-brand-600">✓</span> {feature}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
