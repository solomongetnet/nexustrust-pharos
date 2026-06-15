import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export const deactivateAgentTool = new DynamicStructuredTool({
    name: "deactivateAgent",
    description: "Deactivate an agent (mark as inactive/retired)",
    schema: z.object({
        agentAddress: z.string().describe("The wallet address of the agent"),
    }),
    func: async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: registryAddress,
                abi: agentRegistryAbi,
                functionName: "deactivateAgent",
                args: [agentAddress],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Agent deactivated successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error deactivating agent: ${error.message}`;
        }
    },
});
