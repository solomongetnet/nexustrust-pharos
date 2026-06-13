// Types from AgentRegistry.sol and ReputationLedger.sol
export type JobStatus = "None" | "Created" | "Completed" | "Reviewed";

// Backward compatibility types (temporary)
export type Tier = "trusted" | "probationary" | "flagged";
export type Domain = "Coding" | "DeFi" | "Payments" | "Social" | "Governance";

export const TIER_COPY: Record<Tier, { label: string; color: string; threshold: number }> = {
  trusted: { label: "Trusted", color: "pharos-green", threshold: 400 },
  probationary: { label: "Probationary", color: "pharos-amber", threshold: 300 },
  flagged: { label: "Flagged", color: "pharos-red", threshold: 0 },
};

export function tierColor(tier: Tier): string {
  if (tier === "trusted") return "var(--pharos-green)";
  if (tier === "probationary") return "var(--pharos-amber)";
  return "var(--pharos-red)";
}

export interface Agent {
  agentAddress: string;
  metadataURI: string;
  tokenId: number;
  registeredAt: number; // Unix timestamp
  active: boolean;
}

export interface Job {
  client: string;
  worker: string;
  status: JobStatus;
  createdAt: number;
  completedAt: number;
}

export interface Review {
  reviewer: string;
  agent: string;
  score: number; // 1-5
  tag: string;
  jobId: string; // bytes32 as string
  timestamp: number;
}

export interface Reputation {
  avgScoreX100: number; // e.g., 450 = 4.50
  reviewCount: number;
  recent: Review[];
}

// Example data
export const AGENTS: Agent[] = [
  {
    agentAddress: "0x821fa7b2c4e9d3a1f08b6c5e2d9a4f7b1c3e8d92",
    metadataURI: "ipfs://QmSentinelX",
    tokenId: 1,
    registeredAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    active: true,
  },
  {
    agentAddress: "0x9f32e98c1a7b4c2d8e3f5a6b9c1d2e4f5a6b7c88",
    metadataURI: "ipfs://QmLuminaV4",
    tokenId: 2,
    registeredAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    active: true,
  },
  {
    agentAddress: "0x4f22c6a8b9d1e3f5c7a2b4d6e8f1a3c5b7d9e2f1",
    metadataURI: "ipfs://QmNexusAlpha",
    tokenId: 3,
    registeredAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    active: true,
  },
  {
    agentAddress: "0xab120091c5e3f7a2d4b6c8e1f3a5b7d9c2e4f6a8",
    metadataURI: "ipfs://QmBetaNode",
    tokenId: 4,
    registeredAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    active: true,
  },
  {
    agentAddress: "0xde311b8c2a4f6e9d1c3b5a7f9e2d4c6b8a1f3e5d",
    metadataURI: "ipfs://QmNovaProtocol",
    tokenId: 5,
    registeredAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    active: true,
  },
];

export const REPUTATIONS: Record<string, Reputation> = {
  "0x821fa7b2c4e9d3a1f08b6c5e2d9a4f7b1c3e8d92": {
    avgScoreX100: 485, // 4.85
    reviewCount: 24,
    recent: [
      {
        reviewer: "0x12ab...88f1",
        agent: "0x821fa7b2c4e9d3a1f08b6c5e2d9a4f7b1c3e8d92",
        score: 5,
        tag: "fast",
        jobId: "0x1234...",
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
      },
      {
        reviewer: "0xde91...02bc",
        agent: "0x821fa7b2c4e9d3a1f08b6c5e2d9a4f7b1c3e8d92",
        score: 4,
        tag: "reliable",
        jobId: "0x5678...",
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
      },
    ],
  },
  "0x9f32e98c1a7b4c2d8e3f5a6b9c1d2e4f5a6b7c88": {
    avgScoreX100: 492, // 4.92
    reviewCount: 31,
    recent: [],
  },
};

export function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function avgScore(avgScoreX100: number) {
  return (avgScoreX100 / 100).toFixed(2);
}

export function scoreColor(score: number) {
  if (score >= 4) return "var(--pharos-green)";
  if (score >= 3) return "var(--pharos-amber)";
  return "var(--pharos-red)";
}

// Mock activity data for ticker
export const ACTIVITY = AGENTS.flatMap((agent) => {
  const reputation = REPUTATIONS[agent.agentAddress];
  if (!reputation) return [];
  
  return reputation.recent.map((review) => ({
    id: `${agent.agentAddress}-${review.timestamp}`,
    agentId: agent.agentAddress,
    timestamp: review.timestamp,
    type: "Review Submitted",
    delta: review.score - 3,
    tx: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`,
    severity: review.score >= 4 ? "positive" : review.score >= 3 ? "warning" : "severe",
    jobId: review.jobId,
  }));
}).slice(-20).reverse();
