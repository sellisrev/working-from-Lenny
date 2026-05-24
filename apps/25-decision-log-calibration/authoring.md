---
app-id: 25
app-name: Decision Log + Brier Calibration Tracker
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #25 Decision Log + Brier Calibration

Items from the `## Autonomous-routine backlog` in `prompt.md`. Voice: a coach with a spreadsheet, Duke-faithful (decision quality separate from outcome quality).

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `decision-making-frameworks.md` | YES | No change |
| `evaluating-product-bets.md` | YES | No change |
| `defending-big-bets.md` | YES | No change |

Named-author cross-check:
| Author | Corpus presence | Action |
|---|---|---|
| Annie Duke (Thinking in Bets) | Present (decision-making-frameworks.md: confidence-as-forecast, resulting, decision-vs-outcome quality) | No change |

No substitutions needed. All three anchors verified present 2026-05-24. `first-principles.md` is available if a fourth anchor is wanted in Stage D.

---

## Plain-language Brier bands

The Brier score runs 0 (perfect) to 1 (confidently wrong every time); 0.25 is the coin-flip-at-50% baseline. Proposed thresholds (tunable in Stage D), always shown with the n= resolved count:

| Band | Brier range | Plain language |
|---|---|---|
| **sharp** | ≤ 0.12 | "Your confidence tracks reality closely. Keep logging; this is rare." |
| **decent** | 0.12 < B ≤ 0.20 | "Better than a coin flip and better than most. There's a gap, and it's nameable." |
| **coin-flip** | 0.20 < B ≤ 0.30 | "Around the 0.25 baseline. Your confidence isn't carrying much information yet." |
| **confidently-wrong** | > 0.30 | "Your confidence is pointing the wrong way: you're surest when you're least right. This is the most fixable state, because the signal is strong, just inverted." |

Note: with very small n (1-2 resolved), report the score but caveat it ("on 2 resolved decisions, this is a hint, not a verdict"). Bands stabilize as n grows.

---

## Per-type "what this miscalibration costs you" lines

One corpus-grounded line per type, naming the cost and the one habit that narrows the gap. The host selects the line matching the user's flagged type and direction.

| Type | Overconfident cost + habit | Anchor |
|---|---|---|
| **hire** | Overconfidence on hires usually costs you a slow exit you postpone, because admitting the miss is expensive. Write the disconfirming evidence at decision time so the resolution isn't a surprise. | decision-making-frameworks |
| **pricing** | On pricing, overconfidence shows up as anchoring to your first number and defending it past the data. Pre-commit to the metric that would prove you wrong before you launch. | evaluating-product-bets |
| **pivot** | Overconfidence on pivots is the sunk-cost trap in a fresh coat; underconfidence is staying too long out of loyalty to the original plan. Write the kill-criteria before the pivot, not after. | defending-big-bets |
| **build-vs-buy** | Build-vs-buy overconfidence almost always underestimates the maintenance tail of "build." Forecast the 12-month carrying cost, not just the ship date. | evaluating-product-bets |
| **roadmap-bet** | On roadmap bets, overconfidence is often the loudest-stakeholder request dressed as conviction. Name the user evidence that would confirm the bet, and the date you'll check it. | defending-big-bets, decision-making-frameworks |

Underconfidence (any type): the cost is hesitation and over-hedging on calls you'd have gotten right, which reads to others as indecision. The habit: when you catch yourself rounding your confidence down "to be safe," log the honest number and let the Brier score, not your nerves, tell you whether you were right to worry.

Duke framing (applies across types): the Brier math scores outcomes, so a good process that got unlucky still logs as wrong. The narration can name process-vs-luck in the resolution note, but it never relitigates the score; resulting (judging the decision by the outcome) is the bias the tool exists to fight.

---

## Synthetic decision logs (golden-set evals)

Eight logs with known calibration profiles. Each lists entries as `type | confidence% | right/wrong`; resolved-only entries feed the Brier math. Expected overall Brier and per-type verdicts noted. (Brier per decision = (conf/100 - outcome)^2.)

**golden-dec-01 — sharp generalist**
> roadmap-bet 70 R · roadmap-bet 80 R · hire 60 W · pricing 75 R · pivot 55 R · build-vs-buy 65 R
> Per-decision Brier: .09, .04, .36, .0625, .2025, .1225 -> mean ≈ 0.15.

Expected: overall ≈ **0.15 (decent, near sharp)**, n=6. Most types n<3, so verdicts mostly insufficient-data; the read leans on the strong overall.

**golden-dec-02 — overconfident on hires**
> hire 90 W · hire 85 W · hire 80 R · hire 88 W · pricing 70 R · pricing 65 R
> hire: mean_conf 85.75, hit_rate 25% (1 of 4 right), gap +60.75.

Expected: **hire OVERCONFIDENT** (felt ~86%, right 25%). Cost line: slow exits postponed; habit: write disconfirming evidence at decision time. n(hire)=4 ≥ 3.

**golden-dec-03 — underconfident on pricing**
> pricing 55 R · pricing 50 R · pricing 60 R · pricing 52 R · pivot 70 R
> pricing: mean_conf 54.25, hit_rate 100%, gap -45.75.

Expected: **pricing UNDERCONFIDENT** (felt ~54%, right 100%). Cost line: hedging that reads as indecision; habit: log the honest number.

**golden-dec-04 — coin-flip**
> roadmap-bet 50 R · roadmap-bet 50 W · hire 55 W · pricing 45 R · pivot 50 R · build-vs-buy 50 W
> Per-decision Brier near .25 each -> mean ≈ 0.25.

Expected: overall ≈ **0.25 (coin-flip)**, n=6. The read names that confidence isn't yet carrying information.

**golden-dec-05 — confidently wrong**
> hire 90 W · pricing 85 W · pivot 80 W · roadmap-bet 88 W · build-vs-buy 75 R
> Per-decision Brier: .81, .7225, .64, .7744, .0625 -> mean ≈ 0.60.

Expected: overall ≈ **0.60 (confidently-wrong)**, n=5. The read frames this as the most fixable state (strong but inverted signal).

**golden-dec-06 — insufficient data per type**
> hire 70 R · pricing 60 W · pivot 80 R
> Each type n=1.

Expected: overall Brier shows (n=3), but **every per-type verdict = insufficient-data** (below MIN_RESOLVED=3). The read says so rather than inventing a pattern.

**golden-dec-07 — drift warning at log time**
> Track record: pivot resolved 4x, mean_conf 80%, hit_rate 40%. User logs a NEW pivot decision at confidence 85%.
> |85 - 40| = 45 > 15.

Expected: `decision_log_add` returns the saved entry plus a **drift_warning**: "on pivot decisions you've felt 80% sure and been right 40% of the time. You're logging this one at 85%."

**golden-dec-08 — mixed, with a stale open**
> roadmap-bet 65 R · roadmap-bet 70 R · roadmap-bet 60 R (well-calibrated) · pivot 90 W · pivot 85 W · pivot 88 R (overconfident) · one OPEN hire decision logged 120 days ago.
> roadmap-bet: mean ~65, hit 100%, gap -35 (UNDERCONFIDENT). pivot: mean ~87.7, hit 33%, gap +54.7 (OVERCONFIDENT).

Expected: **roadmap-bet UNDERCONFIDENT, pivot OVERCONFIDENT**, plus the open-decisions line naming the 120-day-old stale hire decision as the oldest open. Demonstrates the calibrate read surfacing both directions and the stale-open reminder simultaneously.
