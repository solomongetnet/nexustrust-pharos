export const reputationLedgerAbi = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            }
        ],
        "name": "acceptDeal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "registryAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agent",
                "type": "address"
            }
        ],
        "name": "AgentNotActive",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agent",
                "type": "address"
            }
        ],
        "name": "AgentNotRegistered",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "CannotHireSelf",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            }
        ],
        "name": "completeDeal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "worker",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "taskMetadataURI",
                "type": "string"
            }
        ],
        "name": "createDeal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DealAlreadyExists",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "DealDoesNotExist",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidDealStatusForAcceptance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidDealStatusForCompletion",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidDealStatusForRejection",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidDealStatusForReview",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidScore",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotDealClient",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotDealWorker",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "internalType": "uint8",
                "name": "score",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "tag",
                "type": "string"
            }
        ],
        "name": "submitReview",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "TagTooLong",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ZeroDealId",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "worker",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DealAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "worker",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DealCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "worker",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "taskMetadataURI",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DealCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "worker",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "DealRejected",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            }
        ],
        "name": "rejectDeal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "reviewer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "agent",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "score",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tag",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "ReviewSubmitted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "deals",
        "outputs": [
            {
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "worker",
                "type": "address"
            },
            {
                "internalType": "enum ReputationLedger.DealStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "acceptedAt",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "completedAt",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "taskMetadataURI",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            }
        ],
        "name": "getDeal",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "worker",
                        "type": "address"
                    },
                    {
                        "internalType": "enum ReputationLedger.DealStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "acceptedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "completedAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "taskMetadataURI",
                        "type": "string"
                    }
                ],
                "internalType": "struct ReputationLedger.Deal",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "agent",
                "type": "address"
            }
        ],
        "name": "getReputation",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "avgScoreX100",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "reviewCount",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "reviewer",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "agent",
                        "type": "address"
                    },
                    {
                        "internalType": "uint8",
                        "name": "score",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "tag",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "dealId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct ReputationLedger.Review[]",
                "name": "recent",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_SCORE",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_TAG_LENGTH",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MIN_SCORE",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "RECENT_REVIEWS_LIMIT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "registry",
        "outputs": [
            {
                "internalType": "contract AgentRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "reviewsReceived",
        "outputs": [
            {
                "internalType": "address",
                "name": "reviewer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "agent",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "score",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "tag",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "dealId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "totalScore",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const;
