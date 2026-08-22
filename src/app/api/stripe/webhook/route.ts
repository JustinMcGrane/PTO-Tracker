import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { track } from "@/lib/analytics";

const STATUS_MAP: Record<Stripe.Subscription.Status, "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" | "UNPAID"> = {
  active: "ACTIVE",
  trialing: "TRIALING",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  incomplete: "INCOMPLETE",
  incomplete_expired: "CANCELED",
  unpaid: "UNPAID",
  paused: "CANCELED",
};

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      if (userId && subscriptionId) {
        const priceId = await syncSubscription(userId, subscriptionId);
        track({ name: "subscription_created", plan: priceId === STRIPE_PRICE_IDS.annual ? "annual" : "monthly" });
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const stripeSub = event.data.object as Stripe.Subscription;
      const userId = stripeSub.metadata?.userId;
      const existing = userId
        ? null
        : await prisma.subscription.findFirst({ where: { stripeCustomerId: stripeSub.customer as string } });
      const resolvedUserId = userId ?? existing?.userId;
      if (resolvedUserId) {
        await syncSubscription(resolvedUserId, stripeSub.id, stripeSub);
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function syncSubscription(
  userId: string,
  stripeSubscriptionId: string,
  preloaded?: Stripe.Subscription
): Promise<string | undefined> {
  const stripeSub = preloaded ?? (await stripe.subscriptions.retrieve(stripeSubscriptionId));
  const status = STATUS_MAP[stripeSub.status];
  const priceId = stripeSub.items.data[0]?.price.id;
  const currentPeriodEnd = stripeSub.items.data[0]?.current_period_end
    ? new Date(stripeSub.items.data[0].current_period_end * 1000)
    : null;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      tier: status === "ACTIVE" || status === "TRIALING" ? "PREMIUM" : "FREE",
      status,
      stripeCustomerId: stripeSub.customer as string,
      stripeSubscriptionId: stripeSub.id,
      stripePriceId: priceId,
      currentPeriodEnd,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    },
    create: {
      userId,
      tier: status === "ACTIVE" || status === "TRIALING" ? "PREMIUM" : "FREE",
      status,
      stripeCustomerId: stripeSub.customer as string,
      stripeSubscriptionId: stripeSub.id,
      stripePriceId: priceId,
      currentPeriodEnd,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    },
  });

  return priceId;
}
