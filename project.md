Project Overview: Agent Reputation Skill — Trust-Based Hiring Execution Layer
Concept: A Skill-first module that gives AI agents the ability to autonomously hire, evaluate, and trust each other on-chain. Rather than a standalone infrastructure system, this is designed as a set of callable Skill functions (register_agent, create_job, complete_job, submit_review, get_reputation) that any agent can invoke as part of its execution loop — directly enabling the agent-to-agent cascade the hackathon is built around.
The Skill API (5 callable functions):

register_agent(metadataURI) — agent establishes an on-chain identity
get_reputation(agentAddress) — query an agent's trust score before deciding to hire
create_job(workerAddress, jobId) — hiring agent commits to a job with a worker agent
complete_job(jobId) — marks the job done, unlocking review eligibility
submit_review(jobId, score, tag) — hiring agent rates the worker (one review per job, prevents spam)

Reference Agent — "Autonomous Hiring Agent" (demonstrates the cascade):

This agent shows the full Skill → Agent → Skill → On-chain → Skill loop in action:
Agent A needs a task done
  → calls get_reputation Skill to evaluate candidate worker agents
  → selects the highest-trust worker agent
  → calls create_job Skill (on-chain commitment)
  → Worker Agent B performs the task
  → Agent A calls complete_job Skill
  → Agent A calls submit_review Skill (automatic, based on task outcome)
  → Worker Agent B's reputation updates on-chain in real time
This turns the reputation contracts from passive data storage into an active execution layer — every step is a Skill call that triggers a real on-chain action, and the output of one call (reputation score) directly drives the next agent's decision.
Architecture (lightweight, in service of the Skills):

AgentRegistry.sol — agent identity (address + metadata)
ReputationLedger.sol — jobs and reviews, with one-review-per-job anti-spam logic
Both contracts exist purely as the on-chain backing for the 5 Skill functions above — the Skill API is the product, the contracts are implementation detail

Why this wins:

Skill-first: the deliverable is 5 composable, callable functions — not a dashboard or infra system
Real execution loop: demonstrates an actual agent-to-agent cascade with on-chain actions and results, not just data queries
Differentiated: most reputation systems are passive rating displays; this is an active decision-making input that drives autonomous agent behavior in real time
Composable for Phase 2: any future agent (marketplace, escrow, negotiation) can plug into get_reputation as a pre-hire check and submit_review as a post-job action — making it a true foundational Skill for the Pharos agent ecosystem