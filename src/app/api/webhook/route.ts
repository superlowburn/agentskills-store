import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const skillId = session.metadata?.skillId;
    const customerEmail = session.customer_details?.email;

    console.log(`New subscription: skill=${skillId} email=${customerEmail} session=${session.id}`);

    // TODO: send welcome email with license key + download link
    // For now, success page handles key generation from session_id
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    console.log(`Subscription cancelled: ${sub.id}`);
    // TODO: revoke license key
  }

  return NextResponse.json({ received: true });
}
