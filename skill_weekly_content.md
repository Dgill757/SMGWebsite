---
name: weekly-content
description: Generate this week's complete social content calendar for Summit Voice AI. LinkedIn, Facebook, Instagram, Twitter x2, TikTok. Rotates through 5 content pillars automatically. Saves to vault and schedules to GHL Social Planner.
triggers: weekly content, generate content, content calendar, social posts, create posts
schedule: every Monday at 07:00
---

# Weekly Content Generator

## Content Pillars (auto-rotate by week number)
1. MONEY LEAK — The revenue roofing owners are losing (missed calls, slow follow-up, no reviews)
2. MINDSET SHIFT — Challenge how they think about their business
3. THE SYSTEM — How Ava actually works (demystify the AI)
4. THE PROOF — Results, data, math ($9,500 × missed calls)
5. THE COMPETITION — Why this beats a receptionist or call center

## Voice Rules (NON-NEGOTIABLE)
- Alex Hormozi for the trades. Short sentences. Direct.
- No em dashes. Use ... for pauses.
- Lowercase subject lines. Sentence case everywhere else.
- No "game-changing" "revolutionary" "leverage" "unlock"
- Max 1 exclamation point per post
- Specific beats vague: "3 calls" > "calls" | "$9,500" > "money"
- CTA: always calendly.com/aivoice/call OR a direct question back to reader

## Key Stats (weave in naturally)
- 67% of calls to small businesses go unanswered
- Average roofing job: $9,500
- Missing 3-5 calls/day = $50-100K/year walking out the door
- Ava: answers calls, books jobs, follows up, requests reviews. 24/7.
- As little as $16/day

## Output Per Week

**LINKEDIN POST**
Hook (3-8 words) → 2-3 short paragraphs → 1 question or CTA
150-250 words. Owner talking to owners.

**FACEBOOK POST**
Story-driven, conversational, could start with "this happened on a job site..."
100-200 words.

**INSTAGRAM CAPTION**
First line MUST stop the scroll — surprising stat or provocation
3-4 staccato lines → 1 CTA line → 5 hashtags
80-150 words total

**TWITTER POST 1**
Under 240 chars. Counterintuitive or contrarian. No hashtags.

**TWITTER POST 2**
Under 240 chars. Pure math or stat. No hashtags.

**TIKTOK SCRIPT**
45-75 seconds. Raw, direct-to-camera.
Open with most surprising claim. Include [PAUSE] [CUT] cues.
Like Dan is talking from his truck to another roofer.

## Process
1. Determine week number → select pillar
2. Generate all 6 pieces
3. Save as JSON to: `SummitVault/CONTENT/SOCIAL/[YYYY-MM-DD]-week-[N].json`
4. POST to GHL Social Planner API to schedule:
   - Facebook: Tuesday 9am
   - Instagram: Tuesday 11am
   - LinkedIn: Wednesday 8am
5. Send summary to Slack #ava-dispatch
6. Return confirmation with preview of best post
