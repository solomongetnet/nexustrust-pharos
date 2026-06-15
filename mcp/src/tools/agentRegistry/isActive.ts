import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient } from "../../config/chain.js";
import { agentRegistryAbi } from "../../contracts/abi/agent-registry-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";

const registryAddress = CONTRACT_ADDRESSES.agentRegistry as `0x${string}`;

export const isActiveTool = new DynamicStructuredTool({
  name: "isActive",
  description: "Check whether an address is a registered and active agent",
  schema: z.object({
    agentAddress: z.string().describe("The wallet address of the agent"),
  }),
  func: async ({ agentAddress }) => {
    try {
      const publicClient = getPublicClient();
      const active = await publicClient.readContract({
        address: registryAddress,
        abi: agentRegistryAbi,
        functionName: "isActive",
        args: [agentAddress as `0x${string}`],
      });

      return `Agent Active Status: ${active}`;
    } catch (error: any) {
      return `Error checking active status: ${error.message}`;
    }
  },
});
