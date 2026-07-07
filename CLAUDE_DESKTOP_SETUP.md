# Claude Desktop MCP Content System — Setup Guide
# Agent 14: Ad Intelligence + Full Content Marketing Stack
# Total cost: ~$86-96/month for complete operation

---

## WHAT THIS GIVES YOU

Four MCPs running inside Claude Desktop on your laptop:

| MCP | Cost | Does |
|-----|------|------|
| Buffer | $6/mo/channel | Schedules to X, LinkedIn, FB, Instagram, Threads |
| Higgsfield | $10-20/mo | AI image + video generation (30+ models) |
| ScrapeCreators | $20/mo | Facebook Ad Library competitor scraping |
| Meta Ads | Free (via Claude.ai) | Build/manage FB/Instagram campaigns from Claude |

Once set up, you run 5 prompts from Claude Desktop and your entire content + ad operation runs itself.

---

## STEP 1 — PREREQUISITES (5 min)

1. Install Claude Desktop: https://claude.ai/download
2. Install Node.js LTS: https://nodejs.org (required for npx commands)
3. Verify Node installed: open Terminal → type `node --version` → should show v18+

---

## STEP 2 — GET API TOKENS (15 min)

### Buffer Token
1. Go to: https://publish.buffer.com/settings/api
2. Click "Create Token" → name it "Claude Desktop"
3. Copy the token — starts with `buf_`

### Higgsfield
1. Sign up: https://higgsfield.ai
2. Go to Settings → API or MCP → copy your MCP URL
3. Format: `https://mcp.higgsfield.ai/mcp?key=YOUR_KEY`

### ScrapeCreators (Facebook Ad Library)
1. Sign up: https://scrapecreators.com
2. Dashboard → API Keys → copy your key

### Meta Ads (via Claude.ai)
- No token needed — added directly via Claude Desktop Settings
- See Step 4 below

---

## STEP 3 — CREATE CONFIG FILE (5 min)

Open this file location: `%APPDATA%\Claude\claude_desktop_config.json`

On Windows, paste this path in File Explorer: `C:\Users\DanGi\AppData\Roaming\Claude\`

Create (or edit) `claude_desktop_config.json` with this exact content:

```json
{
  "mcpServers": {
    "buffer": {
      "command": "npx",
      "args": ["-y", "@buffer/mcp-server"],
      "env": {
        "BUFFER_API_TOKEN": "PASTE_YOUR_BUFFER_TOKEN_HERE"
      }
    },
    "higgsfield": {
      "type": "url",
      "url": "PASTE_YOUR_HIGGSFIELD_MCP_URL_HERE",
      "name": "Higgsfield"
    },
    "scrapecreators-adlibrary": {
      "command": "npx",
      "args": ["-y", "@scrapecreators/facebook-ad-library"],
      "env": {
        "SCRAPECREATORS_API_KEY": "PASTE_YOUR_SCRAPECREATORS_KEY_HERE"
      }
    }
  }
}
```

Replace the three placeholder values with your actual tokens.

---

## STEP 4 — ADD META ADS MCP (2 min)

1. Open Claude Desktop
2. Go to: Settings → Integrations (or Connectors)
3. Find "Meta Ads" → click Connect → authorize your Facebook Business account
4. This gives Claude access to create/manage campaigns directly

---

## STEP 5 — RESTART CLAUDE DESKTOP (important)

FULLY quit Claude Desktop — not just close the window.
- Windows: System tray → right-click Claude → Quit
- Then reopen it

In a new chat, you should now see tool icons for Buffer, Higgsfield, and Ad Library.
If you don't see them, check the config file for JSON syntax errors.

---

## THE 5 MASTER PROMPTS

Copy these. Use them every week in Claude Desktop.

---

### PROMPT 1 — COMPETITOR RESEARCH (Monday, 10 min)

```
Use the Facebook Ad Library (ScrapeCreators) to find all roofing companies 
currently running Facebook ads in [city]. 

For each company found:
- Extract: company name, ad copy, offer, CTA, how long it's been running
- Screenshot or describe the creative

Then tell me:
1. What is the most common angle? (price? storm damage? emergency?)
2. What are they NOT saying that Summit Voice AI could own?
3. Which ad has been running the longest? (that's their winner — it's working)

Summarize in a format I can use to brief my content for next week.
```

---

### PROMPT 2 — WEEKLY CONTENT GENERATION + SCHEDULING (Monday after research)

```
Generate this week's Summit Voice AI social content calendar.

Content pillar this week: [rotate: PROOF / EDUCATION / URGENCY / STORY / OFFER]

Dan's voice rules:
- Alex Hormozi style — short sentences, direct, no fluff
- No em dashes — use ellipses (...) instead
- Specific numbers always: "$9,500 avg job", "67% of calls go unanswered", "3-5 missed calls/day"
- Lowercase subject lines
- Never mention "Ava" in cold content
- CTA always: calendly.com/aivoice/call

Generate:
1. LinkedIn post (300-500 words, professional story angle)
2. Facebook post (200-300 words, local roofing owner angle)
3. Instagram caption (150 words max + 5 hashtags)
4. Twitter/X post 1 (under 240 chars, stat-based hook)
5. Twitter/X post 2 (under 240 chars, story-based hook)
6. TikTok script (45-75 seconds spoken, casual, direct)

Use Higgsfield to generate one image for Instagram/LinkedIn:
- Style: professional, dark navy background, orange accent
- Subject: roofing contractor on roof OR phone ringing with missed calls visual
- No text overlay needed

Then schedule via Buffer:
- Facebook: Tuesday 9:00 AM ET
- Instagram: Tuesday 11:00 AM ET  
- LinkedIn: Wednesday 8:00 AM ET
- Twitter post 1: Immediately
- Twitter post 2: Thursday 2:00 PM ET
```

---

### PROMPT 3 — AD CAMPAIGN BUILD (when ready to run paid ads)

```
Use Meta Ads MCP to build a new Facebook + Instagram lead gen campaign for Summit Voice AI.

Campaign settings:
- Objective: Lead Generation
- Budget: $10/day
- Duration: 14 days then review
- Audience: Roofing contractors, construction business owners, self-employed in trades
  Location: [target city, 25 mile radius]
  Age: 30-65
  Interests: roofing, construction, small business

Ad creative:
- Use this image: [paste Higgsfield image URL]
- Primary text: "67% of roofing calls go unanswered. At $9,500 a job, that's $50-100K walking out the door every year. We built an AI that answers every call, 24/7. $16/day. One recovered job pays for the whole year."
- Headline: "Stop Losing Roofing Leads"
- CTA button: Learn More
- Landing page: https://summitvoiceai.com

Launch the campaign when ready.
```

---

### PROMPT 4 — CONTENT REPURPOSING (when a post performs well)

```
This post performed well this week: [paste the top-performing post]

Repurpose it into:
1. 3 Twitter/X posts (under 240 chars each, different angles from the original)
2. 1 Instagram caption with 5 roofing-specific hashtags
3. 1 email subject line that could work for cold outreach
4. 1 TikTok script (45-60 seconds, same core idea, more conversational)

Use Higgsfield to generate a new image in the same visual style as the original.

Schedule all via Buffer using the normal schedule:
- FB: next Tuesday 9am, IG: next Tuesday 11am, LinkedIn: next Wednesday 8am
```

---

### PROMPT 5 — MONTHLY PERFORMANCE REVIEW

```
Pull last month's engagement data from Buffer for all Summit Voice AI channels.

For each channel (LinkedIn, Facebook, Instagram, Twitter):
- Which post got the most engagement?
- What topic/angle drove it?
- What day/time performed best?

Based on this data:
1. Generate 4 variations of the top-performing post format
2. Build next month's content calendar with the winning angles
3. Schedule the best 3 posts for next week via Buffer

Tell me: what one content format should I double down on to grow fastest?
```

---

## QUICK REFERENCE — WEEKLY WORKFLOW

```
MONDAY MORNING (30 min total):
  1. Run Prompt 1 → competitor research (10 min)
  2. Run Prompt 2 → generate + schedule content (15 min)
  3. Content goes out automatically all week

MONTHLY (30 min):
  1. Run Prompt 5 → performance review
  2. Adjust content strategy based on what's working

WHEN LAUNCHING ADS:
  1. Run Prompt 3 → $10/day campaign live in minutes
  2. Monitor in Meta Ads Manager

WHEN A POST GOES VIRAL:
  1. Copy the URL or text
  2. Run Prompt 4 → repurpose + schedule immediately
```

---

## TROUBLESHOOTING

**MCPs not showing up:**
- Did you fully quit Claude Desktop (not just close)?
- Is your JSON syntax valid? Check at: https://jsonlint.com
- Is Node.js installed? Run: `node --version`

**Buffer not scheduling:**
- Check token starts with `buf_`
- Verify channels are connected in Buffer dashboard

**ScrapeCreators returns no results:**
- Try different city names (use "Dallas TX" not just "Dallas")
- Their Facebook Ad Library data updates every 24h

**Higgsfield image quality:**
- Try different style prompts: "photorealistic", "professional photography", "dark background"
- Use 1024x1024 or 1080x1080 for best results

---

*Setup time: ~30 minutes one-time. After that: 30 min/week runs your entire content marketing operation.*
