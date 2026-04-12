import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_issues")
    .select("*")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ saved: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const issue = await request.json();

  if (
    !issue.id ||
    !issue.repoName ||
    !issue.number ||
    !issue.title ||
    !issue.language
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsedId = parseInt(issue.id);
  if (isNaN(parsedId)) {
    return NextResponse.json({ error: "Invalid issue id" }, { status: 400 });
  }

  const record = {
    user_id: user.id,
    github_issue_id: parsedId,
    repo_name: issue.repoName,
    issue_number: issue.number,
    title: issue.title,
    labels: issue.labels,
    language: issue.language,
    repo_avatar: issue.repoAvatar,
    status: "todo",
  };

  // Insert saved issue + write history entry in parallel
  const [saveResult] = await Promise.all([
    supabase.from("saved_issues").insert(record).select().single(),
    supabase.from("history").insert({
      user_id: user.id,
      github_issue_id: parsedId,
      repo_name: issue.repoName,
      issue_number: issue.number,
      title: issue.title,
      language: issue.language,
      action: "saved",
    }),
  ]);

  if (saveResult.error)
    return NextResponse.json({ error: saveResult.error.message }, { status: 500 });
  return NextResponse.json({ saved: saveResult.data });
}
