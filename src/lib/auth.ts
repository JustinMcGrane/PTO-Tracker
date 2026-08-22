import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { User as DbUser } from "@prisma/client";

/**
 * Returns the signed-in Supabase user, or null. Does not touch the database
 * — use `getCurrentUser` when you need the app-side User row too.
 */
export async function getSupabaseUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Returns the app-side User row for the signed-in Supabase user, creating
 * it on first sign-in (Supabase owns the auth record; this table owns PTO
 * data and is keyed by the same id).
 */
export async function getCurrentUser(): Promise<DbUser | null> {
  const supabaseUser = await getSupabaseUser();
  if (!supabaseUser || !supabaseUser.email) return null;

  return prisma.user.upsert({
    where: { id: supabaseUser.id },
    update: { email: supabaseUser.email },
    create: { id: supabaseUser.id, email: supabaseUser.email },
  });
}

/** Use in server components/actions that require auth; redirects otherwise. */
export async function requireUser(): Promise<DbUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
