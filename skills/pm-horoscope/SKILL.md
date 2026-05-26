---
name: pm-horoscope
description: Give a PM their daily horoscope. A six-question quiz maps the user to one of twelve corpus-grounded PM archetypes (Bet-Defender, Theatre Director, Cornered Resource, and so on), then a deterministic reading seeded by date + archetype composes one paragraph in horoscope rhythm (an aspect line vs another archetype, a prediction, a nudge) plus a lucky corpus topic to read today. Same archetype + same date = same reading. Reads `knowledge/topics/`. Use when the user says "give me my PM horoscope", "what's my PM archetype", "PM horoscope for today", or wants the fun daily reading. The Claude Code skill version of the Working from Lenny PM Horoscope app.
---

# pm-horoscope

The skill version of the #53 PM Horoscope. A deterministic reading: no inference is needed for the core output, which is composed from pre-written slots seeded by `hash(date + archetype)`. A self-aware PM-meta humor app, but every archetype is grounded in a real corpus pattern with one virtue and one pitfall.

## Why this exists

The joke works because the archetypes are real failure-and-strength patterns from the corpus, dressed as astrology. It is reproducible (yesterday's reading can be regenerated) and it ends with a genuinely useful pointer: a lucky corpus topic to read today. Confident, slightly dramatic, never actually predictive.

## When to use

Trigger on "give me my PM horoscope", "what's my PM archetype", "PM horoscope for today". If the user has not taken the quiz, administer the six questions; if they already know their archetype, go straight to the reading.

## The twelve archetypes (each with a virtue and a pitfall)

```
1 Bet-Defender          7 Stakeholder-Pleaser
2 Theatre Director      8 Top-1-Percent
3 Cornered Resource     9 Saying-No
4 Pivot-Hanged         10 Eval-Forward
5 Customer-Adjacent    11 Strategy-Skeptic
6 Founder-Mode Returnee 12 Empathy-Tourist
```

Each archetype's corpus anchors, 30 predictions, 20 nudges, and 11 aspect lines (one per partner archetype) are authored in `apps/53-pm-horoscope/prompt.md`. Read the slots from there; do not invent new ones.

## The six-question quiz (maps answers to an archetype)

```
1. Dissent tolerance        (Bet-Defender <-> Stakeholder-Pleaser)
2. Ritual-vs-outcome bias   (Theatre Director <-> Customer-Adjacent)
3. Moat self-image          (Cornered Resource <-> Strategy-Skeptic)
4. Change-readiness         (Pivot-Hanged <-> Founder-Mode Returnee)
5. Customer-proximity       (Customer-Adjacent <-> Empathy-Tourist)
6. Decision velocity        (Saying-No <-> Top-1-Percent vs Eval-Forward)
```

## The reading (deterministic composition)

```
seed = sha256(date_iso + "::" + archetype_id)
aspect_partner_id = seed[0:2] % 11   (skip self)
aspect_variant    = seed[2] % 3
prediction_idx    = seed[3:5] % len(predictions[archetype])
nudge_idx         = seed[5:7] % len(nudges[archetype])
topic_idx         = seed[7:9] % len(topics[archetype])
```

Output template:

```
[Day of week and date]

[Archetype name]

Today, [ASPECT]. [PREDICTION]. [NUDGE].

Lucky topic file: [TOPIC_FILE].
```

Same archetype + same date always produces the same reading. The lucky topic links to the matching corpus page: `https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/<slug>.md`.

## Corpus anchors

Each archetype rotates ~5 corpus topic files (listed per archetype in the app spec; all anchor substitutions were verified present, e.g., `defending-big-bets`, `velocity-core4`, `seven-powers`, `pivots-art`, `continuous-discovery`, `jobs-to-be-done`). The reading itself needs no corpus read; the lucky-topic pointer is the only corpus link.

## Optional deeper reading

If the user wants more, expand the deterministic reading into a one-page narrative grounded in the lucky topic file, keeping the horoscope tone: confident, slightly dramatic, never actually predictive.

## Voice rules

- No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Horoscope rhythm: confident and a little dramatic, never literally predictive. The archetypes are affectionate, not mocking.

## Workflow

1. If no archetype known, administer the six-question quiz and map to an archetype.
2. Compute the seed from today's date + archetype; select the aspect / prediction / nudge / lucky-topic slots from the app spec.
3. Render the reading in the template. Offer the deeper one-page reading.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces for the lucky-topic pointer only. The twelve archetypes and the seeded composition are corpus-agnostic; re-anchor each archetype's topic rotation to another corpus.
