import { cookies } from "next/headers";

/**
 * Returns the GitHub provider token from the persistent gh_token cookie.
 */
export async function getGithubToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("gh_token")?.value ?? null;
}
