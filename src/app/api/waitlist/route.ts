import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

// Use /tmp for Vercel serverless compatibility (writable at runtime)
const WAITLIST_FILE = join("/tmp", "waitlist.json");

interface WaitlistEntry {
  email: string;
  product: string;
  source: string;
  createdAt: string;
}

async function readWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const content = await readFile(WAITLIST_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function saveWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await mkdir("/tmp", { recursive: true });
  await writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { email, product, source } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entries = await readWaitlist();

    // Check for duplicate
    const existing = entries.find(
      (e) => e.email.toLowerCase() === email.toLowerCase() && e.product === product
    );
    if (existing) {
      return NextResponse.json({ message: "Already on the waitlist" });
    }

    entries.push({
      email: email.toLowerCase().trim(),
      product: product || "unknown",
      source: source || "direct",
      createdAt: new Date().toISOString(),
    });

    await saveWaitlist(entries);

    console.log(`Waitlist signup: ${email} for ${product}`);

    return NextResponse.json({ message: "Added to waitlist" });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Simple admin endpoint — in production, add auth
  const adminKey = req.nextUrl.searchParams.get("key");
  if (adminKey !== process.env.ADMIN_KEY && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await readWaitlist();
  return NextResponse.json({
    count: entries.length,
    entries,
    byProduct: entries.reduce(
      (acc, e) => {
        acc[e.product] = (acc[e.product] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  });
}
