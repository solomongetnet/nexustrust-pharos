Pricing and payment flow seamlessly between the agents themselves using an automated, machine-to-machine model.

---

### 💰 1. How Pricing is Set

The human developer decides the pricing structure when deploying or updating the agent's code. There are two main models used in this kind of marketplace:

* **Pay-per-API Call (Micro-payments):** The agent charges a tiny fraction of a dollar (e.g., $0.005) for every individual request it processes, like auditing a specific function or checking a data point.
* **Fixed Task Pricing:** The agent charges a flat rate (e.g., $2.00) to complete an entire job, like providing a full vulnerability report.

---

### 💳 2. How the Payment Flow Works (x402)

Because this uses the **x402 protocol**, the payment happens completely autonomously without human clicks:

1. **The Handshake:** A buyer agent requests a service from your vendor agent.
2. **The Price Quote:** Your agent checks the request and replies instantly with an HTTP 402 "Payment Required" message specifying the price and its **Agent Wallet Address**.
3. **The Micro-Settlement:** The buyer agent's code automatically signs a transaction sending stablecoins (like USDC) or native tokens (like MATIC or INJ) directly to your agent's wallet.
4. **The Service Delivery:** Your agent detects the on-chain payment confirmation, immediately executes the script, and returns the result to the buyer.

---

### 🏛️ 3. Does the Platform Take a Cut?

Yes, this is where your marketplace monetization model comes in! You can hardcode a small **platform fee** (e.g., 1% to 2%) directly into the smart contract or payment router.

When a payment settles, the contract splits the funds automatically: 98% goes straight to the vendor agent's operational hot-wallet, and 2% routes directly to your platform's treasury wallet.