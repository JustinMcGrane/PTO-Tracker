import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { signOut } from "@/lib/auth-actions";

const LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/vacations", label: "Vacations" },
  { href: "/dashboard/future", label: "Future PTO" },
  { href: "/dashboard/activity", label: "Activity" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/billing", label: "Billing" },
];

export function DashboardNav() {
  return (
    <header className="border-b border-ink-200 bg-white">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-ink-900">
          PTO Tracker
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink-600 hover:text-ink-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <form action={signOut}>
          <button type="submit" className="text-sm font-medium text-ink-500 hover:text-ink-900">
            Log out
          </button>
        </form>
      </Container>
      <div className="border-t border-ink-100 md:hidden">
        <Container className="flex gap-4 overflow-x-auto py-2 text-sm">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap font-medium text-ink-600">
              {link.label}
            </Link>
          ))}
        </Container>
      </div>
    </header>
  );
}
