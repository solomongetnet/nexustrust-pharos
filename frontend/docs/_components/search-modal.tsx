import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, ArrowRight, CornerDownLeft } from "lucide-react";
import { allDocs, docsNav } from "../lib/docs-data";
import { cn } from "@/lib/utils";

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return allDocs;
    return allDocs.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        d.section.toLowerCase().includes(term) ||
        d.slug.toLowerCase().includes(term)
    );
  }, [q]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[active];
        if (item) {
          router.push(`/docs/${item.slug}`);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, router, onClose]);

  if (!open) return null;

  const grouped = docsNav
    .map((g) => ({
      label: g.label,
      items: g.items.filter((it) => results.some((r) => r.slug === it.slug)),
    }))
    .filter((g) => g.items.length > 0);

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-background/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
          <Search className="size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documentation…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
            Esc
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {grouped.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No results for <span className="text-foreground">"{q}"</span>
            </div>
          ) : (
            grouped.map((g) => (
              <div key={g.label} className="px-2 pb-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {g.label}
                </div>
                <ul>
                  {g.items.map((item) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const isActive = idx === active;
                    return (
                      <li key={item.slug}>
                        <button
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => {
                            router.push(`/docs/${item.slug}`);
                            onClose();
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-2.5 h-9 rounded-md text-sm transition text-left",
                            isActive
                              ? "bg-accent text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <FileText className="size-3.5 opacity-70 shrink-0" />
                          <span className="flex-1 truncate">{item.title}</span>
                          {isActive && <CornerDownLeft className="size-3.5 opacity-70" />}
                          {!isActive && <ArrowRight className="size-3.5 opacity-0" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 h-9 border-t border-border bg-background/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono px-1 py-0.5 rounded bg-muted border border-border">↑</kbd>
              <kbd className="font-mono px-1 py-0.5 rounded bg-muted border border-border">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono px-1 py-0.5 rounded bg-muted border border-border">↵</kbd>
              Open
            </span>
          </div>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
