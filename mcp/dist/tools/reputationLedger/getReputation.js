import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { reputationLedgerAbi } from "../../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger;
export const getReputationTool = new DynamicStructuredTool({
    name: "getReputation",
    description: "Get aggregate reputation data for an agent",
    schema: z.object({
        agentAddress: z.string().describe("The agent address to query"),
    }),
    func: async ({ agentAddress }) => {
        try {
            const publicClient = getPublicClient();
            const result = await publicClient.readContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "getReputation",
                args: [agentAddress],
            });
            const avgScoreX100 = result[0];
            const reviewCount = result[1];
            const recent = result[2];
            const formattedResult = {
                avgScoreX100: avgScoreX100.toString(),
                reviewCount: reviewCount.toString(),
                recent: recent.map((r) => ({
                    reviewer: r.reviewer,
                    agent: r.agent,
                    score: r.score,
                    tag: r.tag,
                    dealId: r.dealId,
                    timestamp: r.timestamp.toString(),
                })),
            };
            return JSON.stringify(formattedResult, null, 2);
        }
        catch (error) {
            return `Error fetching reputation: ${error.message}`;
        }
    },
});
