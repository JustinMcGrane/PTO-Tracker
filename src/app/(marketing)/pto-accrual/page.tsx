import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const title = "PTO Accrual Policies Explained";
const description =
  "An overview of common PTO accrual policy types — accrual-based, lump-sum, unlimited, and rollover rules — and what each means for your balance.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pto-accrual" },
  openGraph: { title, description, url: "/pto-accrual" },
};

export default function PtoAccrualPage() {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">PTO Accrual Policies</h1>
        <p className="mt-3 text-lg text-ink-600">
          Not every employer handles PTO the same way. Here are the policy types you&apos;re most
          likely to run into, and what each one means for how your balance behaves.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl">Accrual-based PTO</h2>
            <p className="mt-3 text-ink-600">
              The most common model. You earn a portion of your annual allowance each pay period,
              so your balance grows gradually over the year rather than arriving all at once. See{" "}
              <Link
                href="/how-does-pto-accrual-work"
                className="font-medium text-brand-700 hover:text-brand-800"
              >
                how PTO accrual works
              </Link>{" "}
              for the mechanics.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Lump-sum (front-loaded) PTO</h2>
            <p className="mt-3 text-ink-600">
              Your full annual allowance is credited at the start of the year (or on your work
              anniversary). This gives you access to all your time off immediately, but if you
              leave partway through the year, some employers prorate what you&apos;re entitled to
              keep.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Unlimited PTO</h2>
            <p className="mt-3 text-ink-600">
              There&apos;s no fixed balance to track — you take time off as needed, subject to
              manager approval and team norms. Because there&apos;s no accrued balance, there&apos;s
              usually nothing to pay out when you leave. Unlimited policies don&apos;t fit the
              balance-tracking model this site is built around, but the payout and general
              calculators can still be useful for context.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Rollover and &quot;use it or lose it&quot;</h2>
            <p className="mt-3 text-ink-600">
              At year-end, policies differ on what happens to unused PTO: it might roll over fully,
              roll over up to a cap, get paid out, or be forfeited (&quot;use it or lose it&quot;)
              where that&apos;s legally permitted. Check your handbook — this materially affects how
              much PTO planning ahead is worth.
            </p>
          </section>

          <section>
            <h2 className="text-xl">Balance caps</h2>
            <p className="mt-3 text-ink-600">
              Many accrual-based policies stop adding new PTO once you hit a maximum balance, until
              you use some and drop back below it. If your policy has a cap, make sure to account
              for it — the accrual calculator supports entering one.
            </p>
          </section>
        </div>

        <div className="mt-10 rounded-xl border border-ink-200 bg-ink-50 p-6 text-center">
          <h2 className="text-lg">Project your own accrual-based balance</h2>
          <div className="mt-4">
            <ButtonLink href="/pto-accrual-calculator" size="sm">
              Open the accrual calculator
            </ButtonLink>
          </div>
        </div>
      </article>
    </Container>
  );
}
