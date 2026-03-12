import { cookies } from "next/headers";
import { Session } from "@supabase/supabase-js";

/**
 * Returns the GitHub provider token.
 * Tries session.provider_token first (present right after OAuth),
 * then falls back to the persistent gh_token cookie (survives Supabase token refresh).
 */
export async function getGithubToken(session: Session): Promise<string | null> {
  if (session.provider_token) return session.provider_token;
  const cookieStore = await cookies();
  return cookieStore.get("gh_token")?.value ?? null;
}
