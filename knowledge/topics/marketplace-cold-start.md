---
topic_slug: marketplace-cold-start
display_name: Marketplace cold start (chicken-and-egg)
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 6
date_range_processed: 2019 .. 2024
---

# Marketplace cold start (chicken-and-egg)

## Current consensus

Marketplaces have to solve liquidity (enough supply ↔ enough demand) before they can grow. The corpus consensus on the playbook:

1. **Pick one side first; usually it's the harder side.** Andrew Chen (*The Cold Start Problem*): identify the constraint, focus there. Most consumer marketplaces are supply-constrained early.
2. **Atomic network.** Build the smallest viable network — a single city, a single category, a single use case — that demonstrates self-sustaining liquidity. Expand from there.
3. **Do things that don't scale.** Founder-led concierge work for first 100 transactions. Brian Chesky / Airbnb canon.
4. **Quality over quantity early.** A marketplace with 100 high-quality transactions per week beats one with 1000 mediocre ones. Sarah Tavel's hierarchy of marketplaces.
5. **Trust is the second-hardest problem.** After liquidity, marketplaces fail on trust. Reviews, money-back guarantees, founder-shadowing-restaurants (DoorDash) — all these are trust-building moves disguised as ops work.

### Lenny's series (canonical)

Lenny's 4-part series (2020) on kickstarting marketplaces:
- Part 1: introduction
- Part 2: cracking chicken-and-egg (supply vs demand)
- Part 3: growing initial supply
- Part 4: growing initial demand

Plus phase-2 content on accelerating growth, maintaining quality, city expansion.

### City expansion as growth strategy
For local marketplaces (DoorDash, Uber, Airbnb), city-by-city expansion was the dominant playbook. Each city was its own atomic network. Lenny's "Marketplace city expansion strategy" piece (2022) is the canonical corpus reference.

## What's changed in 2025-2026

- **AI doesn't change marketplace fundamentals.** Liquidity, trust, atomic-network — all still apply.
- **AI changes specific marketplace operations.** AI-mediated matching, AI-augmented customer support, AI-generated listings. These are tactical wins; they don't substitute for solving the cold start.
- **Eval marketplaces emerge** (Mercor, cf. [evals-for-ai-products](evals-for-ai-products.md)). New marketplace category: experts writing AI training data. Same cold-start dynamics; different supply-side recruiting.

## What this means for non-PM consumers

- **If you're a founder pitching a marketplace**: investors will ask about the cold start before anything else. Have a concrete story for the first 100 transactions.
- **If you're an investor evaluating a marketplace**: ask about the atomic network. "We'll launch in [City]" is the right level of specificity. "We'll launch nationally" is a red flag.
- **If you're a non-marketplace operator considering a marketplace pivot**: the cold-start cost is enormous. Understand it before committing.

## How thinking has evolved

- **2019-2021**: Lenny's marketplace series; Sarah Tavel hierarchy of marketplaces; Casey Winters / Andrew Chen content.
- **2022**: Andrew Chen publishes *The Cold Start Problem*. Becomes corpus-canonical.
- **2024**: Bob Moesta on JTBD applied to marketplaces; Ramesh Johari on academic marketplace lessons.
- **2024-2025**: Tim Holley (Etsy), Benjamin Lauzier on marketplace operations at scale.

## See also

- Related topics: `marketplace-quality`, `marketplace-failure`, `marketplace-metrics`, `marketplace-city-expansion`, `take-rate`, `growth-loops`, `atomic-network`, `demand-driving-supply`.
- Books: [The Cold Start Problem](../books/the-cold-start-problem.md) (Andrew Chen).
