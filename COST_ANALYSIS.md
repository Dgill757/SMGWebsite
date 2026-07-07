# SUMMIT OS - COST ANALYSIS
Date: 2026-07-06 | Basis: current model routing after this session's changes

## MODEL ROUTING POLICY (enforced this session)
- Extraction / classification / personalization -> claude-haiku-4-5 ($1/M in, $5/M out)
- Customer-facing writing (audits, weekly content) -> claude-sonnet-4-6 ($3/M in, $15/M out)

Verified call sites:
| Call | File | Model | OK? |
|---|---|---|---|
| Brand extraction (demo step 2) | ava_demo_studio_api.py | haiku-4-5 | YES |
| No-website brand generation | ava_demo_studio_api.py | haiku-4-5 | YES |
| Marketing audit (customer-facing) | ava_demo_studio_api.py | sonnet-4-6 | UPGRADED (was haiku) |
| Outreach personalization (per lead) | outreach/daily_outreach.py | haiku-4-5 | YES |
| Weekly content | content_generator.py (both copies) | sonnet-4-6 | UPGRADED (was haiku) |
| Research synthesis + reddit check | research_agent.py (both copies) | haiku-4-5 | YES (internal brief) |
| Client manager emails | client_manager.py | haiku-4-5 | YES |
| CEO weekly report | ceo_weekly_report.py | sonnet-4-6 | YES |

## MONTHLY PROJECTIONS (at target volume)
| Workload | Volume/mo | Est. tokens | Est. cost |
|---|---|---|---|
| Demo brand extraction (Haiku) | 100 demos | ~380K in / 50K out | ~$0.65 |
| Marketing audits (Sonnet) | 100 | ~50K in / 120K out | ~$2.00 |
| Outreach personalization (Haiku) | ~1,500 leads | ~1.2M in / 180K out | ~$2.10 |
| Weekly content (Sonnet) | 4 runs | ~5K in / 8K out | ~$0.15 |
| Research briefs (Haiku) | 9 runs | ~90K in / 15K out | ~$0.17 |
| Weekly reports + client emails | 8 runs | ~80K in / 40K out | ~$0.45 |
| **ANTHROPIC TOTAL** | | | **~$6-12/mo** (headroom to ~$20 at 2x volume) |

Recommendation: add $50 credits + enable AUTO-RELOAD at $10 threshold.
The business went down for days over what is a single-digit monthly spend.

## OTHER SERVICES (no change needed)
| Service | Cost | Verdict |
|---|---|---|
| Firecrawl | ~100 scrapes/mo = free tier / ~$5 | Fine. Do not optimize. |
| Apollo | $99/mo flat | Fine. |
| Apify (Google Maps scraper) | usage-based, ~$5-15/mo | Fine. |
| Railway | ~$5-20/mo | Fine. |
| Vercel | Free tier (dashboard + demos) | Fine. |
| **TOTAL STACK** | **~$135-170/mo** | vs $4,466 MRR -> healthy |

## COST GUARDS IN CODE
- Audit output capped at max_tokens=1200; extraction at 500-700.
- Demo persistence caps audit_text at 5,000 chars in Supabase.
- Outreach capped at 100 contacts/day (GHL rate limits).
