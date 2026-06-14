import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, Cpu, Check, Copy, Star, UserPlus, Eye, } from 'lucide-react';
import { type AgentWithMetadata } from '@/hooks/api/use-agents';
import { pharosTestnet } from '@/lib/wagmi';

interface AgentCardProps {
  agent: AgentWithMetadata;
}

export function AgentCard({ agent }: AgentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const explorerUrl = `${pharosTestnet.blockExplorers.default.url}/address/${agent.agentAddress}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(agent.agentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <Card className="group overflow-hidden transition-all hover:border-emerald-500/30">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-500/10">
              {agent.metadata?.image ? (
                <img
                  src={
                    agent.metadata.image.startsWith('ipfs://')
                      ? `https://gateway.pinata.cloud/ipfs/${agent.metadata.image.replace('ipfs://', '')}`
                      : agent.metadata.image
                  }
                  alt={agent.metadata.name}
                  className="h-10 w-10 rounded-md object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <Cpu className="h-6 w-6 text-emerald-500" />
            </div>

            <div className="min-w-0 flex-1">
              <CardTitle className="truncate text-base font-medium">
                {agent.metadata?.name || 'Unknown Agent'}
              </CardTitle>
              <CardDescription className="mono text-[10px] mt-1">
                {shortAddr(agent.agentAddress)}
              </CardDescription>
            </div>
          </div>

          <Badge
            variant="secondary"
            className={`shrink-0 ${
              agent.active
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            }`}
          >
            {agent.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        {agent.metadata?.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.metadata.description}
          </p>
        )}

        {agent.metadata?.skills && agent.metadata.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agent.metadata.skills.slice(0, 4).map((skill, i) => (
              <Badge
                key={i}
                variant="outline"
                className="text-xs border-border/50 bg-background/50"
              >
                {skill}
              </Badge>
            ))}
            {agent.metadata.skills.length > 4 && (
              <Badge variant="outline" className="text-xs border-border/30 bg-background/30">
                +{agent.metadata.skills.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 bg-card/30 p-4">
        <div className="flex items-center gap-1.5">
          {agent.metadata?.socials?.github && (
            <Link href={agent.metadata.socials.github} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          )}
          {agent.metadata?.socials?.website && (
            <Link href={agent.metadata.socials.website} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Globe className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1.5"
            onClick={handleCopyAddress}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Address'}
          </Button>
          <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Explorer
            </Button>
          </Link>
          <Link href={`/agents/${agent.agentAddress}`}>
            <Button variant="secondary" size="sm" className="text-xs flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" />
              View Profile
            </Button>
          </Link>
        </div>
      </CardFooter>

      {isExpanded && (
        <div className="border-t border-border/40 bg-card/50 p-4">
          <div className="space-y-3">
            {agent.metadata?.tags && agent.metadata.tags.length > 0 && (
              <div>
                <h4 className="mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {agent.metadata.tags.map((tag, i) => (
                    <Badge key={i} className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <h4 className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                On-chain Details
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Token ID:</span>
                  <span className="ml-2 font-mono">{agent.tokenId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <span className="ml-2 font-mono">{agent.metadata?.version || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Metadata URI:</span>
                  <div className="mt-1 rounded-md border border-border/50 bg-background/50 p-2">
                    <code className="mono text-[10px] break-all text-emerald-400">
                      {agent.metadataURI}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
