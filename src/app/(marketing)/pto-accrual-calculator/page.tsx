import type { Metadata } from "next";
import Link from "next/link";
import { AccrualCalculator } from "@/components/calculators/AccrualCalculator";
import { Container } from "@/components/ui/Container";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

const title = "PTO Accrual Calculator — Project Your Paid Time Off Balance";
const description =
  "Calculate exactly how much PTO you'll have accrued by any date. Supports weekly, biweekly, semimonthly, monthly, annual, and per-hour-worked accrual schedules.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pto-accrual-calculator" },
  openGraph: { title, description, url: "/pto-accrual-calculator" },
};

const faqs = [
  {
    question: "What is PTO accrual?",
    answer:
      "PTO accrual is the gradual accumulation of paid time off over a pay period, rather than receiving your full annual allowance all at once. Most employers accrue PTO weekly, biweekly, semimonthly, or monthly.",
  },
  {
    question: "How is PTO accrual calculated?",
    answer:
      "Take your total annual PTO allowance and divide it by the number of pay periods in a year — 52 for weekly, 26 for biweekly, 24 for semimonthly, 12 for monthly. That gives you the amount earned per period, which then adds up over time from your employment start date.",
  },
  {
    question: "What if my employer caps my PTO balance?",
    answer:
      "Many employers set a maximum balance, after which further accrual stops until you use some PTO. Enter that cap in the calculator's 'maximum PTO balance' field and projections will respect it.",
  },
  {
    question: "What does 'per hour worked' accrual mean?",
    answer:
      "Some employers, especially for part-time or hourly roles, grant PTO based on hours actually worked rather than a fixed schedule. This calculator converts your annual PTO target into an hourly accrual rate based on your typical hours worked per week.",
  },
];

export default function AccrualCalculatorPage() {
  return (
    <Container className="py-12 sm:py-16">
      <FaqJsonLd faqs={faqs} />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl">PTO Accrual Calculator</h1>
        <p className="mt-3 text-lg text-ink-600">
          See exactly how much PTO you&apos;ll have on any future date — accounting for your accrual
          rate, frequency, and any balance cap.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <AccrualCalculator />
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-8">
        <section>
          <h2 className="text-xl">How PTO accrual works</h2>
          <p className="mt-3 text-ink-600">
            Instead of granting your full annual PTO allowance on day one, most employers add a
            portion of it to your balance each pay period. If you&apos;re granted 120 hours a year
            and paid biweekly, you accrue roughly 4.6 hours (120 ÷ 26) every two weeks. Your balance
            grows steadily from your employment start date, capped at any maximum your employer
            sets.
          </p>
        </section>

        <section>
          <h2 className="text-xl">Supported accrual frequencies</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-600">
            <li>
              <strong>Weekly</strong> — 52 accrual events per year
            </li>
            <li>
              <strong>Biweekly</strong> — every 2 weeks, 26 events per year
            </li>
            <li>
              <strong>Semimonthly</strong> — twice a month (1st and 15th), 24 events per year
            </li>
            <li>
              <strong>Monthly</strong> — 12 events per year
            </li>
            <li>
              <strong>Annually</strong> — a single grant once a year
            </li>
            <li>
              <strong>Per hour worked</strong> — accrual tied to hours actually worked, common for
              hourly and part-time roles
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl">Frequently asked questions</h2>
          <dl className="mt-3 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium text-ink-900">{faq.question}</dt>
                <dd className="mt-1 text-ink-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-ink-200 bg-ink-50 p-6">
          <h2 className="text-lg">Planning a specific vacation?</h2>
          <p className="mt-2 text-ink-600">
            Create a free account to save this accrual policy, plan vacations against your
            projected balance, and get an updated PTO forecast automatically — no need to
            recalculate by hand. See also the{" "}
            <Link href="/pto-payout-calculator" className="font-medium text-brand-700 hover:text-brand-800">
              PTO payout calculator
            </Link>{" "}
            if you&apos;re estimating the cash value of unused time off.
          </p>
        </section>
      </div>
    </Container>
  );
}
