---
topic_slug: mission-vision-strategy
display_name: Mission Vision Strategy Goals Roadmap chain
last_updated: 2026-05-10
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2022 .. 2026
---

# Mission Vision Strategy Goals Roadmap chain

## Current consensus

The corpus standardizes on a layered abstraction stack: **Mission → Vision → Strategy → Goals → Roadmap → Task**. Each layer constrains the next; each layer answers a different question. Anchored in Lenny "Mission → Vision → Strategy → Goals → Roadmap → Task" (2022) + Ravi Mehta strategy stack episode (2025-09).

### What each layer does
- **Mission**: why does the company exist? (1-sentence aspirational; rarely changes.)
- **Vision**: what does the future look like if we succeed? (5-10 year picture; concrete enough to be motivating.)
- **Strategy**: how will we get there? (Multi-year; logical plan with explicit choices.)
- **Goals**: what's the measurable outcome over the next 6-12 months? (Quantifiable; OKR-style.)
- **Roadmap**: what work serves the goals? (Themes + items, ordered.)
- **Task**: what specifically gets shipped? (Day-to-day execution.)

### Why the chain matters
- **Each task should trace back through the chain.** A task that doesn't trace back is reactive, not strategic.
- **PMs operate up and down the chain.** Junior PMs work in roadmap/task; staff PMs in strategy/goals; executives in mission/vision/strategy.
- **The chain is the integrity check.** If the answers at any layer don't connect, the team will execute incoherently.

### Common failure modes
- **Skipping layers.** "Mission → Roadmap" without strategy produces feature factories.
- **Conflating layers.** Treating goals as strategy (output as input).
- **Mission-Vision drift.** Companies often abandon their stated mission when growth pressure conflicts; corpus consensus treats this as a leadership failure, not a pragmatic adjustment.
- **Static documents.** A strategy doc that hasn't been revisited in 2 years is decoration.

### Ravi Mehta's strategy stack framing (2025)
"The product strategy stack is a system that helps people understand what framework they're using in order to make decisions and what's going to drive value for the business." Ravi's emphasis: the stack reveals the difference between PMs who can prioritize confidently and PMs who flip-flop.

### What's changed in 2025-2026
- **AI compresses execution; doesn't change strategy stack.** The chain structure is durable; the cycle time at the bottom (roadmap, task) compresses.
- **Founder-mode IC CEOs** sometimes operate the whole chain personally for narrow scopes. Cf. [founder-mode](founder-mode.md).

### Mission-driven vs mission-hopeful (Ries, 2026-05)
Eric Ries (Lenny's Podcast, 2026-05-10) introduces a corpus-significant distinction: most "mission-driven" companies are actually *mission-hopeful* — the mission is a candy-coating on an extractive engine. Ries's audit test: can you make money *only* by achieving the mission, or also by betraying it? If both, you are mission-hopeful, regardless of what your About page says.

The practical reframing for this topic: a mission statement is not the artifact. The artifact is the **apparatus** that makes the mission expensive to betray.

> *"Quarterly reporting is the thing we're sure of. Don't-be-evil was just a slogan. If someone tells you, 'I'm serious about something,' great. Now show me the apparatus. Show me the commitments you've made to make sure that happens every time, no exceptions. And if you don't have one, then they are lying to you no matter how good their intentions are."* — Ries on the Don't-Be-Evil-vs-Quarterly-Report contrast at Google.

Ries replaces "stakeholder" with the older word *fiduciary*, and "values" with *ethos*. The operative question is: **who would you rather die than betray?** Then identify the metric that audits each fiduciary commitment and the system that makes it as important as making money.

Implications for the chain:
- **Mission** layer gets a structural audit, not just a sentence. Saul Price's "customers first, employees second, shareholders last" (Costco's foundational ethos) is the genre — declarative, rankable, auditable.
- **Goals** layer should include fiduciary-aligned metrics, not only growth/revenue metrics. "OKRs for stakeholders" is how Lenny re-paraphrased Ries on-pod.
- **Strategy** layer should answer: which of the five things-that-get-cut-first (safety, performance, quality, design, innovation) are we structurally protecting, and how?

The new framing reinforces, rather than contradicts, the corpus consensus on the layered chain. Ries simply pushes harder on the **integrity layer between mission and goals**: without an apparatus, the mission decays into a slogan within a few growth cycles.

## What this means for non-PM consumers

- **If you're an exec reviewing a team's plan**: ask for the chain. Missing layers reveal incomplete strategy.
- **If you're an engineer or designer**: when work feels reactive, push back at the layer above the work — usually strategy or goals.
- **If you're a board member**: the mission-vision-strategy chain is the appropriate altitude for board conversations. Tasks belong below your altitude.

## How thinking has evolved

- **2022-12**: Lenny Mission → Vision → Strategy chain newsletter.
- **2025-09**: Ravi Mehta on the strategy stack as decision-making system.
- **2026-05**: Eric Ries on Lenny's Podcast — mission-driven vs mission-hopeful distinction. The mission layer requires an apparatus, not just a sentence; reframes integrity as a structural property between mission and goals rather than a personal-character property of the leader.

## See also

- Related topics: `product-strategy`, `evaluating-product-bets`, `assessing-product-strategy-as-board`, `roadmaps`, `prds-and-1-pagers`, `okrs`, `defending-big-bets`, [`founder-governance`](founder-governance.md) (the structural side of mission protection).
- Books: [Good Strategy / Bad Strategy](../books/good-strategy-bad-strategy.md), [7 Powers](../books/seven-powers.md), [Incorruptible](../books/incorruptible.md) (Ries) — the mission-as-apparatus framing; Roger Martin's [Playing to Win](https://www.amazon.com/Playing-Win-Strategy-Really-Works/dp/142218739X).
