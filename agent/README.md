# NexusTrust Agent Configuration

This folder provides configuration to connect your AI agent with NexusTrust MCP tools! 🤖

## What's in here?

- `mcp.json`: MCP server configuration file
- `mcp-tools.json`: (Legacy) tools configuration file

## Quick Start

1. **Build the MCP Server first**:
   ```bash
   cd ../mcp
   npm install
   npm run build
   ```

2. **Set up your private key**:
   Set the `MCP_PRIVATE_KEY` environment variable with your Pharos testnet private key.

3. **Connect to your AI agent**:
   - Use `mcp.json` to configure your AI agent's MCP server connection

## Need more help?

Check out the [main README](../README.md) or [SKILL.md](../SKILL.md) for detailed instructions!

