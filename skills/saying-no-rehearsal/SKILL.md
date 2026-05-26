---
name: saying-no-rehearsal
description: Rehearse a hard no out loud before you have to say it for real. Pick a stakeholder (CEO, biggest customer, sales VP, eng peer, board member) and the ask you need to decline; the skill plays that stakeholder in a short role-play, pushes back once fairly, scores your no on firmness/brevity/rationale-fit/door-management/relationship, then hands you the corpus-canonical polite firm no with the rationale that stakeholder can hear. Reads `knowledge/topics/`. Use when the user asks to "rehearse saying no", "practice declining this", "help me say no to my CEO", "how do I turn this down without damage", or describes a request they need to refuse. The Claude Code skill version of the Working from Lenny Saying-No Rehearsal app.
---

# saying-no-rehearsal

The skill version of the #17 "Saying No" Rehearsal. A short multi-turn role-play that scores the user's no and delivers the version that lands. Companion to `lenny-actualize` and `lenny-pressure-test`. This skill runs the dialog itself (the conversation is the state); no turn-tracking machinery needed.

## Why this exists

You already know the answer is no. The skill is about the sentence that comes after it. People hedge, over-explain, and leave the door cracked. Rehearsing once, against a counterparty who pushes back fairly, surfaces exactly where the no weakens and hands over the corpus-canonical version framed for the specific stakeholder.

## When to use

Trigger on "rehearse saying no", "practice declining this", "help me say no to my {stakeholder}", "turn this down without damage". Two modes: rehearse (practice, then coach) and show-me (skip practice, just give the canonical no).

## Inputs

- `stakeholder` (enum): ceo / biggest-customer / sales-vp / eng-peer / board-member
- `the_ask` (text <=300): the request to decline
- `your_constraint` (optional <=200): why you have to say no (capacity, strategy, risk) - sharpens which rationale to lead with
- `mode`: rehearse | show-me

## Per-stakeholder pressure + rationale anchor

Each stakeholder pushes differently and needs a different rationale to hear a no without damage:

```
ceo:              pushes speed/ambition; frame the no as protecting the bet they
                  care about.   Anchor: saying-no, managing-up.
biggest-customer: pushes the relationship/churn threat; frame as roadmap honesty
                  that earns trust.   Anchor: saying-no, communicating-tradeoffs.
sales-vp:         pushes the deal at risk; frame in revenue-aware terms with an
                  alternative path.   Anchor: communicating-tradeoffs, getting-buy-in.
eng-peer:         pushes technical merit/respect; frame as shared prioritization,
                  not authority.   Anchor: getting-buy-in.
board-member:     pushes strategy/credibility; frame as evidence of judgment, not
                  defensiveness.   Anchor: managing-up, defending-big-bets.
```

## The coaching rubric (deterministic dimensions)

```
1. Firmness       - an actual no, or a soft maybe that leaves the door cracked?
2. Brevity        - over-explaining signals guilt; did they stop after the no?
3. Rationale fit  - did they lead with the reason THIS stakeholder can hear?
4. Door management- closed cleanly or invited renegotiation?
5. Relationship   - did the no protect the relationship or spend it?
```

## The rehearsal loop

```
1. Open in persona: deliver {the_ask} the way {stakeholder} would, with their
   characteristic pressure.
2. Let the user respond with their no.
3. Push back ONCE, fairly, in persona. If the no was strong, acknowledge it. If it
   had a weak link (hedge, over-explain, cracked door), apply pressure exactly there.
4. Max 3 user turns. Then break character.
5. Score against the five dimensions, briefly and specifically.
6. Deliver the corpus-canonical polite firm no for this stakeholder + ask, and name
   the rationale anchor it leans on.
show-me mode: skip 1-5, go straight to 6.
```

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/saying-no.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/communicating-tradeoffs.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/getting-buy-in.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/managing-up.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/defending-big-bets.md

All verified present. Read the anchors for the chosen stakeholder before the canonical no.

## Output (after the rehearsal closes)

```
How that landed:
  Firmness: {note}   Brevity: {note}   Rationale fit: {note}
  Door: {note}       Relationship: {note}
Where you weakened: {the single most important fix}
The version that lands, for a {stakeholder}:
  "{canonical polite firm no, 2-4 sentences, leading with the rationale this
    stakeholder can hear}"
  Why it works: {one line, anchored}
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- In persona: pressure fairly, don't cartoon the stakeholder. The CEO is sharp, not a bully.
- As coach: specific. "You said 'I'll see what I can do' - that's a cracked door" beats "be more assertive."

## Workflow

1. Collect stakeholder + ask + mode (+ optional constraint).
2. Read the corpus anchors for that stakeholder.
3. rehearse: run the loop, scoring on the way out. show-me: deliver the canonical no directly.
4. Close with the version that lands + why it works.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. Re-anchor the five personas to another corpus's negotiation/communication topics; the rubric and loop are corpus-agnostic. The #18 difficult-conversations skill clones this pattern.
