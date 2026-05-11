---
app-id: 44
app-name: PM Pitfalls Self-Audit
phase: 0
type: quiz + LLM narration
updated: 2026-05-11
---

# Page copy — #44 PM Pitfalls Self-Audit

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/pitfalls`:

- Twenty pitfalls rendered as a single scrollable list with three radio buttons each: **always / sometimes / never**.
- Submit button at the bottom: "See my three to fix this quarter".
- Output renders below, in-page (no page nav). Score is shown as an integer ("You scored 14/20") for shareability.

No preamble above the quiz. The quiz is the landing.

Below the output:
- `share this result` (copies a URL with the score encoded, no answers)
- `fuller reading in Claude` (URL-trick handoff)
- `retake` (clears answers)

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Twenty common pitfalls that show up in product work, distilled from the corpus's pitfall and bad-PM-behavior themes. You rate each as always, sometimes, or never, and the app gives you the three highest-leverage to fix this quarter, each with a short corpus-anchored example. Built for the PM who would rather be told the uncomfortable thing now than learn it from a retro six months from now, or the colleague trying to figure out whether what they're seeing has a name.

### 2b. How it works

The twenty pitfalls are fixed and locked. Scoring is deterministic: each "always" counts double, each "sometimes" counts once, and the top three picks are weighted by how much each pitfall compounds across the org (some hurt only the PM, some take the whole team down a quarter). The personalized narration runs through Gemini Flash on the web; the score and picks themselves don't need a model. There's a free-tier ceiling on the narration — if it's hit, the score and picks still come through and the "fuller reading in Claude" button takes you the rest of the way.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Owner review point — voice matches #53's locked V4.

**Draft:**

Twenty pitfalls. Most PMs are guilty of seven. The honest ones admit nine.

---

## Editorial notes

- Block 2a uses PM jargon ("PM", "retro", "leverage") because #44 is in the self-mocking PM-meta set per the Site shape policy. Kept understated; no "delve" / "in today's fast-paced" / corporate cadence.
- Block 2b is honest about the rate-limit ceiling rather than hiding it. Matches the plan's funnel posture (web is funnel top; rate-limit is a conversion event).
- Block 3 mirrors V4's two-beat shape: a setup sentence, then a beat that undercuts it. Awaiting owner sign-off.
