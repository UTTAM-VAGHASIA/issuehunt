"use client";

import { IssueStatus } from "@/lib/types/saved";
import { cn } from "@/lib/utils";

const statusConfig: Record<IssueStatus, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "border-border text-text-muted",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-accent text-accent bg-[rgba(249,115,22,0.1)]",
  },
  done: {
    label: "Done",
    className: "border-success text-success bg-[rgba(34,197,94,0.1)]",
  },
};

const cycle: Record<IssueStatus, IssueStatus> = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

interface StatusCyclerProps {
  status: IssueStatus;
  onChange: (next: IssueStatus) => void;
}

export function StatusCycler({ status, onChange }: StatusCyclerProps) {
  const config = statusConfig[status];
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onChange(cycle[status]);
      }}
      className={cn(
        "font-mono text-[13px] px-3 py-1 rounded-full border transition-all hover:opacity-80 whitespace-nowrap",
        config.className
      )}
    >
      {config.label}
    </button>
  );
}
