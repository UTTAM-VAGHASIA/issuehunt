import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export function StreakBadge({ streak, className }: StreakBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[16px]">🔥</span>
      <span className="font-sans text-[16px] font-medium text-text-primary">
        {streak} day streak
      </span>
    </div>
  );
}
