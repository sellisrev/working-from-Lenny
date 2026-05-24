---
app-id: 28
app-name: Burnout Warning Index for Product People
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #28 Burnout Warning Index

Items from the `## Autonomous-routine backlog` in `prompt.md`.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `burnout-and-resilience.md` | YES | No change |
| `long-healthy-life.md` | YES | No change |
| `saying-no.md` | YES | No change |
| `top-1-percent-pm.md` | YES | No change |

Named-author cross-check (for narration grounding):
| Author | Corpus presence | Action |
|---|---|---|
| Jonny Miller (Nervous System Mastery) | Present (burnout-and-resilience.md: recovery as a system, nervous-system regulation) | No change |
| Hilary Gridley | Present (burnout-and-resilience.md: resilient teams, "take a punch") | No change |

No substitutions needed. All four anchors verified present 2026-05-24.

---

## Scoring denominator — resolved for Stage C (flagged for Stage D)

The locked `prompt.md` scoring note has an internal arithmetic inconsistency: it says the qualitative signals "count double in the sum" but then states "effective max_points = 14 + 2 = 16." Doubling *both* `last_good_day` and `dread_signal` would yield max 18, not 16. The denominator (16) is the explicit, locked number, so Stage C honors it and uses the weighting that produces exactly 16: **`dread_signal` counts double (+2 over its base); `last_good_day` counts single.** Rationale for doubling dread specifically: per `burnout-and-resilience.md`, recurring morning dread is the sharpest "already gone" signal, sharper than a stale good-day memory. Logged to DECISIONS.md 2026-05-24 for owner/Opus ratification in Stage D (the alternative is both-doubled with denominator 18).

Resolved risk-points table (0 = healthy, 2 = warning):

```
meetings_per_week:          <=15 ->0,  16-25 ->1,  >25 ->2
deep_work_blocks_remaining:  >=3 ->0,   1-2 ->1,    0 ->2
after_hours_meeting_pct:    <=10 ->0,  11-30 ->1,  >30 ->2
weeks_since_real_vacation:  <=12 ->0,  13-26 ->1,  >26 ->2
sleep_self_report:         solid ->0, uneven ->1, poor ->2
last_good_day:         this-week ->0, this-month ->1, cant-remember ->2   (weight x1)
dread_signal:             rarely ->0, some-mornings ->1, most-mornings ->2 (weight x2)

raw_sum = meetings + deep_work + after_hours + vacation + sleep
        + last_good_day + (2 * dread_signal)
index = round(100 * raw_sum / 16)

tier:
  green  index <= 30   "Sustainable for now. Keep the guardrails."
  yellow 31 <= index <= 60   "Drifting. Two signals are converging."
  red    index >= 61   "This is not a busy season. It's a debt."

override: dread_signal == most-mornings AND last_good_day == cant-remember
  -> floor the tier at yellow regardless of index (load can look fine while the
     person is already gone). Narration names this signal pair explicitly.

drivers: the two inputs with the highest weighted points (dread uses its x2 value
  for ranking), ties broken by the qualitative signal first.
```

`recovery_capacity` is free text and is not scored; it feeds Phase 1 of the prescription when supplied.

---

## Phased recovery copy

The prescription is ordered, not a menu. Each phase ≤4 sentences, corpus-anchored. Phase selection is driven by which inputs scored highest; the host fills the bracketed slots.

**Phase 1 — stop the bleeding** (anchor: `burnout-and-resilience.md`, boundaries + the cost of always-on)
> Your loudest signal is {highest-risk input, named plainly}. The one cut that relieves it this week: {the concrete cut, e.g., decline or move the next three after-hours meetings; reclaim two deep-work blocks; book the phone-off day}. The corpus is unanimous that scheduled disengagement, not willpower, is what protects you, so make this a calendar change, not a resolution. {If recovery_capacity supplied: "You said {recovery_capacity} falls away first when you're underwater. Protect that this week, not last."}

**Phase 2 — rebuild recovery** (anchor: `long-healthy-life.md`, recovery as a system, not a reward)
> Recovery is a system you run, not a prize you earn after the quarter ends. Start with sleep, which the corpus names as the first lever; then book one unbroken, phone-off week within the quarter rather than saving it for a "calmer" time that never comes. Restore the deep-work blocks next: defend at least two 90-minute blocks a week the way you would defend a meeting with your CEO. Order these by whichever scored worst for you (sleep, vacation, or deep work).

**Phase 3 — change the system** (anchors: `saying-no.md`; `top-1-percent-pm.md`, burnout-as-trust-gap)
> So it does not recur, fix the input that keeps refilling the calendar. If yes-by-default is the cause, the saying-no work is the lever: a no with a reason protects the bet and your week, and the corpus treats it as a core skill, not rudeness. If you feel un-substitutable, that is usually a trust gap rather than a true workload problem, and the corpus reads chronic indispensability as a delegation problem to solve, not a badge to wear. Pick the one structural change that removes the driver, not all three.

---

## Synthetic input profiles (golden-set evals)

Six profiles spanning green / yellow / red and the override case. Each lists inputs, the computed index, and the expected tier + drivers + phase focus.

**golden-burn-01 — green (sustainable)**
> meetings 12, deep-work blocks 4, after-hours 5%, weeks-since-vacation 6, sleep solid, last-good-day this-week, dread rarely.
> Points: 0+0+0+0+0+0+(2*0)=0. index 0.

Expected: **green.** No drivers above zero. Narration keeps the guardrails framing; no prescription urgency.

**golden-burn-02 — green edge**
> meetings 18, deep-work 3, after-hours 8%, weeks-since-vacation 10, sleep uneven, last-good-day this-week, dread rarely.
> Points: 1+0+0+0+1+0+0 = 2. index = round(100*2/16) = 13.

Expected: **green.** Drivers: meetings, sleep. Gentle Phase 1 nudge on sleep.

**golden-burn-03 — yellow (two signals converging)**
> meetings 22, deep-work 1, after-hours 20%, weeks-since-vacation 20, sleep uneven, last-good-day this-month, dread some-mornings.
> Points: 1+1+1+1+1+1+(2*1)=8. index = round(100*8/16) = 50.

Expected: **yellow.** Drivers: dread (x2) and one of the load 1s. Phase 1 on the deep-work / after-hours load; Phase 2 on sleep + vacation.

**golden-burn-04 — red (clear debt)**
> meetings 30, deep-work 0, after-hours 45%, weeks-since-vacation 40, sleep poor, last-good-day this-month, dread some-mornings.
> Points: 2+2+2+2+2+1+(2*1)=13. index = round(100*13/16) = 81.

Expected: **red.** Drivers: after-hours share + deep-work zero (and high load across the board). Phase 1 cut on after-hours meetings; Phase 3 on the meeting load itself.

**golden-burn-05 — override (load looks fine, person is gone)**
> meetings 14, deep-work 3, after-hours 8%, weeks-since-vacation 8, sleep uneven, last-good-day cant-remember, dread most-mornings.
> Points: 0+0+0+0+1+2+(2*2)=7. index = round(100*7/16) = 44, which is yellow on its own; the override also fires (dread most-mornings AND last-good-day cant-remember).

Expected: **yellow, override fired.** Even though load is light, the narration names the dread + no-good-day pair directly: "Your calendar looks manageable, and you still can't remember a good day and dread most mornings. That pairing matters more than the load numbers." Phase 1 focuses on the qualitative signal, not the (low) load.

**golden-burn-06 — red with override**
> meetings 28, deep-work 0, after-hours 50%, weeks-since-vacation 35, sleep poor, last-good-day cant-remember, dread most-mornings.
> Points: 2+2+2+2+2+2+(2*2)=16. index = 100. Override also fires.

Expected: **red** (and the override is moot since red exceeds the yellow floor). Drivers: every load input plus the dread pair. The direct line names the dread + no-good-day pair. Phase 1: the single hardest cut this week; Phase 3: the structural meeting-load + saying-no fix.
