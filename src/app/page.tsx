import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { GhostCards } from "@/components/landing/GhostCards";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header — inline, not fixed */}
      <header className="mx-auto flex w-full max-w-[680px] items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-accent" fill="#F97316" />
          <h1 className="text-xl font-medium tracking-tight text-text-primary font-sans">
            issuehunt
          </h1>
        </div>
        <Link
          href="/mode"
          className="flex items-center justify-center rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-[#1a1a28]"
        >
          Sign in with GitHub
        </Link>
      </header>

      {/* Main content — GhostCards lives INSIDE here, at the bottom */}
      <main className="mx-auto flex w-full max-w-[680px] flex-1 flex-col items-center px-6 pt-16 text-center">
        <Hero />
        <GhostCards />
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-[680px] px-6 py-12 text-center font-mono text-[10px] text-text-muted uppercase tracking-widest">
        © 2026 IssueHunt. Built for the community.
      </footer>
    </div>
  );
}
