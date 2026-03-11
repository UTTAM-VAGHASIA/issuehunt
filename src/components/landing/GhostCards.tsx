interface GithubIssue {
  id: number;
  number: number;
  title: string;
  labels: { name: string; color: string }[];
  created_at: string;
}

interface GhostCardsProps {
  issues?: GithubIssue[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "just now";
}

const FALLBACK = {
  number: 1234,
  title: "Improve hydration error reporting for nested RSC components",
  labels: [
    { name: "Help Wanted", color: "F97316" },
    { name: "TypeScript", color: "60A5FA" },
  ],
  created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
};

export function GhostCards({ issues = [] }: GhostCardsProps) {
  const front = issues[0] ?? FALLBACK;
  const frontLabels = front.labels.slice(0, 2);

  return (
    <div className="relative w-full h-64 mt-auto">
      {/* Back card */}
      <div
        className="absolute bottom-0 left-1/2 w-full max-w-[580px] h-32 rounded-xl border border-[rgba(30,30,46,0.3)]"
        style={{
          transform: "translateX(-50%) scale(0.9) translateY(48px)",
          opacity: 0.2,
          backdropFilter: "blur(8px)",
          background: "linear-gradient(180deg, rgba(35,23,15,0.4) 0%, rgba(10,10,15,0.8) 100%)",
          zIndex: 0,
        }}
      />

      {/* Middle card */}
      <div
        className="absolute bottom-0 left-1/2 w-full max-w-[630px] h-40 rounded-xl border border-[rgba(30,30,46,0.4)]"
        style={{
          transform: "translateX(-50%) scale(0.95) translateY(24px)",
          opacity: 0.4,
          backdropFilter: "blur(8px)",
          background: "linear-gradient(180deg, rgba(35,23,15,0.4) 0%, rgba(10,10,15,0.8) 100%)",
          zIndex: 1,
        }}
      />

      {/* Front card — real issue from git/git */}
      <div
        className="absolute bottom-0 left-1/2 w-full h-48 rounded-xl border border-[rgba(100,100,120,0.5)] bg-[rgba(17,17,24,0.95)] p-6 text-left shadow-2xl"
        style={{ transform: "translateX(-50%)", zIndex: 2 }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1 min-w-0">
            {/* Repo row */}
            <div className="flex items-center gap-2">
              <img
                src="https://github.com/git.png"
                alt="git"
                className="w-5 h-5 rounded-full flex-shrink-0"
              />
              <span className="text-xs text-text-muted font-mono">
                git / git · #{front.number}
              </span>
            </div>
            {/* Issue title */}
            <h4 className="text-text-primary font-semibold text-base font-sans leading-snug line-clamp-2">
              {front.title}
            </h4>
            {/* Labels */}
            {frontLabels.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {frontLabels.map((label) => (
                  <span
                    key={label.name}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono"
                    style={{
                      background: `rgba(${parseInt(label.color.slice(0, 2), 16)},${parseInt(label.color.slice(2, 4), 16)},${parseInt(label.color.slice(4, 6), 16)},0.15)`,
                      color: `#${label.color}`,
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Time */}
          <span className="text-xs font-mono text-text-muted flex-shrink-0 ml-4">
            {timeAgo(front.created_at)}
          </span>
        </div>
      </div>

      {/* Gradient fade */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #0A0A0F, transparent)",
          zIndex: 3,
        }}
      />
    </div>
  );
}
