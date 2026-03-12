"use client";

import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

const ALL_LANGUAGES = [
  "Python", "TypeScript", "JavaScript", "Rust",
  "Go", "Ruby", "CSS", "C++", "Java", "Swift",
  "Kotlin", "PHP", "C#", "HTML",
] as const;

interface LanguageMultiSelectProps {
  selected: string[];
  onChange: (langs: string[]) => void;
}

export function LanguageMultiSelect({ selected, onChange }: LanguageMultiSelectProps) {
  const selectedSet = new Set(selected);

  const toggle = (lang: string) => {
    if (selectedSet.has(lang)) {
      onChange(selected.filter((l) => l !== lang));
    } else {
      onChange([...selected, lang]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_LANGUAGES.map((lang) => {
        const isSelected = selectedSet.has(lang);
        return (
          <button
            key={lang}
            type="button"
            aria-pressed={isSelected}
            onClick={() => toggle(lang)}
            className={cn(
              "transition-all",
              !isSelected && "opacity-40 hover:opacity-70"
            )}
          >
            <Tag label={lang} variant="language" />
          </button>
        );
      })}
    </div>
  );
}
