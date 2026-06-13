"use client";

import { useState } from "react";
import { Sidebar } from "@/docs/_components/sidebar";
import { SearchModal } from "@/docs/_components/search-modal";
import { Menu, Search, Code2 } from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b border-border bg-background lg:hidden">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-accent">
          <Menu className="size-5" />
        </button>
        <span className="font-semibold">BirrJS Docs</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setSearchOpen(true)} className="p-2 rounded-md hover:bg-accent">
            <Search className="size-5" />
          </button>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-md hover:bg-accent">
            <Code2 className="size-5" />
          </a>
        </div>
      </header>

      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} onOpenSearch={() => setSearchOpen(true)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <main className={`flex-1 pt-14 lg:pt-0 ${sidebarOpen ? "lg:pl-0" : ""}`}>
        {children}
      </main>
    </div>
  );
}
