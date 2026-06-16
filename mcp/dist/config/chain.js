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
};
/**
 * Safely read env vars
 */
function requireEnv(key) {
    const val = process.env[key];
    if (!val)
        throw new Error(`Missing required env var: ${key}`);
    return val.trim();
}
/**
 * Normalize private key → ALWAYS 0x format.
 * Accepts both raw hex and 0x-prefixed keys.
 */
function getPrivateKey() {
    let pk = requireEnv("PRIVATE_KEY");
    pk = pk.trim();
    // Remove any surrounding quotes
    pk = pk.replace(/^["']|["']$/g, "");
    if (pk.startsWith("0x")) {
        pk = pk.slice(2);
    }
    // Check length (should be 64 hex characters = 32 bytes)
    if (pk.length !== 64) {
        throw new Error(`Invalid private key length: expected 64 hex characters, got ${pk.length}`);
    }
    // Check that it's valid hex
    if (!/^[0-9a-fA-F]{64}$/.test(pk)) {
        throw new Error("Invalid private key: must be 64 hex characters");
    }
    return `0x${pk}`;
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
