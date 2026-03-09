import { MOCK_ISSUES } from "@/lib/mock-data";
import { IssueCard } from "@/components/hunt/IssueCard";

export function GhostCards() {
  const cards = MOCK_ISSUES.slice(0, 3);

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[520px] h-[400px] pointer-events-none overflow-hidden px-4">
      {/* Back card */}
      <div
        className="absolute inset-x-4 top-0"
        style={{
          transform: "scale(0.90) translateY(24px)",
          opacity: 0.2,
          filter: "blur(4px)",
          transformOrigin: "bottom center",
        }}
      >
        <IssueCard issue={cards[2]} />
      </div>

      {/* Middle card */}
      <div
        className="absolute inset-x-4 top-0"
        style={{
          transform: "scale(0.95) translateY(12px)",
          opacity: 0.4,
          filter: "blur(2px)",
          transformOrigin: "bottom center",
        }}
      >
        <IssueCard issue={cards[1]} />
      </div>

      {/* Front card */}
      <div
        className="absolute inset-x-4 top-0"
        style={{ opacity: 0.85 }}
      >
        <IssueCard issue={cards[0]} />
      </div>
    </div>
  );
}
