---
topic_slug: product-market-fit
display_name: Finding and recognizing product-market fit
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 6
date_range_processed: 2020-01-28 .. 2024-04-11
---

# Finding and recognizing product-market fit

## Current consensus

Product-market fit (PMF) remains the corpus's most-discussed concept and has the most stable consensus of any topic in this knowledge base. The 2026 view:

### Pre-product PMF signals
- **People will pay you before there's a product.** Direct invoice-them-now test (Lenny, 2020). The strongest signal.
- **People are giving you their time** (interviews, follow-up questions, prototype feedback) without you having to chase them.

### Post-product PMF signals (the canonical four)
1. **Retention curve flattens.** Brian Balfour: plot % active users over time per cohort; if it flattens, you have PMF for that segment. Casey Winters extends: the customer-acquisition cost has to be below the lifetime value implied by the flattened curve.
2. **Sean Ellis "very disappointed if I couldn't use this" survey ≥ 40%.** Classic PMF survey question; not perfect but a useful benchmark.
3. **Word of mouth.** Users tell other users without prompting; viral coefficient > some threshold for consumer; for B2B, customer references happen unsolicited.
4. **Pull, not push.** When growth is sales-led, you can manufacture growth without PMF; when it's product-led, the product is being pulled out of you. Ramen profitability with low marketing spend is a strong indicator.

### Todd Jackson's First Round PMF framework (2024-04, the canonical recent treatment)

Four levels of PMF: **nascent, developing, strong, extreme**. Three dimensions: **demand**, **satisfaction**, **efficiency**. Not all three from day zero — start with demand, then satisfaction, then efficiency. Most useful diagnostic in the corpus for "are we actually at PMF or just kidding ourselves?"

### Itamar Gilad's evidence-guided approach
PMF is something you confirm with multiple converging signals, not declare based on one metric. Multiple-signal triangulation is the durable practice.

### What the corpus consistently warns against
- **"PMF is a feeling."** It often *is* a feeling, but optimistic founders feel PMF before having it. Use objective metrics to check the feeling.
- **Vanity metrics**: signups, app downloads, MAUs without retention. All three can be high without PMF.
- **Anchoring on initial spike of interest.** Bobby Pinero (Equals freemium case): 4x'd users initially but tanked on retention. The initial spike is not PMF.

## What's changed in 2025-2026

Mostly, the framing hasn't. PMF measurement is durable. Two minor updates:

- **For AI products specifically**: PMF can be misleading because of subsidies. Frontier labs subsidize usage; users use products that wouldn't economically work at unsubsidized prices. The retention curve may look great but the unit economics are deferred. Cf. [ai-pricing](ai-pricing.md).
- **PMF speed has compressed.** Lovable: $10M ARR in 60 days. Bolt: $40M ARR in 5 months. Cursor: $300M ARR in 24 months. The "5-7 years to find PMF" framing is partially obsolete — the high end of the distribution is much faster now. The low end is still slow.

## What this means for non-PM consumers

- **If you're a founder pre-PMF**: do not hire ahead of PMF. Cf. [hiring-early-team](hiring-early-team.md), [when-to-hire-first-pm](when-to-hire-first-pm.md). Most pre-PMF startups die from premature scaling, not from undershooting hiring.
- **If you're a CEO with "developing" PMF (in Jackson's framing)**: the question is which dimension to push next — typically demand → satisfaction → efficiency. Don't optimize efficiency before satisfaction is solid.
- **If you're an investor evaluating a Series A pitch**: ask for the cohort retention curve. If they don't have one, they don't know whether they have PMF.
- **If you're a board member at a growth-stage company**: PMF can be lost. Companies that had PMF for one segment often lose it as they expand into adjacent segments. Watch retention by cohort, by segment, by recency.
- **If you're a non-PM exec hearing "we have PMF"**: triangulate. Get retention data + a Sean Ellis-style survey + revenue evidence. Each on its own can mislead.

## How thinking has evolved

- **2020-01-28**: Lenny — "How to know if you've got product-market fit." Compiles definitions across Andreessen, Elad Gil, Blank, Rachleff, Seibel. Foundational. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-to-know-if-youve-got-product-market-fit))
- **2020-2022**: corpus expands "what does it feel like?" essays; Casey Winters and Brian Balfour's writing dominate.
- **2023-2024**: B2B PMF treatments (Lenny's "[A guide for finding product-market fit in B2B](https://www.lennysnewsletter.com/p/a-guide-for-finding-product-market-fit-in-b2b)").
- **2024-04-11**: Todd Jackson (First Round Capital) — 4-levels-3-dimensions framework. The canonical recent treatment. ([Lenny's Podcast](https://www.youtube.com/watch?v=yc1Uwhfxacs))
- **2024-2026**: AI-native PMF examples (Cursor, Lovable, Bolt) compress the timeline.

## Inflection points

- **Andreessen's "only thing that matters" framing (2007 essay, recirculated in corpus)**: the dominant frame for two decades.
- **Brian Balfour's retention-curve-flattening definition (2017)**: gives the most actionable single metric.
- **Todd Jackson's First Round framework (2024)**: provides the most useful diagnostic for "where are we on the spectrum?"
- **AI-native fast-PMF era (2024-2026)**: compressed timelines but kept the underlying definitions intact.

## Open questions

- Is the retention-curve-flatten metric still right when subsidized AI products distort unit economics?
- For new-category products: how do you measure PMF when there's no competing benchmark for "good retention"?
- For platform products serving multiple distinct segments: how many independent PMF curves do you need before declaring "PMF"?

## See also

- Related topics: `b2b-pmf`, `consumer-business-stages`, `retention`, `cohort-retention`, `north-star-metric`, `startup-validation`, `pivots-art`, `evaluating-product-bets`.
- Books: Andy Rachleff / Pete Flint / various — corpus-canonical content; mostly blog posts. [The Lean Startup](../books/lean-startup.md) (Eric Ries) is foundational reading on validate-before-scale.
