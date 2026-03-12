import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGithubToken } from "@/lib/github-token";
import { Issue } from "@/lib/mock-data";

function formatStars(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return "just now";
}

function activityLevel(
  stars: number,
  updatedAt: string
): { level: "Very active" | "Active" | "Moderate"; score: number } {
  const daysSince =
    (Date.now() - new Date(updatedAt).getTime()) / 86400000;
  if (stars > 10000 && daysSince < 7) return { level: "Very active", score: 95 };
  if (stars > 1000 || daysSince < 30) return { level: "Active", score: 70 };
  return { level: "Moderate", score: 45 };
}

const GH_HEADERS = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") ?? "match";
  const page = parseInt(searchParams.get("page") ?? "1");
  const goodFirstIssue = searchParams.get("goodFirstIssue") !== "false";

  // Get user's preferred languages
  const { data: settings } = await supabase
    .from("user_settings")
    .select("languages, cards_per_session")
    .eq("user_id", user.id)
    .single();
  const languages: string[] = settings?.languages ?? ["Python", "TypeScript", "JavaScript"];
  const cardsPerSession: number = settings?.cards_per_session ?? 20;

  // Build search query
  let q = goodFirstIssue
    ? 'is:open is:issue label:"good first issue"'
    : "is:open is:issue";
  if (mode === "match") {
    q += " " + languages.map((l) => `language:${l}`).join(" ");
  }

  // Collect already-seen issue IDs
  const [{ data: savedRows }, { data: historyRows }] = await Promise.all([
    supabase
      .from("saved_issues")
      .select("github_issue_id")
      .eq("user_id", user.id),
    supabase
      .from("history")
      .select("github_issue_id")
      .eq("user_id", user.id),
  ]);
  const seenIds = new Set([
    ...(savedRows ?? []).map((r) => r.github_issue_id),
    ...(historyRows ?? []).map((r) => r.github_issue_id),
  ]);

  const token = await getGithubToken();
  if (!token) return NextResponse.json({ error: "No GitHub token" }, { status: 401 });
  const searchRes = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=50&page=${page}&sort=updated`,
    { headers: GH_HEADERS(token) }
  );

  if (!searchRes.ok) {
    return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
  }

  interface GHIssue {
    id: number;
    number: number;
    title: string;
    body: string | null;
    repository_url: string;
    created_at: string;
    comments: number;
    assignee: unknown;
    labels: { name: string }[];
  }

  interface GHRepo {
    stargazers_count?: number;
    updated_at?: string;
    language?: string;
    owner?: { avatar_url?: string };
  }

  const searchData = await searchRes.json();
  const unseen = (searchData.items as GHIssue[] ?? []).filter(
    (i) => !seenIds.has(i.id)
  );

  // Fetch repo details for unique repos (in parallel)
  const repoUrls = [...new Set(unseen.map((i) => i.repository_url))] as string[];
  const repoMap: Record<string, GHRepo> = {};
  await Promise.all(
    repoUrls.slice(0, 20).map(async (url) => {
      const res = await fetch(url, { headers: GH_HEADERS(token) });
      if (res.ok) repoMap[url] = await res.json() as GHRepo;
    })
  );

  // Map GitHub items → Issue interface
  const issues: Issue[] = unseen.slice(0, cardsPerSession).map((item) => {
    const repo = repoMap[item.repository_url] ?? {};
    const { level, score } = activityLevel(
      repo.stargazers_count ?? 0,
      repo.updated_at ?? item.created_at
    );
    const repoName = item.repository_url.replace(
      "https://api.github.com/repos/",
      ""
    );
    return {
      id: String(item.id),
      number: item.number,
      title: item.title,
      body: (item.body ?? "").slice(0, 400),
      repoName,
      repoStars: formatStars(repo.stargazers_count ?? 0),
      repoAvatar:
        repo.owner?.avatar_url ??
        `https://github.com/${repoName.split("/")[0]}.png`,
      language: repo.language ?? "Unknown",
      labels: item.labels
        .map((l) => l.name)
        .filter((l) => l !== "good first issue"),
      openedAgo: timeAgo(item.created_at),
      commentCount: item.comments,
      hasAssignee: item.assignee !== null,
      hasContributing: true,
      maintainerResponseTime: "~varies",
      repoActivity: level,
      activityScore: score,
      responseScore: 70,
    };
  });

  return NextResponse.json({ issues, total: searchData.total_count });
}
