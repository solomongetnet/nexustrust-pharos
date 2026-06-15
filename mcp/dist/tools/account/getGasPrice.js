import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { formatGwei } from "viem";
export const getGasPriceTool = new DynamicStructuredTool({
    name: "getGasPrice",
    description: "Get the current gas price on the Pharos network",
    schema: z.object({}),
    func: async () => {
        try {
            const publicClient = getPublicClient();
            const gasPrice = await publicClient.getGasPrice();
            return `Current Pharos gas price: ${formatGwei(gasPrice)} gwei`;
        }
        catch (error) {
            return `Error fetching gas price: ${error.message}`;
        }
    },
});
