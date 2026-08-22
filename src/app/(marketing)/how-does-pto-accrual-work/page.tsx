import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";

const title = "How Does PTO Accrual Work?";
const description =
  "A plain-English explanation of how PTO accrual works: pay-period schedules, per-hour-worked accrual, balance caps, and how it all adds up over the year.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/how-does-pto-accrual-work" },
  openGraph: { title, description, url: "/how-does-pto-accrual-work" },
};

const faqs = [
  {
    question: "Does PTO accrue while I'm on leave?",
    answer:
      "It depends on your employer's policy and, in some places, local law. Many employers pause PTO accrual during unpaid leave but continue it during paid leave. Check your handbook for specifics.",
  },
  {
    question: "What happens to unused accrued PTO at year-end?",
    answer:
      "This also varies: some employers let it roll over (sometimes up to a cap), some pay it out, and some use a 'use it or lose it' policy where unused time is forfeited, where legally permitted.",
  },
];

export default function HowAccrualWorksPage() {
  return (
    <Container className="py-12 sm:py-16">
      <FaqJsonLd faqs={faqs} />
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">How Does PTO Accrual Work?</h1>
        <p className="mt-3 text-lg text-ink-600">
          PTO accrual is simply the gradual buildup of your paid time off balance over the year,
          instead of getting it all in one lump sum.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl">The basic idea</h2>
            <p className="mt-3 text-ink-600">
              Your employer sets an annual PTO allowance — say, 120 hours a year. Rather than
              crediting all 120 hours on day one, most companies add a fraction of it to your
              balance every pay period, so your available time off grows steadily as the year
              goes on.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Common accrual schedules</h2>
            <p className="mt-3 text-ink-600">
              How often you accrue depends on your employer&apos;s payroll schedule and policy:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-600">
              <li>
                <strong>Weekly</strong> — a small amount added every week (52 times a year)
              </li>
              <li>
                <strong>Biweekly</strong> — added every two weeks (26 times a year), common with
                biweekly paychecks
              </li>
              <li>
                <strong>Semimonthly</strong> — added twice a month, typically the 1st and 15th (24
                times a year)
              </li>
              <li>
                <strong>Monthly</strong> — added once a month (12 times a year)
              </li>
              <li>
                <strong>Annually</strong> — the full allowance granted once a year
              </li>
              <li>
                <strong>Per hour worked</strong> — a small amount of PTO earned for every hour on
                the clock, common for hourly and part-time employees
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl">Accrual caps</h2>
            <p className="mt-3 text-ink-600">
              Many policies set a maximum balance — once you hit it, you stop accruing more PTO
              until you use some and drop back below the cap. This encourages people to actually
              take time off rather than banking it indefinitely.
            </p>
          </section>

          <section>
            <h2 className="text-xl">A worked example</h2>
            <p className="mt-3 text-ink-600">
              Say you&apos;re granted 104 hours a year (13 days), accrued biweekly, with no starting
              balance. That&apos;s 104 ÷ 26 = 4 hours added every two weeks. After 6 months (about
              13 pay periods), you&apos;d have roughly 52 hours — about 6.5 days — assuming
              you haven&apos;t used any yet.
            </p>
          </section>
        </div>

        <div className="mt-10 rounded-xl border border-ink-200 bg-ink-50 p-6 text-center">
          <h2 className="text-lg">See your own accrual, projected forward</h2>
          <p className="mt-2 text-ink-600">
            Enter your policy details and get an exact projection for any future date.
          </p>
          <div className="mt-4">
            <ButtonLink href="/pto-accrual-calculator" size="sm">
              Open the accrual calculator
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
          For more on policy types and rollover rules, see{" "}
          <Link href="/pto-accrual" className="font-medium text-brand-700 hover:text-brand-800">
            PTO accrual policies explained
          </Link>
          .
        </p>
      </article>
    </Container>
  );
}
