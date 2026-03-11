"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
}

export function useUser(): UserProfile | null {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      setProfile({
        name: u.user_metadata?.full_name ?? u.user_metadata?.user_name ?? "User",
        username: u.user_metadata?.user_name ?? "",
        avatar: u.user_metadata?.avatar_url ?? "",
      });
    });
  }, []);

  return profile;
}
