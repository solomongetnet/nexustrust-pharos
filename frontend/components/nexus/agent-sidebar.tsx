import { useMemo, useState } from "react";
import { AGENTS } from "@/lib/nexus-data";
import { AgentListItem } from "./agent-list-item";

export function AgentSidebar({ activeId }: { activeId?: string }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => AGENTS.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  const groups = [
    { tier: "trusted" as const, label: "Trusted", color: "text-pharos-green" },
    { tier: "probationary" as const, label: "Probationary", color: "text-pharos-amber" },
    { tier: "flagged" as const, label: "Flagged", color: "text-pharos-red" },
  ];
  return (
    <aside className="flex w-72 flex-col border-r border-border bg-background">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Agent Registry
          </h2>
          <span className="mono text-[10px] text-muted-foreground">{AGENTS.length}</span>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="filter agents…"
          className="mono w-full rounded border border-border bg-surface px-3 py-1.5 text-xs placeholder:text-muted-foreground focus:border-pharos-blue focus:outline-none"
        />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {groups.map((g) => {
          const list = filtered.filter((a) => a.tier === g.tier);
          if (!list.length) return null;
          return (
            <div key={g.tier} className="mt-2 first:mt-0">
              <div className="px-4 py-1.5">
                <span className={`mono text-[10px] font-semibold uppercase tracking-widest ${g.color}`}>
                  {g.label} · {list.length}
                </span>
              </div>
              <div>
                {list.map((a) => (
                  <AgentListItem key={a.id} agent={a} active={a.id === activeId} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
