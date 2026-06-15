import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { reputationLedgerAbi } from "../../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger;
export const rejectDealTool = new DynamicStructuredTool({
    name: "rejectDeal",
    description: "Reject a proposed deal. Only callable by the deal's worker.",
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
                functionName: "rejectDeal",
                args: [dealId],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Deal rejected successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error rejecting deal: ${error.message}`;
        }
    },
});
