'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/nexus/theme-toggle";
import { cn } from "@/lib/utils";


export type SectionLink = { href: string; label: string };

export function LandingHeader({ sections }: { sections: SectionLink[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(sections[0]?.href ?? "");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = sections.map((s) => s.href.replace(/^#/, ""));
    const compute = () => {
      const probe = 72; // just below sticky header (56px) + small buffer

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - probe <= 0) current = id;
      }
      // Bottom of page → force last section active
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        current = ids[ids.length - 1];
      }
      setActive("#" + current);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [sections]);


  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur"
          : "border-b border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <div className="size-2.5 rounded-full bg-pharos-green pulse-node" />
          <span className="mono text-sm font-semibold tracking-tighter">NEXUSTRUST</span>
        </Link>

        <nav className="ml-2 hidden flex-1 items-center justify-center gap-1 md:flex">
          {sections.map((s) => {
            const isActive = active === s.href;
            return (
              <a
                key={s.href}
                href={s.href}
                className={cn(
                  "mono relative px-3 py-2 text-[11px] uppercase tracking-widest transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {s.label}
                <span
                  className={cn(
                    "pointer-events-none absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-pharos-blue transition-all duration-300",
                    isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-50",
                  )}
                  style={{ transformOrigin: "center" }}
                />
              </a>
            );
          })}
        </nav>


        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <div className="mx-1 h-5 w-px bg-border" />
          <Link
            href="/dashboard"
            className="mono rounded-full border border-border px-3.5 py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/agents/create"
            className="mono rounded-full bg-foreground px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Launch app
          </Link>
        </div>


        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex size-9 items-center justify-center rounded border border-border md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav className="grid border-t border-border bg-background md:hidden">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              onClick={() => setOpen(false)}
              className={cn(
                "mono border-b border-border px-5 py-3 text-[11px] uppercase tracking-widest",
                active === s.href ? "bg-surface text-pharos-blue" : "text-muted-foreground",
              )}
            >
              {s.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mono border-b border-border px-5 py-3 text-[11px] uppercase tracking-widest text-muted-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/agents/create"
            onClick={() => setOpen(false)}
            className="mono border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-pharos-blue"
          >
            Launch app
          </Link>
        </nav>
      )}
    </header>
  );
}
