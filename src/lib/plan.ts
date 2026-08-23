import type { Subscription } from "@prisma/client";

export const PREMIUM_PRICE = {
  monthly: 5,
  annual: 40,
};

export function isPremium(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return subscription.tier === "PREMIUM" && (subscription.status === "ACTIVE" || subscription.status === "TRIALING");
}
