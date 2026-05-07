---
topic_slug: decision-making-frameworks
display_name: Decision-making frameworks
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 6
date_range_processed: 2024 .. 2026-04
---

# Decision-making frameworks

## Current consensus

Three frameworks dominate the corpus and stack well together.

### 1. Annie Duke: separate decision quality from outcome quality

Most influential decision-making framework in the corpus. Core points:
- **A good decision can have a bad outcome.** A bad decision can have a good outcome. Don't grade decisions by outcomes alone.
- **Pre-mortem.** "Imagine the project failed in 18 months. What killed it?"
- **Kill criteria up front.** Define in advance what would cause you to stop. Without kill criteria, sunk cost takes over.
- **Calibrate uncertainty.** Use probability ranges; force yourself to bet (mentally or actually).

### 2. The strategy stack (Ravi Mehta, cf. [product-strategy](product-strategy.md))

Mission → Vision → Strategy → Goals → Roadmap → Task. Use this to locate any decision in the hierarchy. "Should we do X?" decisions are easy when you can trace X back through goals to strategy. Decisions that don't trace back are usually wrong.

### 3. Second-order thinking (Kunal Shah, Howie Liu)

Think past first-order consequences. "If we ship X, what happens? Then what? Then what?" Most strategic mistakes come from missing second- or third-order effects.

### 4. Reversibility test (Bezos / Lenny "decision-making frameworks" newsletter)

Type-1 (irreversible, high-stakes) decisions deserve careful deliberation. Type-2 (reversible, low-cost) decisions should be made fast. Many teams over-deliberate Type-2 and rush Type-1; reverse this.

### 5. The 30-day rehire test (Keith Rabois, applied to hiring)

For hiring decisions specifically: 30 days after the hire, would you make the same decision? Per Rabois citing research, 30-day judgment is approximately as accurate as 1-2 year judgment. Cf. [hiring-pms-as-non-pm](hiring-pms-as-non-pm.md).

## What's changed in 2025-2026

- **Cost of changing your mind has dropped.** AI tooling makes prototypes cheap; you can test decisions empirically rather than reasoning to conclusions. This favors more Type-2 framing of what used to feel Type-1.
- **The judgment premium has risen** (Singhal). When the cost of building options is low, judgment becomes the scarce resource. Decision-making craft is more valuable, not less.
- **Decision logging.** Kevin Yien (2024) "logging every decision" workflow: keep a decision journal, review periodically, calibrate your own judgment over time. Increasingly seen as table-stakes for senior PMs and execs.

## What this means for non-PM consumers

- **If you're an engineer disagreeing with a product decision**: separate "the decision was wrong" from "the outcome will be bad." A reasoned-from-incomplete-information decision can be defensible even when wrong. Push back on reasoning, not on outcome predictions.
- **If you're an exec or board member**: insist on pre-mortems before approving big bets. The team's failure modes reveal what they understand vs. don't.
- **If you're a CEO making hard calls**: decision logs (Kevin Yien) are highest-leverage for self-improvement. Cost: 5 minutes per decision; benefit: calibrated judgment over years.
- **If you're a non-PM cross-functional partner**: when proposing a course of action, anchor on type-of-decision (Type-1 vs Type-2). Frames the conversation about how much deliberation is warranted.

## How thinking has evolved

- **Pre-2024**: Lenny accumulates decision-making canon. My favorite decision-making frameworks (Lenny, 2024-04) compiles.
- **2024-04-25**: Annie Duke on Lenny's Podcast — most influential single decision-making episode. Pre-mortem, kill criteria, decision-vs-outcome separation. ([Lenny's Podcast](https://www.youtube.com/watch?v=_QGxrqJaOpY))
- **2024**: Kunal Shah on second-order thinking; Kevin Yien on decision logging.
- **2025-2026**: AI-era reframing — judgment premium rises as building cost drops.

## See also

- Related topics: `evaluating-product-bets`, `assessing-product-strategy-as-board`, `product-strategy`, `defending-big-bets`, `prioritization-frameworks`, `first-principles`, `pivots-art`.
- Books: [Thinking in Bets](../books/thinking-in-bets.md), [Quit](../books/quit.md) (both Annie Duke), [Thinking, Fast and Slow](../books/thinking-fast-and-slow.md) (Kahneman).
