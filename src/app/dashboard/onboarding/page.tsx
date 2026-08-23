import { redirect } from "next/navigation";
import { requireActiveSubscription } from "@/lib/auth";
import { getPrimaryPolicy } from "@/lib/pto/queries";
import { Card } from "@/components/ui/Card";
import { PolicyForm } from "@/components/dashboard/PolicyForm";

export default async function OnboardingPage() {
  const user = await requireActiveSubscription();
  const existing = await getPrimaryPolicy(user.id);
  if (existing) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl">Set up your PTO policy</h1>
      <p className="mt-2 text-ink-600">
        Tell us how your PTO works and we&apos;ll keep your balance and projections up to date
        automatically.
      </p>
      <Card className="mt-6">
        <PolicyForm redirectOnSuccess="/dashboard" />
      </Card>
    </div>
  );
}
