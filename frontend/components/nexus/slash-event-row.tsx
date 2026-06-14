import { useState } from "react";
import type { ActivityEvent } from "@/lib/nexus-data";
import { ChevronRight } from "lucide-react";

const SEVERITY_COLOR: Record<ActivityEvent["severity"], string> = {
  info: "text-muted-foreground",
  positive: "text-pharos-green",
  warning: "text-pharos-amber",
  severe: "text-pharos-red",
};

export function SlashEventRow({ event, fresh = false }: { event: ActivityEvent; fresh?: boolean }) {
  const [open, setOpen] = useState(false);
  
  const formatTimestamp = (ts: number | string): string => {
    const date = new Date(typeof ts === "number" ? ts : parseInt(ts));
    return date.toISOString();
  };

  const timestampStr = formatTimestamp(event.timestamp);

  return (
    <div className={`border-b border-border ${fresh ? "flash-in" : ""}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-[110px_90px_1fr_140px_80px_20px] items-center gap-3 px-3 py-2 text-left mono text-[11px] hover:bg-surface"
      >
        <span className="text-muted-foreground">{timestampStr.slice(11)}</span>
        <span className={`font-semibold uppercase ${SEVERITY_COLOR[event.severity]}`}>
          {event.severity === "severe" ? "SLASH" : event.severity === "warning" ? "DECAY" : event.severity === "positive" ? "APPROVE" : "INFO"}
        </span>
        <span className="truncate text-foreground">{event.type}</span>
        <span className="truncate text-pharos-blue/80 underline-offset-2 hover:underline">{event.tx}</span>
        <span className={`text-right ${event.delta >= 0 ? "text-pharos-green" : "text-pharos-red"}`}>
          {event.delta > 0 ? "+" : ""}{event.delta.toFixed(2)}
        </span>
        <ChevronRight className={`size-3 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-4 border-t border-border bg-surface/40 px-3 py-3 mono text-[10px]">
          <Detail label="Agent" value={event.agentId} />
          <Detail label="Contract" value={event.contract ?? "—"} />
          <Detail label="Domain" value={event.domain ?? "—"} />
          <Detail label="Deal" value={event.dealId ?? "—"} />
          <Detail label="Full tx" value={event.tx} mono />
          <Detail label="Timestamp" value={timestampStr} />
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, mono = true }: { label: string; value: string | number; mono?: boolean }) {
  return (
    <div>
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`${mono ? "mono" : ""} text-foreground/90`}>{value}</div>
    </div>
  );
}
