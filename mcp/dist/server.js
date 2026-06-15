#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools } from "./tools/index.js";
// Create an MCP server instance
const mcpServer = new McpServer({
    name: "pharos-agent-mcp-server",
    version: "1.0.0",
});
// Register all tools
registerAllTools(mcpServer);
async function main() {
    // Create a stdio transport
    const transport = new StdioServerTransport();
    // Connect the server
    await mcpServer.connect(transport);
    console.error("Pharos Agent MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
