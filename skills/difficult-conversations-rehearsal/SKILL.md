---
name: difficult-conversations-rehearsal
description: Rehearse a hard conversation before it happens (poor-performance talk, peer escalation, layoff delivery, cutting a committed feature, killing an exec's pet project, opening a PIP). The skill plays the counterparty in a short role-play, pushes back once fairly, scores you on empathy/clarity/decisiveness/letting-silence-work/dignity, then delivers the version that holds up with the silence beat marked. A fournier mode contrasts your intended opening against canonical leadership guidance. Reads `knowledge/topics/`. Use when the user asks to "rehearse a difficult conversation", "practice delivering bad news", "help me tell my report", "rehearse the layoff talk", "practice the PIP". The Claude Code skill version of the Working from Lenny Difficult-Conversations Rehearsal app.
---

# difficult-conversations-rehearsal

The skill version of the #18 Difficult-Conversations Rehearsal. Clones the #17 saying-no-rehearsal architecture: the skill runs the dialog itself, scores it, and delivers the canonical handling. The deltas from #17 are a scenario set, a different rubric, and a named-expert comparison mode. Companion to `lenny-actualize`.

## Why this exists

The hardest part of a difficult conversation isn't the sentence. It's the four seconds after it. People soften the message into ambiguity, hide behind "the company decided," and fill the silence to ease their own discomfort. Rehearsing once against a realistic counterparty surfaces where it breaks and hands over the version that holds up, with the silence beat marked.

## When to use

Trigger on "rehearse a difficult conversation", "practice delivering bad news", "help me tell my report", "rehearse the layoff talk", "practice the PIP". Three modes: rehearse, show-me, fournier.

## Inputs

- `scenario` (enum): poor-performance / peer-escalation / layoff-delivery / scope-cut-to-customer / killing-pet-project / pip-kickoff
- `your_relationship` (optional <=200): history with this person - calibrates the counterparty's reaction
- `mode`: rehearse | show-me | fournier (contrasts the user's intended approach against canonical guidance, skips role-play)

## The rubric (deterministic dimensions)

```
1. Empathy      - acknowledge the other person's reality before the hard part?
2. Clarity      - unmistakable, or softened into ambiguity?
3. Decisiveness - own the decision, or hide behind "the company decided"?
4. Silence      - deliver it and stop, letting the other person respond, or fill
                  the silence to ease your own discomfort?
5. Dignity      - did the other person leave with their standing intact?
```

Silence is the dimension most people fail and the one the corpus most emphasizes: the four seconds after the hard sentence belong to the other person.

## The rehearsal loop

Identical structure to #17: open in persona (counterparty reacts as they realistically would for this scenario - a laid-off report reacts differently than an exec whose pet project just died), let the user respond, push back once fairly, max 3 user turns, break character, score against the five dimensions, deliver the canonical handling for THIS scenario with the silence beat marked explicitly. show-me skips the role-play.

fournier mode: the user states their intended opening; contrast it with canonical leadership guidance - what to keep, what to cut, and the one move the canonical approach makes that the user's misses. Frame as guidance, not a verdict. Attribute to "canonical leadership guidance in the corpus" and name Camille Fournier only where `knowledge/topics/` actually quotes her; do not put words in a real person's mouth.

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/difficult-conversations.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/communicating-bad-news.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/giving-feedback-as-leader.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/performance-reviews.md

All verified present. Read the anchors for the chosen scenario; the silence emphasis comes from difficult-conversations + communicating-bad-news.

## Output (after the rehearsal closes)

```
How that landed:
  Empathy: {note}   Clarity: {note}   Decisiveness: {note}
  Silence: {note}   Dignity: {note}
Where you weakened: {the single most important fix}
The version that holds up, for {scenario}:
  "{canonical handling, with the hard sentence and the silence beat marked}"
  Why it works: {one line, anchored}
{If fournier mode: keep / cut / the one move you're missing.}
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- In persona: react honestly, don't cartoon the counterparty.
- As coach: specific, not generic.

## Workflow

1. Collect scenario + mode (+ optional relationship).
2. Read the corpus anchors for the scenario.
3. rehearse: run the loop, scoring on the way out, mark the silence beat in the canonical version. show-me: deliver the canonical handling directly. fournier: run the keep/cut/missing-move comparison.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. Re-anchor the six scenarios to another corpus's leadership-conversation topics; the rubric and loop are corpus-agnostic. Shares the multi-turn pattern with `saying-no-rehearsal`.
