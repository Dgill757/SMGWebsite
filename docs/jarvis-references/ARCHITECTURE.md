# SummitOS JARVIS Architecture Decision

## Outcome

Build JARVIS as a hybrid system with one identity and memory layer across several interchangeable channels and models.

## Runtime boundaries

1. **SummitOS cloud control plane (Railway)**
   - Always-on authenticated chat, reporting, Telegram, and phone webhooks.
   - Provider-neutral model router.
   - No unrestricted access to Dan's computer.

2. **Windows local connector**
   - Outbound authenticated connection to the control plane.
   - Allowlisted read roots and named process/build tools.
   - All writes, executions, deployments, sends, and destructive actions require approval.
   - A visible pause switch cuts off tool execution immediately.

3. **Voice and visual shell**
   - Reactive WebGL particle sphere with idle, listening, thinking, speaking, approval, limited, and error states.
   - Streaming STT, end-of-turn detection, streaming response, and interruptible TTS.
   - Browser implementation first; packaged Windows overlay after the loop is verified.

4. **Memory**
   - `C:\Users\DanGi\SummitVault` Markdown is the durable source of truth.
   - Core identity/rules are always loaded; business and project notes are retrieved by relevance.
   - New memories are proposed with source and timestamp. Tool actions append to the audit log.

## Model policy

- Route by availability, capability, privacy, latency, and cost.
- Never advertise "free forever" or "never out of tokens." Upstream quotas and terms can change.
- Complex business decisions use the strongest configured cloud model.
- Routine classification and summarization use a lower-cost model.
- Offline Ollama mode handles basic chat, retrieval, notes, and diagnostics only.
- Provider errors trigger cooldown and failover. Authentication errors are surfaced instead of retried endlessly.

## Current implementation sequence

1. Router and provider health.
2. Vault structure and retrieval.
3. Particle orb plus browser voice.
4. Local connector with narrow permissions.
5. Telegram.
6. Twilio phone path with request verification, caller allowlist, and PIN.
7. Observability, evaluations, and proactive alerts.
