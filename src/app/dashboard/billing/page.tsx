import { requireUser } from "@/lib/auth";
import { getSubscription } from "@/lib/pto/queries";
import { isPremium, PREMIUM_PRICE } from "@/lib/plan";
import { startCheckout, openBillingPortal } from "@/lib/billing-actions";
import { formatDate } from "@/lib/pto/format";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const PREMIUM_FEATURES = [
  "Unlimited vacation planning",
  "Unlimited PTO projections",
  "Multiple PTO buckets (vacation, sick, personal, floating holiday)",
  "Full PTO history and CSV export",
  "Advanced year-end projections",
];

export default async function BillingPage() {
  const user = await requireUser();
  const subscription = await getSubscription(user.id);
  const premium = isPremium(subscription);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl">Billing</h1>
        <p className="mt-1 text-ink-600">
          You&apos;re currently on the <strong>{premium ? "Premium" : "Free"}</strong> plan.
        </p>
      </div>

      {premium ? (
        <Card>
          <h2 className="text-lg text-ink-900">Premium plan</h2>
          {subscription?.currentPeriodEnd && (
            <p className="mt-1 text-sm text-ink-600">
              {subscription.cancelAtPeriodEnd ? "Ends" : "Renews"} on{" "}
              {formatDate(subscription.currentPeriodEnd)}
            </p>
          )}
          <form action={openBillingPortal} className="mt-4">
            <Button type="submit" variant="secondary">
              Manage billing
            </Button>
          </form>
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
                Upgrade monthly
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
                Upgrade annually
              </Button>
            </form>
          </Card>
        </div>
      )}

      <Card>
        <h2 className="text-lg text-ink-900">What&apos;s included in Premium</h2>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          {PREMIUM_FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-brand-600">✓</span> {feature}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
