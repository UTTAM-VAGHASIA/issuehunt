"use client";

import { type FC } from "react";
import { Crosshair, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "match" | "explore";

interface MiniModeSelectorProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

const modes: { id: Mode; label: string; description: string; Icon: FC<{ size?: number }> }[] = [
  {
    id: "match",
    label: "Match My Skills",
    description: "Issues in your languages",
    Icon: Crosshair,
  },
  {
    id: "explore",
    label: "Explore New",
    description: "Discover something different",
    Icon: Sprout,
  },
];

export function MiniModeSelector({ value, onChange }: MiniModeSelectorProps) {
  return (
    <div className="flex gap-3">
      {modes.map((mode) => {
        const isActive = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(mode.id)}
            className={cn(
              "flex-1 flex flex-col items-start gap-1.5 px-4 py-3 rounded-xl border transition-all text-left",
              isActive
                ? "border-accent bg-accent/5"
                : "border-border bg-background hover:border-[#2A2A3E]"
            )}
          >
            <div
              className={cn(
                "transition-colors",
                isActive ? "text-accent" : "text-text-muted"
              )}
            >
              <mode.Icon size={16} />
            </div>
            <span
              className={cn(
                "font-sans text-[13px] font-medium",
                isActive ? "text-text-primary" : "text-text-muted"
              )}
            >
              {mode.label}
            </span>
            <span className="font-mono text-[11px] text-text-muted">
              {mode.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
