import type { Subscription } from "@prisma/client";

export const FREE_PLAN_LIMITS = {
  maxPolicies: 1,
  maxBuckets: 1,
  maxVacations: 2,
};

export const PREMIUM_PRICE = {
  monthly: 2.99,
  annual: 24,
};

export function isPremium(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.tier === "PREMIUM" && (subscription.status === "ACTIVE" || subscription.status === "TRIALING");
}
