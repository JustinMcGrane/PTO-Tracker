import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseUser } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/marketing/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your PTO Tracker account.",
  robots: { index: false },
};

export default async function LoginPage() {
  const user = await getSupabaseUser();
  if (user) redirect("/dashboard");

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl">Log in</h1>
        <Card>
          <LoginForm />
        </Card>
        <p className="mt-6 text-center text-sm text-ink-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-700 hover:text-brand-800">
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  );
}
