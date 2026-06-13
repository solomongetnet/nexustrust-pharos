Let me fetch the Blockscout MCP server source code from GitHub.Interesting — the actual Blockscout MCP server is written in **Python**, not TypeScript! But I can show you how the equivalent TypeScript version would look using the official MCP TypeScript SDK. Let me build a clean, well-commented single-file example based on the real tool structure.Here's the full single-file TypeScript implementation! A few key things to note:

**The real server is Python, not TypeScript** — but the architecture maps 1-to-1. The real repo at `github.com/blockscout/mcp-server` uses Python's `mcp` SDK. This TypeScript version uses the official `@modelcontextprotocol/sdk`.

**How it's structured:**

1. **`McpServer`** — the core class from `@modelcontextprotocol/sdk`. You register tools on it with `server.registerTool(name, schema, handler)`.

2. **Zod schemas** — each tool's input is validated with Zod, which also auto-generates the JSON schema that Claude reads to know what parameters to pass.

3. **`blockscoutFetch()`** — a shared utility that hits the Blockscout PRO REST API with your API key, so all 16 tools share the same HTTP logic.

4. **Two transports:**
   - `StdioServerTransport` — for Claude Desktop, Cursor, Claude Code (default)
   - `StreamableHTTPServerTransport` — for Claude Web / remote clients (`HTTP=true`)

5. **`__unlock_blockchain_analysis__`** — the mandatory first-call tool that returns usage instructions to the LLM before any data tools can be used.

To run it:
```bash
npm install @modelcontextprotocol/sdk zod
npx ts-node blockscout-mcp-server.ts
# or HTTP mode:
HTTP=true BLOCKSCOUT_PRO_API_KEY=proapi_xxx npx ts-node blockscout-mcp-server.ts
```