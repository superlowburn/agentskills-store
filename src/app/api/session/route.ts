import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const skillId = session.metadata?.skillId || "bundle";
    return NextResponse.json({ skillId, status: session.payment_status });
  } catch (err) {
    console.error("Session fetch error:", err);
    return NextResponse.json({ skillId: "bundle" });
  }
}
