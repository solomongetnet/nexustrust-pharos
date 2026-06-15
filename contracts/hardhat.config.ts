// @ts-ignore
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { defineConfig } from "hardhat/config";
import "dotenv/config";

const privateKey = process.env.PRIVATE_KEY || "";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    pharos: {
      type: "http",
      url: "https://atlantic.dplabs-internal.com",
      chainId: 688689,
      accounts: privateKey ? [privateKey] : [],
    },
  },


  chainDescriptors: {
    688689: {
      name: "Pharos Atlantic",
      blockExplorers: {
        etherscan: {
          name: "Pharos Scan",
          url: "https://atlantic.pharosscan.xyz/",
          apiUrl: "https://api.socialscan.io/pharos-atlantic-testnet/v1/explorer/command_api/contract",
        },
      },
    },
  }

});
