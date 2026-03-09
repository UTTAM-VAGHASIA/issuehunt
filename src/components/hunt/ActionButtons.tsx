import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  onSkip: () => void;
  onSave: () => void;
}

export function ActionButtons({ onSkip, onSave }: ActionButtonsProps) {
  return (
    <div className="flex gap-3 mt-7">
      <button
        onClick={onSkip}
        className={cn(
          "flex-1 h-12 flex items-center justify-center gap-3 rounded-btn",
          "border border-border text-[14px] font-sans font-medium text-text-muted",
          "transition-all hover:border-danger hover:text-danger hover:bg-[rgba(239,68,68,0.05)]",
          "group"
        )}
      >
        <span>✕ Skip</span>
        <span className="text-[11px] opacity-50 group-hover:opacity-70">←</span>
      </button>

      <button
        onClick={onSave}
        className={cn(
          "flex-1 h-12 flex items-center justify-center gap-3 rounded-btn",
          "border border-border text-[14px] font-sans font-medium text-text-muted",
          "transition-all hover:border-success hover:text-success hover:bg-[rgba(34,197,94,0.05)]",
          "group"
        )}
      >
        <span>♥ Save</span>
        <span className="text-[11px] opacity-50 group-hover:opacity-70">→</span>
      </button>
    </div>
  );
}
