# JARVIS Reference Library

This folder records what SummitOS should learn from external projects without copying their code or inheriting their security assumptions. Repository code is not vendored here unless a specific component passes license, security, maintenance, and fit review.

## Adopt now

- **OpenLive**: streaming voice loop, barge-in, visible permission relay, mini overlay, local audio processing, and ACP integration patterns.
- **Voicebox**: local Whisper/Kokoro service boundary, explicit speaking indicator, REST/MCP interface, and Windows packaging patterns.
- **OmniRoute**: provider adapters, health-based failover, cooldown/circuit breakers, and cost visibility. We implement a smaller audited router rather than trusting every provider integration.
- **OpenJarvis**: local-first evaluation, cost/latency measurement, and learning-loop concepts.
- **vierisid/jarvis**: authenticated outbound sidecars, authority engine, approvals, audit trail, and emergency pause. Architectural reference only because its license is source-available.
- **isair/jarvis**: wake word, rolling conversation, echo handling, redaction, and selective MCP tool loading. Architectural reference only; commercial use requires license review.

## Study later

- **Hermes Agent**: provider/model configuration, messaging gateway, compression, and usage reporting. It is a possible local runtime, not the SummitOS control plane.
- **Agent Reach**: low-cost public web and social research capabilities. Some sources require user cookies and therefore need isolated credentials and strict read-only use.
- **Composio**: managed OAuth and broad tool catalog. Useful only when it replaces enough integration work to justify dependency and cost.
- **Firecrawl**: retain for web extraction already used by SummitOS.
- **CrewAI**: event-driven flow ideas. Do not add a multi-agent framework until a single agent plus deterministic workflows is insufficient.
- **Dify**: model/workflow/RAG administration ideas. The full platform duplicates too much of SummitOS for the current solo-founder use case.

## Do not use as a foundation

- **Microsoft JARVIS/HuggingGPT**: useful planning and model-selection paper architecture, but old and heavyweight for this desktop operator.
- **sukeesh/jarvis**: useful plugin-registry inspiration, but it is an older command-line assistant rather than a modern voice agent.
- **North Mini Code local deployment**: the model is too large for the current 13 GB RAM machine at practical quantization. A 3B to 4B Ollama model is the realistic offline tier.

## Source links

- https://github.com/open-jarvis/OpenJarvis
- https://github.com/katipally/openlive
- https://github.com/jamiepine/voicebox
- https://github.com/diegosouzapw/OmniRoute
- https://github.com/NousResearch/hermes-agent
- https://github.com/wonderwhy-er/DesktopCommanderMCP
- https://github.com/panniantong/agent-reach
- https://github.com/microsoft/JARVIS
- https://github.com/sukeesh/jarvis
- https://github.com/vierisid/jarvis
- https://github.com/isair/jarvis
- https://github.com/langgenius/dify
- https://github.com/crewAIInc/crewAI
- https://github.com/ComposioHQ/composio
- https://github.com/firecrawl/firecrawl

