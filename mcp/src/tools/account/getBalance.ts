import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { formatEther } from "viem";

export const getBalanceTool = new DynamicStructuredTool({
  name: "getBalance",
  description: "Get the PHRS balance of an account on the Pharos network",
  schema: z.object({
    address: z.string().describe("The wallet address to check"),
  }),
  func: async ({ address }) => {
    try {
      const publicClient = getPublicClient();
      const balanceWei = await publicClient.getBalance({
        address: address as `0x${string}`,
      });

      const balancePhrs = formatEther(balanceWei);
      return `Balance for ${address}: ${balancePhrs} PHRS`;
    } catch (error: any) {
      return `Error fetching balance: ${error.message}`;
    }
  },
});
