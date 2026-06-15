import { getAllAgentsTool } from "../src/tools/agentRegistry/getAllAgents"
import { getAgentTool } from "../src/tools/agentRegistry/getAgent"
import { getReputationTool } from "../src/tools/reputationLedger/getReputation"

async function main() {
    console.log("=== Simple Read-Only MCP Demo ===");
    console.log("=================================\n");

    console.log("--- [1] Listing Available Agents ---");
    const listResultStr = await getAllAgentsTool.invoke({ offset: 0, limit: 5 });
    console.log(listResultStr);

    // Hardcode an address we know exists on the testnet from the list above
    const targetAddress = "0x1234567890AbcdEF1234567890aBcdef12345678";

    console.log(`\n--- [2] Fetching Identity for Agent: ${targetAddress} ---`);
    const infoResult = await getAgentTool.invoke({ agentAddress: targetAddress });
    console.log(infoResult);

    console.log(`\n--- [3] Checking Trust Score for Agent: ${targetAddress} ---`);
    const repResult = await getReputationTool.invoke({ agentAddress: targetAddress });
    console.log(repResult);

    console.log("\nDemo completed successfully!");
}

main().catch(console.error);
