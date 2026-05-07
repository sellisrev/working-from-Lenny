---
topic_slug: ai-pm-skills
display_name: PM skills in the AI era
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2024-08-20 .. 2026-04-23
---

# PM skills in the AI era

## Current consensus

Five skills are now table stakes for any PM working on or with AI products. None of them are about prompting tricks; all of them are about judgment under model-capability uncertainty.

1. **Product taste** — Cat Wu (Anthropic, Head of Product Claude Code, 2026-04): "As code becomes much cheaper to write, the thing that becomes more valuable is deciding what to write." When engineers can ship in a day what used to take a sprint, the bottleneck is taste — knowing which of the 10,000 GitHub issues to prioritize, which UX is delightful, what to refuse to build. Product taste is also the rarest skill in Anthropic's hiring funnel and the one that overrides background (engineer/designer/PM all welcome if they have it).

2. **Building eval intuition.** Per [evals-for-ai-products](evals-for-ai-products.md), an AI PM who can't read traces, identify failure modes, and propose eval criteria is missing the central craft. Lenny: "the ability to write great evals isn't just important — it's rapidly becoming the defining skill for AI PMs in 2025 and beyond."

3. **AGI-calibration** — Cat Wu (2026-04): "It is very hard to be the right amount of AGI-pilled. It's very easy to build the product for the super AGI strong model. The hard thing is figuring out for the current model, how do you elicit the maximum capability?" Both extremes are wrong: the "models will solve everything in 6 months" PM over-promises and under-builds; the "treat AI as a deterministic system" PM ships rigid features that don't survive the next model release.

4. **Hands-on use of coding agents** — Tal Raviv & Aman Khan (2026-02): "the single most transformative habit to internalize important AI concepts was to move away from consumer-grade UIs (ChatGPT, Granola, Lovable) and into more powerful AI coding agents like Cursor and Claude Code." The argument: coding agents make the AI's reasoning visible (you can read tool calls, watch context windows fill, hit the same walls real engineers hit), which builds intuition that ChatGPT chat windows hide. The "AI product sense" recommendation is to use Cursor for daily non-technical work for at least three months.

5. **Direction-setting under model uncertainty** — Cat Wu: "the hardest skill is being able to define what the product should look like a month from now... the best PMs can see [patterns] based on how users are abusing the limits of the existing product." This is the meta-skill the other four serve. PMs who can hold a 1-3 month roadmap conviction while updating weekly on capability shifts ship; PMs who chase every model release thrash; PMs who ignore them under-deliver.

The corpus consensus on what doesn't matter as much:

- "Knowing the latest model" (it changes every week; lasting skill is calibration, not memorization)
- "Writing detailed PRDs" (Cat Wu: PRDs are now lightweight — clear goal, clear user, clear top use cases — not heavyweight specs)
- "Coordinating standups and Jira" — folded into agents

## What this means for non-PM consumers

- **If you're a PM hiring manager**: Cat Wu's hiring filter at Anthropic — "engineers with great product taste" — is the most efficient frontier for AI-native teams. If you're an eng leader hiring PMs, weight prototypes-shipped over interview decks.
- **If you're a designer or engineer who reads "PM skills" and wonders if you should pivot**: Cat Wu — "PMs are doing some engineering work, engineers are doing PM work, designers are PMing and also landing code. You can either hire a lot more engineers who have great product taste, or you can keep your engineering hiring the same and hire a lot more PMs." The skills aren't gated to job titles.
- **If you're a CEO sketching the org for an AI product**: do not insist on a PM-per-engineering-team ratio that worked for non-AI products. Cat Wu's team has many engineers shipping end-to-end with no PM involvement. Headcount should follow product complexity, not team-template tradition.
- **If you're a senior PM whose career has been built on roadmap-orchestration and PRD-writing**: Lenny's [How to build AI product sense](https://www.lennysnewsletter.com/p/how-to-build-ai-product-sense) (Tal & Aman, 2026-02) is the prescriptive workshop you need. Its 100-hour-of-creation depth and Cursor-based methodology are the direct path to closing the gap.

## How thinking has evolved

Earliest takes (corpus):

- **2024-08-20**: Lenny — "Why PMs are best positioned to thrive in an AI world." Optimistic, framing-level: PMs already have judgment, taste, customer empathy; AI augments these rather than replaces them. Sets the baseline. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/why-pms-are-best-positioned-to-thrive))

- **2025-02-09**: Karina Nguyen (OpenAI Research, ex-Anthropic) — confirmed Lenny's framing from a frontier-lab insider perspective: soft skills will dominate; AI is good at hard skills (synthesis, writing, code).

Middle period:

- **2025-04-08**: Aman Khan — evals as the make-or-break skill (see [evals-for-ai-products](evals-for-ai-products.md)).

Recent takes (last 12 months):

- **2025-12-15**: Mike Krieger (Anthropic CPO, Instagram co-founder) — "What comes next" episode: emphasis on the bifurcation of consumer-product PM craft vs. enterprise-product PM craft in AI era; AI moves consumer faster but raises bar for enterprise on judgment.

- **2026-02-03**: Tal Raviv & Aman Khan in Lenny's newsletter — "How to build AI product sense." Prescriptive method: use Cursor for non-technical work (strategy, prioritization, decision-making, data analysis) for several months. The argument is empirical: 3 months of Cursor use beats 3 years of ChatGPT use for building intuition. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-to-build-ai-product-sense))

- **2026-04-23**: Cat Wu (Anthropic, Head of Product Claude Code) — most authoritative recent statement of what AI-PM skills look like at the bleeding edge. Product taste, AGI-calibration, framework-creation for cross-functional teams, lightweight PRDs, fast research previews. ([Lenny's Podcast](https://www.lennysnewsletter.com/p/how-anthropic-product-team-moves-faster))

External current consensus (web, weighted recent + AI-aware):

- a16z, Reforge, and First Round Review pieces from late 2025 / 2026 broadly converge on: taste + evals + AGI-calibration as the AI-PM core. The Mihika Kapoor (Figma) piece on "vision, conviction, and hype" reinforces the conviction-under-uncertainty theme.
- AI-product-sense as a teachable skill is now an industry norm, not a contrarian claim. Tal & Aman's workshop, Hilary Gridley's Lightning Lesson series, and the Hamel/Shreya AI Evals course are the canonical curriculum.

## Inflection points

- **GPT-4 release (2023-03)**: created the first need for "AI product manager" as a distinct skill set.
- **Lenny's "Why PMs are best positioned" (2024-08)**: established the optimistic baseline that the corpus has since refined rather than overturned.
- **Aman Khan's "Beyond vibe checks" (2025-04)**: introduced evals as a defining AI-PM skill.
- **Tal & Aman's "Build AI product sense" (2026-02)**: shifted the prescription from "read about AI" to "use Cursor for daily work for months." The first widely-adopted prescriptive method.
- **Cat Wu episode (2026-04)**: most authoritative recent statement; codifies the product-taste + AGI-calibration + lightweight-PRD framing as established practice.

## Open questions

- How do you train AI product taste in PMs who didn't grow up shipping products? Tal & Aman's Cursor-based method is one answer; nobody has proven it scales beyond self-selected motivated learners.
- What's the right ratio of PM:engineer in an AI-native team? Cat Wu's example (Anthropic Claude Code: many engineers shipping end-to-end without PMs) suggests it can be very low; but this may be specific to teams full of "engineers with great product taste."
- Does product taste correlate with AI-evals skill, or are they separate? Anecdotal corpus signal is they correlate but no formal study yet.
- For B2B / enterprise AI products with long sales cycles and high-stakes integrations, are these "5 skills" sufficient or are there enterprise-specific additions?

## Cross-corpus reinforcement (How I AI as secondary signal)

How I AI episodes (Brian Scanlan at Intercom, Hilary Gridley, Al Chen at Galileo, Claire Vo herself) consistently demonstrate non-PM functions doing PM-shaped work using AI tools. **Reinforces** Cat Wu's "skills are merging across roles" claim. The Gridley + Scanlan + Al Chen episodes also reinforce the "use coding agents to build intuition" recommendation: their workflows are exactly what Tal & Aman prescribe in the abstract.

## See also

- Cautions: see [`../cautions/ai-replacing-pms.md`](../cautions/ai-replacing-pms.md) — Keith Rabois's "PM is dead" framing is a related cross-reference; this topic is the constructive complement (what skills you build) to the cautionary "what claims to dismiss."
- Related topics: `ai-replacing-pms`, `evals-for-ai-products`, `vibe-coding`, `prompt-engineering`, `ai-prototyping`, `top-1-percent-pm`, `product-sense`, `decision-making-frameworks`.
- Books: none directly applicable. Tal & Aman's [Build AI Product Sense workshop](https://buildaiproductsense.com/) is the canonical curriculum.
