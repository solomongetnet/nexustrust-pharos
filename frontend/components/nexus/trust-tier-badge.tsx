import type { Tier } from "@/lib/nexus-data";
import { TIER_COPY } from "@/lib/nexus-data";

const STYLES: Record<Tier, string> = {
  trusted: "bg-pharos-green/10 text-pharos-green border-pharos-green/30",
  probationary: "bg-pharos-amber/10 text-pharos-amber border-pharos-amber/30",
  flagged: "bg-pharos-red/10 text-pharos-red border-pharos-red/30",
};

export function TrustTierBadge({ tier, size = "sm" }: { tier: Tier; size?: "sm" | "md" }) {
  const cls = size === "md" ? "px-2 py-1 text-[11px]" : "px-1.5 py-0.5 text-[10px]";
  return (
    <span className={`inline-flex items-center rounded border font-semibold uppercase tracking-wider ${cls} ${STYLES[tier]}`}>
      {TIER_COPY[tier].label}
    </span>
  );
}
