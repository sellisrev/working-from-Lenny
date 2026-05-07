---
topic_slug: ai-product-lifecycle
display_name: AI product development lifecycle
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 3
date_range_processed: 2024 .. 2025
---

# AI product development lifecycle

## Current consensus

Lenny "Why your AI product needs a different development lifecycle" (2024) is the corpus introduction. Reinforced by Hamel Husain & Shreya Shankar evals canon and Cat Wu / Anthropic research-preview practice.

### How AI lifecycle differs from traditional SaaS
1. **Eval-driven**, not test-driven. Cf. [evals-for-ai-products](evals-for-ai-products.md). Output quality is graded by criteria, not by deterministic tests.
2. **Probabilistic outputs.** Same input produces different outputs; this changes everything about debugging, support, and quality measurement.
3. **Fast model-shift cycles.** Underlying foundation model changes regularly; product behavior changes without your code changing.
4. **User behavior is unstable.** Users discover capabilities of the product (and the model) over time; usage patterns shift.
5. **Cost-per-action is non-trivial.** LLM inference cost makes "every feature is free at scale" assumption wrong.

### The new lifecycle stages
- **Discovery**: traditional + understanding what the model can plausibly do.
- **Eval design**: define what success looks like before building. Cf. [evals-for-ai-products](evals-for-ai-products.md).
- **Prototyping**: vibe-coded; fast iteration. Cf. [ai-prototyping](ai-prototyping.md).
- **Research preview**: explicit "this is preview" framing; user expectations calibrated; quick iteration.
- **GA + telemetry**: observability for AI behavior; production eval harness; cost monitoring.
- **Continuous improvement**: cf. [ai-developer-productivity](ai-developer-productivity.md). Each prod issue feeds back into eval suite.

### Key practices
- **Trace-driven debugging.** When something goes wrong, the trace (full LLM call history) is the unit of investigation, not the unit-test stack trace.
- **LLM-as-judge calibrated against humans.** Used for scaled eval after human annotation establishes ground truth.
- **Cost monitoring as product metric.** Cf. [ai-pricing](ai-pricing.md). Cost per active user belongs in the product dashboard.
- **Capability dependencies** in the roadmap. "We'll ship X when the model can reliably do Y."

### Common failure modes
- **Treating AI features as deterministic.** Producing "tests" that pass once and fail later because model updated.
- **No eval suite.** Vibe-shipping by spot-check; quality regression invisible.
- **No cost telemetry.** Discovering inference cost problems at month-end.
- **Stale capability assumptions.** Building around what the model couldn't do 6 months ago when it can do it now.

### What's changed in 2025-2026
- **The lifecycle is becoming canonical.** Most serious AI-product teams have adopted some version of this.
- **Anthropic / OpenAI publishing best practices** for AI product engineering. The discipline is professionalizing.
- **Tooling maturity**: Braintrust, Phoenix Arize, LangSmith, Weights & Biases all serve this lifecycle.

## What this means for non-PM consumers

- **If you're an engineer at an AI company**: this lifecycle is your work. Invest in eval infra; treat traces as primary data.
- **If you're a CTO**: organizing engineering around AI lifecycle, not waterfall or pure-Scrum, is a structural decision worth making explicitly.
- **If you're an investor evaluating AI product technical maturity**: ask about their eval suite, observability, and cost-per-action telemetry. Teams without these are pre-mature.

## How thinking has evolved

- **2024-08**: Lenny "Why your AI product needs a different development lifecycle" — corpus introduction.
- **2025**: Hamel Husain & Shreya Shankar eval canon codifies the methodology.
- **2025-2026**: Lifecycle becomes table stakes for serious AI products.

## See also

- Related topics: `evals-for-ai-products`, `vibe-coding`, `ai-coding-agents`, `ai-developer-productivity`, `ai-prototyping`, `ai-pm-skills`, `ai-pricing`, `ai-data-as-moat`.
- Books: corpus content + Hamel Husain blog + Eugene Yan blog as canonical references.
