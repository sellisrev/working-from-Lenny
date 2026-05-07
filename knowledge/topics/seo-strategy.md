---
topic_slug: seo-strategy
display_name: SEO strategy in the post-AI era
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2020-07-14 .. 2025-10-10
---

# SEO strategy in the post-AI era

## Current consensus

The 2020-2024 SEO playbook (keyword research → page-level optimization → backlinks → content factory → wait for ranking) is partially obsolete. The 2026 working consensus:

1. **For navigational and brand queries**: traditional SEO still works. Brand-name searches, branded long-tail, and direct intent ("login to Acme") are unchanged.
2. **For informational queries**: SEO has decayed. AI Overviews + ChatGPT consume these. The "first blue link wins" model is broken; engagement metrics (dwell time, scroll depth) are also lower because users get answers without clicking.
3. **The "free traffic" assumption is dead.** Eli Schwartz: SEO is no longer the lowest-cost growth channel. Plan with that.
4. **Two-tier strategy**: maintain SEO for the queries it still wins; invest in [AEO](ai-search-aeo.md) (Answer Engine Optimization) for the queries it doesn't.

What still works (durable from the 2020-2024 doctrine):
- **Topic clusters around expertise.** Content depth + topical authority remain the dominant SEO signals; LLMs trained on Google's index inherit Google's ranking biases.
- **Internal linking architecture.** Ethan Smith's separate Lenny piece on internal linking remains canonical. ([Ethan Smith: The power of internal linking for SEO](https://www.lennysnewsletter.com/p/ethan-smith-the-power-of-internal-linking-for-seo))
- **Page experience signals**: speed, mobile, accessibility — still load-bearing.
- **Brand strength** as a search differentiator: more important than ever, because AI answer engines weight brand citations heavily.

What no longer reliably works:
- **Keyword-stuffing or exact-match-domain plays.** Already declining pre-AI; finished off by AI search.
- **Mass-produced AI content factories** aimed at the long tail. Google's helpful content updates penalize these specifically. Eli Schwartz: this is where the most painful SEO traffic losses concentrate.
- **"Long-form 3000-word article ranks for the keyword" plays** for informational queries. AI Overviews extract the answer and the click never happens.
- **Aggressive link-buying.** Higher detection risk, lower benefit. Google has discounted link-driven ranking for several years.

For new content: write for humans who will cite or share you. Citations and brand mentions in authoritative content are the new high-value link.

## What this means for non-PM consumers

- **If you're a B2B SaaS marketing lead**: don't sunset SEO; rebalance it. Continue brand and high-intent content; stop investing in long-tail informational SEO unless you have a unique competitive moat (proprietary data, original research, expert network).
- **If you're a content team or agency**: the unit economics of SEO content have inverted. Quality content with original research, data, or expert interviews still ranks; commodity content does not. Cf. Lenny's own newsletter — original research + expert interviews drive his ranking.
- **If you're a CFO/CRO**: budget for SEO traffic to be flat-to-down for the next 18 months for most categories. Don't blame the marketing team if their "content output" rises and traffic doesn't follow; the fundamental signal has changed.
- **If you're a B2C / consumer brand**: high-intent transactional queries (where users are buying) still have strong SEO returns. Informational and discovery queries should shift to AEO + paid + community.
- **If you're a startup founder (pre-PMF)**: the old "pick a keyword you can rank for" startup-SEO strategy is increasingly tough. The startups that won at SEO 2020-2023 (Notion, Webflow, Airtable, etc.) are still winning, but new entrants need different channels.

## How thinking has evolved

Earliest takes:

- **2020-07-14**: Brian Ta (Airbnb, Strava, AngelList) — "Winning at SEO." Foundational pre-AI playbook: keyword research with high-intent + low-difficulty bias, programmatic SEO at scale, quality landing pages, internal linking. Optimal for the 2020-2023 era. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/winning-at-seo))

- **2021-02 / various**: Lenny — case studies (Booking.com, MasterClass, Canva) on programmatic SEO at scale. Established the "build pages for every long-tail variant" pattern.

Middle period:

- **2021 / 2022**: Brian Ta and others — programmatic SEO playbooks become a startup-growth canon. Zapier ($35M ARR with this strategy), MasterClass ($800M edtech empire) cited as exemplars.

- **2024-09-19**: Eli Schwartz — "Rethinking SEO in the age of AI." The corpus pivot. Schwartz himself thought it would be an apocalypse; the milder reality is that SEO has become harder, narrower, and brand-dependent. ([Lenny's Podcast](https://www.youtube.com/watch?v=Z71yGshPTwk))

Recent takes:

- **2025-09-14**: Ethan Smith (Graphite) — "The ultimate guide to AEO" frames AEO as the natural extension. Existing SEO authority transfers to AEO with effort.

- **2025-10-10**: Robby Stein (Google VP Product Search) — Google's perspective: AI Overviews + AI Mode are growing search market overall. Some publishers lose; aggregate query volume is up.

External current consensus (web, weighted recent + AI-aware):

- Ahrefs, Semrush, Sparktoro all publish 2025-2026 reports confirming traffic shifts: navigational + brand queries stable; informational queries lose 30-60% CTR depending on category.
- Google's own Helpful Content / E-E-A-T (Experience Expertise Authoritativeness Trustworthiness) updates have aligned ranking signals with AI-summarization-friendly content; this favors authority brands and original research.

## Inflection points

- **Google AI Overviews launch (May 2024)**: most queries that used to drive a click now end with the user satisfied by the AI summary. Pivotal moment for the field.
- **AI search alternatives (ChatGPT, Perplexity, Claude) reach mass adoption (2024-2025)**: query share fragments away from Google for informational queries.
- **Eli Schwartz episode (Sept 2024)**: corpus formally registers that the SEO doctrine has shifted.
- **Ethan Smith AEO episode (Sept 2025)**: corpus reframes the work as a multi-engine optimization discipline, not Google-specific SEO.
- **Robby Stein on Google's AI shift (Oct 2025)**: Google publicly accepting that they're no longer the dominant assumption; competing.

## Open questions

- What's the steady-state long-term traffic share between traditional Google (blue links), Google AI Mode, and external answer engines? Forecasts in the corpus disagree.
- For programmatic SEO (Notion-style template pages, Webflow-style theme pages): does the model still work? Anecdotal corpus evidence is mixed.
- Will Google's licensing economics with publishers change the SEO equation? Open lawsuits and deals.
- For non-English markets: AI search penetration is uneven; SEO doctrine is closer to 2020-2023 outside English. The corpus has not addressed this region-specifically.

## See also

- Cross-cuts heavily with: [`ai-search-aeo`](ai-search-aeo.md) — companion topic; the AEO playbook is the affirmative complement to this topic's "what's decaying" analysis.
- Related topics: `content-driven-growth`, `paid-acquisition`, `growth-loops`, `category-creation`, `brand-building`.
- Books: Eli Schwartz's [Product-Led SEO](https://www.amazon.com/Product-Led-SEO-Why-Personally-Doing/dp/1544523416) — canonical for the pre-AI doctrine, partially decayed for current applications.
