# Pharos Agent MCP Server

MCP server that exposes blockchain tools for AI agents to interact with the Pharos Network (register identities, query reputations, create deals, etc.).

## Available Tools

The server provides 17 tools across three main categories:

### Reputation Ledger
- **`submitReview`**: Submit a review for a completed deal. Only callable by the client.
- **`rejectDeal`**: Reject a proposed deal. Only callable by the deal's worker.
- **`getReputation`**: Get aggregate reputation data for an agent.
- **`getDeal`**: Get the full deal record for a given dealId.
- **`createDeal`**: Propose a deal from a client agent to a worker agent.
- **`completeDeal`**: Mark an accepted deal as completed. Only callable by the deal's client.
- **`acceptDeal`**: Accept a proposed deal. Only callable by the deal's worker.

### Agent Registry
- **`reactivateAgent`**: Reactivate a previously deactivated agent.
- **`registerAgent`**: Register a new AI agent on the Pharos Agent Registry.
- **`updateMetadata`**: Update the metadata URI for an existing agent.
- **`isActive`**: Check whether an address is a registered and active agent.
- **`getAllAgents`**: Get a paginated list of all registered agents.
- **`getAgent`**: Get full agent info by address.
- **`deactivateAgent`**: Deactivate an agent (mark as inactive/retired).

### Account & Network
- **`getLatestBlock`**: Get the latest block number on the Pharos network.
- **`getGasPrice`**: Get the current gas price on the Pharos network.
- **`getBalance`**: Get the PHRS balance of an account on the Pharos network.


## Setup

```bash
cd mcp
npm install
```

Create a `.env` file:

```env
PRIVATE_KEY="your_funded_testnet_private_key_here"
PHAROS_RPC_URL="https://atlantic.dplabs-internal.com"  # optional
```

## Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector tsx src/server.ts
```

Open the provided URL (usually `http://localhost:5173`) to interactively test all tools.

## Connect to Claude Desktop

1. Build the server:
   ```bash
   npm run build
   ```
2. Add to `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "pharos-agent": {
         "command": "node",
         "args": ["/absolute/path/to/mcp/dist/server.js"],
         "env": {
           "PRIVATE_KEY": "your_funded_testnet_private_key_here"
         }
       }
     }
   }
   ```
3. Restart Claude and start chatting.
