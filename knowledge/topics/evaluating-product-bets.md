---
topic_slug: evaluating-product-bets
display_name: Evaluating and giving feedback on product bets (cross-functional)
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2020-06-23 .. 2026-04-19
---

# Evaluating and giving feedback on product bets (cross-functional)

## Current consensus

If you are reviewing a proposed product bet without owning its implementation (board, exec, investor, peer-function lead, manager), there is a stable set of frames that consistently surface real risk. The corpus has reorganized these into one current-best version below.

### The five questions to insist on (Roger Martin, 2024)

1. **What is the winning aspiration?** Not "what is the goal" but "what would winning look like for the company / business unit doing this?" If the answer is vague, the bet has no scoring frame and you cannot evaluate it.
2. **Where to play?** What specific playing field is selected? Customer segment, product category, geography, channel. "Everywhere" is not a valid answer.
3. **How to win?** In the chosen field, will the bet win by being lower-cost or by being more differentiated? Pick one and defend it.
4. **What capabilities must we have that competitors don't?** A bet without an answer here is a bet on a feature, not a strategy. The question separates "thing we could do" from "thing only we could do."
5. **What enabling management systems support the capabilities?** Without this, the capabilities atrophy. This is also the point at which the bet starts to require non-product investment — staffing, process, training, telemetry — that often gets cut and dooms the bet later.

If a presented bet doesn't have crisp answers to all five, the right feedback is: "this isn't ready for a yes/no decision yet. Bring it back when you can answer all five."

### The "big bet" defense pattern (Lenny, 2021)

When evaluating a long-running big bet, ask: **what are the team shipping in parallel that's earning trust right now?** Lenny's rule of thumb is that the team should spend ~80% on short-term low-risk wins and ~20% on the big bet. A team that's spending 100% on the big bet has nothing to absorb the loss of patience that will come the first time a higher-priority fire shows up. Cf. [Defending your big bets](https://www.lennysnewsletter.com/p/defending-your-big-bets).

### Pre-mortem the bet (Annie Duke, 2024)

Before committing, ask: "imagine it's 18 months from now and this bet failed. What killed it?" The answers reveal which assumptions are load-bearing and which are taken on faith. Bets where the team can't generate a plausible failure mode are the most dangerous bets — usually because the team hasn't internalized the downside.

### Stop-or-pivot criteria up front (Jason Cohen, 2026)

For a bet that's already running and showing slowing growth, Jason Cohen's [5 questions](https://www.youtube.com/watch?v=8xLquwfx6p0): logo retention, pricing, NRR, marketing channels, target market. Make the team answer all five before committing more resources. The questions force a re-examination of the foundation, not just the surface metric.

### Singhal's "judgment" frame (2026)

In an AI-tooling era, the cost of building options has dropped dramatically. The valuable scarce resource is judgment about which option is correct. Bets that are about "should we build this?" are now under more pressure than bets about "should we ship the thing we built?" Reviewers should weight judgment-quality of the proposing team more heavily than implementation-feasibility, because the latter has gotten easier.

## What this means for non-PM consumers

- **If you're a board member or investor reviewing a portfolio company's product bet**: ask the five Martin questions explicitly. Don't accept "trust the team" as a complete answer if "where to play" or "how to win" are missing.
- **If you're a CEO / CFO reviewing an internal team's bet**: focus on the management-systems question (#5). Most bet failures in the corpus trace to capabilities that existed at proposal time but were not maintained when the team had to also ship cover-fire incremental wins.
- **If you're a peer-function lead (eng, design, sales) being asked to support a bet**: pre-mortem out loud at the proposal meeting. If the team can't generate plausible failure modes, your support is being asked for prematurely.
- **If you're giving feedback on a bet pitch**: separate the "is this a good bet?" question from the "is this team ready to take this bet?" question. Both can be answered "no" for different reasons.
- **If you're evaluating a marketplace business idea specifically**: most marketplaces fail not for marketplace-specific reasons but for fundamental business reasons (Lenny, 2020) — the bet evaluation should start with the standard questions before moving to liquidity / chicken-and-egg analysis.

## How thinking has evolved

Earliest takes (corpus, oldest first):

- **2020-06-23**: Lenny — evaluating a (marketplace) business idea: 7-question framework. Key insight: most marketplaces fail not because of marketplace dynamics but because of fundamentals (no demand, too small a market, can't acquire users). Use general business-evaluation rigor before marketplace-specific analysis. ([Evaluating a (marketplace) business idea](https://www.lennysnewsletter.com/p/evaluating-a-marketplace-business-idea))

- **2021-03-16**: Lenny — Defending your big bets: 80/20 rule (incremental cover fire + big bet); the bet that's not generating ongoing trust gets cancelled the first time priorities shift.

Middle period:

- **2024-05**: Annie Duke (Thinking in Bets author) — kill criteria, pre-mortem, decision-vs-outcome separation. The "decision quality is independent of outcome" frame becomes more central in corpus thinking.

- **2024-07-25**: Roger Martin — 5 essential questions framework. Becomes the canonical strategy-evaluation lens in the corpus thereafter.

Recent takes (last six months):

- **2026-01-25**: Jason Cohen (2x unicorn founder) — 5 questions to ask when your product stops growing: logo retention, pricing, NRR, marketing channels, target market. Reorientation framework for bets already in flight.

- **2026-04-19**: Nikhyl Singhal — judgment, not building, is the bottleneck. Bet evaluation should weight judgment quality more, build feasibility less, in 2026 vs 2022.

## Inflection points

- **2020-2022 marketplace boom -> bust**: a wave of "is this a good marketplace bet?" content; reframes most marketplace failures as fundamental-business failures.
- **2024 Roger Martin episode**: 5-questions framework becomes the corpus's go-to evaluation lens. Pre-2024 evaluation tended to be checklist-shaped; post-2024 it's question-driven.
- **AI tooling normalization (2025-2026)**: evaluation frame shifts from "can the team build this?" (mostly yes now) to "is this judgment correct?" (which is much harder to evaluate from outside the team).

## Open questions

- How does the 80/20 cover-fire rule (Lenny 2021) hold when AI tooling means a small team can ship cover fire much faster? Possibly the right ratio shifts toward bigger bets (60/40 or 50/50) for AI-native teams, but the corpus has not addressed this directly.
- Do AI-augmented bet proposals get easier or harder to evaluate? The proposal can be far more polished (faster prototypes, working demos) which can either reveal more truth or hide more risk.
- For boards reviewing very-early-stage companies: are the five Martin questions still tractable when the company is pre-PMF? Martin's frame implicitly assumes some market knowledge.

## See also

- Related topics: `defending-big-bets`, `product-strategy`, `good-strategy-rumelt`, `seven-powers`, `decision-making-frameworks`, `assessing-product-strategy-as-board`, `reviewing-prds-and-1-pagers`.
- Books: [Good Strategy / Bad Strategy](../books/good-strategy-bad-strategy.md) (Rumelt), [7 Powers](../books/seven-powers.md) (Helmer), [Thinking in Bets](../books/thinking-in-bets.md) and [Quit](../books/quit.md) (Annie Duke), [Playing to Win](https://www.amazon.com/Playing-Win-Strategy-Really-Works/dp/142218739X) (Roger Martin & A.G. Lafley — not yet in books.yml; should add).
