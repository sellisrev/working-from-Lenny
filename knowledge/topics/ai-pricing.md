---
topic_slug: ai-pricing
display_name: Monetizing and pricing AI features
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2024-07-30 .. 2025-12-18
---

# Monetizing and pricing AI features

## Current consensus

AI pricing is the most rapidly-evolving subdomain of pricing strategy, and as of 2026 the working consensus differs sharply from non-AI SaaS pricing. Five claims hold:

1. **Direct monetization is usually the right answer** for AI features in B2B SaaS — either as an add-on with its own price tag (~23% of incumbents in Palle Broe's 2024 study) or bundled into existing tiers with a price increase (~59%, often the safest interim play). Indirect monetization (free, no price change) is appropriate only when the AI feature meaningfully boosts retention or conversion of the core product. Palle Broe (Lenny newsletter, 2024-07-30): "as a rule of thumb, direct is best."

2. **AI marginal cost is real and persistent.** Unlike traditional SaaS where the marginal-cost-per-user is near zero, AI features incur LLM token cost on every interaction. Pricing strategies that worked for SaaS (flat $X/user/month) need amendment because heavy users consume substantially more compute than light users. Madhavan Ramanujam (2024-04, [Pricing your AI product](https://www.youtube.com/watch?v=NR85H55eYkM)): the price metric (what you charge by) matters more for AI than it did for SaaS.

3. **Outcome-based and usage-based pricing are gaining share** for agentic / autonomous AI products. Mercor's eval-marketplace pricing, Devin's per-PR-credit model, and the rise of "pay for the work the agent did" pricing all point to outcome-pricing as a viable model where the AI delivers measurable units of work.

4. **For new-category AI products, give a lot away aggressively.** Elena Verna 4.0 at Lovable (2025-12): classify free usage as marketing CAC, not as margin erosion. Users won't generate the "wow moment" if every prompt costs them. This conflicts with point 1 above for category-creation phase, and is the most important distinction. The reconciliation: direct monetization is right for *features added to a known product*; aggressive free for *new category products needing wow-moment exposure*. Cf. [freemium-vs-trial](freemium-vs-trial.md).

5. **The traditional SaaS gating-behind-paywall instinct is wrong for AI in new categories.** Verna 4.0 explicitly: "a lot of, especially traditional tech companies I see are gating AI immediately behind the paywall because they're sitting on a really cush, high margin profile, and the moment that you start giving AI away for free, you're cutting into those margins like a knife through the butter." This protects margin in the short term and forfeits the growth flywheel.

A summary decision tree for the practical case:

- Adding AI to an existing SaaS product? → Direct monetization (add-on or bundle-with-price-increase). Test willingness to pay early; calibrate against unit-cost-per-interaction. (Palle Broe / Madhavan Ramanujam framing.)
- Building a new AI-native product seeking adoption? → Aggressive free, classified as marketing spend. Optimize for the wow-moment, not for margin. (Verna 4.0 framing.)
- Selling agentic / outcome-driven work? → Outcome-based or usage-based pricing tied to measurable units the customer values. (Mercor / Devin model.)

## What this means for non-PM consumers

- **If you're a CFO or finance lead at a SaaS company adding AI**: the LLM cost is real. Build it into your COGS modeling and don't treat AI features as zero-marginal-cost extensions. Verna's "marketing spend" framing is a category-creation strategy, not a default for established products.
- **If you're a CMO at an AI-native company**: budget for free-tier consumption as marketing CAC. Hackathons, credit grants, generous free tiers are part of the demand-generation funnel.
- **If you're an investor evaluating an AI-product-pricing model in a pitch**: ask "what's the LLM cost per active user, and how does that scale with engagement?" A 100% gross margin claim should be challenged unless they have a specific story for inference-cost recovery.
- **If you're a board member**: price-related pivots (introduce add-on pricing, increase price with AI bundle, transition to usage) are higher-stakes for AI products than non-AI products because the unit economics are more sensitive. Expect more pricing iteration than for traditional SaaS.

## How thinking has evolved

Earliest takes:

- **2024-04-22**: Madhavan Ramanujam (Simon-Kucher Senior Partner, Monetizing Innovation author) — foundational pricing-as-measure-of-value framing. Five lessons for product teams; usage-based vs subscription decision criteria. Pre-AI but the framework holds. ([Lenny's Podcast](https://www.youtube.com/watch?v=NR85H55eYkM))

- **2024-07-30**: Palle Broe (Lenny newsletter) — analyzed 44 tech incumbents' AI pricing strategies. Established the direct vs indirect framing; direct usually wins. ([How should you monetize your AI features?](https://www.lennysnewsletter.com/p/how-should-you-monetize-your-ai-features))

Middle period:

- **2024-2025**: GitHub Copilot, Microsoft Copilot, Adobe Firefly, Notion AI, etc. all use direct monetization (add-on or bundle-with-price-increase). Establishes the dominant industry pattern.

Recent takes:

- **2025-12-18**: Elena Verna 4.0 at Lovable — strong counter-framing for AI-native consumer / prosumer products. Classify free usage as marketing CAC; freemium aggressively; protect the wow-moment over short-term margin. The framing differs from Broe's because the underlying business stages differ. ([Lenny's Podcast](https://www.youtube.com/watch?v=OgHmvKtyo7M))

External current consensus (web, weighted recent + AI-aware):

- a16z, Sequoia, and Bessemer have all published 2025-2026 takes on AI pricing structure. Convergent view: outcome-based pricing for agentic products is rising; per-seat is decreasingly common for AI-augmented work where the "seat" doesn't capture the work delivered.
- Patrick Campbell / ProfitWell content remains broadly applicable for SaaS pricing fundamentals; needs amendment for AI specifics.

## Inflection points

- **GitHub Copilot pricing model (2022-2023)**: $10/user/month for individual, $19/user/month for business. Established the "AI as add-on with its own price" precedent that Broe documents 44 companies later following.
- **Palle Broe study (July 2024)**: corpus formalizes direct vs indirect framing.
- **Devin / Cognition outcome-based pricing emergence (2025)**: introduces per-PR-completed economics for autonomous-agent products.
- **Verna 4.0 at Lovable (Dec 2025)**: counter-framing for new-category AI products where wow-moment exposure outweighs short-term margin.
- **Anthropic Max $200/month (2025-2026)**: extreme high-tier pricing for power users; signals that for some AI tools, value capture is so high that pricing well above SaaS-normal is sustainable.

## Open questions

- What's the steady-state economic structure of AI pricing? Today most frontier-lab products are subsidized (Anthropic, OpenAI, Google compete on usage-volume share). When subsidies normalize, do customer prices rise, or does inference cost drop fast enough to maintain current pricing?
- How does outcome-based pricing handle low-confidence outputs? Does the customer pay for a Devin PR that gets rejected at code review?
- For consumer AI products specifically: is the $20/month consumer ceiling holding, or is there room for higher tiers? ChatGPT Pro at $200/month is the canonical experiment.

## See also

- Related topics: `freemium-vs-trial`, `saas-pricing`, `consumer-subscription`, `take-rate`, `evals-for-ai-products`.
- Books: [Monetizing Innovation](https://www.amazon.com/Monetizing-Innovation-Companies-Design-Product/dp/1119240867) by Madhavan Ramanujam — corpus-canonical pricing reference; should be added to books.yml.
