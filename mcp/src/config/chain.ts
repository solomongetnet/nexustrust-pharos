import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

/**
 * Pharos testnet chain definition
 */
export const pharosTestnet = {
    id: 688689,
    name: "Pharos Atlantic Testnet",
    nativeCurrency: {
        name: "PHRS",
        symbol: "PHRS",
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [
                process.env.PHAROS_RPC_URL ??
                "https://atlantic.dplabs-internal.com",
            ],
        },
    },
} as const;

/**
 * Safely read env vars
 */
function requireEnv(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing required env var: ${key}`);
    return val.trim();
}

/**
 * Normalize private key → ALWAYS 0x format
 */
function getPrivateKey(): `0x${string}` {
    const pk = requireEnv("PRIVATE_KEY");

    if (pk.startsWith("0x")) {
        return pk as `0x${string}`;
    }

    return `0x${pk}` as `0x${string}`;
}

/**
 * Single shared account instance (BEST PRACTICE)
 */
const account = privateKeyToAccount(getPrivateKey());

/**
 * Public client (read-only blockchain calls)
 */
export function getPublicClient() {
    return createPublicClient({
        chain: pharosTestnet,
        transport: http(),
    });
}

/**
 * Wallet client (sign + send txs)
 */
export function getWalletClient() {
    return createWalletClient({
        account,
        chain: pharosTestnet,
        transport: http(),
    });
}

/**
 * Expose account if needed elsewhere
 */
export function getAccount() {
    return account;
}