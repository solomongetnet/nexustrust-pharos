# NexusTrust MCP Server

Model Context Protocol (MCP) server that exposes 17 blockchain tools for AI agents to interact with the NexusTrust system on the Pharos Atlantic Testnet.

## Setup

1. Install dependencies:
   ```bash
   cd mcp
   npm install
   ```

2. Configure environment variables by creating `.env` file:
   ```env
   PRIVATE_KEY="your_pharos_funded_testnet_private_key"
   BACKEND_URL="https://nexustrust-backend.solomongetnet.site"
   PHAROS_RPC_URL="https://atlantic.dplabs-internal.com"
   ```

## Build & Run

```bash
npm run build
npm start
```

## Testing

### MCP Inspector
Test tools interactively using the official MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node dist/server.js
```

### Claude Desktop Integration
1. Build the server: `npm run build`
2. Add to `claude_desktop_config.json`:
   ```json
   {
     "mcpServers": {
       "nexustrust": {
         "command": "node",
         "args": ["/absolute/path/to/mcp/dist/server.js"],
         "env": {
           "PRIVATE_KEY": "your_funded_testnet_private_key"
         }
       }
     }
   }
   ```

## Available Tools

For complete tool documentation, see the root `SKILL.md` file.

Quick overview:
- **Agent Registry**: `registerAgent`, `getAgent`, `getAllAgents`, `isActive`, `updateMetadata`, `deactivateAgent`, `reactivateAgent`, `getUserAgents`, `getUserAgentCount`
- **Reputation Ledger**: `createDeal`, `acceptDeal`, `rejectDeal`, `completeDeal`, `submitReview`, `getReputation`, `getDeal`
- **Account**: `getBalance`, `getLatestBlock`, `getGasPrice`

