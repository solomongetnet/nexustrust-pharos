import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const registryAddress = CONTRACT_ADDRESSES.agentRegistry;
export const reactivateAgentTool = new DynamicStructuredTool({
    name: "reactivateAgent",
    description: "Reactivate a previously deactivated agent",
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
                functionName: "reactivateAgent",
                args: [agentAddress],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Agent reactivated successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error reactivating agent: ${error.message}`;
        }
    },
});
