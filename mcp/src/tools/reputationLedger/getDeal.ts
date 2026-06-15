import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { reputationLedgerAbi } from "../../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";

const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger as `0x${string}`;

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
        args: [dealId as `0x${string}`],
      });

      const formattedDeal = {
        client: (deal as any).client,
        worker: (deal as any).worker,
        status: (deal as any).status,
        createdAt: (deal as any).createdAt.toString(),
        acceptedAt: (deal as any).acceptedAt.toString(),
        completedAt: (deal as any).completedAt.toString(),
        taskMetadataURI: (deal as any).taskMetadataURI,
      };

      return JSON.stringify(formattedDeal, null, 2);
    } catch (error: any) {
      return `Error fetching deal: ${error.message}`;
    }
  },
});
