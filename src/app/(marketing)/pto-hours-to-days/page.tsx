import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const title = "PTO Hours to Days Conversion Chart";
const description =
  "Convert PTO hours to days (and back) with a quick reference chart for 8-hour and other workday lengths.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/pto-hours-to-days" },
  openGraph: { title, description, url: "/pto-hours-to-days" },
};

const ROWS_8H = [4, 8, 16, 20, 24, 32, 40, 60, 80, 120, 160];

export default function PtoHoursToDaysPage() {
  return (
    <Container className="py-12 sm:py-16">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">PTO Hours to Days</h1>
        <p className="mt-3 text-lg text-ink-600">
          PTO is often tracked in hours behind the scenes but talked about in days. Here&apos;s how
          to convert between the two.
        </p>

        <section className="mt-10">
          <h2 className="text-xl">The formula</h2>
          <p className="mt-3 text-ink-600">
            Divide your PTO hours by the number of hours in your standard workday:
          </p>
          <p className="mt-3 rounded-lg bg-ink-50 p-4 text-center font-mono text-sm text-ink-800">
            PTO days = PTO hours ÷ hours per workday
          </p>
          <p className="mt-3 text-ink-600">
            To go the other way, multiply days by your hours-per-day figure. Most full-time roles
            use an 8-hour day, but part-time schedules or compressed workweeks (like four 10-hour
            days) will differ — use whatever matches your actual schedule.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl">Quick reference (8-hour workday)</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-ink-200">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-ink-700">
                <tr>
                  <th className="px-4 py-2 font-medium">PTO hours</th>
                  <th className="px-4 py-2 font-medium">PTO days</th>
                </tr>
              </thead>
              <tbody>
                {ROWS_8H.map((hours, i) => (
                  <tr key={hours} className={i > 0 ? "border-t border-ink-200" : ""}>
                    <td className="px-4 py-2 text-ink-900">{hours}</td>
                    <td className="px-4 py-2 text-ink-900">{(hours / 8).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-10 rounded-xl border border-ink-200 bg-ink-50 p-6 text-center">
          <h2 className="text-lg">Use your own hours-per-day</h2>
          <p className="mt-2 text-ink-600">
            The PTO calculator lets you set a custom workday length if 8 hours doesn&apos;t match
            your schedule.
          </p>
          <div className="mt-4">
            <ButtonLink href="/pto-calculator" size="sm">
              Open the PTO calculator
            </ButtonLink>
          </div>
        </div>
      </article>
    </Container>
  );
}
