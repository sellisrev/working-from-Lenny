---
app-id: 28
app-name: Burnout Warning Index for Product People
phase: 3
type: wizard-quiz + deterministic score + LLM narration
updated: 2026-05-24
---

# Page copy — #28 Burnout Warning Index

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/burnout-index`:

One short page, no pagination. A long burnout quiz is its own irony.

- **Load block** (numbers and one dropdown): meetings per week, 90-minute deep-work blocks left in a normal week, after-hours meeting share, weeks since a real (phone-off) vacation, sleep (solid / uneven / poor).
- **The honest three**: when you last finished a day feeling good about something specific (this week / this month / can't remember), how often you feel dread before the day starts (rarely / some mornings / most mornings), and an optional one-line answer to "what's the first thing that falls away when you're underwater?"

Submit button: "Read my index."

Output:
- **Your index** out of 100 and the tier headline, the identifier-level result: green ("sustainable for now"), yellow ("drifting, two signals converging"), or red ("not a busy season, a debt").
- **What's driving it**: the two highest-risk inputs, named plainly.
- **Your recovery, in order**: a Phase 1 cut for this week, a Phase 2 restoration, and a Phase 3 structural fix so it doesn't recur.
- If the dread-and-no-good-day pair fired, one line naming it directly, even when the load looks fine.

Below the output:
- `share this read` (tier only)
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

A short, honest check that turns your calendar load and a few recovery signals into a single read and a prescription you can actually follow. It is non-clinical and non-alarmist: a red result says "this is fixable and here is the order to fix it in," never "you are broken." The recovery plan is ordered, not a menu, and it comes from the corpus's actual burnout research, not generic wellness copy. The PM framing is the wedge, but it works for anyone in a manager-load role who suspects "busy season" has quietly become the baseline.

### 2b. How it works

Scoring is deterministic and runs locally: each input maps to a 0-2 risk score, the qualitative dread signal is weighted up because it is the sharpest warning, and the composite normalizes to a 0-100 index and a green/yellow/red tier. One override matters: if you dread most mornings and can't remember your last good day, the tier is floored at yellow even when your calendar looks light, because load can look fine while the person is already gone. The narration around the index is corpus-grounded and rendered by the chat assistant, drawn from `burnout-and-resilience.md` and `long-healthy-life.md` for recovery and from `saying-no.md` and `top-1-percent-pm.md` for the structural fix. No medical claims; the prescription is behavioral. Your answers stay local and are not stored remotely.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape owner-approved 2026-05-23 (DECISIONS.md): deflation-of-bravado.

**Draft:**

Yellow is not a badge. It's a warning you've gotten good at ignoring.

**Alternate:**

Red isn't a personality trait. It's a Tuesday you can still fix.

---

## Editorial notes

- Block 2a holds the non-clinical, non-alarmist line the voice rules demand and states the "fixable, here's the order" posture up front.
- Block 2b explains the override in plain language because it is the most counterintuitive part of the engine and the most important: a light calendar plus dread is still a real signal.
- Block 3 is the owner-approved deflation-of-bravado shape (it punctures a self-flattering reading of the result). The alternate carries the same spirit for the red tier; keep the first since most users land in green or yellow.
