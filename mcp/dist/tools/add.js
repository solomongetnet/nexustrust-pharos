import {} from "@modelcontextprotocol/sdk/server/mcp.js";
import { addInputSchema } from "../validators/index.js";
export function registerAddTool(server) {
    server.registerTool("add", {
        description: "Calculate the sum of two numbers",
        inputSchema: addInputSchema,
    }, async ({ a, b }) => {
        return {
            content: [
                {
                    type: "text",
                    text: `The sum of ${a} and ${b} is ${a + b}`,
                },
            ],
        };
    });
}
