---
app-id: 17
app-name: "Saying No" Rehearsal
phase: 3
type: multi-turn rehearsal (host-driven dialog from a Path 4 brief)
updated: 2026-05-23
neighbor: 2 (deferred Mode-2 rehearse-the-counter)
---

# Engine — #17 "Saying No" Rehearsal

> Pick a stakeholder type and the specific ask they're making. Rehearse your "no" in a short back-and-forth; the coach names where it landed and where you weakened (hedging, over-explaining, leaving the door cracked), then hands you the corpus-canonical version of a polite, firm no with the rationale anchor that stakeholder needs. This is the **first true multi-turn app** in the catalog. The novel design decision is how multi-turn works inside a no-sampling Path 4 bundle: **the host chat model runs the dialog from a rehearsal brief the bundle hands it.** The bundle never tracks turns — the chat conversation is the state.

## Why this fits Path 4 (the key design)

The locked architecture has no `sampling/createMessage`; narration tools are pure compute that return a brief, and the host model renders. A rehearsal is just a richer brief: instead of "render this reading," the directive is "conduct this role-play." The bundle supplies (a) the counterparty persona, (b) the scoring rubric, (c) the corpus-canonical firm-no anchor, and (d) turn limits. The host model plays the stakeholder, lets the user respond, pushes back fairly, scores, and delivers the canonical version. No turn-state crosses the tool boundary. This is the same shape as #2's deferred Mode-2 ("you are now playing the skeptic... three turns max, then close with the surviving version"), generalized and made the whole app.

## Inputs

- `stakeholder` (enum): ceo / biggest-customer / sales-vp / eng-peer / board-member
- `the_ask` (text <=300): the specific request you need to decline
- `your_constraint` (text <=200, optional): why you have to say no (capacity, strategy, risk) — sharpens the coach's read of whether your rationale is the right one to lead with
- `mode` (enum): rehearse (you practice, coach reacts) | show-me (skip practice, just give the canonical firm-no for this stakeholder + ask)

## Per-stakeholder persona + rationale anchor

Each stakeholder pushes differently and needs a different rationale to hear a no without damage. Authored in Stage C; the spine:

```
ceo:             pushes on speed/ambition; needs the no framed as protecting the
                 bet they actually care about. Anchor: saying-no, managing-up.
biggest-customer: pushes on the relationship/threat-to-churn; needs the no framed
                 as a roadmap honesty that earns trust. Anchor: saying-no,
                 communicating-tradeoffs.
sales-vp:        pushes on the deal at risk; needs the no framed in revenue-aware
                 terms with an alternative path. Anchor: communicating-tradeoffs,
                 getting-buy-in.
eng-peer:        pushes on technical merit/respect; needs the no framed as shared
                 prioritization, not authority. Anchor: getting-buy-in.
board-member:    pushes on strategy/credibility; needs the no framed as evidence
                 of judgment, not defensiveness. Anchor: managing-up,
                 defending-big-bets.
```

## The coaching rubric (deterministic dimensions the host scores against)

The brief carries these so the host scores consistently across runs:

```
1. Firmness        — is it an actual no, or a soft maybe that leaves the door cracked?
2. Brevity         — over-explaining signals guilt; did they stop after the no?
3. Rationale fit   — did they lead with the reason THIS stakeholder can hear?
4. Door management — did they close cleanly or invite renegotiation?
5. Relationship    — did the no protect the relationship or spend it?
```

## The rehearsal loop (directive the host executes)

```
1. Open in persona: deliver {the_ask} the way {stakeholder} would, with their
   characteristic pressure.
2. Let the user respond with their no.
3. Push back ONCE, fairly and in persona. If their no was strong, acknowledge it.
   If it had a weak link (hedge, over-explain, cracked door), apply pressure
   exactly there.
4. Max 3 user turns total. Then break character.
5. Score the user against the five rubric dimensions, briefly and specifically.
6. Deliver the corpus-canonical polite firm no for this stakeholder + ask, and
   name the rationale anchor it leans on.

show-me mode: skip steps 1-5; go straight to step 6.
```

## Output shape (after the rehearsal closes)

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

## Voice rules (applied to all narration + in-persona dialog)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- In persona: pressure fairly, don't cartoon the stakeholder. The CEO is sharp, not a bully.
- As coach: specific, not generic. "You said 'I'll see what I can do' — that's a cracked door" beats "be more assertive."

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> rehearsal-cue: "The no you practice is the no that lands. The one you wing leaves the door cracked."

Distinct from the 12 locked shapes (a practice-vs-improvise contrast resolving to a concrete failure image, not a list/definition/reveal). Alternative: "You already know the answer is no. This is about the sentence that comes after it."

## Phase 0 URL-trick handoff (interim — works well here, it's conversational)

```
Help me rehearse saying no. Play the part of {stakeholder} making this ask:
"{the_ask}". {If supplied: My real constraint is: {your_constraint}.}

Open in character with the ask. Let me respond with my no. Push back once, fairly.
After at most three of my turns, break character and:
1. Score me on firmness, brevity, leading with the right rationale, closing the
   door cleanly, and protecting the relationship.
2. Give me the polite-but-firm version a {stakeholder} would actually accept,
   using Lenny's corpus on saying no.

Be a fair counterparty, not a pushover and not a cartoon.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author the five stakeholder personas (pressure style + the rationale each can hear) from saying-no + managing-up + communicating-tradeoffs + getting-buy-in + defending-big-bets.
- [ ] Author one corpus-canonical firm-no exemplar per stakeholder (5 total), 2-4 sentences each.
- [ ] Author 5 synthetic (stakeholder + ask) scenarios + a strong-no and weak-no sample response each, for golden-set evals of the rubric.
- [x] Cross-check anchors exist in `knowledge/topics/`: saying-no, communicating-tradeoffs, getting-buy-in, managing-up, defending-big-bets. → all present 2026-05-23.

## Open design questions for the owner

1. **Multi-turn in Path 4 = host-driven dialog from a brief (above).** This is the load-bearing decision and it sets the pattern #18 clones. Confirm you're good with "the host runs the role-play; the bundle supplies persona + rubric + anchor + turn limits and tracks no turn state." The alternative (tool round-trip per turn) fights the locked no-sampling design and adds latency for no benefit.
2. **Session persistence.** Proposed: persist only the rehearsal *setup* brief (so "rehearse my no" after an iframe submit works), not the dialog transcript. A `saying_no_history` (did your real conversation go the way you rehearsed?) is a clean stateful follow-up to defer.
3. **Voice mode.** APP_IDEAS mentions voice practice. Out of scope for the `.mcpb` (text only); note it as a Phase-1-web possibility.

## Phase 2 MCP App spec (Path 4 rehearsal brief — the real target)

- `saying_no_get_scenario` — entry tool, UI binding; iframe is a stakeholder picker + ask textarea + mode toggle. Returns stakeholder options for fallback.
- `saying_no_start` — validates stakeholder + ask + mode; persists the rehearsal brief via `writePending` (brief = persona directive + 5-dimension rubric + canonical-no anchor + turn limits + mode). `readOnlyHint: true` (the brief is ephemeral setup, not durable user data).
- `saying_no_narrate` — pure compute; returns the rehearsal brief for callers with inputs in hand. No persistence, no sampling.
- `saying_no_get_pending_narration` — disk read, MUST CALL framing; on `ready`, the host CONDUCTS the rehearsal per the brief's directive (this is the one app whose directive says "run a dialog," not "render a reading"). Triggers: "rehearse my no", "practice saying no", "help me decline this", "I just set up a saying-no rehearsal", embedded-widget phrasing.

Corpus access is local read. The iframe's post-submit job is minimal: confirm stakeholder + ask captured, "your rehearsal is starting in chat." The dialog + scoring + canonical no all happen in chat (the spine). No turn state persists. Establishes the multi-turn pattern #18 reuses verbatim.
