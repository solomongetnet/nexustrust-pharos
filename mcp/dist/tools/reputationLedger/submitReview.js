import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { reputationLedgerAbi } from "../../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger;
export const submitReviewTool = new DynamicStructuredTool({
    name: "submitReview",
    description: "Submit a review for a completed deal. Only callable by the client.",
    schema: z.object({
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
        score: z.number().describe("Score from 1 to 5"),
        tag: z.string().describe("Short label describing the experience (max 32 bytes)"),
    }),
    func: async ({ dealId, score, tag }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "submitReview",
                args: [dealId, score, tag],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Review submitted successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error submitting review: ${error.message}`;
        }
    },
});
