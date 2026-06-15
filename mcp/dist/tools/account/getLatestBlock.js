import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
export const getLatestBlockTool = new DynamicStructuredTool({
    name: "getLatestBlock",
    description: "Get the latest block number on the Pharos network",
    schema: z.object({}),
    func: async () => {
        try {
            const publicClient = getPublicClient();
            const blockNumber = await publicClient.getBlockNumber();
            return `Latest Pharos block number: ${blockNumber.toString()}`;
        }
        catch (error) {
            return `Error fetching block number: ${error.message}`;
        }
    },
});
