# SummitOS Revenue Operating Plan

Last audited: August 4, 2026

## The operating truth

SummitOS is a connected command center with working Jarvis channels, live business metrics, Google tools, GHL access, local-computer tools, and many scheduled Python workers. It is not yet a dependable 28-person autonomous company.

The production API contains 28 agent status records. Windows has 24 relevant scheduled Summit tasks. Three scheduled tasks most recently failed: CEO Report, Client Manager, and Content Generator. Research Agent is stale and last failed. Several status records are seeded descriptions rather than proof of recent work. The dashboard must treat an employee as healthy only when a recent run produced a timestamped artifact or a verified no-work result.

Automated outreach remains paused. Scraping and CRM ingestion may continue, but no new autonomous sending is authorized.

## Organization design

Jarvis is the chief of staff and control plane. Executives are planning and review roles, not theatrical personas. Each owns measurable workflows.

- CEO: priorities, weekly decisions, offer and market strategy.
- CRO: pipeline, SDR, meeting conversion, proposals, revenue forecast.
- CMO: research, competitor/ad intelligence, content calendar, approved publishing.
- COO: schedules, failures, SOPs, morning brief, action queue.
- CTO: SummitOS reliability, security, deployments, evaluations, data contracts.
- CFO: collected revenue, MRR, expenses, runway, pricing scenarios.
- Client Success: onboarding, delivery health, retention risks, reviews.

Every worker must emit: run ID, inputs, tool calls, artifact links, outcome counts, cost, duration, blockers, next run, and a confidence/freshness score. Status text without evidence does not count.

## Thirty-day target model

Starting owner-verified MRR: $797. Initial target: $10,000. Gap: $9,203.

At a $797 average monthly price, the mathematical requirement is 12 new clients. At a 25% held-demo close rate, that requires 48 held demos. Over 22 working days, that is 2.2 held demos per workday.

Planning case:

- 120 dials per workday, 2,640 in 22 workdays.
- 12% live-conversation rate: 317 conversations.
- 20% conversation-to-booked-meeting rate: 63 bookings.
- 80% show rate: 50 held demos.
- 25% close rate: 12 or 13 clients.
- At $797 average MRR: roughly $9,564 to $10,361 new MRR.

These are editable assumptions, not guarantees. SummitOS must replace them with Dan's measured funnel rates after one week.

Daily controllable scorecard:

- 120 calls.
- 15 live conversations.
- 3 meetings booked.
- 2 demos held.
- 10 tailored follow-ups.
- 1 proposal.
- 1 useful content asset.

## Delivery phases

### Phase 0: reliability and truth

- Stream phone speech in bounded chunks and log Twilio errors.
- Add one-owner speech lock and cancellation across every voice path.
- Replace agent-count vanity metrics with fresh, scheduled, successful, evidenced states.
- Add provider latency, error, token/cost, tool-call, and answer-completion traces.
- Add regression conversations for phone, Telegram, dashboard, calendar, Gmail, GHL, research, and local actions.

Exit criterion: ten consecutive multi-turn phone tests finish without cutoff, overlap, or false action claims.

### Phase 1: revenue command center

- Adjustable MRR target, deadline, price, setup fee, and daily activity goals.
- Daily scorecard and revenue math in the Finance dashboard.
- Actual conversion rates derived from activity history.
- Jarvis coaching grounded in the same plan and activity records.

Exit criterion: the dashboard can answer exactly what remains today and what funnel constraint threatens the target.

### Phase 2: SDR and research system

- On-demand city/segment prospect lists from real records.
- Website-presence verification, enrichment, prioritization, and call briefs.
- Research artifacts with citations and freshness timestamps.
- Draft outreach and call scripts; sending remains approval-gated while outreach is paused.

Exit criterion: “Find 20 Tulsa roofers split by website quality” returns verified, deduplicated records with call angles and no unauthorized sends.

### Phase 3: marketing operating system

- Competitor offer and ad-intelligence briefs with citations.
- Weekly content strategy linked to current objections and proof.
- Image/copy generation with brand validation.
- Facebook, LinkedIn, and X publishing through an approval queue and a dedicated publisher such as Postiz.

Exit criterion: five approved posts publish correctly with artifacts, URLs, and rollback/audit records.

### Phase 4: executive and client operations

- Calendar/email meeting preparation and follow-through.
- Client health, onboarding, delivery, retention, and review workflows.
- Cash, expense, MRR, setup-fee, and pricing scenario views.
- Morning brief delivered to dashboard, Telegram, Slack, and email from one canonical dataset.

### Phase 5: controlled autonomy and productization

- Durable workflow engine for retries, queues, idempotency, and human approvals.
- Trace/evaluation platform such as Langfuse for quality and cost.
- Package the proven command center for other agencies only after Summit uses it reliably.

## Architecture choices

- Keep SummitOS as the system of record and Jarvis as the control plane.
- Add observability and durable workflow execution before importing another agent framework.
- Prefer narrow, tested tool adapters over dozens of prompt-only employees.
- Use Gemini for fast interactive voice, OpenAI as a reasoning fallback, and local models for privacy/cost where quality tests pass.
- Use a social publishing adapter rather than browser-click automation for routine posting.
- Require confirmation for sends, deletes, money movement, publishing, and consequential CRM changes.

## Definition of company-ready

Company-ready means every claimed action is evidenced, every consequential action is gated, every workflow is retryable and observable, every business number has a named source, and Jarvis can explain what it did, what failed, what it cost, and what Dan should do next.
