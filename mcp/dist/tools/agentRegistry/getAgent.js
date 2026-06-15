import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export const getAgentTool = new DynamicStructuredTool({
    name: "getAgent",
    description: "Get full agent info by address",
    schema: z.object({
        agentAddress: z.string().describe("The wallet address of the agent"),
    }),
    func: async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const agent = await publicClient.readContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "getAgent",
                args: [agentAddress],
            });
            let metadata = null;
            const metadataURI = agent.metadataURI;
            if (metadataURI) {
                try {
                    const ipfsGateway = 'https://gateway.pinata.cloud/ipfs/';
                    const ipfsPath = metadataURI.replace('ipfs://', '');
                    const response = await fetch(`${ipfsGateway}${ipfsPath}`);
                    if (response.ok) {
                        metadata = await response.json();
                    }
                }
                catch (err) {
                    console.error('Error fetching metadata:', err);
                }
            }
            const formattedAgent = {
                agentAddress: agent.agentAddress,
                metadataURI: metadataURI,
                metadata: metadata,
                tokenId: agent.tokenId.toString(),
                registeredAt: agent.registeredAt.toString(),
                active: agent.active,
            };
            return JSON.stringify(formattedAgent, null, 2);
        }
        catch (error) {
            return `Error fetching agent: ${error.message}`;
        }
    },
});
