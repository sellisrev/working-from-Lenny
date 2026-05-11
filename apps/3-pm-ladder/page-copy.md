---
app-id: 3
app-name: PM Ladder Self-Assessment
phase: 0
type: quiz + LLM narration
updated: 2026-05-11
---

# Page copy — #3 PM Ladder Self-Assessment

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/pm-ladder`:

- 30 questions rendered in five collapsible sections (one per dimension). Each question has five answer choices; user picks one.
- Toggle at the top: **Include calibration delta** (off by default). If on, a paste box appears under the quiz for the user's manager's last review.
- Submit button: "See where you are" (default) or "See where you are + the calibration delta" (toggle on).
- Output renders below: per-dimension levels, effective level, gap report, three behaviors for the quarter. Calibration delta appears as a separate section if requested.

No preamble above the quiz.

Below the output:
- `share my level` (copies a URL with effective-level encoded, no answers)
- `fuller version in Claude` (URL-trick handoff)
- `retake`

Privacy: neither the quiz answers nor the manager review are stored. Only tool-invocation count.

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

If you're a PM, you've seen these dimensions in your last performance review. If you're a manager of PMs, you've used some version of this rubric. The app gives you a 30-question version that returns your effective level (APM through Principal), the specific gaps to the next step, and three behaviors to practice this quarter. Optionally, paste your manager's last review and the app computes a calibration delta: where you and your manager see you differently, surfaced as a discussion agenda for your next 1:1.

### 2b. How it works

Thirty questions across five dimensions: scope, ambiguity tolerance, influence, judgment, and craft. Scoring is deterministic; each answer maps to a level 1 through 5, and your level on each dimension is the median of the six answers in that section (not the average — outliers in either direction shouldn't distort). The gap report and three-behavior suggestions are LLM-generated from your scoring pattern using Gemini Flash on the web. The calibration delta runs a separate prompt that reads your scoring and your manager's review side by side. Free-tier ceiling applies; on hit, a single click hands the same prompts off to Claude in your own subscription.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Owner review point. Conditional shape — deliberately new (#53 two-beat, #44 tripartite, #51 single-line, #52 Q&A, #3 conditional).

**Draft:**

If you scored Principal, the rubric was easier than the job.

---

## Editorial notes

- Block 2a uses PM jargon ("PM", "APM", "Principal", "performance review") because the app is intrinsically about PM careers. Non-PM door is handled by explicitly naming the alternate reader ("if you're a manager of PMs"), which keeps the page accessible without forcing translation that would lose precision.
- Block 2b is explicit about the median-not-average choice because that's a load-bearing design decision that surfaces in the output. Skipping it would make the level a black box.
- Block 3 conditional shape: "If you scored X, …". Distinct from the prior four blurbs. Voice constant (ironic-but-humble, owner's voice, no em dashes, no AI tells).
