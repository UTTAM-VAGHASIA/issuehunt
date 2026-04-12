import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGithubToken } from "@/lib/github-token";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = await getGithubToken();
  if (!token) return NextResponse.json({ error: "No GitHub token" }, { status: 401 });

  let repoName: string;
  let githubIssueId: number;
  let issueNumber: number;

  try {
    const body = await request.json() as { repoName: string; githubIssueId: number; issueNumber: number };
    repoName = body.repoName;
    githubIssueId = body.githubIssueId;
    issueNumber = body.issueNumber;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!repoName || !githubIssueId || !issueNumber) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate repoName format: "owner/repo"
  if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(repoName)) {
    return NextResponse.json({ error: "Invalid repo name format" }, { status: 400 });
  }

  // Fork the repo via GitHub API
  const forkRes = await fetch(`https://api.github.com/repos/${repoName}/forks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!forkRes.ok) {
    const err = await forkRes.json() as { message?: string; errors?: unknown };
    console.error("[fork] GitHub API error", forkRes.status, err);
    return NextResponse.json(
      { error: err.message ?? "GitHub fork failed" },
      { status: 502 }
    );
  }

  const fork = await forkRes.json() as { html_url: string; full_name: string };

  // Record the claim in Supabase (upsert to avoid duplicates)
  await supabase.from("claimed_issues").upsert(
    {
      user_id: user.id,
      github_issue_id: githubIssueId,
      repo_name: repoName,
      issue_number: issueNumber,
    },
    { onConflict: "user_id,github_issue_id" }
  );

  return NextResponse.json({ forkUrl: fork.html_url, forkName: fork.full_name });
}
