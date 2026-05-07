---
topic_slug: velocity-core4
display_name: Product velocity and Core 4 metrics
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 3
date_range_processed: 2024 .. 2026
---

# Product velocity and Core 4 metrics

## Current consensus

Lenny "Introducing Core 4: The best way to measure and improve your product velocity" (2025) is the corpus-canonical metric framework.

### The Core 4 metrics
1. **Time to ship** — from idea decision to user-facing release.
2. **Quality** — defects, customer complaints, regressions.
3. **Throughput** — features / experiments / decisions shipped per unit time.
4. **Predictability** — confidence intervals on shipping commitments.

The framework: any one metric optimized in isolation produces gaming. All four together produces real velocity.

### Other relevant frameworks (corpus references)
- **DORA / SPACE** (Nicole Forsgren): cf. [ai-developer-productivity](ai-developer-productivity.md). Engineering-side complement.
- **Increasing team velocity** (Lenny 2021): foundational corpus content.
- **The high-intensity culture** at Shopify (Farhan Thawar 2024-2025): velocity as cultural discipline.

### The 2026 inflection
- **AI tooling ~2x's throughput** at well-instrumented companies (Brian Scanlan / Intercom).
- **Time-to-ship has compressed** at AI-native companies (Cat Wu / Anthropic: 1-2 week research previews vs months at traditional companies).
- **Quality has held** when paired with telemetry + skills-repo + code-review hooks.

### Common velocity failure modes
- **Optimizing throughput alone** produces feature factories without business value.
- **Optimizing quality alone** produces unshipped perfection.
- **Optimizing predictability alone** produces conservative roadmaps.
- **Without measuring all four**, you can't see where the trade-offs are.

## What this means for non-PM consumers

- **If you're a CTO**: pair Core 4 with DORA. They measure overlapping but different things; both matter.
- **If you're a CEO**: velocity is a competitive moat. Companies that ship 2x faster usually win.
- **If you're a board member at a software company**: Core 4 + DORA + customer NPS gives a holistic operational picture.
- **If you're a product manager**: own the Core 4 dashboard for your team; share weekly.

## How thinking has evolved

- **2021**: Lenny "Increasing team velocity" — early canon.
- **2024-2025**: Lenny "Introducing Core 4" — formal framework.
- **2025-2026**: AI-tooling productivity wave; Forsgren DORA/SPACE update; Brian Scanlan Intercom case.

## See also

- Related topics: `ai-developer-productivity`, `ship-like-startup`, `experimentation`, `vibe-coding`, `ai-coding-agents`.
- Books: [Accelerate](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339) (Forsgren); *Frictionless* (Forsgren upcoming).
