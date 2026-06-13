"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname, notFound } from "next/navigation";
import { docContent } from "@/docs/lib/docs-content";
import { findDoc, getAdjacent, docsNav } from "@/docs/lib/docs-data";
import { TableOfContents } from "@/docs/_components/table-of-contents";
import { PageNav } from "@/docs/_components/page-nav";
import { ChevronRight } from "lucide-react";

export default function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const doc = findDoc(slug);
  if (!doc) return notFound();
  
  const content = docContent[slug];
  const { prev, next } = getAdjacent(slug);
  
  // Find the section/group for this doc
  let sectionTitle = "";
  for (const group of docsNav) {
    if (group.items.some(item => item.slug === slug)) {
      sectionTitle = group.label;
      break;
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex justify-start">
        <article className="max-w-xl w-full px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb - right-aligned */}
          <nav className="flex items-center justify-end mb-4 text-sm text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground transition">Docs</Link>
            {sectionTitle && (
              <>
                <ChevronRight className="size-3 mx-1" />
                <span className="text-foreground">{sectionTitle}</span>
              </>
            )}
            <ChevronRight className="size-3 mx-1" />
            <span className="text-foreground">{content.title}</span>
          </nav>
          
          <header className="mb-6">
            <h1 className="text-xl font-bold tracking-tight mb-1">{content.title}</h1>
            <p className="text-muted-foreground text-sm">{content.description}</p>
          </header>
          <div className="prose prose-xs max-w-none dark:prose-invert">
            {content.body}
          </div>
          <PageNav prev={prev} next={next} />
        </article>
      </div>
      <TableOfContents items={content.toc} />
    </div>
  );
}
