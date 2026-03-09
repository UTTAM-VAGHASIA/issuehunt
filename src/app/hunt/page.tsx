"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { CardStack } from "@/components/hunt/CardStack";
import { HuntStats } from "@/components/hunt/HuntStats";
import { FilterToggles } from "@/components/hunt/FilterToggles";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { MonoText } from "@/components/ui/MonoText";
import { MOCK_ISSUES, MOCK_USER, Issue } from "@/lib/mock-data";

export default function HuntPage() {
  const [saved, setSaved] = useState(0);
  const [skipped, setSkipped] = useState(0);

  const handleSave = (_issue: Issue) => setSaved((n) => n + 1);
  const handleSkip = (_issue: Issue) => setSkipped((n) => n + 1);

  const streakDays = [true, true, true, true, false, false, false];
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Consistent sticky header */}
      <AppHeader />

      {/* Below header: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex flex-1 overflow-hidden">
          {/* Center column */}
          <div className="flex-1 overflow-y-auto px-4 py-8 pb-20 md:pb-8">
            <div className="max-w-[520px] mx-auto">
              <MonoText size="xs" muted className="block text-center mb-4">
                23 issues matched · Python · good first issue
              </MonoText>
              <CardStack
                issues={MOCK_ISSUES}
                onSave={handleSave}
                onSkip={handleSkip}
              />
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
              <StreakBadge streak={MOCK_USER.streak} className="mb-4" />
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

      {/* Background glow blobs */}
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
