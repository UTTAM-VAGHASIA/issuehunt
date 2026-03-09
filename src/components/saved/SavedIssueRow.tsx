"use client";

import { ExternalLink } from "lucide-react";
import { SavedIssue } from "@/lib/mock-data";
import { Tag } from "@/components/ui/Tag";
import { MonoText } from "@/components/ui/MonoText";
import { StatusCycler } from "./StatusCycler";
import { cn } from "@/lib/utils";

interface SavedIssueRowProps {
  issue: SavedIssue;
  onStatusChange: (id: string, status: SavedIssue["status"]) => void;
}

export function SavedIssueRow({ issue, onStatusChange }: SavedIssueRowProps) {
  const isDone = issue.status === "done";

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 h-16 border-b border-border rounded-btn",
        "hover:bg-surface transition-colors",
        isDone && "opacity-50"
      )}
    >
      {/* Left: repo + title */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <MonoText size="xs" muted className="block truncate">
          {issue.repoName}
        </MonoText>
        <p
          className={cn(
            "font-sans text-[14px] text-text-primary truncate mt-0.5",
            isDone && "line-through"
          )}
        >
          {issue.title}
        </p>
      </div>

      {/* Middle: language tag */}
      <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
        <Tag label={issue.language} variant="language" />
      </div>

      {/* Right: status + link */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <StatusCycler
          status={issue.status}
          onChange={(next) => onStatusChange(issue.id, next)}
        />
        <a
          href={`https://github.com/${issue.repoName}/issues/${issue.number}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] text-accent hover:underline flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          Open
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
