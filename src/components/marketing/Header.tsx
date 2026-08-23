import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const TOOL_LINKS = [
  { href: "/pto-calculator", label: "PTO Calculator" },
  { href: "/pto-accrual-calculator", label: "Accrual Calculator" },
  { href: "/pto-payout-calculator", label: "Payout Calculator" },
];

// Intentionally not auth-aware: checking session state here would force
// every marketing/calculator page into dynamic rendering (or ship extra
// client JS) just to decide which nav link to show. Logged-in visitors who
// click "Log in" land on a login page that redirects them straight to the
// dashboard if they already have a session.
export function Header() {
  return (
    <header className="border-b border-ink-200 bg-white">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-ink-900">
          PTO Tracker
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {TOOL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-600 hover:text-ink-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-ink-600 hover:text-ink-900">
            Log in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Sign up
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
