import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
