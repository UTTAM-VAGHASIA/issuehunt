"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";

export function AppHeader() {
  const user = useUser();

  return (
    <header
      className="w-full border-b border-border sticky top-0 z-50 flex-shrink-0"
      style={{ backgroundColor: "rgba(10,10,15,0.5)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-accent p-1.5 rounded-lg flex items-center justify-center">
            <Sparkles size={20} className="text-white" fill="white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary font-sans">
            IssueHunt
          </h1>
        </Link>

        {/* User pill */}
        {user && (
          <div className="flex items-center gap-3 bg-surface border border-border px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium text-text-primary font-sans">
              {user.username || user.name.split(" ")[0].toLowerCase()}
            </span>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[rgba(249,115,22,0.3)] flex-shrink-0">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center text-xs text-text-muted font-mono">
                  {user.username?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
