---
topic_slug: ai-data-as-moat
display_name: Data as the moat for AI products
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 1
date_range_processed: 2024 .. 2024
---

# Data as the moat for AI products

## Current consensus

Anchored in Shaun Clowes (CPO Confluent, "Why great AI products are all about the data", 2024).

### The thesis
- **Foundation models are commoditizing.** Anthropic, OpenAI, Google all expose APIs at competitive prices.
- **What's left is the data.** Proprietary data, domain-specific data, real-time-validated data — these create AI products that competitors can't easily reproduce.
- **Data moats compound.** Each interaction generates more training-or-eval data; the gap widens.

### Where data moats show up
- **Mercor**: expert-written evals are a data moat. Cf. [evals-for-ai-products](evals-for-ai-products.md).
- **Anthropic / OpenAI**: training data + RL feedback loops are the moat at the foundation-model layer.
- **Vertical AI products** (legal, medical, etc.): domain-specific data + expert annotation are the moat.
- **Enterprise AI products**: customer-tenant-data improves the customer's instance over time.

### How data moats break
- **Synthetic data generation.** When models can generate plausible training data themselves, data moats erode.
- **Open-data initiatives.** Common Crawl, open datasets reduce the moat for some categories.
- **Customer-tenant-data isolation.** Data per customer doesn't compound across customers if isolation is strict.
- **Model-capability shifts.** When base models become smart enough that less domain data is needed, the data moat shrinks.

### Mapping to Helmer 7 Powers
Data-as-moat doesn't fit cleanly into one of Helmer's 7 powers; it's a combination of:
- **Cornered resource** (you have data others can't get)
- **Scale economies** (more users = more data = better product = more users)
- **Counter-positioning** (incumbents can't easily replicate without disrupting their existing business)

### What's changed in 2025-2026
- **Mercor demonstrates eval-data-as-moat at $500M ARR scale.** Cf. [evals-for-ai-products](evals-for-ai-products.md).
- **Foundation-model price drops** raise the importance of data layer.
- **Distribution may matter more than data** in some categories. Cf. [distribution-as-moat](distribution-as-moat.md). Spiegel argues distribution; Clowes argues data; both can be right depending on context.

## What this means for non-PM consumers

- **If you're a CEO / founder of an AI startup**: identify your specific data moat. "We use AI" is not a moat; "we have unique training data on X" might be.
- **If you're an investor evaluating AI product pitches**: ask what data they have that competitors can't replicate. Foundation-model dependency without data moat is a thin position.
- **If you're a CFO at an AI company**: data-acquisition cost is a real long-term investment line, even if it doesn't fit traditional CapEx categories.

## How thinking has evolved

- **2024-12**: Shaun Clowes on Lenny's Podcast — corpus introduction of "AI products are all about the data."
- **2025-2026**: Mercor scale + Confluent enterprise framing reinforces.
- **2026**: Tension with distribution-as-moat (Spiegel) — both are simultaneously true depending on context.

## See also

- Related topics: `evals-for-ai-products`, `distribution-as-moat`, `seven-powers`, `ai-coding-agents`, `ai-pricing`, `ai-product-lifecycle`, `pattern-breakers`.
- Books: [7 Powers](../books/seven-powers.md) (Helmer).
