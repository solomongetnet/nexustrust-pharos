import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export const getAllAgentsTool = new DynamicStructuredTool({
    name: "getAllAgents",
    description: "Get a paginated list of all registered agents",
    schema: z.object({
        offset: z.number().describe("Starting index (0-based)"),
        limit: z.number().describe("Number of agents to return"),
    }),
    func: async ({ offset, limit }) => {
        try {
            const publicClient = getPublicClient();
            const agents = await publicClient.readContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "getAllAgents",
                args: [BigInt(offset), BigInt(limit)],
            });
            const formattedAgents = await Promise.all(agents.map(async (agent) => {
                let metadata = null;
                if (agent.metadataURI) {
                    try {
                        const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
                        const ipfsPath = agent.metadataURI.replace('ipfs://', '');
                        const response = await fetch(`${ipfsGateway}${ipfsPath}`);
                        if (response.ok) {
                            metadata = await response.json();
                        }
                    }
                    catch (err) {
                        console.error('Error fetching metadata:', err);
                    }
                }
                return {
                    agentAddress: agent.agentAddress,
                    metadataURI: agent.metadataURI,
                    metadata: metadata,
                    tokenId: agent.tokenId.toString(),
                    registeredAt: agent.registeredAt.toString(),
                    active: agent.active,
                };
            }));
            return JSON.stringify(formattedAgents, null, 2);
        }
        catch (error) {
            return `Error fetching agents: ${error.message}`;
        }
    },
});
