import {} from "@modelcontextprotocol/sdk/server/mcp.js";
import { agentRegistryTools } from "./agentRegistry/index.js";
import { reputationLedgerTools } from "./reputationLedger/index.js";
import { accountTools } from "./account/index.js";
import { DynamicStructuredTool } from "@langchain/core/tools";
export const allAgentTools = [...agentRegistryTools, ...reputationLedgerTools, ...accountTools];
export function registerAllTools(server) {
    for (const tool of allAgentTools) {
        const t = tool;
        const schemaShape = t.schema.shape;
        server.tool(t.name, t.description, schemaShape, async (args) => {
            const result = await t.invoke(args);
            return { content: [{ type: "text", text: String(result) }] };
        });
    }
}
