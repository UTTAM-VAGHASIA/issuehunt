"use client";

import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface DisplayToggleRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showDivider?: boolean;
}

export function DisplayToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  showDivider = true,
}: DisplayToggleRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-4", showDivider && "border-b border-border")}>
      <div className="flex flex-col gap-0.5 pr-8">
        <label htmlFor={id} className="font-sans text-[14px] text-text-primary cursor-pointer">
          {label}
        </label>
        {description && (
          <span className="font-mono text-[11px] text-text-muted">{description}</span>
        )}
      </div>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-accent" : "bg-border"
        )}
      >
        <Switch.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </Switch.Root>
    </div>
  );
}
