import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGithubToken } from "@/lib/github-token";
import { GhState } from "@/lib/types/saved";

interface IssueRef {
  repoName: string;
  issueNumber: number;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = await getGithubToken();
  if (!token) return NextResponse.json({ error: "No GitHub token" }, { status: 401 });

  const { issues }: { issues: IssueRef[] } = await request.json();
  if (!Array.isArray(issues) || issues.length === 0) {
    return NextResponse.json({ states: {} });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const results = await Promise.allSettled(
    issues.map(async ({ repoName, issueNumber }) => {
      const res = await fetch(
        `https://api.github.com/repos/${repoName}/issues/${issueNumber}`,
        { headers }
      );
      if (!res.ok) return { key: `${repoName}#${issueNumber}`, state: "open" as GhState };
      const data = await res.json();
      let state: GhState = "open";
      if (data.state === "closed") {
        state = data.state_reason === "completed" ? "solved" : "closed";
      }
      return { key: `${repoName}#${issueNumber}`, state };
    })
  );

  const states: Record<string, GhState> = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      states[result.value.key] = result.value.state;
    }
  }

  return NextResponse.json({ states });
}
