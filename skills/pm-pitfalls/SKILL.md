---
name: pm-pitfalls
description: Run a candid PM self-audit against twenty corpus-derived pitfalls (always/sometimes/never per pitfall), score it 0-20, and return the three highest-leverage pitfalls to fix this quarter, each with a corpus-anchored diagnosis, two concrete behaviors, and a named example. Reads `knowledge/topics/`. Use when the user asks to "audit my PM habits", "what am I doing wrong as a PM", "PM pitfalls self-check", "rate me on PM mistakes", "where am I weakest as a PM", or pastes self-ratings and wants the top things to fix. The Claude Code skill version of the Working from Lenny PM Pitfalls Self-Audit app.
---

# pm-pitfalls

The skill version of the #44 PM Pitfalls Self-Audit. A user rates themselves on twenty corpus-derived pitfalls; the skill returns the three highest-leverage ones to fix, grounded in the corpus. Companion to `lenny-actualize` (which builds the knowledge base) and `lenny-pressure-test` (which critiques plans). This skill **consumes** the knowledge; it does not extract new claims.

## Why this exists

The MCP App runs this as an iframe quiz. People who prefer Claude Code want the same audit without installing the bundle. The value is the same: not a list of things to worry about, but the three pitfalls where the user's behavior and the leverage of fixing it converge, each with a concrete next step and a corpus citation.

## When to use

Trigger on "audit my PM habits", "PM pitfalls self-check", "what am I doing wrong", "rate me on PM mistakes", "where am I weakest". If the user has not given ratings yet, present the twenty pitfalls and ask them to rate each always / sometimes / never. Never refuse on thin input: if they describe their situation loosely, infer likely ratings, name the assumption, and produce a compact audit.

## The twenty pitfalls (canonical, do not substitute)

Each rated always / sometimes / never. Leverage weight (3 = highest) in brackets.

1. Letting AI write the spec without owning the judgment behind it [3]
2. Shipping AI features without an eval set [3]
3. No paying-customer conversation in the last 30 days [3]
4. Conflating roadmap with strategy [3]
5. Stakeholder-pleasing over bet-defending [3]
6. Not measuring shipped features after launch [3]
7. OKRs as activity lists ("ship X" not "Y users adopt X") [3]
8. Working the roadmap when the unanswered question is the bet [3]
9. Theatre standups: status ritual, no real coordination [2]
10. Treating internal stakeholders as customers [2]
11. Letting "data-driven" replace a hard judgment call [2]
12. Confusing consensus with alignment [2]
13. Avoiding the hard "no" [2]
14. Over-indexing on the loudest customer complaint [2]
15. Velocity as a goal rather than a side effect [2]
16. Skipping the "why" in every spec [2]
17. Not noticing when politics shift around your bet [2]
18. Hiding from the post-mortem when something flops [2]
19. Hoarding credit from engineers and designers [2]
20. Confusing being busy with being useful [1]

## The engine (deterministic)

```
score_raw = sum over pitfalls of  2 if always, 1 if sometimes, 0 if never
score_display = round(score_raw / 2)        # 0-20, the shareable integer

top-three picker:
  weight = user_score(2/1/0) * leverage(3/2/1)
  sort by weight desc, break ties by leverage desc, take top 3
```

If the user answered "never" to everything (all weights 0), return the three highest-leverage pitfalls unanchored with a gentle nudge: "Either you're in the top 1% or you're being kind to yourself. Try again a little more honestly."

## Corpus anchors

Read the relevant files directly for the picked pitfalls; do not re-extract, the files are already syntheses:
- `knowledge/topics/pm-pitfalls.md`, `knowledge/topics/spotting-bad-pm-behaviors.md` (core)
- `knowledge/topics/evals-for-ai-products.md`, `ai-pm-skills.md` (pitfalls 1-2)
- `knowledge/topics/continuous-discovery.md` (3, 10, 14)
- `knowledge/topics/product-strategy.md`, `good-strategy-rumelt.md` (4)
- `knowledge/topics/defending-big-bets.md` (5, 8, 17)
- `knowledge/topics/okrs.md` (7), `velocity-core4.md` (9, 15)
- `knowledge/topics/saying-no.md` (13), `top-1-percent-pm.md` (18, 20)
Check `knowledge/obsolete/<slug>.md` and `knowledge/cautions/<slug>.md` for each; surface decay/flags inline.

## Output

```
Your score: {score_display}/20.

Your three highest-leverage to fix this quarter:

1. {pitfall}
   Diagnosis: one paragraph on why this compounds for someone in their shoes.
   Two behaviors to start this quarter: ...
   From the corpus: one named example (guest + what it cost), cited.

2. ...
3. ...
```

Order by leverage rank. Keep each pitfall section under ~120 words. Lead honestly; don't soften.

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Candid coach who has seen the pattern. Disagree with the behavior, not the person.
- Attribute every claim to a corpus source (guest + date + post URL where the file has it).

## Workflow

1. If ratings are missing, present the twenty pitfalls and collect always/sometimes/never (or infer from a described situation and name the assumption).
2. Compute `score_display` and the weighted top three.
3. Read the corpus anchors for the three picked pitfalls (+ their obsolete/caution files).
4. Render the output above. End-of-turn: offer to go deeper on any one pitfall, or to pressure-test a plan that addresses it (`lenny-pressure-test`).

## Portability

Reuses the same `knowledge/topics/` shape lenny-actualize produces. To run on another corpus, re-anchor the twenty pitfalls to that corpus's failure-mode topics; the scoring and picker are corpus-agnostic.
