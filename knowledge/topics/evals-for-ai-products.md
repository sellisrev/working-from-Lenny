---
topic_slug: evals-for-ai-products
display_name: Building evaluation systems for AI products
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2025-04-08 .. 2025-09-25
---

# Building evaluation systems for AI products

## Current consensus

Evals are the highest-ROI activity for any team building a generative-AI product. Quote from Lenny opening the Hamel/Shreya episode (2025-09-25): "To build great AI products, you need to be really good at building evals. It's the highest ROI activity you can engage in." This is the dominant 2025-2026 framing across the corpus.

Three claims hold simultaneously:

1. **Evals are the new PRD.** Brendan Foody (Mercor): "If the model is the product, then the eval is the product requirement document." Once an eval exists, RL can climb it; the bottleneck for shipping AI capabilities is now writing the eval, not training the model. This explains why Mercor went 1 → $500M ARR in 17 months: they sell expert-written evals to frontier labs.
2. **Vibe checks are no longer enough.** Lenny / Aman Khan (April 2025): "Prompts may make headlines, but evals quietly decide whether your product thrives or dies." The 2023-2024 era of "spot-check the output, ship if it looks good" has been retired by every team that's tried to scale a generative-AI product.
3. **The discipline is open coding + error analysis, not LLM-judging-LLM.** Hamel Husain & Shreya Shankar's [#1 Maven course](https://maven.com/parlance-labs/evals): start by reading traces yourself, writing free-form notes on the *first* thing wrong (not all wrongs), and only later promoting recurring failure modes into structured criteria. LLM judges come *after* the human pass, not before.

The canonical workflow (from Hamel & Shreya):

1. **Look at data.** Open your observability tool (Braintrust, Phoenix/Arize, LangSmith — pick one, no preference). Read traces, one at a time.
2. **Open coding.** For each trace, write a free-form note about the first/most-upstream thing that's wrong. Don't catalogue every issue. Move on. The first 2-3 are painful; you get fast.
3. **Cluster failure modes.** Group your notes into categories.
4. **Promote categories to structured eval criteria.** Now you have the actual eval suite — based on real failures, not anticipated ones.
5. **Selectively automate with LLM judges.** Only after structured criteria exist; only with calibration against human-labeled data; only when domain context lives in the prompt.

What this replaces: "ask GPT to grade GPT" as a vanity dashboard. Hamel: "I would bet money on this, if I put that into ChatGPT and asked, 'Is there an error?' it would say, 'No, did a great job'" — because the LLM doesn't have the domain context (e.g., that the company doesn't actually offer virtual tours). Shankar: "Number one pitfall is people are like, 'Let me automate this with an LLM' [for the open-coding phase]."

## What this means for non-PM consumers

- **If you're an AI engineer / ML engineer**: evals are now treated as production engineering, not data science. Version them, test them, deploy them like code. The corpus has consensus that the team writing evals should sit at the center of the product, not the periphery.
- **If you're a PM hiring or evaluating an AI engineer candidate**: ask "show me an eval suite you've built and how the failure-mode taxonomy evolved over three iterations." Anyone who shows you a single set-and-forget rubric isn't operating at the current standard.
- **If you're a hiring manager evaluating a "Head of AI" candidate**: this skill is rare and the half-life on the job market is short. Hamel and Shreya's course graduates from major labs are visible and identifiable. Network into that pool rather than relying on inbound resumes.
- **If you're an exec or board reviewing an AI product roadmap**: ask the team for their eval pass-rate trend over the last 90 days. A team that can't answer this is shipping by intuition. The pass-rate trend predicts product quality far more reliably than feature counts.
- **If you're a domain expert (medical, legal, etc.)**: you are the bottleneck for high-quality evals in your domain. Mercor's whole business exists because labs need experts to write evals; if you're employed in a regulated field, you can write evals as a lucrative side gig (Mercor is the canonical marketplace).

## How thinking has evolved

Earliest takes (corpus):

- **2025-04-08**: Aman Khan (guest in Lenny newsletter) — first major corpus piece framing evals as the make-or-break skill. "Evals are the only way you can break down each step in the system and measure specifically what impact an individual change might have on a product." Introduces the analogy: evals are like unit tests for non-deterministic systems. ([Beyond vibe checks: A PM's complete guide to evals](https://www.lennysnewsletter.com/p/beyond-vibe-checks-a-pms-complete-guide-to-evals))

Recent takes (last 12 months):

- **2025-09-09**: Lenny — "Building eval systems that improve your AI product" newsletter introduces Hamel & Shreya formally. Frames their work as having "shifted evals from being an obscure, confusing subject to one of the most necessary skills for AI product builders."

- **2025-09-18**: Brendan Foody (Mercor CEO, youngest-ever unicorn founder, $500M ARR in 17 months) — "If the model is the product, then the eval is the PRD." The frontier labs' bottleneck is no longer compute or data, it's *eval coverage*: they need expert-written evals across every domain they want models to work in. Mercor's net retention is 1,600%+ because demand for expert-written evals is unbounded. ([Lenny's Podcast](https://www.youtube.com/watch?v=ja6fWTDPQl4))

- **2025-09-25**: Hamel Husain & Shreya Shankar — the canonical practitioner episode. Concrete walkthrough of error analysis on a real trace (Nurture Boss leasing-agent traces). Established vocabulary: traces, open coding, failure modes, structured criteria, LLM-as-judge calibration. ([Lenny's Podcast](https://www.youtube.com/watch?v=BsWxPI9UM4c))

External current consensus (web, weighted recent + AI-aware):

- Eugene Yan, Hamel Husain, and Shreya Shankar have published a body of blog posts and the [AI Evals course](https://maven.com/parlance-labs/evals) that constitutes the 2026 canonical reference.
- Anthropic, OpenAI, and Google all publish provider-specific eval guides; the Anthropic [Test and Evaluate](https://docs.anthropic.com/en/docs/test-and-evaluate/develop-tests/eval-tool) docs in particular are widely used.
- Industry consensus has converged: error-analysis-first methodology is the standard; LLM-as-judge has matured into a calibrated tool used after human annotation, not before.

## Inflection points

- **Vibe-check exhaustion (early 2025)**: enough teams had shipped AI features only to discover quality regressions in production that the "vibe check" approach became obviously inadequate. Aman Khan's piece codifies the moment.
- **Hamel & Shreya's course launch (early 2025)**: gave the field its first widely-adopted curriculum; all major AI labs send students. Course is the #1 highest-grossing on Maven.
- **Mercor's growth proof (2025-09)**: Mercor's $500M ARR in 17 months proves there's a real market for "expert-written evals as a service," reframing evals from internal-engineering-task to economic primitive.
- **RL-from-AI-feedback (2025-2026)**: once teams have evals, RL effectively climbs them. This makes eval quality, not training-data quality, the real determinant of model performance for any narrow capability.

## Open questions

- How does eval methodology generalize to multi-agent systems where a "trace" spans multiple LLM calls and tool invocations? Hamel/Shreya's example (Nurture Boss) is a single agent; the corpus has not yet covered multi-agent evals deeply.
- Is the "domain expert writing evals" market a permanent labor category or transitional? Brendan Foody argues it's permanent ("the entire economy will become an RL environment machine"); skeptical reading is that synthetic eval generation will eventually substitute for most expert-written evals.
- Where does the eval suite live as the prompt/model evolves? Versioning practices are still emerging; not yet a corpus standard.
- For consumer-facing products with subjective quality (creative writing, conversation), how do you build evals when "good output" is contested? The corpus addresses this only partially.

## Cross-corpus reinforcement (How I AI as secondary signal)

Several How I AI episodes (Hilary Gridley on Claude Code automation, Brian Scanlan on Intercom telemetry) describe production eval / quality-gate practices that match the Hamel-Shreya methodology. Brian Scanlan's "telemetry infrastructure they built to measure AI adoption and quality" is essentially eval infrastructure under a different name. **Reinforces** the main-corpus framing that evals are the central production discipline.

## See also

- Related topics: `prompt-engineering`, `vibe-coding`, `ai-coding-agents`, `ai-developer-productivity`, `ai-product-lifecycle`, `ai-pm-skills`.
- Books: none directly applicable. Eugene Yan / Hamel Husain blog posts and the AI Evals course are the canonical resources; should add Mike Taylor's [Prompt Engineering for Generative AI](https://www.amazon.com/Prompt-Engineering-Generative-AI-Future-Proof/dp/109815343X) as adjacent material.
