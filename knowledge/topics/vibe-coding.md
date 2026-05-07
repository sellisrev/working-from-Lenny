---
topic_slug: vibe-coding
display_name: Vibe coding and PM prototyping with AI
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 8
date_range_processed: 2025-05-01 .. 2026-05-07
---

# Vibe coding and PM prototyping with AI

## Current consensus

Vibe coding (using AI tools like Cursor, Claude Code, Replit, Lovable, Bolt, v0 to generate working software with minimal hand-edited code) has progressed from "controversial early-2025 experiment" to "standard production practice at AI-native companies" within twelve months. The practice now spans three legitimate use cases that should be treated separately:

1. **PM/designer rapid prototyping** — clickable mocks built from screenshots or descriptions in minutes; widely used and largely unchallenged. Standard tools: v0, Bolt, Lovable, Magic Patterns. Lower stakes; mistakes are caught in review. ([Colin Matthews via Lenny, 2025-06-10](https://www.lennysnewsletter.com/p/how-to-get-your-entire-team-prototyping-with-ai))
2. **Non-engineers shipping personal/internal tools** — 1,000+ stories of useful real-world tools, often hitting tens of thousands of users. ([Lenny, 2025-07-08](https://www.lennysnewsletter.com/p/what-people-are-vibe-coding-and-actually-using))
3. **Production engineering with strong harnesses** — companies like Intercom report 2x merged-PR throughput in nine months with 100% of engineers (plus designers/PMs/TPMs) shipping via Claude Code, but only when paired with skills repositories, hooks, telemetry, and quality gates. ([Brian Scanlan, How I AI, 2026-04-20](https://www.youtube.com/watch?v=BRDKft0-dUU))

**For non-PM consumers**: if you're an engineering leader, expect your PMs and designers to come with working clickable prototypes, not Figma. If you're a hiring manager, asking "have you shipped something you vibe-coded?" is now a more useful signal than "have you written a PRD?" — both for PM and non-PM creative roles. If you're an exec evaluating a product bet, the speed-to-prototype standard has compressed; "we'll build a prototype in a sprint" should now be "by end of week."

The big remaining tradeoff (from Michael Truell, who builds Cursor): generating code you don't understand creates a cliff — works fine until the codebase exceeds your ability to debug. Cat Wu's framing is similar: PM taste is becoming more valuable than careful execution, but only because the underlying judgment of what to ship gets harder, not easier. Treat vibe-coded artifacts as **disposable** until they have tests + structure that survive a model upgrade.

## How thinking has evolved

Earliest takes (corpus, oldest first):

- **2025-05-01**: Michael Truell (Cursor CEO) — "vibe coding right now describes exactly this state of creation that is pretty controversial, where you're generating a lot of coding, you aren't really understanding the details... very quickly get to a place where you're kind of limited at a certain point." Frames it as a stepping-stone, not the destination. ([Lenny's Podcast](https://www.youtube.com/watch?v=En5cSXgGvZM))

- **2025-05-18**: Aparna Chennapragada (Microsoft CPO) — "If you aren't prototyping with AI, you're doing it wrong" + Chrome extension prompting "how can you use AI to do what you're going to do right now?" Hard normative push. ([Lenny's Podcast](https://www.youtube.com/watch?v=HbbfXAWcuUo))

Middle period:

- **2025-06-10**: Colin Matthews (Lenny newsletter) — AI prototyping has become "more common than not" for product teams. Detailed handoff guidance for v0, Bolt, Cursor, Magic Patterns; component-library workflows.
- **2025-07-08**: Lenny — collected 1,000+ stories of vibe-coded tools in real use. "Welcome to the era of n-of-1 personalized software." Notes more women vibe-coding than male/female ratio in tech generally — practice is broadening past the early-adopter circle.

Recent takes (last six months):

- **2026-04-06**: Al Chen on How I AI — non-engineer at Galileo built a 15-repo Claude Code system to handle technical customer support; doesn't have to write the orchestration script ("just said help me figure out a way to pull the latest main branches"). Implication: the gating skill for tier-2 customer support is no longer "knows the codebase" but "can ask Claude Code the right question."
- **2026-04-20**: Brian Scanlan (Intercom senior principal engineer) — "twice the number of throughput as we did compared to 9 months ago"; 100% of engineers, designers, PMs, TPMs ship via Claude Code. Inflection moment for him: November-December 2025, when "imagination is now the barrier not the tool."
- **2026-04-23**: Cat Wu (Anthropic, Head of Product, Claude Code) — emphasizes the importance of being "the right amount of AGI-pilled." Standard practice at Anthropic: ship features in research preview, brand them clearly, iterate in 1-2 weeks. PM's job is choosing what to ship more than ensuring it's correctly built.
- **2026-05-07**: Claire Vo (How I AI) — Code with Claude announcements: routines (cron triggers), Outcomes (rubric-graded autonomous loops, up to 20 iterations), Dreams (agent memory written from session reviews), multi-agent orchestration. The primitive layer is hardening fast.

External current consensus (web, weighted recent + AI-aware):

- "Vibe coding" coined by Andrej Karpathy in February 2025; by mid-2026 the practice has split into the three lanes above. Consensus aligns with the corpus on the "production needs harnesses" point.
- Survey data from Lenny's 2026 productivity survey ([newsletter, 2026](https://www.lennysnewsletter.com/p/ai-tools-are-overdelivering)): respondents report AI tools are *exceeding* their predicted productivity gains. The corpus matches.

## Inflection points

- **Cursor reaches $300M ARR (April 2025)**: industry-wide acknowledgment that AI code editing is past the toy stage; before this, "AI coding tool" still felt like an experiment.
- **Claude Sonnet 4.6 / Opus 4.6 release (Nov-Dec 2025)**: Brian Scanlan's "every 3 months I have a breakthrough moment" centers here. The corpus inflects from "this could work" to "we are 2x'ing velocity right now."
- **Code with Claude event (2026-05-07)**: introduction of routines, Outcomes (autonomous agent grading), Dreams (memory), and multi-agent orchestration. Vibe coding shifts from "single human prompts AI to write code" toward "agents run on schedules and grade themselves." Implication: prior advice about "always be in the loop" is being challenged by the platform itself.
- **Claude Code source code leak (April 2026)**: the leak was caused by human + AI mistake in PR review (Cat Wu attributes to "human error"). Cautionary inflection: even at Anthropic, AI-assisted PR review can be a vector for serious incidents. Reinforces the "harness, telemetry, gates" lesson.

## Open questions

- Does vibe-coded production code have higher or lower long-term defect rates than human-written code? Intercom claims quality is up; not yet a multi-company longitudinal study.
- How does the "taste" skill get developed in juniors who never had to manually carefully implement features? Cat Wu and Michael Truell both flag this; no consensus answer in corpus.
- When agents run on cron and grade themselves to a rubric (Outcomes), how is human judgment kept in the loop without becoming the bottleneck Brian Scanlan was trying to avoid?
- Pricing: at $200/month (Anthropic Max) or comparable Cursor tiers, the "subsidy" Cat Wu and Lenny discuss is implicitly funded by frontier labs. What happens to the productivity claims when pricing rationalizes?

## Cross-corpus reinforcement (How I AI as secondary signal)

The How I AI episodes (2026-04-06 Al Chen, 2026-04-20 Brian Scanlan, 2026-05-07 Claire Vo) all reinforce the main-corpus shift from "vibe coding is controversial" (Truell, May 2025) toward "vibe coding with the right harnesses is the dominant production practice at AI-native companies" (Scanlan, April 2026). No How I AI episode has been found that contradicts the main corpus on this topic. Treated as **reinforcing signal**, raising confidence in the obsolete claim about vibe coding being limited to non-production prototyping.

## See also

- Obsolete claims for this topic: [`../obsolete/vibe-coding.md`](../obsolete/vibe-coding.md)
- Cautions for this topic: [`../cautions/vibe-coding.md`](../cautions/vibe-coding.md)
- Related topics: `evals-for-ai-products`, `ai-coding-agents`, `ai-prototyping`, `ai-pm-skills`, `velocity-core4`
- Books: none directly applicable; the practice predates books on the topic.
