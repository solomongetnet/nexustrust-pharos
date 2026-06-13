import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DocPage } from "../lib/docs-data";

export function PageNav({ prev, next }: { prev: DocPage | null; next: DocPage | null }) {
  return (
    <div className="mt-10 pt-6 border-t border-border grid grid-cols-2 gap-3">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-col gap-0.5 p-3 rounded-md border border-border hover:border-primary/40 hover:bg-accent/30 transition"
        >
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <ArrowLeft className="size-2.5" /> Previous
          </span>
          <span className="font-medium text-foreground group-hover:text-primary transition text-xs">{prev.title}</span>
        </Link>
      ) : <div />}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-col gap-0.5 p-3 rounded-md border border-border hover:border-primary/40 hover:bg-accent/30 transition text-right"
        >
          <span className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
            Next <ArrowRight className="size-2.5" />
          </span>
          <span className="font-medium text-foreground group-hover:text-primary transition text-xs">{next.title}</span>
        </Link>
      ) : <div />}
    </div>
  );
}
