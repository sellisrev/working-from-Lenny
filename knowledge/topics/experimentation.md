---
topic_slug: experimentation
display_name: Experimentation and A/B testing culture
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2020 .. 2024
---

# Experimentation and A/B testing culture

## Current consensus

Ronny Kohavi (Airbnb / Microsoft / Amazon, "[The ultimate guide to A/B testing](https://www.lennysnewsletter.com/p/the-ultimate-guide-to-ab-testing)") is the corpus-canonical reference. Plus Fostering a culture of experimentation (Lenny, 2021).

### The fundamentals
1. **Most "wins" don't replicate.** Kohavi's data: 70-80% of A/B tests show no statistically significant effect. Of "winners," many fail to replicate or generalize.
2. **Power and sample size matter.** Underpowered tests produce false positives. Most product teams ship "winners" from underpowered tests.
3. **Minimum detectable effect (MDE).** Pick the smallest effect you'd care about; size your test for that. Smaller MDEs need bigger samples.
4. **Stop the pre-test temptation.** Test the change; don't peek; don't stop early on positive data without sequential-test corrections.
5. **One test, one change.** Multivariate is usually a trap unless you have huge sample size and a specific hypothesis.

### Common failure modes
- **HiPPO decisions framed as experiments.** "We A/B tested it" as cover for a leadership decision is a culture problem, not an experimentation problem.
- **Vanity metrics as success criteria.** "Click-through rate up 5%" without checking downstream conversion / retention is short-sighted.
- **Selection effects.** Cohorts that opt into a test self-select; treat carefully.
- **Network effects in marketplaces.** A/B testing in a marketplace where supply is shared between treatment + control is invalid; need cluster randomization.

### When NOT to run an experiment
Lenny's "When NOT to run an experiment" (2020): some decisions are too small to test (just ship), too big to test (commit and adjust), too philosophical (vision-driven). Experimentation is a tool, not a default.

### Culture of experimentation
- **Decoupled from individual ownership of outcomes.** When a person's bonus depends on the test winning, the test design subtly drifts.
- **Pre-registered hypotheses.** Write down the hypothesis + success criteria before launching; reduces post-hoc rationalization.
- **Document failed tests as carefully as successful ones.** Failures inform strategy.

### What's changed in 2025-2026
- **AI-driven personalization makes traditional A/B testing harder.** When every user gets a personalized variant, test-vs-control comparison breaks. Need new measurement approaches (counterfactual estimation, off-policy evaluation).
- **Eval-driven AI development is the new "A/B testing" for AI features.** Cf. [evals-for-ai-products](evals-for-ai-products.md). The discipline shifts from "compare variants" to "grade outputs."

## What this means for non-PM consumers

- **If you're a data scientist or analyst**: own the test design rigor; PMs may not know what they're doing wrong. Push back on underpowered tests.
- **If you're an engineer**: test infrastructure is product infrastructure. Experimentation platforms that engineers can integrate without heavy data-team involvement scale 10x faster.
- **If you're an exec at a SaaS company**: ask "what's our culture's relationship to experimentation?" Strong cultures publish failures. Weak cultures only celebrate wins.

## How thinking has evolved

- **2020-2021**: Lenny — Fostering a culture of experimentation; When NOT to run an experiment.
- **2024**: Ronny Kohavi episode — corpus-canonical A/B testing reference.
- **2024-2025**: GiveDirectly experimentation case study (3M+/year revenue impact).
- **2025-2026**: Eval-driven AI development shifts experimentation discipline toward AI products.

## See also

- Related topics: `evals-for-ai-products`, `north-star-metric`, `working-with-pms-as-data`, `prioritization-frameworks`, `cohort-retention`, `conversion-rate`.
- Books: [Trustworthy Online Controlled Experiments](https://www.amazon.com/Trustworthy-Online-Controlled-Experiments-Practical/dp/1108724264) (Kohavi et al.) — canonical reference.
