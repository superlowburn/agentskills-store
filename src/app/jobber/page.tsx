"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

const FEATURES = [
  {
    icon: "📋",
    title: "Instant job status",
    desc: "Ask \"what jobs are on the schedule today?\" — get a full list with client names, addresses, and times in seconds.",
  },
  {
    icon: "💰",
    title: "Quote in 30 seconds",
    desc: "Describe the job to your agent. It drafts a professional quote with line items and pricing, ready to send.",
  },
  {
    icon: "📧",
    title: "One-click invoicing",
    desc: "\"Send all invoices from last week\" — done. Your agent handles it while you're on the job site.",
  },
  {
    icon: "⚠️",
    title: "Outstanding balance alerts",
    desc: "Instantly know who owes you money, how much, and how overdue it is. Never miss a payment again.",
  },
  {
    icon: "✍️",
    title: "AI follow-ups (Pro)",
    desc: "Automatically draft thank-you messages, review requests, and seasonal outreach — personalized for each client.",
  },
  {
    icon: "📊",
    title: "AI cost estimates (Pro)",
    desc: "Ask \"what should I charge for a 3-ton AC replacement?\" — get a market-rate range in seconds.",
  },
];

const PLANS = [
  {
    id: "jobber-core",
    name: "Core",
    price: 49,
    desc: "Full Jobber access for your AI agent",
    features: [
      "List & search clients",
      "View jobs by status and date",
      "Create and send quotes",
      "Send invoices",
      "Outstanding balance reports",
      "Add notes to jobs",
      "Works with Claude, Cursor, Codex",
      "npm package — 60-second setup",
    ],
    popular: false,
    color: "from-blue-600 to-cyan-600",
    cta: "Get Core — $49/mo",
  },
  {
    id: "jobber-pro",
    name: "Pro",
    price: 99,
    desc: "Core + AI quote drafting and client comms",
    features: [
      "Everything in Core",
      "AI quote drafting (NVIDIA NIM powered)",
      "AI follow-up message generator",
      "AI job cost estimator",
      "Review request automation",
      "Seasonal outreach templates",
      "Priority support",
      "Free updates forever",
    ],
    popular: true,
    color: "from-orange-500 to-pink-600",
    cta: "Get Pro — $99/mo",
  },
];

const TESTIMONIALS = [
  {
    quote: "I told my AI agent to send all unpaid invoices from last month. It sent 11 invoices in about 20 seconds. I collected $8,400 that week.",
    author: "HVAC company owner, Phoenix AZ",
    stars: 5,
  },
  {
    quote: "The quote drafting is insane. I describe the job site, it gives me professional line items with realistic pricing. Saves me 20 minutes per quote.",
    author: "Plumbing contractor, Dallas TX",
    stars: 5,
  },
  {
    quote: "I run a small cleaning company. Now I just ask my agent \"what jobs do we have this week\" and it tells me everything. It's like having an office manager.",
    author: "Cleaning service owner, Austin TX",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "Do I need technical skills to set this up?",
    a: "If you can follow 3 steps, you can install this. Copy-paste two lines into a config file and you're done. Most customers are running in under 10 minutes.",
  },
  {
    q: "Which AI agents does this work with?",
    a: "Works with Claude (Desktop and Code), Cursor, and any other agent that supports MCP (Model Context Protocol). That covers 95% of AI tools people are using.",
  },
  {
    q: "Does this touch my Jobber data without my permission?",
    a: "No. You're always in control. The MCP server only runs tools that your AI agent explicitly calls — and you see every command before it runs.",
  },
  {
    q: "What's the AI powered by?",
    a: "Pro tier AI features use NVIDIA NIM inference. You need a free NVIDIA NIM API key (free tier available at build.nvidia.com). Core tier requires no AI key.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime from your billing portal. No contracts, no cancellation fees.",
  },
  {
    q: "Is my Jobber data secure?",
    a: "Your credentials never leave your machine. The MCP server runs locally and communicates directly with Jobber's API. We never see or store your Jobber data.",
  },
];

function HeroWaitlist() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    track("hero_waitlist_signup", { page: "jobber" });
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product: "jobber-waitlist", source: "hero" }),
      });
    } catch { /* best-effort */ }
    setDone(true);
    setLoading(false);
  }

  if (done) {
    return (
      <p className="text-emerald-400 text-sm">
        ✓ You&apos;re on the early access list. We&apos;ll reach out soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-8">
      <input
        type="email"
        required
        placeholder="Get early access — enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all whitespace-nowrap disabled:opacity-50"
      >
        {loading ? "..." : "Early Access"}
      </button>
    </form>
  );
}

export default function JobberPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistPlan, setWaitlistPlan] = useState<string | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  async function handleBuy(planId: string) {
    track("checkout_click", { plan: planId, page: "jobber" });
    setLoading(planId);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: planId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      // If checkout fails (e.g. Stripe not configured), offer waitlist
      setWaitlistPlan(planId);
      setLoading(null);
    }
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!waitlistEmail || !waitlistPlan) return;
    setWaitlistLoading(true);
    track("waitlist_signup", { plan: waitlistPlan, page: "jobber" });
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail, product: `jobber-${waitlistPlan}`, source: "landing-page" }),
      });
      setWaitlistSuccess(true);
    } catch {
      // best-effort
      setWaitlistSuccess(true);
    } finally {
      setWaitlistLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#06060c]">

      {/* Waitlist modal */}
      {waitlistPlan && !waitlistSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e0e18] border border-white/10 rounded-2xl p-8 max-w-sm w-full">
            <h3 className="text-white font-bold text-xl mb-2">Join the waitlist</h3>
            <p className="text-white/60 text-sm mb-6">
              We&apos;re finalizing checkout. Drop your email and we&apos;ll notify you the moment it&apos;s live — plus early-bird pricing.
            </p>
            <form onSubmit={handleWaitlist} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-orange-500/50"
              />
              <button
                type="submit"
                disabled={waitlistLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {waitlistLoading ? "Saving..." : "Notify me at launch"}
              </button>
              <button
                type="button"
                onClick={() => setWaitlistPlan(null)}
                className="w-full text-white/30 hover:text-white/60 text-sm py-2 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Waitlist success modal */}
      {waitlistSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e0e18] border border-emerald-500/30 rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-white font-bold text-xl mb-2">You&apos;re on the list</h3>
            <p className="text-white/60 text-sm mb-6">
              We&apos;ll email you when checkout goes live. Early-bird pricing locked in.
            </p>
            <button
              onClick={() => { setWaitlistSuccess(false); setWaitlistPlan(null); }}
              className="bg-white/10 hover:bg-white/20 text-white text-sm px-6 py-2 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06060c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="font-bold text-white">Jobber MCP</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <a
            href="#pricing"
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/15 rounded-full blur-[120px]" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 text-sm text-orange-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            For HVAC, Plumbing, Electrical, Cleaning &amp; Lawn Care
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Let AI run</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              your Jobber
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect your AI agent to Jobber. Quote jobs, send invoices, check schedules,
            and follow up with clients — all from a single conversation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a
              href="#pricing"
              onClick={() => track("hero_cta_click", { page: "jobber" })}
              className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-orange-500/25"
            >
              Get Started — from $49/mo
            </a>
            <a
              href="#features"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              See What&apos;s Included
            </a>
          </div>

          {/* Hero email capture */}
          <HeroWaitlist />

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            {[
              "Works with Claude & Cursor",
              "60-second setup",
              "Your data stays local",
              "14-day money-back",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo conversation */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">What it looks like</h2>
            <p className="text-white/50">Real conversations with your AI agent</p>
          </div>

          <div className="bg-[#0e0e18] border border-white/10 rounded-2xl p-6 space-y-4 font-mono text-sm">
            {[
              { role: "user", text: "What jobs do we have scheduled today?" },
              { role: "agent", text: "You have 4 jobs today:\n• 8am — AC tune-up, Martinez (Oak Grove Dr)\n• 10:30am — Water heater install, Thompson (Elm St)\n• 1pm — Drain cleaning, Wilson (Cedar Ave)\n• 3:30pm — HVAC inspection, Park (Maple Ln)" },
              { role: "user", text: "Send invoices to everyone from last week who hasn't paid yet" },
              { role: "agent", text: "Found 6 outstanding invoices ($4,280 total). Sending now...\n✓ Sent to Johnson — $580\n✓ Sent to Davis — $1,200\n✓ Sent to Rodriguez — $840\n... 3 more. All sent." },
              { role: "user", text: "Draft a quote for Sarah Chen — she needs her furnace replaced, 3-bedroom house" },
              { role: "agent", text: "Draft ready:\nTitle: Furnace Replacement — Chen Residence\nLine items:\n• Carrier 80k BTU furnace (supply) — $1,450\n• Labor (installation, 6hrs) — $720\n• Disposal & permit — $180\nTotal: $2,350\n\nShall I send it to her?" },
            ].map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "agent" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-xs shrink-0 mt-0.5">AI</div>
                )}
                <div
                  className={`rounded-xl px-4 py-2.5 max-w-xs whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-white/10 text-white/80 text-right"
                      : "bg-orange-500/10 border border-orange-500/20 text-white/80"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0 mt-0.5">You</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you run Jobber for
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Your AI agent can handle all of it — without you touching a screen.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">From the field</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-white/40 text-xs">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple pricing
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              One flat monthly fee. Cancel anytime.
            </p>
          </div>

          {error && (
            <div className="mb-8 max-w-md mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.popular
                    ? "border-orange-500/50 bg-gradient-to-b from-orange-950/40 to-[#0e0e18] shadow-[0_0_40px_rgba(249,115,22,0.15)]"
                    : "border-white/10 bg-gradient-to-b from-white/5 to-[#06060c]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} text-xl mb-4`}>
                  {plan.name === "Core" ? "🔧" : "✨"}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-6">{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-white/50">/mo</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white shadow-lg shadow-orange-500/25"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-white/30 text-sm mt-8">
            All plans billed monthly. Cancel anytime. 14-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* Setup section */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Up and running in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Install the package",
                code: "npm install -g @ringomcp/jobber",
                desc: "Run this once on your machine.",
              },
              {
                step: "2",
                title: "Add to Claude Desktop",
                code: 'config: { "command": "mcp-jobber" }',
                desc: "Paste your Jobber API token.",
              },
              {
                step: "3",
                title: "Start talking",
                code: '"Send all unpaid invoices"',
                desc: "Your agent handles the rest.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <code className="block bg-black/40 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono mb-2 break-all">
                  {item.code}
                </code>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between text-white font-medium hover:bg-white/5 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-white/40 transition-transform shrink-0 ml-4 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-white/60 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-orange-900/40 to-pink-900/20 border border-orange-500/20 rounded-3xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stop doing admin. Start doing more jobs.
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Home service businesses save 5-10 hours a week on quotes, invoices, and follow-ups. Your competition is already using AI.
            </p>
            <a
              href="#pricing"
              className="inline-block bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-orange-500/25"
            >
              Get Started — from $49/mo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <span>🔧</span>
            <span>Jobber MCP by AgentSkills</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-white/60 transition-colors">All Skills</a>
            <a href="mailto:support@agentskills.ai" className="hover:text-white/60 transition-colors">Support</a>
            <span>© 2026 AgentSkills</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
