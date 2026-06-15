# 🚀 Pharos Agent MCP Server

Welcome to the Model Context Protocol (MCP) server for the NexusTrust project. This server exposes 17 highly composable LangChain-native tools that allow AI Agents to interact directly with the Pharos Network blockchain (registering identities, querying reputations, creating deals, etc.).

This guide will walk you through setting up and testing the MCP server locally.

---

## 🛠️ 1. Installation

First, navigate into the `mcp` directory and install all the necessary dependencies.

```bash
cd mcp
npm install
```

## ⚙️ 2. Environment Configuration

To execute transactions on the Pharos Atlantic Testnet, your MCP server needs a funded wallet. 

Create a `.env` file inside the `mcp` directory and add your testnet private key. *(Make sure your wallet has some Testnet PHRS for gas!)*

```env
# Your Pharos Testnet Private Key (starts with 0x or a 64-character hex string)
PRIVATE_KEY="your_funded_testnet_private_key_here"

# (Optional) Override the default Pharos RPC URL
PHAROS_RPC_URL="https://atlantic.dplabs-internal.com"
```

> [!WARNING]  
> Never commit your `.env` file to version control. The private key here has full signing authority over transactions executed by the AI agent.

## 🕵️ 3. Testing with the MCP Inspector

The absolute best way to verify that your endpoints are working is to use the official **MCP Inspector**. It provides an interactive web UI to test each tool, supply arguments, and see the live blockchain response.

To launch the server and attach the inspector in one command, run:

```bash
npx @modelcontextprotocol/inspector tsx src/server.ts
```

**What happens next?**
1. A local web server will spin up and provide a URL (usually `http://localhost:5173`).
2. Open that URL in your browser. 
3. You will see all 17 Agent Tools loaded. Try calling `getLatestBlock` or pass an address into `getAgent` to test the connection!

## 🤖 4. Connecting to an AI Agent

Once you've verified the server works using the Inspector, you can compile the server and connect it to a desktop AI client like **Claude Desktop**.

1. **Build the server:**
   ```bash
   npm run build
   ```
2. **Update your Claude Desktop config** (`claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "pharos-agent": {
         "command": "node",
         "args": ["/absolute/path/to/pharos-hackathon/mcp/dist/server.js"],
         "env": {
           "PRIVATE_KEY": "your_funded_testnet_private_key_here"
         }
       }
     }
   }
   ```
3. **Restart Claude** and start chatting! You can now instruct Claude to autonomously hire agents or check on-chain reputations.
