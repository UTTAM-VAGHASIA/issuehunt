import { MonoText } from "@/components/ui/MonoText";

interface HuntStatsProps {
  swiped: number;
  saved: number;
  skipped: number;
}

export function HuntStats({ swiped, saved, skipped }: HuntStatsProps) {
  const stats = [
    { label: "Swiped", value: swiped },
    { label: "Saved", value: saved },
    { label: "Skipped", value: skipped },
  ];

  return (
    <div>
      <MonoText size="xs" muted className="uppercase tracking-widest block mb-4">
        Today's Hunt
      </MonoText>
      <div className="flex flex-col gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <MonoText size="xs" muted>
              {label}
            </MonoText>
            <span className="font-mono text-[24px] text-text-primary leading-none">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
