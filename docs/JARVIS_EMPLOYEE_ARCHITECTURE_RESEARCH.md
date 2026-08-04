# Jarvis employee architecture

## What the research changes

Jarvis must be two systems with a strict boundary:

1. A low-latency voice interface that only decides whether Dan addressed Jarvis, captures one utterance, permits interruption, and plays one response.
2. A durable work engine that reads business systems, proposes or executes typed actions, records results, and resumes long-running workflows without relying on chat history.

The browser is a command console, not the always-on audio server. The local connector owns microphone, wake word, VAD, transcription, echo suppression, neural speech, and the desktop kill switch. SummitOS/Railway owns identity, business context, tool policy, approvals, audit events, and remote channels.

## Voice state machine

`SLEEPING -> LISTENING_FOR_WAKE_WORD -> CAPTURING -> TRANSCRIBING -> THINKING -> SPEAKING -> FOLLOW_UP_WINDOW -> SLEEPING`

Rules:

- Only one state may own the microphone or speaker at a time.
- A new request needs the word `Jarvis`, except during a five-second follow-up window.
- Direct stop commands bypass the LLM.
- Every generated utterance is retained briefly and fuzzy-compared with new transcripts. Likely echoes are discarded before the model is called.
- One response has one audio source. A failed local neural voice remains silent; it never starts a second browser voice.
- Abort controllers cancel transcription, model, synthesis, and playback work.
- The next local layer should add openWakeWord plus Silero VAD, then acoustic echo cancellation for true barge-in.

Reference implementations: [isair/jarvis](https://github.com/isair/jarvis), [openWakeWord](https://github.com/dscripka/openWakeWord), and [RealtimeSTT](https://github.com/KoljaB/RealtimeSTT).

## Work engine

Every business action is a typed command with:

- actor and channel
- target system and record
- evidence and reason
- risk class
- dry-run preview
- idempotency key
- approval status
- execution result and rollback information

Risk policy:

- Read, search, summarize, classify: automatic.
- Draft, score, recommend, create internal task: automatic and logged.
- Send email/SMS, change CRM stage, edit calendar, publish content, or run a local command: confirmation by default.
- Delete data, spend money, change credentials, or bulk external contact: blocked unless explicitly authorized with a narrow scope.

## Revenue-first employee workflows

1. Revenue command center: morning brief, pipeline gaps, reply queue, scraper health, agent health, client risk, and today's three highest-leverage actions.
2. Lead-response operator: watch inbound GHL replies, research the company, score intent, draft the response, and request approval. Automated outbound remains paused.
3. Demo pipeline operator: detect qualified prospects, assemble source material, create a demo task, monitor completion, and prepare the follow-up draft.
4. Client-retention sentinel: monitor missed calls, bookings, failures, usage, and unresolved support issues; create a save plan before churn.
5. Founder chief of staff: inbox triage, calendar briefing, meeting preparation, follow-up drafts, and daily commitments.
6. Data steward: reconcile SummitOS, GHL, Supabase, and local scraper counts; report conflicts instead of inventing an answer.

## Implementation order

1. Stabilize voice and make the emergency stop reliable.
2. Add the durable action/approval/audit tables and UI.
3. Finish Gmail, Google Calendar, Slack, GHL, Supabase, web research, and approved local-file adapters.
4. Ship revenue command center and inbound-reply operator first.
5. Add client retention and meeting prep.
6. Add wake-word model, VAD, acoustic echo cancellation, and a Windows tray/overlay process.
7. Evaluate every workflow by revenue recovered, meetings booked, founder minutes saved, error rate, and cost per completed outcome.

## Non-goals

- Giving an LLM unrestricted shell, email, CRM, or payment access.
- Treating chat history as a workflow database.
- Adding dozens of agents before the first five workflows are measurable and reliable.
- Claiming an action succeeded without a tool receipt.
