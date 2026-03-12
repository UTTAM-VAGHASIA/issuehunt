"use client";

import { MonoText } from "@/components/ui/MonoText";

export interface HuntFilters {
  goodFirstIssue: boolean;
  hasContributing: boolean;
  activeRecently: boolean;
}

interface FilterTogglesProps {
  filters: HuntFilters;
  onToggle: (id: keyof HuntFilters) => void;
}

const filterDefs: { id: keyof HuntFilters; label: string }[] = [
  { id: "goodFirstIssue", label: "Good first issue" },
  { id: "hasContributing", label: "Has CONTRIBUTING.md" },
  { id: "activeRecently", label: "Active in 30 days" },
];

export function FilterToggles({ filters, onToggle }: FilterTogglesProps) {
  return (
    <div>
      <MonoText size="xs" muted className="uppercase tracking-widest block mb-3">
        Refine
      </MonoText>
      <div className="flex flex-col">
        {filterDefs.map(({ id, label }) => (
          <div
            key={id}
            className="flex items-center justify-between py-[14px] border-b border-border last:border-b-0"
          >
            <MonoText size="xs">{label}</MonoText>
            <button
              onClick={() => onToggle(id)}
              className="relative inline-flex w-8 h-4 rounded-full transition-colors flex-shrink-0"
              style={{ backgroundColor: filters[id] ? "#F97316" : "#1E1E2E" }}
              aria-pressed={filters[id]}
              aria-label={`Toggle ${label}`}
            >
              <span
                className="inline-block w-3 h-3 bg-white rounded-full shadow absolute top-0.5 transition-transform"
                style={{ transform: filters[id] ? "translateX(16px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
