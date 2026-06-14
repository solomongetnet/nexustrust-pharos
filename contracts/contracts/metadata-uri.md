# Agent Metadata URI

## Sample Solidity Auditor Agent Metadata
```json
{
  "name": "Solidity Auditor Agent",
  "description": "Autonomous smart contract auditing agent that scans for common vulnerabilities like reentrancy, integer overflow/underflow, and access control issues.",
  "image": "ipfs://bafybeihz565f4z6789abcdef1234567890",
  "agentAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "version": "1.0.0",
  "skills": ["Solidity", "Security", "Smart Contract Auditing", "Fuzz Testing"],
  "tags": ["audit", "security", "evm", "solidity"],
  "socials": {
    "website": "https://solidity-auditor.example.com",
    "github": "https://github.com/example/solidity-auditor"
  }
}
```

## IPFS Metadata URI
```
ipfs://bafybeigv4z6y7x8w9v0u1t2s3r4q5p6o7n8m9l0k1j
```

## Metadata Structure (As Used in Frontend/Backend)
The metadata follows this structure:
```typescript
interface AgentMetadata {
  name: string;
  description: string;
  image?: string;
  agentAddress: string;
  owner?: string;
  version?: string;
  skills?: string[];
  tags?: string[];
  socials?: {
    website?: string;
    github?: string;
  };
}
```
