"use client";

import { Minus, Plus } from "lucide-react";

interface SessionStepperProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}

export function SessionStepper({ value, min = 5, max = 50, step = 5, onChange }: SessionStepperProps) {
  const decrement = () => { if (value > min) onChange(value - step); };
  const increment = () => { if (value < max) onChange(value + step); };

  return (
    <div className="flex items-center" role="group" aria-label="Session length">
      <button
        type="button"
        aria-label="Decrease"
        onClick={decrement}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center border border-border rounded-l-lg text-text-muted hover:text-text-primary hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={14} />
      </button>
      <div
        className="w-14 h-9 flex items-center justify-center border-t border-b border-border bg-background"
        aria-live="polite"
      >
        <span className="font-mono text-[14px] text-text-primary">{value}</span>
      </div>
      <button
        type="button"
        aria-label="Increase"
        onClick={increment}
        disabled={value >= max}
        className="w-9 h-9 flex items-center justify-center border border-border rounded-r-lg text-text-muted hover:text-text-primary hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
