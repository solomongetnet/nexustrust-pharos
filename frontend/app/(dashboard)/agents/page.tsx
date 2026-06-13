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
import { Cpu, ShieldCheck, Flame, Activity } from 'lucide-react';

type AgentStatus = "Idle" | "Processing" | "Risk Evaluating" | "Slashed";

interface AgentRow {
  id: string;
  name: string;
  wallet: string;
  status: AgentStatus;
  trust: number;
  staked: number;
  feePerTx: number;
  kmsArn: string;
  log: string[];
}

const STATUS_STYLES: Record<AgentStatus, string> = {
  Idle: "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20",
  Processing: "bg-pharos-blue/10 text-pharos-blue border-pharos-blue/30",
  "Risk Evaluating": "bg-pharos-amber/10 text-pharos-amber border-pharos-amber/30",
  Slashed: "bg-pharos-red/10 text-pharos-red border-pharos-red/30",
};

const AGENTS_DATA: AgentRow[] = [
  {
    id: "sentinel-x",
    name: "Sentinel_X",
    wallet: "0x821fa7b2c4e9d3a1f08b6c5e2d9a4f7b1c3e8d92",
    status: "Processing",
    trust: 98.8,
    staked: 45000,
    feePerTx: 0.0041,
    kmsArn: "arn:aws:kms:us-east-1:••••••••••••3921:key/9a1f-••••-••••-••••-c8e2",
    log: [
      "14:02:11  TASK_ACCEPT  job=JOB-1188  domain=DeFi",
      "14:02:11  RISK_EVAL    score=96.4  threshold=70  ok",
      "14:02:12  SIGN_TX      kms=arn:…c8e2  nonce=4421",
      "14:02:13  SETTLED      gas=0.0041 PROS  delta=+4.2",
    ],
  },
  {
    id: "lumina-v4",
    name: "Lumina_v4",
    wallet: "0x9f32e98c1a7b4c2d8e3f5a6b9c1d2e4f5a6b7c88",
    status: "Idle",
    trust: 99.2,
    staked: 62000,
    feePerTx: 0.0038,
    kmsArn: "arn:aws:kms:us-east-1:••••••••••••3921:key/1bf2-••••-••••-••••-ae09",
    log: [
      "13:58:04  ATTEST_RX    src=AttestationHub  weight=1.15",
      "13:55:00  HEARTBEAT    uptime=99.97%",
      "13:50:11  CODE_AUDIT   repo=core/vesting  pass",
    ],
  },
  {
    id: "nexus-alpha",
    name: "Nexus_Alpha_09",
    wallet: "0x4f22c6a8b9d1e3f5c7a2b4d6e8f1a3c5b7d9e2f1",
    status: "Risk Evaluating",
    trust: 94.1,
    staked: 38500,
    feePerTx: 0.0052,
    kmsArn: "arn:aws:kms:us-east-1:••••••••••••3921:key/4c20-••••-••••-••••-7711",
    log: [
      "13:22:44  X402_SETTLE  receipts=14  total=90 USDT/PROS",
      "13:22:40  RISK_EVAL    sender_trust=82  ok",
      "13:22:38  TASK_PEEK    job=JOB-1196",
    ],
  },
  {
    id: "beta-node-7",
    name: "Beta_Node_7",
    wallet: "0xab120091c5e3f7a2d4b6c8e1f3a5b7d9c2e4f6a8",
    status: "Processing",
    trust: 74.1,
    staked: 12200,
    feePerTx: 0.0061,
    kmsArn: "arn:aws:kms:us-east-1:••••••••••••3921:key/77ab-••••-••••-••••-201b",
    log: [
      "11:58:33  BOOTSTRAP    challenge=cleared  +8.1",
      "11:58:30  KMS_SIGN     latency=42ms",
    ],
  },
  {
    id: "nova-protocol-x",
    name: "Nova_Protocol_X",
    wallet: "0xde311b8c2a4f6e9d1c3b5a7f9e2d4c6b8a1f3e5d",
    status: "Risk Evaluating",
    trust: 62.8,
    staked: 8400,
    feePerTx: 0.0078,
    kmsArn: "arn:aws:kms:us-east-1:••••••••••••3921:key/d311-••••-••••-••••-3e5d",
    log: [
      "13:30:01  DECAY        delta=-2.4  oracle=DecayOracle",
      "13:29:55  RISK_EVAL    sender_trust=58  reject",
    ],
  },
  {
    id: "voidwalker",
    name: "C_VOIDWALKER_889",
    wallet: "0xc4889aef21b3c5d7e9f1a3b5c7d9e1f3a5b7c9d2",
    status: "Slashed",
    trust: 22.4,
    staked: 2400,
    feePerTx: 0.0119,
    kmsArn: "arn:aws:kms:us-east-1:••••••••••••3921:key/c488-••••-••••-••••-9d2a",
    log: [
      "13:44:20  SLASH_EXEC   amount=-12.0  contract=Slasher",
      "12:11:09  CHALLENGE    filed by=0xaa90  -5.0",
      "11:00:00  FLAG_RAISED  reason=trust<25",
    ],
  },
];

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

function trustBarColor(t: number) {
  if (t >= 85) return "var(--pharos-green)";
  if (t >= 50) return "var(--pharos-amber)";
  return "var(--pharos-red)";
}

export default function AgentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("trust");
  const [selected, setSelected] = useState<AgentRow | null>(null);

  const filtered = useMemo(() => {
    let r = AGENTS_DATA.filter(
      (a) =>
        (status === "all" || a.status === status) &&
        (a.name.toLowerCase().includes(q.toLowerCase()) ||
          a.wallet.toLowerCase().includes(q.toLowerCase()))
    );
    r = [...r].sort((a, b) => {
      if (sort === "stake") return b.staked - a.staked;
      if (sort === "fee") return a.feePerTx - b.feePerTx;
      return b.trust - a.trust;
    });
    return r;
  }, [q, status, sort]);

  const totalStaked = AGENTS_DATA.reduce((s, a) => s + a.staked, 0);
  const avgTrust = (AGENTS_DATA.reduce((s, a) => s + a.trust, 0) / AGENTS_DATA.length).toFixed(1);
  const activeCount = AGENTS_DATA.filter((a) => a.status === "Processing").length;
  const slashedCount = AGENTS_DATA.filter((a) => a.status === "Slashed").length;

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
            Autonomous nodes settling on-chain. Click any row for KMS reference & live log.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Cpu className="size-3.5" />} label="Total Agents" value={AGENTS_DATA.length.toString()} sub="registered nodes" />
          <StatCard icon={<Activity className="size-3.5" />} label="Active Now" value={activeCount.toString()} sub="processing tx" accent="text-pharos-blue" />
          <StatCard icon={<ShieldCheck className="size-3.5" />} label="Avg Trust" value={`${avgTrust}%`} sub="weighted score" accent="text-pharos-green" />
          <StatCard icon={<Flame className="size-3.5" />} label="Total Staked" value={`${(totalStaked / 1000).toFixed(1)}k`} sub={`USDT/PROS · ${slashedCount} slashed`} />
        </div>

        {/* Utility bar */}
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search agent name or wallet…"
              className="mono h-10 pl-9 text-xs"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mono h-10 w-full text-xs md:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Idle">Idle</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Risk Evaluating">Risk Evaluating</SelectItem>
              <SelectItem value="Slashed">Slashed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="mono h-10 w-full text-xs md:w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trust">Sort: Trust</SelectItem>
              <SelectItem value="stake">Sort: Stake</SelectItem>
              <SelectItem value="fee">Sort: Fee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-lg border border-border bg-surface/40 md:block">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Agent</TableHead>
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Status</TableHead>
                <TableHead className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Trust</TableHead>
                <TableHead className="mono text-right text-[10px] uppercase tracking-widest text-muted-foreground">Staked</TableHead>
                <TableHead className="mono text-right text-[10px] uppercase tracking-widest text-muted-foreground">Network Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow
                  key={a.id}
                  onClick={() => setSelected(a)}
                  className="cursor-pointer border-border/60"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="size-1.5 shrink-0 rounded-full pulse-node"
                        style={{ background: trustBarColor(a.trust) }}
                      />
                      <div className="min-w-0">
                        <div className="mono truncate text-[13px] text-foreground">{a.name}</div>
                        <div className="mono text-[10px] text-muted-foreground">{shortAddr(a.wallet)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="w-[28%]">
                    <TrustBar value={a.trust} />
                  </TableCell>
                  <TableCell className="mono whitespace-nowrap text-right text-[12px] tabular-nums">
                    {(a.staked / 1000).toFixed(1)}k{" "}
                    <span className="text-[10px] text-muted-foreground">USDT/PROS</span>
                  </TableCell>
                  <TableCell className="mono whitespace-nowrap text-right text-[12px] tabular-nums">
                    {a.feePerTx.toFixed(4)}{" "}
                    <span className="text-[10px] text-muted-foreground">PROS / Tx</span>
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
              key={a.id}
              onClick={() => setSelected(a)}
              className="rounded-lg border border-border bg-surface/40 p-4 text-left transition-colors active:bg-surface"
            >
              <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-1.5 shrink-0 rounded-full pulse-node"
                    style={{ background: trustBarColor(a.trust) }}
                  />
                  <div className="min-w-0">
                    <div className="mono truncate text-[13px]">{a.name}</div>
                    <div className="mono text-[10px] text-muted-foreground">{shortAddr(a.wallet)}</div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="mb-3">
                <TrustBar value={a.trust} />
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-3">
                <div>
                  <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">Staked</div>
                  <div className="mono mt-0.5 text-[12px] tabular-nums">
                    {(a.staked / 1000).toFixed(1)}k <span className="text-[10px] text-muted-foreground">USDT/PROS</span>
                  </div>
                </div>
                <div>
                  <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">Network Fee</div>
                  <div className="mono mt-0.5 text-[12px] tabular-nums">
                    {a.feePerTx.toFixed(4)} <span className="text-[10px] text-muted-foreground">PROS / Tx</span>
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

      {selected && (
        <AgentDrawer agent={selected} onClose={() => setSelected(null)} />
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

function StatusBadge({ status }: { status: AgentStatus }) {
  return (
    <span
      className={`mono inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      <span className="size-1 rounded-full bg-current" />
      {status}
    </span>
  );
}

function TrustBar({ value }: { value: number }) {
  const color = trustBarColor(value);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-border/60">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="mono w-10 shrink-0 text-right text-[11px] tabular-nums" style={{ color }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

function AgentDrawer({ agent, onClose }: { agent: AgentRow; onClose: () => void }) {
  const [liveLog, setLiveLog] = useState<string[]>(agent.log);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-lg border border-border bg-surface shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b border-border bg-surface/40 p-6">
          <div className="mb-2 flex items-center gap-2">
            <span
              className="size-1.5 rounded-full pulse-node"
              style={{ background: trustBarColor(agent.trust) }}
            />
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Node Profile
            </span>
          </div>
          <h2 className="mono text-lg">{agent.name}</h2>
          <p className="mono text-[11px] break-all">{agent.wallet}</p>
          <div className="mt-3 flex items-center gap-2">
            <StatusBadge status={agent.status} />
            <span className="mono text-[10px] text-muted-foreground">
              trust {agent.trust.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* KMS */}
          <div>
            <div className="mono mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              AWS KMS Key ARN
            </div>
            <div className="rounded-md border border-border bg-surface/40 p-3">
              <code className="mono block text-[11px] text-emerald-400 break-all">{agent.kmsArn}</code>
            </div>
          </div>

          {/* Live log */}
          <div>
            <div className="mono mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Live Event Log</span>
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
            </div>
            <div
              className="h-64 overflow-y-auto rounded-md border border-border bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-emerald-400"
            >
              {liveLog.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">{line}</div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              className="mono border-zinc-700 bg-transparent text-[11px] uppercase tracking-widest hover:bg-zinc-800"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="mono bg-pharos-blue text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-blue/90"
              onClick={() => {
                window.open(
                  `https://pharos-explorer.io/address/${agent.wallet}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              View on Explorer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
