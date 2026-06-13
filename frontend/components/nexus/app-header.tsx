'use client';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Plus, Info } from "lucide-react";
import { ConnectWalletButton } from "@/components/nexus/connect-wallet-button";
import { ThemeToggle } from "@/components/nexus/theme-toggle";
import { HeaderSearch } from "@/components/nexus/header-search";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/agents", label: "Agents" },
  { href: "/agents/create", label: "Register" },
] as const;

function NetworkToggle() {
  const [mode, setMode] = useState<"testnet" | "mainnet">("testnet");
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <Popover open={infoOpen} onOpenChange={setInfoOpen}>
      <div className="inline-flex items-center rounded-md border border-border bg-surface p-0.5">
        <button
          type="button"
          onClick={() => {
            setMode("testnet");
            setInfoOpen(false);
          }}
          className={cn(
            "mono inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors",
            mode === "testnet"
              ? "bg-pharos-green/15 text-pharos-green"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <span className={cn("size-1.5 rounded-full", mode === "testnet" ? "bg-pharos-green pulse-node" : "bg-muted-foreground")} />
          Testnet
        </button>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className={cn(
              "mono inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest transition-colors",
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            Mainnet
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-72 border-border bg-surface p-0"
      >
        <div className="flex items-start gap-3 border-b border-border bg-gradient-to-br from-pharos-amber/10 to-transparent p-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-pharos-amber/15 text-pharos-amber">
            <Info className="size-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground">Mainnet unavailable</h4>
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
              NexusTrust is currently running on <span className="text-foreground">Pharos Testnet</span> only.
              Mainnet launch is coming soon — stay tuned for the official announcement.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5">
          <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Status
          </span>
          <span className="mono inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-pharos-amber">
            <span className="size-1.5 rounded-full bg-pharos-amber pulse-node" />
            Coming soon
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export type SectionLink = { href: string; label: string };

export function AppHeader({ sections }: { sections?: SectionLink[] } = {}) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(
    sections && sections.length ? sections[0].href : null,
  );

  // Scroll-spy for section nav
  useEffect(() => {
    if (!sections || !sections.length) return;
    const els = sections
      .map((s) => document.getElementById(s.href.replace(/^#/, "")))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection("#" + visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);


  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      {/* Top bar — brand + search + utilities */}
      <div className="flex h-14 items-center gap-3 border-b border-border/60 px-4 sm:gap-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <div className="size-3 rounded-sm bg-pharos-green pulse-node" />
          <span className="mono text-sm font-semibold tracking-tighter">
            NEXUSTRUST<span className="hidden text-muted-foreground sm:inline">::v0.1.4</span>
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <div className="w-full max-w-md">
            <HeaderSearch />
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <NetworkToggle />
          </div>
          <div className="hidden h-6 w-px bg-border sm:block" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => router.push("/agents/create")}
            className="mono hidden items-center gap-1.5 rounded bg-pharos-blue px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 sm:inline-flex"
          >
            <Plus className="size-3.5" />
            Create
          </button>
          <ConnectWalletButton />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mono inline-flex size-9 items-center justify-center rounded border border-border md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="border-b border-border/60 px-4 py-2 md:hidden">
        <HeaderSearch />
      </div>

      {/* Secondary bar — navigation links */}
      <div className="hidden h-11 items-center justify-between gap-4 px-4 sm:px-6 md:flex">
        <nav className="flex items-center gap-1">
          {sections && sections.length ? (
            sections.map((s) => {
              const active = activeSection === s.href;
              return (
                <a
                  key={s.href}
                  href={s.href}
                  className={cn(
                    "mono relative px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors",
                    active
                      ? "text-foreground after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-t after:bg-pharos-blue"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.label}
                </a>
              );
            })
          ) : (
            NAV.map((n) => {
              const active =
                n.href === "/agents"
                  ? path === "/agents" || path.startsWith("/agents/")
                  : path === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "mono relative px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors",
                    active
                      ? "text-foreground after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-t after:bg-pharos-blue"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {n.label}
                </Link>
              );
            })
          )}
        </nav>
        <div className="mono hidden items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground lg:flex">
          <span>Network</span>
          <span className="text-pharos-green">Pharos-L1 · 98.2% Optimal</span>
        </div>
      </div>


      {/* Mobile menu */}
      {open && (
        <nav className="grid border-t border-border bg-background md:hidden">
          <div className="border-b border-border px-5 py-3 sm:hidden">
            <NetworkToggle />
          </div>
          {sections && sections.length
            ? sections.map((s) => {
                const active = activeSection === s.href;
                return (
                  <a
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "mono border-b border-border px-5 py-3 text-[11px] uppercase tracking-widest",
                      active ? "bg-surface text-pharos-blue" : "text-muted-foreground",
                    )}
                  >
                    {s.label}
                  </a>
                );
              })
            : NAV.map((n) => {
                const active =
                  n.href === "/agents"
                    ? path === "/agents" || path.startsWith("/agents/")
                    : path === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "mono border-b border-border px-5 py-3 text-[11px] uppercase tracking-widest",
                      active ? "bg-surface text-pharos-blue" : "text-muted-foreground",
                    )}
                  >
                    {n.label}
                  </Link>
                );
              })}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/agents/create");
            }}
            className="mono flex items-center gap-1.5 border-b border-border px-5 py-3 text-[11px] uppercase tracking-widest text-pharos-blue"
          >
            <Plus className="size-3.5" />
            Create Agent
          </button>
        </nav>
      )}

    </header>
  );
}
