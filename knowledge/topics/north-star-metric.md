---
topic_slug: north-star-metric
display_name: Choosing a north star metric
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2021 .. 2026-04
---

# Choosing a north star metric

## Current consensus

The north star metric (NSM) is the single metric that best captures the value the product delivers to users. The corpus consensus on selection criteria:

1. **Tied to the user value, not company value.** "Revenue" is not a north star; it's a result. The NSM should answer "are users getting what they came for?"
2. **Leading indicator of long-term success.** The NSM should predict revenue / retention months in advance, not lag them.
3. **Active not aggregate.** "Total signups" or "DAU" are weak NSMs. "Weekly active users completing the core action" is stronger.
4. **Specific to the product.** Airbnb's "nights booked" worked because it captured both supply and demand. Slack's "messages sent in teams of 3+" captured the network effect specifically. Generic metrics rarely work.
5. **Measurable and auditable.** If the metric requires complex calculation, the team won't internalize it.

### Examples that work (corpus citations)
- Airbnb: nights booked
- Slack: messages sent in teams of 3+
- Spotify: time spent listening
- Duolingo: streak (a habit-formation NSM)

### Examples that fail
- "DAU" without a quality dimension — every social network has learned this
- "Revenue" as NSM — leads to short-term optimization that erodes the actual product
- Multiple-NSM strategies — the value of having a north star is having one

### Modern caveats (2025-2026)

- **For AI products**: NSMs that ignore unit economics (LLM cost) become misleading. "Total queries" can grow exponentially while losing money per query. Add a cost-aware NSM derivative.
- **For B2B**: NDR / net dollar retention is increasingly the de facto NSM for growth-stage companies; for early-stage, weekly-active-customer-completing-core-action is closer to right.

## What this means for non-PM consumers

- **If you're an exec setting team objectives**: pick the NSM with the team, not for them. NSMs imposed top-down without ownership get gamed. NSMs co-owned get pursued.
- **If you're a board member at portfolio review**: ask what the NSM is, why it was chosen, and how it has evolved. NSM changes are worth probing — sometimes they reflect insight, sometimes they reflect goal-shifting to mask poor performance.
- **If you're an engineer or designer pulled into NSM debates**: the right framing is user-value first. Push back on metrics that don't connect to user behavior.
- **If you're a CFO**: the NSM should be your team's leading-indicator dashboard, not a vanity metric. If reported NSM keeps going up but revenue stagnates, the NSM is wrong.

## How thinking has evolved

- **2021-09-23**: Lenny — "Choosing your north star metric." Foundational corpus piece. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/choosing-your-north-star-metric))
- **2022-2024**: corpus expands on industry-specific NSMs (consumer subscription, B2B SaaS, marketplaces, etc.).
- **2025-2026**: AI-product NSMs require cost-aware variants; ARR / NDR rise in B2B pre-IPO companies.

## See also

- Related topics: `activation-metric`, `retention`, `cohort-retention`, `growth-loops`, `consumer-subscription`, `bottom-up-saas`, `evals-for-ai-products`.
- Books: none directly applicable; corpus content is the canonical reference.
