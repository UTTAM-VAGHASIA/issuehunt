import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { GhostCards } from "@/components/landing/GhostCards";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-[680px] items-center justify-between px-6 py-8">
        <div className="flex items-center gap-2">
          <Sparkles size={22} className="text-accent" fill="#F97316" />
          <h1 className="text-xl font-medium tracking-tight text-text-primary font-sans">
            issuehunt
          </h1>
        </div>

        {user ? (
          <Link
            href="/mode"
            className="flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-colors hover:bg-accent/90"
          >
            Go to App
          </Link>
        ) : (
          <a
            href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=github&redirect_to=${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback`}
            className="flex items-center justify-center rounded-lg bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-[#1a1a28]"
          >
            Sign in with GitHub
          </a>
        )}
      </header>

      {/* Main content */}
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
