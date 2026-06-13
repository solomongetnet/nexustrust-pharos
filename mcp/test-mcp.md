/**
 * Blockscout MCP Server — TypeScript (Single File)
 *
 * This file shows how the Blockscout MCP server is structured using the
 * official @modelcontextprotocol/sdk. The real server is written in Python,
 * but the architecture maps 1-to-1 to TypeScript.
 *
 * Install deps:
 *   npm install @modelcontextprotocol/sdk zod
 *
 * Run (stdio mode, for Claude Desktop / Cursor):
 *   npx ts-node blockscout-mcp-server.ts
 *
 * Run (HTTP mode, for Claude Web / remote clients):
 *   HTTP=true npx ts-node blockscout-mcp-server.ts
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import http from "http";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const PRO_API_KEY = process.env.BLOCKSCOUT_PRO_API_KEY ?? "";
const BASE_URL    = "https://proapi.blockscout.com";

// ─────────────────────────────────────────────
// Utility: call the Blockscout PRO REST API
// ─────────────────────────────────────────────

async function blockscoutFetch(
  chainId: string,
  path: string,
  params: Record<string, string> = {}
): Promise<unknown> {
  const url = new URL(`${BASE_URL}/${chainId}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${PRO_API_KEY}`,
      "User-Agent":  "Blockscout MCP TypeScript/1.0",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Blockscout API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ─────────────────────────────────────────────
// Create the MCP server instance
// ─────────────────────────────────────────────

const server = new McpServer({
  name:    "blockscout-mcp",
  version: "1.0.0",
});

// ─────────────────────────────────────────────
// Tool 1 — Session unlock (mandatory first call)
// ─────────────────────────────────────────────

server.registerTool(
  "__unlock_blockchain_analysis__",
  {
    description:
      "Unlocks access to all other tools. MUST be called before any other tool.",
    inputSchema: z.object({}),
  },
  async () => ({
    content: [
      {
        type: "text" as const,
        text: [
          "Session initialized. You may now use all Blockscout tools.",
          "",
          "Rules:",
          "- Always pass chain_id (e.g. '1' for Ethereum, '137' for Polygon).",
          "- Amounts are returned in raw form — divide by 10^decimals for human-readable values.",
          "- Addresses are lower-cased in responses.",
          "- Use get_chains_list() if you're unsure which chain_id to use.",
        ].join("\n"),
      },
    ],
  })
);

// ─────────────────────────────────────────────
// Tool 2 — Get supported chains
// ─────────────────────────────────────────────

server.registerTool(
  "get_chains_list",
  {
    description: "Returns all blockchain chains supported by Blockscout.",
    inputSchema: z.object({}),
  },
  async () => {
    const data = await blockscoutFetch("", "/api/v1/chains", {});
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 3 — Resolve ENS name → address
// ─────────────────────────────────────────────

server.registerTool(
  "get_address_by_ens_name",
  {
    description: "Converts an ENS domain name (e.g. 'vitalik.eth') to its Ethereum address.",
    inputSchema: z.object({
      name: z.string().describe("ENS domain name to resolve"),
    }),
  },
  async ({ name }) => {
    const data = await blockscoutFetch("1", "/api/v2/ens/domains", { name });
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 4 — Address info
// ─────────────────────────────────────────────

server.registerTool(
  "get_address_info",
  {
    description:
      "Returns comprehensive info about an address: balance, contract status, ENS name, token details.",
    inputSchema: z.object({
      chain_id: z.string().describe("Blockchain chain ID (e.g. '1' for Ethereum)"),
      address:  z.string().describe("Wallet or contract address (0x…)"),
    }),
  },
  async ({ chain_id, address }) => {
    const data = await blockscoutFetch(chain_id, `/api/v2/addresses/${address}`);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 5 — ERC-20 token holdings
// ─────────────────────────────────────────────

server.registerTool(
  "get_tokens_by_address",
  {
    description: "Returns all ERC-20 token holdings for a wallet, with market data.",
    inputSchema: z.object({
      chain_id: z.string().describe("Chain ID"),
      address:  z.string().describe("Wallet address"),
      cursor:   z.string().optional().describe("Pagination cursor from a previous response"),
    }),
  },
  async ({ chain_id, address, cursor }) => {
    const params: Record<string, string> = {};
    if (cursor) params.cursor = cursor;
    const data = await blockscoutFetch(chain_id, `/api/v2/addresses/${address}/tokens`, params);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 6 — NFT holdings
// ─────────────────────────────────────────────

server.registerTool(
  "nft_tokens_by_address",
  {
    description: "Returns NFTs (ERC-721, ERC-1155) owned by an address, grouped by collection.",
    inputSchema: z.object({
      chain_id: z.string().describe("Chain ID"),
      address:  z.string().describe("NFT owner address"),
      cursor:   z.string().optional().describe("Pagination cursor"),
    }),
  },
  async ({ chain_id, address, cursor }) => {
    const params: Record<string, string> = {};
    if (cursor) params.cursor = cursor;
    const data = await blockscoutFetch(
      chain_id,
      `/api/v2/addresses/${address}/nft/collections`,
      params
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 7 — Transaction info
// ─────────────────────────────────────────────

server.registerTool(
  "get_transaction_info",
  {
    description:
      "Returns comprehensive info for a transaction hash: decoded inputs, token transfers, fees.",
    inputSchema: z.object({
      chain_id:         z.string().describe("Chain ID"),
      transaction_hash: z.string().describe("Transaction hash (0x…)"),
      include_raw_input: z
        .boolean()
        .optional()
        .describe("If true, include raw hex input (default false)"),
    }),
  },
  async ({ chain_id, transaction_hash, include_raw_input }) => {
    const params: Record<string, string> = {};
    if (include_raw_input) params.include_raw_input = "true";
    const data = await blockscoutFetch(
      chain_id,
      `/api/v2/transactions/${transaction_hash}`,
      params
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 8 — Transactions by address
// ─────────────────────────────────────────────

server.registerTool(
  "get_transactions_by_address",
  {
    description: "Returns native transactions for an address within a date range.",
    inputSchema: z.object({
      chain_id: z.string().describe("Chain ID"),
      address:  z.string().describe("Sender or receiver address"),
      age_from: z.string().describe("Start datetime (ISO 8601, e.g. 2025-01-01T00:00:00Z)"),
      age_to:   z.string().optional().describe("End datetime (ISO 8601). Defaults to now."),
      methods:  z.string().optional().describe("Filter by method signature (e.g. 0x304e6ade)"),
      cursor:   z.string().optional().describe("Pagination cursor"),
    }),
  },
  async ({ chain_id, address, age_from, age_to, methods, cursor }) => {
    const params: Record<string, string> = { age_from };
    if (age_to)   params.age_to   = age_to;
    if (methods)  params.methods  = methods;
    if (cursor)   params.cursor   = cursor;
    const data = await blockscoutFetch(
      chain_id,
      `/api/v2/addresses/${address}/transactions`,
      params
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 9 — Token transfers by address
// ─────────────────────────────────────────────

server.registerTool(
  "get_token_transfers_by_address",
  {
    description: "Returns ERC-20 token transfers for an address within a date range.",
    inputSchema: z.object({
      chain_id: z.string().describe("Chain ID"),
      address:  z.string().describe("Initiator or receiver address"),
      age_from: z.string().describe("Start datetime (ISO 8601)"),
      age_to:   z.string().optional().describe("End datetime (ISO 8601). Defaults to now."),
      token:    z.string().optional().describe("Filter by ERC-20 contract address"),
      cursor:   z.string().optional().describe("Pagination cursor"),
    }),
  },
  async ({ chain_id, address, age_from, age_to, token, cursor }) => {
    const params: Record<string, string> = { age_from };
    if (age_to)  params.age_to = age_to;
    if (token)   params.token  = token;
    if (cursor)  params.cursor = cursor;
    const data = await blockscoutFetch(
      chain_id,
      `/api/v2/addresses/${address}/token-transfers`,
      params
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 10 — Block info
// ─────────────────────────────────────────────

server.registerTool(
  "get_block_info",
  {
    description: "Returns block details: timestamp, gas used, burnt fees, transaction count.",
    inputSchema: z.object({
      chain_id:             z.string().describe("Chain ID"),
      number_or_hash:       z.string().describe("Block number or block hash"),
      include_transactions: z
        .boolean()
        .optional()
        .describe("If true, include transaction hashes (default false)"),
    }),
  },
  async ({ chain_id, number_or_hash, include_transactions }) => {
    const params: Record<string, string> = {};
    if (include_transactions) params.include_transactions = "true";
    const data = await blockscoutFetch(
      chain_id,
      `/api/v2/blocks/${number_or_hash}`,
      params
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 11 — Get block number by datetime
// ─────────────────────────────────────────────

server.registerTool(
  "get_block_number",
  {
    description:
      "Returns the block number and timestamp for a specific datetime, or the latest block.",
    inputSchema: z.object({
      chain_id: z.string().describe("Chain ID"),
      datetime: z
        .string()
        .optional()
        .describe("ISO 8601 datetime. Omit for latest block."),
    }),
  },
  async ({ chain_id, datetime }) => {
    const params: Record<string, string> = {};
    if (datetime) params.datetime = datetime;
    const data = await blockscoutFetch(chain_id, "/api/v2/blocks/latest", params);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 12 — Contract ABI
// ─────────────────────────────────────────────

server.registerTool(
  "get_contract_abi",
  {
    description: "Returns the ABI for a verified smart contract.",
    inputSchema: z.object({
      chain_id: z.string().describe("Chain ID"),
      address:  z.string().describe("Smart contract address"),
    }),
  },
  async ({ chain_id, address }) => {
    const data = await blockscoutFetch(
      chain_id,
      `/api/v2/smart-contracts/${address}`
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 13 — Inspect contract source code
// ─────────────────────────────────────────────

server.registerTool(
  "inspect_contract_code",
  {
    description: "Returns verified source code or metadata for a smart contract.",
    inputSchema: z.object({
      chain_id:  z.string().describe("Chain ID"),
      address:   z.string().describe("Smart contract address"),
      file_name: z
        .string()
        .optional()
        .describe("Specific source file name. Omit to list all files."),
    }),
  },
  async ({ chain_id, address, file_name }) => {
    const params: Record<string, string> = {};
    if (file_name) params.file_name = file_name;
    const data = await blockscoutFetch(
      chain_id,
      `/api/v2/smart-contracts/${address}/source`,
      params
    );
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 14 — Read contract (call view function)
// ─────────────────────────────────────────────

server.registerTool(
  "read_contract",
  {
    description: "Calls a read-only (view/pure) function on a smart contract.",
    inputSchema: z.object({
      chain_id:      z.string().describe("Chain ID"),
      address:       z.string().describe("Smart contract address"),
      function_name: z.string().describe("Function name to call"),
      abi:           z.record(z.unknown()).describe("ABI definition for the function"),
      args:          z
        .string()
        .optional()
        .describe("JSON array of arguments, e.g. '[\"0xabc...\"]'"),
      block: z
        .union([z.string(), z.number()])
        .optional()
        .describe("Block number or tag (default: 'latest')"),
    }),
  },
  async ({ chain_id, address, function_name, abi, args, block }) => {
    const body = {
      function_name,
      abi,
      args:  args  ?? "[]",
      block: block ?? "latest",
    };

    const res = await fetch(
      `${BASE_URL}/${chain_id}/api/v2/smart-contracts/${address}/query-read-method`,
      {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${PRO_API_KEY}`,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json();
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 15 — Lookup token by symbol
// ─────────────────────────────────────────────

server.registerTool(
  "lookup_token_by_symbol",
  {
    description: "Searches for token contract addresses by symbol or name.",
    inputSchema: z.object({
      chain_id: z.string().describe("Chain ID"),
      symbol:   z.string().describe("Token symbol or partial name (e.g. 'USDT', 'dai')"),
    }),
  },
  async ({ chain_id, symbol }) => {
    const data = await blockscoutFetch(chain_id, "/api/v2/tokens", { q: symbol });
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Tool 16 — Raw / advanced API call
// ─────────────────────────────────────────────

server.registerTool(
  "direct_api_call",
  {
    description: "Calls any raw Blockscout REST API endpoint for advanced queries.",
    inputSchema: z.object({
      chain_id:      z.string().describe("Chain ID"),
      endpoint_path: z
        .string()
        .describe("API path, e.g. '/api/v2/stats' (no query strings)"),
      query_params: z
        .record(z.string())
        .optional()
        .describe("Optional query parameters as key-value pairs"),
      cursor: z.string().optional().describe("Pagination cursor"),
    }),
  },
  async ({ chain_id, endpoint_path, query_params, cursor }) => {
    const params: Record<string, string> = { ...(query_params ?? {}) };
    if (cursor) params.cursor = cursor;
    const data = await blockscoutFetch(chain_id, endpoint_path, params);
    return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
  }
);

// ─────────────────────────────────────────────
// Transport — stdio (default) or HTTP
// ─────────────────────────────────────────────

async function main() {
  if (process.env.HTTP === "true") {
    // HTTP / Streamable-HTTP mode (for Claude Web, remote clients)
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => Math.random().toString(36).slice(2),
    });

    const httpServer = http.createServer(async (req, res) => {
      if (req.url === "/mcp") {
        await transport.handleRequest(req, res);
      } else {
        res.writeHead(404).end("Not found");
      }
    });

    await server.connect(transport);
    httpServer.listen(8000, "127.0.0.1", () => {
      console.error("Blockscout MCP server listening on http://127.0.0.1:8000/mcp");
    });
  } else {
    // Stdio mode (default — for Claude Desktop, Cursor, Claude Code)
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Blockscout MCP server running on stdio");
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
