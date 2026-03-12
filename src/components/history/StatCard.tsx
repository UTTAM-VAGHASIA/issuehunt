import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, subLabel, accent = false, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex-1 rounded-2xl flex flex-col justify-center px-4 py-4 min-w-0 border transition-colors",
        accent
          ? "bg-accent/[0.05] border-accent/25"
          : "bg-surface border-border",
        className
      )}
    >
      <span
        className={cn(
          "font-sans font-semibold text-[26px] leading-none",
          accent ? "text-accent" : "text-text-primary"
        )}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider mt-2">
        {label}
      </span>
      {subLabel && (
        <span className="font-mono text-[10px] text-accent/70 mt-0.5">{subLabel}</span>
      )}
    </div>
  );
}
