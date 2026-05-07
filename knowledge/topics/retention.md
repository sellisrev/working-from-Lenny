---
topic_slug: retention
display_name: Improving product retention
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 6
date_range_processed: 2020 .. 2026-04
---

# Improving product retention

## Current consensus

Retention is the most-discussed metric in the corpus and the closest thing to a universal truth: **retention is the foundation; growth without retention is a leaking bucket.**

### The canonical retention principles

1. **Cohort-based, not aggregate.** Aggregate retention numbers hide the real picture. Always look at retention by cohort (week, month, segment). Cf. [cohort-retention](cohort-retention.md).
2. **Flatten beats high-but-declining.** A retention curve that flattens (even at 20%) often indicates PMF; a curve that's high in month 1 but keeps dropping doesn't.
3. **Power users are the leading indicator.** What does month-12+ retention look like? Power users tell you who your real product serves.
4. **Engagement ≠ retention.** Daily active does not imply retained. Sarah Tavel's hierarchy of engagement (cf. [hierarchy-of-engagement](hierarchy-of-engagement.md)) ranks users by depth; track the depth shift over time.
5. **Consumer subscription has a different shape.** Cf. [consumer-subscription](consumer-subscription.md). Subscription products have predictable churn cliffs (month 1, year 1) that B2B SaaS doesn't.

### Practical retention improvements (corpus consensus)

- **Onboarding is most leverage.** Lauryn Isford ([Mastering onboarding](https://www.lennysnewsletter.com/p/mastering-onboarding-lauryn-isford), 2023): the first session is where most retention is lost. Activation metric (cf. [activation-metric](activation-metric.md)) is downstream.
- **Friction can help retention, not hurt it.** Bobby Pinero / Equals (cf. [freemium-vs-trial](freemium-vs-trial.md)): some onboarding friction increases long-term retention by selecting committed users. Removing friction can tank retention.
- **Habit formation.** Nir Eyal's Hooked Model: trigger → action → variable reward → investment. Products that build habits retain.
- **Streaks and gamification.** Jackson Shuttleworth (Duolingo retention team): streaks are durable retention engines when designed honestly. Cf. Duolingo's growth trajectory.
- **Tradeoffs to watch.** "Engagement at any cost" produces dark patterns (toxic streaks, FOMO notification spam). Retention earned through these is brittle and reputation-damaging.

## What's changed in 2025-2026

- **AI products have anomalous retention curves.** AI features generate retention spikes followed by churn cliffs at the moment users hit capability limits. Cohort retention curves for AI products often look like funnels (drop, drop, drop) rather than flattening curves. May reflect the products being immature or the user expectations being recalibrated.
- **Subsidized retention.** Free-tier AI usage (Claude, ChatGPT, Cursor) inflates retention curves by removing payment friction. Real retention emerges when subsidies normalize.

## What this means for non-PM consumers

- **If you're an exec or board member**: ask for cohort retention curves, not aggregate retention. The shape matters more than the number.
- **If you're a marketing lead**: don't optimize for acquisition without confirming retention. Acquisition into a leaking bucket is wasted spend.
- **If you're a CFO**: payback period (cf. [churn-and-payback](churn-and-payback.md)) and net dollar retention (NDR) for B2B are the durable financial metrics; gross retention without NDR is incomplete.
- **If you're an engineer or designer with a retention concern**: bring it to the PM with cohort data, not anecdote. "I noticed users are leaving" is weak; "month-3 retention dropped 8 points after the redesign" is strong.

## How thinking has evolved

- **2020-2021**: Lenny — "How to increase your product's retention," "How to measure cohort retention," "What is good retention" — foundational corpus content.
- **2022-2023**: Casey Winters, Brian Balfour, Yuriy Timen on retention as PMF indicator.
- **2024-04**: Jackson Shuttleworth (Duolingo) — streaks as retention engine; the most concrete recent corpus piece.
- **2025-2026**: AI-product retention shapes diverge from traditional SaaS; subsidies distort signals.

## See also

- Related topics: `cohort-retention`, `activation-metric`, `north-star-metric`, `consumer-subscription`, `subscription-value-loop`, `hierarchy-of-engagement`, `growth-loops`, `churn-and-payback`, `product-market-fit`.
- Books: [Hooked](../books/hooked.md) (Nir Eyal), [The Cold Start Problem](../books/the-cold-start-problem.md) (Andrew Chen).
