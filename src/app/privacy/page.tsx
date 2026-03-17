import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Automadic",
  description: "Privacy Policy for Automadic agent skills and MCP integrations.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#06060c] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/50 text-sm mb-10">Last updated: March 17, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
          <p className="text-white/70 leading-relaxed">
            Automadic (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates automadic.ai and provides agent
            skills and MCP integrations for AI coding tools including Claude Code, Cursor, and Codex.
            This policy describes how we collect, use, and protect your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
          <ul className="text-white/70 leading-relaxed space-y-2 list-disc list-inside">
            <li><strong>Account data:</strong> Email address used to create your Automadic account.</li>
            <li><strong>OAuth tokens:</strong> Third-party API tokens (e.g., Jobber access tokens) stored encrypted to enable MCP integrations. These are never shared with third parties.</li>
            <li><strong>Usage data:</strong> Anonymized usage metrics (tool call counts, error rates) to improve reliability. No content of your requests is logged.</li>
            <li><strong>Billing data:</strong> Payment information processed by Stripe. We store only the last 4 digits of your card and billing email.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. MCP Integration Data</h2>
          <p className="text-white/70 leading-relaxed">
            When you connect a third-party service (e.g., Jobber) to our MCP server, we store
            OAuth credentials necessary to fulfil API requests on your behalf. Your business data
            (clients, jobs, invoices, quotes) is fetched in real-time and returned directly to your
            AI agent — it is not stored, indexed, or retained on our servers beyond the duration
            of the API request.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. How We Use Your Information</h2>
          <ul className="text-white/70 leading-relaxed space-y-2 list-disc list-inside">
            <li>Provide and operate our MCP server and skills services</li>
            <li>Authenticate API requests using your stored OAuth tokens</li>
            <li>Send transactional emails (account creation, billing receipts)</li>
            <li>Improve service reliability using aggregated, anonymized usage data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. Data Sharing</h2>
          <p className="text-white/70 leading-relaxed">
            We do not sell, rent, or share your personal information or API credentials with
            third parties, except as required by law or as necessary to operate our services
            (e.g., Cloudflare for hosting, Stripe for payment processing).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Data Retention</h2>
          <p className="text-white/70 leading-relaxed">
            Account and OAuth data is retained until you delete your account or revoke access.
            You may request deletion at any time by emailing privacy@automadic.ai.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. Security</h2>
          <p className="text-white/70 leading-relaxed">
            All data is stored encrypted at rest using Cloudflare D1 with AES-256 encryption.
            All connections are secured with HTTPS/TLS. OAuth tokens are never exposed in logs
            or error messages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>
          <p className="text-white/70 leading-relaxed">
            You have the right to access, correct, or delete your personal data at any time.
            To exercise these rights, contact us at privacy@automadic.ai.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
          <p className="text-white/70 leading-relaxed">
            Questions about this policy? Email us at{" "}
            <a href="mailto:privacy@automadic.ai" className="text-orange-400 hover:underline">
              privacy@automadic.ai
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
