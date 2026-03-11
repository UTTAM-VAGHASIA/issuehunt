"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MonoText } from "@/components/ui/MonoText";
import { useUser } from "@/lib/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Hunt", href: "/hunt" },
  { label: "Saved", href: "/saved" },
  { label: "History", href: "/history" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 h-full bg-background border-r border-border">
      <nav className="flex flex-col gap-1 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-[10px] rounded-lg text-[14px] font-sans transition-all",
                isActive
                  ? "bg-surface text-text-primary"
                  : "text-text-muted hover:bg-surface hover:text-text-primary"
              )}
            >
              <div className="flex items-center gap-2">
                {isActive && (
                  <span className="w-[6px] h-[6px] rounded-full bg-accent flex-shrink-0" />
                )}
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 pb-6 border-t border-border pt-4">
        {user && (
          <div className="flex items-center gap-2 mb-1">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs text-text-muted font-mono flex-shrink-0">
                {user.username?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <MonoText size="sm">@{user.username}</MonoText>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="text-[12px] text-text-muted hover:text-danger transition-colors mt-1 ml-10"
        >
          disconnect
        </button>
      </div>
    </aside>
  );
}
