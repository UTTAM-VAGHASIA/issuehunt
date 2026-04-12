"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { CardStack, CardStackHandle } from "@/components/hunt/CardStack";
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
  const [retryKey, setRetryKey] = useState(0);

  const handleToggle = (id: keyof HuntFilters) => {
    setFilters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { issues, total, loading, error, prefetchNextPage } = useHuntIssues(mode, filters, retryKey);

  // Counter state: null until the /api/history fetch resolves to avoid the 0-flash.
  // Session refs track swipes made before or during the initial fetch, preventing
  // the DB response from overwriting optimistic increments.
  const sessionSavedRef = useRef(0);
  const sessionSkippedRef = useRef(0);
  const [savedToday, setSavedToday] = useState<number | null>(null);
  const [skippedToday, setSkippedToday] = useState<number | null>(null);

  // Streak and week dots: null until loaded so the StreakBadge never flashes "0".
  const [streak, setStreak] = useState<number | null>(null);
  const [weekDots, setWeekDots] = useState<boolean[] | null>(null);

  // Ref to CardStack so we can push a card back on API failure.
  const cardStackRef = useRef<CardStackHandle>(null);

  // Brief swipe error shown when a save/skip API call fails.
  const [swipeError, setSwipeError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data: { history?: { action: string; date: string }[]; activeDays?: Record<string, number[]> }) => {
        if (data.history) {
          const today = new Date().toISOString().split("T")[0];
          const todayEntries = data.history.filter((e) => e.date === today);
          const dbSaved = todayEntries.filter((e) => e.action === "saved").length;
          const dbSkipped = todayEntries.filter((e) => e.action === "skipped").length;
          // Add session swipes that happened while the fetch was in-flight.
          setSavedToday(dbSaved + sessionSavedRef.current);
          setSkippedToday(dbSkipped + sessionSkippedRef.current);
        }
        if (data.activeDays) {
          setStreak(computeStreak(data.activeDays));
          setWeekDots(computeWeekDots(data.activeDays));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (issue: Issue) => {
    sessionSavedRef.current += 1;
    setSavedToday((prev) => (prev ?? 0) + 1);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issue),
      });
      if (!res.ok) throw new Error("save failed");
    } catch {
      // Revert counter and return the card to the top of the deck.
      sessionSavedRef.current -= 1;
      setSavedToday((prev) => Math.max(0, (prev ?? 1) - 1));
      cardStackRef.current?.pushBack();
      setSwipeError("Couldn't save — issue returned to your queue");
      setTimeout(() => setSwipeError(null), 4000);
    }
  };

  const handleSkip = async (issue: Issue) => {
    sessionSkippedRef.current += 1;
    setSkippedToday((prev) => (prev ?? 0) + 1);
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issue),
      });
      if (!res.ok) throw new Error("skip failed");
    } catch {
      // Revert counter and return the card to the top of the deck.
      sessionSkippedRef.current -= 1;
      setSkippedToday((prev) => Math.max(0, (prev ?? 1) - 1));
      cardStackRef.current?.pushBack();
      setSwipeError("Couldn't record skip — issue returned to your queue");
      setTimeout(() => setSwipeError(null), 4000);
    }
  };

  const savedCount = savedToday ?? 0;
  const skippedCount = skippedToday ?? 0;

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

  const errorState = (
    <div className="flex flex-col items-center justify-center h-[520px] gap-4 text-center px-6">
      <p className="font-mono text-[14px] text-text-muted">Failed to load issues.</p>
      <p className="font-sans text-[12px] text-text-muted leading-relaxed">
        {error === "No GitHub token" ? "GitHub account not connected." : "Check your connection and try again."}
      </p>
      <button
        onClick={() => setRetryKey((k) => k + 1)}
        className="mt-2 px-5 py-2 rounded-btn bg-accent text-background text-sm font-bold font-sans hover:bg-accent/90 transition-colors"
      >
        Retry
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

              {/* Swipe error toast */}
              {swipeError && (
                <div className="mb-3 px-4 py-2 rounded-btn bg-[rgba(239,68,68,0.1)] border border-danger/30 text-center">
                  <span className="font-mono text-[12px] text-danger">{swipeError}</span>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center h-[520px]">
                  <span className="font-mono text-sm text-text-muted animate-pulse">
                    Fetching issues…
                  </span>
                </div>
              ) : error ? (
                errorState
              ) : (
                <CardStack
                  key={`${mode}-${filters.goodFirstIssue}-${retryKey}`}
                  ref={cardStackRef}
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
              swiped={savedCount + skippedCount}
              saved={savedCount}
              skipped={skippedCount}
            />

            <div className="border-t border-border my-5" />

            <FilterToggles filters={filters} onToggle={handleToggle} />

            <div className="border-t border-border my-5" />

            <div>
              {streak !== null && (
                <StreakBadge streak={streak} className="mb-4" />
              )}
              {weekDots !== null && (
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
              )}
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
