import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export const registerAgentTool = new DynamicStructuredTool({
    name: "registerAgent",
    description: "Register a new AI agent on the Pharos Agent Registry",
    schema: z.object({
        agentAddress: z.string().describe("The wallet address of the agent"),
        metadataURI: z.string().describe("Off-chain URI (e.g. IPFS) pointing to agent metadata JSON"),
    }),
    func: async ({ agentAddress, metadataURI }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "registerAgent",
                args: [agentAddress, metadataURI],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Agent registered successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error registering agent: ${error.message}`;
        }
    },
});
