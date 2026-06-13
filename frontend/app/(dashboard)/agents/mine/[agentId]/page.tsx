'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Cpu,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  Image as ImageIcon,
  KeyRound,
  Mail,
  Power,
  Radio,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Tag,
  Wrench,
  Zap,
} from 'lucide-react';
import { ReputationRadar } from '@/components/nexus/reputation-radar';
import { DecayTimeline } from '@/components/nexus/decay-timeline';
import { PaymentWeightBar } from '@/components/nexus/payment-weight-bar';
import { TrustTierBadge } from '@/components/nexus/trust-tier-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AGENTS, ACTIVITY, DOMAINS, shortAddr, type Agent, type Tier } from '@/lib/nexus-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agentId as string;
  const agent = AGENTS.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <div className="grid flex-1 place-items-center p-12">
        <div className="text-center">
          <div className="mono mb-2 text-[10px] uppercase tracking-widest text-pharos-red">
            404 · Not registered
          </div>
          <h1 className="mb-4 text-xl font-medium">Agent not found in your registry.</h1>
          <Link
            href="/agents/mine"
            className="mono inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-pharos-blue hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to My Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb */}
        <div className="mono mb-4 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <Link href="/agents/mine" className="inline-flex items-center gap-2 hover:text-foreground">
            <ArrowLeft className="size-3" /> My Agents
          </Link>
          <span>/</span>
          <span className="text-foreground">{agent.name}</span>
        </div>

        {/* Identity header */}
        <IdentityHeader agent={agent} />

        {/* KPI strip */}
        <KpiStrip agent={agent} />

        {/* Tabbed settings */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-5 flex h-auto w-full flex-wrap justify-start gap-1 border border-border bg-background p-1.5">
            <TabTrigger value="overview" icon={<Sparkles className="size-4" />}>Overview</TabTrigger>
            <TabTrigger value="identity" icon={<ImageIcon className="size-4" />}>Identity</TabTrigger>
            <TabTrigger value="communication" icon={<Radio className="size-4" />}>Communication</TabTrigger>
            <TabTrigger value="credentials" icon={<KeyRound className="size-4" />}>Credentials</TabTrigger>
            <TabTrigger value="protocol" icon={<Tag className="size-4" />}>Protocol</TabTrigger>
            <TabTrigger value="stake" icon={<Flame className="size-4" />}>Stake</TabTrigger>
            <TabTrigger value="activity" icon={<Activity className="size-4" />}>Activity</TabTrigger>
            <TabTrigger value="danger" icon={<Power className="size-4" />}>Danger</TabTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <OverviewTab agent={agent} />
          </TabsContent>
          <TabsContent value="identity" className="mt-0">
            <IdentityTab agent={agent} />
          </TabsContent>
          <TabsContent value="communication" className="mt-0">
            <CommunicationTab agent={agent} />
          </TabsContent>
          <TabsContent value="credentials" className="mt-0">
            <CredentialsPanel />
          </TabsContent>
          <TabsContent value="protocol" className="mt-0">
            <ProtocolTab agent={agent} />
          </TabsContent>
          <TabsContent value="stake" className="mt-0">
            <StakeTab agent={agent} />
          </TabsContent>
          <TabsContent value="activity" className="mt-0">
            <ActivityTab agent={agent} />
          </TabsContent>
          <TabsContent value="danger" className="mt-0">
            <DangerTab onLeave={() => router.push('/agents/mine')} />
          </TabsContent>
        </Tabs>
      </div>
  );
}

function tierStyles(tier: Tier) {
  switch (tier) {
    case "trusted":
      return { dot: "bg-pharos-green", text: "text-pharos-green", ring: "border-pharos-green/40", bg: "bg-pharos-green/10" };
    case "probationary":
      return { dot: "bg-pharos-amber", text: "text-pharos-amber", ring: "border-pharos-amber/40", bg: "bg-pharos-amber/10" };
    case "flagged":
      return { dot: "bg-pharos-red", text: "text-pharos-red", ring: "border-pharos-red/40", bg: "bg-pharos-red/10" };
  }
}

function IdentityHeader({ agent }: { agent: Agent }) {
  const t = tierStyles(agent.tier);
  const [copied, setCopied] = useState(false);

  const copyAddr = () => {
    navigator.clipboard.writeText(agent.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
      <div
        className={cn(
          "row-span-2 grid size-14 shrink-0 place-items-center rounded-lg border bg-background lg:size-16",
          t.ring
        )}
      >
        <Cpu className={cn("size-6 lg:size-7", t.text)} />
      </div>
      <div className="min-w-0 col-span-1 lg:col-span-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{agent.name}</h1>
          <TrustTierBadge tier={agent.tier} />
          <span className="mono inline-flex items-center gap-1 rounded border border-pharos-green/30 bg-pharos-green/10 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-pharos-green">
            <span className="size-1 rounded-full bg-pharos-green pulse-node" /> Live
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            onClick={copyAddr}
            className="mono inline-flex items-center gap-1 break-all text-[11px] text-muted-foreground hover:text-foreground"
          >
            {agent.address}
            {copied ? <Check className="size-3 text-pharos-green" /> : <Copy className="size-3" />}
          </button>
          <span className="mono text-[11px] text-muted-foreground">· {agent.version}</span>
          <span className="mono text-[11px] text-pharos-green">· active {agent.lastActive}</span>
        </div>
      </div>
      <div className="col-span-2 flex flex-wrap gap-2 lg:col-auto">
        <Button
          variant="outline"
          className="mono h-9 gap-1.5 rounded border-border bg-transparent text-[11px] uppercase tracking-widest"
        >
          <ExternalLink className="size-3.5" /> Explorer
        </Button>
      </div>
    </div>
  );
}

function KpiStrip({ agent }: { agent: Agent }) {
  const t = tierStyles(agent.tier);
  const utilization = Math.min(100, (agent.settledVolume / agent.tierMaxVolume) * 100);

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Kpi
        icon={<ShieldCheck className="size-3.5" />}
        label="Global Score"
        value={agent.globalScore.toFixed(1)}
        sub="trust index"
        accent={t.text}
      />
      <Kpi
        icon={<Flame className="size-3.5" />}
        label="Staked"
        value={`${(agent.staked / 1000).toFixed(1)}k`}
        sub="USDT/PROS"
      />
      <Kpi
        icon={<Activity className="size-3.5" />}
        label="Settled Volume"
        value={`${(agent.settledVolume / 1_000_000).toFixed(2)}M`}
        sub="PROS · x402"
        accent="text-pharos-blue"
      />
      <Kpi
        icon={<Zap className="size-3.5" />}
        label="Tier Capacity"
        value={`${utilization.toFixed(0)}%`}
        sub={`${(agent.tierMaxVolume / 1_000_000).toFixed(1)}M ceiling`}
      />
    </div>
  );
}

/* ───────── Tabs ───────── */

function OverviewTab({ agent }: { agent: Agent }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel title="Dimensional Trust Radar" hint="dashed = confidence floor" className="lg:col-span-7">
        <ReputationRadar agent={agent} />
      </Panel>
      <Panel title="Domain Breakdown" className="lg:col-span-5">
        <div className="space-y-2.5">
          {DOMAINS.map((d) => {
            const s = agent.scores[d];
            const tone = s.value >= 85 ? "bg-pharos-green" : s.value >= 60 ? "bg-pharos-amber" : "bg-pharos-red";
            return (
              <div key={d}>
                <div className="mb-1 flex justify-between mono text-[11px]">
                  <span className="text-foreground">{d}</span>
                  <span className="text-muted-foreground">
                    {s.value.toFixed(1)}{" "}
                    <span className="text-[9px]">±{((1 - s.confidence) * 100).toFixed(0)}%</span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div className={`h-full ${tone}`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel title="Payment Weight · x402 Settlements" className="lg:col-span-7">
        <PaymentWeightBar volume={agent.settledVolume} max={agent.tierMaxVolume} />
      </Panel>
      <Panel title="Decay Timeline · Projected" className="lg:col-span-5">
        <DecayTimeline initialScore={agent.globalScore} />
      </Panel>
    </div>
  );
}

function IdentityTab({ agent }: { agent: Agent }) {
  const [name, setName] = useState(agent.name);
  const [desc, setDesc] = useState(
    "High-availability execution agent on Pharos L1. Sub-200ms routing across DeFi venues with verifiable receipts."
  );
  const [image, setImage] = useState("");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Panel title="Core Identity" hint="ERC-721 metadata" className="lg:col-span-2">
        <div className="space-y-6">
          <FieldRow label="Agent Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-background" />
          </FieldRow>
          <FieldRow label="Description" hint="Markdown supported.">
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={5}
              className="resize-none bg-background"
            />
          </FieldRow>
          <FieldRow label="Image URL" hint="Must be https:// or ipfs://">
            <div className="flex items-start gap-3">
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://ipfs.io/ipfs/Qm…"
                className="bg-background"
              />
              <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-background">
                {image ? (
                  <img src={image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground/70" />
                )}
              </div>
            </div>
          </FieldRow>
          <SaveBar />
        </div>
      </Panel>
      <Panel title="On-Chain Anchors">
        <dl className="space-y-3">
          <Meta label="Token Standard" value="ERC-721" />
          <Meta label="Token ID" value={`#${agent.id.slice(-4).toUpperCase()}`} />
          <Meta label="Owner" value={shortAddr(agent.address)} />
          <Meta label="Version Tag" value={agent.version} />
          <Meta label="Network" value="Pharos Testnet" accent="text-pharos-blue" />
        </dl>
      </Panel>
    </div>
  );
}

function CommunicationTab({ agent }: { agent: Agent }) {
  const [url, setUrl] = useState("https://mcp.nexus.ai/sse");
  const [transport, setTransport] = useState("SSE");
  const [fns, setFns] = useState([
    { id: "f1", name: "route.optimize", description: "Find best swap path under 200ms", parameters: "{ tokenIn, tokenOut, amount }" },
    { id: "f2", name: "audit.diff", description: "Differential audit between two implementations", parameters: "{ implA, implB }" },
  ]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="mcp" className="w-full">
        <TabsList className="grid w-full grid-cols-3 border border-border bg-background p-1 sm:inline-flex sm:w-auto">
          <SubTab value="mcp" icon={<Radio className="size-3.5" />} active>MCP</SubTab>
          <SubTab value="api" icon={<div className="size-3.5" />}>REST API</SubTab>
          <SubTab value="email" icon={<Mail className="size-3.5" />}>Email</SubTab>
        </TabsList>

        <TabsContent value="mcp" className="mt-5 space-y-5">
          <Panel title="MCP Server" hint="Model Context Protocol surface">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px] sm:items-center">
              <div>
                <Label className="mono mb-1.5 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Endpoint URL
                </Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} className="bg-background" />
              </div>
              <div>
                <Label className="mono mb-1.5 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Transport
                </Label>
                <Select value={transport} onValueChange={setTransport}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="SSE">SSE</SelectItem>
                    <SelectItem value="Stdio">Stdio</SelectItem>
                    <SelectItem value="HTTP">HTTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Panel>

          <Panel
            title="Exposed Functions"
            hint={`${fns.length} registered`}
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFns([
                    ...fns,
                    { id: `f${Date.now()}`, name: "", description: "", parameters: "" },
                  ])
                }
                className="mono h-7 gap-1 border-border bg-transparent text-[10px] uppercase tracking-widest"
              >
                <Wrench className="size-3" /> Add
              </Button>
            }
          >
            <div className="space-y-3">
              {fns.map((f, i) => (
                <div
                  key={f.id}
                  className="rounded-md border border-border bg-background p-3 sm:p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="mono text-[10px] uppercase tracking-widest text-pharos-blue">
                      fn / {String(i + 1).padStart(2, "0")}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFns(fns.filter((x) => x.id !== f.id))}
                      className="size-7 text-muted-foreground hover:bg-muted hover:text-pharos-red"
                    >
                      <div className="size-3.5">×</div>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        value={f.name}
                        onChange={(e) => setFns(fns.map((x) => x.id === f.id ? { ...x, name: e.target.value } : x))}
                        placeholder="get_market_price"
                        className="mono bg-surface text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Description
                      </Label>
                      <Textarea
                        value={f.description}
                        onChange={(e) => setFns(fns.map((x) => x.id === f.id ? { ...x, description: e.target.value } : x))}
                        placeholder="Fetches the live mid-market price for a given asset symbol."
                        rows={2}
                        className="resize-none bg-surface text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Parameters{" "}
                        <span className="text-muted-foreground/70 normal-case tracking-normal">
                          (JSON schema)
                        </span>
                      </Label>
                      <Textarea
                        value={f.parameters}
                        onChange={(e) => setFns(fns.map((x) => x.id === f.id ? { ...x, parameters: e.target.value } : x))}
                        placeholder={`{\n  "symbol": { "type": "string", "required": true }\n}`}
                        rows={4}
                        className="mono resize-none bg-surface text-xs text-emerald-300/90"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <SaveBar />
        </TabsContent>

        <TabsContent value="api" className="mt-5">
          <LockedNotice label="REST API · coming soon" />
        </TabsContent>
        <TabsContent value="email" className="mt-5">
          <LockedNotice label="Email transport · coming soon" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProtocolTab({ agent }: { agent: Agent }) {
  const [domain, setDomain] = useState<string>(
    Object.entries(agent.scores).sort((a, b) => b[1].value - a[1].value)[0][0]
  );
  const [tags, setTags] = useState<string[]>(["pharos-l1", "x402", "low-latency"]);
  const [skills, setSkills] = useState<string[]>(["route_optimization", "audit", "settlement"]);
  const [http402, setHttp402] = useState(true);
  const [tagInput, setTagInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const addTo = (set: (v: string[]) => void, list: string[], v: string) => {
    const t = v.trim();
    if (t && !list.includes(t)) set([...list, t]);
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel title="Primary Domain" hint="Drives tier eligibility" className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {DOMAINS.map((d) => {
            const active = domain === d;
            return (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`mono rounded-md border px-3 py-2.5 text-[11px] uppercase tracking-widest transition-colors ${
                  active
                    ? "border-pharos-blue bg-pharos-blue/10 text-pharos-blue"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Payment Protocols" className="lg:col-span-2">
        <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
          <div className="min-w-0">
            <div className="mono text-sm font-medium text-foreground">HTTP 402 · x402</div>
            <div className="text-[11px] text-muted-foreground">
              Settle micropayments via on-chain receipts.
            </div>
          </div>
          <Switch checked={http402} onCheckedChange={setHttp402} />
        </div>
      </Panel>

      <Panel title="Tags" hint="Routing & discovery" className="lg:col-span-2">
        <ChipEditor
          values={tags}
          input={tagInput}
          setInput={setTagInput}
          onAdd={(v) => addTo(setTags, tags, v)}
          onRemove={(v) => setTags(tags.filter((x) => x !== v))}
          placeholder="add a tag…"
          tone="blue"
        />
      </Panel>

      <Panel title="OASF Skills" hint="Open Agent Skill Format" className="lg:col-span-2">
        <ChipEditor
          values={skills}
          input={skillInput}
          setInput={setSkillInput}
          onAdd={(v) => addTo(setSkills, skills, v)}
          onRemove={(v) => setSkills(skills.filter((x) => x !== v))}
          placeholder="add a skill…"
          tone="green"
        />
      </Panel>

      <div className="lg:col-span-2">
        <SaveBar />
      </div>
    </div>
  );
}

function StakeTab({ agent }: { agent: Agent }) {
  const [amt, setAmt] = useState((agent.staked / 1000).toFixed(0));
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Panel title="Current Stake" className="lg:col-span-1">
        <div className="mono text-3xl font-semibold tabular-nums text-pharos-green">
          {(agent.staked / 1000).toFixed(1)}k
        </div>
        <div className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          USDT/PROS locked
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4 text-[11px]">
          <Meta label="Tier" value={agent.tier} />
          <Meta label="Tier ceiling" value={`${(agent.tierMaxVolume / 1_000_000).toFixed(1)}M PROS`} />
          <Meta label="Unlock period" value="14d cooldown" />
        </div>
      </Panel>

      <Panel title="Adjust Stake" className="lg:col-span-2">
        <div className="space-y-4">
          <div>
            <Label className="mono mb-1.5 block text-[10px] uppercase tracking-widest text-muted-foreground">
              Amount (USDT/PROS)
            </Label>
            <div className="flex items-center gap-2">
              <Input value={amt} onChange={(e) => setAmt(e.target.value)} className="mono bg-background tabular-nums" />
              <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">× 1000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button className="mono h-10 rounded bg-pharos-green text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-green/90">
              + Stake more
            </Button>
            <Button
              variant="outline"
              className="mono h-10 rounded border-pharos-amber/40 text-[11px] font-semibold uppercase tracking-widest text-pharos-amber hover:bg-pharos-amber/10"
            >
              − Unstake
            </Button>
          </div>

          <div className="rounded-md border border-border bg-background p-3 text-[11px] text-muted-foreground">
            <span className="mono text-pharos-blue">→ note</span> Unstaking triggers a 14-day cooldown
            before funds are withdrawable. Tier may downgrade immediately.
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ActivityTab({ agent }: { agent: Agent }) {
  const events = ACTIVITY.filter((e) => e.agentId === agent.id);
  return (
    <Panel title="On-Chain Activity" hint={`${events.length} events`}>
      <div className="-mx-4 overflow-x-auto sm:mx-0">
        <div className="min-w-[640px] space-y-1.5 px-4 sm:px-0">
          {events.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-[120px_1fr_100px_140px_60px] items-center gap-3 rounded border border-border bg-surface/40 px-3 py-2 mono text-[11px] hover:border-pharos-blue/40"
            >
              <span className="text-muted-foreground">{e.timestamp.slice(11)}</span>
              <span className="text-foreground">{e.type}</span>
              <span className="text-muted-foreground">{e.domain ?? "—"}</span>
              <span className="inline-flex items-center gap-1 text-pharos-blue/80">
                {shortAddr(e.tx)} <ArrowUpRight className="size-3" />
              </span>
              <span
                className={cn(
                  "text-right tabular-nums",
                  e.delta > 0 ? "text-pharos-green" : e.delta < 0 ? "text-pharos-red" : "text-muted-foreground"
                )}
              >
                {e.delta > 0 ? "+" : ""}{e.delta.toFixed(2)}
              </span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="mono text-xs text-muted-foreground">
              No on-chain events yet. Complete a bootstrap challenge to seed reputation.
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

function DangerTab({ onLeave }: { onLeave: () => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-pharos-red/40 bg-pharos-red/5 p-4 sm:p-6">
        <h3 className="mono mb-1 text-[11px] font-semibold uppercase tracking-widest text-pharos-red">
          Retire Agent
        </h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Burn the ERC-721 identity, unwind all stake (14d cooldown). This action is irreversible — reputation history is preserved but the node will no longer route.
        </p>
        <Button
          onClick={onLeave}
          className="mono h-9 rounded bg-pharos-red text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-red/90"
        >
          <Power className="mr-1.5 size-3.5" /> Retire & burn identity
        </Button>
      </div>
    </div>
  );
}

/* ───────── Primitives ───────── */

function Panel({
  title,
  hint,
  action,
  className = "",
  children,
}: {
  title: string;
  hint?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-4 sm:p-5", className)}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h3>
          {hint && <span className="mono text-[10px] text-muted-foreground/70">{hint}</span>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Kpi({
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

function TabTrigger({
  value,
  icon,
  children,
}: {
  value: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className="mono inline-flex items-center gap-1.5 whitespace-nowrap rounded px-3.5 py-2 text-[11px] uppercase tracking-wider data-[state=active]:bg-pharos-blue/15 data-[state=active]:text-pharos-blue data-[state=active]:shadow-none"
    >
      {icon}
      <span>{children}</span>
    </TabsTrigger>
  );
}

function SubTab({
  value,
  icon,
  children,
  active,
}: {
  value: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "mono inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest",
        active
          ? "data-[state=active]:bg-pharos-blue/15 data-[state=active]:text-pharos-blue"
          : "data-[state=active]:bg-muted data-[state=active]:text-foreground"
      )}
    >
      {icon}
      {children}
    </TabsTrigger>
  );
}

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mono mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{label}</span>
        {hint && <span className="text-muted-foreground/60">{hint}</span>}
      </Label>
      {children}
    </div>
  );
}

function Meta({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="mono uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={cn("mono capitalize text-foreground", accent)}>{value}</span>
    </div>
  );
}

function SaveBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
      <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Changes are anchored on Pharos L1
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="mono h-9 rounded border-border bg-transparent text-[11px] uppercase tracking-widest"
        >
          Discard
        </Button>
        <Button className="mono h-9 rounded bg-pharos-green text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-green/90">
          <Check className="mr-1.5 size-3.5" /> Save & sign
        </Button>
      </div>
    </div>
  );
}

function ChipEditor({
  values,
  input,
  setInput,
  onAdd,
  onRemove,
  placeholder,
  tone = "blue",
}: {
  values: string[];
  input: string;
  setInput: (v: string) => void;
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  tone?: "blue" | "green";
}) {
  const toneCls =
    tone === "green"
      ? "border-pharos-green/30 bg-pharos-green/10 text-pharos-green"
      : "border-pharos-blue/30 bg-pharos-blue/10 text-pharos-blue";
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {values.length === 0 && (
          <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
            none — add below
          </span>
        )}
        {values.map((v) => (
          <span
            key={v}
            className={`mono inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] uppercase tracking-widest ${toneCls}`}
          >
            {v}
            <button onClick={() => onRemove(v)} className="opacity-60 hover:opacity-100">
              <div className="size-3">×</div>
            </button>
          </span>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(input);
            setInput("");
          }
        }}
        onBlur={() => input && onAdd(input)}
        placeholder={placeholder}
        className="mono bg-background text-xs"
      />
    </div>
  );
}

function LockedNotice({ label }: { label: string }) {
  return (
    <div className="grid place-items-center rounded-md border border-dashed border-border bg-background px-6 py-12 text-center">
      <Settings2 className="mb-3 size-6 text-muted-foreground/70" />
      <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

/* ───────── Agent Credentials ───────── */

function CredentialsPanel() {
  const [key, setKey] = useState("sk_pharos_9f3b7c1a8e2d4f5b6a7c8d9e3a7f");
  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const masked = `sk_pharos_••••••••••••••••${key.slice(-4)}`;
  const display = reveal ? key : masked;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onRegenerate = () => {
    const rand = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setKey(`sk_pharos_${rand}`);
    setConfirmOpen(false);
    setReveal(false);
  };

  return (
    <Panel
      title="Agent Credentials"
      hint="Authenticate your agent's gasless requests."
      action={
        <span className="mono inline-flex items-center gap-1 rounded border border-pharos-green/30 bg-pharos-green/10 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-pharos-green">
          <span className="size-1 rounded-full bg-pharos-green pulse-node" /> Active
        </span>
      }
    >
      <FieldRow label="API Key" hint="Treat like a password">
        <div className="flex items-stretch gap-2">
          <div className="relative flex-1">
            <KeyRound className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly
              value={display}
              className="mono bg-background pl-8 pr-2 text-[12px] tracking-wider"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setReveal((v) => !v)}
            className="mono h-9 gap-1.5 rounded border-border bg-transparent text-[10px] uppercase tracking-widest"
            aria-label={reveal ? "Hide key" : "Reveal key"}
          >
            {reveal ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            {reveal ? "Hide" : "Show"}
          </Button>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={onCopy}
              className="mono h-9 gap-1.5 rounded border-border bg-transparent text-[10px] uppercase tracking-widest"
              aria-label="Copy key"
            >
              {copied ? <Check className="size-3.5 text-pharos-green" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            {copied && (
              <span className="mono pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded border border-pharos-green/30 bg-pharos-green/10 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-pharos-green flash-in">
                Copied
              </span>
            )}
          </div>
        </div>
      </FieldRow>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
        <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Used for x402 gasless settlement & MCP auth
        </span>
        <Button
          type="button"
          variant="outline"
          onClick={() => setConfirmOpen(true)}
          className="mono h-9 gap-1.5 rounded border-border bg-transparent text-[11px] uppercase tracking-widest hover:border-pharos-red/50 hover:text-pharos-red"
        >
          <RefreshCw className="size-3.5" /> Regenerate Key
        </Button>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/70 p-4 backdrop-blur-sm"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="mx-auto mt-20 w-full max-w-md rounded-lg border border-border bg-surface p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mono mb-1 text-[10px] uppercase tracking-widest text-pharos-red">
              Confirm regeneration
            </div>
            <h4 className="mb-2 text-base font-semibold tracking-tight">
              Revoke and replace this API key?
            </h4>
            <p className="mb-5 text-[12px] leading-relaxed text-muted-foreground">
              The current key will be revoked immediately. Any agent, script, or integration using
              it will start receiving <span className="mono text-pharos-red">401 Unauthorized</span>{" "}
              until updated with the new key.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                className="mono h-9 rounded border-border bg-transparent text-[11px] uppercase tracking-widest"
              >
                Cancel
              </Button>
              <Button
                onClick={onRegenerate}
                className="mono h-9 rounded bg-pharos-red text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-red/90"
              >
                <RefreshCw className="mr-1.5 size-3.5" /> Revoke & regenerate
              </Button>
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
