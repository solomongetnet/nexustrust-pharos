import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AgentDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6">
          <div className="mono mb-2 h-3 w-32 animate-pulse rounded bg-border" />
        </div>

        {/* Identity header skeleton */}
        <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="row-span-2 h-14 w-14 rounded-lg border border-border bg-background lg:h-16 lg:w-16 animate-pulse" />
          <div className="min-w-0 col-span-1 lg:col-span-1 space-y-2">
            <div className="h-6 w-48 animate-pulse rounded bg-border" />
            <div className="h-3 w-64 animate-pulse rounded bg-border" />
          </div>
          <div className="col-span-2 h-9 w-32 animate-pulse rounded bg-border lg:col-auto" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-border bg-surface p-4">
              <div className="h-3 w-24 animate-pulse rounded bg-border" />
              <div className="mt-2 h-6 w-12 animate-pulse rounded bg-border" />
              <div className="mt-1 h-2 w-32 animate-pulse rounded bg-border" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
