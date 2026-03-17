"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function DoneContent() {
  const params = useSearchParams();
  const apiKey = params.get("key") ?? "";
  const mcpUrl = apiKey ? `https://automadic.ai/mcp/jobber/${apiKey}` : "";

  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    if (!mcpUrl) return;
    await navigator.clipboard.writeText(mcpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-[#06060c] flex items-center justify-center px-4">
        <div className="bg-[#0e0e18] border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-white font-bold text-xl mb-2">Something went wrong</h1>
          <p className="text-white/50 text-sm mb-4">
            No API key found. Please try connecting again.
          </p>
          <a
            href="/connect"
            className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
          >
            Try again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06060c] flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Jobber connected!
          </h1>
          <p className="text-white/50 text-base">
            Your MCP URL is ready. Paste it into Claude Desktop and start talking to your Jobber.
          </p>
        </div>

        {/* MCP URL card */}
        <div className="bg-[#0e0e18] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm font-medium">Your MCP URL</span>
            <span className="text-xs text-white/30 font-mono">Keep this private</span>
          </div>

          <div className="flex items-center gap-2">
            <code className="flex-1 bg-black/40 rounded-xl px-4 py-3 text-emerald-400 text-xs font-mono break-all leading-relaxed">
              {mcpUrl}
            </code>
            <button
              onClick={copyUrl}
              className={`shrink-0 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                copied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              }`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Setup instructions */}
        <div className="bg-[#0e0e18] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">
            Add to Claude Desktop in 2 steps
          </h2>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="text-white/80 text-sm mb-2">
                  Open <strong>Claude Desktop</strong> → Settings → Developer → Edit Config
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm mb-2">
                  Add this to your <code className="text-orange-300 bg-black/30 px-1 rounded text-xs">claude_desktop_config.json</code>:
                </p>
                <pre className="bg-black/40 rounded-xl p-4 text-xs text-white/70 font-mono overflow-x-auto whitespace-pre-wrap break-all">
{`{
  "mcpServers": {
    "jobber": {
      "url": "${mcpUrl}"
    }
  }
}`}
                </pre>
              </div>
            </li>
          </ol>

          <div className="mt-4 bg-orange-500/8 border border-orange-500/20 rounded-xl p-3">
            <p className="text-orange-300/80 text-xs leading-relaxed">
              After saving, restart Claude Desktop. Then ask:{" "}
              <em>&ldquo;What jobs do we have scheduled today?&rdquo;</em>
            </p>
          </div>
        </div>

        {/* What you can do */}
        <div className="bg-[#0e0e18] border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-3">What you can ask Claude now</h2>
          <ul className="space-y-2">
            {[
              "Show me all overdue invoices",
              "Send invoices to everyone from last week",
              "What jobs do we have this week?",
              "Draft a quote for a furnace replacement",
              "Get outstanding balance for John Smith",
            ].map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-orange-400 mt-0.5">→</span>
                <span>&ldquo;{q}&rdquo;</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <a href="/jobber" className="hover:text-white/60 transition-colors">
            Back to Jobber MCP
          </a>
          <span>
            Questions?{" "}
            <a
              href="mailto:support@automadic.ai"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              support@automadic.ai
            </a>
          </span>
          <a href="/connect" className="hover:text-white/60 transition-colors">
            Connect another account
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DonePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#06060c] flex items-center justify-center">
          <div className="text-white/40 text-sm">Loading…</div>
        </div>
      }
    >
      <DoneContent />
    </Suspense>
  );
}
