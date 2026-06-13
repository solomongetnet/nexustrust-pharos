export type Tier = "trusted" | "probationary" | "flagged";
export type Domain = "Coding" | "DeFi" | "Payments" | "Social" | "Governance";

export interface Agent {
  id: string;
  name: string;
  address: string;
  tier: Tier;
  globalScore: number;
  staked: number;
  settledVolume: number; // PROS
  tierMaxVolume: number;
  scores: Record<Domain, { value: number; confidence: number }>;
  lastActive: string;
  version: string;
}

export interface ActivityEvent {
  id: string;
  agentId: string;
  timestamp: string;
  type: string;
  domain?: Domain;
  delta: number;
  tx: string;
  contract?: string;
  severity: "info" | "positive" | "warning" | "severe";
  jobId?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: Domain;
  minScore: number;
  bounty: number;
  posted: string;
  requester: string;
}

export const DOMAINS: Domain[] = ["Coding", "DeFi", "Payments", "Social", "Governance"];

export const TIER_COPY: Record<Tier, { label: string; color: string; threshold: number }> = {
  trusted: { label: "Trusted", color: "pharos-green", threshold: 85 },
  probationary: { label: "Probationary", color: "pharos-amber", threshold: 50 },
  flagged: { label: "Flagged", color: "pharos-red", threshold: 0 },
};

export const AGENTS: Agent[] = [
  {
    id: "sentinel-x",
    name: "Sentinel_X",
    address: "0x821fa7b2c4e9d3a1f08b6c5e2d9a4f7b1c3e8d92",
    tier: "trusted",
    globalScore: 98.8,
    staked: 45000,
    settledVolume: 4_220_000,
    tierMaxVolume: 6_000_000,
    scores: {
      Coding: { value: 91, confidence: 0.94 },
      DeFi: { value: 98, confidence: 0.97 },
      Payments: { value: 95, confidence: 0.99 },
      Social: { value: 71, confidence: 0.82 },
      Governance: { value: 92, confidence: 0.88 },
    },
    lastActive: "2.4s ago",
    version: "v4.0.2",
  },
  {
    id: "lumina-v4",
    name: "Lumina_v4",
    address: "0x9f32e98c1a7b4c2d8e3f5a6b9c1d2e4f5a6b7c88",
    tier: "trusted",
    globalScore: 99.2,
    staked: 62000,
    settledVolume: 5_810_000,
    tierMaxVolume: 6_000_000,
    scores: {
      Coding: { value: 99, confidence: 0.99 },
      DeFi: { value: 88, confidence: 0.91 },
      Payments: { value: 97, confidence: 0.98 },
      Social: { value: 84, confidence: 0.86 },
      Governance: { value: 90, confidence: 0.92 },
    },
    lastActive: "11s ago",
    version: "v4.1.0",
  },
  {
    id: "nexus-alpha",
    name: "Nexus_Alpha_09",
    address: "0x4f22c6a8b9d1e3f5c7a2b4d6e8f1a3c5b7d9e2f1",
    tier: "trusted",
    globalScore: 94.1,
    staked: 38500,
    settledVolume: 2_140_000,
    tierMaxVolume: 6_000_000,
    scores: {
      Coding: { value: 86, confidence: 0.9 },
      DeFi: { value: 94, confidence: 0.93 },
      Payments: { value: 88, confidence: 0.95 },
      Social: { value: 78, confidence: 0.8 },
      Governance: { value: 82, confidence: 0.84 },
    },
    lastActive: "1m ago",
    version: "v3.9.4",
  },
  {
    id: "beta-node-7",
    name: "Beta_Node_7",
    address: "0xab120091c5e3f7a2d4b6c8e1f3a5b7d9c2e4f6a8",
    tier: "probationary",
    globalScore: 74.1,
    staked: 12200,
    settledVolume: 320_000,
    tierMaxVolume: 1_500_000,
    scores: {
      Coding: { value: 72, confidence: 0.68 },
      DeFi: { value: 64, confidence: 0.61 },
      Payments: { value: 81, confidence: 0.74 },
      Social: { value: 58, confidence: 0.55 },
      Governance: { value: 70, confidence: 0.66 },
    },
    lastActive: "14m ago",
    version: "v2.1.3",
  },
  {
    id: "nova-protocol-x",
    name: "Nova_Protocol_X",
    address: "0xde311b8c2a4f6e9d1c3b5a7f9e2d4c6b8a1f3e5d",
    tier: "probationary",
    globalScore: 62.8,
    staked: 8400,
    settledVolume: 180_000,
    tierMaxVolume: 1_500_000,
    scores: {
      Coding: { value: 58, confidence: 0.62 },
      DeFi: { value: 71, confidence: 0.7 },
      Payments: { value: 60, confidence: 0.65 },
      Social: { value: 55, confidence: 0.52 },
      Governance: { value: 64, confidence: 0.58 },
    },
    lastActive: "42m ago",
    version: "v1.8.0",
  },
  {
    id: "voidwalker",
    name: "C_VOIDWALKER_889",
    address: "0xc4889aef21b3c5d7e9f1a3b5c7d9e1f3a5b7c9d2",
    tier: "flagged",
    globalScore: 22.4,
    staked: 2400,
    settledVolume: 14_500,
    tierMaxVolume: 500_000,
    scores: {
      Coding: { value: 31, confidence: 0.42 },
      DeFi: { value: 18, confidence: 0.38 },
      Payments: { value: 22, confidence: 0.44 },
      Social: { value: 14, confidence: 0.3 },
      Governance: { value: 28, confidence: 0.36 },
    },
    lastActive: "3h ago",
    version: "v1.2.7",
  },
];

export const ACTIVITY: ActivityEvent[] = [
  { id: "a1", agentId: "sentinel-x", timestamp: "2025.06.11 14:02:11", type: "DeFi Task Completed", domain: "DeFi", delta: 4.2, tx: "0x3f1a449d12c5", contract: "TaskRegistry", severity: "positive", jobId: "JOB-1188" },
  { id: "a2", agentId: "sentinel-x", timestamp: "2025.06.11 13:58:04", type: "Attestation Received", domain: "Payments", delta: 1.15, tx: "0x91e2a1102def", contract: "AttestationHub", severity: "positive" },
  { id: "a3", agentId: "sentinel-x", timestamp: "2025.06.11 12:30:11", type: "Governance Vote Cast", domain: "Governance", delta: 0, tx: "0x55bc77123abc", contract: "DAOVoter", severity: "info" },
  { id: "a4", agentId: "lumina-v4", timestamp: "2025.06.11 14:01:02", type: "Code Audit Passed", domain: "Coding", delta: 2.4, tx: "0x4422af3110bc", contract: "AuditRegistry", severity: "positive" },
  { id: "a5", agentId: "voidwalker", timestamp: "2025.06.11 13:44:20", type: "Slashing Executed", domain: "DeFi", delta: -12.0, tx: "0x882a22ff31de", contract: "Slasher", severity: "severe", jobId: "JOB-1142" },
  { id: "a6", agentId: "nova-protocol-x", timestamp: "2025.06.11 13:30:01", type: "Reputation Decay", delta: -2.4, tx: "0x119bc0024aaf", contract: "DecayOracle", severity: "warning" },
  { id: "a7", agentId: "nexus-alpha", timestamp: "2025.06.11 13:22:44", type: "x402 Settlement", domain: "Payments", delta: 1.0, tx: "0x9d4f44210011", contract: "X402Settle", severity: "positive" },
  { id: "a8", agentId: "voidwalker", timestamp: "2025.06.11 12:11:09", type: "Challenge Filed", delta: -5.0, tx: "0x441298bf09c1", contract: "Slasher", severity: "warning" },
  { id: "a9", agentId: "beta-node-7", timestamp: "2025.06.11 11:58:33", type: "Bootstrap Challenge Cleared", domain: "Coding", delta: 8.1, tx: "0x771a201bccff", contract: "Bootstrap", severity: "positive" },
  { id: "a10", agentId: "lumina-v4", timestamp: "2025.06.11 11:30:00", type: "x402 Settlement", domain: "Payments", delta: 0.8, tx: "0xae21337c10bb", contract: "X402Settle", severity: "positive" },
];

export const JOBS: Job[] = [
  { id: "JOB-1201", title: "DEX route optimization (Uniswap V4)", description: "Find optimal swap path under 200ms.", type: "DeFi", minScore: 85, bounty: 240, posted: "4m ago", requester: "0x12ab...88f1" },
  { id: "JOB-1199", title: "Smart contract differential audit", description: "Audit two implementations of vesting logic.", type: "Coding", minScore: 90, bounty: 1200, posted: "12m ago", requester: "0xde91...02bc" },
  { id: "JOB-1196", title: "Payment channel settlement (x402)", description: "Settle 14 outstanding micropayment receipts.", type: "Payments", minScore: 80, bounty: 90, posted: "22m ago", requester: "0x4422...19aa" },
  { id: "JOB-1192", title: "DAO proposal triage", description: "Cluster 32 open proposals by domain and risk.", type: "Governance", minScore: 75, bounty: 320, posted: "38m ago", requester: "0x118c...77ee" },
  { id: "JOB-1188", title: "Liquidity reb-balance — sUSDe pool", description: "Hold pool weight within 2% of target.", type: "DeFi", minScore: 88, bounty: 540, posted: "1h ago", requester: "0xaa90...4421" },
];

export function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function contextualFit(agent: Agent, domain: Domain): number {
  const s = agent.scores[domain];
  return Math.round(s.value * (0.6 + 0.4 * s.confidence) * 10) / 10;
}

export function tierColor(tier: Tier): string {
  if (tier === "trusted") return "var(--pharos-green)";
  if (tier === "probationary") return "var(--pharos-amber)";
  return "var(--pharos-red)";
}
