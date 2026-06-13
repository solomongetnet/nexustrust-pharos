import {} from "@modelcontextprotocol/sdk/server/mcp.js";
import { greetInputSchema } from "../validators/index.js";
export function registerGreetTool(server) {
    server.registerTool("greet", {
        description: "Greet someone by name with an optional message",
        inputSchema: greetInputSchema,
    }, async ({ name, message }) => {
        const greeting = message || "Hello";
        return {
            content: [
                {
                    type: "text",
                    text: `${greeting}, ${name}! Welcome to the simple MCP server!`,
                },
            ],
        };
    });
}
