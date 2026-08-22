import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen bg-ink-50">
      <DashboardNav />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
