"use client";

import { useState, FormEvent } from "react";

// The MCP worker handles /auth/jobber/start — it lives on the same domain
// so we just redirect the form there directly (no CORS needed).
const AUTH_START_URL = "/auth/jobber/start";

export default function ConnectPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    // Redirect to the MCP worker's OAuth start endpoint
    window.location.href = `${AUTH_START_URL}?email=${encodeURIComponent(email.trim().toLowerCase())}`;
  }

  return (
    <div className="min-h-screen bg-[#06060c] flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">🔧</span>
            <span className="text-white font-bold text-xl">Automadic</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Connect your Jobber account
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            Enter your email to get started. We&apos;ll link your Jobber account
            and give you a URL to paste into Claude Desktop.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-[#0e0e18] border border-white/10 rounded-2xl p-8">
          {/* Steps */}
          <div className="flex items-start gap-3 mb-8">
            {[
              { n: "1", label: "Enter your email" },
              { n: "2", label: "Authorize Jobber" },
              { n: "3", label: "Get your MCP URL" },
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0
                      ? "bg-orange-500 text-white"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {step.n}
                </div>
                <span className={`text-xs ${i === 0 ? "text-white/80" : "text-white/30"}`}>
                  {step.label}
                </span>
                {i < 2 && (
                  <div className="absolute hidden" />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/70 mb-2"
              >
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-orange-500/50 transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={submitted || !email.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all"
            >
              {submitted ? "Redirecting to Jobber…" : "Continue to Jobber →"}
            </button>
          </form>

          <p className="text-white/25 text-xs text-center mt-4 leading-relaxed">
            You&apos;ll be redirected to Jobber to authorize access.
            Your Jobber credentials are never stored on our servers.
          </p>
        </div>

        {/* Security note */}
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/30">
          {[
            "OAuth 2.0 secure",
            "Tokens encrypted at rest",
            "Revoke anytime from Jobber",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {item}
            </span>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Need help?{" "}
          <a
            href="mailto:support@automadic.ai"
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            support@automadic.ai
          </a>
        </p>
      </div>
    </div>
  );
}
