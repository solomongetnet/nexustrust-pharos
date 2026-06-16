# Pharos Agent

The folder to configure your AI agent with Pharos MCP tools! 🤖

## Quick Start

1. **Build the MCP Server** (if not already built):
   ```bash
   cd ../mcp
   npm install
   npm run start
   ```

2. **Set up your private key**:
   Create an environment variable `PRIVATE_KEY` with your Pharos testnet private key.

3. **Connect to your AI agent**:
   - For Claude Desktop: Add this folder's config to your Claude Desktop config
   - For other agents: Use the `mcp.json` file to configure MCP servers

## What's in here?

- `mcp.json`: Configuration file to connect the Pharos Agent MCP Server to your AI agent

## Need more help?

Check out the [main README](../README.md) or [SKILL.md](../SKILL.md) for detailed instructions!

