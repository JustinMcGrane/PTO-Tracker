import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

const title = "PTO Payout: What It Is and How It Works";
const description =
  "What PTO payout means, when employers typically pay it, and how the dollar value is usually calculated. Informational only — not legal advice.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pto-payout" },
  openGraph: { title, description, url: "/pto-payout" },
};

const faqs = [
  {
    question: "Do I get paid for unused PTO when I quit?",
    answer:
      "In some places, yes — certain U.S. states legally treat accrued PTO as earned wages that must be paid out upon separation. In others, it's entirely up to your employer's written policy. Review your employee handbook or contact your HR department to find out what applies to you.",
  },
  {
    question: "Is PTO payout the same as severance?",
    answer:
      "No. PTO payout is the cash value of time off you already earned but didn't use. Severance is a separate, typically discretionary payment tied to the end of employment.",
  },
];

export default function PtoPayoutPage() {
  return (
    <Container className="py-12 sm:py-16">
      <FaqJsonLd faqs={faqs} />
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">PTO Payout</h1>
        <p className="mt-3 text-lg text-ink-600">
          PTO payout is when unused, accrued paid time off is converted into a cash payment instead
          of being taken as time away from work.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl">When does PTO payout happen?</h2>
            <p className="mt-3 text-ink-600">
              The most common trigger is leaving a job — voluntarily or otherwise — with unused PTO
              still on the books. Some employers also offer payout options during employment, like
              an annual &quot;cash out&quot; window for PTO above a certain balance.
            </p>
          </section>

          <section>
            <h2 className="text-xl">How is it calculated?</h2>
            <p className="mt-3 text-ink-600">
              The typical formula is straightforward: unused PTO hours × your hourly rate. If
              you&apos;re salaried, your effective hourly rate is usually your annual salary divided
              by your total working hours in a year (weekly hours × 52).
            </p>
          </section>

          <section>
            <h2 className="text-xl">Is PTO payout required by law?</h2>
            <p className="mt-3 text-ink-600">
              This varies significantly by location and isn&apos;t something a calculator can tell
              you definitively. In the United States, some states (like California) treat accrued
              PTO as earned wages that must be paid out, while others leave it entirely to employer
              policy. Outside the U.S., rules differ by country. This page is informational only —
              for a definitive answer, check your employee handbook, your offer letter, or a local
              employment attorney.
            </p>
          </section>
        </div>

        <div className="mt-10 rounded-xl border border-ink-200 bg-ink-50 p-6 text-center">
          <h2 className="text-lg">Estimate your payout value</h2>
          <p className="mt-2 text-ink-600">
            Enter your PTO balance and rate to see an estimated gross payout amount.
          </p>
          <div className="mt-4">
            <ButtonLink href="/pto-payout-calculator" size="sm">
              Open the payout calculator
            </ButtonLink>
          </div>
        </div>

        <section className="mt-10">
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

        <p className="mt-8 text-sm text-ink-600">
          Not sure how much PTO you have to work with? Start with the{" "}
          <Link href="/pto-calculator" className="font-medium text-brand-700 hover:text-brand-800">
            PTO calculator
          </Link>
          .
        </p>
      </article>
    </Container>
  );
}
