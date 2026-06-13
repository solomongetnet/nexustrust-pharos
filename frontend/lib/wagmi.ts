import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { mainnet, sepolia, type Chain } from "wagmi/chains";

export const pharosTestnet = {
  id: 688688,
  name: "Pharos Testnet",
  nativeCurrency: { name: "Pharos", symbol: "PHRS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.dplabs-internal.com"] },
  },
  blockExplorers: {
    default: { name: "Pharosscan", url: "https://testnet.pharosscan.xyz" },
  },
  testnet: true,
} as const satisfies Chain;

export const wagmiConfig = createConfig({
  chains: [pharosTestnet, mainnet, sepolia],
  connectors: [injected({ shimDisconnect: true })],
  ssr: true,
  transports: {
    [pharosTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
