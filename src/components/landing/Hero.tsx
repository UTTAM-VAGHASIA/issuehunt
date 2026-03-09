import Link from "next/link";

export function Hero() {
  return (
    <>
      {/* Eyebrow */}
      <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-accent uppercase mb-6">
        Open Source Contribution
      </p>

      {/* Headline */}
      <h2 className="text-[52px] font-medium leading-[1.1] tracking-tight text-text-primary mb-6">
        Find issues worth <br />
        your time.
      </h2>

      {/* Subheadline */}
      <p className="mx-auto max-w-[420px] text-lg text-text-muted leading-relaxed mb-10">
        Stop searching. Start contributing. We aggregate the best opportunities from across the
        open-source ecosystem.
      </p>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 mb-16">
        <Link
          href="/mode"
          className="flex items-center justify-center rounded-lg bg-accent px-7 py-3.5 text-sm font-bold text-background transition-transform hover:scale-105"
        >
          Start Hunting →
        </Link>
        <p className="text-xs text-text-muted font-medium font-sans">
          Free · No credit card · Login with GitHub
        </p>
      </div>

      {/* Stats row — with border */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-mono text-xs border-y border-[rgba(30,30,46,0.5)] py-6 mb-20 w-full">
        <div className="flex items-center gap-2">
          <span className="text-text-primary">127,439</span>
          <span className="text-text-muted uppercase">issues available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-primary">43</span>
          <span className="text-text-muted uppercase">languages</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-success">●</span>
          <span className="text-text-muted uppercase">Updated live</span>
        </div>
      </div>
    </>
  );
}
