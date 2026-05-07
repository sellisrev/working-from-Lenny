---
topic_slug: prioritization-frameworks
display_name: Prioritization frameworks (RICE, DRICE, etc.)
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2021 .. 2025
---

# Prioritization frameworks

## Current consensus

Multiple frameworks coexist; pick the one that fits your context. Corpus consensus:

### The classic RICE
- **Reach** × **Impact** × **Confidence** ÷ **Effort** = score.
- Originated at Intercom; widely adopted.
- Strength: forces estimation discipline, relative scoring works.
- Weakness: false precision (multiplying made-up numbers); doesn't handle dependencies; can hide strategic misfit.

### Lenny's DRICE addition (2024-2025)
- Adds **Dependencies** as a first-class factor. Cf. "[Introducing DRICE: a modern prioritization framework](https://www.lennysnewsletter.com/p/introducing-drice-a-modern-prioritization-framework)."
- Reflects the reality that no feature ships in isolation; surfacing dependencies upfront prevents quarter-end surprises.

### Other frameworks in the corpus
- **MoSCoW** (Must / Should / Could / Won't): coarse but useful for stakeholder negotiation.
- **Kano model**: classify features as basic, performance, or delighters. Useful for feature mix, less for sequencing.
- **Now / Next / Later** (Janna Bastow): theme-based instead of item-scored. Pairs well with [reading-product-roadmaps-as-stakeholder](reading-product-roadmaps-as-stakeholder.md).
- **Gibson Biddle's GEM** (Gain / Effort / Margin): used at Netflix; weights similar to RICE with explicit business margin lens.
- **80/20 cover-fire** (Lenny, defending big bets): 80% incremental wins + 20% big bet. Cf. [defending-big-bets](defending-big-bets.md).

### What works regardless of framework
- **Forced ranking.** Whatever the framework, force the team to commit to an order. Frameworks help; ranking decides.
- **Track post-hoc accuracy.** When the items ship, was the predicted impact right? Calibrate the team's estimates over time.
- **Cut, don't just sequence.** Many "low priority" items shouldn't ship at all. Be willing to delete from the backlog.

### What's changed in 2025-2026
- **AI cuts effort estimates.** Many items previously rated "high effort" can now ship in a week. Re-score before applying old prioritization.
- **Cost of building options has dropped; judgment cost has risen** (Singhal, Cat Wu). Prioritization is now more about what to *not* build than what to schedule first.

## What this means for non-PM consumers

- **If you're a CEO or founder**: pick one framework and use it consistently for 6+ months. Switching frameworks is usually re-debating the same priorities under a new vocabulary.
- **If you're an engineer or designer**: when prioritization decisions hurt you, push back with effort recalibration data. AI tooling has changed the inputs; old estimates may be wrong.
- **If you're a sales lead asking for prioritization**: bring deal-size + close-probability + churn-risk data. Generic asks lose; data-backed asks win.

## How thinking has evolved

- **2021-2022**: Lenny "Prioritizing"; "Prioritizing at startups"; "Prioritizing conversion opportunities" — corpus accumulates RICE / Kano / MoSCoW canon.
- **2024-2025**: Lenny "Introducing DRICE: a modern prioritization framework."
- **2025-2026**: AI-tooling effort-recalibration shifts effort weighting in any framework.

## See also

- Related topics: `roadmaps`, `product-strategy`, `decision-making-frameworks`, `defending-big-bets`, `saying-no`, `reviewing-prds-and-1-pagers`.
- Books: [Inspired](../books/inspired.md), [Shape Up](../books/shape-up.md) (Ryan Singer; alternative to RICE-style scoring).
