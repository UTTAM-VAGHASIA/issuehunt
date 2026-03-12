"use client";

import { useState } from "react";
import { Unlink } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Avatar } from "@/components/ui/Avatar";
import { MonoText } from "@/components/ui/MonoText";
import { MiniModeSelector } from "@/components/settings/MiniModeSelector";
import { LanguageMultiSelect } from "@/components/settings/LanguageMultiSelect";
import { SessionStepper } from "@/components/settings/SessionStepper";
import { DisplayToggleRow } from "@/components/settings/DisplayToggleRow";
import { MOCK_USER } from "@/lib/mock-data";

export default function SettingsPage() {
  const [defaultMode, setDefaultMode] = useState<"match" | "explore">("match");
  const [languages, setLanguages] = useState<string[]>(MOCK_USER.languages);
  const [cardsPerSession, setCardsPerSession] = useState(20);
  const [showActivityScore, setShowActivityScore] = useState(true);
  const [showResponseTime, setShowResponseTime] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-6 py-8 pb-20 md:pb-8">
          {/* Centered content column */}
          <div className="max-w-[640px] mx-auto">

            {/* Page header */}
            <div className="mb-8">
              <h1 className="font-sans font-bold text-[24px] text-text-primary">
                Settings
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 border-t border-border" />
                <MonoText size="xs" muted>ACCOUNT & PREFERENCES</MonoText>
                <div className="flex-1 border-t border-border" />
              </div>
            </div>

            {/* Section 1: Profile */}
            <section className="mb-5">
              <div className="bg-surface border border-border rounded-2xl p-8">
                <MonoText size="xs" muted className="uppercase tracking-wider mb-5 block">
                  Profile
                </MonoText>
                <div className="flex items-center gap-4">
                  <div
                    className="rounded-full flex-shrink-0"
                    style={{ border: "2px solid rgba(249,115,22,0.4)" }}
                  >
                    <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} size={48} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-sans font-semibold text-[16px] text-text-primary">
                      {MOCK_USER.name}
                    </span>
                    <MonoText size="sm" muted>@{MOCK_USER.username}</MonoText>
                  </div>
                  <div className="ml-auto">
                    <span className="font-mono text-[11px] bg-success/10 text-success border border-success/20 px-3 py-1 rounded-full">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Hunting Preferences */}
            <section className="mb-5">
              <div className="bg-surface border border-border rounded-2xl p-8">
                <MonoText size="xs" muted className="uppercase tracking-wider mb-5 block">
                  Hunting Preferences
                </MonoText>

                {/* Default mode */}
                <div className="mb-6">
                  <p className="font-sans text-[14px] text-text-primary mb-2">Default Mode</p>
                  <MiniModeSelector value={defaultMode} onChange={setDefaultMode} />
                </div>

                {/* Preferred languages */}
                <div className="mb-6">
                  <p className="font-sans text-[14px] text-text-primary mb-2">
                    Preferred Languages
                  </p>
                  <MonoText size="xs" muted className="block mb-3">
                    Click to toggle. Selected languages are used in Match My Skills mode.
                  </MonoText>
                  <LanguageMultiSelect selected={languages} onChange={setLanguages} />
                </div>

                {/* Cards per session */}
                <div>
                  <p className="font-sans text-[14px] text-text-primary mb-1">
                    Cards Per Session
                  </p>
                  <MonoText size="xs" muted className="block mb-3">
                    How many issues to show per hunt session.
                  </MonoText>
                  <SessionStepper
                    value={cardsPerSession}
                    onChange={setCardsPerSession}
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Display */}
            <section className="mb-5">
              <div className="bg-surface border border-border rounded-2xl p-8">
                <MonoText size="xs" muted className="uppercase tracking-wider mb-5 block">
                  Display
                </MonoText>
                <DisplayToggleRow
                  id="activity-score"
                  label="Show activity score on cards"
                  description="Displays the repo health bar on each issue card"
                  checked={showActivityScore}
                  onCheckedChange={setShowActivityScore}
                  showDivider={true}
                />
                <DisplayToggleRow
                  id="response-time"
                  label="Show maintainer response time"
                  description="Displays avg response time in the card footer"
                  checked={showResponseTime}
                  onCheckedChange={setShowResponseTime}
                  showDivider={false}
                />
              </div>
            </section>

            {/* Section 4: Danger Zone */}
            <section className="mb-8">
              <div className="rounded-2xl border border-danger/20 p-8">
                <MonoText size="xs" className="uppercase tracking-wider mb-5 block text-danger">
                  Danger Zone
                </MonoText>
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="font-sans text-[14px] text-text-primary">
                      Disconnect GitHub
                    </p>
                    <MonoText size="xs" muted className="block mt-1">
                      Removes access and signs you out. Your saved issues will be lost.
                    </MonoText>
                  </div>
                  <button
                    type="button"
                    aria-label="Disconnect GitHub account"
                    className="flex-shrink-0 flex items-center gap-2 font-sans text-[13px] px-4 py-2 rounded-btn border border-danger/30 text-danger transition-colors hover:bg-danger/10"
                  >
                    <Unlink size={14} />
                    Disconnect
                  </button>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      <BottomNav />

      {/* Background glow blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute rounded-full" style={{ top: "-10%", right: "-10%", width: "40%", height: "40%", background: "rgba(249,115,22,0.04)", filter: "blur(120px)" }} />
        <div className="absolute rounded-full" style={{ bottom: "-10%", left: "-10%", width: "30%", height: "30%", background: "rgba(59,130,246,0.04)", filter: "blur(100px)" }} />
      </div>
    </div>
  );
}
