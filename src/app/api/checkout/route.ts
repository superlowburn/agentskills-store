import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

// Skill product config — replace price IDs once created in Stripe dashboard
const SKILL_PRICES: Record<string, { name: string; price: number }> = {
  "lead-gen": { name: "Lead Gen & CRM Automation Skill", price: 900 },
  "social": { name: "Social Media Pipeline Skill", price: 1400 },
  "seo": { name: "SEO Audit & Optimization Skill", price: 900 },
  "billing": { name: "Invoice & Billing Automation Skill", price: 900 },
  "support": { name: "Customer Support Triage Skill", price: 900 },
  "bundle": { name: "All Skills Bundle", price: 4900 },
};

export async function POST(req: NextRequest) {
  try {
    const { skillId } = await req.json();

    const skill = SKILL_PRICES[skillId];
    if (!skill) {
      return NextResponse.json({ error: "Invalid skill ID" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: skill.name,
              description: `Monthly subscription to ${skill.name} — cancel anytime.`,
              metadata: { skillId },
            },
            unit_amount: skill.price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata: { skillId },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
