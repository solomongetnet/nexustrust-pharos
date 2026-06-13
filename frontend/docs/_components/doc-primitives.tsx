import { useState } from "react";
import { Check, Copy, Info, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export function Callout({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warn" }) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border p-4 text-sm",
        type === "info"
          ? "border-primary/30 bg-primary/5 text-foreground/90"
          : "border-amber-500/30 bg-amber-500/5 text-foreground/90"
      )}
    >
      <Info className="size-4 mt-0.5 shrink-0 text-primary" />
      <div className="leading-relaxed [&_p]:m-0">{children}</div>
    </div>
  );
}

export function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-8 rounded-full border border-border bg-card flex items-center justify-center text-sm font-medium text-muted-foreground">
          {n}
        </div>
        <h2 id={slug(title)} className="!m-0 !p-0 !border-0 text-xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      <div className="pl-11">{children}</div>
    </section>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CodeTabs({
  tabs,
}: {
  tabs: { label: string; code: React.ReactNode; copy: string }[];
}) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  return (
    <div className="my-4 rounded-lg border border-border bg-[var(--color-code-bg)] overflow-hidden">
      <div className="flex items-center justify-between border-b border-border pl-1.5 pr-1.5 h-7 bg-background/40">
        <div className="flex items-center gap-1">
          <Terminal className="size-3 text-emerald-400 ml-1 mr-0.5" />
          {tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActive(i)}
              className={cn(
                "relative px-2 h-6 rounded-md text-[10px] font-mono transition",
                i === active
                  ? "text-foreground bg-accent/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(tabs[active].copy);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1 h-5 px-1.5 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent transition"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-2.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-2.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-block !border-0 !rounded-none !bg-transparent !m-0 text-[11px]">
        <code>{tabs[active].code}</code>
      </pre>
    </div>
  );
}
