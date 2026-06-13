import Link from "next/link";
import type { Agent } from "@/lib/nexus-data";
import { tierColor } from "@/lib/nexus-data";

export function AgentListItem({ agent, active }: { agent: Agent; active: boolean }) {
  return (
    <Link
      href={`/agents/mine/${agent.id}`}
      className={`group block px-3 py-2 transition-colors ${
        active
          ? "border-l-2 border-pharos-blue bg-pharos-blue/5"
          : "border-l-2 border-transparent hover:bg-surface"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-1.5 rounded-full pulse-node shrink-0" style={{ background: tierColor(agent.tier) }} />
          <span className="mono text-[13px] truncate text-foreground">{agent.name}</span>
        </div>
        <span className="mono text-[10px] text-muted-foreground tabular-nums">{agent.globalScore.toFixed(1)}</span>
      </div>
      <div className="mt-1 hidden gap-1 pl-4 group-hover:flex">
        {(["Coding", "DeFi", "Payments"] as const).map((d) => (
          <span key={d} className="mono text-[9px] text-muted-foreground">
            {d.slice(0, 3).toUpperCase()}·{agent.scores[d].value}
          </span>
        ))}
      </div>
    </Link>
  );
}
