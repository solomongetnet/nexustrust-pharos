'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Cpu, ShieldCheck, Activity, Users } from 'lucide-react';
import Link from 'next/link';
import { AGENTS, REPUTATIONS, shortAddr, avgScore, scoreColor } from '@/lib/nexus-data';
import { Agent, Reputation } from '@/lib/nexus-data';

export default function AgentsPage() {
  const [q, setQ] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filtered = useMemo(() => {
    let r = AGENTS.filter(
      (a) =>
        (activeFilter === 'all' || (activeFilter === 'active' ? a.active : !a.active)) &&
        (a.agentAddress.toLowerCase().includes(q.toLowerCase()) ||
        a.metadataURI.toLowerCase().includes(q.toLowerCase()))
    );
    return r;
  }, [q, activeFilter]);

  const totalAgents = AGENTS.length;
  const activeAgents = AGENTS.filter((a) => a.active).length;
  const totalReputationScore = AGENTS.reduce(
    (s, a) => s + (REPUTATIONS[a.agentAddress]?.avgScoreX100 || 0),
    0
  );
  const totalReviews = AGENTS.reduce(
    (s, a) => s + (REPUTATIONS[a.agentAddress]?.reviewCount || 0),
    0
  );

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
          <StatCard icon={<Activity className="size-3.5" />} label="Active" value={activeAgents.toString()} sub="active agents" accent="text-pharos-blue" />
          <StatCard icon={<ShieldCheck className="size-3.5" />} label="Avg Reputation" value={totalAgents > 0 ? avgScore(totalReputationScore / totalAgents) : "0.00"} sub="weighted score" accent="text-pharos-green" />
          <StatCard icon={<Users className="size-3.5" />} label="Total Reviews" value={totalReviews.toString()} sub="submitted reviews" />
        </div>

        {/* Utility bar */}
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by address or metadata URI…"
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

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-lg border border-border bg-surface/40 md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Agent</TableHead>
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Token ID</TableHead>
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Reputation</TableHead>
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Reviews</TableHead>
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Registered</TableHead>
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow
                  key={a.agentAddress}
                  onClick={() => setSelectedAgent(a)}
                  className="cursor-pointer border-border/60"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="size-1.5 shrink-0 rounded-full pulse-node"
                        style={{ background: a.active ? 'var(--pharos-green)' : 'var(--pharos-red)' }}
                      />
                      <div className="min-w-0">
                        <div className="mono truncate text-[13px] text-foreground">{shortAddr(a.agentAddress)}</div>
                        <div className="mono text-[10px] text-muted-foreground truncate">{a.metadataURI}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="mono text-[12px] tabular-nums">
                    {a.tokenId}
                  </TableCell>
                  <TableCell>
                    {REPUTATIONS[a.agentAddress] ? (
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-border/60">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(REPUTATIONS[a.agentAddress].avgScoreX100 / 500) * 100}%`,
                            background: scoreColor(REPUTATIONS[a.agentAddress].avgScoreX100 / 100),
                          }}
                        />
                      </div>
                      <span className="mono w-10 shrink-0 text-right text-[11px] tabular-nums" style={{ color: scoreColor(REPUTATIONS[a.agentAddress].avgScoreX100 / 100) }}>
                        {avgScore(REPUTATIONS[a.agentAddress].avgScoreX100)}
                      </span>
                    </div>
                  ) : (
                    <span className="mono text-[11px] text-muted-foreground">-</span>
                  )}
                  </TableCell>
                  <TableCell className="mono text-[12px] tabular-nums">
                    {REPUTATIONS[a.agentAddress]?.reviewCount || 0}
                  </TableCell>
                  <TableCell className="mono text-[11px] text-muted-foreground">
                    {new Date(a.registeredAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`mono inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        a.active
                          ? 'bg-pharos-green/10 text-pharos-green border-pharos-green/30'
                          : 'bg-pharos-red/10 text-pharos-red border-pharos-red/30'
                      }`}
                    >
                      <span className="size-1 rounded-full bg-current" />
                      {a.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {filtered.map((a) => (
            <button
              key={a.agentAddress}
              onClick={() => setSelectedAgent(a)}
              className="rounded-lg border border-border bg-surface/40 p-4 text-left transition-colors active:bg-surface"
            >
              <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-1.5 shrink-0 rounded-full pulse-node"
                    style={{ background: a.active ? 'var(--pharos-green)' : 'var(--pharos-red)' }}
                  />
                  <div className="min-w-0">
                    <div className="mono truncate text-[13px]">{shortAddr(a.agentAddress)}</div>
                    <div className="mono text-[10px] text-muted-foreground truncate">{a.metadataURI}</div>
                  </div>
                </div>
                <span
                  className={`mono inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    a.active
                      ? 'bg-pharos-green/10 text-pharos-green border-pharos-green/30'
                      : 'bg-pharos-red/10 text-pharos-red border-pharos-red/30'
                  }`}
                >
                  <span className="size-1 rounded-full bg-current" />
                  {a.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 border-t border-border/60 pt-3">
                <div>
                  <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">Token ID</div>
                  <div className="mono mt-0.5 text-[12px] tabular-nums">{a.tokenId}</div>
                </div>
                <div>
                  <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">Reputation</div>
                  <div className="mono mt-0.5 text-[12px] tabular-nums">
                    {REPUTATIONS[a.agentAddress] ? avgScore(REPUTATIONS[a.agentAddress].avgScoreX100) : '-'}
                  </div>
                </div>
                <div>
                  <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">Reviews</div>
                  <div className="mono mt-0.5 text-[12px] tabular-nums">
                    {REPUTATIONS[a.agentAddress]?.reviewCount || 0}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
            <p className="mono text-xs text-muted-foreground">No agents match these filters.</p>
          </div>
          )}
      </div>

      {selectedAgent && (
        <AgentDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
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
      <div className={`mono mt-2 text-2xl font-semibold tabular-nums ${accent ?? ""}`}>{value}</div>
      <div className="mono mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        {sub}
      </div>
    </div>
  );
}

function AgentDrawer({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const reputation = REPUTATIONS[agent.agentAddress];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-lg border border-border bg-surface shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border bg-surface/40 p-6">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="size-1.5 rounded-full pulse-node"
              style={{ background: agent.active ? 'var(--pharos-green)' : 'var(--pharos-red)' }}
            />
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Agent Profile
            </span>
          </div>
          <h2 className="mono text-lg">{shortAddr(agent.agentAddress)}</h2>
          <p className="mono text-[11px] break-all">{agent.agentAddress}</p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`mono inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                agent.active
                  ? 'bg-pharos-green/10 text-pharos-green border-pharos-green/30'
                  : 'bg-pharos-red/10 text-pharos-red border-pharos-red/30'
              }`}
            >
              <span className="size-1 rounded-full bg-current" />
              {agent.active ? 'Active' : 'Inactive'}
            </span>
            <span className="mono text-[10px] text-muted-foreground">
              Token ID: {agent.tokenId}
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Metadata URI */}
          <div>
            <div className="mono mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              Metadata URI
            </div>
            <div className="rounded-md border border-border bg-surface/40 p-3">
              <code className="mono block text-[11px] text-emerald-400 break-all">{agent.metadataURI}</code>
            </div>
          </div>

          {/* Reputation */}
          <div>
            <div className="mono mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              Reputation
            </div>
            {reputation ? (
              <div className="rounded-md border border-border bg-surface/40 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/60">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(reputation.avgScoreX100 / 500) * 100}%`,
                        background: scoreColor(reputation.avgScoreX100 / 100),
                      }}
                    />
                  </div>
                    <span className="mono w-10 shrink-0 text-right text-[11px] tabular-nums" style={{ color: scoreColor(reputation.avgScoreX100 / 100) }}>
                      {avgScore(reputation.avgScoreX100)}
                    </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {reputation.reviewCount} reviews
                </div>
                {reputation.recent.length > 0 && (
                  <div className="mt-3">
                    <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
                      Recent Reviews
                    </div>
                    {reputation.recent.map((review, i) => (
                      <div key={i} className="text-xs text-foreground py-1">
                        <span className="text-muted-foreground">
                          {shortAddr(review.reviewer)}: 
                        </span>{' '}
                        <span style={{ color: scoreColor(review.score) }}>
                          {review.score} • {review.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">
                  No reputation data yet.</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              className="mono border-zinc-700 bg-transparent text-[11px] uppercase tracking-widest hover:bg-zinc-800"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
