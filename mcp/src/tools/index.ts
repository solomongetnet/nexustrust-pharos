import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { agentRegistryTools } from "./agentRegistry/index.js";
import { reputationLedgerTools } from "./reputationLedger/index.js";
import { accountTools } from "./account/index.js";
import { DynamicStructuredTool } from "@langchain/core/tools";

export const allAgentTools = [...agentRegistryTools, ...reputationLedgerTools, ...accountTools];

export function registerAllTools(server: McpServer) {
  for (const tool of allAgentTools) {
    const t = tool as DynamicStructuredTool<any>;
    const schemaShape = (t.schema as any).shape;

    server.tool(
      t.name,
      t.description,
      schemaShape,
      async (args: any) => {
        const result = await t.invoke(args);
        return { content: [{ type: "text" as const, text: String(result) }] };
      }
    );
  }
}
