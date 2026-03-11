"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Crosshair, Sprout, ChevronDown, Check } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { useUser } from "@/lib/hooks/useUser";
import { cn } from "@/lib/utils";

const ALL_LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Rust", "Go",
  "Java", "C++", "Ruby", "Swift", "Kotlin", "PHP", "C#", "Dart", "Scala",
];

const FALLBACK_LANGUAGES = ["Python", "TypeScript", "JavaScript"];

export default function ModePage() {
  const router = useRouter();
  const user = useUser();
  const [exploreLanguage, setExploreLanguage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
  const [loadingLangs, setLoadingLangs] = useState(true);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening";

  useEffect(() => {
    fetch("/api/github-languages")
      .then((r) => r.json())
      .then((data) => {
        setUserLanguages(data.languages?.length ? data.languages : FALLBACK_LANGUAGES);
      })
      .catch(() => setUserLanguages(FALLBACK_LANGUAGES))
      .finally(() => setLoadingLangs(false));
  }, []);

  return (
    <div className="bg-background text-text-primary min-h-screen flex flex-col">

      <AppHeader />

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Greeting */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
            {greeting}{user ? `, ${user.username || user.name.split(" ")[0].toLowerCase()}` : ""}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary font-sans">
            What are you hunting for today?
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

          {/* Card 1 — Match My Skills */}
          <button
            onClick={() => router.push("/hunt?mode=match")}
            className={cn(
              "group relative flex flex-col text-left bg-surface border border-border p-7 rounded-2xl",
              "transition-all duration-300",
              "hover:border-[rgba(249,115,22,0.5)] hover:shadow-[0_0_30px_rgba(249,116,21,0.1)]"
            )}
            style={{ borderLeft: "3px solid #F97316" }}
          >
            {/* Icon box */}
            <div
              className="mb-6 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(249,115,22,0.1)", color: "#F97316" }}
            >
              <Crosshair size={28} />
            </div>

            <h3 className="text-xl font-bold mb-3 text-text-primary font-sans">
              Match My Skills
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-6 font-sans">
              Find open issues that match your technical expertise and preferred stack.
            </p>

            {/* Language tags */}
            <div className="flex flex-wrap gap-2 mt-auto min-h-[28px]">
              {loadingLangs ? (
                <span className="text-xs font-mono text-text-muted animate-pulse">
                  Fetching your languages...
                </span>
              ) : userLanguages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded-md text-xs font-mono"
                  style={{ background: "#1E1E2E", color: "#CBD5E1" }}
                >
                  {lang === "JavaScript" ? "JS" : lang === "TypeScript" ? "TS" : lang}
                </span>
              ))}
            </div>
          </button>

          {/* Card 2 — Learn Something New */}
          <div
            className={cn(
              "group relative flex flex-col bg-surface border border-border p-7 rounded-2xl",
              "transition-all duration-300 hover:border-[#2A2A3E]"
            )}
          >
            {/* Icon box */}
            <div
              className="mb-6 w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
            >
              <Sprout size={28} />
            </div>

            <h3 className="text-xl font-bold mb-3 text-text-primary font-sans">
              Learn Something New
            </h3>
            <p className="text-text-muted text-sm leading-relaxed mb-6 font-sans">
              Explore new languages or frameworks by taking on beginner-friendly issues.
            </p>

            {/* Language picker */}
            <div className="relative mt-auto">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-background border border-border rounded-lg transition-colors hover:bg-[#0f0f16] text-left"
              >
                <span className={cn("text-sm font-sans", exploreLanguage ? "text-text-primary" : "text-text-muted")}>
                  {exploreLanguage || "Select a language..."}
                </span>
                <ChevronDown
                  size={16}
                  className={cn("text-text-muted transition-transform flex-shrink-0", dropdownOpen && "rotate-180")}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-10 max-h-48 overflow-y-auto">
                  {ALL_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setExploreLanguage(lang);
                        setDropdownOpen(false);
                        router.push(`/hunt?mode=explore&lang=${encodeURIComponent(lang)}`);
                      }}
                      className="flex items-center justify-between w-full px-4 py-2 text-sm font-sans text-text-muted hover:bg-[#1a1a28] hover:text-text-primary transition-colors text-left"
                    >
                      {lang}
                      {exploreLanguage === lang && <Check size={14} className="text-accent" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-16 flex items-center gap-6 opacity-40">
          <div className="h-px w-12 bg-border" />
          <p className="text-[10px] font-mono text-text-muted tracking-tighter">
            ISSUEHUNT PROTOCOL V2.0.4
          </p>
          <div className="h-px w-12 bg-border" />
        </div>
      </main>

      {/* Background glow blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{ top: "-10%", right: "-10%", width: "40%", height: "40%", background: "rgba(249,115,22,0.05)", filter: "blur(120px)" }}
        />
        <div
          className="absolute rounded-full"
          style={{ bottom: "-10%", left: "-10%", width: "30%", height: "30%", background: "rgba(59,130,246,0.05)", filter: "blur(100px)" }}
        />
      </div>
    </div>
  );
}
