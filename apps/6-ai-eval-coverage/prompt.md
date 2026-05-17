---
app-id: 6
app-name: AI Eval Coverage Scorecard
phase: 1
type: wizard + LLM-generated eval starter set
updated: 2026-05-17
---

# Scorecard engine — #6 AI Eval Coverage Scorecard

> Phase 1 is the public web app on Gemini Flash. Worker generates the scorecard and the starter-set prompts; the seven categories and their definitions are deterministic.

## Inputs

- `feature_one_liner` (≤200 chars). What the AI feature does.
- `audience` (≤200 chars). Who uses it.
- `failure_modes` (≤300 chars). What could go wrong (user's own framing).

## The seven categories (fixed and locked)

| # | Category | What it covers | Common omission |
|---|---|---|---|
| 1 | Correctness | Does the model produce factually accurate outputs for the stated task? | Most teams test for the happy path; tail-distribution accuracy is the gap. |
| 2 | Refusal behavior | Does the model decline appropriately when the task is out of scope or unsafe? | Refusal-set evals are usually missing or overlap with safety filters. |
| 3 | Latency | Does p50, p95, p99 latency meet user expectations for the interaction shape? | Teams measure mean and ignore tails. |
| 4 | Hallucination rate | When the model is uncertain, does it hallucinate or hedge? | Often tested only on closed-ended factuality, not open generation. |
| 5 | Jailbreak resistance | Can adversarial prompts coax the model past intended behavior? | Most internal eval sets have <10 jailbreak attempts. |
| 6 | Regression-set coverage | When the model is updated (new version, new prompt), do prior wins still pass? | Many teams have no regression set at all. |
| 7 | Drift detection | When the input distribution shifts in production, does the team get a signal? | Almost no PM-led team has this. |

## Pass 1: classify coverage per category

LLM is shown the three user inputs + the seven category definitions + a few-shot pattern (3 worked examples) of how to infer category status from a feature description.

Output per category:
```
{
  "category": "Correctness",
  "status": "covered" | "partial" | "missing",
  "reasoning": "<one short sentence>",
  "confidence": 0.0 - 1.0
}
```

Heuristics the model uses (encoded in the few-shot examples, not in code):

- If the feature description names a specific test type (e.g., "we have an eval set of 200 examples"), status = covered.
- If the description names the *risk* but not the test (e.g., "the model occasionally hallucinates citations"), status = partial.
- If the category isn't mentioned at all, status = missing — UNLESS the feature type makes it irrelevant (e.g., latency is partial-or-missing-default for batch features; jailbreak resistance is partial-or-missing-default for internal-only tools).

## Pass 2: starter prompts for missing/partial categories

For each `status == "missing"` or `status == "partial"` category, generate 2–3 example evaluation prompts the user could run today. Each prompt:

```
- prompt_template: "{the actual eval prompt, parameterized}"
- expected_signal: "what a passing output looks like"
- failure_mode: "what a failing output looks like, named explicitly"
- corpus_anchor: "{topic file} — {≤30-word quote}"
```

Starter prompts follow corpus exemplar patterns from `evals-for-ai-products.md` (Aman Khan's framing: "evals are unit tests for model behavior") and `ai-pm-skills.md` (Hamel Husain's framing: "start with three failure modes you've seen in the wild").

## Coverage score (deterministic)

```
score = (
  3 * count(status == "covered") +
  1 * count(status == "partial") +
  0 * count(status == "missing")
) / (3 * 7) * 100
```

Range: 0–100. Displayed as integer ("Your coverage: 43/100").

## Output shape

```
Coverage: {score}/100

Seven categories
┌────────────────────────┬──────────┐
│ Correctness            │ covered  │
│ Refusal behavior       │ partial  │
│ Latency                │ covered  │
│ Hallucination rate     │ missing  │
│ Jailbreak resistance   │ missing  │
│ Regression set         │ partial  │
│ Drift detection        │ missing  │
└────────────────────────┴──────────┘

Gaps to fill
─────────────
[For each missing/partial category, 2-3 starter prompts in the
 prompt_template + expected_signal + failure_mode format.]

Download starter set (JSON)
```

## JSON export format

```json
{
  "feature": "<user's one-liner>",
  "coverage_score": 43,
  "categories": [
    { "name": "Correctness", "status": "covered" },
    ...
  ],
  "starter_evals": [
    {
      "category": "Hallucination rate",
      "prompt_template": "...",
      "expected_signal": "...",
      "failure_mode": "...",
      "corpus_anchor": "evals-for-ai-products.md — \"...\""
    }
  ]
}
```

JSON is structured so Braintrust / LangSmith / a plain Python harness can ingest it without reshaping.

## Phase 0 URL-trick handoff (interim)

For the period before Worker inference is wired:

```
I have an AI feature in production. Help me build an eval coverage scorecard.

Feature: {feature_one_liner}
Audience: {audience}
Known failure modes: {failure_modes}

Using Lenny Rachitsky's interview corpus (especially evals-for-ai-products
and ai-pm-skills topics, drawing on Aman Khan and Hamel Husain's framing),
please:

1. Classify my coverage across the seven categories: correctness, refusal
   behavior, latency, hallucination rate, jailbreak resistance, regression
   set, drift detection. For each, label covered / partial / missing with
   a one-sentence reason.
2. For each missing or partial category, give me 2-3 starter eval prompts
   with expected signal and failure mode named.
3. Score my overall coverage out of 100 using the formula:
   (3 * covered + 1 * partial) / 21 * 100.

Be direct. If I'm shipping without coverage, say so.
```

## Voice rules

Same as #2. No em dashes, no AI-writing tells, candid not corporate.

## Autonomous-routine backlog

Phase 1 content the every-2h routine can pick up:

- [ ] Author 3 worked few-shot examples per category (21 total) showing how a feature description maps to covered/partial/missing. These prime the LLM's classification.
- [ ] Author 5–7 starter eval-prompt exemplars per category (~40 total) for the LLM to pattern-match against. Anchor each to `evals-for-ai-products.md` / `ai-pm-skills.md`.
- [ ] Cross-check that `evals-for-ai-products.md` and `ai-pm-skills.md` exist in `knowledge/topics/`. If not, substitute and log to UNCERTAIN_DECISIONS.md.
- [ ] Draft 8–10 synthetic feature descriptions across the diversity space (B2C generation, B2B summarization, internal copilot, regulated-industry classifier, etc.) for golden-set evals once inference is wired.

## Phase 2 MCP App spec

Same scoring, but:
- Quarterly re-scoring with delta narration ("you closed two gaps, opened one new one in the latency category").
- The starter-set JSON exports go to a local `evals/` directory on the user's machine; the MCP App can read prior exports as context.
- Cross-team mode: aggregate scorecards across multiple features in a portfolio, surface common gaps (e.g., "regression sets are missing on 5 of your 8 features").
