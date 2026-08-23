import Link from "next/link";
import { Container } from "@/components/ui/Container";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Calculators",
    links: [
      { href: "/pto-calculator", label: "PTO Calculator" },
      { href: "/pto-accrual-calculator", label: "PTO Accrual Calculator" },
      { href: "/pto-payout-calculator", label: "PTO Payout Calculator" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/how-to-calculate-pto", label: "How to Calculate PTO" },
      { href: "/how-does-pto-accrual-work", label: "How PTO Accrual Works" },
      { href: "/pto-hours-to-days", label: "PTO Hours to Days" },
      { href: "/pto-payout", label: "PTO Payout" },
      { href: "/pto-accrual", label: "PTO Accrual" },
    ],
  },
  {
    title: "Product",
    links: [
      { href: "/pto-tracker", label: "PTO Tracker" },
      { href: "/signup", label: "Sign up" },
      { href: "/login", label: "Log in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold text-ink-900">PTO Tracker</p>
          <p className="mt-2 max-w-xs text-sm text-ink-600">
            Know exactly how much paid time off you have — today and on any future date.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold text-ink-900">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-600 hover:text-ink-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="border-t border-ink-200 py-6">
        <p className="text-xs text-ink-500">
          © {new Date().getFullYear()} PTO Tracker. Calculators are provided for informational
          purposes only and are not legal, financial, or HR advice.
        </p>
      </Container>
    </footer>
  );
}
