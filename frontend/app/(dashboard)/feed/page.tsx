'use client';

import { useState } from 'react';
import { SlashEventRow } from '@/components/nexus/slash-event-row';
import { ACTIVITY, DOMAINS } from '@/lib/nexus-data';

type Filter = "all" | "severe" | "warning" | "positive";

export default function Feed() {
  const [filter, setFilter] = useState<Filter>("all");
  const events = ACTIVITY.filter((e) => filter === "all" || e.severity === filter);

  const heatmap = DOMAINS.map((d) => ({
    domain: d,
    counts: Array.from({ length: 30 }, () => Math.floor(Math.random() * 12)),
  }));

  return (
    <main className="flex-1">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:flex sm:flex-wrap sm:justify-between">
            <div className="min-w-0">
              <h1 className="mb-1 text-xl font-medium tracking-tight sm:text-2xl">Event Feed</h1>
              <p className="mono text-[11px] text-muted-foreground sm:text-xs">
                Streaming · oldest below · auto-refresh 2s
              </p>
            </div>
            <div className="col-span-2 flex gap-1 overflow-x-auto rounded border border-border bg-surface p-1 sm:col-auto">
              {(["all", "severe", "warning", "positive"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`mono shrink-0 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                    filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface/60 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Slash frequency · last 30 days · by domain
              </h3>
              <div className="flex items-center gap-2 mono text-[9px] text-muted-foreground">
                <span>0</span>
                <div className="flex gap-px">
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
                    <div key={o} className="size-3" style={{ background: `oklch(0.66 0.22 25 / ${o})` }} />
                  ))}
                </div>
                <span>12+</span>
              </div>
            </div>
            <div className="space-y-1 overflow-x-auto">
              {heatmap.map((row) => (
                <div key={row.domain} className="grid min-w-[420px] grid-cols-[80px_1fr] items-center gap-2 sm:grid-cols-[100px_1fr]">
                  <span className="mono text-[10px] uppercase tracking-wider text-muted-foreground">{row.domain}</span>
                  <div className="flex gap-px">
                    {row.counts.map((c, i) => (
                      <div
                        key={i}
                        className="h-4 flex-1 rounded-sm"
                        style={{ background: `oklch(0.66 0.22 25 / ${Math.min(0.95, c / 12)})` }}
                        title={`Day ${i + 1}: ${c} slashes`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface/60">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-[110px_90px_1fr_140px_80px_20px] gap-3 border-b border-border px-3 py-2 mono text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <span>Time</span>
                  <span>Type</span>
                  <span>Event</span>
                  <span>Tx hash</span>
                  <span className="text-right">Delta</span>
                  <span />
                </div>
                <div>
                  {events.map((e, i) => (
                    <SlashEventRow key={e.id} event={e} fresh={i === 0} />
                  ))}
                  {events.length === 0 && (
                    <p className="p-8 text-center mono text-xs text-muted-foreground">
                      No events match this filter. Try widening the severity.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
