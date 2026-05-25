---
name: burnout-warning-index
description: Turn calendar load, recovery signals, and three honest qualitative answers into a composite burnout-risk read (green/yellow/red) and a phased recovery plan ordered as cut-this-week / restore-next / structural-fix, drawn from the corpus rather than generic wellness copy. Non-clinical, no medical claims. Reads `knowledge/topics/`. Use when the user asks "am I burning out", "burnout check", "is this sustainable", "I'm exhausted, help me think about it", "wellbeing index", or describes their week and wants an honest read plus a recovery plan. The Claude Code skill version of the Working from Lenny Burnout Warning Index app.
---

# burnout-warning-index

The skill version of the #28 Burnout Warning Index. A short structured check returns a green/yellow/red read and an ordered recovery prescription anchored in the corpus. Companion to `lenny-actualize`. Consumes the knowledge base.

## Why this exists

Most burnout self-checks end in "practice self-care." This one names the two signals driving the risk and prescribes recovery in order: what to cut this week, what to restore next, the structural fix so it doesn't recur. The tone is a mirror and a prescription, never a diagnosis. Red is "fixable, here's the order," never "you're broken." No medical claims; the prescription is behavioral and corpus-anchored.

## When to use

Trigger on "am I burning out", "burnout check", "is this sustainable", "I'm exhausted", "wellbeing index". Anyone in a manager-load role; the PM framing is the wedge, not the limit. Never perform concern; prescribe.

## Inputs

Load block: `meetings_per_week`, `deep_work_blocks_remaining` (90-min uninterrupted blocks left in a normal week), `after_hours_meeting_pct` (0-100), `weeks_since_real_vacation` (phone off, no Slack), `sleep_self_report` (solid/uneven/poor).

The honest three: `last_good_day` (this week / this month / can't remember), `dread_signal` (rarely / some mornings / most mornings), `recovery_capacity` (optional free text: "what's the first thing that falls away when you're underwater?").

Collect on one short pass; a long burnout quiz is its own irony.

## The engine (deterministic)

```
risk points per input (0 healthy, 2 warning):
  meetings_per_week:          <=15->0, 16-25->1, >25->2
  deep_work_blocks_remaining: >=3->0,  1-2->1,   0->2
  after_hours_meeting_pct:    <=10->0, 11-30->1, >30->2
  weeks_since_real_vacation:  <=12->0, 13-26->1, >26->2
  sleep_self_report:          solid->0, uneven->1, poor->2
  last_good_day:              this week->0, this month->1, can't remember->2
  dread_signal:               rarely->0, some mornings->1, most mornings->2

last_good_day and dread_signal count double in the sum.
index = round(100 * sum(points) / 16)

tier:  green index<=30  "Sustainable for now. Keep the guardrails."
       yellow 31-60     "Drifting. Two signals are converging."
       red index>=61    "This is not a busy season. It's a debt."

override: dread_signal == most mornings AND last_good_day == can't remember
  -> floor the tier at yellow regardless of load; name this explicitly.
```

## Phased recovery prescription (the deliverable)

Ordered, not a menu. Selected by which inputs scored highest:
- Phase 1 (stop the bleeding): the single highest-risk input + the one cut that relieves it this week. Anchor `burnout-and-resilience` (boundaries, the cost of always-on). If `recovery_capacity` was given, reference it: "you said {X} falls away first; protect that first, not last."
- Phase 2 (rebuild recovery): sleep / vacation / deep-work restoration, ordered by worst score. Anchor `long-healthy-life` (recovery as a system, not a reward).
- Phase 3 (change the system): the structural fix. Meeting load, the yes-by-default habit (`saying-no`), or the trust gap that makes the person feel un-substitutable (`top-1-percent-pm`, burnout-as-trust-gap).

## Corpus anchors

`knowledge/topics/burnout-and-resilience.md`, `long-healthy-life.md`, `saying-no.md`, `top-1-percent-pm.md`. All verified present. Check obsolete/caution layers.

## Output

```
Your index: {index}/100 - {tier headline}
What's driving it: {the two highest-risk inputs, named plainly}
Your recovery, in order:
  1. This week: {Phase 1 cut}
  2. Next: {Phase 2 restoration}
  3. So it doesn't recur: {Phase 3 structural fix}
{If override fired: one line naming the dread + good-day signal directly.}
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Non-clinical, non-alarmist, no medical claims. Behavioral and corpus-anchored only.
- Direct but kind. Prescribe; don't perform concern.

## Workflow

1. Collect the inputs (or infer from a described week, naming the assumption).
2. Compute points, index, tier, override; identify the two highest-risk inputs and the worst recovery dimension.
3. Read the corpus anchors for the selected phases.
4. Render the output. Offer the natural follow-up (track the index week over week) but note this skill computes a single read.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. Re-anchor recovery copy to another corpus's wellbeing topics; the scoring is corpus-agnostic.
