---
name: mission-vision-alignment
description: Surface drift between a mission, vision, and current strategy by running three pairwise comparisons, detecting platitudes (with the load-bearing rewrite each would have to be), extracting the strategy's named bets into operational questions, and applying Rumelt's diagnosis test (named challenge / guiding policy / coherent actions). Reads `knowledge/topics/`. Use when the user asks "do my mission, vision, and strategy line up", "is my strategy actually a strategy", "find the drift in our planning docs", "is this mission statement a platitude", or pastes all three documents. The Claude Code skill version of the Working from Lenny Mission/Vision/Strategy Alignment Checker app.
---

# mission-vision-alignment

The skill version of the #47 Mission/Vision/Strategy Alignment Checker. Take the three documents, map where they have drifted apart, call out the lines that mean nothing, and hold the strategy to Rumelt's test. Companion to `lenny-actualize` and `lenny-pressure-test`; consumes the knowledge base.

## Why this exists

Mission, vision, and strategy are usually written at different times by different hands, so they drift, and the drift hides behind words like "delight" and "best-in-class" that nobody can act on. This skill makes the drift visible, rewrites each platitude into what it would have to say to be load-bearing, and applies Rumelt's diagnosis test so "strategy" can't just mean "wishful outcome."

## When to use

Trigger on "do my mission, vision, and strategy line up", "is my strategy actually a strategy", "find the drift in our planning docs", "is this a platitude". Requires all three documents: if any is missing or under ~50 characters, ask for the full statement ("Mission and vision under 50 characters are usually titles, not content").

## Inputs

`mission_text` (<=500 chars), `vision_text` (<=500 chars), `strategy_text` (200-3000 chars).

## Pass 1: drift map (three pairwise comparisons)

```
mission <-> vision    -- would reaching the vision complete the mission, or are they on different planes?
mission <-> strategy  -- does this quarter's strategy spend energy on the mission, or is the mission decorative?
vision  <-> strategy  -- is the strategy's direction a step toward the vision, or orthogonal?
```

Each gets a severity (none/low/med/high), a 10-word drift label ("mission says X, strategy is doing Y"), and a one-paragraph diagnosis.

## Pass 2: platitude detector (each doc independently)

Flag lines that mean nothing without a behavior or metric attached: "delight", "best-in-class", "world-class", "empower", "reimagine", "transform", "drive growth/value", "be the X for Y". For each, write the verbatim phrase, which doc it is from, and what it would have to say to be load-bearing. The detector cannot itself be platitudinous; the rewrites must be more concrete than the originals. Full pattern set and platitude->rewrite pairs live in `apps/47-mission-vision-alignment/prompt.md` and `apps/47-mission-vision-alignment/authoring.md`.

## Pass 3: operational gaps

Extract the strategy's concrete bets ("expand to EMEA in H2", "move to consumption pricing"). For each, phrase the operational question the user should take to their team leads ("Whose roadmap names EMEA-specific work?"). If the strategy is too vague to extract bets, return the rewrite prompt: name the challenge, name 3-5 bets, name one 60-day signal per bet.

## Pass 4: Rumelt diagnosis (strategy_text only)

```
Named challenge?  quote the sentence (or "absent")
Guiding policy?   quote the sentence (or "absent")
Coherent actions? list them (or "absent")
Verdict: yes / partial / no   (+ one paragraph)
```

Vision and mission are not strategy documents and are not held to this test.

## Corpus anchors

`knowledge/topics/mission-vision-strategy.md`, `good-strategy-rumelt.md` (the diagnosis test), `product-strategy.md`, `pm-pitfalls.md` (corporate-jargon pattern), `defending-big-bets.md` + `getting-buy-in.md` (operational gaps). All verified present. Check obsolete/caution layers.

## Output

```
Drift map
  mission <-> vision    [severity, drift label]
  mission <-> strategy  [severity, drift label]
  vision  <-> strategy  [severity, drift label]
  [per-pair diagnosis]

Platitude detector
  "delight our customers" (mission) -> would have to say: "..."

Operational gaps
  Strategy names: {bet} -> Question: {...}

Rumelt diagnosis
  Named challenge / Guiding policy / Coherent actions
  Verdict: {yes | partial | no} + one paragraph
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Direct. If the strategy doesn't survive Rumelt's test, say so.
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Confirm all three documents are present and substantial; else ask for the full statement.
2. Run the drift map, then the platitude detector, then operational gaps.
3. Apply Rumelt's diagnosis test to the strategy only.
4. Render the four-section output.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The drift-map structure and Rumelt's test are corpus-agnostic; the platitude rewrites re-anchor to another corpus's strategy topics.
