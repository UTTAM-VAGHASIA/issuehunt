"use client";

const LANGUAGES = [
  "Python", "JavaScript", "TypeScript", "Rust", "Go",
  "Java", "C++", "Ruby", "Swift", "Kotlin", "PHP", "C#", "Dart", "Scala",
];

interface LanguagePickerProps {
  value: string;
  onChange: (lang: string) => void;
}

export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-5 bg-background border border-border rounded-btn px-[14px] py-[10px] font-mono text-[13px] text-text-muted focus:outline-none focus:border-teal transition-colors cursor-pointer"
      style={{
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
    >
      <option value="" disabled>Select a language...</option>
      {LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {lang}
        </option>
      ))}
    </select>
  );
}
