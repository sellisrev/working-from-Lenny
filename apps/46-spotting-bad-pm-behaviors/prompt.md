---
app-id: 46
app-name: Spotting Bad PM Behaviors (field guide)
phase: 3
type: quiz + LLM narration
updated: 2026-05-23
neighbor: 44
---

# Field guide — #46 Spotting Bad PM Behaviors

> Companion to #44 PM Pitfalls, written for the *non-PM*: an engineer, designer, sales rep, or customer-success lead trying to figure out whether their PM is bad, or whether the friction is somewhere else. Quiz logic is deterministic; the narration is Path 4 (host chat model renders the brief). Clones the #44 architecture: deterministic checklist scoring + top-pattern picker + Path 4 narration, with two differences — the audience is non-PM, and each pattern carries a **what-to-do path** rather than a self-improvement exemplar.

## Audience and framing

The user is NOT the PM. They work alongside one and have a nagging suspicion. The tool's job is to (a) name the pattern they're seeing so it stops feeling like a personal grievance, (b) calibrate severity (is this a bad day or a bad pattern?), and (c) hand them a proportionate next move. The framing is deliberately fair: some friction is the user's own expectation gap, and the tool says so when the answers point that way.

ICP: primary = ICs and cross-functional partners at PM-led companies (eng, design, sales, CS). Secondary = eng managers and designers managing up into product. Non-PM audience is the whole point, mirroring #30 and contrasting with #44's PM-facing self-audit.

## The fifteen behaviors

Drawn from `spotting-bad-pm-behaviors.md` and `pm-pitfalls.md`, with Camille Fournier's engineer-side complaints as the spine. The user rates each on observed frequency: **often / sometimes / haven't seen it**.

Build note: anchors below are best-effort against the corpus. Before locking deployed copy, cross-check each against `knowledge/topics/` and substitute the closest real file where the named one is missing (log substitutions to `DECISIONS.md`).

| # | Behavior (as the non-PM sees it) | Anchor | Severity weight (1–3) |
|---|---|---|---|
| 1 | Never talks to paying customers, but speaks for them constantly | `spotting-bad-pm-behaviors.md`, `continuous-discovery.md` | 3 |
| 2 | Dismisses details as "small" without understanding why they aren't | `spotting-bad-pm-behaviors.md` | 3 |
| 3 | Presents the team's work as their own; engineers and designers go uncredited | `spotting-bad-pm-behaviors.md` (Fournier) | 3 |
| 4 | Can't say why you're building something beyond a stakeholder's name | `pm-pitfalls.md`, `spotting-bad-pm-behaviors.md` | 3 |
| 5 | Avoids the decision; waits for consensus and calls the wait "alignment" | `spotting-bad-pm-behaviors.md`, `decision-making-frameworks.md` | 3 |
| 6 | Roadmap whiplash; priorities reorder every week with no new information | `pm-pitfalls.md`, `defending-big-bets.md` | 3 |
| 7 | Says yes to everyone; never defends a tradeoff to a stakeholder | `saying-no.md` | 2 |
| 8 | Specs hand over the what and the when but never the why | `pm-pitfalls.md` | 2 |
| 9 | Runs standup as a status broadcast, not coordination | `pm-pitfalls.md`, `spotting-bad-pm-behaviors.md` | 2 |
| 10 | Ships and moves on; never asks whether the last thing worked | `pm-pitfalls.md` | 2 |
| 11 | Hides from the post-mortem, or runs it as blame-diffusion | `spotting-bad-pm-behaviors.md`, `top-1-percent-pm.md` | 2 |
| 12 | "Data-driven" is a way to avoid owning a judgment call | `pm-pitfalls.md` | 2 |
| 13 | Treats internal stakeholders as if they were the customer | `continuous-discovery.md` | 2 |
| 14 | Over-rotates on the loudest complaint; one Slack message reorders the quarter | `continuous-discovery.md` | 1 |
| 15 | Confuses being busy with being useful; the calendar is full, the why is empty | `top-1-percent-pm.md` | 1 |

## Scoring

```
pattern_weight = observed_score * severity_weight
  observed_score: often = 2, sometimes = 1, haven't seen it = 0

severity_tier (composite, deterministic):
  total = sum(pattern_weight) over all 15
  green   if total <= 6    "Probably normal friction."
  yellow  if 7 <= total <= 16   "A few real patterns. Worth naming."
  red     if total >= 17    "This is a pattern, not a bad week."
```

The composite tier is the shareable headline. The "haven't-seen-it on everything" case returns green with copy that gently checks the user's own expectation gap: "Either you have a genuinely strong PM or the friction is somewhere you haven't looked. Both are worth knowing."

## Top-pattern picker

```
sort behaviors by pattern_weight desc, break ties by severity_weight desc
return top 3 with pattern_weight > 0
```

## What-to-do path (the #46-specific deliverable, replaces #44's exemplar quote)

Each surfaced pattern maps to a proportionate action ladder. The deterministic engine picks the rung from observed frequency + severity; the narration explains it.

```
action_ladder = [private_feedback, document, escalate, leave]

rung selection (deterministic default, narration can nuance):
  sometimes + severity<=2  -> private_feedback
  often    + severity 2    -> document, then private_feedback
  often    + severity 3    -> document + escalate (with a script)
  pattern spans 3+ severity-3 behaviors -> the "is this fixable from where you sit?" reframe, incl. leave as a legitimate option
```

Anchor the scripts in `getting-buy-in.md` (how to raise it), `communicating-bad-news.md` (how to escalate without burning the relationship), and `managing-up.md` (when the PM is more senior than the user).

## Output shape

```
Read: {green | yellow | red headline}

The three patterns you're seeing most:

1. {behavior_1}
   What this usually means: {one-line diagnosis grounded in corpus}
   Your move: {action rung} — {one concrete first step}

2. {behavior_2} ...
3. {behavior_3} ...

A fairness check: {one line — when the answers suggest the gap is partly expectation, say so}
```

## Voice rules (applied to all narration)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Fair, not vindicating. The tool is not a weapon for office politics. Name the pattern, hand over a proportionate move, and check the user's own expectation gap.
- Direct. If the answers say the PM is fine and the user is impatient, say that plainly.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> vindication: "You're not imagining it. There's a name for it. There are, in fact, four."

Structurally distinct from the 12 locked shapes (it is reassurance-then-escalation, not a list, conditional, or definition). Alternative if "four" reads as too cute: "You suspected. The corpus agrees. Here is the proportionate version of your suspicion."

## Privacy / scope guardrail

APP_IDEAS floats an "anonymous team reporting bucket." That is **out of scope** for the `.mcpb` bundle: it implies multi-user data collection the local-file model does not support and which "can be weaponized if not careful." The bundle is single-user, local-only, advisory. No reporting feature. Surface this explicitly so a future contributor does not reintroduce it.

## Phase 0 URL-trick handoff (interim, if a web version ever ships)

```
I work with a PM and I'm trying to tell whether the friction I'm feeling is them
or me. Here are the patterns I see most:

1. {behavior_1}
2. {behavior_2}
3. {behavior_3}

Using Lenny Rachitsky's corpus (especially spotting-bad-pm-behaviors and
pm-pitfalls, plus Camille Fournier's engineer-side guidance), please:
- For each pattern, tell me what it usually signals and whether it's a bad-week
  thing or a bad-pattern thing.
- Give me a proportionate next move (private feedback, document, escalate, or
  decide it's not fixable from where I sit), with one concrete first step.
- Be fair: if any of this is more my expectation gap than their failing, say so.

I'm not looking for ammunition. I'm looking for the accurate version.
```

## Autonomous-routine backlog (Phase 3 Stage C — content the routine authors next)

- [ ] Author one corpus-anchored diagnosis line per behavior (15 total), in the non-PM register. Cite the named source where the corpus attributes it (e.g., Fournier on credit-hoarding).
- [ ] Author the four action-ladder scripts (private_feedback / document / escalate / leave), each ≤4 sentences, anchored to getting-buy-in / communicating-bad-news / managing-up.
- [ ] Author 6 synthetic "my PM does X" scenarios across green/yellow/red for golden-set evals.
- [x] Cross-check anchors exist in `knowledge/topics/`: spotting-bad-pm-behaviors, pm-pitfalls, continuous-discovery, saying-no, defending-big-bets, decision-making-frameworks, top-1-percent-pm, getting-buy-in, communicating-bad-news, managing-up. → all present 2026-05-23.

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Four-tool Path 4 clone of #44 PM Pitfalls:

- `spotting_get_questions` — entry tool with `_meta.ui.resourceUri` binding to the iframe; returns the 15 canonical behaviors so the host can render them if it cannot mount the UI.
- `spotting_score` — deterministic. Computes severity tier + top-3 patterns + action rung, echoes the user's ratings, and persists the Path 4 narration brief via `writePending`. Single persistence point (iframe submit and chat-side both call it). `readOnlyHint: true` to match #44/#9.
- `spotting_narrate` — pure compute. Returns the `narration_brief` (directive + voice_rules + structure {read, pattern_1..3, fairness_check} + inputs + corpus). No persistence, no sampling.
- `spotting_get_pending_narration` — reads disk, MUST CALL framing copied/adapted from #44. Triggers: "is my PM bad", "read my field guide", "what should I do about my PM", "I just filled in the field guide", embedded-widget phrasing. Anti-short-circuit: do not answer "you haven't filled anything in" without calling the tool; state lives on disk.

Corpus access is local read of `knowledge/topics/`. Iframe shows the severity tier + the three picked patterns + chosen action rung (the identifier-level result); chat narration adds the corpus-grounded diagnosis + script + fairness check (per the iframe-output design rule: do not duplicate the narration spine in the iframe). Stateful re-assessment ("the patterns you flagged last quarter — better or worse?") deferred, mirroring drift / calibration deferrals elsewhere.
