---
topic_slug: working-with-pms-as-engineer
display_name: Working with PMs as an engineer
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2024-09-15 .. 2026-04-23
---

# Working with PMs as an engineer

## Current consensus (cross-functional view, written for engineers)

The PM role has changed substantially in 2024-2026 (cf. [ai-replacing-pms](ai-replacing-pms.md), [ai-pm-skills](ai-pm-skills.md)). For engineers working with PMs, the corpus consensus is that the engineer-PM relationship has gotten *better* with AI tooling, not worse — but only when both sides update their priors.

What annoys engineers about PMs (Camille Fournier, Sept 2024 — the canonical Lenny episode for this perspective):

1. **Hoarding credit.** PMs are the customer-facing voice; engineers can feel invisible. Easy fix: share credit explicitly, in writing, in front of leadership.
2. **Not understanding details and acting like they don't matter.** "Engineering done successfully really is all about the details." A PM who says "this seems small, just ship it" without understanding why it's not small loses engineer trust permanently.
3. **Not involving engineers in ideation.** "A lot of people assume that engineers just write code; don't underestimate the ability for your engineers to want to understand the business problem, want to understand the customer problem." Best PMs aren't threatened by engineer ideas; they integrate them.
4. **Triggering major rewrites without understanding the cost.** Fournier: "rewrites are often a trap." Push back hard on PRs that come with "let's rewrite this whole module."

What changes in 2026 (Cat Wu / Anthropic, April 2026):

- **PMs are doing engineering work; engineers are doing PM work.** The boundary is dissolving. Cat Wu: "you can either hire a lot more engineers who have great product taste, or you can keep your engineering hiring the same and hire a lot more PMs."
- **Engineers ship end-to-end** at AI-native companies. At Anthropic Claude Code: "many engineers on our team who are fully able to end to end go from see user feedback on Twitter through to ship a product at the end of the week with almost no product involvement."
- **The PM job is creating the framework and the goal**, not coordinating standups. PRDs are now lightweight (clear goal, clear user, clear top use cases). Don't expect a 30-page document.

### What engineers should ask of PMs

- **Crisp goals, not feature lists.** A PM who can't tell you in two sentences what the product needs to be a month from now is operating below the current bar.
- **Customer / user grounding.** PMs who haven't talked to users recently are flying blind. Ask: "When did you last talk to a paying customer?" Acceptable: this week. Bad: this month or "I read tickets." Cf. Marty Cagan's empowered-PM canon.
- **Shared context for tradeoffs.** When a PM says "ship faster," they should explain what gets cut. When they say "do it right," they should explain what justifies the time.
- **Willingness to say no to leadership and stakeholders on the engineer's behalf.** Cf. [pm-influence](pm-influence.md). A PM who can't deflect a bad ask from sales or exec is making your life worse, not better.

### What engineers should bring to PMs

- **Concrete prototypes when arguing for a different direction.** Cat Wu and Aparna Chennapragada: prototypes are now table stakes for cross-functional debate. "I'd build it differently" without a prototype is much weaker than "look at this clickable mock I made in 30 minutes."
- **Eval intuition.** AI features without evals are vibe-shipping. If you're skeptical of a PM's AI feature spec, ask "what's the eval pass rate?" Cf. [evals-for-ai-products](evals-for-ai-products.md).
- **Honesty about effort.** Engineers who consistently underestimate effort lose credibility. Engineers who consistently overestimate are seen as foot-dragging. Calibration matters.

### What's no longer worth fighting about (in most cases)

- **Whether PMs should write or ship code.** They will. Cat Wu's team's PMs ship code routinely. Pushback that "PMs shouldn't touch the codebase" is increasingly obsolete unless you have specific safety / on-call concerns.
- **Whether the PM "really understands" the system.** Cursor / Claude Code-augmented PMs can iterate on prototypes against your real codebase without bothering you for every detail. Treat their prototypes as input to design, not as proof of understanding.

## What this means specifically for engineering managers and CTOs

- **Hire PMs the way Cat Wu describes**: prefer "engineers with great product taste" over "career PMs without engineering background" for AI-native team contexts. But know this isn't right for every product domain — for highly regulated, customer-research-heavy, or design-craft-heavy products, the career PM with deep domain expertise still wins.
- **Don't gate PMs from your codebase.** Modern coding-agent tooling makes "PM accidentally breaks main" exceedingly rare; the upside (PM ships their own prototype Friday) outweighs the risk.
- **Build a high-trust environment** where engineers can push back on bad PM asks without political damage. Camille Fournier's warning about credit-hoarding and detail-dismissal is even more important in 2026 because the engineers can now ship around the PM if they want — high turnover follows broken trust.
- **Set the bar on cross-functional ideas, not roles.** Patrick Campbell, Cat Wu, and Nikhyl Singhal all converge: hire builders regardless of background. Engineering managers who insist their team only does engineering will lose to managers who treat their team as a builder pool.

## How thinking has evolved

Earliest takes (corpus, oldest first):

- **2023-2024**: Camille Fournier (formerly CTO at Rent the Runway, *The Manager's Path* author) — Sept 2024 episode is the canonical Lenny piece on engineer-PM dynamics. Identifies credit-hoarding, detail-dismissal, ideation-exclusion, and rewrite-naivety as the four engineer grievances. ([Lenny's Podcast](https://www.youtube.com/watch?v=hZSh0rs20uI))

- **2024-02-22**: Will Larson (Carta CTO) — engineering mindset; emphasizes that engineers are problem-solvers and want context, not just specs. ([Lenny's Podcast](https://www.lennysnewsletter.com/p/the-engineering-mindset-will-larson))

Recent takes:

- **2026-04-23**: Cat Wu (Anthropic) — most authoritative recent statement of how the PM-engineer boundary works at an AI-native company. Skills are merging; engineers ship end-to-end; PMs create frameworks not orchestrate. ([Lenny's Podcast](https://www.lennysnewsletter.com/p/how-anthropic-product-team-moves-faster))

- **2026-04-19**: Nikhyl Singhal — the bifurcation framing. Information-mover PMs out; builder PMs in. Implication for engineers: the PM you're paired with in 18 months may have been an engineer themselves.

External current consensus (web, weighted recent + AI-aware):

- Marty Cagan's [Inspired](https://www.amazon.com/INSPIRED-Create-Tech-Products-Customers/dp/1119387507) and [Empowered](https://www.amazon.com/EMPOWERED-Ordinary-Extraordinary-Products-Silicon/dp/111969129X) remain the canonical "what good PMs look like to engineers" reference; the Cagan model is widely shared in engineering leadership circles.
- "Build vs. Buy vs. AI" debates frequently surface engineer-PM tensions; aligning on framework choice early prevents them.

## Inflection points

- **Camille Fournier episode (Sept 2024)**: codified the four engineer grievances about PMs.
- **Aparna Chennapragada "if you aren't prototyping with AI, you're doing it wrong" (May 2025)**: shifted PMs to be expected to ship prototypes, not just specs.
- **Cat Wu / Cognition / Anthropic etc. AI-native company demos (2026)**: shifted the PM-engineer dynamic from "PM specs, engineer builds" to "either ships, both review."

## Open questions

- Does the engineer-PM dynamic at AI-native companies (Anthropic, Cognition, Lovable) generalize to non-AI-native companies? Probably partially, but the rate of role-merging differs.
- For very technical infrastructure / platform products (databases, observability tools): does the "PM ships code" model work, or does specialization re-emerge? Corpus has not addressed this directly.
- Junior engineer development: when PMs and senior engineers are both shipping with Claude Code / Cursor, does the junior engineer learn faster or slower? Open question, debated across multiple corpus episodes.

## See also

- Related topics: `ai-pm-skills`, `ai-replacing-pms`, `pm-influence`, `working-with-pms-as-designer`, `working-with-pms-as-sales`, `pm-pitfalls`, `spotting-bad-pm-behaviors`, `vibe-coding`.
- Books: [The Manager's Path](../books/managers-path.md) (Camille Fournier), [Inspired](../books/inspired.md) (Marty Cagan), [Empowered](https://www.amazon.com/EMPOWERED-Ordinary-Extraordinary-Products-Silicon/dp/111969129X) (Marty Cagan & Chris Jones).
