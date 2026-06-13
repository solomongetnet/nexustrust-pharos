'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Check,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
  Droplet,
  Coins,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

type Transport = "SSE" | "Stdio" | "HTTP";
interface McpFunction {
  id: string;
  name: string;
  description: string;
  parameters: string;
}
interface McpServer {
  url: string;
  transport: Transport;
  functions: McpFunction[];
}
type Domain = "Coding" | "DeFi" | "Payments" | "Social" | "Governance";
const DOMAINS: Domain[] = ["Coding", "DeFi", "Payments", "Social", "Governance"];

const STEPS = [
  { n: 1, title: "Identity", hint: "Core metadata" },
  { n: 2, title: "Communication", hint: "MCP & endpoints" },
  { n: 3, title: "Protocol", hint: "Domain & payments" },
  { n: 4, title: "Review", hint: "Verify payload" },
  { n: 5, title: "Deploy", hint: "Anchor to Pharos" },
] as const;

let mcpIdCounter = 0;
const nextMcpId = () => `mcp-${++mcpIdCounter}`;

export default function CreateAgent() {
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Step 2 — single MCP server with function list
  const [mcp, setMcp] = useState<McpServer>({
    url: "",
    transport: "SSE",
    functions: [],
  });

  // Step 3
  const [domain, setDomain] = useState<Domain | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [http402, setHttp402] = useState(true);

  // Step 5
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [faucetClaimed, setFaucetClaimed] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("1000");
  const [staked, setStaked] = useState(false);

  const metadata = useMemo(
    () => ({
      name: name || null,
      description: description || null,
      image: imageUrl || null,
      communication: {
        mcp: mcp.url
          ? {
              url: mcp.url,
              transport: mcp.transport,
              functions: mcp.functions.map(({ name: n, description: d, parameters: p }) => ({
                name: n,
                description: d,
                parameters: p,
              })),
            }
          : null,
        api: null,
        email: null,
      },
      domain,
      tags,
      oasf_skills: skills,
      payment_protocols: { http_402: http402 },
    }),
    [name, description, imageUrl, mcp, domain, tags, skills, http402]
  );

  const addTag = (val: string) => {
    const v = val.trim();
    if (v && !tags.includes(v)) setTags([...tags, v]);
    setTagInput("");
  };
  const addSkill = (val: string) => {
    const v = val.trim();
    if (v && !skills.includes(v)) setSkills([...skills, v]);
    setSkillInput("");
  };

  const handleDeploy = async () => {
    setDeploying(true);
    await new Promise((r) => setTimeout(r, 2600));
    setDeploying(false);
    setDeployed(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-7xl">
          {deployed ? (
            <div className="rounded-xl border border-border bg-card/60 p-6 sm:p-10">
              <SuccessView
                name={name || "Unnamed Agent"}
                faucetClaimed={faucetClaimed}
                onClaim={() => setFaucetClaimed(true)}
                stakeAmount={stakeAmount}
                setStakeAmount={setStakeAmount}
                staked={staked}
                onStake={() => setStaked(true)}
                onDone={() => {}}
              />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
              {/* Sidebar Stepper */}
              <aside className="space-y-6">
                <Stepper current={step} onPick={(n) => n <= step && setStep(n)} />
              </aside>

              {/* Content panel */}
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-emerald-400">
                    Agent Registry · New Node
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Onboard a New Agent
                  </h1>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Mint a sovereign identity, configure MCP endpoints, and anchor the node to Pharos L1 in five steps.
                  </p>
                </div>

                <section className="rounded-xl border border-border bg-card/60">
                  <div className="border-b border-border px-6 py-4 sm:px-8">
                    <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Step {step} of 5
                    </div>
                    <div className="mt-0.5 text-base font-medium text-foreground">
                      {STEPS[step - 1].title}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {STEPS[step - 1].hint}
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-7 sm:px-8 sm:py-8">
                    {step === 1 && (
                      <Step1
                        name={name}
                        setName={setName}
                        description={description}
                        setDescription={setDescription}
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                      />
                    )}
                    {step === 2 && <Step2 mcp={mcp} setMcp={setMcp} />}
                    {step === 3 && (
                      <Step3
                        domain={domain}
                        setDomain={setDomain}
                        tags={tags}
                        setTags={setTags}
                        tagInput={tagInput}
                        setTagInput={setTagInput}
                        addTag={addTag}
                        skills={skills}
                        setSkills={setSkills}
                        skillInput={skillInput}
                        setSkillInput={setSkillInput}
                        addSkill={addSkill}
                        http402={http402}
                        setHttp402={setHttp402}
                      />
                    )}
                    {step === 4 && <Step4 metadata={metadata} />}
                    {step === 5 && <Step5 deploying={deploying} />}
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4 sm:px-8">
                    <Button
                      variant="outline"
                      onClick={() => setStep((s) => Math.max(1, s - 1))}
                      disabled={step === 1 || deploying}
                      className="mono border-border bg-transparent text-[11px] uppercase tracking-widest hover:bg-muted"
                    >
                      <ArrowLeft className="mr-1.5 size-3.5" /> Back
                    </Button>
                    {step < 5 ? (
                      <Button
                        onClick={() => setStep((s) => Math.min(5, s + 1))}
                        className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
                      >
                        Continue <ArrowRight className="ml-1.5 size-3.5" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleDeploy}
                        disabled={deploying}
                        className="mono bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400"
                      >
                        {deploying ? (
                          <>
                            <Loader2 className="mr-2 size-3.5 animate-spin" />
                            Anchoring to Pharos L1…
                          </>
                        ) : (
                          <>
                            <div className="mr-2 size-3.5" /> Deploy Agent Node to Pharos
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ───────── Stepper (vertical on all screens, more prominent on big screens) ───────── */
function Stepper({ current, onPick }: { current: number; onPick: (n: number) => void }) {
  return (
    <ol className="flex flex-col gap-2 rounded-xl border border-border bg-card/60 p-4 w-full">
      {STEPS.map((s) => {
        const done = current > s.n;
        const active = current === s.n;
        const clickable = s.n <= current; // Allow clicking all previous and current steps
        return (
          <li key={s.n} className="w-full">
            <button
              type="button"
              onClick={() => clickable && onPick(s.n)}
              disabled={!clickable}
              className={`group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                active
                  ? "bg-emerald-500/10 ring-1 ring-inset ring-emerald-500/30"
                  : done
                    ? "hover:bg-muted"
                    : "opacity-70"
              } ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`mono flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
                  done
                    ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-400"
                    : active
                      ? "border-emerald-500 bg-emerald-500 text-background"
                      : "border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="size-3.5" /> : s.n}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`mono block truncate text-[11px] uppercase tracking-widest ${
                    active ? "text-emerald-300" : done ? "text-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {s.title}
                </span>
                <span className="hidden truncate text-[10px] text-muted-foreground lg:block">
                  {s.hint}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ───────── Step 1 ───────── */
function Step1({
  name,
  setName,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
}: {
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  imageUrl: string;
  setImageUrl: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Core Identity"
        hint="ERC-721 metadata"
      />
      <FieldRow label="Agent Name" required>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nexus-Alpha-09"
          className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
        />
      </FieldRow>
      <FieldRow label="Description" required hint="Markdown supported.">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="High-availability DeFi execution agent with sub-200ms routing across L1/L2 venues..."
          rows={5}
          className="resize-none border-border bg-background text-sm focus-visible:ring-emerald-500/40"
        />
      </FieldRow>
      <FieldRow label="Image URL" hint="Must be https:// or ipfs://">
        <div className="flex items-start gap-3">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ipfs.io/ipfs/Qm…"
            className="border-border bg-background text-sm focus-visible:ring-emerald-500/40"
          />
          <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-background">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            ) : (
              <ImageIcon className="size-5 text-muted-foreground/70" />
            )}
          </div>
        </div>
      </FieldRow>
    </div>
  );
}

/* ───────── Step 2 (Tabs) ───────── */
function Step2({
  mcp,
  setMcp,
}: {
  mcp: McpServer;
  setMcp: React.Dispatch<React.SetStateAction<McpServer>>;
}) {
  const updateServer = (patch: Partial<Omit<McpServer, "functions">>) =>
    setMcp((prev) => ({ ...prev, ...patch }));

  const addFn = () =>
    setMcp((prev) => ({
      ...prev,
      functions: [
        ...prev.functions,
        { id: nextMcpId(), name: "", description: "", parameters: "" },
      ],
    }));

  const updateFn = (id: string, patch: Partial<McpFunction>) =>
    setMcp((prev) => ({
      ...prev,
      functions: prev.functions.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));

  const removeFn = (id: string) =>
    setMcp((prev) => ({ ...prev, functions: prev.functions.filter((f) => f.id !== id) }));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Communication Hub"
        hint="Configure how the agent receives tool & context calls."
      />

      <Tabs defaultValue="mcp" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-background border border-border p-1 h-auto">
          <TabsTrigger
            value="mcp"
            className="mono flex items-center gap-1.5 text-[11px] uppercase tracking-widest data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-300 data-[state=active]:shadow-none"
          >
            <div className="size-3.5" /> MCP
            <Badge className="ml-1 hidden bg-emerald-500/10 px-1.5 py-0 text-[9px] text-emerald-400 hover:bg-emerald-500/10 sm:inline-flex">
              {mcp.functions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="mono flex items-center gap-1.5 text-[11px] uppercase tracking-widest data-[state=active]:bg-muted data-[state=active]:text-foreground/80"
          >
            <div className="size-3.5" /> API
            <Lock className="ml-0.5 size-3 text-muted-foreground/70" />
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="mono flex items-center gap-1.5 text-[11px] uppercase tracking-widest data-[state=active]:bg-muted data-[state=active]:text-foreground/80"
          >
            <div className="size-3.5" /> Email
            <Lock className="ml-0.5 size-3 text-muted-foreground/70" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mcp" className="mt-5 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Single Model Context Protocol server that hosts this agent's tool surface.
            </p>
            <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10">
              Active
            </Badge>
          </div>

          {/* Single MCP server */}
          <div className="rounded-md border border-border bg-background p-4">
            <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              MCP Server
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px] sm:items-center">
              <Input
                value={mcp.url}
                onChange={(e) => updateServer({ url: e.target.value })}
                placeholder="https://mcp.example.com/sse"
                className="border-border bg-card text-sm focus-visible:ring-emerald-500/40"
              />
              <Select
                value={mcp.transport}
                onValueChange={(v: Transport) => updateServer({ transport: v })}
              >
                <SelectTrigger className="border-border bg-card text-sm focus:ring-emerald-500/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-background">
                  <SelectItem value="SSE">SSE</SelectItem>
                  <SelectItem value="Stdio">Stdio</SelectItem>
                  <SelectItem value="HTTP">HTTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Functions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  MCP Functions
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Declare callable tools this MCP server exposes to clients.
                </p>
              </div>
              <Badge className="bg-muted text-muted-foreground hover:bg-muted">
                {mcp.functions.length}
              </Badge>
            </div>

            {mcp.functions.length === 0 && (
              <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
                <p className="text-xs text-muted-foreground">
                  No functions yet. Add one to describe a tool callable on this MCP server.
                </p>
              </div>
            )}

            <div className="space-y-2">
              {mcp.functions.map((f, i) => (
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
                      onClick={() => removeFn(f.id)}
                      className="size-7 text-muted-foreground hover:bg-muted hover:text-pharos-red"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        value={f.name}
                        onChange={(e) => updateFn(f.id, { name: e.target.value })}
                        placeholder="get_market_price"
                        className="border-border bg-card text-xs focus-visible:ring-emerald-500/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Description
                      </Label>
                      <Textarea
                        value={f.description}
                        onChange={(e) => updateFn(f.id, { description: e.target.value })}
                        placeholder="Fetches the live mid-market price for a given asset symbol."
                        rows={2}
                        className="resize-none border-border bg-card text-xs focus-visible:ring-emerald-500/40"
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
                        onChange={(e) => updateFn(f.id, { parameters: e.target.value })}
                        placeholder={`{\n  "symbol": { "type": "string", "required": true }\n}`}
                        rows={4}
                        className="mono resize-none border-border bg-card text-xs text-emerald-300/90 focus-visible:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addFn}
                className="mono w-full border-dashed border-border bg-transparent text-[11px] uppercase tracking-widest text-muted-foreground hover:bg-muted"
              >
                <Plus className="mr-1.5 size-3.5" /> Add MCP Endpoint
              </Button>
            </div>
          </div>
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

function LockedNotice({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-muted/30 p-6 opacity-80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-card">
            <div className="size-4 text-muted-foreground" />
          </div>
          <div>
            <div className="mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {label}
            </div>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted-foreground/70">
              Coming soon...
            </p>
          </div>
        </div>
        <Badge className="shrink-0 bg-muted text-muted-foreground hover:bg-muted">
          Coming Soon
        </Badge>
      </div>
    </div>
  );
}

/* ───────── Step 3 ───────── */
function Step3(props: {
  domain: Domain | null;
  setDomain: (d: Domain) => void;
  tags: string[];
  setTags: (t: string[]) => void;
  tagInput: string;
  setTagInput: (v: string) => void;
  addTag: (v: string) => void;
  skills: string[];
  setSkills: (s: string[]) => void;
  skillInput: string;
  setSkillInput: (v: string) => void;
  addSkill: (v: string) => void;
  http402: boolean;
  setHttp402: (v: boolean) => void;
}) {
  const {
    domain,
    setDomain,
    tags,
    setTags,
    tagInput,
    setTagInput,
    addTag,
    skills,
    setSkills,
    skillInput,
    setSkillInput,
    addSkill,
    http402,
    setHttp402,
  } = props;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SectionTitle
        title="Primary Domain"
        hint="Drives tier eligibility"
      />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-2">
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

      <div className="lg:col-span-2">
        <SectionTitle
          title="Payment Protocols"
          hint=""
        />
        <div className="flex items-center justify-between rounded-md border border-border bg-background p-3">
          <div className="min-w-0">
            <div className="mono text-sm font-medium text-foreground">HTTP 402 · x402</div>
            <div className="text-[11px] text-muted-foreground">
              Settle micropayments via on-chain receipts.
            </div>
          </div>
          <Switch checked={http402} onCheckedChange={setHttp402} />
        </div>
      </div>

      <div className="lg:col-span-2">
        <SectionTitle
          title="Tags"
          hint="Routing & discovery"
        />
        <ChipEditor
          values={tags}
          input={tagInput}
          setInput={setTagInput}
          onAdd={addTag}
          onRemove={(v) => setTags(tags.filter((x) => x !== v))}
          placeholder="add a tag…"
          tone="blue"
        />
      </div>

      <div className="lg:col-span-2">
        <SectionTitle
          title="OASF Skills"
          hint="Open Agent Skill Format"
        />
        <ChipEditor
          values={skills}
          input={skillInput}
          setInput={setSkillInput}
          onAdd={addSkill}
          onRemove={(v) => setSkills(skills.filter((x) => x !== v))}
          placeholder="add a skill…"
          tone="green"
        />
      </div>

      <div className="lg:col-span-2">
        <SaveBar />
      </div>
    </div>
  );
}

/* ───────── Step 4 ───────── */
function Step4({ metadata }: { metadata: Record<string, unknown> }) {
  const m = metadata as any;
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Review & Decentralized Storage"
        hint="Verify the configuration before pinning."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <SummaryCard label="Name" value={m.name ?? "—"} />
        <SummaryCard label="Domain" value={m.domain ?? "—"} accent />
        <SummaryCard label="Image" value={m.image ?? "—"} truncate />
        <SummaryCard
          label="MCP Endpoint"
          value={
            m.communication?.mcp?.url
              ? `${m.communication.mcp.functions?.length ?? 0} function(s)`
              : "Not configured"
          }
        />
        <SummaryCard label="Tags" value={m.tags?.length ? m.tags.join(", ") : "—"} />
        <SummaryCard
          label="OASF Skills"
          value={m.oasf_skills?.length ? m.oasf_skills.join(", ") : "—"}
        />
        <SummaryCard
          label="HTTP 402"
          value={m.payment_protocols.http_402 ? "Enabled" : "Disabled"}
          accent={m.payment_protocols.http_402}
        />
        <SummaryCard label="Description" value={m.description ?? "—"} truncate />
      </div>

      <div>
        <Label className="mono mb-2 block text-[11px] uppercase tracking-widest text-muted-foreground">
          Raw Metadata (JSON)
        </Label>
        <pre className="max-h-96 overflow-auto rounded-md border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-400">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      </div>

      <div className="flex items-start gap-3 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300">
        <span className="text-base leading-none">ℹ️</span>
        <p>Your agent's structural configuration metadata will be immutably pinned to IPFS.</p>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
  truncate,
}: {
  label: string;
  value: string;
  accent?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div
        className={`mt-1 text-sm ${accent ? "text-emerald-400" : "text-foreground"} ${
          truncate ? "truncate" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/* ───────── Step 5 ───────── */
function Step5({ deploying }: { deploying: boolean }) {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="Pharos Network Settlement"
        hint="Anchor agent public address and IPFS hash onto Pharos L1 registry contract."
      />

      <div className="rounded-md border border-border bg-background p-5">
        <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          Pending On-Chain Action
        </div>
        <code className="mono block break-all text-xs text-emerald-400">
          NexusTrustRegistry.register(owner, ipfsCid, domainTag)
        </code>
        <p className="mt-3 text-xs text-muted-foreground">
          Network Fee: ≈ 0.018 PROS (native gas burn). Settlement collateral remains in USDT/PROS.
        </p>
      </div>

      {deploying && (
        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-emerald-300">
            <Loader2 className="size-4 animate-spin" />
            Anchoring agent identity onto Pharos L1…
          </div>
          <div className="h-1 w-full overflow-hidden rounded bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded bg-emerald-500" />
          </div>
          <div className="mono mt-3 space-y-1 text-[11px] text-muted-foreground">
            <div>→ pin metadata → ipfs://Qm…c8a2</div>
            <div>→ submit NexusTrustRegistry.register()</div>
            <div className="text-emerald-400">→ awaiting block confirmation…</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── Success ───────── */
function SuccessView({
  name,
  faucetClaimed,
  onClaim,
  stakeAmount,
  setStakeAmount,
  staked,
  onStake,
  onDone,
}: {
  name: string;
  faucetClaimed: boolean;
  onClaim: () => void;
  stakeAmount: string;
  setStakeAmount: (v: string) => void;
  staked: boolean;
  onStake: () => void;
  onDone: () => void;
}) {
  return (
    <div className="space-y-7">
      <div className="flex flex-col items-center text-center">
        <div className="grid size-14 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
          <Check className="size-7 text-emerald-400" />
        </div>
        <h2 className="mt-4 text-lg font-medium">Agent node deployed</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="text-foreground">{name}</span> is live on Pharos L1 · Probationary tier
        </p>
        <code className="mono mt-3 rounded bg-background px-3 py-1.5 text-[11px] text-emerald-400">
          0x4a91…c8a2 · ipfs://Qm…d3f1
        </code>
      </div>

      <div>
        <div className="mono mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          Optional Next Steps · Financial Bootstrap
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-border bg-background p-5">
            <div className="mb-3 flex items-center gap-2">
              <Droplet className="size-4 text-emerald-400" />
              <h3 className="text-sm font-medium">Mock USDT/PROS Faucet</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Drip 10,000 USDT/PROS + 0.5 PROS gas to your agent's public key for bootstrap liquidity.
            </p>
            <Button
              onClick={onClaim}
              disabled={faucetClaimed}
              className="mono mt-4 w-full bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400 disabled:opacity-50"
            >
              {faucetClaimed ? (
                <>
                  <Check className="mr-1.5 size-3.5" /> Faucet claimed
                </>
              ) : (
                "Claim Faucet"
              )}
            </Button>
          </div>

          <div className="rounded-md border border-border bg-background p-5">
            <div className="mb-3 flex items-center gap-2">
              <Coins className="size-4 text-emerald-400" />
              <h3 className="text-sm font-medium">Stake to Safety Pool</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Deposit USDT/PROS into the NexusTrust pool to boost baseline trust score.
            </p>
            <div className="mt-4 flex gap-2">
              <Input
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                disabled={staked}
                className="border-border bg-card text-sm focus-visible:ring-emerald-500/40"
              />
              <Button
                onClick={onStake}
                disabled={staked || !stakeAmount}
                className="mono shrink-0 bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400 disabled:opacity-50"
              >
                {staked ? <Check className="size-3.5" /> : "Stake"}
              </Button>
            </div>
            {staked && (
              <div className="mono mt-2 text-[10px] text-emerald-400">
                +{stakeAmount} USDT/PROS staked · trust score boosted
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-3 border-t border-border pt-6 sm:flex-row">
        <Link href="/agents">
          <Button
            variant="outline"
            className="mono border-border bg-transparent text-[11px] uppercase tracking-widest hover:bg-muted"
          >
            <ExternalLink className="mr-1.5 size-3.5" />
            View in Agent Registry
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ───────── shared ───────── */
function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-medium tracking-tight">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
function FieldRow({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="mono flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
        {required && <span className="text-emerald-400">*</span>}
        {hint && <span className="text-muted-foreground/70 normal-case tracking-normal">· {hint}</span>}
      </Label>
      {children}
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
        <Button className="mono h-9 rounded bg-emerald-500 text-[11px] font-semibold uppercase tracking-widest text-background hover:bg-emerald-400">
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
              <X className="size-3" />
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

function Lock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}
