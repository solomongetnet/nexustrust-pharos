# Pharos Agent MCP Server

MCP server that exposes blockchain tools for AI agents to interact with the Pharos Network (register identities, query reputations, create deals, etc.).

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
