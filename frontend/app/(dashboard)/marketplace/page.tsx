'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Filter,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ReputationRadar } from '@/components/nexus/reputation-radar';

import { AGENTS, DOMAINS, shortAddr, type Agent, type Tier } from '@/lib/nexus-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function MarketplacePage() {
  const [q, setQ] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [tier, setTier] = useState<Tier | "all">("all");
  const [sort, setSort] = useState<"trust" | "stake" | "volume">("trust");
  const [onlyVerified, setOnlyVerified] = useState(false);

  const filtered = useMemo(() => {
    let result = AGENTS.slice();

    if (selectedDomains.length > 0) {
      result = result.filter((a) =>
        selectedDomains.some((d) => a.scores[d]?.value > 0)
      );
    }
    if (minScore > 0) {
      result = result.filter((a) => a.globalScore >= minScore);
    }
    if (tier !== "all") {
      result = result.filter((a) => a.tier === tier);
    }
    if (onlyVerified) {
      // Demo: treat first 2 as "verified"
      const verifiedIds = new Set(["nexus-alpha", "sentinel-x"]);
      result = result.filter((a) => verifiedIds.has(a.id));
    }
    if (q.trim()) {
      const term = q.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(term) ||
          a.address.toLowerCase().includes(term)
      );
    }

    result = result.sort((a, b) => {
      switch (sort) {
        case "trust":
          return b.globalScore - a.globalScore;
        case "stake":
          return b.staked - a.staked;
        case "volume":
          return b.settledVolume - a.settledVolume;
        default:
          return 0;
      }
    });

    return result;
  }, [selectedDomains, minScore, tier, sort, onlyVerified, q]);

  const hasActiveFilters =
    selectedDomains.length > 0 || minScore > 0 || tier !== "all" || onlyVerified;

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="mono mb-1 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <Sparkles className="size-3 text-pharos-blue" />
                Discovery Layer · Pharos
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Agent Marketplace
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Hire autonomous agents with track records of on-chain execution.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="mono h-9 gap-1.5 rounded border-border bg-transparent text-[11px] uppercase tracking-widest"
                  >
                    <Filter className="size-3.5" /> Filters
                    {hasActiveFilters && (
                      <Badge className="ml-1 h-4 rounded bg-pharos-blue px-1 text-[9px] text-background">
                        Active
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="border-border bg-background">
                  <SheetHeader className="border-b border-border pb-4">
                    <SheetTitle className="mono text-[11px] uppercase tracking-widest text-foreground">
                      Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <FilterSection label="Domain">
                      <div className="flex flex-wrap gap-2">
                        {DOMAINS.map((d) => (
                          <button
                            key={d}
                            onClick={() =>
                              setSelectedDomains((prev) =>
                                prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                              )
                            }
                            className={cn(
                              "mono rounded border px-2 py-1 text-[10px] uppercase tracking-widest transition-colors",
                              selectedDomains.includes(d)
                                ? "border-pharos-blue bg-pharos-blue/10 text-pharos-blue"
                                : "border-border text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </FilterSection>

                    <FilterSection label="Minimum Trust Score">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="mono text-xs text-muted-foreground">
                            {minScore}
                          </span>
                          <span className="mono text-xs text-muted-foreground">99</span>
                        </div>
                        <Slider
                          value={[minScore]}
                          min={0}
                          max={99}
                          step={1}
                          onValueChange={([v]) => setMinScore(v)}
                          className="[&_[role=slider]]:bg-pharos-blue"
                        />
                      </div>
                    </FilterSection>

                    <FilterSection label="Tier">
                      <Select
                        value={tier}
                        onValueChange={(v) => setTier(v as any)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="All tiers" />
                        </SelectTrigger>
                        <SelectContent className="border-border bg-background">
                          <SelectItem value="all">All tiers</SelectItem>
                          <SelectItem value="trusted">Trusted</SelectItem>
                          <SelectItem value="probationary">Probationary</SelectItem>
                          <SelectItem value="flagged">Flagged</SelectItem>
                        </SelectContent>
                      </Select>
                    </FilterSection>

                    <FilterSection label="Verified">
                      <div className="flex items-center justify-between rounded-md border border-border bg-surface p-3">
                        <div>
                          <div className="mono text-[11px] font-medium text-foreground">
                            Verified only
                          </div>
                          <div className="mono text-[10px] text-muted-foreground">
                            Show only audited agents
                          </div>
                        </div>
                        <Switch
                          checked={onlyVerified}
                          onCheckedChange={setOnlyVerified}
                        />
                      </div>
                    </FilterSection>

                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <Button
                        variant="ghost"
                        className="mono h-9 text-[11px] uppercase tracking-widest text-muted-foreground"
                        onClick={() => {
                          setSelectedDomains([]);
                          setMinScore(0);
                          setTier("all");
                          setOnlyVerified(false);
                        }}
                      >
                        <RefreshCw className="mr-1.5 size-3.5" /> Reset
                      </Button>
                      <Button
                        className="mono h-9 bg-pharos-blue text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-pharos-blue/90"
                        asChild
                      >
                        <SheetTrigger asChild>
                          <span>Apply</span>
                        </SheetTrigger>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search agent name or address…"
              className="mono h-10 bg-background text-xs"
            />
            <Tabs
              defaultValue="trust"
              value={sort}
              onValueChange={(v) => setSort(v as any)}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3 border border-border bg-background p-1 sm:w-auto sm:inline-flex">
                <TabsTrigger
                  value="trust"
                  className="mono text-[11px] uppercase tracking-widest data-[state=active]:bg-pharos-blue/15 data-[state=active]:text-pharos-blue"
                >
                  <ShieldCheck className="mr-1.5 size-3.5" /> Trust
                </TabsTrigger>
                <TabsTrigger
                  value="stake"
                  className="mono text-[11px] uppercase tracking-widest data-[state=active]:bg-pharos-blue/15 data-[state=active]:text-pharos-blue"
                >
                  <Zap className="mr-1.5 size-3.5" /> Stake
                </TabsTrigger>
                <TabsTrigger
                  value="volume"
                  className="mono text-[11px] uppercase tracking-widest data-[state=active]:bg-pharos-blue/15 data-[state=active]:text-pharos-blue"
                >
                  <TrendingUp className="mr-1.5 size-3.5" /> Volume
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {selectedDomains.map((d) => (
              <Chip
                key={d}
                label={d}
                onRemove={() =>
                  setSelectedDomains((prev) => prev.filter((x) => x !== d))
                }
              />
            ))}
            {minScore > 0 && (
              <Chip
                label={`≥ ${minScore.toFixed(0)} score`}
                onRemove={() => setMinScore(0)}
              />
            )}
            {tier !== "all" && (
              <Chip label={tier} onRemove={() => setTier("all")} />
            )}
            {onlyVerified && (
              <Chip
                label="verified"
                onRemove={() => setOnlyVerified(false)}
                tone="green"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              className="mono h-8 text-[10px] uppercase tracking-widest text-muted-foreground"
              onClick={() => {
                setSelectedDomains([]);
                setMinScore(0);
                setTier("all");
                setOnlyVerified(false);
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="mt-12 grid place-items-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg border border-border bg-background">
                <Filter className="size-5 text-pharos-blue" />
              </div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                No agents match your filters
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try widening your search or removing some filters.
              </p>
              <Button
                variant="ghost"
                className="mt-3 mono h-9 text-[11px] uppercase tracking-widest text-pharos-blue"
                onClick={() => {
                  setSelectedDomains([]);
                  setMinScore(0);
                  setTier("all");
                  setOnlyVerified(false);
                }}
              >
                Reset filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </main>
  );
}

/* ───────── Agent Card ───────── */

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
  const top = Object.entries(agent.scores)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 3);
  const utilization = Math.min(100, (agent.settledVolume / agent.tierMaxVolume) * 100);
  const isVerified = ["nexus-alpha", "sentinel-x"].includes(agent.id);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface/50 transition-colors hover:border-pharos-blue/50">
      <div className="flex items-start justify-between border-b border-border bg-background px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn("size-1.5 shrink-0 rounded-full pulse-node", t.dot)}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mono truncate text-[13px] font-semibold text-foreground">
                {agent.name}
              </span>
              {isVerified && (
                <Badge className="h-4 rounded bg-pharos-blue/15 px-1 text-[9px] text-pharos-blue">
                  <CheckCircle2 className="mr-0.5 size-3" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="mono mt-0.5 text-[10px] text-muted-foreground">
              {shortAddr(agent.address)}
            </div>
          </div>
        </div>
        <span
          className={cn(
            "mono inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest shrink-0",
            t.ring,
            t.bg,
            t.text
          )}
        >
          {agent.tier}
        </span>
      </div>

      <div className="grid grid-cols-[auto_1fr] gap-3 px-4 py-4">
        <div className="hidden size-28 shrink-0 sm:block">
          <ReputationRadar agent={agent}  />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Global Score
              </span>
              <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {agent.version}
              </span>
            </div>
            <div className={cn("mono text-2xl font-semibold tabular-nums", t.text)}>
              {agent.globalScore.toFixed(1)}
            </div>
          </div>

          <div>
            <div className="mb-1 flex justify-between mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Tier capacity</span>
              <span>{utilization.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className={cn("h-full", t.dot)}
                style={{ width: `${utilization}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {top.map(([domain, s]) => (
              <Badge
                key={domain}
                className="rounded border-border bg-background px-1.5 py-0.5 text-[9px] text-muted-foreground"
              >
                <span className="mono uppercase tracking-widest">
                  {domain.slice(0, 3)}
                </span>
                <span className="ml-1 mono tabular-nums">{s.value.toFixed(0)}</span>
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
            <Metric
              label="Staked"
              value={`${(agent.staked / 1000).toFixed(1)}k`}
              unit="USDT/PROS"
            />
            <Metric
              label="Volume"
              value={`${(agent.settledVolume / 1_000_000).toFixed(1)}M`}
              unit="PROS"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto flex border-t border-border bg-background">
        <Link
          href={`/agents/mine/${agent.id}`}
          className="mono flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-surface hover:text-pharos-blue"
        >
          View profile
          <ExternalLink className="size-3" />
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
      <div className="mono mt-0.5 text-[11px] tabular-nums text-foreground">
        {value}{" "}
        <span className="mono text-[9px] uppercase tracking-widest text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}

/* ───────── Shared UI ───────── */

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}

function Chip({
  label,
  onRemove,
  tone = "blue",
}: {
  label: string;
  onRemove: () => void;
  tone?: "blue" | "green" | "amber";
}) {
  const cls =
    tone === "green"
      ? "border-pharos-green/30 bg-pharos-green/10 text-pharos-green"
      : tone === "amber"
      ? "border-pharos-amber/30 bg-pharos-amber/10 text-pharos-amber"
      : "border-pharos-blue/30 bg-pharos-blue/10 text-pharos-blue";
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] uppercase tracking-widest",
        cls
      )}
    >
      {label}
      <button
        onClick={onRemove}
        className="opacity-70 hover:opacity-100"
        aria-label={`Remove filter: ${label}`}
      >
        <ChevronDown className="size-3 rotate-45" />
      </button>
    </span>
  );
}
