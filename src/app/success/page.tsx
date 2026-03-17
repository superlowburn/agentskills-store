"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SKILL_FILES: Record<string, string[]> = {
  "lead-gen": ["lead-gen.md"],
  "social": ["social-media.md"],
  "seo": ["seo-content-agent.md"],
  "billing": ["invoice-billing.md"],
  "support": ["customer-support.md"],
  "bundle": ["lead-gen.md", "social-media.md", "seo-content-agent.md", "invoice-billing.md", "customer-support.md"],
};

const SKILL_NAMES: Record<string, string> = {
  "lead-gen": "Lead Gen & CRM Automation",
  "social": "Social Media Pipeline",
  "seo": "SEO Audit & Optimization",
  "billing": "Invoice & Billing Automation",
  "support": "Customer Support Triage",
  "bundle": "All Skills Bundle",
};

function deriveKey(sessionId: string): string {
  // Deterministic key from session ID — for MVP, the session ID IS the proof of payment
  // In production, replace with server-side key stored in DB
  const encoded = Buffer.from(sessionId).toString("base64").replace(/[+/=]/g, "").slice(0, 32).toUpperCase();
  return `AS-${encoded.slice(0, 8)}-${encoded.slice(8, 16)}-${encoded.slice(16, 24)}`;
}

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [skillId, setSkillId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    // Fetch the session to get the skillId
    fetch(`/api/session?id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        setSkillId(data.skillId || "bundle");
        setLoading(false);
      })
      .catch(() => {
        setSkillId("bundle");
        setLoading(false);
      });
  }, [sessionId]);

  const licenseKey = sessionId ? deriveKey(sessionId) : null;
  const files = skillId ? (SKILL_FILES[skillId] || []) : [];

  function copyKey() {
    if (licenseKey) {
      navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!sessionId) {
    return (
      <div className="text-center">
        <p className="text-white/60">No session found. <Link href="/" className="text-violet-400 underline">Go back home</Link>.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center">
        <svg className="animate-spin h-8 w-8 text-violet-400 mx-auto" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-white/40 mt-4 text-sm">Loading your order...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-4xl mb-6">
          ✓
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          You&apos;re all set!
        </h1>
        <p className="text-white/60 text-lg">
          {skillId ? `${SKILL_NAMES[skillId]} subscription activated.` : "Your subscription is active."}
        </p>
      </div>

      {/* License key */}
      {licenseKey && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-semibold">Your License Key</h2>
            <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">Save this</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-emerald-300 font-mono text-sm tracking-widest overflow-x-auto">
              {licenseKey}
            </code>
            <button
              onClick={copyKey}
              className="shrink-0 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm px-4 py-3 rounded-xl transition-all"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-white/30 text-xs mt-3">
            Keep this key safe. You&apos;ll need it to download updates and verify your subscription.
          </p>
        </div>
      )}

      {/* Download section */}
      {files.length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Download Your Skills</h2>
          <div className="space-y-3">
            {files.map((file) => (
              <a
                key={file}
                href={`/api/download?file=${file}&key=${licenseKey}&session=${sessionId}`}
                className="flex items-center gap-3 bg-black/20 hover:bg-black/40 border border-white/10 rounded-xl px-4 py-3 transition-all group"
              >
                <span className="text-violet-400 text-lg">📄</span>
                <span className="text-white/80 group-hover:text-white transition-colors font-mono text-sm flex-1">{file}</span>
                <span className="text-white/30 text-xs group-hover:text-violet-400 transition-colors">Download →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Install instructions */}
      <div className="bg-violet-500/5 border border-violet-500/20 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Install Instructions</h2>
        <div className="space-y-3 text-sm text-white/70">
          <div className="flex gap-3">
            <span className="text-violet-400 font-bold shrink-0">1.</span>
            <div>
              <p className="text-white/90 font-medium">Claude Code</p>
              <code className="text-white/50 font-mono text-xs block mt-1">
                cp *.md ~/.claude/skills/
              </code>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-violet-400 font-bold shrink-0">2.</span>
            <div>
              <p className="text-white/90 font-medium">Cursor</p>
              <code className="text-white/50 font-mono text-xs block mt-1">
                cp *.md .cursor/rules/
              </code>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-violet-400 font-bold shrink-0">3.</span>
            <div>
              <p className="text-white/90 font-medium">Invoke the skill</p>
              <code className="text-white/50 font-mono text-xs block mt-1">
                &ldquo;use lead-gen skill to find 50 leads in the SaaS space&rdquo;
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-white/30 text-sm mb-4">
          Questions? Email{" "}
          <a href="mailto:support@agentskills.ai" className="text-violet-400 hover:text-violet-300 transition-colors">
            support@agentskills.ai
          </a>
        </p>
        <Link
          href="/"
          className="text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          ← Back to AgentSkills
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#06060c] flex flex-col">
      <nav className="border-b border-white/5 bg-[#06060c]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="font-bold text-white">AgentSkills</span>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <Suspense fallback={
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-violet-400 mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
