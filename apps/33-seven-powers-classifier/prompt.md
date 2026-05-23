---
app-id: 33
app-name: 7 Powers Self-Classifier
phase: 3
type: wizard-quiz + deterministic claim-vs-evidence classification + LLM narration
updated: 2026-05-23
neighbor: 9
---

# Engine — #33 7 Powers Self-Classifier

> Hamilton Helmer's seven powers as a diagnostic that separates the moats you have *evidence for* from the ones you're *delusional about*. The novel mechanic vs. the other wizards: every power is probed by two kinds of question — a **claim** ("do you believe you have this?") and **evidence** ("is this specific observable thing true?"). The deterministic engine flags the gap. A high claim with thin evidence is the headline finding, not a footnote. Wizard shape clones #9 NSM Finder; the claim-vs-evidence scoring matrix is new.

## Audience and framing

Founders, strategists, and investors evaluating a company. Output is a meeting artifact: a board can read it together. The tone is unsentimental — the corpus value is puncturing the reflexive "we have network effects" claim that nearly every founder makes. Per `seven-powers.md`, a power is a benefit the company has that competitors *can't* replicate (the "barrier" is the load-bearing half most people skip).

## The seven powers (Helmer)

```
1. Scale economies     — unit costs fall as volume rises; rivals can't match cost
2. Network economies   — value rises with users; late entrants face a cold-start wall
3. Counter-positioning  — a new model incumbents can't copy without harming their own
4. Switching costs      — customers face real cost/risk/hassle to leave
5. Branding             — willingness to pay from trust/identity, not function
6. Cornered resource    — exclusive access to a coveted asset (talent, IP, supply)
7. Process power        — embedded org/process advantage rivals can't reverse-engineer fast
```

## Question design (~25 questions, the claim-vs-evidence matrix)

For each power: **1 claim question** + **2–3 evidence questions**. Claim is "we have this / maybe / no." Evidence questions are specific and observable, rated **true / partly / false**.

Examples (full bank authored in Stage C):

```
Network economies
  CLAIM: "We have network effects."  (have / maybe / no)
  EVIDENCE:
    - "A new user gets measurably more value this month than they would have a
       year ago, because of other users." (true/partly/false)
    - "A well-funded competitor launching today would struggle to get our users
       value because they'd start with an empty network." (true/partly/false)
    - "We can name the specific interaction between users that creates the value
       (not just 'more users = good')." (true/partly/false)

Switching costs
  CLAIM: "Customers would find it costly to leave us."
  EVIDENCE:
    - "Leaving means losing data/history/config they can't easily recreate." (t/p/f)
    - "Their team has built workflows or integrations around us." (t/p/f)
    - "We can cite a churned customer who came back because switching hurt." (t/p/f)
```

## Scoring (per power)

```
evidence_score = sum over evidence questions: true=2, partly=1, false=0
evidence_pct   = evidence_score / max_for_that_power

classification per power:
  HAS EVIDENCE   evidence_pct >= 0.66
  PLAUSIBLE      0.34 <= evidence_pct < 0.66
  ABSENT         evidence_pct < 0.34

delusion flag (the #33-specific finding):
  claim == "have" AND classification == ABSENT      -> "DELUSIONAL: you're
    claiming {power} with no evidence behind it."
  claim == "have" AND classification == PLAUSIBLE    -> "OVERSTATED: real
    possibility, but you're more sure than the evidence warrants."
  claim == "no" AND classification == HAS EVIDENCE   -> "BLIND SPOT: you may
    have {power} and not be leaning on it."
```

## Testable-signal generator (the forward-looking deliverable)

For each power classified HAS EVIDENCE or PLAUSIBLE, the narration names **one observable signal in the next quarter** that would confirm or kill it, anchored in `seven-powers.md`. Examples: network economies -> "cohort N+1's week-4 value exceeds cohort N's, controlling for product changes"; switching costs -> "voluntary churn among 12-month+ customers stays below X% even after a price increase."

## Output shape

```
Your power map:

HAS EVIDENCE: {powers}        — these are real. Defend and compound them.
PLAUSIBLE:    {powers}        — possible; here's the test.
ABSENT:       {powers}
DELUSIONAL:   {powers}        — you claimed these; the evidence says no.

For each real or plausible power:
  {power}: {one-paragraph why, grounded in seven-powers.md benefit+barrier framing}
  Test next quarter: {one observable signal that confirms or kills it}

The honest headline: {one line — the single most important gap between what you
believe and what you can show}
```

## Voice rules (applied to all narration)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Unsentimental. Name the delusion plainly; founders claim network effects reflexively and the tool's job is to stop that.
- Helmer-faithful: a power is benefit AND barrier. Never call something a power if rivals can copy it.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> delusion-puncture: "Everyone claims network effects. Almost no one has them. Let's find out which one you are."

Distinct from the 12 locked shapes (a setup-then-challenge with an implied test, not a list/definition/confession). Alternative: "Seven powers. You probably have one. You'll claim four."

## Phase 0 URL-trick handoff (interim)

```
I want to know which of Hamilton Helmer's seven powers my business actually has
evidence for, versus which I'm fooling myself about. Here's how I answered the
evidence questions for each power:

{power-by-power: claim + evidence answers}

Using Lenny Rachitsky's corpus (especially seven-powers, plus good-strategy-rumelt
and distribution/data-moat material), please:
1. Classify each power: has evidence, plausible, absent, or delusional (I claim it
   but can't show it).
2. For each real or plausible power, give me one observable signal in the next
   quarter that would confirm or kill it.
3. Tell me the single most important gap between what I believe and what I can show.

Be unsentimental. If I'm claiming a moat I don't have, say so.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author the full ~25-question bank: 1 claim + 2-3 evidence questions per power, evidence questions specific and observable.
- [ ] Author the per-power "why this is/ isn't a power" narration line (benefit+barrier framing) from seven-powers.md.
- [ ] Author the testable-signal template per power (7 signals).
- [ ] Author 4-6 synthetic company profiles (incl. a classic "claims network effects, has none" case) for golden-set evals.
- [x] Cross-check anchors exist in `knowledge/topics/`: seven-powers, good-strategy-rumelt, distribution-as-moat, ai-data-as-moat, category-creation. → all present 2026-05-23.

## Open design questions for the owner

1. **Question count.** APP_IDEAS says 25. Seven powers × (1 claim + 3 evidence) = 28; × (1 + 2) = 21. Proposed: variable per power (network/switching/scale get 3 evidence questions, branding/process get 2) landing near 25. OK, or hold to a flat count?
2. **Counter-positioning** is the hardest to self-diagnose (it's about the *incumbent's* inability to respond). Proposed: frame its evidence questions around "would copying us hurt an incumbent's existing business?" rather than asking the user to assess their own model. Confirm framing.
3. **Investor mode?** APP_IDEAS names investors as an audience. Proposed: ship single self-assessment voice first; an "assessing someone else's company" second-person variant is a clean follow-up, not v1.

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Four-tool Path 4 clone of #9 (wizard shape):

- `seven_powers_get_questions` — entry tool, UI binding; returns the claim+evidence bank grouped by power.
- `seven_powers_score` — deterministic per-power classification + delusion/overstated/blind-spot flags; echoes answers; persists the brief via `writePending`. `readOnlyHint: true`.
- `seven_powers_narrate` — pure compute; `narration_brief` with structure {power_map, per_power_detail, headline}. No persistence, no sampling.
- `seven_powers_get_pending_narration` — disk read, MUST CALL framing. Triggers: "read my power map", "which moats do I have", "am I deluded about network effects", "I just took the 7 powers diagnostic", embedded-widget phrasing.

Corpus access is local read. Iframe shows the classified power map (the identifier-level result: which power is in which bucket + delusion flags); chat narration carries the per-power why + testable signals + headline (the spine), per the iframe-output design rule. Stateful re-classification ("last quarter you were delusional about switching costs; the churn test you set — did it confirm?") is the natural follow-up; defer it like the other calibration tools.
