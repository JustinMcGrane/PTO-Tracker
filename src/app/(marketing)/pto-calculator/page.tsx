import type { Metadata } from "next";
import Link from "next/link";
import { PtoCalculator } from "@/components/calculators/PtoCalculator";
import { Container } from "@/components/ui/Container";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

const title = "PTO Calculator — Convert PTO Hours to Days & See What You Have";
const description =
  "Free PTO calculator. Convert PTO hours to days, subtract time you've already used, and see exactly how much paid time off you have available.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pto-calculator" },
  openGraph: { title, description, url: "/pto-calculator" },
};

const faqs = [
  {
    question: "How do I convert PTO hours to days?",
    answer:
      "Divide your PTO hours by the number of hours in your standard workday. For an 8-hour day, 40 PTO hours equals 5 days. If your workday is longer or shorter than 8 hours, adjust the calculator's 'hours in a workday' field.",
  },
  {
    question: "What counts as 'available' PTO?",
    answer:
      "Available PTO is what you've earned so far minus what you've already used. It's different from your annual allowance, which is the total you're granted for the year regardless of how much you've taken.",
  },
  {
    question: "Does this calculator save my numbers?",
    answer:
      "No — this calculator runs entirely in your browser and nothing is saved unless you create a free account to track your PTO automatically.",
  },
];

export default function PtoCalculatorPage() {
  return (
    <Container className="py-12 sm:py-16">
      <FaqJsonLd faqs={faqs} />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl sm:text-4xl">PTO Calculator</h1>
        <p className="mt-3 text-lg text-ink-600">
          Convert PTO hours to days and see exactly how much paid time off you have available right
          now.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        <PtoCalculator />
      </div>

      <div className="mx-auto mt-16 max-w-2xl space-y-8">
        <section>
          <h2 className="text-xl">How this PTO calculator works</h2>
          <p className="mt-3 text-ink-600">
            Enter how many PTO hours you&apos;ve earned so far and how many you&apos;ve already used.
            The calculator subtracts the two and shows your available balance in both hours and
            workdays, using whatever hours-per-day figure matches your schedule (8 hours is the
            default for a standard full-time day).
          </p>
        </section>

        <section>
          <h2 className="text-xl">PTO hours to days, quick reference</h2>
          <p className="mt-3 text-ink-600">On an 8-hour workday:</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-600">
            <li>8 PTO hours = 1 day</li>
            <li>20 PTO hours = 2.5 days</li>
            <li>40 PTO hours = 5 days (one work week)</li>
            <li>80 PTO hours = 10 days (two work weeks)</li>
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
          <h2 className="text-lg">Want to know your balance on a future date?</h2>
          <p className="mt-2 text-ink-600">
            This calculator shows your PTO right now. To project your balance weeks or months from
            today — including accrual over time — try the{" "}
            <Link href="/pto-accrual-calculator" className="font-medium text-brand-700 hover:text-brand-800">
              PTO accrual calculator
            </Link>
            .
          </p>
        </section>
      </div>
    </Container>
  );
}
