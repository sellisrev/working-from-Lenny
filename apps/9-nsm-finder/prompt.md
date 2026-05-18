---
app-id: 9
app-name: North Star Metric Finder
phase: 1
type: wizard + LLM-narrated candidate critique
updated: 2026-05-18
---

# Engine — #9 North Star Metric Finder

> Phase 1 is the public web app on Gemini Flash. The wizard collects structured inputs; the LLM generates and critiques candidates.

## Inputs

- `business_shape` (enum): B2C-subscription / B2C-transactional / B2B-PLG / B2B-sales-led / marketplace / prosumer
- `business_unusual` (≤200 chars, optional)
- `primary_user_action` (≤200 chars)
- `monetization` (multi-select enum): pay-per-use / subscription / freemium-to-paid / seat-based / consumption-based / ad-supported / other
- `revenue_band` (enum): pre-revenue / $0-100k / $100k-1M / $1M-10M / $10M-100M / $100M+
- `friction_top` (≤200 chars)
- `stage` (enum): pre-PMF / early-PMF / scaling / mature
- `marketplace_side` (enum, only when `business_shape == marketplace`): supply / demand / both
- `dashboard_paste` (≤2000 chars, optional). One metric per line.

## Pass 1: candidate generation

LLM is shown the structured inputs + a corpus-anchored set of NSM patterns per business shape:

```
Business shape → typical NSM family
─────────────────────────────────────
B2C-subscription              → weekly/monthly retained value-moments
B2C-transactional             → repeat purchase rate × order frequency
B2B-PLG                       → weekly active teams × retention shape
B2B-sales-led                 → product-qualified accounts that convert
marketplace (supply side)     → active suppliers × listings per supplier
marketplace (demand side)     → matched-transaction rate per buyer cohort
marketplace (both)            → liquidity rate (matched / posted) × repeat frequency
prosumer                      → power-user engagement depth
```

For marketplace inputs, `marketplace_side` routes which family the candidates draw from. Two-sided NSMs (when `both`) should explicitly name the metric on both sides; single-side NSMs (when `supply` or `demand`) should produce candidates that target that side's health and note what the *other* side's leading indicator would have to look like for the chosen NSM to hold.

Few-shot examples (3 worked candidates each for two contrasting business shapes — e.g., B2B-PLG vs marketplace — to teach the model the candidate shape, not the answer).

Output: 3 candidates, each:
```
{
  "name": "<verb-noun, e.g., 'weekly active editing sessions'>",
  "rationale": "<3-sentence why-this-fits-your-shape>"
}
```

## Pass 2: per-candidate critique (structured)

For each candidate, the model fills four arguments-against slots:

```
{
  "vanity_risk": "<is this metric gameable without delivering user value? if so, how?>",
  "leading_or_lagging": "<is this leading, coincident, or lagging the outcome you actually care about?>",
  "gameability": "<which team-internal incentive could push this metric up without the underlying value?>",
  "what_could_break_this": "<one specific market or product event that would render this NSM uninformative>"
}
```

Anchors:
- `north-star-metric.md` (or closest existing topic)
- `activation-metric.md` (cross-check #37 spec for filename)
- `growth-loops.md` (or closest)
- `pm-pitfalls.md` (gameability framing)

## Pass 3: input metrics tree

For each candidate, identify 3–5 leading input metrics that the team can actually move week-over-week:

```
candidate: "weekly active editing sessions"
inputs:
  - new user → first edit conversion
  - new edit → return edit rate (day 1, day 7)
  - editing-session length (rough median)
  - power-user share of total sessions
```

These become the team's instrumented tree under the NSM.

## Pass 4: dashboard audit (only if dashboard_paste provided)

For each line in the user's pasted dashboard:

```
{
  "metric_name": "<as pasted>",
  "verdict": "closest-to-NSM" | "useful-input" | "vanity-replace",
  "one_line_why": "..."
}
```

Heuristics:
- Time-based aggregates of value-moments → "closest-to-NSM."
- Funnel-step conversion rates, retention curves → "useful-input."
- Page views / sessions / downloads / signups (without retention) → "vanity-replace."
- Revenue is treated specially: revenue is rarely the right NSM (it's lagging), but in transactional B2C and B2B-sales-led, repeat-revenue per cohort is a candidate.

## Output shape

```
Three NSM candidates for {business_shape, revenue_band, stage}

Candidate 1: {name}
  Argument for: {rationale}
  Vanity risk: {vanity_risk}
  Leading vs lagging: {leading_or_lagging}
  Gameability: {gameability}
  What could break this: {what_could_break_this}
  Input metrics: {tree}

Candidate 2: ...
Candidate 3: ...

[If dashboard_paste used:]

Your current dashboard
─────────────────────
{metric_1}: {verdict} — {one_line_why}
{metric_2}: {verdict} — {one_line_why}
...
```

## Phase 0 URL-trick handoff (interim)

```
I'm trying to find a North Star Metric for my business. Help me think
through three candidates.

Business shape: {business_shape}
What makes us unusual: {business_unusual}
Primary user value moment: {primary_user_action}
Monetization: {monetization}
Stage: {stage}
Revenue band: {revenue_band}
Biggest friction right now: {friction_top}

Using Lenny Rachitsky's corpus (especially north-star-metric, activation-
metric, and growth-loops topics, and the Sean Ellis / Hila Qu / Andrew Chen
framings inside), please:

1. Propose three candidate NSMs that fit my business shape and stage.
2. For each, give me the argument for, then four arguments against
   (vanity risk, leading vs lagging, gameability, six-month break case).
3. List 3-5 input metrics per candidate that I can move week-over-week.

{If dashboard pasted:}
4. Audit my current dashboard. For each metric, label it closest-to-NSM,
   useful-input, or vanity-replace, with one line on why.

Be direct. If two of my three candidates are obvious vanity bait, say so.
```

## Voice rules

Same as #2. No em dashes, no AI-writing tells, candid.

## Autonomous-routine backlog

- [x] Author 3 worked candidate examples per business shape (6 shapes × 3 = 18 candidates total) for the few-shot pattern. → 18 candidates with Pass 1 + Pass 2 critique content in `authoring.md`.
- [ ] **Patch follow-up 2026-05-18:** the `marketplace` few-shot section in `authoring.md` was written before `marketplace_side` was added. Expand the 3 marketplace candidates to cover at least one supply-side, one demand-side, and one both-sides variant so the model has a side-aware few-shot pattern.
- [x] Author 5–10 dashboard-audit exemplars showing metric_name → verdict mapping. Include obvious vanity (page views), partial (signups without retention), and gold (cohort revenue). → 10 exemplars in `authoring.md`.
- [x] Cross-check that `north-star-metric.md`, `activation-metric.md`, and `growth-loops.md` exist in `knowledge/topics/`. → All three confirmed present; no substitutions needed.
- [x] Verify Sean Ellis, Hila Qu, Andrew Chen corpus presence; substitute named voices to actual corpus authors if not present. → All three confirmed in corpus (Ellis: growth-loops.md + product-led-growth.md; Qu: product-led-marketing.md + bottom-up-saas.md; Chen: growth-loops.md). No substitutions needed.
- [x] Draft 6–8 synthetic business descriptions (one per business shape) for golden-set evals. → 6 descriptions (one per shape) with expected NSM candidates and likely weak-NSM traps in `authoring.md`.

## Phase 2 MCP App spec

Same engine, but:
- Persists prior NSM picks per user. "Six months ago you picked weekly active editing sessions. Has it moved? Has it surfaced the failure mode it was supposed to?" (Calibration shape.)
- Local read of `knowledge/topics/` for corpus anchors instead of Worker-side retrieval.
- Integration with #37 Activation Metric Finder (the input-metrics tree becomes the activation funnel definition) — both apps share a metric-tree schema.
