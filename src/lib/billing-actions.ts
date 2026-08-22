"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { track } from "@/lib/analytics";

export async function startCheckout(plan: "monthly" | "annual") {
  const user = await requireUser();
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });

  let customerId = subscription?.stripeCustomerId ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    customerId = customer.id;
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: { stripeCustomerId: customerId },
      create: { userId: user.id, stripeCustomerId: customerId, tier: "FREE", status: "ACTIVE" },
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_IDS[plan], quantity: 1 }],
    success_url: `${siteUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${siteUrl}/dashboard/billing?checkout=cancelled`,
    client_reference_id: user.id,
    metadata: { userId: user.id },
  });

  track({ name: "premium_checkout_started", plan });

  if (!session.url) throw new Error("Stripe did not return a checkout URL.");
  redirect(session.url);
}

export async function openBillingPortal() {
  const user = await requireUser();
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (!subscription?.stripeCustomerId) {
    redirect("/dashboard/billing");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${siteUrl}/dashboard/billing`,
  });
  redirect(portalSession.url);
}
