---
topic_slug: cohort-retention
display_name: Cohort retention measurement
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2020 .. 2024
---

# Cohort retention measurement

## Current consensus

Cohort retention is the most diagnostic single metric in the corpus for product health. Two principles dominate:

1. **Aggregate retention is misleading; cohort retention is honest.** Pre-PMF, aggregate retention can drift up while every cohort decays — because newer cohorts haven't aged into their decay yet. Always plot retention by cohort, ideally weekly or monthly.

2. **The shape matters more than the number.** Brian Balfour and Casey Winters: a curve that flattens (even at 20%) usually indicates PMF for that segment. A curve that's high in early periods but keeps dropping doesn't.

### How to do it (Lenny canonical method)
- Pick the cohort window that matches your usage cadence (weekly cohorts for daily-use products, monthly for less frequent).
- Plot retention as a heatmap or line chart per cohort.
- Look for the flatten point. If your data goes far enough (12+ months ideally), that's where PMF lives.
- Segment by acquisition channel, by initial action taken, by demographic — find the cohort that retains and double down.

### Common failure modes
- **Reporting "active users" without a cohort dimension.** Hides decay.
- **Defining retention too loosely** ("any session counts"). Pick the action that matters; retention on that action is meaningful.
- **Reporting retention before retention has stabilized.** A 1-month-old cohort hasn't had time to decay; conclusions from it are fragile.

### What's changed in 2025-2026
- **AI products show non-traditional shapes.** Subsidized free-tier activation inflates cohort 1 retention; users churn at the moment they hit model capability limits, often at month 2-4.
- **Power-user cohorts emerge faster** in AI products because of the wow-moment mechanic. Cf. [retention](retention.md), [activation-metric](activation-metric.md).

## What this means for non-PM consumers

- **If you're an exec or board member**: insist on cohort retention curves at every product review, not just aggregate retention. The shape is the diagnosis.
- **If you're a CFO**: NDR (net dollar retention) for B2B is the financial-shape complement to user retention curves.
- **If you're an engineer or designer with a hypothesis about why retention is dropping**: pull the cohort curve from before/after the change you're hypothesizing about. The data tells you whether your hypothesis is plausible before investing in fix work.

## How thinking has evolved

- **2020**: Lenny — How to measure cohort retention; What is good retention. Foundational.
- **2021-2023**: Brian Balfour, Casey Winters, and others codify the cohort-flatten = PMF heuristic.
- **2024-2025**: AI-era retention shapes diverge; methodology unchanged.

## See also

- Related topics: `retention`, `product-market-fit`, `activation-metric`, `consumer-subscription`, `churn-and-payback`, `north-star-metric`.
- Books: none directly applicable; corpus content + Reforge / Brian Balfour blog are canonical.
