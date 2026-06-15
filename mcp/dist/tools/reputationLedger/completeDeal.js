import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { reputationLedgerAbi } from "../../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger;
export const completeDealTool = new DynamicStructuredTool({
    name: "completeDeal",
    description: "Mark an accepted deal as completed. Only callable by the deal's client.",
    schema: z.object({
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
    }),
    func: async ({ dealId }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "completeDeal",
                args: [dealId],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Deal completed successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error completing deal: ${error.message}`;
        }
    },
});
