#!/usr/bin/env node
// MUST be first — loads .env before any module-level code (e.g. chain.ts account init)
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerAllTools, allAgentTools } from "./tools/index.js";
import express from "express";
import { DynamicStructuredTool } from "@langchain/core/tools";
// Create an MCP server instance
const mcpServer = new McpServer({
    name: "pharos-agent-mcp-server",
    version: "1.0.0",
});
// Register all tools
registerAllTools(mcpServer);
// Create Express HTTP server
const app = express();
const PORT = process.env.HTTP_PORT || 3000;
app.use(express.json());
// List all available tools
app.get("/tools", (req, res) => {
    const tools = allAgentTools.map((tool) => {
        const t = tool;
        return {
            name: t.name,
            description: t.description,
            schema: t.schema
        };
    });
    res.json({ tools });
});
// Execute a tool
app.post("/tools/:toolName", async (req, res) => {
    const { toolName } = req.params;
    const args = req.body;
    const tool = allAgentTools.find((t) => t.name === toolName);
    if (!tool) {
        return res.status(404).json({ error: `Tool '${toolName}' not found` });
    }
    try {
        const result = await tool.invoke(args);
        res.json({ result });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
async function main() {
    // Start HTTP server
    app.listen(PORT, () => {
        console.error(`HTTP API server running on http://localhost:${PORT}`);
    });
    // Start stdio MCP server
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.error("Pharos Agent MCP Server running on stdio");
    // Prevent the process from exiting immediately
    await new Promise(() => { });
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
