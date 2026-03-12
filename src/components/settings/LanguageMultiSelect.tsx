"use client";

import { useEffect, useState, useRef } from "react";
import { X, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageMultiSelectProps {
  selected: string[];
  onChange: (langs: string[]) => void;
}

export function LanguageMultiSelect({ selected, onChange }: LanguageMultiSelectProps) {
  const [allLanguages, setAllLanguages] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/languages")
      .then((r) => r.json())
      .then((data) => { if (data.languages?.length) setAllLanguages(data.languages); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const remove = (lang: string) => onChange(selected.filter((l) => l !== lang));

  const add = (lang: string) => {
    onChange([...selected, lang]);
    setSearch("");
  };

  const filtered = allLanguages.filter(
    (l) => !selected.includes(l) && l.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Selected language pills */}
      {selected.map((lang) => (
        <span
          key={lang}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/40 bg-accent/8 font-mono text-[12px] text-text-primary"
        >
          {lang}
          <button
            type="button"
            onClick={() => remove(lang)}
            aria-label={`Remove ${lang}`}
            className="text-text-muted hover:text-danger transition-colors"
          >
            <X size={11} />
          </button>
        </span>
      ))}

      {/* + button with dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            setSearch("");
            setTimeout(() => searchRef.current?.focus(), 50);
          }}
          aria-label="Add language"
          className="w-7 h-7 rounded-full border border-border text-text-muted hover:border-accent hover:text-accent transition-colors flex items-center justify-center"
        >
          <Plus size={13} />
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-surface border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-20">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <Search size={12} className="text-text-muted flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search languages…"
                className="flex-1 bg-transparent text-[13px] font-sans text-text-primary placeholder:text-text-muted outline-none"
              />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 font-mono text-[11px] text-text-muted">
                  {search ? "No results" : "All languages added"}
                </p>
              ) : (
                filtered.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => add(lang)}
                    className={cn(
                      "w-full text-left px-4 py-2 font-sans text-[13px] text-text-muted",
                      "hover:bg-background hover:text-text-primary transition-colors"
                    )}
                  >
                    {lang}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
