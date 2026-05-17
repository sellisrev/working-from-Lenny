---
app-id: 6
app-name: AI Eval Coverage Scorecard
phase: 1
type: wizard + LLM-generated eval starter set
updated: 2026-05-17
---

# Page copy — #6 AI Eval Coverage Scorecard

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/eval-coverage`:

- Three short textareas, stacked:
  1. "In one sentence: what does your AI feature do?" (max 200 chars)
  2. "Who uses it?" (max 200 chars)
  3. "What could go wrong?" (max 300 chars)
- Submit button: "Score my coverage."
- Output renders below as a one-page scorecard:
  - Coverage % (large number, 0–100)
  - Seven eval categories listed with status per category (covered / partial / missing): correctness, refusal behavior, latency, hallucination rate, jailbreak resistance, regression-set coverage, drift detection.
  - Per missing category: 2–3 example prompts the user could run as a starter eval.
- Below the scorecard, a "Download starter eval set (JSON)" button — exports the example prompts in a format usable in Braintrust, LangSmith, or a plain Python harness.

Below the output:
- `share this scorecard` (copies URL with coverage % and category statuses; the feature description does NOT round-trip)
- `keep going in Claude` (URL-trick handoff with the three inputs)
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

You describe your AI feature in three sentences. The scorecard returns the seven eval categories you should be covering — correctness, refusal behavior, latency, hallucination rate, jailbreak resistance, regression-set coverage, drift detection — with a status per category and example prompts to fill the gaps. Built for the PM who realizes their AI feature shipped without proper coverage, which in 2026 is almost every AI feature. The deliverable is a one-page artifact you can take to engineering and an exportable starter eval set so the conversation moves past "we should test more."

### 2b. How it works

Your three sentences go to Gemini Flash on the web with a system prompt drawn from the corpus's `evals-for-ai-products.md` and `ai-pm-skills.md` topics. The seven categories are fixed and locked. The model classifies each as covered, partial, or missing based on what your description implies you've tested (most descriptions implicitly say what's been tested by what they emphasize or omit). The starter prompts per missing category are generated, not retrieved, but they follow the corpus's exemplar patterns from Aman Khan, Hamel Husain, and others quoted in `evals-for-ai-products.md`. Your feature description stays in the Worker request scope and is not stored. Worker free-tier ceiling: ~30 scorecards per IP per day. Past that, the URL-trick handoff to claude.ai keeps working.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output.

**Draft:**

Yes, you shipped it. No, you didn't measure it.

**Alternate:**

Seven categories. You have a regression set for two. Your competitors have one for zero.

---

## Editorial notes

- Block 2a uses "PM" because the audience is PM-internal; the wedge per APP_IDEAS is the PM-facing diagnostic (vs Braintrust/LangSmith's ML-engineer-facing posture).
- Block 2b explicitly cites the corpus authors (Aman Khan, Hamel Husain) because the eval-coverage space has live thought leaders and citation gives the scorecard authority over generic critique.
- Block 3 alternate is sharper but takes a swipe at the user's competitors — recheck against tone. The first draft is safer and shareable.
