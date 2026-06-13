import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PharosContractsModule", (m) => {
  const agentRegistry = m.contract("AgentRegistry");
  
  const reputationLedger = m.contract("ReputationLedger", {
    args: [agentRegistry],
  });

  return { agentRegistry, reputationLedger };
});
