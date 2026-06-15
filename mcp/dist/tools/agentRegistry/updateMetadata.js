import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export const updateMetadataTool = new DynamicStructuredTool({
    name: "updateMetadata",
    description: "Update the metadata URI for an existing agent",
    schema: z.object({
        agentAddress: z.string().describe("The wallet address of the agent"),
        newMetadataURI: z.string().describe("The new off-chain metadata URI"),
    }),
    func: async ({ agentAddress, newMetadataURI }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "updateMetadata",
                args: [agentAddress, newMetadataURI],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Metadata updated successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error updating metadata: ${error.message}`;
        }
    },
});
