"use client";

import { useState } from "react";
import { MonoText } from "@/components/ui/MonoText";

const filters = [
  { id: "goodFirstIssue", label: "Good first issue" },
  { id: "hasContributing", label: "Has CONTRIBUTING.md" },
  { id: "activeRecently", label: "Active in 30 days" },
];

export function FilterToggles() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    goodFirstIssue: true,
    hasContributing: true,
    activeRecently: true,
  });

  const toggle = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <MonoText size="xs" muted className="uppercase tracking-widest block mb-3">
        Refine
      </MonoText>
      <div className="flex flex-col">
        {filters.map(({ id, label }) => (
          <div
            key={id}
            className="flex items-center justify-between py-[14px] border-b border-border last:border-b-0"
          >
            <MonoText size="xs">{label}</MonoText>
            <button
              onClick={() => toggle(id)}
              className="relative inline-flex w-8 h-4 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: enabled[id] ? "#F97316" : "#1E1E2E" }}
              aria-pressed={enabled[id]}
              aria-label={`Toggle ${label}`}
            >
              <span
                className="inline-block w-3 h-3 bg-white rounded-full shadow absolute top-0.5 transition-transform"
                style={{ transform: enabled[id] ? "translateX(16px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
