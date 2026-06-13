import type { Domain } from "@/lib/nexus-data";

export function DomainScoreBadge({ domain, value }: { domain: Domain; value: number }) {
  const tone =
    value >= 85 ? "text-pharos-green" : value >= 60 ? "text-pharos-amber" : "text-pharos-red";
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-border bg-surface px-2 py-1">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{domain}</span>
      <span className={`mono text-xs font-medium ${tone}`}>{value.toFixed(1)}</span>
    </div>
  );
}
