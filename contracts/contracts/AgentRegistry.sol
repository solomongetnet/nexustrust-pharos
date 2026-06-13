// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title AgentRegistry
/// @notice On-chain identity registry for AI agents. Each registered agent receives
///         an "Agent Identity NFT" (ERC-721) representing their on-chain identity.
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
    error NotAuthorized();

    constructor() ERC721("Pharos Agent Identity", "PAGENT") {}

    /// @notice Modifier to ensure caller is either the agent itself OR the current NFT owner
    modifier onlyAgentOrOwner(address agentAddr) {
        Agent memory agent = agents[agentAddr];
        if (agent.registeredAt == 0) revert NotRegistered();
        
        // Check if sender is the agent or the current owner of the agent's NFT
        if (msg.sender != agentAddr && msg.sender != ownerOf(agent.tokenId)) {
            revert NotAuthorized();
        }
        _;
    }

    /// @notice Register an agent. Can be called by the agent itself or an agent owner.
    /// @param agentAddress The operating wallet address of the AI agent.
    /// @param metadataURI Off-chain URI (e.g. IPFS) pointing to agent metadata JSON.
    function registerAgent(address agentAddress, string calldata metadataURI) external {
        if (agentAddress == address(0)) revert NotAuthorized();
        if (bytes(metadataURI).length == 0) revert EmptyMetadataURI();
        if (agents[agentAddress].registeredAt != 0) revert AlreadyRegistered();

        uint256 tokenId = totalAgents + 1; // start IDs at 1

        agents[agentAddress] = Agent({
            agentAddress: agentAddress,
            metadataURI: metadataURI,
            tokenId: tokenId,
            registeredAt: block.timestamp,
            active: true
        });

        tokenToAgent[tokenId] = agentAddress;
        totalAgents = tokenId;

        // Minting the NFT to the agent address. 
        // Note: If you want the human owner to hold the NFT, change 'agentAddress' to 'msg.sender'.
        _safeMint(agentAddress, tokenId);

        emit AgentRegistered(agentAddress, tokenId, metadataURI, block.timestamp);
    }

    /// @notice Update the metadata URI for the agent's identity.
    /// @param agentAddress The operating wallet address of the agent.
    /// @param newMetadataURI New off-chain metadata URI.
    function updateMetadata(address agentAddress, string calldata newMetadataURI) external onlyAgentOrOwner(agentAddress) {
        if (bytes(newMetadataURI).length == 0) revert EmptyMetadataURI();

        agents[agentAddress].metadataURI = newMetadataURI;

        emit AgentMetadataUpdated(agentAddress, agents[agentAddress].tokenId, newMetadataURI);
    }

    /// @notice Deactivate the agent (e.g. agent retiring / going offline).
    /// @param agentAddress The operating wallet address of the agent.
    function deactivateAgent(address agentAddress) external onlyAgentOrOwner(agentAddress) {
        agents[agentAddress].active = false;
        emit AgentDeactivated(agentAddress, agents[agentAddress].tokenId);
    }

    /// @notice Reactivate the agent.
    /// @param agentAddress The operating wallet address of the agent.
    function reactivateAgent(address agentAddress) external onlyAgentOrOwner(agentAddress) {
        agents[agentAddress].active = true;
        emit AgentReactivated(agentAddress, agents[agentAddress].tokenId);
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

    /// @notice ERC-721 metadata URI for the Agent Identity NFT.
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        address agentAddr = tokenToAgent[tokenId];
        return agents[agentAddr].metadataURI;
    }
}