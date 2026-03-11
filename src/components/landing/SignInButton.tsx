"use client";

import { createClient } from "@/lib/supabase/client";

interface SignInButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function SignInButton({ className, children }: SignInButtonProps) {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button onClick={handleSignIn} className={className}>
      {children}
    </button>
  );
}
