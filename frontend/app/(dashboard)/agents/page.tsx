'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cpu, ShieldCheck, Activity, Users, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AgentCard } from './agent-card';
import { useAgents } from '@/hooks/api/use-agents';

export default function AgentsPage() {
  const [q, setQ] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { agents, isLoading, error, refetch } = useAgents();

  const filtered = useMemo(() => {
    return agents.filter((agent) => {
      const matchesActive =
        activeFilter === 'all' ||
        (activeFilter === 'active' ? agent.active : !agent.active);
      const matchesSearch =
        agent.agentAddress.toLowerCase().includes(q.toLowerCase()) ||
        agent.metadata?.name?.toLowerCase().includes(q.toLowerCase()) ||
        agent.metadata?.description?.toLowerCase().includes(q.toLowerCase()) ||
        agent.metadataURI.toLowerCase().includes(q.toLowerCase());
      return matchesActive && matchesSearch;
    });
  }, [agents, q, activeFilter]);

  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.active).length;

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-12 text-center">
            <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
            <h3 className="text-lg font-medium text-foreground">Failed to load agents</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button
              onClick={() => refetch()}
              className="mt-4 mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Header skeleton */}
          <div className="mb-6 flex flex-col gap-1">
            <div className="h-3 w-32 animate-pulse rounded bg-border" />
            <div className="h-8 w-48 animate-pulse rounded bg-border" />
            <div className="h-4 w-64 animate-pulse rounded bg-border" />
          </div>

          {/* Stats skeleton */}
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <div className="h-3 w-3 animate-pulse rounded bg-border" />
                  <div className="h-2 w-16 animate-pulse rounded bg-border" />
                </div>
                <div className="mt-2 h-6 w-12 animate-pulse rounded bg-border" />
                <div className="mt-1 h-2 w-24 animate-pulse rounded bg-border" />
              </div>
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-lg bg-border/50" />
                  <div className="flex-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-border" />
                    <div className="mt-1 h-3 w-24 animate-pulse rounded bg-border" />
                  </div>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-border" />
                </div>
                <div className="mt-4 h-12 w-full animate-pulse rounded bg-border/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-1">
          <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Registry · Pharos Network
          </span>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Agents</h1>
          <p className="text-sm text-muted-foreground">
            Autonomous agents registered on-chain.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Cpu className="size-3.5" />} label="Total Agents" value={totalAgents.toString()} sub="registered nodes" />
          <StatCard icon={<Activity className="size-3.5" />} label="Active" value={activeAgents.toString()} sub="active agents" accent="text-emerald-400" />
          <StatCard icon={<ShieldCheck className="size-3.5" />} label="Inactive" value={(totalAgents - activeAgents).toString()} sub="inactive nodes" accent="text-red-400" />
          <StatCard icon={<Users className="size-3.5" />} label="Latest" value="1m ago" sub="last registration" />
        </div>

        {/* Utility bar */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, address, or description…"
              className="mono h-10 pl-9 text-xs"
            />
          </div>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="mono h-10 w-full text-xs md:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/agents/create">
            <Button className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400">
              Register Agent
            </Button>
          </Link>
        </div>

        {/* Agents Grid */}
        {filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
            <p className="mono text-xs text-muted-foreground">
              {q || activeFilter !== 'all'
                ? 'No agents match these filters.'
                : 'No agents have been registered yet.'}
            </p>
            {!q && activeFilter === 'all' && (
              <Link href="/agents/create" className="mt-4">
                <Button className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400">
                  Register first agent
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((agent) => (
              <AgentCard key={agent.agentAddress} agent={agent} />
            ))}
          </div>
        )}
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
      <div className={`mono mt-2 text-2xl font-semibold tabular-nums ${accent ?? ""}`}>{value}</div>
      <div className="mono mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {sub}
      </div>
    </div>
  );
}
