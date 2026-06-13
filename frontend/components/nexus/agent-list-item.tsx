import Link from "next/link";
import type { Agent } from "@/lib/nexus-data";
import { scoreColor, REPUTATIONS, avgScore } from "@/lib/nexus-data";

export function AgentListItem({ agent, active }: { agent: Agent; active: boolean }) {
  const reputation = REPUTATIONS[agent.agentAddress];
  return (
    <Link
      href={`/agents`}
      className={`group block px-3 py-2 transition-colors ${
        active
          ? "border-l-2 border-pharos-blue bg-pharos-blue/5"
          : "border-l-2 border-transparent hover:bg-surface"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-1.5 rounded-full pulse-node shrink-0" style={{ background: agent.active ? "var(--pharos-green)" : "var(--pharos-red)" }} />
          <span className="mono text-[13px] truncate text-foreground">{agent.agentAddress.slice(0, 8)}...</span>
        </div>
        {reputation && (
          <span className="mono text-[10px] text-muted-foreground tabular-nums" style={{ color: scoreColor(reputation.avgScoreX100 / 100) }}>
            {avgScore(reputation.avgScoreX100)}
          </span>
        )}
      </div>
    </Link>
  );
}
