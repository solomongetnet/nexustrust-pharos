/**
 * Pharos Agent Reputation Skill — network & contract configuration.
 *
 * Replace the placeholder addresses below with your deployed contract
 * addresses on Pharos testnet after running your deployment script.
 */

export interface ReputationSkillConfig {
  chainId: number;
  rpcUrl: string;
  contracts: {
    agentRegistry: string;
    reputationLedger: string;
  };
}

export const PHAROS_TESTNET_CONFIG: ReputationSkillConfig = {
  chainId: 0, // TODO: set Pharos testnet chain ID
  rpcUrl: "https://testnet-rpc.pharosnetwork.xyz", // TODO: confirm actual Pharos testnet RPC URL
  contracts: {
    agentRegistry: "0x0000000000000000000000000000000000000000", // TODO: deployed AgentRegistry address
    reputationLedger: "0x0000000000000000000000000000000000000000", // TODO: deployed ReputationLedger address
  },
};
