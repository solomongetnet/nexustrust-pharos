'use client';

import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import {
  Activity,
  ArrowUpRight,
  Cpu,
  Flame,
  Plus,
  Power,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { WalletGate } from '@/components/nexus/wallet-gate';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AGENTS, TIER_COPY, type Agent, type Tier } from '@/lib/nexus-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function MyAgentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <WalletGate
        title="Connect to view your agents"
        description="My Agents shows the autonomous nodes registered to your wallet. Connect to load your portfolio."
      >
        <MyAgentsContent />
      </WalletGate>
    </div>
  );
}

function MyAgentsContent() {
  const { address } = useAccount();
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<string>("all");

  // Demo: treat the first 3 mock agents as belonging to this wallet.
  const myAgents: Agent[] = AGENTS.slice(0, 3);

  const filtered = useMemo(() => {
    return myAgents.filter(
      (a) =>
        (tier === "all" || a.tier === tier) &&
        (a.name.toLowerCase().includes(q.toLowerCase()) ||
          a.address.toLowerCase().includes(q.toLowerCase()))
    );
  }, [myAgents, q, tier]);

  const totalStaked = myAgents.reduce((s, a) => s + a.staked, 0);
  const totalSettled = myAgents.reduce((s, a) => s + a.settledVolume, 0);
  const avgTrust =
    myAgents.reduce((s, a) => s + a.globalScore, 0) / Math.max(myAgents.length, 1);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="mono inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3 text-pharos-blue" />
            Operator · {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—"}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Agents</h1>
          <p className="text-sm text-muted-foreground">
            Autonomous nodes signed to this wallet. Monitor trust, stake, and live activity.
          </p>
        </div>
        <Link href="/agents/create">
          <Button
            className="mono h-9 gap-1.5 rounded bg-pharos-blue px-3 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-blue/90"
          >
            <Plus className="size-3.5" />
            Deploy new agent
          </Button>
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Cpu className="size-3.5" />}
          label="Your Agents"
          value={myAgents.length.toString()}
          sub="deployed nodes"
        />
        <StatCard
          icon={<ShieldCheck className="size-3.5" />}
          label="Avg Trust"
          value={`${avgTrust.toFixed(1)}%`}
          sub="weighted score"
          accent="text-pharos-green"
        />
        <StatCard
          icon={<Flame className="size-3.5" />}
          label="Total Staked"
          value={`${(totalStaked / 1000).toFixed(1)}k`}
          sub="USDT/PROS"
        />
        <StatCard
          icon={<Activity className="size-3.5" />}
          label="Lifetime Settled"
          value={`${(totalSettled / 1_000_000).toFixed(2)}M`}
          sub="PROS volume"
          accent="text-pharos-blue"
        />
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search your agents…"
            className="mono h-10 pl-9 text-xs"
          />
        </div>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="mono h-10 w-full text-xs md:w-44">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tiers</SelectItem>
            <SelectItem value="trusted">Trusted</SelectItem>
            <SelectItem value="probationary">Probationary</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent cards */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>
      )}
    </div>
  );
}

function tierStyles(tier: Tier) {
  switch (tier) {
    case "trusted":
      return {
        dot: "bg-pharos-green",
        text: "text-pharos-green",
        ring: "border-pharos-green/40",
        bg: "bg-pharos-green/10",
      };
    case "probationary":
      return {
        dot: "bg-pharos-amber",
        text: "text-pharos-amber",
        ring: "border-pharos-amber/40",
        bg: "bg-pharos-amber/10",
      };
    case "flagged":
      return {
        dot: "bg-pharos-red",
        text: "text-pharos-red",
        ring: "border-pharos-red/40",
        bg: "bg-pharos-red/10",
      };
  }
}

function AgentCard({ agent }: { agent: Agent }) {
  const t = tierStyles(agent.tier);
  const utilization = Math.min(100, (agent.settledVolume / agent.tierMaxVolume) * 100);
  const topDomains = Object.entries(agent.scores)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 3);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-pharos-blue/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("size-1.5 shrink-0 rounded-full pulse-node", t.dot)} />
          <span className="mono truncate text-[13px] font-semibold text-foreground">
            {agent.name}
          </span>
        </div>
        <span
          className={cn(
            "mono inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest",
            t.ring,
            t.bg,
            t.text
          )}
        >
          {TIER_COPY[agent.tier].label}
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-4">
        <div className="mono mb-3 break-all text-[10px] uppercase tracking-widest text-muted-foreground">
          {agent.address.slice(0, 14)}…{agent.address.slice(-10)}
        </div>

        {/* Score block */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Global Score
            </div>
            <div className={cn("mono mt-0.5 text-3xl font-semibold tabular-nums", t.text)}>
              {agent.globalScore.toFixed(1)}
            </div>
          </div>
          <div className="text-right">
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Last Active
            </div>
            <div className="mono mt-0.5 text-[11px] text-foreground">{agent.lastActive}</div>
            <div className="mono text-[10px] text-muted-foreground">{agent.version}</div>
          </div>
        </div>

        {/* Tier utilization */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Tier Capacity
            </span>
            <span className="mono text-[10px] tabular-nums text-muted-foreground">
              {utilization.toFixed(0)}%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-border/60">
            <div
              className={cn("h-full rounded-full transition-all", t.dot)}
              style={{ width: `${utilization}%` }}
            />
          </div>
        </div>

        {/* Top domain chips */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {topDomains.map(([domain, s]) => (
            <span
              key={domain}
              className="mono inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground"
            >
              <span className="text-foreground">{domain.slice(0, 3)}</span>
              <span className="tabular-nums">{s.value}</span>
            </span>
          ))}
        </div>

        {/* Metric grid */}
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <Metric label="Staked" value={`${(agent.staked / 1000).toFixed(1)}k`} unit="USDT/PROS" />
          <Metric
            label="Settled"
            value={`${(agent.settledVolume / 1_000_000).toFixed(2)}M`}
            unit="PROS"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border bg-background">
        <Link
          href={`/agents/mine/${agent.id}`}
          className="mono flex w-full items-center justify-center gap-1.5 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-surface hover:text-pharos-blue"
        >
          View console
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div>
      <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mono mt-0.5 text-[13px] tabular-nums text-foreground">
        {value}{" "}
        <span className="mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="mono text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <div className={cn("mono mt-2 text-2xl font-semibold tabular-nums", accent)}>{value}</div>
      <div className="mono mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {sub}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface/40 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg border border-border bg-background">
        <Power className="size-5 text-pharos-blue" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">No agents yet</h3>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">
        Deploy your first autonomous node to start earning on the Pharos network.
      </p>
      <Link href="/agents/create">
        <Button
          className="mono mt-5 h-9 gap-1.5 rounded bg-pharos-blue px-3 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-blue/90"
        >
          <Plus className="size-3.5" />
          Deploy your first agent
        </Button>
      </Link>
    </div>
  );
}
