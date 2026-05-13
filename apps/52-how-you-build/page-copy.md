---
app-id: 52
app-name: How [You] Build Product
phase: 0
type: paste-and-critique (LLM-generated parody)
updated: 2026-05-11
---

# Page copy — #52 How [You] Build Product

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/how-you-build`:

- Structured input at the top (four fields): team composition (PMs / engineers / designers as numbers), tools you use (comma-separated text), rituals you have (comma-separated text), last thing you shipped (one short sentence).
- Mode toggle: **Reverence profile** (default, 600-900 words) | **LinkedIn humblebrag** (one paragraph, founder voice) | **Acquired cold-open** (80-120 words, podcast-narrator voice).
- Submit button label adapts to mode: "Generate the profile" / "Write the LinkedIn post" / "Write the cold open".
- Output is handed off to Claude in a new tab (URL-trick). The full prompt for the chosen mode is encoded with the user's input filled in.

No preamble above the form. The form is the landing.

User input is not stored. Per the plan's privacy posture: tool invocations only, no payload.

**Why scaffolded inputs and mode toggle (added 2026-05-13):** The earlier free-form paste box landed flat. Empty inputs are intimidating, the parody had no replay value past the first read, and the joke wore off. Structured fields force specificity (which makes the parody land harder), and the mode toggle gives the same input three different formats to go to. Same core joke, three readings.

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Paste a sentence or two about your team — who's on it, what tools you use, what meetings happen — and the app returns the kind of reverence-profile write-up usually reserved for stage-eight unicorns: pull quote, mythical origin story, architecture diagram with your Notion relabeled as a proprietary knowledge graph, the ritual section, and the closing line about what every Series B can learn from you. Built for the PM who has caught themselves embellishing a Slack thread into a methodology, and for the engineer or founder who has read one of these profiles and wondered if it's all just Notion with confidence.

### 2b. How it works

The structure of the parody — pull quote, three paragraphs, diagram, origin, rituals, closer — is held in the prompt, not the model, so the comedy doesn't drift between providers. The LLM fills in the earnest treatment of whatever you pasted, with a few guardrails (no AI-writing tells, no hedging, no breaking the fourth wall). Generation runs through Gemini Flash on the web with the usual free-tier ceiling; if it's hit, a single click hands the same prompt off to Claude in your own subscription. Two optional modes (a 47-bullet Twitter thread, a podcast cold-open) live behind a toggle once Phase 1 ships.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Owner review point. Shape varies app to app; this is a question form to keep the Block 3 sequence fresh (#53 two-beat, #44 three-sentence, #51 single-line, #52 Q-and-A).

**Draft:**

How did your team make a Notion doc this important? Mostly by accident.

---

## Editorial notes

- Block 2a uses PM jargon ("standup", "PM", "methodology") as part of the self-mocking PM-meta posture — same set as #51 and #53. Kept understated. Non-PM door at the end ("the engineer or founder who has read one of these profiles").
- Block 2b is explicit about the prompt-not-model structure choice because it's load-bearing for the parody: a different model on the fallback shouldn't change the comedy.
- Block 3 is a question-and-answer shape, deliberately different from the two-beat (#53, #44) and the single-line (#51). Voice stays constant; structure varies.
