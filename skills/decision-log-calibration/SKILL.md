---
name: decision-log-calibration
description: Log decisions with the confidence you had at the time, resolve them when outcomes are known, and get a Brier score plus a per-type read of where you are systematically over- or under-confident, with a drift warning when a new decision's confidence diverges from your track record. The direct application of Annie Duke's Thinking in Bets to professional judgment. Reads `knowledge/topics/` and persists a decision log. Use when the user asks "am I calibrated", "what's my Brier score", "track my decision quality", "log this decision", "how's my judgment trending", or wants to record a call with a confidence level. The Claude Code skill version of the Working from Lenny Decision Log app.
---

# decision-log-calibration

The skill version of the #25 Decision Log + Brier Calibration Tracker. Log decisions with confidence, resolve them, and learn whether you are actually getting better. The one app whose whole value is the stateful per-user history, so this skill persists a log. Companion to `lenny-actualize` and `lenny-pressure-test`.

## Why this exists

Confidence is a forecast, not a feeling; calibration is the skill; the score is honest because outcomes resolve it, not vibes. Most people never find out they are systematically overconfident on, say, pricing calls. This skill keeps the log, computes the Brier math, and names the pattern. Tone is a coach with a spreadsheet, not a fortune teller.

## When to use

Trigger on "am I calibrated", "what's my Brier score", "track my decision quality", "log this decision", "how's my judgment trending", "resolve a decision". Three actions: add, resolve, calibrate.

## The decision entry

```
id, created_at, decision_text (<=300), decision_type, confidence_pct (1..99),
predicted_outcome (<=300), status (open|resolved), resolved_at, was_right, resolution_note
```

`confidence_pct` is capped 1..99: 0 and 100 are claims of certainty, not forecasts, and they break the Brier math. Seven preset types (hire, fire, pricing, pivot, build-vs-buy, hiring-plan, roadmap-bet) plus "other"; the user can define custom types and they are first-class. Normalize on write (trim + lowercase + collapse whitespace) so "Pricing" and "pricing " land in one bucket. Remember a user's custom types as quick-picks on later runs.

## The Brier math (deterministic, the unique core)

```
per-decision Brier = (confidence_pct/100 - outcome)^2     # outcome 1 if right else 0
overall Brier      = mean(per-decision Brier) over RESOLVED   # 0 perfect, 0.25 coin-flip-at-50%, 1 confidently wrong

per type with >= 3 resolved:
  gap = mean_confidence - hit_rate
  gap >  +12  -> "systematically OVERCONFIDENT on {type} (felt {mc}%, right {hr}%)"
  gap <  -12  -> "systematically UNDERCONFIDENT on {type}"
  else        -> "well-calibrated on {type}"

drift warning at add-time:
  if type T has a record AND |C - hit_rate(T)| > 15:
    "Heads up: on {T} you've felt {mc}% sure and been right {hr}%. You're logging this at {C}%."
```

Below 3 resolved per type, say "not enough resolved decisions yet to call your calibration on {type}" rather than inventing a pattern. Always show the n= count.

## Persistence

Keep the log at `knowledge/decision-log/<user>.json` = `{schema_version, entries: []}`. Atomic write (`.tmp` + rename). Append on add; resolve in place; never overwrite the collection with a new entry. The calibrate read is computed fresh from the stored entries each time.

## Corpus anchors

`knowledge/topics/decision-making-frameworks.md`, `evaluating-product-bets.md`, `defending-big-bets.md` (first-principles available as a fourth). All verified present. Use for the per-type "what this miscalibration costs you" line and the one habit that narrows the gap.

## Output (the calibrate read)

```
Your calibration, across {n} resolved decisions:
Overall Brier score: {x.xx} ({sharp / decent / coin-flip / confidently-wrong})
Where you're miscalibrated:
  - {type}: OVERCONFIDENT - felt {mc}%, right {hr}%
  - {type}: well-calibrated
Open decisions waiting on outcomes: {count} (oldest: "{text}", logged {date})
The pattern worth knowing: {one corpus-grounded line - what this miscalibration
  costs someone in your seat, and the one habit that narrows the gap}
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- A coach with a spreadsheet. The number is the number; interpret without flattering or scolding.
- Duke-faithful: separate decision quality from outcome quality. A good call that went wrong is logged as wrong for the Brier math, but the narration can note process vs. luck.

## Workflow

1. Classify the request: add / resolve / calibrate / list.
2. add: validate, normalize the type, append, return the entry + any drift warning. resolve: mark right/wrong + note in place. list: show open + resolved with stale-open flags (90+ days open).
3. calibrate: recompute Brier + per-type gaps over the stored entries, read the corpus anchors for the worst-calibrated type, render the read.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The Brier math and persistence are corpus-agnostic; only the per-type cost lines re-anchor to another corpus.
