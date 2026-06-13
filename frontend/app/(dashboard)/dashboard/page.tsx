import Link from "next/link";
import { ExternalLink, Newspaper, ArrowUpRight } from "lucide-react";
import { TrustHealthMeter } from "@/components/nexus/trust-health-meter";
import { WalletStatusPanel } from "@/components/nexus/wallet-status-panel";
import { ACTIVITY, AGENTS, shortAddr } from "@/lib/nexus-data";
import { cn } from "@/lib/utils";

const NEWS = [
  { tag: "Protocol", title: "Pharos-L1 v4.1 enables sub-second x402 settlement finality", time: "2h ago", source: "Pharos Blog" },
  { tag: "Network", title: "NexusTrust crosses 10k registered agents across 5 domains", time: "5h ago", source: "NexusTrust" },
  { tag: "Security", title: "Slasher contract audit completed — zero critical findings", time: "1d ago", source: "Spearbit" },
  { tag: "Ecosystem", title: "New DeFi task adapter for Uniswap V4 hooks now live", time: "2d ago", source: "Dev Updates" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">

      <main className="flex-1 bg-background lg:overflow-y-auto">
        <div className="mx-auto w-full max-w-[1100px] p-4 sm:p-6 lg:p-8">

          {/* Latest Agents */}
          <Card className="mb-6 p-0 lg:mb-8">
            <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">
              <h3 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Latest Agents</h3>
              <Link href="/agents" className="mono inline-flex items-center gap-1 text-[10px] text-pharos-blue hover:underline">
                View all <ArrowUpRight className="size-3" />
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {AGENTS.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/agents/mine/${a.id}`}
                    className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface sm:px-6"
                  >
                    <div className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold",
                      a.tier === "trusted" ? "border-pharos-green/30 bg-pharos-green/10 text-pharos-green"
                        : a.tier === "probationary" ? "border-pharos-amber/30 bg-pharos-amber/10 text-pharos-amber"
                          : "border-pharos-red/30 bg-pharos-red/10 text-pharos-red",
                    )}>{a.name.slice(0, 2).toUpperCase()}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{a.name}</p>
                      <p className="mono text-[10px] text-muted-foreground">{shortAddr(a.address)} · {a.lastActive}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="mono text-sm font-semibold tabular-nums text-foreground">{a.globalScore.toFixed(1)}</p>
                      <p className="mono text-[9px] uppercase tracking-widest text-muted-foreground">{a.tier}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          {/* Wallet status + mobile trust health */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 lg:mb-8 lg:grid-cols-2 xl:grid-cols-1">
            <WalletStatusPanel />
            <div className="lg:hidden xl:hidden">
              <Card>
                <SectionHeader title="Network Trust Health" />
                <TrustHealthMeter value={98.2} />
              </Card>
            </div>
          </div>

          <Card className="p-0">
            <div className="flex items-center justify-between border-b border-border px-5 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <Newspaper className="size-3.5 text-muted-foreground" />
                <h3 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Latest News</h3>
              </div>
              <span className="mono text-[10px] text-muted-foreground">{NEWS.length} updates</span>
            </div>
            <ul className="divide-y divide-border">
              {NEWS.map((n) => (
                <li key={n.title}>
                  <a href="#" className="group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-surface sm:px-6">
                    <span className="mono mt-0.5 shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {n.tag}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-foreground group-hover:text-pharos-blue">{n.title}</p>
                      <p className="mono mt-1 text-[10px] text-muted-foreground">{n.source} · {n.time}</p>
                    </div>
                    <ExternalLink className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>

      <aside className="hidden w-80 shrink-0 flex-col border-l border-border bg-background xl:flex">
        {/* Top Trusted Agents */}
        <div className="border-b border-border p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Top Trusted Agents
            </span>
            <span className="mono text-[10px] text-pharos-green">24h</span>
          </div>
          <ol className="space-y-2">
            {[...AGENTS]
              .sort((a, b) => b.globalScore - a.globalScore)
              .slice(0, 5)
              .map((a, i) => (
                <Link
                  key={a.id}
                  href={`/agents/mine/${a.id}`}
                  className="group flex items-center gap-3 rounded-md border border-border/60 bg-surface/40 p-2.5 transition-colors hover:border-pharos-blue/40"
                >
                  <span className="mono w-4 text-center text-[11px] font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold",
                    a.tier === "trusted" ? "border-pharos-green/30 bg-pharos-green/10 text-pharos-green"
                      : a.tier === "probationary" ? "border-pharos-amber/30 bg-pharos-amber/10 text-pharos-amber"
                        : "border-pharos-red/30 bg-pharos-red/10 text-pharos-red",
                  )}>
                    {a.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{a.name}</p>
                    <p className="mono text-[10px] text-muted-foreground">{shortAddr(a.address)}</p>
                  </div>
                  <span className="mono text-xs font-semibold tabular-nums text-pharos-green">
                    {a.globalScore.toFixed(1)}
                  </span>
                </Link>
              ))}
          </ol>
        </div>

        {/* Network Pulse */}
        <div className="border-b border-border p-5">
          <div className="mono mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Network Pulse
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Active Agents", value: String(AGENTS.length * 184), accent: "text-pharos-blue" },
              { label: "Total Staked", value: `${(AGENTS.reduce((s, a) => s + a.staked, 0) / 1000).toFixed(1)}k`, unit: "PROS", accent: "text-pharos-green" },
              { label: "Avg Score", value: (AGENTS.reduce((s, a) => s + a.globalScore, 0) / AGENTS.length).toFixed(1), accent: "text-foreground" },
              { label: "Slashes 24h", value: String(ACTIVITY.filter(e => e.severity === "severe").length), accent: "text-pharos-red" },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-border/60 bg-surface/40 p-3">
                <div className="mono mb-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-base font-semibold tabular-nums", s.accent)}>{s.value}</span>
                  {s.unit && <span className="mono text-[9px] uppercase text-muted-foreground">{s.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mono mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Tier Distribution
          </div>
          <div className="space-y-3">
            {(["trusted", "probationary", "flagged"] as const).map((tier) => {
              const count = AGENTS.filter((a) => a.tier === tier).length;
              const pct = Math.round((count / AGENTS.length) * 100);
              const colors = {
                trusted: { bar: "bg-pharos-green", text: "text-pharos-green" },
                probationary: { bar: "bg-pharos-amber", text: "text-pharos-amber" },
                flagged: { bar: "bg-pharos-red", text: "text-pharos-red" },
              }[tier];
              return (
                <div key={tier}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{tier}</span>
                    <span className={cn("mono text-[11px] font-semibold tabular-nums", colors.text)}>
                      {count} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className={cn("h-full rounded-full transition-all", colors.bar)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-surface/60 p-4 sm:p-6 ${className}`}>{children}</div>
  );
}

function SectionHeader({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h3 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</h3>
      {hint && <span className="mono text-[10px] text-muted-foreground">{hint}</span>}
    </div>
  );
}

