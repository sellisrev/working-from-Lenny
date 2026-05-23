---
app-id: 34
app-name: Crossing-the-Chasm Stage Finder
phase: 3
type: wizard + deterministic stage assignment + LLM narration
updated: 2026-05-23
neighbor: 33, 9
---

# Engine — #34 Crossing-the-Chasm Stage Finder

> Inputs about customer mix, acquisition velocity, pain specificity, and whether a whole-product story exists. Output: where you sit on Moore's adoption curve, the play for the *next* stage, and the failure modes of running that play wrong. The reframe is deliberate — not "are we succeeding" but "what does success look like next, and are we set up for it." Wizard + deterministic stage assignment clones #33 / #9; the stage-transition logic is the new part.

## Audience and framing

Founders and GTM leads. The corpus value (`crossing-the-chasm.md`, `category-creation.md`) is naming the chasm itself — the gap between visionary early adopters and pragmatist mainstream buyers, where most products die because the play that won early adopters actively repels pragmatists. The tool's job is to locate the user and warn them about the transition they're walking into.

## The stages (Moore curve)

```
1. Early market        — innovators + visionaries; sold on the vision, tolerant of rough edges
2. The chasm           — the dangerous gap; early-adopter referrals don't reach pragmatists
3. Bowling alley        — beachhead segment(s); whole-product wins a niche, then adjacency
4. Tornado             — mainstream pragmatist demand inflects; land-grab dynamics
5. Main street         — saturation; defend, extend, segment
```

## Inputs

- `customer_mix` (three numbers summing to ~100): % innovators/visionaries, % pragmatists, % don't-know. (The "don't-know" share is itself a signal.)
- `acquisition_trend` (enum): accelerating / steady / stalling / lumpy-referral-only
- `pain_specificity` (enum): one-sentence-named-pain / broad-value-prop / still-figuring-it-out
- `whole_product` (enum): yes-complete / partial / no — "Can a mainstream buyer adopt you without assembling missing pieces themselves?"
- `beachhead_named` (enum): yes-one-segment / several-segments / no-we-sell-to-anyone
- `reference_customers` (enum, optional): pragmatist-references-exist / only-visionary-references / none

## Stage assignment (deterministic)

A small rule cascade rather than a score sum, because chasm position is categorical and certain signals are dispositive:

```
if pain_specificity == "still-figuring-it-out" OR customer_mix.dontknow > 50:
    stage = "early market (pre-chasm; you don't yet know who you're for)"

elif customer_mix.visionaries-heavy AND acquisition_trend in {stalling, lumpy-referral-only}
     AND whole_product != "yes-complete":
    stage = "AT THE CHASM"   # the dangerous diagnosis; the headline case

elif beachhead_named == "yes-one-segment" AND whole_product in {partial, yes-complete}
     AND reference_customers == "pragmatist-references-exist":
    stage = "bowling alley"

elif acquisition_trend == "accelerating" AND customer_mix.pragmatists-majority:
    stage = "tornado"

elif customer_mix.pragmatists-majority AND acquisition_trend in {steady, stalling}:
    stage = "main street"

else:
    stage = "early market"   # default; narration explains the ambiguity
```

(Exact thresholds for "heavy"/"majority" set in Stage C against authoring examples; the cascade order is the load-bearing design.)

## Next-stage play + failure mode (the forward deliverable)

For the assigned stage, narration returns the play for the *next* transition and the way it most commonly goes wrong:

```
early market -> chasm:    "Pick one beachhead. The instinct to stay horizontal is
  what kills you here." Failure mode: chasing every inbound segment at once.
chasm -> bowling alley:   "Build the whole product for ONE pragmatist segment;
  win it completely before adjacency." Failure mode: declaring victory on
  visionary logos and assuming pragmatists will follow.
bowling alley -> tornado: "Standardize, simplify install, prepare to scale GTM."
  Failure mode: over-customizing per deal so you can't scale when demand inflects.
tornado -> main street:   "Defend share, segment, extend whole product."
  Failure mode: still running land-grab tactics after the grab is over.
```

## Output shape

```
You're here: {stage}
Why: {the two or three signals that placed you, named plainly}

Your next transition: {next stage}
The play: {corpus-grounded play for getting there}
How it usually goes wrong: {the failure mode, with the corpus's reasoning}

{If AT THE CHASM: a direct line — "This is the part where most products die.
Here is the one move that matters."}
```

## Voice rules (applied to all narration)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Forward-looking, not congratulatory. The diagnosis is in service of the next move, never a grade.
- Moore-faithful: the chasm is real and lethal; don't soften the at-the-chasm read.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> stage-reframe: "You're not failing. You're between two playbooks, running the wrong one."

Distinct from the 12 locked shapes (a correction-then-reframe, not list/definition/confession). Alternative: "The early adopters loved you. That's exactly the problem."

## Phase 0 URL-trick handoff (interim)

```
I want to know where my company sits on the crossing-the-chasm curve and what
the next stage demands. Here's my situation:

Customer mix (visionaries / pragmatists / don't-know): {n/n/n}%.
Acquisition trend: {accelerating/steady/stalling/lumpy-referral-only}.
Pain I solve: {one named pain / broad value prop / still figuring it out}.
Whole product (can a mainstream buyer adopt without assembling missing pieces?):
{yes/partial/no}. Beachhead segment named: {yes-one / several / no}.
Reference customers: {pragmatist / only-visionary / none}.

Using Lenny Rachitsky's corpus (especially crossing-the-chasm and
category-creation), please:
1. Tell me which stage I'm in and the two or three signals that place me there.
2. Give me the play for the NEXT stage and the most common way that play gets
   run wrong.
3. If I'm at the chasm, say so directly and name the one move that matters.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author per-stage narration (why-you're-here lines) + per-transition play + failure mode, from crossing-the-chasm + category-creation + b2b-pmf + gtm-motions.
- [ ] Set the "heavy"/"majority" thresholds against 6 synthetic company profiles (one per stage + a clean at-the-chasm case) for golden-set evals.
- [x] Cross-check anchors exist in `knowledge/topics/`: crossing-the-chasm, category-creation, consumer-business-stages, b2b-pmf, gtm-motions. → all present 2026-05-23.

## Open design questions for the owner

1. **Cascade vs. score.** Proposed a categorical rule cascade (above) rather than #9-style family lookup, because chasm position has dispositive signals (a heavy-visionary + stalling + no-whole-product company IS at the chasm regardless of other inputs). Confirm you want categorical, not a point score.
2. **"At the chasm" as its own stage.** Moore treats the chasm as a gap, not a stage. Proposed surfacing it as a distinct diagnosis because it's the highest-value finding. OK?

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Four-tool Path 4 clone of #9 / #33:

- `chasm_get_form` — entry tool, UI binding; returns field defs (three-number customer mix + enums).
- `chasm_score` — deterministic stage assignment via the cascade; echoes inputs + names the placing signals; persists the brief via `writePending`. `readOnlyHint: true`.
- `chasm_narrate` — pure compute; `narration_brief` with structure {stage, placing_signals, next_play, failure_mode}. No persistence, no sampling.
- `chasm_get_pending_narration` — disk read, MUST CALL framing. Triggers: "where am I on the chasm", "what stage are we in", "read my chasm diagnosis", "I just filled in the stage finder", embedded-widget phrasing.

Corpus access is local read. Iframe shows the assigned stage + placing signals (identifier-level); chat narration carries the next-stage play + failure mode (the spine). Stateful re-assessment (quarter-over-quarter stage movement) is the natural follow-up; defer it. Pairs conceptually with #33 (both are board-meeting strategy artifacts) but no inter-tool messaging — same documentary-link convention as #37/#9.
