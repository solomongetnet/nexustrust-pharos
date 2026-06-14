import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface AgentDetailErrorProps {
  error: Error | unknown;
}

export function AgentDetailError({ error }: AgentDetailErrorProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-12 text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="text-lg font-medium text-foreground">Failed to load agent</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Link href="/agents" className="mt-4">
            <Button variant="secondary" className="mono text-xs">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
