export function TrustHealthMeter({ value = 98.2 }: { value?: number }) {
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-32">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="oklch(0.27 0.008 270)" strokeWidth="6" fill="none" />
          <circle
            cx="50" cy="50" r="42"
            stroke="oklch(0.72 0.17 158)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="mono text-2xl font-medium">{value.toFixed(1)}</span>
          <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground">Optimal</span>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-2 gap-2">
        <Stat label="Total Agents" value="12,842" />
        <Stat label="24h Slashes" value="03" tone="text-pharos-amber" />
        <Stat label="Volume 24h" value="42.1M" />
        <Stat label="Median Score" value="86.4" tone="text-pharos-green" />
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded border border-border bg-surface px-2 py-1.5">
      <div className="mono text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mono text-sm ${tone}`}>{value}</div>
    </div>
  );
}
