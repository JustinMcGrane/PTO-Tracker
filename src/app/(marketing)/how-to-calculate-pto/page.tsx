import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const title = "How to Calculate PTO (Step by Step)";
const description =
  "A step-by-step guide to calculating your paid time off balance by hand, including accrual, usage, and what to do if your employer caps your balance.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/how-to-calculate-pto" },
  openGraph: { title, description, url: "/how-to-calculate-pto" },
};

export default function HowToCalculatePtoPage() {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">How to Calculate PTO</h1>
        <p className="mt-3 text-lg text-ink-600">
          Whether you&apos;re checking your current balance or estimating what you&apos;ll have
          before a trip, calculating PTO comes down to three numbers: what you&apos;ve earned, what
          you&apos;ve used, and any cap your employer sets.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl">Step 1: Find your annual PTO allowance</h2>
            <p className="mt-3 text-ink-600">
              This is the total PTO your employer grants per year, usually stated in your offer
              letter, employee handbook, or HR portal — for example, &quot;15 days&quot; or
              &quot;120 hours.&quot; If it&apos;s in days, convert it to hours by multiplying by your
              standard workday length (8 hours is typical).
            </p>
          </section>

          <section>
            <h2 className="text-xl">Step 2: Figure out how it accrues</h2>
            <p className="mt-3 text-ink-600">
              Most employers don&apos;t give you the full allowance on January 1st — it accrues
              gradually over the year, added to your balance each pay period. Divide your annual
              allowance by the number of pay periods in a year to get your per-period accrual:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-600">
              <li>Weekly pay: annual hours ÷ 52</li>
              <li>Biweekly pay: annual hours ÷ 26</li>
              <li>Semimonthly pay: annual hours ÷ 24</li>
              <li>Monthly pay: annual hours ÷ 12</li>
            </ul>
            <p className="mt-3 text-ink-600">
              Some employers grant the full amount at once each year instead, and some — often for
              hourly or part-time roles — accrue PTO based on hours actually worked rather than a
              fixed schedule.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Step 3: Add up what you&apos;ve accrued so far</h2>
            <p className="mt-3 text-ink-600">
              Multiply your per-period accrual by the number of pay periods that have passed since
              your employment start date (or since your balance was last reset). Add that to any
              starting balance you had.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Step 4: Subtract what you&apos;ve used</h2>
            <p className="mt-3 text-ink-600">
              Subtract any PTO hours you&apos;ve already taken. What&apos;s left is your current
              available balance.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Step 5: Check for a maximum balance</h2>
            <p className="mt-3 text-ink-600">
              Many employers cap how much PTO you can bank at once. If your running total exceeds
              that cap, your actual balance stops at the maximum until you use some PTO and free up
              room to accrue more.
            </p>
          </section>
        </div>

        <div className="mt-10 rounded-xl border border-ink-200 bg-ink-50 p-6 text-center">
          <h2 className="text-lg">Skip the math</h2>
          <p className="mt-2 text-ink-600">
            The PTO calculator does all five steps for you, instantly.
          </p>
          <div className="mt-4">
            <ButtonLink href="/pto-calculator" size="sm">
              Open the PTO calculator
            </ButtonLink>
          </div>
        </div>

        <p className="mt-8 text-sm text-ink-600">
          Want to project your balance further into the future, or plan a specific vacation around
          it? See the{" "}
          <Link href="/pto-accrual-calculator" className="font-medium text-brand-700 hover:text-brand-800">
            PTO accrual calculator
          </Link>{" "}
          or{" "}
          <Link href="/signup" className="font-medium text-brand-700 hover:text-brand-800">
            create a free account
          </Link>{" "}
          to track it automatically.
        </p>
      </article>
    </Container>
  );
}
