import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, PanelLeftClose, PanelLeft, BookOpen, Compass, Library, Box, Users, Repeat, Clock, Shield, Webhook, Database, CreditCard, Puzzle, Code2, Terminal } from "lucide-react";
import { docsNav } from "../lib/docs-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  introduction: BookOpen,
  installation: Box,
  "quick-start": Compass,
  "plans-features": Library,
  customers: Users,
  subscriptions: Repeat,
  scheduling: Clock,
  entitlements: Shield,
  webhooks: Webhook,
  database: Database,
  "payment-providers": CreditCard,
  plugins: Puzzle,
  "client-sdk": Code2,
  cli: Terminal,
};

const groupIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Get started": Compass,
  "Concepts": Library,
  "Reference": Box,
};

export function Sidebar({ open, onToggle, onOpenSearch }: { open: boolean; onToggle: () => void; onOpenSearch?: () => void }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(docsNav.map((g) => [g.label, true]))
  );

  if (!open) {
    return (
      <aside className="hidden lg:flex w-10 shrink-0 border-r border-border flex-col items-center py-3">
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition"
          aria-label="Open sidebar"
        >
          <PanelLeft className="size-3.5" />
        </button>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onToggle}
      />

      <aside className="fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 lg:z-auto w-56 shrink-0 border-r border-border bg-sidebar flex flex-col h-screen">
        {/* Logo */}
        <div className="h-12 px-3 flex items-center justify-between border-b border-border">
          <Link href="/" className="flex items-center gap-1.5 font-semibold tracking-tight text-sm">
            <div className="size-5 rounded-md bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center">
              <span className="text-[9px] font-bold text-primary-foreground">B</span>
            </div>
            <span>BirrJS</span>
          </Link>
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition lg:hidden"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="size-3.5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-border">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-1.5 px-2.5 h-7 rounded-md bg-background/50 border border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition"
          >
            <Search className="size-3" />
            <span className="flex-1 text-left">Search</span>
            <kbd className="text-[9px] font-mono px-1 py-0.5 rounded bg-muted border border-border">Ctrl K</kbd>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
          {docsNav.map((group) => {
            const GIcon = groupIcons[group.label] ?? BookOpen;
            const isOpen = openGroups[group.label] ?? true;
            return (
              <div key={group.label}>
                <button
                  onClick={() =>
                    setOpenGroups((g) => ({ ...g, [group.label]: !isOpen }))
                  }
                  className="w-full flex items-center gap-1.5 px-1.5 h-7 rounded-md text-xs font-medium text-foreground/90 hover:bg-accent/50 transition"
                >
                  <GIcon className="size-3 text-muted-foreground" />
                  <span className="flex-1 text-left">{group.label}</span>
                  {group.collapsible && (
                    <ChevronDown
                      className={cn("size-3 text-muted-foreground transition-transform", !isOpen && "-rotate-90")}
                    />
                  )}
                </button>
                {isOpen && (
                  <ul className="mt-0.5 space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = iconMap[item.slug] ?? BookOpen;
                      const href = `/docs/${item.slug}`;
                      const active = pathname === href;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={href}
                            onClick={() => {
                              // Close sidebar on mobile when clicking a link
                              if (window.innerWidth < 1024) {
                                onToggle();
                              }
                            }}
                            className={cn(
                              "flex items-center gap-2 pl-2.5 pr-1.5 h-6.5 rounded-md text-xs transition",
                              active
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            )}
                          >
                            <Icon className="size-3 opacity-80" />
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-2.5 py-2 flex items-center justify-end">
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <div className="size-1.5 rounded-full bg-emerald-400" />
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
