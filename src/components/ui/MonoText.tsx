import { cn } from "@/lib/utils";

interface MonoTextProps {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "base";
  muted?: boolean;
}

export function MonoText({ children, className, size = "sm", muted = false }: MonoTextProps) {
  const sizeClass = {
    xs: "text-[11px]",
    sm: "text-[13px]",
    base: "text-[14px]",
  }[size];

  return (
    <span
      className={cn(
        "font-mono",
        sizeClass,
        muted ? "text-text-muted" : "text-text-primary",
        className
      )}
    >
      {children}
    </span>
  );
}
