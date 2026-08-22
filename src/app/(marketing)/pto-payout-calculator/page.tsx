import type { Metadata } from "next";
import Link from "next/link";
import { PayoutCalculator } from "@/components/calculators/PayoutCalculator";
import { Container } from "@/components/ui/Container";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

const title = "PTO Payout Calculator — Estimate the Cash Value of Unused Time Off";
const description =
  "Estimate how much your unused PTO could be worth in cash. Enter your hourly rate or salary to calculate an estimated gross PTO payout.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pto-payout-calculator" },
  openGraph: { title, description, url: "/pto-payout-calculator" },
};

const faqs = [
  {
    question: "Is my employer required to pay out unused PTO?",
    answer:
      "It depends. Some U.S. states treat accrued PTO as earned wages that must be paid out at termination, while others leave it up to the employer's policy. Outside the U.S., rules vary by country. This calculator estimates a dollar value only — check your employee handbook or local labor law for whether payout is required.",
  },
  {
    question: "How is PTO payout calculated?",
    answer:
      "Generally, PTO payout = unused PTO hours × your hourly rate. If you're salaried, your hourly rate is estimated by dividing your annual salary by your total working hours in a year (weekly hours × 52).",
  },
  {
    question: "Is this payout amount before or after taxes?",
    answer:
      "The estimate shown is a gross amount, before taxes and any other withholdings. Your actual payout will likely be lower after standard payroll deductions.",
  },
];

export default function PayoutCalculatorPage() {
  return (
    <Container className="py-12 sm:py-16">
      <FaqJsonLd faqs={faqs} />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl">PTO Payout Calculator</h1>
        <p className="mt-3 text-lg text-ink-600">
          Estimate how much your unused PTO could be worth if it were paid out in cash.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <PayoutCalculator />
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-8">
        <section>
          <h2 className="text-xl">How PTO payout works</h2>
          <p className="mt-3 text-ink-600">
            PTO payout is the cash value of unused paid time off, typically paid when you leave a
            job (and, at some employers, on request or year-end). The math is straightforward —
            hours multiplied by your hourly rate — but{" "}
            <strong>whether it&apos;s required at all depends on your employer&apos;s policy and
            your jurisdiction</strong>. This tool gives you an estimate so you know roughly what to
            expect; it is not legal or tax advice.
          </p>
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
          <h2 className="text-lg">Not sure how many PTO hours you have?</h2>
          <p className="mt-2 text-ink-600">
            Use the{" "}
            <Link href="/pto-calculator" className="font-medium text-brand-700 hover:text-brand-800">
              PTO calculator
            </Link>{" "}
            to work out your current balance first, or the{" "}
            <Link href="/pto-accrual-calculator" className="font-medium text-brand-700 hover:text-brand-800">
              accrual calculator
            </Link>{" "}
            to project it forward.
          </p>
        </section>
      </div>
    </Container>
  );
}
