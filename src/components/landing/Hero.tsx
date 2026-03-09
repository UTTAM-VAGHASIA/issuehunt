import Link from "next/link";
import { MonoText } from "@/components/ui/MonoText";

export function Hero() {
  return (
    <div className="flex flex-col items-center text-center max-w-[680px] mx-auto px-4">
      <MonoText
        className="text-accent tracking-[0.1em] uppercase text-[12px] mb-6"
        size="xs"
      >
        Open Source Contribution
      </MonoText>

      <h1
        className="font-sans font-medium text-text-primary leading-[1.15] mb-5"
        style={{ fontSize: "clamp(36px, 5vw, 52px)" }}
      >
        Find issues worth
        <br />
        your time.
      </h1>

      <p className="font-sans text-[18px] text-text-muted leading-relaxed max-w-[420px]">
        Stop searching. Start contributing. IssueHunt matches open source GitHub issues to your
        exact skill set — or helps you explore a new language.
      </p>

      <Link
        href="/mode"
        className="mt-10 inline-flex items-center gap-2 bg-accent text-background font-sans font-medium text-[15px] px-7 py-[14px] rounded-btn transition-all hover:bg-[#EA6C10] hover:scale-[1.02]"
      >
        Start Hunting →
      </Link>

      <p className="mt-3 text-[13px] text-text-muted font-sans">
        Free · No credit card · Login with GitHub
      </p>

      <div className="mt-12 flex items-center gap-3 flex-wrap justify-center">
        <MonoText size="xs">
          <span className="text-text-primary">127,439</span>{" "}
          <span className="text-text-muted">issues available</span>
        </MonoText>
        <span className="text-border">·</span>
        <MonoText size="xs">
          <span className="text-text-primary">43</span>{" "}
          <span className="text-text-muted">languages</span>
        </MonoText>
        <span className="text-border">·</span>
        <MonoText size="xs" muted>
          Updated live
        </MonoText>
      </div>
    </div>
  );
}
