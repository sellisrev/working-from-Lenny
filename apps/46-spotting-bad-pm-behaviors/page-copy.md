---
app-id: 46
app-name: Spotting Bad PM Behaviors (field guide)
phase: 3
type: quiz + LLM narration
updated: 2026-05-24
---

# Page copy — #46 Spotting Bad PM Behaviors

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/spotting-bad-pm`:

- Fifteen behaviors rendered as a list, each with three options: **often / sometimes / haven't seen it**. You're rating what you actually observe, not what you assume.
- Submit button at the bottom: "Read the patterns."
- Output renders below, in-page. The severity tier (green / yellow / red) is shown as the shareable headline.

No preamble. The field guide is the landing.

Output:
- **Read**: green ("probably normal friction"), yellow ("a few real patterns, worth naming"), or red ("this is a pattern, not a bad week").
- **The three patterns you're seeing most**, the identifier-level result: each with a one-line diagnosis and your proportionate move (private feedback, document, escalate, or decide it's not fixable from where you sit), with one concrete first step.
- **A fairness check**: when your answers suggest the gap is partly your own expectation, the tool says so.

Below the output:
- `share this read` (tier only, no behavior detail)
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

You're not the PM. You work alongside one, and something keeps grating. This field guide names fifteen behaviors that cross-functional partners actually report, drawn from the corpus and anchored in Camille Fournier's engineer-side complaints. You rate how often you see each, and the app tells you whether what you're feeling is normal friction or a real pattern, which three patterns matter most, and a proportionate next move for each. It is deliberately fair: if your answers say the PM is fine and you're impatient, it tells you that too. Built for engineers, designers, sales, and CS who want the accurate version of their suspicion, not ammunition for office politics.

### 2b. How it works

Scoring is deterministic and runs locally: each behavior carries a severity weight, your observed frequency multiplies it, and the composite total sets the green/yellow/red tier and the top three patterns. The action rung for each pattern is chosen from frequency and severity. The narration around that result is corpus-grounded and rendered by the chat assistant, drawn from `spotting-bad-pm-behaviors.md` and `pm-pitfalls.md` for the diagnoses and from `getting-buy-in.md`, `communicating-bad-news.md`, and `managing-up.md` for the scripts. The behaviors are fixed so the read is honest. This tool is single-user and local-only by design: there is no team reporting bucket, because that invites collecting data on people that can be misused.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape owner-approved 2026-05-23 (DECISIONS.md): vindication.

**Draft:**

You're not imagining it. There's a name for it. There are, in fact, four.

**Alternate:**

You suspected. The corpus agrees. Here is the proportionate version of your suspicion.

---

## Editorial notes

- Block 2a is written entirely to the non-PM. This is the deliberate contrast with #44 (PM-facing self-audit) and the kinship with #30 (non-PM audience). The "not ammunition, the accurate version" line is the fairness posture the corpus and the voice rules both demand.
- Block 2b states the privacy guardrail in the user-facing copy, not just the spec, so the no-reporting-bucket decision is visible to anyone reading the page.
- Block 3 is the owner-approved vindication shape (reassurance, then escalation). The "four" lands because the corpus literally codifies Fournier's four engineer-side complaints; the alternate is the safer phrasing if "four" reads as too cute in review.
