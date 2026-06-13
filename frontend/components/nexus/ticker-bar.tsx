import { ACTIVITY, shortAddr, AGENTS } from "@/lib/nexus-data";

export function TickerBar() {
  const items = [...ACTIVITY, ...ACTIVITY];
  return (
    <div className="h-8 overflow-hidden whitespace-nowrap border-b border-border bg-surface">
      <div className="animate-ticker flex items-center gap-10 px-4 h-full">
        {items.map((e, i) => {
          const agent = AGENTS.find((a) => a.agentAddress === e.agentId);
          const tone =
            e.severity === "severe" ? "text-pharos-red"
            : e.severity === "warning" ? "text-pharos-amber"
            : e.severity === "positive" ? "text-pharos-green"
            : "text-muted-foreground";
          return (
            <div key={i} className="flex items-center gap-2 mono text-[11px]">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {e.type}
              </span>
              <span className="text-foreground/80">{agent ? shortAddr(agent.agentAddress) : "—"}</span>
              <span className={tone}>{e.delta > 0 ? "+" : ""}{e.delta.toFixed(2)}</span>
              <span className="text-muted-foreground/60">{shortAddr(e.tx)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
