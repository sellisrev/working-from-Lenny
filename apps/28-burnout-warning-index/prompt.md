---
app-id: 28
app-name: Burnout Warning Index for Product People
phase: 3
type: wizard-quiz + deterministic score + LLM narration
updated: 2026-05-23
neighbor: 3, 44
---

# Engine — #28 Burnout Warning Index

> A short structured check that turns calendar load + recovery signals + three honest qualitative answers into a composite risk read (green / yellow / red) and a phased recovery prescription drawn from the corpus, not from generic wellness copy. Deterministic scoring (clones #3 PM Ladder's median-and-tier engine and #44's weighted picker); Path 4 narration renders the prescription. The differentiator is corpus-specific recovery (`burnout-and-resilience`, `long-healthy-life`), not "do yoga."

## Audience and framing

Anyone in a manager-load role; the PM framing is the marketing wedge, not the limit. The tone is non-clinical and non-alarmist: this is a mirror and a prescription, not a diagnosis. A red read says "this is fixable and here is the order to fix it in," never "you are broken." No medical claims; the prescription is behavioral and corpus-anchored.

## Inputs

Two quantitative blocks + three qualitative checks. All on one wizard page (no pagination; it's short by design — a long burnout quiz is its own irony).

**Load block (quantitative):**
- `meetings_per_week` (number)
- `deep_work_blocks_remaining` (number of 90-min uninterrupted blocks left in a typical week)
- `after_hours_meeting_pct` (0–100; share of meetings outside core hours)
- `weeks_since_real_vacation` (number; "real" = phone off, no Slack)
- `sleep_self_report` (enum: solid / uneven / poor)

**Qualitative checks (the honest three):**
- `last_good_day` (enum: this week / this month / can't remember) — "When did you last finish a workday feeling good about something specific?"
- `dread_signal` (enum: rarely / some mornings / most mornings) — "How often do you feel dread before the workday starts?"
- `recovery_capacity` (free text ≤200 chars, optional) — "What's the first thing that falls away when you're underwater?"

## Scoring

Each input maps to a 0–2 risk points scale (deterministic table below); the composite is a weighted sum normalized to a 0–100 index, then tiered. Load and qualitative are weighted so that no single high reading alone forces red, but two converging signals do.

```
risk points per input (0 = healthy, 2 = warning):
  meetings_per_week:        <=15 ->0,  16-25 ->1,  >25 ->2
  deep_work_blocks_remaining: >=3 ->0,  1-2 ->1,   0 ->2
  after_hours_meeting_pct:   <=10 ->0, 11-30 ->1, >30 ->2
  weeks_since_real_vacation: <=12 ->0, 13-26 ->1, >26 ->2
  sleep_self_report:        solid->0, uneven->1, poor->2
  last_good_day:        this week->0, this month->1, can't remember->2
  dread_signal:            rarely->0, some mornings->1, most mornings->2

index = round(100 * sum(points) / max_points)   # max_points = 14
weights: qualitative trio (last_good_day, dread_signal) count double in the sum.
  -> effective max_points = 14 + 2 = 16; recompute denominator accordingly.

tier:
  green  index <= 30   "Sustainable for now. Keep the guardrails."
  yellow 31 <= index <= 60  "Drifting. Two signals are converging."
  red    index >= 61   "This is not a busy season. It's a debt."

override: dread_signal == "most mornings" AND last_good_day == "can't remember"
  -> floor the tier at yellow regardless of load (the load can look fine while
     the person is already gone). Narration names this explicitly.
```

## Phased recovery prescription (the #28-specific deliverable)

The prescription is ordered, not a menu. Corpus-anchored phases, selected by which inputs scored highest:

```
Phase 1 (stop the bleeding):   the single highest-risk input, with the one cut
  that relieves it this week. Anchored in burnout-and-resilience (boundaries,
  the cost of always-on).
Phase 2 (rebuild recovery):    sleep / vacation / deep-work restoration, ordered
  by which scored worst. Anchored in long-healthy-life (recovery as a system,
  not a reward).
Phase 3 (change the system):   the structural fix so it doesn't recur — meeting
  load, the yes-by-default habit (saying-no), or the trust gap that makes the
  person feel un-substitutable (top-1-percent-pm: burnout-as-trust-gap).
```

If `recovery_capacity` is supplied, Phase 1 references it directly ("you said {X} falls away first — protect that first, not last").

## Output shape

```
Your index: {index}/100 — {tier headline}

What's driving it: {the two highest-risk inputs, named plainly}

Your recovery, in order:
  1. This week: {Phase 1 cut}
  2. Next: {Phase 2 restoration}
  3. So it doesn't recur: {Phase 3 structural fix}

{If override fired: one line naming the dread + good-day signal directly.}
```

## Voice rules (applied to all narration)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Non-clinical, non-alarmist, no medical claims. Behavioral and corpus-anchored only.
- Direct but kind. Red is "fixable, here's the order," never "you're broken." Do not perform concern; prescribe.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> deflation-of-bravado: "Yellow is not a badge. It's a warning you've gotten good at ignoring."

Distinct from the 12 locked shapes (it punctures a self-flattering reading rather than listing, defining, or revealing). Alternative: "Red isn't a personality trait. It's a Tuesday you can still fix."

## Phase 0 URL-trick handoff (interim)

```
I want an honest read on my burnout risk and a recovery plan that isn't generic.
Here are my numbers:

Meetings/week: {n}. 90-min deep-work blocks left in a normal week: {n}.
After-hours meeting share: {n}%. Weeks since a real (phone-off) vacation: {n}.
Sleep: {solid/uneven/poor}. Last workday I felt good about something: {this
week / this month / can't remember}. Dread before the day: {rarely / some
mornings / most mornings}. First thing that falls away when I'm underwater: {X}.

Using Lenny Rachitsky's corpus (especially burnout-and-resilience and
long-healthy-life), please:
1. Give me a composite read: green, yellow, or red, and name the two signals
   driving it.
2. Prescribe recovery in order: what to cut this week, what to restore next,
   and the structural change so it doesn't recur.
3. Keep it behavioral and specific. No "practice self-care." No medical claims.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author the corpus-anchored recovery copy for each phase (≤4 sentences per phase), pulled from burnout-and-resilience + long-healthy-life + saying-no + top-1-percent-pm.
- [ ] Author 6 synthetic input profiles spanning green/yellow/red and the override case, for golden-set evals.
- [x] Cross-check anchors exist in `knowledge/topics/`: burnout-and-resilience, long-healthy-life, saying-no, top-1-percent-pm. → all present 2026-05-23.

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Four-tool Path 4 clone of #3 / #44:

- `burnout_get_form` — entry tool, UI binding; returns the field definitions (clones #37/#9 form-field shape: enums + numbers + one optional textarea) for hosts that can't mount the iframe.
- `burnout_score` — deterministic index + tier + override + the two top drivers + selected phases; echoes inputs; persists the brief via `writePending`. `readOnlyHint: true`.
- `burnout_narrate` — pure compute; returns the `narration_brief` (directive + voice_rules + structure {index, drivers, phase_1, phase_2, phase_3} + inputs + corpus). No persistence, no sampling.
- `burnout_get_pending_narration` — disk read, MUST CALL framing. Triggers: "read my burnout index", "am I burning out", "my recovery plan", "I just filled in the burnout check", embedded-widget phrasing. Anti-short-circuit + state-on-disk language per #44.

Corpus access is local read. Iframe shows the index + tier + the two drivers (identifier-level result); chat narration carries the ordered prescription (the spine), per the iframe-output design rule. **Optional weekly check-in nudge** (from APP_IDEAS) implies scheduling/state the local bundle can't own cleanly — defer it, and note it as the natural stateful follow-up (mirrors the deferred calibration tools): a `burnout_history` tool that compares this week's index to prior runs.
