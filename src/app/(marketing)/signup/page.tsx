import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseUser } from "@/lib/auth";
import { PREMIUM_PRICE } from "@/lib/plan";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SignupForm } from "@/components/marketing/SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a PTO Tracker account to track your PTO balance automatically.",
  robots: { index: false },
};

export default async function SignupPage() {
  const user = await getSupabaseUser();
  if (user) redirect("/dashboard");

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl">Track your PTO</h1>
        <p className="mb-6 text-center text-sm text-ink-600">
          ${PREMIUM_PRICE.monthly}/month or ${PREMIUM_PRICE.annual}/year. Cancel anytime.
        </p>
        <Card>
          <SignupForm />
        </Card>
        <p className="mt-6 text-center text-sm text-ink-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:text-brand-800">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
