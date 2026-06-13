import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

export type TocItem = { id: string; label: string; level: number };

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const computeActive = () => {
      // Bottom of page → force last item active
      const scrollBottom = window.innerHeight + window.scrollY;
      if (scrollBottom >= document.documentElement.scrollHeight - 4) {
        setActive(items[items.length - 1].id);
        return;
      }
      const offset = 120; // header + breathing room
      let current = items[0]?.id ?? "";
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) {
          current = i.id;
        } else {
          break;
        }
      }
      setActive(current);
    };
    computeActive();
    window.addEventListener("scroll", computeActive, { passive: true });
    window.addEventListener("resize", computeActive);
    return () => {
      window.removeEventListener("scroll", computeActive);
      window.removeEventListener("resize", computeActive);
    };
  }, [items]);

  useEffect(() => {
    const node = itemRefs.current[active];
    if (node && listRef.current) {
      const listRect = listRef.current.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      setIndicatorStyle({
        top: nodeRect.top - listRect.top,
        height: nodeRect.height,
      });
    }
  }, [active]);

  if (!items.length) return null;

  return (
    <aside className="hidden xl:block w-48 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pr-4">
      <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-foreground">
        <List className="size-3 text-muted-foreground" />
        On this page
      </div>
      <ul ref={listRef} className="relative space-y-0.5 border-l border-border">
        <span
          className="absolute left-0 w-px bg-primary transition-all duration-300 ease-out"
          style={{
            top: indicatorStyle.top,
            height: indicatorStyle.height,
          }}
        />
        {items.map((i) => (
          <li key={i.id} style={{ paddingLeft: (i.level - 2) * 10 }}>
            <a
              ref={(el) => { itemRefs.current[i.id] = el; }}
              href={`#${i.id}`}
              className={cn(
                "block -ml-px pl-2.5 py-0.5 text-xs border-l border-transparent transition-colors duration-200",
                active === i.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
