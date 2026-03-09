"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { MonoText } from "@/components/ui/MonoText";
import { MOCK_USER } from "@/lib/mock-data";

const navItems = [
  { label: "Hunt", href: "/hunt" },
  { label: "Saved", href: "/saved", badge: MOCK_USER.savedCount },
  { label: "History", href: "/history" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

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
              {item.badge && (
                <span className="text-[11px] font-mono bg-accent text-background px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 pb-6 border-t border-border pt-4">
        <div className="flex items-center gap-2 mb-1">
          <Avatar src={MOCK_USER.avatar} alt={MOCK_USER.name} size={32} />
          <MonoText size="sm">{MOCK_USER.username}</MonoText>
        </div>
        <button className="text-[12px] text-text-muted hover:text-danger transition-colors mt-1 ml-10">
          disconnect
        </button>
      </div>
    </aside>
  );
}
