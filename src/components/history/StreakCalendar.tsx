"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCalendarProps {
  activityByMonth: Record<string, number[]>; // keys are "YYYY-MM", values are 1-indexed active days
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Two-letter labels, starting Sunday
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const todayRef = new Date();
const todayDate  = todayRef.getDate();
const todayMonth = todayRef.getMonth();
const todayYear  = todayRef.getFullYear();

export function StreakCalendar({ activityByMonth }: StreakCalendarProps) {
  const [year, setYear]   = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);

  const key            = `${year}-${String(month + 1).padStart(2, "0")}`;
  const activeThisMonth = activityByMonth[key] ?? [];
  const activeCount    = activeThisMonth.length;

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth    = new Date(year, month + 1, 0).getDate();

  // Build grid: leading empty cells + day numbers + trailing empties
  const cells: number[] = Array(firstDayOfWeek).fill(0);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(0);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">

      {/* ── Header ── */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border">
        <div>
          <p className="font-sans font-semibold text-[14px] text-text-primary leading-tight">
            {MONTH_NAMES[month]} {year}
          </p>
          <p className="font-mono text-[10px] text-text-muted mt-0.5">
            {activeCount > 0
              ? `${activeCount} active ${activeCount === 1 ? "day" : "days"} this month`
              : "No activity this month"}
          </p>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={prevMonth}
            aria-label="Previous month"
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-background transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            aria-label="Next month"
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-background transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Calendar body ── */}
      <div className="p-4">

        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 mb-1.5">
          {DAY_LABELS.map((d, i) => (
            <div key={i} className="flex justify-center py-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                {d}
              </span>
            </div>
          ))}
        </div>

        {/* Day cells — aspect-square makes them perfectly square and responsive */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const isActive = day > 0 && activeThisMonth.includes(day);
            const isToday  = day > 0 && day === todayDate && month === todayMonth && year === todayYear;
            const isEmpty  = day === 0;

            return (
              <div key={i} className="aspect-square flex items-center justify-center">
                {!isEmpty && (
                  <div
                    className={cn(
                      "w-full h-full rounded-md flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-accent"
                        : isToday
                        ? "ring-1 ring-accent/50 bg-accent/[0.06]"
                        : "hover:bg-white/[0.04]"
                    )}
                    style={isActive ? { boxShadow: "0 2px 10px rgba(249,115,22,0.35)" } : undefined}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] leading-none tabular-nums",
                        isActive
                          ? "text-background font-semibold"
                          : isToday
                          ? "text-accent font-medium"
                          : "text-text-muted"
                      )}
                    >
                      {day}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Legend ── */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/60">
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">No hunt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-sm bg-accent"
              style={{ boxShadow: "0 1px 4px rgba(249,115,22,0.5)" }}
            />
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Hunted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm ring-1 ring-accent/50 bg-accent/[0.06]" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-muted">Today</span>
          </div>
        </div>

      </div>
    </div>
  );
}
