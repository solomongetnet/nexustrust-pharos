'use client';
import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Hash, Wallet as WalletIcon, X } from "lucide-react";
import { AGENTS, shortAddr, REPUTATIONS, avgScore } from "@/lib/nexus-data";
import { cn } from "@/lib/utils";

const DOMAIN_TAGS = ["Coding", "DeFi", "Payments", "Social", "Governance"] as const;

export function HeaderSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // ⌘K / Ctrl+K to focus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const query = q.trim().toLowerCase();

  const matchedAgents = useMemo(() => {
    if (!query) return AGENTS.slice(0, 5);
    return AGENTS.filter((a) => {
      const inAddr = a.agentAddress.toLowerCase().includes(query);
      const inTokenId = a.tokenId.toString().includes(query);
      const inMetadataURI = a.metadataURI.toLowerCase().includes(query);
      return inAddr || inTokenId || inMetadataURI;
    }).slice(0, 6);
  }, [query]);

  const matchedTags = useMemo(() => {
    if (!query) return DOMAIN_TAGS.slice(0, 4);
    return DOMAIN_TAGS.filter((d) => d.toLowerCase().includes(query));
  }, [query]);

  const total = matchedAgents.length;
  useEffect(() => setActive(0), [query]);

  function go(agentAddress: string) {
    setOpen(false);
    setQ("");
    router.push(`/agents`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, Math.max(0, total - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && matchedAgents[active]) {
      e.preventDefault();
      go(matchedAgents[active].agentAddress);
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={cn(
          "group flex h-9 items-center gap-2 rounded-md border bg-surface/60 px-3 transition-all",
          open
            ? "border-pharos-blue/60 bg-surface shadow-[0_0_0_3px_hsl(var(--pharos-blue)/0.12)]"
            : "border-border hover:border-border/80",
        )}
      >
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search agents by address, token ID, or metadata URI…"
          className="mono h-full w-full min-w-0 flex-1 bg-transparent text-[12px] tracking-tight text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        {q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              inputRef.current?.focus();
            }}
            className="rounded p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        ) : (
          <kbd className="mono hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-muted-foreground sm:inline-flex">
            ⌘K
          </kbd>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Tag chips */}
            {matchedTags.length > 0 && (
              <div className="border-b border-border/60 px-3 py-2.5">
                <div className="mono mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Domain Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchedTags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQ(t)}
                      className="mono inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-pharos-blue hover:text-pharos-blue"
                    >
                      <Hash className="size-2.5" />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Agents */}
            <div className="p-1.5">
              <div className="mono px-2 pb-1 pt-1 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                Agents · {matchedAgents.length}
              </div>
              {matchedAgents.length === 0 ? (
                <div className="px-3 py-6 text-center">
                  <p className="text-xs text-muted-foreground">No agents match “{q}”.</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">
                    Try a token ID, address, or metadata URI.
                  </p>
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {matchedAgents.map((a, i) => {
                    const reputation = REPUTATIONS[a.agentAddress];
                    const score = reputation ? avgScore(reputation.avgScoreX100) : "-";
                    const isActive = i === active;
                    return (
                      <li key={a.agentAddress}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(i)}
                          onClick={() => go(a.agentAddress)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                            isActive ? "bg-background" : "hover:bg-background/60",
                          )}
                        >
                          <div className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-md text-[11px] font-bold",
                            a.active ? "bg-pharos-green/15 text-pharos-green" : "bg-pharos-red/15 text-pharos-red",
                          )}>
                            {a.agentAddress.slice(2, 4).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-[13px] font-medium text-foreground">{shortAddr(a.agentAddress)}</span>
                              <span className={cn(
                                "mono text-[9px] uppercase tracking-widest",
                                a.active ? "text-pharos-green" : "text-pharos-red",
                              )}>
                                · {a.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <div className="mono mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                              <WalletIcon className="size-2.5" />
                              Token #{a.tokenId}
                              {reputation && (
                                <>
                                  <span className="text-border">·</span>
                                  <span>score {score}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRight className={cn(
                            "size-3.5 shrink-0 text-muted-foreground transition-all",
                            isActive ? "translate-x-0.5 text-pharos-blue" : "opacity-0 group-hover:opacity-100",
                          )} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Footer hints */}
          <div className="flex items-center justify-between border-t border-border bg-background/60 px-3 py-2">
            <div className="mono flex items-center gap-3 text-[9px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[8px]">↑↓</kbd>
                Navigate
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[8px]">↵</kbd>
                Open
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface px-1 py-0.5 text-[8px]">Esc</kbd>
                Close
              </span>
            </div>
            <span className="mono text-[9px] uppercase tracking-widest text-pharos-green">
              <span className="mr-1 inline-block size-1.5 rounded-full bg-pharos-green pulse-node align-middle" />
              live registry
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
