"use client";

import { useState } from "react";

const SKILLS = [
  {
    id: "lead-gen",
    icon: "⚡",
    name: "Lead Gen & CRM Automation",
    tagline: "Turn your agent into a sales machine",
    description:
      "Scrape and enrich leads from LinkedIn, Apollo, and custom sources. Auto-qualify by ICP criteria. Push to HubSpot or Pipedrive. Generate personalized outreach drafts in seconds.",
    features: [
      "Multi-source lead scraping (LinkedIn, Apollo, web)",
      "ICP scoring & auto-qualification",
      "HubSpot & Pipedrive sync",
      "Personalized outreach generation",
      "Engagement tracking dashboard",
    ],
    price: 9,
    popular: false,
    color: "from-violet-600 to-purple-600",
    badge: null,
  },
  {
    id: "bundle",
    icon: "🚀",
    name: "All Skills Bundle",
    tagline: "Everything. One price.",
    description:
      "Get all 5 premium agent skills — Lead Gen, Social Media Pipeline, SEO Audit, Invoice Automation, and Support Triage — plus every skill we ship in the next 12 months.",
    features: [
      "All 5 current premium skills",
      "All future skills included free",
      "Priority support via GitHub",
      "Exclusive bundle-only prompts",
      "Commercial use license",
    ],
    price: 49,
    popular: true,
    color: "from-orange-500 to-pink-600",
    badge: "Most Popular",
  },
  {
    id: "social",
    icon: "📣",
    name: "Social Media Pipeline",
    tagline: "Content at agent speed",
    description:
      "Turn any URL, transcript, or idea into a full week of social content. Repurpose to LinkedIn, Twitter/X, and Instagram in one command. Schedules posts via Buffer API.",
    features: [
      "Weekly/monthly content calendar generation",
      "Platform-native posts for LinkedIn, X & Instagram",
      "Hashtag research & tiered optimization",
      "Long-form to multi-platform repurposing",
      "Buffer API scheduling + engagement analytics",
    ],
    price: 14,
    popular: false,
    color: "from-cyan-500 to-blue-600",
    badge: "New",
  },
  {
    id: "seo",
    icon: "🎯",
    name: "SEO Audit & Optimization",
    tagline: "Rank faster with agent power",
    description:
      "Full technical SEO audit in seconds. Keyword gap analysis, competitor research, content brief generation. Auto-creates optimized meta tags and structured data.",
    features: [
      "230+ rule technical audit",
      "Keyword gap & competitor analysis",
      "AI content brief generation",
      "Meta tag & schema auto-writer",
      "Backlink opportunity finder",
    ],
    price: 9,
    popular: false,
    color: "from-emerald-500 to-teal-600",
    badge: null,
  },
  {
    id: "billing",
    icon: "💳",
    name: "Invoice & Billing Automation",
    tagline: "Get paid without the admin",
    description:
      "Generate, send, and follow up on invoices from natural language. Syncs with QuickBooks, Xero, and Stripe. Chases overdue payments automatically.",
    features: [
      "Invoice generation from plain English",
      "QuickBooks & Xero sync",
      "Automated payment reminders",
      "Revenue reporting & forecasting",
      "Multi-currency support",
    ],
    price: 9,
    popular: false,
    color: "from-yellow-500 to-orange-500",
    badge: null,
  },
  {
    id: "support",
    icon: "🎧",
    name: "Customer Support Triage",
    tagline: "Zero-latency support at scale",
    description:
      "Classify, prioritize, and draft responses to support tickets in milliseconds. Integrates with Zendesk, Intercom, and Linear. Escalates edge cases to humans.",
    features: [
      "Ticket classification & priority scoring",
      "Zendesk, Intercom & Linear integration",
      "AI-drafted responses (review before send)",
      "Sentiment analysis & churn detection",
      "Weekly insights reports",
    ],
    price: 9,
    popular: false,
    color: "from-rose-500 to-red-600",
    badge: null,
  },
];

const FAQS = [
  {
    q: "What are agent skills?",
    a: "Agent skills are reusable prompt files (SKILL.md) that give your AI coding agent — Claude Code, Cursor, or Codex — specialized capabilities. You install them once and invoke them by name. Think of them as superpowers for your agent.",
  },
  {
    q: "Which agents do these work with?",
    a: "All skills are tested with Claude Code, Cursor, and Codex. They work with any agent that supports markdown-based skill/rules files.",
  },
  {
    q: "How do I install a skill?",
    a: "After purchase, you receive a license key and a download link. Drop the .md file into your agent's skills directory (usually ~/.claude/skills/ or .cursor/rules/). That's it — the skill is immediately available.",
  },
  {
    q: "Do I get updates?",
    a: "Yes. Your license key gives you access to all future versions of the skills you purchased. Bundle buyers get every new skill we ship, automatically.",
  },
  {
    q: "What's your refund policy?",
    a: "If a skill doesn't work with your setup within 14 days, we'll refund you, no questions asked. Email support with your order ID.",
  },
  {
    q: "Can I use these commercially?",
    a: "Yes. All purchases include a commercial use license. Use them in client projects, your own products, or anywhere else.",
  },
];

function PriceCard({
  skill,
  onBuy,
  loading,
}: {
  skill: (typeof SKILLS)[0];
  onBuy: (skillId: string) => void;
  loading: string | null;
}) {
  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 ${
        skill.popular
          ? "border-orange-500/50 bg-gradient-to-b from-orange-950/40 to-[#0e0e18] shadow-[0_0_40px_rgba(249,115,22,0.15)]"
          : "border-white/10 bg-gradient-to-b from-white/5 to-[#06060c] hover:border-white/20"
      } p-6 flex flex-col`}
    >
      {skill.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {skill.badge}
          </span>
        </div>
      )}

      <div className="mb-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} text-2xl mb-3`}>
          {skill.icon}
        </div>
        <h3 className="text-lg font-bold text-white">{skill.name}</h3>
        <p className="text-sm text-white/50 mt-1">{skill.tagline}</p>
      </div>

      <p className="text-sm text-white/70 mb-4 flex-1">{skill.description}</p>

      <ul className="space-y-2 mb-6">
        {skill.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-white/80">
            <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-bold text-white">${skill.price}</span>
          <span className="text-white/50">/mo</span>
        </div>

        <button
          onClick={() => onBuy(skill.id)}
          disabled={loading === skill.id}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            skill.popular
              ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white shadow-lg shadow-orange-500/25"
              : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading === skill.id ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Get ${skill.id === "bundle" ? "Bundle" : "Skill"} — $${skill.price}/mo`
          )}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleBuy(skillId: string) {
    setLoading(skillId);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#06060c]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06060c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-white">AgentSkills</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#skills" className="hover:text-white transition-colors">Skills</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <a
            href="#pricing"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px]" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Now shipping — 5 premium skills live
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-white">Give your agent</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              superpowers
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium skills for Claude Code, Cursor &amp; Codex. Drop one file, unlock
            professional-grade automation — social media pipelines, lead gen, SEO, billing, support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#pricing"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-violet-500/25"
            >
              Browse Skills — from $9/mo
            </a>
            <a
              href="#skills"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              See What&apos;s Included
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            {[
              "Claude Code compatible",
              "Cursor & Codex support",
              "14-day money back",
              "Commercial license",
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

      {/* How it works */}
      <section id="skills" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Install in 60 seconds
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              No configuration. No accounts. Just drop a file and your agent knows what to do.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Purchase & download",
                desc: "Buy a skill or the bundle. Instantly receive your license key and skill files.",
                icon: "💳",
              },
              {
                step: "02",
                title: "Drop into your agent",
                desc: "Copy the .md file to your skills folder. No config, no setup, no CLI commands.",
                icon: "📁",
              },
              {
                step: "03",
                title: "Invoke by name",
                desc: 'In Claude Code, just say "use lead-gen skill to find prospects for..." — done.',
                icon: "✨",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
              >
                <div className="text-5xl font-black text-white/5 absolute top-4 right-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              $9/mo per skill or $49/mo for everything — including every skill we ship this year.
            </p>
          </div>

          {error && (
            <div className="mb-8 max-w-md mx-auto bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map((skill) => (
              <PriceCard
                key={skill.id}
                skill={skill}
                onBuy={handleBuy}
                loading={loading}
              />
            ))}
          </div>

          <p className="text-center text-white/30 text-sm mt-8">
            All subscriptions billed monthly. Cancel anytime. 14-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently asked</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between text-white font-medium hover:bg-white/5 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-white/40 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-white/60 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-violet-900/40 to-purple-900/20 border border-violet-500/20 rounded-3xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to ship faster?
            </h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Join builders who are using agent skills to automate the boring stuff and focus on what matters.
            </p>
            <a
              href="#pricing"
              className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-violet-500/25"
            >
              Get Started — $9/mo
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span>AgentSkills</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="mailto:support@agentskills.ai" className="hover:text-white/60 transition-colors">
              Support
            </a>
            <span>© 2026 AgentSkills</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
