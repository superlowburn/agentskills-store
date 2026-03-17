import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const ALLOWED_FILES = new Set([
  "lead-gen.md",
  "social-media.md",
  "seo-content-agent.md",
  "invoice-billing.md",
  "customer-support.md",
]);

// Verify the session is paid and active
async function verifySession(sessionId: string): Promise<boolean> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === "paid";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");
  const sessionId = req.nextUrl.searchParams.get("session");

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 401 });
  }

  const valid = await verifySession(sessionId);
  if (!valid) {
    return NextResponse.json({ error: "Invalid or unpaid session" }, { status: 403 });
  }

  // Return the skill file content
  // Skills are stored in /public/skills/ directory
  const { readFile } = await import("fs/promises");
  const { join } = await import("path");

  try {
    const skillPath = join(process.cwd(), "public", "skills", file);
    const content = await readFile(skillPath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${file}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Skill file not found" }, { status: 404 });
  }
}
