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
  AlertCircle,
  Loader2,
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
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useUserAgents } from '@/hooks/api/use-user-agents';
import { AgentCard } from '../agent-card';
import { type AgentWithMetadata } from '@/hooks/api/use-user-agents';

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Fetch user's agents
  const { agents, isLoading, error } = useUserAgents(address as `0x${string}` | undefined);

  // Filter agents
  const filtered = useMemo(() => {
    return agents.filter(
      (a) =>
        (statusFilter === "all" || (statusFilter === "active" ? a.active : !a.active)) &&
        (q === "" ||
          (a.metadata?.name?.toLowerCase().includes(q.toLowerCase()) ||
            a.agentAddress.toLowerCase().includes(q.toLowerCase()) ||
            a.metadata?.description?.toLowerCase().includes(q.toLowerCase())))
    );
  }, [agents, q, statusFilter]);

  // Stats
  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.active).length;
  const avgRegisteredAt = agents.length > 0 
    ? new Date(agents.reduce((sum, a) => sum + Number(a.registeredAt), 0) / agents.length * 1000).toLocaleDateString()
    : "—";

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 px-6 py-16 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="text-base font-semibold tracking-tight text-foreground">Failed to load your agents</h3>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="mono inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Sparkles className="size-3 text-emerald-500" />
            Operator · {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "—"}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">My Agents</h1>
          <p className="text-sm text-muted-foreground">
            Autonomous nodes registered to your wallet. Manage and monitor your AI agents.
          </p>
        </div>
        <Link href="/agents/create">
          <Button
            className="mono h-9 gap-1.5 rounded bg-emerald-500 px-3 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
          >
            <Plus className="size-3.5" />
            Register new agent
          </Button>
        </Link>
      </div>

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<Cpu className="size-3.5" />}
          label="Your Agents"
          value={totalAgents.toString()}
          sub="registered nodes"
        />
        <StatCard
          icon={<ShieldCheck className="size-3.5" />}
          label="Active Now"
          value={activeAgents.toString()}
          sub="online agents"
          accent="text-emerald-500"
        />
        <StatCard
          icon={<Flame className="size-3.5" />}
          label="Total Skills"
          value={agents.reduce((sum, a) => sum + (a.metadata?.skills?.length || 0), 0).toString()}
          sub="total skills"
        />
        <StatCard
          icon={<Activity className="size-3.5" />}
          label="First Registered"
          value={agents.length > 0 ? new Date(Number(agents[0].registeredAt) * 1000).toLocaleDateString() : "—"}
          sub="date of first agent"
          accent="text-blue-500"
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="mono h-10 w-full text-xs md:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-lg bg-border/50 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-border/50 animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-border/50 animate-pulse" />
                </div>
                <div className="h-6 w-20 rounded-full bg-border/50 animate-pulse" />
              </div>
              <div className="h-3 w-full rounded bg-border/50 animate-pulse mb-3" />
              <div className="h-3 w-4/5 rounded bg-border/50 animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <AgentCard key={a.agentAddress} agent={a as any} />
          ))}
        </div>
      )}
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
        <Power className="size-5 text-emerald-500" />
      </div>
      <h3 className="text-base font-semibold tracking-tight text-foreground">No agents yet</h3>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">
        Register your first autonomous agent to get started.
      </p>
      <Link href="/agents/create">
        <Button
          className="mono mt-5 h-9 gap-1.5 rounded bg-emerald-500 px-3 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
        >
          <Plus className="size-3.5" />
          Register your first agent
        </Button>
      </Link>
    </div>
  );
}
