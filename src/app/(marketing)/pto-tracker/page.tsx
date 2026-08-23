import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PREMIUM_PRICE } from "@/lib/plan";

const title = "PTO Tracker — Track Your Paid Time Off Automatically";
const description =
  "Stop recalculating your PTO balance by hand. PTO Tracker keeps your balance, accrual, and vacation plans up to date automatically.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pto-tracker" },
  openGraph: { title, description, url: "/pto-tracker" },
};

const FEATURES = [
  {
    title: "Live balance, always current",
    description:
      "Your PTO balance updates automatically based on your accrual rate — no more re-running the math every time you want to check.",
  },
  {
    title: "Plan vacations with confidence",
    description:
      "See your projected balance before and after any trip you're planning, accounting for PTO you'll earn between now and then.",
  },
  {
    title: "Check any future date",
    description:
      "Curious what your balance will look like in three months, or on a specific date next year? Get an instant projection.",
  },
  {
    title: "A simple activity log",
    description:
      "Record PTO earned, used, or adjusted, with a date and note, so you always know where a change in your balance came from.",
  },
];

export default function PtoTrackerPage() {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">Why track your PTO?</h1>
        <p className="mt-3 text-lg text-ink-600">
          A calculator gives you a snapshot. A tracker keeps that snapshot accurate — automatically
          — as time passes, PTO accrues, and you take vacations.
        </p>

        <section className="mt-10">
          <h2 className="text-xl">The problem with spreadsheets and mental math</h2>
          <p className="mt-3 text-ink-600">
            Most people either guess at their PTO balance or dig through pay stubs and re-run the
            math each time they want to plan a trip. That works until the numbers get stale — a
            forgotten accrual, a vacation you didn&apos;t account for, or a policy detail you
            misremembered. A tracker removes the guesswork by keeping your policy, your accrual
            rate, and your usage in one place.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl">What PTO Tracker does</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <h3 className="text-base text-ink-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl">Simple pricing</h2>
          <p className="mt-3 text-ink-600">
            ${PREMIUM_PRICE.monthly} a month (or ${PREMIUM_PRICE.annual} a year) gets you everything:
            unlimited vacation planning, multiple PTO categories like sick and personal time, full
            history, and export. No separate free tier to outgrow — just one plan.
          </p>
        </section>

        <div className="mt-10 rounded-xl border border-ink-200 bg-ink-50 p-6 text-center">
          <h2 className="text-lg">Start tracking your PTO</h2>
          <p className="mt-2 text-ink-600">Cancel anytime.</p>
          <div className="mt-4">
            <ButtonLink href="/signup" size="sm">
              Subscribe — ${PREMIUM_PRICE.monthly}/mo
            </ButtonLink>
          </div>
        </div>
      </article>
    </Container>
  );
}
