import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { getPublicClient, getWalletClient, getAccount } from "../../config/chain.js";
import { reputationLedgerAbi } from "../../contracts/abi/reputation-ledger-abi.js";
import { CONTRACT_ADDRESSES } from "../../contracts/index.js";
const ledgerAddress = CONTRACT_ADDRESSES.reputationLedger;
export const createDealTool = new DynamicStructuredTool({
    name: "createDeal",
    description: "Propose a deal from a client agent to a worker agent",
    schema: z.object({
        worker: z.string().describe("Address of the worker agent being proposed"),
        dealId: z.string().describe("Unique identifier (bytes32 hex string) for this deal"),
        taskMetadataURI: z.string().describe("Off-chain URI pointing to the task description"),
    }),
    func: async ({ worker, dealId, taskMetadataURI }) => {
        try {
            const publicClient = getPublicClient();
            const walletClient = getWalletClient();
            const account = getAccount();
            const { request } = await publicClient.simulateContract({
                address: ledgerAddress,
                abi: reputationLedgerAbi,
                functionName: "createDeal",
                args: [worker, dealId, taskMetadataURI],
                account,
            });
            const hash = await walletClient.writeContract(request);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            return `Deal created successfully! Tx Hash: ${receipt.transactionHash}`;
        }
        catch (error) {
            return `Error creating deal: ${error.message}`;
        }
    },
});
