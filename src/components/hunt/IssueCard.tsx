"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Tag } from "@/components/ui/Tag";
import { MonoText } from "@/components/ui/MonoText";
import { Issue } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface IssueCardProps {
  issue: Issue;
  className?: string;
  /** Only the active (swipeable) card should fetch claims. Ghost cards pass nothing. */
  showClaims?: boolean;
}

export function IssueCard({ issue, className, showClaims = false }: IssueCardProps) {
  const [avatarSrc, setAvatarSrc] = useState(issue.repoAvatar);
  const [claimCount, setClaimCount] = useState<number | null>(null);

  useEffect(() => {
    if (!showClaims) return;
    fetch(`/api/claims/${issue.id}`)
      .then((r) => r.ok ? r.json() as Promise<{ count: number }> : null)
      .then((data) => { if (data) setClaimCount(data.count); })
      .catch(() => {});
  }, [issue.id, showClaims]);

  const [repoOwner, repoRepo] = issue.repoName?.includes("/")
    ? issue.repoName.split("/")
    : [issue.repoName, ""];

  return (
    <div
      className={cn(
        "w-full bg-surface border border-border rounded-card shadow-[0_8px_32px_rgba(0,0,0,0.4)] select-none",
        className
      )}
      style={{ padding: "32px" }}
    >
      {/* Repo row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-border flex-shrink-0">
            <Image
              src={avatarSrc}
              alt={issue.repoName}
              width={24}
              height={24}
              className="rounded-full object-cover"
              draggable={false}
              onError={() => setAvatarSrc("https://github.com/ghost.png")}
            />
          </div>
          <MonoText size="sm" muted>
            {repoOwner}{" "}
            {repoRepo && <span className="text-text-primary">/ {repoRepo}</span>}
          </MonoText>
        </div>
        <MonoText size="xs" muted>
          ⭐ {issue.repoStars}
        </MonoText>
      </div>

      {showClaims && claimCount !== null && (
        <div className="flex items-center gap-1.5 mt-2">
          <span className={cn(
            "font-mono text-[10px] px-1.5 py-0.5 rounded-full border flex items-center gap-1",
            claimCount > 0
              ? "bg-[rgba(249,115,22,0.15)] text-accent border-accent/30"
              : "bg-surface text-text-muted border-border"
          )}>
            <Users size={9} />
            {claimCount > 0
              ? `${claimCount} IssueHunter${claimCount !== 1 ? "s" : ""} working on this`
              : "No IssueHunters working on this yet"}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-border mb-4 mt-4" />

      {/* Issue title */}
      <h3 className="font-sans font-medium text-[20px] text-text-primary leading-[1.4] line-clamp-2">
        {issue.title}
      </h3>

      {/* Issue body */}
      <div className="relative mt-3 overflow-hidden" style={{ maxHeight: "72px" }}>
        <p className="font-sans text-[14px] text-text-muted leading-[1.6]">{issue.body}</p>
        <div
          className="absolute bottom-0 left-0 right-0 h-8"
          style={{
            background: "linear-gradient(to bottom, transparent, #111118)",
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-2 mt-5">
        {issue.labels.map((label) => (
          <Tag key={label} label={label} variant="label" />
        ))}
        <Tag label={issue.language} variant="language" />
      </div>

      {/* Stats row */}
      <div className="mt-4">
        <MonoText size="xs" muted>
          Opened {issue.openedAgo} · 💬 {issue.commentCount} comments ·{" "}
          {issue.hasAssignee ? "👤 Assigned" : "👁 No assignee"} ·{" "}
          {issue.hasContributing ? "✅ CONTRIBUTING.md" : "❌ No CONTRIBUTING.md"}
        </MonoText>
      </div>

      {/* Health bars */}
      <div className="mt-5 flex flex-col gap-3">
        {/* Maintainer response */}
        <div className="flex items-center gap-3">
          <MonoText size="xs" muted className="w-[160px] flex-shrink-0">
            Maintainer response
          </MonoText>
          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${issue.responseScore}%`,
                background: "linear-gradient(to right, #F97316, #FBBF24)",
              }}
            />
          </div>
          <MonoText size="xs" className="w-20 text-right flex-shrink-0">
            {issue.maintainerResponseTime}
          </MonoText>
        </div>

        {/* Repo activity */}
        <div className="flex items-center gap-3">
          <MonoText size="xs" muted className="w-[160px] flex-shrink-0">
            Repo activity
          </MonoText>
          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${issue.activityScore}%`,
                background: "linear-gradient(to right, #14B8A6, #22C55E)",
              }}
            />
          </div>
          <MonoText size="xs" className="w-20 text-right flex-shrink-0">
            {issue.repoActivity}
          </MonoText>
        </div>
      </div>
    </div>
  );
}
