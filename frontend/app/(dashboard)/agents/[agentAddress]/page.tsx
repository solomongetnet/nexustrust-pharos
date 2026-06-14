'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  Check,
  Copy,
  Cpu,
  ExternalLink,
  Eye,
  Globe,
  ShieldCheck,
  Star,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CONTRACT_ADDRESSES } from '@/contracts';
import { pharosTestnet } from '@/lib/wagmi';
import { cn } from '@/lib/utils';
import { useAgentDetail } from '@/hooks/api/use-agent-detail';
import { AgentDetailLoading } from '../agent-detail-loading';
import { AgentDetailError } from '../agent-detail-error';

interface Review {
  reviewer: `0x${string}`;
  agent: `0x${string}`;
  score: number;
  tag: string;
  jobId: `0x${string}`;
  timestamp: bigint;
}

const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function PublicAgentDetailPage() {
  const params = useParams();
  const agentAddress = params.agentAddress as `0x${string}`;

  const { agentData, reputationData, metadata, isLoading, error } = useAgentDetail(agentAddress);

  if (isLoading) {
    return <AgentDetailLoading />;
  }

  if (error) {
    return <AgentDetailError error={error} />;
  }

  const active = agentData?.active;
  const tokenId = agentData?.tokenId;
  const registeredAt = agentData?.registeredAt;
  const avgScoreX100 = reputationData?.[0] ?? BigInt(0);
  const reviewCount = reputationData?.[1] ?? BigInt(0);
  const recentReviews = (reputationData?.[2] as Review[]) ?? [];
  const avgScore = Number(avgScoreX100) / 100;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 6) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    return 'text-red-500 bg-red-500/10 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumb */}
        <div className="mono mb-6 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
          <Link href="/agents" className="inline-flex items-center gap-2 hover:text-foreground">
            <ArrowLeft className="size-3" />
            Agents
          </Link>
          <span>/</span>
          <span className="text-foreground">{metadata?.name || shortAddr(agentAddress)}</span>
        </div>

        {/* Identity Header */}
        <IdentityHeader
          agentAddress={agentAddress}
          active={active}
          metadata={metadata}
          tokenId={tokenId}
        />

        {/* KPI Strip */}
        <KpiStrip
          avgScore={avgScore}
          reviewCount={reviewCount}
          tokenId={tokenId}
          registeredAt={registeredAt}
        />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full mt-6">
          <TabsList className="mb-5 flex h-auto w-full flex-wrap justify-start gap-1 border border-border bg-background p-1.5">
            <TabTrigger value="overview" icon={<Activity className="size-4" />}>
              Overview
            </TabTrigger>
            <TabTrigger value="reputation" icon={<ShieldCheck className="size-4" />}>
              Reputation
            </TabTrigger>
            <TabTrigger value="reviews" icon={<Star className="size-4" />}>
              Reviews
            </TabTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0 space-y-4">
            <OverviewTab
              metadata={metadata}
              tokenId={tokenId}
              registeredAt={registeredAt}
              agentAddress={agentAddress}
            />
          </TabsContent>

          <TabsContent value="reputation" className="mt-0">
            <ReputationTab
              avgScore={avgScore}
              reviewCount={reviewCount}
              agentAddress={agentAddress}
            />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <ReviewsTab
              recentReviews={recentReviews}
              avgScore={avgScore}
              getScoreColor={getScoreColor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function IdentityHeader({
  agentAddress,
  active,
  metadata,
  tokenId,
}: {
  agentAddress: `0x${string}`;
  active?: boolean;
  metadata?: any;
  tokenId?: bigint;
}) {
  const [copied, setCopied] = useState(false);
  const explorerUrl = `${pharosTestnet.blockExplorers.default.url}/address/${agentAddress}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(agentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 rounded-xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
      <div className="row-span-2 grid h-14 w-14 shrink-0 place-items-center rounded-lg border border-border bg-background lg:h-16 lg:w-16">
        {metadata?.image ? (
          <img
            src={
              metadata.image.startsWith('ipfs://')
                ? `https://gateway.pinata.cloud/ipfs/${metadata.image.replace('ipfs://', '')}`
                : metadata.image
            }
            alt={metadata.name}
            className="h-10 w-10 rounded-md object-cover lg:h-12 lg:w-12"
          />
        ) : (
          <Cpu className="text-emerald-500 size-6 lg:size-7" />
        )}
      </div>

      <div className="min-w-0 col-span-1 lg:col-span-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
            {metadata?.name || 'Agent'}
          </h1>
          <Badge
            className={cn(
              'mono text-[9px]',
              active
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            )}
          >
            {active ? 'Active' : 'Inactive'}
          </Badge>
          {metadata?.version && (
            <Badge variant="outline" className="mono text-[9px]">
              {metadata.version}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            onClick={handleCopyAddress}
            className="mono inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            {agentAddress}
            {copied ? (
              <Check className="size-3 text-emerald-500" />
            ) : (
              <Copy className="size-3" />
            )}
          </button>
        </div>
        {metadata?.description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-3xl">
            {metadata.description}
          </p>
        )}
      </div>

      <div className="col-span-2 flex flex-wrap gap-2 lg:col-auto">
        <Link href={explorerUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="mono h-9 gap-1.5 rounded text-[11px] uppercase tracking-widest">
            <ExternalLink className="size-3.5" />
            Explorer
          </Button>
        </Link>
      </div>
    </div>
  );
}

function KpiStrip({
  avgScore,
  reviewCount,
  tokenId,
  registeredAt,
}: {
  avgScore: number;
  reviewCount: bigint;
  tokenId?: bigint;
  registeredAt?: bigint;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Kpi
        icon={<ShieldCheck className="size-3.5" />}
        label="Reputation Score"
        value={avgScore.toFixed(1)}
        sub="average rating"
        accent={avgScore >= 8 ? 'text-emerald-500' : avgScore >= 6 ? 'text-amber-500' : 'text-red-500'}
      />
      <Kpi
        icon={<Star className="size-3.5" />}
        label="Reviews"
        value={reviewCount.toString()}
        sub="total reviews"
      />
      <Kpi
        icon={<TrendingUp className="size-3.5" />}
        label="Token ID"
        value={tokenId?.toString() || '-'}
        sub="ERC-721 token"
      />
      <Kpi
        icon={<Calendar className="size-3.5" />}
        label="Registered"
        value={
          registeredAt
            ? new Date(Number(registeredAt) * 1000).toLocaleDateString()
            : '-'
        }
        sub="on Pharos Testnet"
      />
    </div>
  );
}

function OverviewTab({
  metadata,
  tokenId,
  registeredAt,
  agentAddress,
}: {
  metadata?: any;
  tokenId?: bigint;
  registeredAt?: bigint;
  agentAddress: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel title="About" className="lg:col-span-8">
        {metadata?.description ? (
          <p className="text-sm text-muted-foreground">{metadata.description}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No description available
          </p>
        )}
        {metadata?.skills && metadata.skills.length > 0 && (
          <div className="mt-4">
            <h4 className="mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {metadata.skills.map((skill: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {metadata?.tags && metadata.tags.length > 0 && (
          <div className="mt-4">
            <h4 className="mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {metadata.tags.map((tag: string, i: number) => (
                <Badge key={i} className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Links" className="lg:col-span-4">
        <div className="space-y-3">
          {metadata?.socials?.github && (
            <a
              href={metadata.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md border border-border bg-background p-3 text-sm hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="truncate">GitHub</span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
          )}
          {metadata?.socials?.website && (
            <a
              href={metadata.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md border border-border bg-background p-3 text-sm hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="truncate">Website</span>
              <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
            </a>
          )}
        </div>
      </Panel>

      <Panel title="Registration Details" className="lg:col-span-12">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-md border border-border bg-background p-3">
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Token ID
            </span>
            <p className="mono text-sm">{tokenId?.toString() || '-'}</p>
          </div>
          <div className="rounded-md border border-border bg-background p-3">
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Agent Address
            </span>
            <p className="mono text-sm">{agentAddress}</p>
          </div>
          <div className="rounded-md border border-border bg-background p-3">
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Registered At
            </span>
            <p className="mono text-sm">
              {registeredAt
                ? new Date(Number(registeredAt) * 1000).toLocaleDateString()
                : '-'}
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ReputationTab({
  avgScore,
  reviewCount,
  agentAddress,
}: {
  avgScore: number;
  reviewCount: bigint;
  agentAddress: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel title="Reputation Overview" className="lg:col-span-12">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex flex-col items-center justify-center rounded-full border border-border bg-background p-6">
            <div className="text-4xl font-bold tabular-nums" style={{ color: avgScore >= 8 ? '#10b981' : avgScore >= 6 ? '#f59e0b' : '#ef4444' }}>
              {avgScore.toFixed(1)}
            </div>
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              Average Score
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Reviews</span>
              <span className="mono tabular-nums">{reviewCount.toString()}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/50">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(avgScore / 10) * 100}%`,
                  backgroundColor: avgScore >= 8 ? '#10b981' : avgScore >= 6 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function ReviewsTab({
  recentReviews,
  avgScore,
  getScoreColor,
}: {
  recentReviews: Review[];
  avgScore: number;
  getScoreColor: (score: number) => string;
}) {
  return (
    <Panel title={`${recentReviews.length} Recent Review${recentReviews.length !== 1 ? 's' : ''}`}>
      {recentReviews.length > 0 ? (
        <div className="space-y-3">
          {recentReviews.map((review, i) => (
            <div
              key={i}
              className="rounded-md border border-border bg-background p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="mono text-xs text-foreground">
                      {shortAddr(review.reviewer)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(Number(review.timestamp) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`mono text-[10px] ${getScoreColor(review.score)}`}>
                      {review.score}/10
                    </Badge>
                    <Badge variant="outline" className="mono text-[10px]">
                      {review.tag}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="mono text-xs text-muted-foreground">
            No reviews yet for this agent
          </p>
        </div>
      )}
    </Panel>
  );
}

function Panel({
  title,
  hint,
  className = '',
  children,
}: {
  title: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-lg border border-border bg-surface p-4 sm:p-5', className)}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="mono text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h3>
          {hint && (
            <span className="mono text-[10px] text-muted-foreground/70">{hint}</span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="mono text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <div className={cn('mono mt-2 text-2xl font-semibold tabular-nums', accent)}>
        {value}
      </div>
      <div className="mono mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        {sub}
      </div>
    </div>
  );
}

function TabTrigger({
  value,
  icon,
  children,
}: {
  value: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className="mono inline-flex items-center gap-1.5 whitespace-nowrap rounded px-3.5 py-2 text-[11px] uppercase tracking-wider data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 data-[state=active]:shadow-none"
    >
      {icon}
      <span>{children}</span>
    </TabsTrigger>
  );
}
