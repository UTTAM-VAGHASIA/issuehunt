"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModeCardProps {
  href: string;
  accentColor: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  children?: ReactNode;
  className?: string;
}

export function ModeCard({
  href,
  accentColor,
  icon,
  title,
  subtitle,
  children,
  className,
}: ModeCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "block bg-surface border border-border rounded-[12px] p-7 cursor-pointer transition-all",
        "hover:border-[#2A2A3E] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
        className
      )}
      style={{
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div style={{ color: accentColor }}>{icon}</div>
        <h3 className="font-sans font-medium text-[18px] text-text-primary">{title}</h3>
      </div>
      <p className="font-sans text-[14px] text-text-muted">{subtitle}</p>
      {children}
    </Link>
  );
}
