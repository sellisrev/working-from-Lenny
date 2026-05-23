---
app-id: 25
app-name: Decision Log + Brier Calibration Tracker
phase: 3
type: stateful log + deterministic Brier math + LLM narration
updated: 2026-05-23
neighbor: none (new persistence pattern)
---

# Engine — #25 Decision Log + Brier Calibration

> Log every meaningful decision with the confidence you had at the time. Resolve it when the outcome is known. The tool computes your Brier score over time, surfaces where you're systematically over- or under-confident by decision type, and warns you when a new decision's confidence drifts from your track record. This is the direct application of Annie Duke's *Thinking in Bets* to professional judgment. **It is the one app in the catalog whose whole value IS the stateful per-user history every other app defers** — so it can't be deferred here; the persistence model has to be designed up front (see Open design questions + the persistence note in the Phase 2 section).

## Audience and framing

PMs, founders, eng managers, investors — anyone making repeated judgment calls who wants to know if they're actually getting better. The corpus anchors (`decision-making-frameworks`, `evaluating-product-bets`, `defending-big-bets`) supply the framing: confidence is a forecast, not a feeling; calibration is the skill; the score is honest because outcomes resolve it, not vibes. Tone is a coach with a spreadsheet, not a fortune teller.

## The decision entry

```
{
  id:               string (uuid)
  created_at:       iso8601
  decision_text:    string (<=300)   "what are you deciding?"
  decision_type:    string  preset quick-pick OR user-defined custom type
  confidence_pct:   integer 1..99    "how sure are you this is the right call?"
  predicted_outcome: string (<=300)  "what specifically do you expect to be true if you're right?"
  status:           open | resolved
  resolved_at:      iso8601 | null
  was_right:        bool | null      "set at resolution"
  resolution_note:  string (<=300) | null
}
```

`confidence_pct` is capped to 1..99 deliberately: 0 and 100 are not forecasts, they're claims of certainty, and they break the Brier math (and the lesson).

**Decision types are open (owner request 2026-05-23).** Seven presets ship as quick-picks (hire, fire, pricing, pivot, build-vs-buy, hiring-plan, roadmap-bet) plus an "other" fallback, but the user can define their own type by typing it in. Custom types are first-class: they group, score, and drift-warn exactly like presets. Normalize on write (trim + lowercase + collapse internal whitespace) so "Pricing", "pricing", and "pricing " land in one bucket, and a custom value that matches a preset merges into that preset. The form remembers a user's prior custom types as additional quick-picks on later runs.

## The Brier math (deterministic, the unique core)

For binary right/wrong outcomes:

```
per-decision Brier = (confidence_pct/100 - outcome)^2     # outcome = 1 if right else 0
overall Brier      = mean(per-decision Brier) over RESOLVED decisions   # 0 = perfect, 0.25 = coin-flip-at-50%, 1 = confidently wrong every time
```

Calibration by type (the pattern surfacer):

```
for each decision_type with >= MIN_RESOLVED (proposed 3) resolved decisions:
  mean_confidence = mean(confidence_pct) over resolved of that type
  hit_rate        = (# was_right) / (# resolved) * 100
  gap             = mean_confidence - hit_rate
  if gap >  +12:  "systematically OVERCONFIDENT on {type} (felt {mc}%, right {hr}%)"
  if gap <  -12:  "systematically UNDERCONFIDENT on {type} (felt {mc}%, right {hr}%)"
  else:           "well-calibrated on {type}"
```

Drift warning at log-time:

```
when decision_log_add is called with decision_type T and confidence C:
  if T has a calibration record AND |C - hit_rate(T)| > 15:
    return a warning alongside the saved entry:
    "Heads up: on {T} decisions you've felt {mc}% sure and been right {hr}% of
     the time. You're logging this one at {C}%."
```

Small-sample honesty: below MIN_RESOLVED per type, the tool reports "not enough resolved decisions yet to call your calibration on {type}" rather than inventing a pattern. The overall Brier shows once any decision is resolved, with an n= count always visible.

## Output shape (the calibrate read)

```
Your calibration, across {n} resolved decisions:

Overall Brier score: {x.xx}  ({plain-language band: sharp / decent / coin-flip / confidently-wrong})

Where you're miscalibrated:
  - {type}: OVERCONFIDENT — felt {mc}%, right {hr}%
  - {type}: UNDERCONFIDENT — felt {mc}%, right {hr}%
  - {type}: well-calibrated

Open decisions waiting on outcomes: {count}  (the oldest: "{text}", logged {date})

The pattern worth knowing: {one corpus-grounded line — what this miscalibration
tends to cost someone in your seat, and the one habit that narrows the gap}
```

## Voice rules (applied to all narration)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- A coach with a spreadsheet. The number is the number; interpret it without flattering or scolding.
- Duke-faithful: separate decision quality from outcome quality. A good call that went wrong is still logged as wrong for the Brier math, but the narration can note process vs. luck.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> scoreboard: "You felt 80% sure. You were right 55% of the time. The gap is the whole point."

Distinct from the 12 locked shapes (a two-number confrontation resolving to a thesis, not a list/definition/reveal). Alternative: "Confidence is a forecast. The Brier score is the weather report."

## Phase 0 URL-trick handoff (interim, degraded)

Note: #25's value is longitudinal, so the Phase 0 stateless handoff is weak — it can only reflect on a batch the user pastes in one shot. Honest framing for the interim:

```
Here are decisions I've made with the confidence I had at the time and how they
turned out:

{list: decision | type | confidence% | right/wrong}

Using Annie Duke's Thinking-in-Bets framing (and Lenny's decision-making corpus),
please:
1. Estimate my Brier score and tell me in plain language how calibrated I am.
2. Tell me which decision TYPES I'm over- or under-confident on.
3. Give me the one habit that would narrow my biggest gap.

Don't flatter me. The point is to get better, not to feel good.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author the plain-language Brier bands (sharp / decent / coin-flip / confidently-wrong) with thresholds.
- [ ] Author the per-type "what this miscalibration costs you" corpus lines (hire, pricing, pivot, build-vs-buy, roadmap-bet), from decision-making-frameworks + evaluating-product-bets + defending-big-bets.
- [ ] Author 8-10 synthetic decision logs (varying calibration profiles) for golden-set evals of the Brier + pattern math.
- [x] Cross-check anchors exist in `knowledge/topics/`: decision-making-frameworks, evaluating-product-bets, defending-big-bets. → all present 2026-05-23. (first-principles available if a fourth anchor is wanted.)

## Owner decisions — RESOLVED (2026-05-23)

1. **Persistence model extension — APPROVED.** #25 uses a mutable per-user collection: `decision-log.json` = `{schema_version, entries: []}`, atomic `.tmp`+rename write, append + in-place resolution, never overwritten by a new entry; the calibrate narration brief still uses the existing single-pending pattern. This extends what `PHASE2_BUILD.md` locks, so a short amendment to that doc is the one remaining prerequisite before Stage C content/MCP draft.
2. **`readOnlyHint: false`** on `decision_log_add` and `decision_log_resolve` (they mutate durable user data, unlike the ephemeral pending-brief writes elsewhere) — APPROVED.
3. **Resolution reminders — APPROVED as proposed.** No scheduling; `decision_log_list` surfaces stale open decisions ("logged 90+ days ago, still open") and the calibrate read names the oldest.
4. **Thresholds — APPROVED as proposed.** MIN_RESOLVED = 3 resolved entries per type before a calibration verdict; drift warning fires at >15 points of confidence-vs-hit-rate gap.
5. **Open decision types — APPROVED + extended (owner request).** Users can define their own decision types in addition to the presets; custom types are first-class (group / score / drift identically), normalized on write, and remembered as quick-picks. See "The decision entry."
6. **Voice shape (scoreboard) — APPROVED.**

## Phase 2 MCP App spec (Path 4 narration + new stateful store — the real target)

Tool set (larger than the four-tool clones because the log is interactive):

- `decision_log_get_form` — entry tool, UI binding; the iframe is a small log/resolve console (add form with preset + custom decision-type picker, plus an open-decisions list with resolve buttons).
- `decision_log_add` — validates inputs, normalizes the decision_type (preset or user-defined custom), appends an entry to the collection; returns the saved entry + any drift warning. **Stateful, `readOnlyHint: false`.**
- `decision_log_resolve` — marks an open entry right/wrong with a note; updates in place. **Stateful, `readOnlyHint: false`.**
- `decision_log_list` — reads the collection; returns open + resolved with stale-open flags. Read.
- `decision_log_calibrate` — deterministic Brier + per-type calibration over the stored collection; persists the Path 4 narration brief (single-pending pattern). This is the narration entry point.
- `decision_log_get_pending_narration` — disk read of the calibrate brief, MUST CALL framing. Triggers: "what's my Brier score", "am I calibrated", "read my decision log", "how's my judgment trending", embedded-widget phrasing.

Corpus access is local read. The iframe shows the running log + overall Brier + per-type flags (the data); chat narration carries the corpus-grounded interpretation + the habit prescription (the spine). This is the first app where the iframe legitimately shows numbers the narration also references — acceptable because the numbers ARE the artifact (unlike the duplicated-reading anti-pattern from #53 v0.2.0); the narration's job is interpretation, not re-printing the table.
