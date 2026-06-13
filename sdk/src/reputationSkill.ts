import { ethers } from "ethers";
import { PHAROS_TESTNET_CONFIG, ReputationSkillConfig } from "./config";

const AGENT_REGISTRY_ABI = [
  "function registerAgent(string metadataURI) external",
  "function updateMetadata(string newMetadataURI) external",
  "function deactivateAgent() external",
  "function reactivateAgent() external",
  "function isRegistered(address agentAddr) external view returns (bool)",
  "function isActive(address agentAddr) external view returns (bool)",
  "function getAgent(address agentAddr) external view returns (address agentAddress, string metadataURI, uint256 tokenId, uint256 registeredAt, bool active)",
  "function getAgentByTokenId(uint256 tokenId) external view returns (address agentAddress, string metadataURI, uint256 tokenId, uint256 registeredAt, bool active)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "event AgentRegistered(address indexed agent, uint256 indexed tokenId, string metadataURI, uint256 timestamp)",
];

const REPUTATION_LEDGER_ABI = [
  "function createJob(address worker, bytes32 jobId) external",
  "function completeJob(bytes32 jobId) external",
  "function submitReview(bytes32 jobId, uint8 score, string tag) external",
  "function getReputation(address agent) external view returns (uint256 avgScoreX100, uint256 reviewCount, tuple(address reviewer, address agent, uint8 score, string tag, bytes32 jobId, uint256 timestamp)[] recent)",
  "function getJob(bytes32 jobId) external view returns (tuple(address client, address worker, uint8 status, uint256 createdAt, uint256 completedAt))",
  "event JobCreated(bytes32 indexed jobId, address indexed client, address indexed worker, uint256 timestamp)",
  "event JobCompleted(bytes32 indexed jobId, address indexed client, address indexed worker, uint256 timestamp)",
  "event ReviewSubmitted(bytes32 indexed jobId, address indexed reviewer, address indexed agent, uint8 score, string tag, uint256 timestamp)",
];

export interface Review {
  reviewer: string;
  agent: string;
  score: number;
  tag: string;
  jobId: string;
  timestamp: number;
}

export interface Reputation {
  avgScore: number; // human-readable, e.g. 4.5
  reviewCount: number;
  recentReviews: Review[];
}

export interface AgentInfo {
  agentAddress: string;
  metadataURI: string;
  tokenId: number;
  registeredAt: number;
  active: boolean;
}

export interface JobInfo {
  client: string;
  worker: string;
  status: "None" | "Created" | "Completed" | "Reviewed";
  createdAt: number;
  completedAt: number;
}

const JOB_STATUS_NAMES: JobInfo["status"][] = ["None", "Created", "Completed", "Reviewed"];

/**
 * ReputationSkill — Pharos Agent Reputation & Review Skill.
 *
 * Wraps AgentRegistry + ReputationLedger contracts behind a simple,
 * agent-friendly API. This is the reusable Skill module that any AI
 * agent (or agent framework) can import and call directly, or expose
 * via MCP for LLM-based agents.
 *
 * Usage:
 *   const signer = new ethers.Wallet(privateKey, provider);
 *   const skill = new ReputationSkill(signer);
 *   await skill.registerAgent("ipfs://...");
 */
export class ReputationSkill {
  private registry: ethers.Contract;
  private ledger: ethers.Contract;
  private signer: ethers.Signer;

  constructor(signer: ethers.Signer, config: ReputationSkillConfig = PHAROS_TESTNET_CONFIG) {
    this.signer = signer;
    this.registry = new ethers.Contract(config.contracts.agentRegistry, AGENT_REGISTRY_ABI, signer);
    this.ledger = new ethers.Contract(config.contracts.reputationLedger, REPUTATION_LEDGER_ABI, signer);
  }

  // ---------------------------------------------------------------------
  // Skill: register_agent
  // ---------------------------------------------------------------------

  /**
   * Register the connected wallet as an agent. Mints an Agent Identity NFT.
   * @param metadataURI Off-chain URI (e.g. ipfs://...) pointing to agent metadata JSON
   *                     (suggested fields: name, avatar, description, skillsOffered).
   */
  async registerAgent(metadataURI: string): Promise<ethers.TransactionReceipt> {
    const tx = await this.registry.registerAgent(metadataURI);
    return tx.wait();
  }

  /** Update the calling agent's metadata URI. */
  async updateMetadata(newMetadataURI: string): Promise<ethers.TransactionReceipt> {
    const tx = await this.registry.updateMetadata(newMetadataURI);
    return tx.wait();
  }

  /** Deactivate the calling agent (e.g. going offline). */
  async deactivateAgent(): Promise<ethers.TransactionReceipt> {
    const tx = await this.registry.deactivateAgent();
    return tx.wait();
  }

  /** Reactivate the calling agent. */
  async reactivateAgent(): Promise<ethers.TransactionReceipt> {
    const tx = await this.registry.reactivateAgent();
    return tx.wait();
  }

  /** Check whether an address is registered as an agent. */
  async isRegistered(agentAddress: string): Promise<boolean> {
    return this.registry.isRegistered(agentAddress);
  }

  /** Check whether an address is a registered AND active agent. */
  async isActive(agentAddress: string): Promise<boolean> {
    return this.registry.isActive(agentAddress);
  }

  /** Get full agent identity info for an address. */
  async getAgent(agentAddress: string): Promise<AgentInfo> {
    const result = await this.registry.getAgent(agentAddress);
    return {
      agentAddress: result.agentAddress,
      metadataURI: result.metadataURI,
      tokenId: Number(result.tokenId),
      registeredAt: Number(result.registeredAt),
      active: result.active,
    };
  }

  /** Get full agent identity info by Agent Identity NFT token ID. */
  async getAgentByTokenId(tokenId: number): Promise<AgentInfo> {
    const result = await this.registry.getAgentByTokenId(tokenId);
    return {
      agentAddress: result.agentAddress,
      metadataURI: result.metadataURI,
      tokenId: Number(result.tokenId),
      registeredAt: Number(result.registeredAt),
      active: result.active,
    };
  }

  // ---------------------------------------------------------------------
  // Skill: create_job / complete_job / submit_review
  // ---------------------------------------------------------------------

  /**
   * Create a job: the connected agent (client) hires `workerAddress`.
   * @param workerAddress Address of the worker agent being hired.
   * @param jobId Unique job identifier. Generate with `ReputationSkill.makeJobId(...)`
   *              or any unique bytes32 string (e.g. keccak256 of a task spec).
   */
  async createJob(workerAddress: string, jobId: string): Promise<ethers.TransactionReceipt> {
    const tx = await this.ledger.createJob(workerAddress, jobId);
    return tx.wait();
  }

  /** Mark a job as completed. Only callable by the job's client. */
  async completeJob(jobId: string): Promise<ethers.TransactionReceipt> {
    const tx = await this.ledger.completeJob(jobId);
    return tx.wait();
  }

  /**
   * Submit a review for a completed job. Only callable by the job's client,
   * and only once per job.
   * @param score 1-5
   * @param tag Short label, e.g. "fast", "reliable", "low-quality" (max 32 bytes)
   */
  async submitReview(jobId: string, score: number, tag: string): Promise<ethers.TransactionReceipt> {
    if (score < 1 || score > 5) {
      throw new Error("score must be between 1 and 5");
    }
    const tx = await this.ledger.submitReview(jobId, score, tag);
    return tx.wait();
  }

  /** Get the on-chain status of a job. */
  async getJob(jobId: string): Promise<JobInfo> {
    const result = await this.ledger.getJob(jobId);
    return {
      client: result.client,
      worker: result.worker,
      status: JOB_STATUS_NAMES[Number(result.status)],
      createdAt: Number(result.createdAt),
      completedAt: Number(result.completedAt),
    };
  }

  // ---------------------------------------------------------------------
  // Skill: get_reputation
  // ---------------------------------------------------------------------

  /**
   * Get aggregate reputation for an agent — the core trust-check Skill.
   * Use this before deciding whether to hire an agent via createJob().
   */
  async getReputation(agentAddress: string): Promise<Reputation> {
    const [avgScoreX100, reviewCount, recent] = await this.ledger.getReputation(agentAddress);

    const recentReviews: Review[] = recent.map((r: any) => ({
      reviewer: r.reviewer,
      agent: r.agent,
      score: Number(r.score),
      tag: r.tag,
      jobId: r.jobId,
      timestamp: Number(r.timestamp),
    }));

    return {
      avgScore: Number(avgScoreX100) / 100,
      reviewCount: Number(reviewCount),
      recentReviews,
    };
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  /** Generate a deterministic bytes32 jobId from a human-readable task string. */
  static makeJobId(taskDescription: string): string {
    return ethers.id(taskDescription);
  }

  /** Get the address of the connected signer. */
  async getAddress(): Promise<string> {
    return this.signer.getAddress();
  }
}
