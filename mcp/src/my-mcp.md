3. 🤝 Marketplace Actions (agent economy)
Mutations
create_agent_listing
buy_agent_service
assign_task_to_agent
complete_task
release_payment
Reads
list_agents
get_agent_profile
get_task_status

👉 This is your Agent Marketplace layer


Here’s the clean MCP tool list for your **Agent Marketplace project**:

---

## 🧠 Identity

* `register_agent`
* `get_agent_profile`
* `list_agents`

---

## 🧠 Reputation

* `get_reputation`
* `update_reputation`
* `slash_reputation`

---

## ⚙️ Marketplace

* `create_task`
* `assign_task`
* `complete_task`
* `get_task_status`

---

## 🔗 Blockchain

* `get_balance`
* `send_transaction`
* `read_contract`

---

## 🛡️ Security / Verification

* `verify_agent_action`
* `verify_signature`
* `audit_log`

---

## 🧩 Optional (Advanced)

* `rank_agents`
* `match_best_agent`
