import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGithubToken } from "@/lib/github-token";

async function fetchGithubLanguages(token: string): Promise<string[]> {
  try {
    const res = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=pushed&affiliation=owner,collaborator",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (!res.ok) return [];
    const repos: { language: string | null }[] = await res.json();
    const counts: Record<string, number> = {};
    for (const repo of repos) {
      if (repo.language) counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([lang]) => lang);
  } catch {
    return [];
  }
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("default_mode, languages, cards_per_session, show_activity_score, show_response_time")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If no saved languages, derive from GitHub repos
  let defaultLanguages = settings?.languages;
  if (!defaultLanguages) {
    const token = await getGithubToken();
    defaultLanguages = token ? await fetchGithubLanguages(token) : [];
    if (!defaultLanguages.length) defaultLanguages = ["Python", "TypeScript", "JavaScript"];
  }

  return NextResponse.json({
    settings: {
      default_mode: settings?.default_mode ?? "match",
      languages: defaultLanguages,
      cards_per_session: settings?.cards_per_session ?? 20,
      show_activity_score: settings?.show_activity_score ?? true,
      show_response_time: settings?.show_response_time ?? true,
    },
    profile: {
      name: user.user_metadata?.full_name ?? user.user_metadata?.user_name ?? "User",
      username: user.user_metadata?.user_name ?? "",
      avatar_url: user.user_metadata?.avatar_url ?? "",
    },
  });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const allowed = [
    "default_mode",
    "languages",
    "cards_per_session",
    "show_activity_score",
    "show_response_time",
  ];
  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  // Type validation
  if ("default_mode" in patch && !["match", "explore"].includes(patch.default_mode as string)) {
    return NextResponse.json({ error: "default_mode must be 'match' or 'explore'" }, { status: 400 });
  }
  if ("languages" in patch && !Array.isArray(patch.languages)) {
    return NextResponse.json({ error: "languages must be an array" }, { status: 400 });
  }
  if ("cards_per_session" in patch && (typeof patch.cards_per_session !== "number" || patch.cards_per_session < 1 || patch.cards_per_session > 100)) {
    return NextResponse.json({ error: "cards_per_session must be a number between 1 and 100" }, { status: 400 });
  }
  if ("show_activity_score" in patch && typeof patch.show_activity_score !== "boolean") {
    return NextResponse.json({ error: "show_activity_score must be a boolean" }, { status: 400 });
  }
  if ("show_response_time" in patch && typeof patch.show_response_time !== "boolean") {
    return NextResponse.json({ error: "show_response_time must be a boolean" }, { status: 400 });
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { error } = await supabase
    .from("user_settings")
    .upsert({ user_id: user.id, ...patch }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
