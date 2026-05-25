---
name: ai-eval-coverage
description: Score how well an AI feature is actually tested across seven categories (correctness, refusal behavior, latency, hallucination rate, jailbreak resistance, regression-set coverage, drift detection), label each covered / partial / missing, compute a 0-100 coverage score, and generate runnable starter eval prompts (with expected signal + failure mode) for every gap. Reads `knowledge/topics/`. Use when the user asks "are my AI evals good enough", "score my eval coverage", "what evals am I missing", "am I shipping AI without tests", or describes an AI feature and wants an eval scorecard. The Claude Code skill version of the Working from Lenny AI Eval Coverage Scorecard app.
---

# ai-eval-coverage

The skill version of the #6 AI Eval Coverage Scorecard. Classify an AI feature's eval coverage across seven fixed categories, score it, and hand back starter eval prompts for the gaps. Companion to `lenny-actualize` and `lenny-pressure-test`; consumes the knowledge base.

## Why this exists

Most teams test the happy path and ship. The value here is naming the categories teams systematically skip (regression sets, drift detection, refusal behavior) and turning each gap into a prompt the user can run today, not a lecture about why evals matter. The score is honest because it is mechanical.

## When to use

Trigger on "are my AI evals good enough", "score my eval coverage", "what evals am I missing", "am I shipping AI without tests". Never refuse on thin input: classify from whatever the user describes, mark low confidence where the description is silent, and still produce starter prompts.

## Inputs

`feature_one_liner` (what the AI feature does), `audience` (who uses it), `failure_modes` (what could go wrong, in the user's own framing). All free text; infer the rest.

## The seven categories (fixed and locked, do not substitute)

```
1. Correctness            -- factually accurate for the stated task (tail, not just happy path)
2. Refusal behavior       -- declines appropriately when out of scope or unsafe
3. Latency                -- p50/p95/p99 meet the interaction shape (not just mean)
4. Hallucination rate     -- hedges vs invents when uncertain (open generation, not just closed Q&A)
5. Jailbreak resistance   -- holds against adversarial prompts
6. Regression-set coverage-- prior wins still pass after a version/prompt change
7. Drift detection        -- signal when the production input distribution shifts
```

Classification heuristics: names a specific test type -> `covered`; names the risk but not the test -> `partial`; not mentioned -> `missing`, unless the feature type makes it irrelevant (latency defaults partial/missing for batch features; jailbreak defaults partial/missing for internal-only tools). The full category definitions, common omissions, and few-shot examples live in `apps/6-ai-eval-coverage/prompt.md` and `apps/6-ai-eval-coverage/authoring.md`.

## The coverage score (deterministic)

```
score = (3 * count(covered) + 1 * count(partial) + 0 * count(missing)) / 21 * 100
```

Displayed as an integer ("Your coverage: 43/100").

## Starter prompts for every missing/partial category

For each gap, generate 2-3 runnable eval prompts. Each:

```
prompt_template  -- the actual parameterized eval prompt
expected_signal  -- what a passing output looks like
failure_mode     -- what a failing output looks like, named explicitly
corpus_anchor    -- topic file + short quote
```

Pattern-match against the corpus exemplars (Aman Khan: "evals are unit tests for model behavior"; Hamel Husain: "start with three failure modes you've seen in the wild"). Offer a JSON export shaped for Braintrust / LangSmith / a plain Python harness.

## Corpus anchors

`knowledge/topics/evals-for-ai-products.md` (primary, Aman Khan), `ai-pm-skills.md` (Hamel Husain). Both verified present. Check obsolete/caution layers and surface inline.

## Output

```
Coverage: {score}/100

Seven categories
  Correctness         covered
  Refusal behavior    partial
  ...

Gaps to fill
  [per missing/partial category: 2-3 starter prompts in the
   prompt_template + expected_signal + failure_mode format]

[Optional] Download starter set (JSON)
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Candid. If they are shipping without coverage, say so plainly.
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Read the feature one-liner, audience, and failure modes; infer what's silent.
2. Classify all seven categories (covered/partial/missing) with a one-sentence reason + confidence each.
3. Compute the score.
4. Read the anchors; generate 2-3 starter prompts per gap. Offer the JSON export.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The seven categories and the score formula are corpus-agnostic; only the starter-prompt exemplars re-anchor to another corpus's eval topics.
