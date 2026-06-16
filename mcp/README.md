# Pharos Agent MCP Server

MCP server that exposes blockchain tools for AI agents to interact with the Pharos Network (register identities, query reputations, create deals, etc.).


## Setup

```bash
cd mcp
npm install
```

Create a `.env` file:

```env
PRIVATE_KEY="your_pharos_funded_testnet_private_key_here"
BACKEND_URL="https://nexustrust-backend.solomongetnet.site"
PHAROS_RPC_URL="https://atlantic.dplabs-internal.com"
HTTP_PORT=3000  # optional, defaults to 3000
```

## Run the Server

### As MCP Stdio Server (for Claude Desktop, etc.)
```bash
npm run build
npm start
```

### With HTTP API Server (for direct access)
```bash
npm run build
npm start
# HTTP API will be available at http://localhost:3000
```

## HTTP API Endpoints

### List All Tools
```bash
GET http://localhost:3000/tools
```

### Execute a Tool
```bash
POST http://localhost:3000/tools/:toolName
Content-Type: application/json

{
  "arg1": "value1",
  "arg2": "value2"
}
```

**Example: Get an agent's reputation**
```bash
curl -X POST http://localhost:3000/tools/getReputation \
  -H "Content-Type: application/json" \
  -d '{"agentAddress": "0x1234567890AbcdEF1234567890aBcdef12345678"}'
```

## Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/server.js
```

Open the provided URL to interactively test all tools.

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

