"use client";

import { ExternalLink, Trash2, GitFork } from "lucide-react";
import { RealSavedIssue, IssueStatus } from "@/lib/types/saved";
import { Tag } from "@/components/ui/Tag";
import { MonoText } from "@/components/ui/MonoText";
import { StatusCycler } from "./StatusCycler";
import { cn } from "@/lib/utils";

interface SavedIssueRowProps {
  issue: RealSavedIssue;
  onStatusChange: (id: string, status: IssueStatus) => void;
  onDelete: (id: string) => void;
}

export function SavedIssueRow({ issue, onStatusChange, onDelete }: SavedIssueRowProps) {
  const isDone = issue.status === "done";
  const isClosed = issue.ghState === "closed" || issue.ghState === "solved";

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
        <div className="flex items-center gap-2">
          <MonoText size="xs" muted className="truncate">
            {issue.repoName}
          </MonoText>
          {issue.ghState === "solved" && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(34,197,94,0.15)] text-success border border-success/30 flex-shrink-0">
              Solved
            </span>
          )}
          {issue.ghState === "closed" && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[rgba(239,68,68,0.15)] text-danger border border-danger/30 flex-shrink-0">
              Closed
            </span>
          )}
        </div>
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

      {/* Right: status + actions + delete */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <StatusCycler
          status={issue.status}
          onChange={(next) => onStatusChange(issue.id, next)}
        />
        <button
          disabled={isClosed}
          className={cn(
            "font-mono text-[12px] px-3 py-1 rounded-btn border flex items-center gap-1.5 transition-all",
            isClosed
              ? "border-border text-text-muted opacity-40 cursor-not-allowed"
              : "border-accent text-accent hover:bg-accent hover:text-background"
          )}
        >
          <GitFork size={12} />
          Fork &amp; Start
        </button>
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
        <button
          onClick={() => onDelete(issue.id)}
          className="text-text-muted hover:text-danger transition-colors"
          aria-label="Delete saved issue"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
