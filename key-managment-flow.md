Here is the step-by-step architecture of how your marketplace tracks and verifies agent identities using API Keys, explained purely as a system workflow.
## The Database Structure (What you store)
Your infrastructure database keeps a secure profile for each agent containing three connected items: [1, 2] 

* The Identifier (Web2 Auth): A unique, secret API Key (e.g., sk_pharos_xyz...).
* The Public Identity (Web3 Address): The agent's public wallet address.
* The Secret Vault (Encrypted Keystore): The password-encrypted private key JSON string. [3] 

------------------------------
## The Complete End-to-End Workflow## Step 1: Agent Registration (One-Time)

   1. A developer creates a new agent profile on your marketplace platform.
   2. Your platform backend automatically generates a secure, randomized API Key.
   3. Your platform generates a fresh Web3 wallet for the agent, encrypts the private key using a master password, and saves it to the database.
   4. The developer copies the API Key and embeds it securely into their AI agent's local environment config. [4, 5, 6, 7, 8] 

## Step 2: The Agent Sends a Request

   1. The AI Agent wants to execute an on-chain action (like updating its reputation score).
   2. The agent packages its requested action data into an HTTP request.
   3. The agent puts its secret API Key directly into the request header (the "handshake").
   4. The agent sends this package over the network to your platform's backend endpoint. [9, 10, 11, 12] 

## Step 3: Backend Verification & Authentication

   1. Your platform backend receives the network packet.
   2. It looks at the request header and extracts the API Key. [13] 
   3. The backend queries your database: "Which agent profile owns this specific API Key?" [14] 
   4. The Validation Gate:
   * If the key doesn't exist, the backend rejects the request immediately (Unauthorized).
      * If the key matches, the database returns that specific agent's public_address and encrypted_keystore. Your backend now knows exactly who is calling with 100% certainty. [15, 16, 17, 18] 
   
## Step 4: Secure Memory Execution & Signing

   1. Now that the agent's identity is verified, your backend pulls the encrypted keystore into temporary memory (RAM).
   2. The backend decrypts the keystore using the internal platform password to temporarily unlock the agent's signing power.
   3. The backend uses that temporary wallet to create the EIP-712 cryptographic signature matching the agent's action data.
   4. The raw key object is instantly wiped and cleared from the backend server's RAM. [19, 20] 

## Step 5: Gasless Blockchain Settlement

   1. Your backend forwards the action data and the fresh EIP-712 signature to your Platform Relayer wallet.
   2. The platform relayer wraps everything in a blockchain transaction envelope, pays the gas fee with its own funds, and broadcasts it to the network.
   3. The smart contract validates that the signature matches the agent's public address and executes the code. [21, 22, 23, 24, 25] 

------------------------------
## Why this Architecture wins Hackathons

* Web2 Ease of Use: Developers don't have to write complex cryptographic wallet-handling code inside their AI agents. They just pass a standard API key, making your SDK incredibly simple to use. [26] 
* Web3 Security Sovereignty: The agent's private key never travels across the public internet. It remains safely encrypted at rest in your database and is only active for milliseconds inside isolated backend RAM to sign the EIP-712 transaction. [27] 

------------------------------
Would you like to design the system architecture diagram text (like a flowchart) to include in your Pharos Hackathon pitch deck to visually present this to the judges?

[1] [https://www.edureka.co](https://www.edureka.co/blog/agent-systems-in-ai/)
[2] [https://www.linkedin.com](https://www.linkedin.com/pulse/how-connect-openai-agent-builder-your-internal-databases-rnwfe)
[3] [https://blog.thirdweb.com](https://blog.thirdweb.com/thirdweb-auth/)
[4] [https://www.propelauth.com](https://www.propelauth.com/api-key-authentication)
[5] [https://mailchimp.com](https://mailchimp.com/resources/api-keys/)
[6] [https://orkes.io](https://orkes.io/content/developer-guides/api-gateway)
[7] [https://developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
[8] [https://zuplo.com](https://zuplo.com/docs/articles/step-3-add-api-key-auth)
[9] [https://innovationlab.fetch.ai](https://innovationlab.fetch.ai/resources/docs/examples/on-chain-examples/on-chain-agents)
[10] [https://arxiv.org](https://arxiv.org/html/2602.14219v1)
[11] [https://github.com](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/64)
[12] [https://developers.wino.fr](https://developers.wino.fr/docs/guides/authentication/)
[13] [https://zuplo.com](https://zuplo.com/learning-center/how-to-implement-api-key-authentication)
[14] [https://github.com](https://github.com/google/adk-python/discussions/2795)
[15] [https://www.milanjovanovic.tech](https://www.milanjovanovic.tech/blog/how-to-implement-api-key-authentication-in-aspnet-core)
[16] [https://apidog.com](https://apidog.com/blog/pass-x-api-key-header/)
[17] [https://www.bluehost.com](https://www.bluehost.com/blog/validation-token/)
[18] [https://javascript.plainenglish.io](https://javascript.plainenglish.io/how-we-integrated-forgerock-with-angular-real-lessons-from-adding-a-modern-spa-to-legacy-apps-38c607b76678)
[19] [https://marketplace.gohighlevel.com](https://marketplace.gohighlevel.com/docs/other/user-context-marketplace-apps/)
[20] [https://lablab.ai](https://lablab.ai/ai-tutorials/building-ai-trading-agents-with-on-chain-identity)
[21] [https://www.ethereum-blockchain-developer.com](https://www.ethereum-blockchain-developer.com/advanced-mini-courses/gasless-onboarding-erc2612-erc4337-eip7702/04-combining-2612-712-signatures)
[22] [https://docs.cdp.coinbase.com](https://docs.cdp.coinbase.com/paymaster/introduction/welcome)
[23] [https://pythia-company.medium.com](https://pythia-company.medium.com/how-to-make-prediction-markets-anonymous-8dc27cd2712c)
[24] [https://dl.acm.org](https://dl.acm.org/doi/10.1145/3700838.3700868)
[25] [https://medium.com](https://medium.com/@omoridoh111/eip-2612-the-permit-revolution-that-simplified-ethereum-transactions-3407d0ee7869)
[26] [https://nickchapsas.com](https://nickchapsas.com/adding-api-key-auth-in-dotnet/)
[27] [https://www.npmjs.com](https://www.npmjs.com/package/@agentauth/core)
