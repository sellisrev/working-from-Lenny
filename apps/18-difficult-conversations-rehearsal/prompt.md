---
app-id: 18
app-name: Difficult-Conversations Rehearsal
phase: 3
type: multi-turn rehearsal (host-driven dialog from a Path 4 brief)
updated: 2026-05-23
neighbor: 17 (clones the multi-turn pattern verbatim)
---

# Engine — #18 Difficult-Conversations Rehearsal

> Pick a scenario from a curated list, then run a multi-turn dialog with the host playing the counterparty. The coach scores empathy, clarity, decisiveness, and willingness to let silence work, and offers a "what would Camille Fournier do" comparison against canonical leadership guidance. **Clones #17 "Saying No" rehearsal's architecture verbatim** — the host runs the dialog from a rehearsal brief; the bundle tracks no turn state. The deltas from #17: a richer scenario set, a different rubric, and the named-expert comparison mode. Read #17's prompt.md first; this spec only documents what differs.

## What's identical to #17 (do not re-derive)

- Multi-turn = host-driven dialog from a Path 4 brief. No sampling, no turn-state across the tool boundary. (See #17 "Why this fits Path 4.")
- Tool set, persistence approach (persist setup brief only, not transcript), `readOnlyHint: true` on the ephemeral setup write, MUST-CALL get-pending whose directive says "conduct the dialog."
- Voice rules: in-persona pressure is fair not cartoonish; coaching is specific not generic; no em dashes, no AI tells.

## What differs — the scenario set

The counterparty is scenario-defined, not a stakeholder-type enum:

```
scenario (enum):
  poor-performance        — telling a report their work isn't meeting the bar
  peer-escalation         — confronting a peer who keeps going around you
  layoff-delivery         — delivering a layoff with dignity
  scope-cut-to-customer   — telling a paying customer a committed feature is cut
  killing-pet-project     — telling an exec their pet project is dead
  pip-kickoff             — opening a performance-improvement plan
```

- `your_relationship` (text <=200, optional): "what's your history with this person?" — calibrates how the counterparty reacts.
- `mode` (enum): rehearse | show-me | fournier — `fournier` mode skips role-play and contrasts the user's intended approach (pasted) against canonical leadership-podcast guidance.

## What differs — the rubric

```
1. Empathy        — did they acknowledge the other person's reality before the hard part?
2. Clarity        — was the message unmistakable, or softened into ambiguity?
3. Decisiveness   — did they own the decision, or hide behind "the company decided"?
4. Silence        — did they deliver it and then stop, letting the other person
                    respond, or did they fill the silence to ease their own discomfort?
5. Dignity        — did the other person leave with their standing intact?
```

Silence is the dimension most people fail and the one the corpus (`difficult-conversations`, `communicating-bad-news`) most emphasizes: the four seconds after the hard sentence belong to the other person.

## What differs — "what would Camille Fournier do" mode

A comparison pass: the user states their intended opening; the narration contrasts it with canonical guidance from the leadership corpus (Fournier-style on hard management conversations) — what they'd keep, what they'd cut, and the one move the canonical approach makes that the user's misses. Anchored in `giving-feedback-as-leader`, `performance-reviews`, `difficult-conversations`. Frame the comparison as guidance, not a verdict; attribute the framing where the corpus names it.

## The rehearsal loop (directive the host executes)

Identical structure to #17 (open in persona, let user respond, push back once fairly, max 3 user turns, break character, score, deliver canonical version). Persona reaction is scenario-driven: a laid-off report reacts differently than an exec whose pet project just died. The "deliver the canonical version" step here produces the model way to handle THIS scenario, with the silence beat marked explicitly.

## Output shape (after the rehearsal closes)

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

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> silence: "The hardest part isn't the sentence. It's the four seconds after it."

Distinct from the 12 locked shapes and from #17's rehearsal-cue (this names the specific failure moment rather than contrasting practice vs. improvise). Alternative: "You rehearsed the bad news. You forgot to rehearse the pause."

## Phase 0 URL-trick handoff (interim)

```
Help me rehearse a difficult conversation: {scenario}. {If supplied: my history
with this person is {your_relationship}.}

Play the counterparty. Open by reacting as they realistically would. Let me
respond. Push back once, fairly. After at most three of my turns, break character
and:
1. Score me on empathy, clarity, decisiveness, letting silence work, and
   leaving the person's dignity intact.
2. Give me the version that holds up for this scenario, using Lenny's corpus on
   difficult conversations and giving feedback, and mark where the silence
   should go.

Be the counterparty honestly, not a cartoon.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author the six scenario personas (realistic counterparty reaction + the trap each scenario sets) from difficult-conversations + communicating-bad-news + giving-feedback-as-leader + performance-reviews.
- [ ] Author one canonical handling per scenario (6 total), silence beat marked.
- [ ] Author the "what would Camille Fournier do" keep/cut/missing-move template per scenario.
- [ ] Author 6 synthetic scenario+approach pairs (one strong, one that fills the silence) for golden-set evals.
- [x] Cross-check anchors exist in `knowledge/topics/`: difficult-conversations, communicating-bad-news, giving-feedback-as-leader, performance-reviews. → all present 2026-05-23.

## Open design questions for the owner

1. **Inherits #17's multi-turn decision.** Confirming #17's host-driven dialog model is approved auto-approves this one; they share the pattern.
2. **`fournier` mode attribution.** Proposed: attribute to "canonical leadership guidance in the corpus" and name Fournier only where `knowledge/topics/` actually quotes her, to avoid putting words in a real person's mouth. Confirm this caution.

## Phase 2 MCP App spec (Path 4 rehearsal brief — the real target)

Tool set mirrors #17 exactly, renamed:

- `difficult_conversations_get_scenario` — entry tool, UI binding; iframe is a scenario picker + relationship textarea + mode toggle.
- `difficult_conversations_start` — validates scenario + mode; persists the rehearsal brief via `writePending` (persona + 5-dimension rubric + canonical-handling anchor + turn limits + mode). `readOnlyHint: true`.
- `difficult_conversations_narrate` — pure compute; returns the brief. No persistence, no sampling.
- `difficult_conversations_get_pending_narration` — disk read, MUST CALL framing; on `ready` the host conducts the rehearsal (or the fournier comparison). Triggers: "rehearse this conversation", "practice the layoff talk", "help me tell them", "I just set up a difficult-conversations rehearsal", embedded-widget phrasing.

Corpus access is local read. Iframe confirms scenario captured; the dialog + scoring + canonical version happen in chat (the spine). No turn state persists. Because this clones #17, Stage A implementation should literally copy #17's tool files and swap the scenario data + rubric + brief builder, the same way #18 was always meant to follow #17 in the backlog order.
