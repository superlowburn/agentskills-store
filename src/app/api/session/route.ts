import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";


export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const skillId = session.metadata?.skillId || "bundle";
    return NextResponse.json({ skillId, status: session.payment_status });
  } catch (err) {
    console.error("Session fetch error:", err);
    return NextResponse.json({ skillId: "bundle" });
  }
}
