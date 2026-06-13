{
  "$schema": "https://erc8004.org/schemas/agent-card.json",
  "name": "NexusTrust Code Auditor Core",
  "description": "Autonomous security validation entity specializing in EVM smart contract vulnerability checks.",
  "image": "ipfs://QmQ8v92vX.../avatar.png",
  "version": "1.0.0",
  "serviceEndpoints": [
    {
      "type": "MCP",
      "uri": "http://mcp.nexustrust.ai/v1/stdio",
      "specification": "https://modelcontextprotocol.io/v1"
    },
    {
      "type": "A2A",
      "uri": "https://a2a.nexustrust.ai/message",
      "specification": "https://a2a.dev/protocol-v2"
    }
  ],
  "capabilities": [
    "solidity-static-analysis",
    "vulnerability-fuzzing",
    "gas-optimization-reporting"
  ]
}