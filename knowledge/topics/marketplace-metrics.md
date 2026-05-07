---
topic_slug: marketplace-metrics
display_name: Marketplace metrics
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 1
date_range_processed: 2022 .. 2024
---

# Marketplace metrics

## Current consensus

Lenny "The most important marketplace metrics to track" (2022) is the corpus-canonical reference. Reinforced by Sarah Tavel hierarchy of marketplaces, Ramesh Johari (Stanford), and Benjamin Lauzier (Lyft / Thumbtack).

### The canonical marketplace metrics
1. **GMV (Gross Merchandise Volume)**: total transaction dollars flowing through the marketplace.
2. **Take rate**: % captured by the marketplace. Cf. [take-rate](take-rate.md).
3. **Net revenue**: GMV × take rate, minus payment processing and other variable costs.
4. **Liquidity**: the % of demand that finds matching supply. The fundamental marketplace health metric.
5. **Repeat use rate**: % of users (both sides) who return within a defined window.
6. **Fill rate**: % of supply that gets utilized. Drivers' utilization, hosts' occupancy, sellers' inventory turn.
7. **NPS by side**: separate measures for supply and demand sides.
8. **Cohort GMV retention**: cohort-based revenue retention. Cf. [cohort-retention](cohort-retention.md).

### Why each matters
- **GMV alone is misleading.** Some marketplaces optimize for GMV by accepting low-margin transactions; net revenue is the durable measure.
- **Liquidity is the bottleneck signal.** Pre-PMF marketplaces fail on liquidity; pre-scale marketplaces fail on liquidity at edge segments.
- **Repeat use** is the long-term-value indicator. One-shot marketplaces (event tickets, real estate) need different treatment than repeat marketplaces (food delivery, ride-share).
- **Fill rate** is the supply-side health metric. Idle supply churns; saturated supply means demand-side scarcity.

### Sarah Tavel's hierarchy of marketplaces lens
- **Engagement-driven marketplaces** (eBay, Etsy at certain phases): repeat-use-rate is paramount.
- **Service marketplaces** (Uber, Thumbtack): liquidity and fill rate dominate.
- **Hybrid marketplaces** (Airbnb, Etsy at scale): full metric stack matters.

### Common failure modes
- **Tracking only top-line GMV.** Hides margin, liquidity, retention issues.
- **Aggregate metrics across markets.** Different cities / categories often have different metric distributions; aggregate hides issues. Cf. [marketplace-city-expansion](marketplace-city-expansion.md).
- **Ignoring NPS asymmetry.** Often supply side and demand side have very different sentiment; treating them together produces misleading signal.

### What's changed in 2025-2026
- **AI-mediated marketplace operations** create new metrics around AI-suggestion quality, AI-fraud-detection accuracy, etc.
- **Outcome-based pricing in marketplaces** (Mercor, Devin) create new financial metrics around outcome attribution.
- **Eval-marketplace metrics** (Mercor) are a new emerging category.

## What this means for non-PM consumers

- **If you're a marketplace founder**: build the full metric dashboard from day 1. Adding metrics later is harder than tracking from the start.
- **If you're an investor**: ask for liquidity + repeat-use-rate + cohort GMV retention. GMV alone is weak signal.
- **If you're a CFO at a marketplace**: net revenue not GMV; cohort retention not aggregate. Insist on the right number.

## How thinking has evolved

- **2022**: Lenny "The most important marketplace metrics to track" — corpus foundational.
- **2023-2024**: corpus expansion via Sarah Tavel, Ramesh Johari, Benjamin Lauzier.
- **2025-2026**: AI-mediated and outcome-based marketplaces produce new metric categories.

## See also

- Related topics: `marketplace-cold-start`, `marketplace-quality`, `marketplace-failure`, `marketplace-city-expansion`, `take-rate`, `cohort-retention`, `north-star-metric`, `demand-driving-supply`.
- Books: [The Cold Start Problem](../books/the-cold-start-problem.md) (Andrew Chen).
