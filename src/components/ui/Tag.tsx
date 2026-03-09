import { cn } from "@/lib/utils";
import { languageColors } from "@/lib/design-tokens";

interface TagProps {
  label: string;
  variant?: "language" | "label" | "custom";
  className?: string;
}

const labelStyles: Record<string, { bg: string; text: string; border: string }> = {
  "good first issue": {
    bg: "rgba(34,197,94,0.1)",
    text: "#22C55E",
    border: "rgba(34,197,94,0.2)",
  },
  bug: {
    bg: "rgba(239,68,68,0.1)",
    text: "#EF4444",
    border: "rgba(239,68,68,0.2)",
  },
  "help wanted": {
    bg: "rgba(249,115,22,0.1)",
    text: "#F97316",
    border: "rgba(249,115,22,0.2)",
  },
  accessibility: {
    bg: "rgba(168,85,247,0.1)",
    text: "#A855F7",
    border: "rgba(168,85,247,0.2)",
  },
  enhancement: {
    bg: "rgba(20,184,166,0.1)",
    text: "#14B8A6",
    border: "rgba(20,184,166,0.2)",
  },
  diagnostics: {
    bg: "rgba(249,115,22,0.1)",
    text: "#F97316",
    border: "rgba(249,115,22,0.2)",
  },
  wontfix: {
    bg: "rgba(107,114,128,0.1)",
    text: "#6B7280",
    border: "rgba(107,114,128,0.2)",
  },
};

export function Tag({ label, variant = "label", className }: TagProps) {
  const isLanguage = variant === "language";
  const colors = isLanguage
    ? languageColors[label] ?? {
        bg: "rgba(107,114,128,0.1)",
        text: "#6B7280",
        border: "rgba(107,114,128,0.2)",
      }
    : labelStyles[label.toLowerCase()] ?? {
        bg: "rgba(107,114,128,0.1)",
        text: "#6B7280",
        border: "rgba(107,114,128,0.2)",
      };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[11px] px-[10px] py-[4px] rounded-tag border",
        className
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {label}
    </span>
  );
}
