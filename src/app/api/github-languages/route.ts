import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGithubToken } from "@/lib/github-token";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = await getGithubToken(session);
  if (!token) return NextResponse.json({ error: "No GitHub token" }, { status: 401 });

  // Fetch user's repos (up to 100, most recently pushed)
  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=pushed&affiliation=owner",
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
  }

  const repos: { language: string | null }[] = await res.json();

  // Count language frequency (skip nulls and forks with no language)
  const counts: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }
  }

  // Sort by frequency, return top 6
  const languages = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang]) => lang);

  return NextResponse.json({ languages });
}
