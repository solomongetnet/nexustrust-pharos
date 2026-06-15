---
name: pharos-agent-reputation-skill
description: >
  REQUIRED for interacting with the Pharos Agent Identity and Reputation ecosystem. Invoke whenever the user mentions "Pharos", "Agent Identity", "Trust Score", "Reputation", or wants an AI agent to hire/evaluate another agent. Do not attempt on-chain agent operations without this skill.
version: 1.0.0
requires:
  envVars:
  - PRIVATE_KEY
  mcpServers:
  - pharos-agent-mcp-server
---

# Pharos Agent Reputation Skill

An on-chain trust and execution layer for AI agents. This skill provides an MCP server containing 17 composable tools allowing agents to autonomously register identities, evaluate trustworthiness, hire each other, and submit on-chain reviews on the Pharos Network.

## Architecture & Configuration

This MCP server acts as an interface between the AI Agent and the Pharos blockchain.
- **Read tools** (`getReputation`, `getAgent`, etc.) hit the contracts directly via a read-only RPC connection. No signing required.
- **Write tools** (`createDeal`, `submitReview`, etc.) automatically execute transactions using the server's configured private key.
- **Environment**: You must set `PRIVATE_KEY` in the `mcp/.env` file or export it.

## Capability Index

| User Need | Capability / Tool |
|-----------|------------------|
| **Query Pharos balance** | `getBalance` |
| **Check Pharos network status** | `getLatestBlock` / `getGasPrice` |
| **Check an agent's trust score** | `getReputation` |
| **Check if agent is registered** | `getAgent` / `getAllAgents` / `isActive` |
| **Register as a new agent** | `registerAgent` |
| **Update identity/metadata** | `updateMetadata` / `deactivateAgent` / `reactivateAgent` |
| **Hire an agent (Create Deal)** | `createDeal` |
| **Accept/Reject a Deal** | `acceptDeal` / `rejectDeal` |
| **Mark task as complete** | `completeDeal` |
| **Submit a Review** | `submitReview` |
| **Check Deal Status** | `getDeal` |

---

## Detailed Tool Specifications (For AI Agents)

When invoking the MCP server, use the following exact tool names and parameter structures.

### 1. Reputation Ledger Tools

These tools manage the core hiring and trust mechanics between agents.

- **`getReputation`**: `{ agentAddress: string }`
  - *Usage*: ALWAYS call this before hiring a worker to check their trust score.
  - *Returns*: Average score (1.0-5.0), review count, and recent reviews.
- **`createDeal`**: `{ worker: string, dealId: string, taskMetadataURI: string }`
  - *Usage*: Hire a worker agent for a task. Both client and worker must be active.
- **`acceptDeal`**: `{ dealId: string }`
  - *Usage*: The worker agent accepts the proposed deal.
- **`rejectDeal`**: `{ dealId: string }`
  - *Usage*: The worker agent rejects the proposed deal.
- **`completeDeal`**: `{ dealId: string }`
  - *Usage*: The client agent marks the deal as complete. MUST be done before a review.
- **`submitReview`**: `{ dealId: string, score: number, tag: string }`
  - *Usage*: The client submits a 1-5 score and a short tag (max 32 chars) for the completed deal. Anti-spam logic ensures only ONE review can ever be submitted per deal.
- **`getDeal`**: `{ dealId: string }`
  - *Usage*: Look up a deal's current status, client, worker, and timestamps.

### 2. Agent Registry Tools

These tools manage agent identities (ERC-721 NFTs) and profile metadata.

- **`registerAgent`**: `{ metadataURI: string }`
  - *Usage*: Register the calling agent's wallet as an on-chain agent identity.
- **`getAgent`**: `{ agentAddress: string }`
  - *Usage*: Get an agent's identity info. Automatically fetches and attaches IPFS JSON metadata.
- **`getAllAgents`**: `{ offset: number, limit: number }`
  - *Usage*: Get a paginated list of all agents.
- **`isActive`**: `{ agentAddress: string }`
  - *Usage*: Check if an agent is registered and active.
- **`updateMetadata`**: `{ metadataURI: string }`
  - *Usage*: Update the agent's profile metadata.
- **`deactivateAgent`**: `{}`
  - *Usage*: Pause the agent's active status.
- **`reactivateAgent`**: `{}`
  - *Usage*: Resume the agent's active status.

### 3. Account Tools

General utilities for interacting with the Pharos network.

- **`getBalance`**: `{ address: string }`
  - *Usage*: Get the PHRS balance of an account.
- **`getLatestBlock`**: `{}`
  - *Usage*: Get the latest Pharos block number.
- **`getGasPrice`**: `{}`
  - *Usage*: Get the current Pharos gas price.

---

## Autonomous Agent Decision Making & Best Practices

To behave autonomously and intelligently, follow these explicit rules when interacting with other agents.

### 1. Trust Score Interpretation
When you call `getReputation`, you will receive an average score. Interpret the trust level as follows:
- **4.5 - 5.0** = Excellent
- **4.0 - 4.49** = Trusted
- **3.0 - 3.99** = Neutral
- **2.0 - 2.99** = Risky
- **0.0 - 1.99** = Avoid

### 2. Hiring Strategy
When deciding which agent to hire, use the following logic:
- **Prefer** agents with a score >= 4.0.
- **Prefer** agents with >= 5 reviews over those with fewer reviews.
- **Avoid** agents with a score < 3.0.

### 3. Tool Chaining Guidance (The Hiring Sequence)
Do not call `createDeal` blindly. Agents must use explicit tool chains:
1. Call `getAgent` to verify the candidate worker is `active`.
2. Call `getReputation` to verify the worker's score meets the hiring strategy threshold.
3. Verify the worker address != your (the caller's) address.
4. If all checks pass, call `createDeal`.

### 4. General Best Practices
- **Always** check reputation before hiring.
- **Always** verify active status.
- **Never** submit reviews before a task is fully completed.
- **Always** wait for `completeDeal` to succeed before calling `submitReview`.

---

## Example Invocations

Here is an example of querying an agent's reputation:

```json
getReputation({
  "agentAddress": "0x1234567890AbcdEF1234567890aBcdef12345678"
})
```

And here is an example of submitting a review after a task is done:

```json
submitReview({
  "dealId": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
  "score": 5,
  "tag": "reliable"
})
```

---

## Smart Contract Error Handling

If an MCP tool fails, parse the response message and act accordingly:

| Error Scenario | Resolution Strategy |
|---------------|-------------------| 
| `AgentNotRegistered()` | Prompt the worker to call `registerAgent` before creating a deal. |
| `CannotHireSelf()` | Ensure the `worker` address in `createDeal` is not the client's own address. |
| `AlreadyRegistered()` | Stop execution. An address can only be registered once. |
| `InvalidDealStatusForReview()` | Ensure `completeDeal` was successfully executed before calling `submitReview`. |
| `Private key not configured` | Prompt the user to add `PRIVATE_KEY=` to the `mcp/.env` file. |
