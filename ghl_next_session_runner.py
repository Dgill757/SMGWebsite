"""
Summit Voice AI — GHL Next Session Runner
Run this in the next Claude Code session with GHL MCP connected.
GHL MCP is now configured in ~/.claude/mcp.json — restart Claude Code to activate it.

This script documents the EXACT commands to tell Claude Code to run via GHL MCP.
Copy-paste each section into a new Claude Code session as prompts.
"""

# ═══════════════════════════════════════════════════════════════════
# PROMPT 1: CREATE 3 PIPELINES (paste into Claude Code with GHL MCP)
# ═══════════════════════════════════════════════════════════════════

CREATE_PIPELINES_PROMPT = """
Using GHL MCP, create these 3 pipelines in location u1lprxdJy1vmuaHEVJRM:

PIPELINE 1: SVA Cold Outreach Pipeline
Stages (in order): Contacted, Replied, Interested, Audit Requested, Demo Sent,
Meeting Booked, Meeting Held, Proposal Sent, Won, Lost / Nurture

PIPELINE 2: SVA Demo Machine
Stages (in order): Build Requested, Building, Demo Live, Viewed, Responded

PIPELINE 3: SVA Clients
Stages (in order): Onboarding, Active, At Risk, Churned

After creating each pipeline, confirm the pipeline ID and all stage IDs.
"""

# ═══════════════════════════════════════════════════════════════════
# PROMPT 2: CREATE 14 WORKFLOWS (paste into Claude Code with GHL MCP)
# ═══════════════════════════════════════════════════════════════════

WORKFLOW_PROMPTS = {
    "SVA Reply Router": """
Using GHL MCP or Playwright GHL workflow builder, create workflow "SVA Reply Router":
Trigger: Inbound Message Received (email or SMS). Allow re-entry: Yes.
Action 1: AI classify message body as positive/negative/nurture.
If positive: Add tag "Replied - Hot Lead", Add tag "replied positive",
  Move to pipeline SVA Cold Outreach Pipeline stage Interested,
  Send internal notification to Dan about hot lead.
If negative: Add tag "not interested", Send graceful exit SMS.
If nurture: Add tag "nurture reply", Send internal notification to Dan.
Publish workflow.
""",
    "SVA Main Outreach Segment A": """
Using GHL MCP or Playwright GHL workflow builder, create workflow "SVA Main Outreach — Segment A":
Trigger: Tag Added = "Claude Outreach Sent". Allow re-entry: No.
Filter: Contact has email.
Step 1: Wait 1 hour.
Step 2: Send email subject "missed calls" with the exact body from summit_ghl_build_directive.md Workflow 1.
Step 3: Wait 3 days.
Step 4: If no "replied positive" tag: Send SMS about missed calls.
Step 5: Wait 4 days.
Step 6: If no "replied positive" tag: Send email "the calls you are not getting".
Step 7: Wait 7 days.
Step 8: If no reply: Send SMS breakup message. Add tag "sequence_complete".
Publish workflow.
""",
    "SVA Positive Reply Handler": """
Using GHL MCP or Playwright, create workflow "SVA Positive Reply Handler":
Trigger: Tag Added = "replied positive". Allow re-entry: No.
Filter: Tag "meeting booked" NOT present AND "demo delivered" NOT present.
Step 1: Send email "here is your calendar link" with calendly.com/aivoice/call.
Step 2: Wait 30 min. Send SMS with calendar link.
Step 3: Wait 24 hrs. If no "meeting booked" tag: Send SMS nudge.
Step 4: Wait 48 hrs. If no "meeting booked" tag: Send email "still got a spot for you".
Publish workflow.
""",
    "SVA Marketing Audit + Demo Delivery": """
Using GHL MCP or Playwright, create workflow "SVA Marketing Audit + Demo Delivery":
Trigger: Tag Added = "audit requested". Allow re-entry: No.
Filter: Tag "demo delivered" NOT present.
Step 1: Add tag "demo in progress".
Step 2: Internal notification to Dan with website URL.
Step 3: Outbound webhook POST to [Railway URL]/dispatch with contact data JSON.
Step 4: Wait 12 minutes.
Step 5: If demo_url field not empty: Send email "built you a custom demo" with {{contact.demo_url}}.
Step 6: Wait 30 min. Send SMS with demo URL.
Step 7: Add tag "demo delivered". Remove tags "demo in progress" and "audit requested".
Step 8: Move to SVA Cold Outreach Pipeline stage "Demo Sent".
Step 9: Internal notification to Dan that demo was delivered.
Publish workflow.
""",
    "SVA Demo Follow-Up 48hr": """
Create "SVA Demo Follow-Up (48hr)": Trigger: Tag Added = "demo delivered". No re-entry.
Filter: No "meeting booked" tag.
Wait 48hrs. If "meeting booked" present: Stop.
AI-write one-sentence follow-up SMS about the demo. Send it.
Wait 3 days. If "meeting booked" present: Stop. Send email "still got your demo".
Wait 3 days. If "meeting booked" present: Stop. Send SMS about demo coming down.
Add tag "demo sequence complete". Publish.
""",
    "SVA Lead Enrichment Agent": """
Create "SVA Lead Enrichment Agent": Trigger: Contact Created OR Tag Added "new lead". No re-entry.
Wait 5 min. AI research the company and return JSON with: estimated_revenue, employee_count,
years_in_business, specialty_services, google_review_count, facebook_presence, has_website_chatbot,
runs_google_ads, runs_facebook_ads, yelp_rating.
Update contact custom fields with AI output.
Add segment tag (segment_a through segment_e) based on profile.
Create opportunity in SVA Cold Outreach Pipeline at "Contacted" stage. Publish.
""",
    "SVA Pre-Meeting Brief": """
Create "SVA Pre-Meeting Brief": Trigger: Appointment Status = Confirmed. Allow re-entry: Yes.
Filter: Any Summit Voice AI calendar.
AI generate 300-word pre-meeting brief about the prospect for Dan.
Send brief to Dan via internal email. Send Dan SMS that brief is ready. Publish.
""",
    "SVA Post-Call Follow-Up": """
Create "SVA Post-Call Follow-Up": Trigger: Appointment Status = Showed OR Call Status = Completed. Re-entry: Yes.
Wait 30 min. AI write follow-up email (Hormozi style, no em dashes, casual).
Send AI-generated email. Wait 24 hrs.
If opportunity NOT Won and NOT Proposal Sent: Send SMS follow-up.
Move opportunity to "Meeting Held" stage. Publish.
""",
    "SVA No-Show Recovery": """
Create "SVA No-Show Recovery": Trigger: Appointment Status = No Show. Re-entry: Yes.
Wait 10 min. Send SMS to reschedule with calendly.com/aivoice/call.
Wait 24 hrs. If no new meeting booked: Send email "missed you today".
Wait 3 days. If still no reschedule: Add tag "no show recovery". Publish.
""",
    "SVA Stale Deal Nudge": """
Create "SVA Stale Deal Nudge": Trigger: Opportunity Stage Changed. Re-entry: Yes.
Wait 7 days. If opportunity has NOT changed stage AND stage is not Won or Lost:
AI write brief nudge email. Send it. Internal notification to Dan. Publish.
""",
    "SVA Won Client Onboarding": """
Create "SVA Won Client Onboarding": Trigger: Opportunity Stage Changed = Won. No re-entry.
Add tag "active client". Move to SVA Clients pipeline "Onboarding" stage.
Send welcome email with next steps.
Send Dan internal notification about new client.
Create task for Dan to set up Ava system within 48 hours. Publish.
""",
    "SVA 90-Day Reactivation": """
Create "SVA 90-Day Reactivation": Trigger: Tag Added = "reactivate". Re-entry: Yes every 90 days.
Filter: NOT "active client" AND NOT "do not contact".
AI write re-engagement SMS (1 sentence, casual, roofing reference). Send it.
Wait 48 hrs. If no reply: AI write re-engagement email. Send it.
Wait 3 days. If no reply: Add "sequence complete", remove "reactivate". Publish.
""",
    "SVA Dispatch Trigger SMS Command": """
Create "SVA Dispatch Trigger (SMS Command)": Trigger: Inbound SMS from Dan's number +12408870335.
AI parse the SMS command into JSON: {command, url, contact_id, company}.
Send outbound webhook to [Railway URL]/dispatch with parsed JSON.
Send Dan SMS confirmation. Re-entry: Yes. Publish.
""",
    "SVA Content Autopilot": """
Create "SVA Content Autopilot": Trigger: Recurring every Monday at 7:00 AM. Re-entry: Yes.
AI generate full week of content for 5 platforms: Facebook (2), Instagram (2), LinkedIn (2),
Twitter/X (3), TikTok (1 script). Use Dan's brand voice from CLAUDE.md.
Send full content calendar to Dan via email.
Send Dan SMS that content calendar is ready. Publish.
"""
}

if __name__ == "__main__":
    print("GHL Next Session Runner")
    print("=" * 50)
    print("\nStep 1: Restart Claude Code (GHL MCP now in mcp.json)")
    print("Step 2: Verify GHL MCP connected with: 'List my GHL pipelines'")
    print("Step 3: Paste CREATE_PIPELINES_PROMPT to create 3 pipelines")
    print("Step 4: Paste each workflow prompt from WORKFLOW_PROMPTS dict")
    print(f"\nTotal workflows to create: {len(WORKFLOW_PROMPTS)}")
    for name in WORKFLOW_PROMPTS:
        print(f"  - {name}")
