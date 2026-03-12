"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Trash2, GitFork, Loader2 } from "lucide-react";
import { RealSavedIssue, IssueStatus } from "@/lib/types/saved";
import { Tag } from "@/components/ui/Tag";
import { MonoText } from "@/components/ui/MonoText";
import { StatusCycler } from "./StatusCycler";
import { ForkStartModal } from "./ForkStartModal";
import { cn } from "@/lib/utils";

interface SavedIssueRowProps {
  issue: RealSavedIssue;
  onStatusChange: (id: string, status: IssueStatus) => void;
  onDelete: (id: string) => void;
}

export function SavedIssueRow({ issue, onStatusChange, onDelete }: SavedIssueRowProps) {
  const isDone = issue.status === "done";
  const isClosed = issue.ghState === "closed" || issue.ghState === "solved";

  const [modalOpen, setModalOpen] = useState(false);
  const [forkName, setForkName] = useState<string | null>(null);
  const [forking, setForking] = useState(false);
  const [forkError, setForkError] = useState<string | null>(null);
  const [claimCount, setClaimCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadCount() {
      try {
        const res = await fetch(`/api/claims/${issue.githubIssueId}`);
        if (!res.ok) return;
        const { count } = await res.json() as { count: number };
        setClaimCount(count);
      } catch {
        // non-fatal — badge defaults to "no hunters"
      }
    }
    loadCount();
  }, [issue.githubIssueId]);

  const handleForkAndStart = async () => {
    if (isClosed || forking) return;

    // If already forked this session, just reopen modal
    if (forkName) {
      setModalOpen(true);
      return;
    }

    setForking(true);
    setForkError(null);
    try {
      const res = await fetch("/api/fork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoName: issue.repoName,
          githubIssueId: issue.githubIssueId,
          issueNumber: issue.number,
        }),
      });

      if (!res.ok) {
        const body = await res.json() as { error?: string };
        const msg = body.error ?? `Error ${res.status}`;
        console.error("[fork] API error:", msg);
        setForkError(msg);
        setTimeout(() => setForkError(null), 4000);
        return;
      }

      const { forkName: name } = await res.json() as { forkUrl: string; forkName: string };
      setForkName(name);
      setClaimCount((c) => (c ?? 0) + 1);
      setModalOpen(true);
    } catch (err) {
      console.error("[fork] Unexpected error:", err);
      setForkError("Unexpected error — check console");
      setTimeout(() => setForkError(null), 4000);
    } finally {
      setForking(false);
    }
  };

  return (
    <>
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
            {claimCount !== null && (
              <span className={cn(
                "font-mono text-[10px] px-1.5 py-0.5 rounded-full border flex-shrink-0",
                claimCount > 0
                  ? "bg-[rgba(249,115,22,0.15)] text-accent border-accent/30"
                  : "bg-surface text-text-muted border-border"
              )}>
                {claimCount > 0
                  ? `${claimCount} IssueHunter${claimCount !== 1 ? "s" : ""} working on this`
                  : "No IssueHunters working on this yet"}
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
          <div className="flex flex-col items-end gap-0.5">
            <button
              onClick={handleForkAndStart}
              disabled={isClosed || forking}
              className={cn(
                "font-mono text-[12px] px-3 py-1 rounded-btn border flex items-center gap-1.5 transition-all",
                isClosed || forking
                  ? "border-border text-text-muted opacity-40 cursor-not-allowed"
                  : forkError
                    ? "border-danger text-danger"
                    : "border-accent text-accent hover:bg-accent hover:text-background"
              )}
            >
              {forking ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <GitFork size={12} />
              )}
              {forkError ? "Fork failed" : "Fork & Start"}
            </button>
            {forkError && (
              <span className="font-mono text-[10px] text-danger">{forkError}</span>
            )}
          </div>
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

      {modalOpen && forkName && (
        <ForkStartModal
          repoName={issue.repoName}
          forkName={forkName}
          issueNumber={issue.number}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
