import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PharosDeploymentModule = buildModule("PharosDeploymentModule", (m) => {
  // 1. Deploy AgentRegistry (Constructor takes no arguments)
  const agentRegistry = m.contract("AgentRegistry");

  // 2. Deploy ReputationLedger (Passes the deployed AgentRegistry address as a constructor argument)
  const reputationLedger = m.contract("ReputationLedger", [agentRegistry]);

  // Return both deployed contract instances
  return { agentRegistry, reputationLedger };
});

export default PharosDeploymentModule;
