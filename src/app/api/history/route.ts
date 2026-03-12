import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: rows, error } = await supabase
    .from("history")
    .select("id, github_issue_id, repo_name, issue_number, title, language, action, swiped_at")
    .eq("user_id", user.id)
    .order("swiped_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const history = (rows ?? []).map((row) => ({
    id: row.id as string,
    issue: {
      id: String(row.github_issue_id),
      number: row.issue_number as number,
      title: row.title as string,
      body: "",
      repoName: row.repo_name as string,
      repoStars: "0",
      repoAvatar: `https://github.com/${(row.repo_name as string).split("/")[0]}.png`,
      language: row.language as string,
      labels: [],
      openedAgo: "",
      commentCount: 0,
      hasAssignee: false,
      hasContributing: false,
      maintainerResponseTime: "",
      repoActivity: "Moderate" as const,
      activityScore: 0,
      responseScore: 0,
    },
    action: row.action as "saved" | "skipped",
    date: (row.swiped_at as string).split("T")[0],
    timeAgo: timeAgo(row.swiped_at as string),
  }));

  // Build activeDays: Record<"YYYY-MM", number[]> — unique days per month
  const activeDays: Record<string, number[]> = {};
  for (const entry of history) {
    const [year, month, dayStr] = entry.date.split("-");
    const key = `${year}-${month}`;
    const day = parseInt(dayStr, 10);
    if (!activeDays[key]) activeDays[key] = [];
    if (!activeDays[key].includes(day)) activeDays[key].push(day);
  }

  return NextResponse.json({ history, activeDays });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const issue = await request.json();

  const { error } = await supabase.from("history").insert({
    user_id: user.id,
    github_issue_id: parseInt(issue.id),
    repo_name: issue.repoName,
    issue_number: issue.number,
    title: issue.title,
    language: issue.language,
    action: "skipped",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
