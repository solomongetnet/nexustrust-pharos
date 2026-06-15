import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { reputationLedgerAbi } from "../../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger;
export const getDealTool = new DynamicStructuredTool({
    name: "getDeal",
    description: "Get the full deal record for a given dealId",
    schema: z.object({
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
    }),
    func: async ({ dealId }) => {
        try {
            const publicClient = getPublicClient();
            const deal = await publicClient.readContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "getDeal",
                args: [dealId],
            });
            const formattedDeal = {
                client: deal.client,
                worker: deal.worker,
                status: deal.status,
                createdAt: deal.createdAt.toString(),
                acceptedAt: deal.acceptedAt.toString(),
                completedAt: deal.completedAt.toString(),
                taskMetadataURI: deal.taskMetadataURI,
            };
            return JSON.stringify(formattedDeal, null, 2);
        }
        catch (error) {
            return `Error fetching deal: ${error.message}`;
        }
    },
});
