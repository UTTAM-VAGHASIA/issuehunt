"use client";

import { useState, useMemo, useEffect } from "react";
import { Target } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { StatCard } from "@/components/history/StatCard";
import { StreakCalendar } from "@/components/history/StreakCalendar";
import { HistoryRow } from "@/components/history/HistoryRow";
import { HistoryEntry } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Filter = "all" | "saved" | "skipped";

const filterLabels: Record<Filter, string> = {
  all: "All",
  saved: "Saved",
  skipped: "Skipped",
};

function groupByDay(entries: HistoryEntry[]) {
  const groups: Record<string, HistoryEntry[]> = {};
  const today = new Date().toISOString().split("T")[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  for (const entry of entries) {
    let label: string;
    if (entry.date === today) label = "Today";
    else if (entry.date === yesterday) label = "Yesterday";
    else {
      const d = new Date(entry.date + "T00:00:00");
      label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    if (!groups[label]) groups[label] = [];
    groups[label].push(entry);
  }
  return groups;
}

function computeStreak(activeDays: Record<string, number[]>): number {
  let streak = 0;
  const current = new Date();
  while (true) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = current.getDate();
    const key = `${year}-${month}`;
    if (activeDays[key]?.includes(day)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeDays, setActiveDays] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history ?? []);
        setActiveDays(data.activeDays ?? {});
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => filter === "all" ? history : history.filter((e) => e.action === filter),
    [filter, history]
  );

  const grouped   = useMemo(() => groupByDay(filtered), [filtered]);
  const groupKeys = useMemo(() => Object.keys(grouped), [grouped]);

  const totalSwiped = history.length;
  const totalSaved  = history.filter((e) => e.action === "saved").length;
  const saveRate    = totalSwiped > 0 ? Math.round((totalSaved / totalSwiped) * 100) : 0;
  const streak      = computeStreak(activeDays);

  const emptyMessage =
    filter === "all"
      ? "No activity yet. Start hunting."
      : `No ${filterLabels[filter].toLowerCase()} entries found.`;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-6 py-8 pb-20 md:pb-8">

          {/* ── Page header ── */}
          <div className="mb-6">
            <h1 className="font-sans font-bold text-[24px] text-text-primary">
              Activity History
            </h1>
            <p className="font-mono text-[12px] text-text-muted mt-1">
              Your hunting activity across all sessions
            </p>
          </div>

          {/* ── Dashboard layout: stats + calendar (left) / timeline (right) on lg+ ── */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* Left column: stat cards 2×2 + calendar */}
            <div className="flex flex-col gap-3 w-full lg:w-[280px] flex-shrink-0">

              {/* 2×2 stat grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Swiped" value={loading ? "—" : totalSwiped} />
                <StatCard label="Saved"         value={loading ? "—" : totalSaved} />
                <StatCard
                  label="Streak"
                  value={loading ? "—" : `${streak}d`}
                  subLabel="current streak"
                  accent
                />
                <StatCard label="Save Rate" value={loading ? "—" : `${saveRate}%`} />
              </div>

              {/* Calendar */}
              <StreakCalendar activityByMonth={activeDays} />

            </div>

            {/* Right column: filter + activity timeline */}
            <div className="flex-1 min-w-0 w-full">

              {/* Section label */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] text-text-muted uppercase tracking-wider whitespace-nowrap">
                  Activity
                </span>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(Object.keys(filterLabels) as Filter[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn(
                      "font-mono text-[11px] px-3 py-1 rounded-full border transition-all",
                      filter === f
                        ? "bg-accent text-background border-accent"
                        : "border-border text-text-muted hover:border-[#2A2A3E] hover:text-text-primary"
                    )}
                  >
                    {filterLabels[f]}
                  </button>
                ))}

                {/* Entry count */}
                <span className="ml-auto font-mono text-[11px] text-text-muted self-center">
                  {loading ? "…" : `${filtered.length} ${filtered.length === 1 ? "entry" : "entries"}`}
                </span>
              </div>

              {/* Activity timeline */}
              {loading ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <p className="font-mono text-[12px] text-text-muted">Loading…</p>
                </div>
              ) : groupKeys.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <Target size={28} className="text-text-muted" />
                  <p className="font-mono text-[12px] text-text-muted">
                    {emptyMessage}
                  </p>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  {groupKeys.map((groupLabel, gi) => (
                    <div key={groupLabel}>
                      {/* Day group header */}
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 bg-background/40",
                          gi > 0 && "border-t border-border"
                        )}
                      >
                        <span className="font-mono text-[10px] text-text-muted uppercase tracking-widest whitespace-nowrap">
                          {groupLabel}
                        </span>
                        <span className="font-mono text-[10px] text-border">
                          ·
                        </span>
                        <span className="font-mono text-[10px] text-text-muted">
                          {grouped[groupLabel].length} {grouped[groupLabel].length === 1 ? "issue" : "issues"}
                        </span>
                      </div>

                      {/* Rows */}
                      {grouped[groupLabel].map((entry) => (
                        <HistoryRow key={entry.id} entry={entry} />
                      ))}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

        </main>
      </div>

      <BottomNav />

      {/* Background glow blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{ top: "-10%", right: "-10%", width: "40%", height: "40%", background: "rgba(249,115,22,0.04)", filter: "blur(120px)" }}
        />
        <div
          className="absolute rounded-full"
          style={{ bottom: "-10%", left: "-10%", width: "30%", height: "30%", background: "rgba(59,130,246,0.04)", filter: "blur(100px)" }}
        />
      </div>
    </div>
  );
}
