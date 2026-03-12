import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ issueId: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { issueId } = await params;
  const githubIssueId = parseInt(issueId, 10);

  if (isNaN(githubIssueId)) {
    return NextResponse.json({ error: "Invalid issue ID" }, { status: 400 });
  }

  const { count, error } = await supabase
    .from("claimed_issues")
    .select("*", { count: "exact", head: true })
    .eq("github_issue_id", githubIssueId);

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ count: count ?? 0 });
}
