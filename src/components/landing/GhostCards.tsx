export function GhostCards() {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
      <div className="relative mx-auto w-full max-w-[680px] px-6 h-64">
        {/* Back card — blurred abstract box */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[580px] h-32 rounded-xl border border-[rgba(30,30,46,0.3)] z-0"
          style={{
            opacity: 0.2,
            transform: "translateX(-50%) scale(0.9) translateY(48px)",
            backdropFilter: "blur(8px)",
            background:
              "linear-gradient(180deg, rgba(35,23,15,0.4) 0%, rgba(10,10,15,0.8) 100%)",
          }}
        />

        {/* Middle card — blurred abstract box */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[630px] h-40 rounded-xl border border-[rgba(30,30,46,0.4)] z-10"
          style={{
            opacity: 0.4,
            transform: "translateX(-50%) scale(0.95) translateY(24px)",
            backdropFilter: "blur(8px)",
            background:
              "linear-gradient(180deg, rgba(35,23,15,0.4) 0%, rgba(10,10,15,0.8) 100%)",
          }}
        />

        {/* Front card — real content */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 rounded-xl border border-[rgba(100,100,120,0.5)] bg-[rgba(17,17,24,0.9)] p-6 text-left z-20 shadow-2xl"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              {/* Repo row */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-border flex-shrink-0" />
                <span className="text-xs text-text-muted font-mono">vercel / next.js</span>
              </div>
              {/* Issue title */}
              <h4 className="text-text-primary font-semibold text-base font-sans leading-snug">
                Improve hydration error reporting for nested RSC components
              </h4>
              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono"
                  style={{
                    background: "rgba(249,115,22,0.1)",
                    color: "#F97316",
                  }}
                >
                  Help Wanted
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    color: "#60A5FA",
                  }}
                >
                  TypeScript
                </span>
              </div>
            </div>
            {/* Time */}
            <span className="text-xs font-mono text-text-muted flex-shrink-0 ml-4">2h ago</span>
          </div>
        </div>

        {/* Gradient fade-out at bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-32 z-30"
          style={{
            background: "linear-gradient(to top, #0A0A0F, transparent)",
          }}
        />
      </div>
    </div>
  );
}
