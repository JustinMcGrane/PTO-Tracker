import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSupabaseUser } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SignupForm } from "@/components/marketing/SignupForm";

export const metadata: Metadata = {
  title: "Sign up free",
  description: "Create a free PTO Tracker account to save your PTO balance and track it automatically.",
  robots: { index: false },
};

export default async function SignupPage() {
  const user = await getSupabaseUser();
  if (user) redirect("/dashboard");

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl">Save your PTO</h1>
        <p className="mb-6 text-center text-sm text-ink-600">
          Free forever for one PTO policy and up to two planned vacations.
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
