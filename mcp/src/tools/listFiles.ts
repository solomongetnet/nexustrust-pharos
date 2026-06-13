import { type McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { listFilesInputSchema } from "../validators/index.js";

// Simulated file structure
const simulatedFiles: Record<string, string[]> = {
  "/": ["src", "package.json", "tsconfig.json", "README.md"],
  "/src": ["server.ts", "tools", "validators"],
};

export function registerListFilesTool(server: McpServer) {
  server.registerTool(
    "listFiles",
    {
      description: "List files in a given directory (simulated)",
      inputSchema: listFilesInputSchema,
    },
    async ({ directory }) => {
      const dirFiles = simulatedFiles[directory] || [];
      return {
        content: [
          {
            type: "text",
            text: `Files in ${directory}:\n- ${dirFiles.join("\n- ")}`,
          },
        ],
      };
    }
  );
}
