import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SoftwareAppJsonLd } from "@/components/seo/SoftwareAppJsonLd";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const TOOLS = [
  {
    href: "/pto-calculator",
    title: "PTO Calculator",
    description: "Convert PTO hours to days and see exactly how much time off you have available.",
  },
  {
    href: "/pto-accrual-calculator",
    title: "PTO Accrual Calculator",
    description: "Project your PTO balance on any future date based on how quickly it accrues.",
  },
  {
    href: "/pto-payout-calculator",
    title: "PTO Payout Calculator",
    description: "Estimate what your unused PTO could be worth if it were paid out in cash.",
  },
];

export default function HomePage() {
  return (
    <>
      <SoftwareAppJsonLd />
      <section className="border-b border-ink-200 bg-gradient-to-b from-brand-50/60 to-white">
        <Container className="py-20 text-center sm:py-28">
          <h1 className="mx-auto max-w-2xl text-4xl sm:text-5xl">
            Know exactly how much PTO you have.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-600">
            Calculate your PTO, see how quickly it accrues, and know exactly how much time off
            you&apos;ll have before your next trip.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/pto-calculator" size="lg">
              Calculate My PTO
            </ButtonLink>
            <ButtonLink href="/signup" size="lg" variant="secondary">
              Track My PTO
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl sm:text-3xl">Three free calculators, no account needed</h2>
            <p className="mt-3 text-ink-600">
              Every calculator runs instantly in your browser. Save your results with a free
              account when you&apos;re ready.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <h3 className="text-lg text-ink-900">{tool.title}</h3>
                  <p className="mt-2 text-sm text-ink-600">{tool.description}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-brand-700">
                    Open calculator →
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-ink-200 bg-ink-50 py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl sm:text-3xl">Then track it automatically</h2>
            <p className="mt-4 text-ink-600">
              Create a free account and PTO Tracker keeps your balance current for you — no more
              spreadsheets or guessing. See your next accrual date, your projected balance in 30,
              90 days, or year-end, and a simple timeline of how your PTO builds up over time.
            </p>
            <ul className="mt-6 space-y-3 text-ink-700">
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span> Plan vacations and see your balance before
                and after
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span> Check your projected balance on any future
                date
              </li>
              <li className="flex gap-2">
                <span className="text-brand-600">✓</span> Log PTO earned, used, and adjustments in one
                place
              </li>
            </ul>
            <div className="mt-8">
              <ButtonLink href="/signup">Create your free account</ButtonLink>
            </div>
          </div>

          <Card className="bg-white">
            <p className="text-sm font-medium text-ink-500">Current PTO Balance</p>
            <p className="mt-1 text-4xl font-semibold text-ink-900">72.5 hours</p>
            <p className="text-ink-600">9.1 days</p>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-200 pt-6 text-sm">
              <div>
                <p className="text-ink-500">Next accrual</p>
                <p className="font-medium text-ink-900">+4.6 hrs on Sep 5</p>
              </div>
              <div>
                <p className="text-ink-500">In 90 days</p>
                <p className="font-medium text-ink-900">~91.2 hrs</p>
              </div>
              <div>
                <p className="text-ink-500">Year-end estimate</p>
                <p className="font-medium text-ink-900">~112 hrs</p>
              </div>
              <div>
                <p className="text-ink-500">Upcoming vacation</p>
                <p className="font-medium text-ink-900">40 hrs reserved</p>
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
