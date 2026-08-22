/**
 * Thin analytics event layer. No provider is wired up yet — events are
 * no-ops in production and logged in development — but every call site in
 * the app is already instrumented so a provider (PostHog, GA, etc.) can be
 * dropped into `track` later without touching call sites.
 */

export type AnalyticsEvent =
  | { name: "calculator_viewed"; calculator: "pto" | "accrual" | "payout" }
  | { name: "calculator_completed"; calculator: "pto" | "accrual" | "payout" }
  | { name: "signup_completed" }
  | { name: "vacation_created"; hoursRequired: number }
  | { name: "premium_checkout_started"; plan: "monthly" | "annual" }
  | { name: "subscription_created"; plan: "monthly" | "annual" };

export function track(event: AnalyticsEvent) {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", event.name, event);
  }
  // Provider hook goes here, e.g.: window.posthog?.capture(event.name, event);
}
