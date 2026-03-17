import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Automadic — Premium Agent Skills for Claude Code, Cursor & Codex",
  description: "Ship faster with battle-tested agent skills. Lead gen, CRM automation, social media, SEO, billing — premium skills for serious builders.",
  keywords: "agent skills, Claude Code, Cursor, Codex, AI automation, lead generation, CRM",
  openGraph: {
    title: "Automadic — Premium Agent Skills",
    description: "Ship faster with battle-tested agent skills for Claude Code, Cursor & Codex.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#06060c] text-white`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
