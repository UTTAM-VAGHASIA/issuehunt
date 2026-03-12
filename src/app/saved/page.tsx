"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SavedIssueRow } from "@/components/saved/SavedIssueRow";
import { RealSavedIssue, IssueStatus, GhState } from "@/lib/types/saved";
import { cn } from "@/lib/utils";

type Filter = "all" | "todo" | "in-progress" | "done";

const filterLabels: Record<Filter, string> = {
  all: "All",
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export default function SavedPage() {
  const [issues, setIssues] = useState<RealSavedIssue[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/saved");
      if (!res.ok) { setLoading(false); return; }

      const { saved } = await res.json();
      const mapped: RealSavedIssue[] = (saved ?? []).map((row: {
        id: string;
        github_issue_id: number;
        repo_name: string;
        issue_number: number;
        title: string;
        labels: string[];
        language: string;
        repo_avatar: string;
        status: IssueStatus;
        saved_at: string;
      }) => ({
        id: row.id,
        githubIssueId: row.github_issue_id,
        repoName: row.repo_name,
        number: row.issue_number,
        title: row.title,
        labels: row.labels,
        language: row.language,
        repoAvatar: row.repo_avatar,
        status: row.status,
        savedAt: row.saved_at,
      }));

      setIssues(mapped);
      setLoading(false);

      if (mapped.length === 0) return;

      // Check GitHub for closed/solved status
      const checkRes = await fetch("/api/saved/status-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issues: mapped.map((i) => ({ repoName: i.repoName, issueNumber: i.number })),
        }),
      });
      if (!checkRes.ok) return;

      const { states }: { states: Record<string, GhState> } = await checkRes.json();
      setIssues((prev) =>
        prev.map((i) => ({
          ...i,
          ghState: states[`${i.repoName}#${i.number}`] ?? "open",
        }))
      );
    }

    load();
  }, []);

  const handleStatusChange = async (id: string, status: IssueStatus) => {
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    await fetch(`/api/saved/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const handleDelete = async (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/saved/${id}`, { method: "DELETE" });
  };

  const filtered =
    filter === "all" ? issues : issues.filter((i) => i.status === filter);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <AppHeader />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto px-6 py-8 pb-20 md:pb-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="font-sans font-bold text-[24px] text-text-primary">
                Saved Issues
              </h1>
              {!loading && (
                <span className="font-mono text-[12px] bg-accent text-background px-2 py-0.5 rounded-full">
                  {issues.length}
                </span>
              )}
            </div>
            <button className="flex items-center gap-1.5 text-[13px] text-accent hover:underline font-sans">
              Open all in GitHub
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(Object.keys(filterLabels) as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "font-mono text-[12px] px-3 py-1 rounded-full border transition-all",
                  filter === f
                    ? "bg-accent text-background border-accent"
                    : "border-border text-text-muted hover:border-[#2A2A3E]"
                )}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>

          {/* Issue list */}
          <div className="flex flex-col">
            {loading ? (
              <p className="font-mono text-[13px] text-text-muted text-center py-16">
                Loading saved issues…
              </p>
            ) : filtered.length === 0 ? (
              <p className="font-mono text-[13px] text-text-muted text-center py-16">
                {filter === "all"
                  ? "No saved issues yet. Start swiping on the Hunt page!"
                  : `No ${filterLabels[filter].toLowerCase()} issues found.`}
              </p>
            ) : (
              filtered.map((issue) => (
                <SavedIssueRow
                  key={issue.id}
                  issue={issue}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <BottomNav />

      {/* Background glow blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            top: "-10%", right: "-10%",
            width: "40%", height: "40%",
            background: "rgba(249,115,22,0.04)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-10%", left: "-10%",
            width: "30%", height: "30%",
            background: "rgba(59,130,246,0.04)",
            filter: "blur(100px)",
          }}
        />
      </div>
    </div>
  );
}
