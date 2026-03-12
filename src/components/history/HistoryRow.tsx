import { ExternalLink } from "lucide-react";
import { HistoryEntry } from "@/lib/mock-data";
import { Tag } from "@/components/ui/Tag";
import { MonoText } from "@/components/ui/MonoText";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface HistoryRowProps {
  entry: HistoryEntry;
  className?: string;
}

export function HistoryRow({ entry, className }: HistoryRowProps) {
  const { issue, action, timeAgo } = entry;
  const isSaved = action === "saved";

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 h-16 border-b border-border hover:bg-surface/80 transition-colors relative",
        className
      )}
    >
      {/* Left accent stripe — instant visual scan */}
      <div
        className="absolute left-0 top-[20%] bottom-[20%] w-[2px] rounded-full"
        style={{
          background: isSaved
            ? "rgba(34,197,94,0.5)"
            : "rgba(30,30,46,0.8)",
        }}
      />

      {/* Repo avatar */}
      <Avatar src={issue.repoAvatar} alt={issue.repoName} size={28} className="flex-shrink-0 ml-1" />

      {/* Left: repo + title */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <MonoText size="xs" muted className="block truncate">
          {issue.repoName} · {timeAgo}
        </MonoText>
        <p className="font-sans text-[13px] text-text-primary truncate mt-0.5 leading-snug">
          {issue.title}
        </p>
      </div>

      {/* Middle: language tag (hidden on small screens) */}
      <div className="hidden sm:flex items-center flex-shrink-0">
        <Tag label={issue.language} variant="language" />
      </div>

      {/* Right: action badge + link */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span
          className={cn(
            "font-mono text-[10px] px-2 py-0.5 rounded border tracking-wide",
            isSaved
              ? "bg-success/8 text-success border-success/20"
              : "text-text-muted border-border"
          )}
        >
          {isSaved ? "saved" : "skipped"}
        </span>
        <a
          href={`https://github.com/${issue.repoName}/issues/${issue.number}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${issue.repoName}#${issue.number} on GitHub`}
          className="text-[12px] text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
        >
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
