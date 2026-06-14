export const reputationLedgerAbi = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "jobId",
                "type": "bytes32"
            }
        ],
        "name": "acceptJob",
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
                "name": "jobId",
                "type": "bytes32"
            }
        ],
        "name": "completeJob",
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
                "name": "jobId",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "taskMetadataURI",
                "type": "string"
            }
        ],
        "name": "createJob",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "InvalidJobStatusForAcceptance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidJobStatusForCompletion",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidJobStatusForRejection",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidJobStatusForReview",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidScore",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "JobAlreadyExists",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "JobDoesNotExist",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotJobClient",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotJobWorker",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "jobId",
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
        "name": "ZeroJobId",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "jobId",
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
        "name": "JobAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "jobId",
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
        "name": "JobCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "jobId",
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
        "name": "JobCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "jobId",
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
        "name": "JobRejected",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "jobId",
                "type": "bytes32"
            }
        ],
        "name": "rejectJob",
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
                "name": "jobId",
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
                "name": "jobId",
                "type": "bytes32"
            }
        ],
        "name": "getJob",
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
                        "internalType": "enum ReputationLedger.JobStatus",
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
                "internalType": "struct ReputationLedger.Job",
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
                        "name": "jobId",
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
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "jobs",
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
                "internalType": "enum ReputationLedger.JobStatus",
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
                "name": "jobId",
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
