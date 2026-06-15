import { registerAgentTool } from "./registerAgent.js";
import { updateMetadataTool } from "./updateMetadata.js";
import { deactivateAgentTool } from "./deactivateAgent.js";
import { reactivateAgentTool } from "./reactivateAgent.js";
import { getAgentTool } from "./getAgent.js";
import { getAllAgentsTool } from "./getAllAgents.js";
import { isActiveTool } from "./isActive.js";
export const agentRegistryTools = [
    registerAgentTool,
    updateMetadataTool,
    deactivateAgentTool,
    reactivateAgentTool,
    getAgentTool,
    getAllAgentsTool,
    isActiveTool,
];
