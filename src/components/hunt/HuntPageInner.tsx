"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { CardStack } from "@/components/hunt/CardStack";
import { HuntStats } from "@/components/hunt/HuntStats";
import { FilterToggles, HuntFilters } from "@/components/hunt/FilterToggles";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { MonoText } from "@/components/ui/MonoText";
import { useHuntIssues } from "@/lib/hooks/useHuntIssues";
import { Issue } from "@/lib/mock-data";

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function computeStreak(activeDays: Record<string, number[]>): number {
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (true) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = cursor.getDate();
    const key = `${year}-${month}`;
    if (activeDays[key]?.includes(day)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function computeWeekDots(activeDays: Record<string, number[]>): boolean[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Find the most recent Monday
  const dayOfWeek = today.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = d.getDate();
    const key = `${year}-${month}`;
    return activeDays[key]?.includes(day) ?? false;
  });
}

export function HuntPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") ?? "match";
  const [filters, setFilters] = useState<HuntFilters>({
    goodFirstIssue: true,
    hasContributing: true,
    activeRecently: true,
  });

  const handleToggle = (id: keyof HuntFilters) => {
    setFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { issues, total, loading, error, prefetchNextPage } = useHuntIssues(mode, filters);
  const [saved, setSaved] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weekDots, setWeekDots] = useState<boolean[]>([false, false, false, false, false, false, false]);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data: { history?: { action: string; date: string }[]; activeDays?: Record<string, number[]> }) => {
        if (data.history) {
          const today = new Date().toISOString().split("T")[0];
          const todayEntries = data.history.filter((e) => e.date === today);
          setSaved(todayEntries.filter((e) => e.action === "saved").length);
          setSkipped(todayEntries.filter((e) => e.action === "skipped").length);
        }
        if (data.activeDays) {
          setStreak(computeStreak(data.activeDays));
          setWeekDots(computeWeekDots(data.activeDays));
        }
      })
      .catch(() => {});
  }, []);

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

            <FilterToggles filters={filters} onToggle={handleToggle} />

            <div className="border-t border-border my-5" />

            <div>
              <StreakBadge streak={streak} className="mb-4" />
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  {weekDots.map((active, i) => (
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
