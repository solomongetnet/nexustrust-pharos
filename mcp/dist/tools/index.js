import {} from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGreetTool } from "./greet.js";
import { registerAddTool } from "./add.js";
import { registerListFilesTool } from "./listFiles.js";
import { registerInMemoryTools } from "./inMemory.js";
export function registerAllTools(server) {
    registerGreetTool(server);
    registerAddTool(server);
    registerListFilesTool(server);
    registerInMemoryTools(server);
}
