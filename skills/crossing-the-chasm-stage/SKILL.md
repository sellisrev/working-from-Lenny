---
name: crossing-the-chasm-stage
description: Locate a company on Moore's adoption curve (early market / at the chasm / bowling alley / tornado / main street) from its customer mix, acquisition trend, pain specificity, whole-product completeness, beachhead, and reference customers, then give the play for the next transition and the way that play most commonly gets run wrong. Reads `knowledge/topics/`. Use when the user asks "where are we on the adoption curve", "are we in the chasm", "what stage is my company in", "why have early-adopter referrals stopped reaching mainstream buyers", or describes their GTM situation. The Claude Code skill version of the Working from Lenny Crossing-the-Chasm Stage Finder app.
---

# crossing-the-chasm-stage

The skill version of the #34 Crossing-the-Chasm Stage Finder. From a few categorical signals, place the company on Moore's curve and warn it about the transition it is walking into. The reframe is deliberate: not "are we succeeding" but "what does success look like next, and are we set up for it." Companion to `lenny-actualize` and `lenny-pressure-test`; consumes the knowledge base.

## Why this exists

Most products that die do so in the chasm: the play that won visionary early adopters actively repels pragmatist mainstream buyers, and the team doesn't notice because the early numbers looked good. The corpus value (`crossing-the-chasm.md`, `category-creation.md`) is naming the chasm and the stage-specific play. This skill locates the user and tells them the next move, not a grade.

## When to use

Trigger on "where are we on the adoption curve", "are we in the chasm", "what stage is my company in", "why have referrals stopped reaching mainstream buyers". Never refuse on thin input; infer from a described GTM situation and name the assumption.

## Inputs

```
customer_mix        -- % innovators/visionaries / % pragmatists / % don't-know (the don't-know share is itself a signal)
acquisition_trend   -- accelerating / steady / stalling / lumpy-referral-only
pain_specificity    -- one-sentence-named-pain / broad-value-prop / still-figuring-it-out
whole_product       -- yes-complete / partial / no (can a mainstream buyer adopt without assembling missing pieces?)
beachhead_named     -- yes-one-segment / several-segments / no-we-sell-to-anyone
reference_customers -- pragmatist-references-exist / only-visionary-references / none (optional)
```

## The stages (Moore curve)

```
1. Early market   -- innovators + visionaries; sold on the vision, tolerant of rough edges
2. The chasm      -- the dangerous gap; early-adopter referrals don't reach pragmatists
3. Bowling alley  -- beachhead segment(s); whole-product wins a niche, then adjacency
4. Tornado        -- mainstream pragmatist demand inflects; land-grab dynamics
5. Main street    -- saturation; defend, extend, segment
```

## Stage assignment (deterministic rule cascade, not a score)

Chasm position is categorical and certain signals are dispositive, so evaluate the cascade in order and stop at the first match:

```
1. pain still-figuring-it-out OR don't-know > 50%            -> early market (you don't yet know who you're for)
2. visionary-heavy + (stalling | lumpy-referral) + not-whole-product -> AT THE CHASM (the headline diagnosis)
3. beachhead=one-segment + whole-product partial/complete + pragmatist-references -> bowling alley
4. accelerating + pragmatists-majority                       -> tornado
5. pragmatists-majority + (steady | stalling)                -> main street
else                                                          -> early market (narration explains the ambiguity)
```

Exact "heavy"/"majority" thresholds are set against the authoring examples in `apps/34-crossing-the-chasm-stage/prompt.md`; the cascade order is the load-bearing design.

## Next-stage play + failure mode (the forward deliverable)

```
early market -> chasm:    pick ONE beachhead. Failure: chasing every inbound segment at once.
chasm -> bowling alley:   build the whole product for ONE pragmatist segment, win it completely.
                          Failure: declaring victory on visionary logos and assuming pragmatists follow.
bowling alley -> tornado: standardize, simplify install, prepare to scale GTM.
                          Failure: over-customizing per deal so you can't scale when demand inflects.
tornado -> main street:   defend share, segment, extend whole product.
                          Failure: still running land-grab tactics after the grab is over.
```

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/crossing-the-chasm.md (primary, Moore)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/category-creation.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/consumer-business-stages.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/b2b-pmf.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/gtm-motions.md

All verified present. Check obsolete/caution layers.

## Output

```
You're here: {stage}
Why: {the two or three signals that placed you, named plainly}

Your next transition: {next stage}
The play: {corpus-grounded play for getting there}
How it usually goes wrong: {the failure mode, with the corpus's reasoning}

[If AT THE CHASM: "This is the part where most products die. Here is the one move that matters."]
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Forward-looking, not congratulatory. The diagnosis serves the next move, never a grade.
- Moore-faithful: the chasm is real and lethal; don't soften the at-the-chasm read.

## Workflow

1. Collect or infer the six signals; name the assumption.
2. Run the cascade in order; assign the stage and the placing signals.
3. Read the anchors; write the next-stage play + failure mode.
4. If AT THE CHASM, give the direct one-move line.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The cascade and the transition plays are corpus-agnostic; the per-stage narration re-anchors to another corpus's GTM-stage topics.
