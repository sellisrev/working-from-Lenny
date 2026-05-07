---
topic_slug: prompt-engineering
display_name: Prompt engineering techniques
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 6
date_range_processed: 2024-02-08 .. 2026-02-03
---

# Prompt engineering techniques

## Current consensus

Prompt engineering is alive, has rebranded ("context engineering" is the more accurate term per Karpathy and Tobi Lutke as of mid-2025), and has bifurcated into two distinct modes that need different skills:

1. **Conversational prompt engineering** (most people, every day): you iterate by talking with the model. Start coarse, course-correct ("make it more formal", "add an example"), and let the conversation accumulate context. The 2024-era techniques (role-playing, style unbundling, emotion-anchoring, structured output requests) help here. Newer models reduce the gap, so techniques are becoming less load-bearing for casual use.

2. **Product / agent prompt engineering** (where the production payoff is): you have one prompt running thousands or millions of times in a product (chat tool, agent, RAG system). Improvements compound. This is where the science exists: Sander Schulhoff's [Prompt Report (76 pages, 1500 papers, 200 techniques)](https://learnprompting.org/docs/prompt_report) is the canonical reference. Studies show bad prompts can produce 0% accuracy on a task that good prompts get to 90%; Schulhoff documents a 70% accuracy improvement on medical coding from prompt engineering alone.

The most-validated techniques for product mode (per the Prompt Report and Schulhoff's interview):

- **Self-criticism / self-refinement**: get the model to output, then ask it to critique its own output, then revise. Robust across tasks.
- **Few-shot with reasoning** (not just examples — examples + why each was answered the way it was): Schulhoff's medical-coding 70% boost came from this.
- **Chain of thought (CoT)** in product mode is now usually wired in via reasoning model tokens or explicit "think step by step" — but most frontier reasoning models do this internally and you should not over-instruct it.
- **Decomposition**: break the task into sub-tasks the model handles separately; assemble. Especially valuable for agent loops.
- **Context engineering**: the actual skill. Providing all relevant facts, constraints, examples, formatting requirements, and exclusions in the prompt window. This reframes the discipline away from "magic phrasings" toward "good information architecture."

What's quietly retired or low-priority for 2026:

- "**Pretend you are a [famous person]**" (role-playing) — still works for quick conversational use; not load-bearing in product mode.
- "**Take a deep breath**" / "I will tip you $200" — emotion-prompting tricks that worked on GPT-3.5 era models. Frontier 2026 models often ignore or even penalize these as the trainers have addressed them in RLHF.
- "**Step-by-step**" instruction added to reasoning-model prompts — usually redundant or counter-productive; the model already does this.

Prompt injection / red teaming is a separate skill area but increasingly relevant: agent products are now exposed to user inputs that can override their system prompts. Schulhoff's HackAPrompt competition + research with frontier labs is the canonical resource. If you ship an agent that takes user text as context, treat injection as a security category, not a curiosity.

## What this means for non-PM consumers

- **If you're a developer or engineering lead**: the "product/agent mode" is your problem. Invest in eval harnesses ([evals-for-ai-products](evals-for-ai-products.md)) that grade prompt quality; treat prompt iteration as a versioned engineering artifact, not a doc.
- **If you're a designer or marketer using ChatGPT/Claude daily**: conversational mode plus context engineering is enough. Spend time providing context (background, tone, constraints, examples) up front; the "magic technique" search is mostly diminishing returns.
- **If you're a manager hiring a prompt engineer**: the title is fading because the work is folding into AI engineer / context engineer / eval engineer. Look for evidence of running and iterating evals, not just prompt-craft demos.
- **If you're an exec reviewing AI feature pitches**: ask whether the team has an eval suite for the prompts in question, and what the eval pass-rate is on the current prompt vs. the prior iteration. A team that can't answer this is not yet ready to ship.

## How thinking has evolved

Earliest takes (corpus, oldest first):

- **2024-02-08**: Logan Kilpatrick (OpenAI head of devrel) — prompt engineering = giving the model context like you would a human. "Imagine human-level intelligence but literally no context. It has no idea who you are, what your goals are." Sets the framing that has held since: it's not magic phrasings, it's context. ([Lenny's Podcast](https://www.youtube.com/watch?v=mOyyT0vrA8E))

- **2024-07-09**: Mike Taylor (Brightpool, O'Reilly Prompt Engineering for Generative AI author) — "most people underestimate how close ChatGPT is to replacing work because they didn't use the latest model and didn't make use of prompt engineering." Few-shot prompting can drive 30%+ accuracy improvement; multi-example few-shot 50-60%. Frames prompt engineering as the key delta between "AI can't do X" and "AI does X well."

Middle period:

- **2024-10-29**: Mike Taylor's 5+3 techniques newsletter — role-playing, style unbundling, emotion prompting, plus chain-of-thought and few-shot. Practical templates for daily use. Aimed at conversational mode primarily. ([Five proven prompt engineering techniques](https://www.lennysnewsletter.com/p/five-proven-prompt-engineering-techniques-and-a-few-more-advanced-tactics))

Recent takes (last 12 months):

- **2025-06-19**: Sander Schulhoff (Learn Prompting, HackAPrompt) — reset of the field. Key claims: prompt engineering is not dying ("people will always be saying it's dead but then the next model comes out and it's not"); two modes (conversational vs product); studies show 0%→90% spread; The Prompt Report (76 pages, co-authored with OpenAI/Microsoft/Google/Princeton/Stanford) catalogs 200 techniques; canonical recommended technique is self-criticism. Schulhoff's medical coding example: 70% accuracy boost from few-shot-with-reasoning. ([AI prompt engineering in 2025](https://www.youtube.com/watch?v=eKuFqQKYRrA))

- **2025-06-25**: Andrej Karpathy and Tobi Lutke X exchange (~2.36M views) — "+1 for 'context engineering' over 'prompt engineering'." Reframes the discipline: "the art of providing all the context for the task to be plausibly solvable by the LLM." This is the canonical 2026 vocabulary.

- **2025-12-04**: Tomer Cohen (LinkedIn CPO) — "Prompt engineering became a playbook internally for us, which every day was amazing. How do you cognitively reverse engineer the brain a little bit?" Indicates that at LinkedIn scale, prompt engineering became an institutional discipline shared with OpenAI and Microsoft.

- **2026-02-03**: Lenny — "How to build AI product sense" newsletter cites Karpathy/Tobi's framing as established convention.

External current consensus (web, weighted recent + AI-aware):

- The Prompt Report ([learnprompting.org/docs/prompt_report](https://learnprompting.org/docs/prompt_report)) is the canonical taxonomy.
- Anthropic, OpenAI, and Google publish provider-specific prompt engineering guides ([Anthropic's guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview), OpenAI's, Google's). Frontier-lab-published guides have largely replaced the influencer-published guide era.
- "Context engineering" is now the preferred term in technical AI engineering circles; "prompt engineering" persists as the marketing-friendly synonym.

## Inflection points

- **ChatGPT release (2022-11)**: created the demand for prompt engineering as a discipline.
- **Schulhoff's first prompt engineering guide (Sept 2022, two months before ChatGPT)**: gave the field a vocabulary before mainstream demand.
- **"Take a deep breath" paper / emotion prompting research (2023-2024)**: ushered in a wave of "magic phrasing" tactics that worked on GPT-3.5 / GPT-4 generation.
- **The Prompt Report publication (June 2025)**: turned prompt engineering from craft folklore to formal taxonomy.
- **Karpathy / Tobi "context engineering" rebrand (June 2025)**: terminology reframe; signals the field's maturation away from "phrasing tricks" toward "context architecture."
- **Reasoning models (o1, Claude Opus 4.x with thinking, late 2024 / 2025)**: rendered explicit chain-of-thought instructions largely redundant; shifted prompt engineering toward decomposition and tool-use orchestration.

## Open questions

- As models get more capable, how much of prompt engineering folds into "good information architecture" (evergreen) vs. "model-specific tricks" (decaying)? Schulhoff's two-modes framing helps, but the line keeps moving.
- Should companies hire dedicated prompt engineers? The job-market signal (Lenny's 2024-09 report) was that the role exists but is rare; by 2026 it's largely folded into AI engineer / context engineer roles.
- Prompt injection defense at scale: where does the responsibility live (foundation model vs application layer vs both)? Schulhoff's research shows the foundation models can't fully solve this alone.

## Cross-corpus reinforcement (How I AI as secondary signal)

How I AI episodes consistently demonstrate context-engineering-style work without using the term: Al Chen's 15-repo Claude Code system, Brian Scanlan's skills-repository at Intercom, Hilary Gridley's Claude Code automation. **Reinforces** that the production skill is information architecture, not phrasing tricks. None of the How I AI episodes contradict the main corpus on this.

## See also

- Obsolete claims: [`../obsolete/prompt-engineering.md`](../obsolete/prompt-engineering.md)
- Related topics: `evals-for-ai-products`, `ai-prototyping`, `vibe-coding`, `ai-coding-agents`.
- Books: none directly applicable in `references/books.yml`. Mike Taylor's [Prompt Engineering for Generative AI (O'Reilly)](https://www.amazon.com/Prompt-Engineering-Generative-AI-Future-Proof/dp/109815343X) is corpus-recommended; should be added to books.yml.
