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

/** Estimate maintainer responsiveness from comment engagement and repo recency. */
function computeResponseScore(
  commentCount: number,
  stars: number,
  updatedAt: string
): number {
  const daysSince = (Date.now() - new Date(updatedAt).getTime()) / 86400000;
  let score = 0;
  // Recency of last repo activity
  if (daysSince < 3) score += 50;
  else if (daysSince < 7) score += 40;
  else if (daysSince < 30) score += 25;
  else score += 10;
  // Comment engagement (each comment signals maintainer interaction)
  score += Math.min(commentCount * 5, 30);
  // Popular repos tend to have dedicated maintainer teams
  if (stars > 10000) score += 20;
  else if (stars > 1000) score += 10;
  return Math.min(score, 100);
}

/** Human-readable estimate of response time based on repo update recency. */
function computeResponseTime(updatedAt: string): string {
  const daysSince = (Date.now() - new Date(updatedAt).getTime()) / 86400000;
  if (daysSince < 3) return "< 3 days";
  if (daysSince < 7) return "< 1 week";
  if (daysSince < 30) return "< 1 month";
  return "Varies";
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
    has_contributing?: boolean; // populated from community profile fetch
  }

  const searchData = await searchRes.json();
  const unseen = (searchData.items as GHIssue[] ?? []).filter(
    (i) => !seenIds.has(i.id)
  );

  // Fetch repo details + community profile for all unique repos in parallel.
  // No artificial slice — every repo in the result set gets metadata.
  const repoUrls = [...new Set(unseen.map((i) => i.repository_url))] as string[];
  const repoMap: Record<string, GHRepo> = {};
  await Promise.all(
    repoUrls.map(async (url) => {
      const repoName = url.replace("https://api.github.com/repos/", "");
      const [repoRes, profileRes] = await Promise.all([
        fetch(url, { headers: GH_HEADERS(token) }),
        fetch(
          `https://api.github.com/repos/${repoName}/community/profile`,
          { headers: GH_HEADERS(token) }
        ),
      ]);
      if (repoRes.ok) {
        const repoData = await repoRes.json() as GHRepo;
        if (profileRes.ok) {
          const profile = await profileRes.json() as { files?: { contributing?: unknown } };
          repoData.has_contributing = profile.files?.contributing != null;
        } else {
          repoData.has_contributing = false;
        }
        repoMap[url] = repoData;
      }
    })
  );

  // Map GitHub items → Issue interface
  const issues: Issue[] = unseen.slice(0, cardsPerSession).map((item) => {
    const repo = repoMap[item.repository_url] ?? {};
    const { level, score } = activityLevel(
      repo.stargazers_count ?? 0,
      repo.updated_at ?? item.created_at
    );
    const effectiveUpdatedAt = repo.updated_at ?? item.created_at;
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
      hasContributing: repo.has_contributing ?? false,
      maintainerResponseTime: computeResponseTime(effectiveUpdatedAt),
      repoActivity: level,
      activityScore: score,
      responseScore: computeResponseScore(
        item.comments,
        repo.stargazers_count ?? 0,
        effectiveUpdatedAt
      ),
    };
  });

  return NextResponse.json({ issues, total: searchData.total_count });
}
