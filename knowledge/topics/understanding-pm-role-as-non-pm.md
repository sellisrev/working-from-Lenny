---
topic_slug: understanding-pm-role-as-non-pm
display_name: Understanding what PMs actually do (a primer for non-PMs)
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2022-08-21 .. 2026-04-23
---

# Understanding what PMs actually do (a primer for non-PMs)

If you're an engineer, designer, sales lead, finance lead, exec, or board member who needs a working model of what product managers actually do — this is the corpus consensus.

## Current consensus

A product manager has three core jobs (Lenny, [What is product management](https://www.lennysnewsletter.com/p/what-is-product-management); confirmed across 100+ Lenny guests):

1. **Shape the product**: figure out what to build. This is the work of customer discovery, prioritization, deciding what the product *is* (and isn't), and translating between strategic intent and concrete features.
2. **Drive execution**: make the team move. Coordinate cross-functional work; unblock; communicate decisions; create the framework for how the team operates; make tradeoff calls under uncertainty.
3. **Lead the team**: cultural and motivational work. Set context, give meaning to work, recognize contributions, make the team a place strong people want to stay.

What PMs *don't* primarily do (common misconceptions):

- They're not project managers (project management is a tool they use, not their job).
- They're not the boss of engineers, designers, or sales (they have responsibility but rarely formal authority — cf. [pm-influence](pm-influence.md)).
- They don't write code by default (though increasingly they prototype, especially in AI-native companies — cf. [vibe-coding](vibe-coding.md)).
- They're not "the customer's voice" alone (engineers, designers, support all interact with customers; the PM synthesizes across these inputs).

## What "good" looks like (and why it's hard to spot)

Marty Cagan's framing (canonical Lenny episode 2022, *Inspired* / *Empowered* author): the difference between best and rest is enormous, and most companies don't know what good looks like because they've never seen it.

A *good* PM:
- Knows the customer better than anyone else on the team.
- Makes conviction-led decisions and updates them when evidence demands.
- Sees the difference between what users say vs. what they do, and weights accordingly.
- Says "no" to most ideas and explains why credibly.
- Communicates tradeoffs without flinching.
- Builds trust with engineers and designers by understanding their work, not just managing it.

A *bad* PM (Ben Horowitz's classic ["Good Product Manager / Bad Product Manager"](https://a16z.com/good-product-manager-bad-product-manager/)):
- Acts as a glorified ticket-mover.
- Owns the roadmap as a static artifact, not a living tool.
- Hides behind "leadership decided" rather than owning decisions.
- Communicates in jargon to obscure thin understanding.
- Hoards credit (cf. [working-with-pms-as-engineer](working-with-pms-as-engineer.md)).

## The PM role in 2026 (post-AI shift)

Cf. [ai-pm-skills](ai-pm-skills.md) and [ai-replacing-pms](ai-replacing-pms.md) for full treatment. Brief summary:

- **The "information mover" PM is being shed.** Companies are restructuring; the PM whose primary value-add was orchestration is increasingly redundant.
- **The "builder" PM is in renaissance.** Hands-on, ships prototypes, makes calls, can use Cursor / Claude Code, exercises product taste.
- **PMs and engineers are blurring at AI-native companies.** Cat Wu (Anthropic): "you can either hire a lot more engineers who have great product taste, or you can keep your engineering hiring the same and hire a lot more PMs."
- **PRDs are now lightweight.** Clear goal, clear user, top use cases — not 30-page specs.

## What this means for non-PM consumers

- **If you're an engineer who's about to start working with a PM**: the PM's job is *not* to tell you what to build. The PM's job is to bring you the customer-grounded reasoning so the team can together decide what to build. Push back when reasoning is missing; respect the role when reasoning is solid.
- **If you're a designer asked "is this PM any good?"**: ask yourself whether they engage your input on UX as a substantive design choice, or whether they treat it as a downstream production task. The former is good; the latter is a warning sign.
- **If you're a sales lead frustrated by your PM not prioritizing the deal-blocking feature**: the PM may be right (the deal isn't representative of broader demand) or wrong (your sales pipeline is genuinely the canary). Don't demand prioritization; demand reasoning. A PM who can't articulate why a feature you want is deprioritized is probably operating below the bar.
- **If you're a CFO or finance lead reviewing PM headcount**: a good PM should pay for themselves by preventing wasted engineering work. The ROI math: 1 senior PM ≈ $250-400k all-in cost; a single avoided "spent 3 months building the wrong feature" mistake on a 5-engineer team ≈ $400k-$700k. PMs are not cost centers if they're functioning.
- **If you're an exec or board reviewing org design**: don't confuse "we have a PM team" with "we have product management." Many companies have the title without the function. Check whether your PMs have decision authority on what gets built and whether they're empowered to say no to leadership.

## How thinking has evolved

Earliest takes (corpus, oldest first):

- **2018-2022**: corpus establishes the PM role canon. "Should I become a PM?" "How to get into PM" "Career ladders" "Comprehensive survey" — Lenny's foundational treatment.

- **2022-08-21**: Marty Cagan — "The nature of product." Canonical podcast episode on what PMs do at the best companies. Establishes the "best vs rest is enormous" thesis. ([Lenny's Podcast](https://www.youtube.com/watch?v=h-KVGHoQ_98))

Middle period:

- **2023-12-21**: Christian Idiodi (SVPG) — "The essence of product management" reinforces Cagan's framing.

- **2024-01-21**: Shreyas Doshi — "4 questions Shreyas Doshi wishes he'd asked himself sooner." Defines mature-PM craft from a long-tenure operator perspective.

Recent takes:

- **2026-04-19**: Nikhyl Singhal — bifurcation framing. Half of PMs are in trouble; the other half is in renaissance. The role hasn't disappeared; it has fragmented into archetypes with very different futures.

- **2026-04-23**: Cat Wu — most authoritative recent statement of how PM role works at AI-native companies. Frame, goals, lightweight PRDs, fast research preview, cross-functional process.

External current consensus (web, weighted recent + AI-aware):

- Marty Cagan's *Inspired* and *Empowered* remain the canonical reference. Updates needed for 2026 (per Cagan's own recent writing, available on SVPG site).
- Ben Horowitz's "[Good Product Manager / Bad Product Manager](https://a16z.com/good-product-manager-bad-product-manager/)" is widely cited as the canonical "bad PM signs" reference.

## Inflection points

- **Cagan / SVPG canon (2017+)**: established what "good" looks like in a way the broader industry could reference.
- **Lenny's "Comprehensive survey of Product Management" + role-related canon (2020-2022)**: gave non-PMs an accessible primer.
- **AI-era role bifurcation (2025-2026)**: changed what a non-PM should expect from "their PM."

## Open questions

- For B2B / enterprise products with deep domain expertise (legal tech, healthcare, regulatory), is the AI-era "builder PM" framing still right, or do these contexts need traditional PM expertise? Probably both, but the corpus has not addressed.
- For pre-PMF startups: when does it make sense to hire a PM at all? Cf. [when-to-hire-first-pm](when-to-hire-first-pm.md). Generally "later than you think."
- For non-software product companies (hardware, services, etc.): how does the AI-era PM framing translate? Corpus has not addressed.

## See also

- Related topics: `ai-pm-skills`, `ai-replacing-pms`, `pm-influence`, `working-with-pms-as-engineer`, `working-with-pms-as-designer`, `spotting-bad-pm-behaviors`, `hiring-pms-as-non-pm`, `top-1-percent-pm`, `pm-pitfalls`.
- Books: [Inspired](../books/inspired.md), Empowered, [The Hard Thing About Hard Things](../books/hard-thing-about-hard-things.md). Ben Horowitz's blog post above.
