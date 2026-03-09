"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Crosshair, Sprout, ChevronDown, Check } from "lucide-react";
import { MOCK_USER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Rust", "Go",
  "Java", "C++", "Ruby", "Swift", "Kotlin", "PHP", "C#", "Dart", "Scala",
];

export default function ModePage() {
  const router = useRouter();
  const [exploreLanguage, setExploreLanguage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening";
  const firstName = MOCK_USER.name.split(" ")[0].toLowerCase();

  return (
    <div className="bg-background text-text-primary min-h-screen flex flex-col">

      {/* Sticky header */}
      <header
        className="w-full border-b border-border sticky top-0 z-50"
        style={{ backgroundColor: "rgba(10,10,15,0.5)", backdropFilter: "blur(12px)" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-accent p-1.5 rounded-lg flex items-center justify-center">
              <Crosshair size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary font-sans">
              IssueHunt
            </h1>
          </Link>

          {/* User pill */}
          <div className="flex items-center gap-3 bg-surface border border-border px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium text-text-primary font-sans">
              {firstName}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[rgba(249,115,22,0.3)] flex-shrink-0">
              <Image
                src={MOCK_USER.avatar}
                alt={MOCK_USER.name}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Greeting */}
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted mb-4">
            {greeting}, {firstName}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary font-sans">
            What are you hunting for today?
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">

          {/* Card 1 — Match My Skills */}
          <button
            onClick={() => router.push("/hunt")}
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
            <div className="flex flex-wrap gap-2 mt-auto">
              {MOCK_USER.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 rounded-md text-xs font-mono"
                  style={{ background: "#1E1E2E", color: "#CBD5E1" }}
                >
                  {lang === "JavaScript" ? "JS" : lang}
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

            {/* Language picker — custom dropdown */}
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

              {/* Dropdown list */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-10 max-h-48 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setExploreLanguage(lang);
                        setDropdownOpen(false);
                        router.push("/hunt");
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
          style={{
            top: "-10%", right: "-10%",
            width: "40%", height: "40%",
            background: "rgba(249,115,22,0.05)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-10%", left: "-10%",
            width: "30%", height: "30%",
            background: "rgba(59,130,246,0.05)",
            filter: "blur(100px)",
          }}
        />
      </div>
    </div>
  );
}
