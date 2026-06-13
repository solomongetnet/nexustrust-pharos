import { useState } from "react";
import { Check, Copy, FileCode2, Terminal, FileJson, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Lang = "tsx" | "ts" | "js" | "jsx" | "bash" | "sh" | "json" | "env" | "text";

const langMeta: Record<Lang, { label: string; Icon: React.ComponentType<{ className?: string }>; color: string }> = {
  tsx:  { label: "tsx",  Icon: FileCode2, color: "text-[#61afef]" },
  ts:   { label: "ts",   Icon: FileCode2, color: "text-[#61afef]" },
  jsx:  { label: "jsx",  Icon: FileCode2, color: "text-[#d19a66]" },
  js:   { label: "js",   Icon: FileCode2, color: "text-[#d19a66]" },
  bash: { label: "bash", Icon: Terminal,  color: "text-emerald-400" },
  sh:   { label: "sh",   Icon: Terminal,  color: "text-emerald-400" },
  json: { label: "json", Icon: FileJson,  color: "text-amber-300" },
  env:  { label: "env",  Icon: FileText,  color: "text-zinc-300" },
  text: { label: "text", Icon: FileText,  color: "text-zinc-300" },
};

export function CodeBlock({
  children,
  className,
  language = "tsx",
  filename,
}: {
  children: React.ReactNode;
  className?: string;
  language?: Lang;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);
  const meta = langMeta[language] ?? langMeta.tsx;
  const Icon = meta.Icon;

  const handleCopy = () => {
    const text = typeof children === "string" ? children : extractText(children);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-4 rounded-lg border border-border bg-[var(--color-code-bg)] overflow-hidden">
      <div className="flex items-center justify-between h-7 px-2 border-b border-border bg-background/40">
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon className={cn("size-3 shrink-0", meta.color)} />
          <span className="text-[10px] font-mono text-muted-foreground truncate">
            {filename ?? meta.label}
          </span>
        </div>
        <button
          onClick={handleCopy}
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
      <pre className={cn("code-block !border-0 !rounded-none !bg-transparent !m-0 text-[11px]", className)}>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}
