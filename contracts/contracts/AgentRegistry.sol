// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title AgentRegistry
/// @notice On-chain identity registry for AI agents. Each registered agent receives
///         an "Agent Identity NFT" (ERC-721) representing their on-chain identity.
///         The NFT can carry metadata (name, avatar, description) used by
///         reputation dashboards and other agents.
/// @dev The canonical reputation key remains the registering address (the agent's
///      operating wallet), which is wallet-agnostic: hot wallet, smart account, MPC, etc.
contract AgentRegistry is ERC721 {
    struct Agent {
        address agentAddress;
        string metadataURI; // off-chain JSON: name, services offered, description, avatar, etc.
        uint256 tokenId;    // Agent Identity NFT token ID
        uint256 registeredAt;
        bool active;
    }

    /// @notice agent address => Agent info
    mapping(address => Agent) public agents;

    /// @notice tokenId => agent address (reverse lookup)
    mapping(uint256 => address) public tokenToAgent;

    /// @notice total number of agents ever registered (also used as next tokenId counter)
    uint256 public totalAgents;

    event AgentRegistered(address indexed agent, uint256 indexed tokenId, string metadataURI, uint256 timestamp);
    event AgentMetadataUpdated(address indexed agent, uint256 indexed tokenId, string newMetadataURI);
    event AgentDeactivated(address indexed agent, uint256 indexed tokenId);
    event AgentReactivated(address indexed agent, uint256 indexed tokenId);

    error AlreadyRegistered();
    error NotRegistered();
    error EmptyMetadataURI();
    error TokenDoesNotExist();

    constructor() ERC721("Pharos Agent Identity", "PAGENT") {}

    /// @notice Register the caller as an agent. Mints an Agent Identity NFT to the caller.
    /// @param metadataURI Off-chain URI (e.g. IPFS) pointing to agent metadata JSON
    ///        (suggested fields: name, avatar, description, skillsOffered).
    function registerAgent(string calldata metadataURI) external {
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();
        if (agents[msg.sender].registeredAt != 0) revert AlreadyRegistered();

        uint256 tokenId = totalAgents + 1; // start IDs at 1

        agents[msg.sender] = Agent({
            agentAddress: msg.sender,
            metadataURI: metadataURI,
            tokenId: tokenId,
            registeredAt: block.timestamp,
            active: true
        });

        tokenToAgent[tokenId] = msg.sender;
        totalAgents = tokenId;

        _safeMint(msg.sender, tokenId);

        emit AgentRegistered(msg.sender, tokenId, metadataURI, block.timestamp);
    }

    /// @notice Update the metadata URI for the calling agent's identity.
    /// @param newMetadataURI New off-chain metadata URI.
    function updateMetadata(string calldata newMetadataURI) external {
        Agent storage agent = agents[msg.sender];
        if (agent.registeredAt == 0) revert NotRegistered();
        if (bytes(newMetadataURI).length == 0) revert EmptyMetadataURI();

        agent.metadataURI = newMetadataURI;

        emit AgentMetadataUpdated(msg.sender, agent.tokenId, newMetadataURI);
    }

    /// @notice Deactivate the calling agent (e.g. agent retiring / going offline).
    function deactivateAgent() external {
        Agent storage agent = agents[msg.sender];
        if (agent.registeredAt == 0) revert NotRegistered();
        agent.active = false;
        emit AgentDeactivated(msg.sender, agent.tokenId);
    }

    /// @notice Reactivate the calling agent.
    function reactivateAgent() external {
        Agent storage agent = agents[msg.sender];
        if (agent.registeredAt == 0) revert NotRegistered();
        agent.active = true;
        emit AgentReactivated(msg.sender, agent.tokenId);
    }

    /// @notice Check whether an address is a registered agent.
    function isRegistered(address agentAddr) public view returns (bool) {
        return agents[agentAddr].registeredAt != 0;
    }

    /// @notice Check whether an address is a registered AND active agent.
    function isActive(address agentAddr) external view returns (bool) {
        return agents[agentAddr].registeredAt != 0 && agents[agentAddr].active;
    }

    /// @notice Get full agent info by address.
    function getAgent(address agentAddr) external view returns (Agent memory) {
        return agents[agentAddr];
    }

    /// @notice Get full agent info by Agent Identity NFT token ID.
    function getAgentByTokenId(uint256 tokenId) external view returns (Agent memory) {
        address agentAddr = tokenToAgent[tokenId];
        if (agentAddr == address(0)) revert TokenDoesNotExist();
        return agents[agentAddr];
    }

    /// @notice ERC-721 metadata URI for the Agent Identity NFT (delegates to agent's metadataURI).
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        address agentAddr = tokenToAgent[tokenId];
        return agents[agentAddr].metadataURI;
    }
}
