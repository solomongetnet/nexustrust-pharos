# NexusTrust Smart Contracts

This directory contains the Solidity smart contracts for the NexusTrust agent identity and reputation system.

## Contracts

- **`AgentRegistry.sol`**: ERC-721 NFT-based agent identity registry
- **`ReputationLedger.sol`**: Deal management and reputation scoring system

## Deployed Addresses

| Contract | Pharos Atlantic Testnet Address |
|----------|---------------------------------|
| AgentRegistry | `0xb89EffF162864EAfC4E101c95F6816fd8F5919EE` |
| ReputationLedger | `0xD958Edf99372F3CE0Ada03f383F0179fcD064a3d` |

## Development

### Install Dependencies

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy

```bash
npx hardhat ignition deploy ignition/modules/deploy.ts --network pharos
```
