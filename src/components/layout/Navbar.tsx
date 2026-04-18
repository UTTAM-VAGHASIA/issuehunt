"use client";

import Link from "next/link";
import { Github, Sparkles } from "lucide-react";
import { MonoText } from "@/components/ui/MonoText";
import { Avatar } from "@/components/ui/Avatar";
import { useUser } from "@/lib/hooks/useUser";

interface NavbarProps {
  variant?: "landing" | "app";
}

export function Navbar({ variant = "landing" }: NavbarProps) {
  const user = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-background border-b border-border">
      <Link href="/" className="flex items-center gap-2">
        <Sparkles size={20} className="text-accent" fill="#F97316" />
        <span className="font-sans font-medium text-text-primary text-[15px] tracking-tight">
          issuehunt
        </span>
      </Link>

      {variant === "landing" ? (
        <Link
          href="/mode"
          className="flex items-center gap-2 px-4 py-2 rounded-btn border border-border text-[14px] font-sans text-text-muted transition-all hover:border-accent hover:text-accent"
        >
          <Github size={16} />
          Sign in with GitHub
        </Link>
      ) : (
        <div className="flex items-center gap-3">
          <Avatar src={user?.avatar ?? ""} alt={user?.name ?? ""} size={28} />
          <MonoText muted size="sm">
            {user?.username ?? ""}
          </MonoText>
        </div>
      )}
    </nav>
  );
}
