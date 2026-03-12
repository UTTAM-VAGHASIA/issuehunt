"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { CardStack } from "@/components/hunt/CardStack";
import { HuntStats } from "@/components/hunt/HuntStats";
import { FilterToggles } from "@/components/hunt/FilterToggles";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { MonoText } from "@/components/ui/MonoText";
import { useUser } from "@/lib/hooks/useUser";
import { useHuntIssues } from "@/lib/hooks/useHuntIssues";
import { Issue } from "@/lib/mock-data";

const streakDays = [true, true, true, true, false, false, false];
const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

export function HuntPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") ?? "match";
  const user = useUser();

  const { issues, total, loading, error, prefetchNextPage } = useHuntIssues(mode);
  const [saved, setSaved] = useState(0);
  const [skipped, setSkipped] = useState(0);

  const handleSave = async (issue: Issue) => {
    setSaved((n) => n + 1);
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issue),
    });
  };

  const handleSkip = async (issue: Issue) => {
    setSkipped((n) => n + 1);
    await fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issue),
    });
  };

  const emptyState = (
    <div className="flex flex-col items-center justify-center h-[520px] gap-4 text-center px-6">
      <p className="font-mono text-[14px] text-text-muted">No more issues to show.</p>
      <p className="font-sans text-[12px] text-text-muted leading-relaxed">
        You&apos;ve seen everything in {mode === "match" ? "Match My Skills" : "Learn Something New"} mode.
      </p>
      <button
        onClick={() => router.push("/mode")}
        className="mt-2 px-5 py-2 rounded-btn bg-accent text-background text-sm font-bold font-sans hover:bg-accent/90 transition-colors"
      >
        Switch Mode
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex flex-1 overflow-hidden">
          {/* Center column */}
          <div className="flex-1 overflow-y-auto px-4 py-8 pb-20 md:pb-8">
            <div className="max-w-[520px] mx-auto">
              <MonoText size="xs" muted className="block text-center mb-4">
                {loading
                  ? "Loading issues…"
                  : error
                  ? "Failed to load issues"
                  : `${total.toLocaleString()} issues matched · ${mode === "match" ? "your languages" : "explore mode"}`}
              </MonoText>

              {loading ? (
                <div className="flex items-center justify-center h-[520px]">
                  <span className="font-mono text-sm text-text-muted animate-pulse">
                    Fetching issues…
                  </span>
                </div>
              ) : (
                <CardStack
                  issues={issues}
                  onSave={handleSave}
                  onSkip={handleSkip}
                  onNearingEnd={prefetchNextPage}
                  emptySlot={emptyState}
                />
              )}
            </div>
          </div>

          {/* Right panel */}
          <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 border-l border-border px-5 py-6 overflow-y-auto">
            <HuntStats
              swiped={saved + skipped}
              saved={saved}
              skipped={skipped}
            />

            <div className="border-t border-border my-5" />

            <FilterToggles />

            <div className="border-t border-border my-5" />

            <div>
              <StreakBadge streak={user ? 0 : 0} className="mb-4" />
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {streakDays.map((active, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: active ? "#F97316" : "#1E1E2E" }}
                    />
                  ))}
                </div>
                <div className="flex gap-1">
                  {dayLabels.map((label, i) => (
                    <span
                      key={i}
                      className="w-2 font-mono text-[10px] text-text-muted text-center"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      <BottomNav />

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            top: "-10%", right: "-10%",
            width: "40%", height: "40%",
            background: "rgba(249,115,22,0.04)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-10%", left: "-10%",
            width: "30%", height: "30%",
            background: "rgba(59,130,246,0.04)",
            filter: "blur(100px)",
          }}
        />
      </div>
    </div>
  );
}
