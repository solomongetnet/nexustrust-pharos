#!/usr/bin/env node
/**
 * Pharos Agent Reputation Skill — MCP Server
 *
 * Exposes the ReputationSkill SDK as MCP tools so any LLM-based agent
 * (Claude, or any MCP-compatible agent runtime) can call:
 *   - register_agent
 *   - get_reputation
 *   - create_job
 *   - complete_job
 *   - submit_review
 *
 * Configure via environment variables:
 *   PHAROS_RPC_URL        - Pharos testnet RPC endpoint
 *   AGENT_PRIVATE_KEY     - private key of the agent's wallet (signer)
 *   AGENT_REGISTRY_ADDR   - deployed AgentRegistry contract address
 *   REPUTATION_LEDGER_ADDR- deployed ReputationLedger contract address
 *
 * Run:
 *   npx ts-node src/mcpServer.ts
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ethers } from "ethers";
import { ReputationSkill } from "./reputationSkill";
import { ReputationSkillConfig, PHAROS_TESTNET_CONFIG } from "./config";

// -----------------------------------------------------------------------
// Setup: signer + skill instance from environment config
// -----------------------------------------------------------------------

const rpcUrl = process.env.PHAROS_RPC_URL ?? PHAROS_TESTNET_CONFIG.rpcUrl;
const privateKey = process.env.AGENT_PRIVATE_KEY;

if (!privateKey) {
  throw new Error("AGENT_PRIVATE_KEY environment variable is required");
}

const provider = new ethers.JsonRpcProvider(rpcUrl);
const signer = new ethers.Wallet(privateKey, provider);

const config: ReputationSkillConfig = {
  ...PHAROS_TESTNET_CONFIG,
  contracts: {
    agentRegistry: process.env.AGENT_REGISTRY_ADDR ?? PHAROS_TESTNET_CONFIG.contracts.agentRegistry,
    reputationLedger: process.env.REPUTATION_LEDGER_ADDR ?? PHAROS_TESTNET_CONFIG.contracts.reputationLedger,
  },
};

const skill = new ReputationSkill(signer, config);

// -----------------------------------------------------------------------
// MCP tool definitions
// -----------------------------------------------------------------------

const TOOLS = [
  {
    name: "register_agent",
    description:
      "Register the connected agent's wallet as an on-chain agent identity. Mints an Agent Identity NFT. Call this once before using other Skill tools.",
    inputSchema: {
      type: "object",
      properties: {
        metadataURI: {
          type: "string",
          description: "Off-chain URI (e.g. ipfs://...) pointing to agent metadata JSON (name, avatar, description, skillsOffered).",
        },
      },
      required: ["metadataURI"],
    },
  },
  {
    name: "get_reputation",
    description:
      "Get an agent's on-chain reputation: average score (1-5), total review count, and recent reviews. Use this to evaluate a candidate agent before hiring them with create_job.",
    inputSchema: {
      type: "object",
      properties: {
        agentAddress: {
          type: "string",
          description: "The wallet address of the agent to look up.",
        },
      },
      required: ["agentAddress"],
    },
  },
  {
    name: "create_job",
    description:
      "Hire a worker agent for a task by creating an on-chain job record. The connected agent becomes the job's client. Both client and worker must be registered and active agents.",
    inputSchema: {
      type: "object",
      properties: {
        workerAddress: {
          type: "string",
          description: "Wallet address of the agent being hired.",
        },
        taskDescription: {
          type: "string",
          description: "Human-readable description of the task. Used to deterministically derive the jobId.",
        },
      },
      required: ["workerAddress", "taskDescription"],
    },
  },
  {
    name: "complete_job",
    description:
      "Mark a job as completed. Only callable by the agent that created the job (the client). Required before a review can be submitted.",
    inputSchema: {
      type: "object",
      properties: {
        taskDescription: {
          type: "string",
          description: "The same task description used when creating the job (used to derive the jobId).",
        },
      },
      required: ["taskDescription"],
    },
  },
  {
    name: "submit_review",
    description:
      "Submit a review (score 1-5 and a short tag) for a completed job's worker agent. Only callable by the job's client, only once per job, and only after complete_job.",
    inputSchema: {
      type: "object",
      properties: {
        taskDescription: {
          type: "string",
          description: "The same task description used when creating the job (used to derive the jobId).",
        },
        score: {
          type: "integer",
          description: "Score from 1 to 5.",
          minimum: 1,
          maximum: 5,
        },
        tag: {
          type: "string",
          description: "Short label describing the experience, e.g. 'fast', 'reliable', 'low-quality'. Max 32 characters.",
        },
      },
      required: ["taskDescription", "score", "tag"],
    },
  },
];

// -----------------------------------------------------------------------
// MCP server
// -----------------------------------------------------------------------

const server = new Server(
  {
    name: "pharos-agent-reputation-skill",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: rawArgs } = request.params;
  const args = rawArgs ?? {};

  try {
    switch (name) {
      case "register_agent": {
        const receipt = await skill.registerAgent(args.metadataURI as string);
        return textResult({ success: true, txHash: receipt.hash });
      }

      case "get_reputation": {
        const reputation = await skill.getReputation(args.agentAddress as string);
        return textResult(reputation);
      }

      case "create_job": {
        const jobId = ReputationSkill.makeJobId(args.taskDescription as string);
        const receipt = await skill.createJob(args.workerAddress as string, jobId);
        return textResult({ success: true, jobId, txHash: receipt.hash });
      }

      case "complete_job": {
        const jobId = ReputationSkill.makeJobId(args.taskDescription as string);
        const receipt = await skill.completeJob(jobId);
        return textResult({ success: true, jobId, txHash: receipt.hash });
      }

      case "submit_review": {
        const jobId = ReputationSkill.makeJobId(args.taskDescription as string);
        const receipt = await skill.submitReview(jobId, args.score as number, args.tag as string);
        return textResult({ success: true, jobId, txHash: receipt.hash });
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err: any) {
    return {
      content: [{ type: "text", text: `Error: ${err.message ?? String(err)}` }],
      isError: true,
    };
  }
});

function textResult(data: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

// -----------------------------------------------------------------------
// Start server (stdio transport)
// -----------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pharos Agent Reputation Skill MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
