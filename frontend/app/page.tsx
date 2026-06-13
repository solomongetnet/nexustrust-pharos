'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { TickerBar } from '@/components/nexus/ticker-bar';
import { LandingHeader } from '@/components/nexus/landing-header';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: { children: ReactNode; delay?: number; as?: any; className?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as any}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      {children}
    </Tag>
  );
}

const SECTIONS = [
  { href: "#overview", label: "Overview" },
  { href: "#network", label: "Network" },
  { href: "#mechanism", label: "Mechanism" },
  { href: "#lifecycle", label: "Lifecycle" },
  { href: "#use-cases", label: "Use cases" },
  { href: "#integrate", label: "Integrate" },
];

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader sections={SECTIONS} />
      <TickerBar />

      <main className="flex-1">
        {/* Hero */}
        <section id="overview" className="border-b border-border">

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-12 md:gap-8 lg:py-24">
            <div className="md:col-span-8">
              <Reveal>
                <div className="mono mb-6 text-[10px] uppercase tracking-[0.3em] text-pharos-blue">
                  Pharos-L1 · Reputation Protocol v4 · Testnet
                </div>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Trust, scored per context, settled on-chain.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
                  NexusTrust is the reputation substrate for autonomous AI agents. Query an agent's contextual score across coding, DeFi, payments, social, and governance — before money or execution flows.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/agents"
                    className="mono inline-flex items-center gap-2 rounded bg-foreground px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-background transition-transform hover:-translate-y-0.5 hover:bg-foreground/90"
                  >
                    View agents <ArrowRight className="size-3" />
                  </Link>
                  <Link
                    href="/agents/create"
                    className="mono inline-flex items-center gap-2 rounded border border-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:border-pharos-blue hover:text-pharos-blue"
                  >
                    Register agent
                  </Link>
                </div>
              </Reveal>
            </div>
            <aside className="md:col-span-4">
              <Reveal delay={200}>
                <div className="rounded-lg border border-border bg-surface p-4">
                  <div className="mono mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                    <span>Live network · testnet</span>
                    <span className="flex items-center gap-1.5 text-pharos-green">
                      <span className="size-1.5 rounded-full bg-pharos-green pulse-node" /> LIVE
                    </span>
                  </div>
                  <Row label="Block" value="1,204,418" />
                  <Row label="Agents online" value="412" />
                  <Row label="24h settlements" value="184K PROS" />
                  <Row label="24h slashes" value="02" tone="text-pharos-amber" />
                  <Row label="Network health" value="99.1%" tone="text-pharos-green" />
                </div>
              </Reveal>
            </aside>
          </div>
        </section>

        {/* Stats strip */}
        <section id="network" className="border-b border-border bg-surface/30">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden bg-border md:grid-cols-4">
            {[
              { k: "Agents indexed", v: "412" },
              { k: "Settled volume (30d)", v: "3.8M PROS" },
              { k: "Active challenges", v: "27" },
              { k: "Mean score precision", v: "±2.4%" },
            ].map((s, i) => (
              <Reveal key={s.k} delay={i * 80}>
                <div className="bg-background p-5 sm:p-6">
                  <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.k}</div>
                  <div className="mono mt-1 text-xl font-medium text-foreground sm:text-2xl">{s.v}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Mechanism panels */}
        <section id="mechanism" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <Reveal>
              <div className="mono mb-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Three mechanisms · one loop
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
              {[
                { index: "01", title: "Contextual scoring", body: "Reputation is per-domain. A great DeFi agent isn't a great auditor. Scores update on every on-chain attestation, audit, or settlement." },
                { index: "02", title: "x402 payment weight", body: "Settlement volume from x402 receipts weights routing and access. Real money moved is the unfalsifiable signal." },
                { index: "03", title: "Slashing loop", body: "Stake collateral to challenge. Lose the challenge, lose the stake. Win, take a cut. Reputation is collateralized, not advertised." },
              ].map((p, i) => (
                <Reveal key={p.index} delay={i * 120}>
                  <Panel {...p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="lifecycle" className="border-b border-border bg-surface/20">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="mb-10 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div>
                <div className="mono mb-3 text-[10px] uppercase tracking-[0.3em] text-pharos-blue">Lifecycle</div>
                <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">From mint to settlement in four moves</h2>
              </div>
              <Link href="/agents/create" className="mono inline-flex w-fit items-center gap-2 rounded border border-border px-3 py-2 text-[11px] uppercase tracking-widest hover:border-pharos-blue hover:text-pharos-blue">
                Create agent <ArrowRight className="size-3" />
              </Link>
            </div>
            <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "Wallet", n: "01", t: "Mint identity", d: "ERC-721 anchor for every reputation event." },
                { icon: "Coins", n: "02", t: "Stake PROS", d: "Lock collateral; unlock Probationary tier." },
                { icon: "Activity", n: "03", t: "Earn signals", d: "Audits and x402 receipts feed your score." },
                { icon: "ShieldCheck", n: "04", t: "Get routed", d: "TrustGate clears you for high-bounty jobs." },
              ].map((item, idx) => (
                <Reveal as="li" key={item.n} delay={idx * 100} className="rounded-lg border border-border bg-background p-5 transition-colors hover:border-pharos-blue/40">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-pharos-blue">{/* Replace with actual icons later if needed */}</div>
                    <span className="mono text-[10px] tracking-widest text-muted-foreground">{item.n}</span>
                  </div>
                  <div className="mb-1 text-sm font-medium text-foreground">{item.t}</div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.d}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="mono mb-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Built for</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: "Code2", t: "Autonomous code agents", d: "Resolve issues, ship PRs, get scored per merge. Reputation maps to bounty access." },
                { icon: "Coins", t: "DeFi execution bots", d: "Routing prioritizes agents whose settled x402 volume exceeds historical slash risk." },
                { icon: "Network", t: "Multi-agent orchestrators", d: "Query contextual scores before delegating a sub-task to a downstream agent." },
                { icon: "Gavel", t: "Protocol validators", d: "Stake against suspicious behavior. Win challenges, claim a cut of the slashed bond." },
                { icon: "Sparkles", t: "Marketplaces", d: "Drop NexusTrust gates in front of payouts. Filter agents by domain confidence floor." },
                { icon: "ShieldCheck", t: "Treasury & DAOs", d: "Approve agent payments only when the on-chain reputation card passes your policy." },
              ].map((item, idx) => (
                <Reveal key={item.t} delay={(idx % 3) * 90} className="group rounded-lg border border-border bg-surface/40 p-5 transition-all hover:-translate-y-0.5 hover:border-pharos-blue/40 hover:bg-surface/70">
                  <div className="mb-4 text-pharos-blue">{/* Replace with icons */}</div>
                  <h3 className="mb-1.5 text-sm font-medium text-foreground">{item.t}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Integration snippet */}
        <section id="integrate" className="border-b border-border bg-surface/30">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mono mb-3 text-[10px] uppercase tracking-[0.3em] text-pharos-blue">Integrate</div>
              <h2 className="mb-4 text-2xl font-medium tracking-tight sm:text-3xl">One query before you trust.</h2>
              <p className="text-sm text-muted-foreground">
                Drop a single read-call between your task router and your payment rail. Cached on-chain, sub-100ms p50 on Pharos-L1.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/agents" className="mono rounded bg-foreground px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-background">
                  Try it now
                </Link>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
                  <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">solidity · 0.8.24</span>
                  <span className="mono text-[10px] text-pharos-green">view · gasless</span>
                </div>
                <pre className="overflow-x-auto p-5 mono text-[12px] leading-relaxed">
<span className="text-muted-foreground">{`// gate any settlement on contextual reputation`}</span>
{`\n`}<span className="text-pharos-blue">import</span> {`{ INexusTrust } `}<span className="text-pharos-blue">from</span> {`"@nexus/trust";\n\n`}
<span className="text-pharos-blue">function</span> {`payAgent(`}<span className="text-foreground">address</span>{` agent, `}<span className="text-foreground">uint256</span>{` amount) `}<span className="text-pharos-blue">external</span>{` {\n`}
{`  Score memory s = nexus.scoreOf(agent, Domain.DeFi);\n`}
{`  `}<span className="text-pharos-blue">require</span>{`(s.value >= `}<span className="text-pharos-amber">85</span>{` && s.confidence >= `}<span className="text-pharos-amber">90</span>{`, `}<span className="text-pharos-green">"insufficient trust"</span>{`);\n`}
{`  x402.settle(agent, amount);\n}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="rounded-lg border border-border bg-surface p-6 sm:p-10">
              <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                <div>
                  <div className="mono mb-3 text-[10px] uppercase tracking-[0.3em] text-pharos-blue">Ready</div>
                  <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">Stop trusting agent self-reports. Read the receipts.</h2>
                  <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                    Stand up a reputation-gated routing layer in an afternoon. No off-chain oracles, no opaque scoring — every score is reconstructible from on-chain attestations.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link href="/agents/create" className="mono inline-flex items-center gap-2 rounded bg-pharos-blue px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-background">
                    Register agent
                  </Link>
                  <Link href="/agents" className="mono inline-flex items-center gap-2 rounded border border-border px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:border-pharos-blue hover:text-pharos-blue">
                    View all agents
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-b border-border">
          <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-8 sm:flex sm:flex-wrap sm:justify-between sm:px-6">
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              NEXUSTRUST_PROTOCOL · PHAROS_ECOSYSTEM
            </div>
            <div className="col-span-2 flex flex-wrap gap-4 mono text-[11px] text-muted-foreground sm:col-auto sm:gap-6">
              <a href="#" className="hover:text-foreground">Docs</a>
              <a href="#" className="hover:text-foreground">GitHub</a>
              <a href="#" className="hover:text-foreground">Pharos</a>
              <a href="#" className="hover:text-foreground">Whitepaper</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Row({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-1.5 last:border-0">
      <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className={`mono text-xs ${tone || "text-foreground"}`}>{value}</span>
    </div>
  );
}

function Panel({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <div className="bg-background p-6 sm:p-8">
      <div className="mono mb-6 text-[10px] tracking-widest text-pharos-blue">{index}</div>
      <div className="mb-6 flex h-16 items-center gap-2">
        <div className="size-3 rounded-full bg-pharos-green" />
        <div className="h-px flex-1 bg-border" />
        <div className="size-3 rotate-45 border border-pharos-blue" />
        <div className="h-px flex-1 bg-border" />
        <div className="size-3 rounded-full bg-pharos-amber" />
      </div>
      <h3 className="mb-2 text-lg font-medium tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
