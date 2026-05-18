---
app-id: 37
app-name: Activation Metric Finder
phase: 1
type: wizard + LLM-narrated candidate critique
updated: 2026-05-18
---

# Engine — #37 Activation Metric Finder

> Phase 1 is the public web app on Gemini Flash. The wizard collects structured inputs; the LLM generates and critiques candidates. Pairs with #9 NSM Finder via a shared input-metrics schema (manual copy-paste, no automatic state sharing).

## Inputs

- `business_shape` (enum): B2C-subscription / B2C-transactional / B2B-PLG / B2B-sales-led / marketplace / prosumer
- `business_unusual` (≤200 chars, optional)
- `primary_value_action` (≤200 chars): "When a user gets value, what specific thing did they just do?"
- `monetization` (multi-select enum): pay-per-use / subscription / freemium-to-paid / seat-based / consumption-based / ad-supported / other
- `stage` (enum): pre-PMF / early-PMF / scaling / mature
- `marketplace_side` (enum, only if business_shape == marketplace): supply / demand / both
- `current_activation_rate_estimate` (≤20 chars, optional): user's guess at their current rate (e.g., "~18%")
- `aha_moment_guess` (≤200 chars, optional): "What do you think the 'aha moment' is for your product?"
- `funnel_paste` (≤2000 chars, optional). One funnel step per line, top of funnel to bottom.

## Pass 1: candidate generation

LLM is shown the structured inputs + a corpus-anchored set of activation-event patterns per business shape:

```
Business shape → typical activation-event family
─────────────────────────────────────────────
B2C-subscription      → first session-of-value within 7 days
B2C-transactional     → first purchase + repeat-intent signal
B2B-PLG               → workspace creation + team-of-3+ engagement
B2B-sales-led         → first stakeholder-value-moment + decision-maker-buy-in
marketplace           → first matched transaction (side-specific)
prosumer              → power-user depth signal (e.g., usage threshold)
```

Few-shot examples (3 worked candidates each for two contrasting business shapes — e.g., B2B-PLG vs marketplace — to teach the model the candidate shape, not the answer).

Output: 2-3 candidates, each:
```
{
  "name": "<verb-noun, e.g., 'workspace created + 3 team members invited within 7 days'>",
  "rationale": "<3-sentence why-this-fits-your-shape-and-stage>"
}
```

## Pass 2: per-candidate critique (structured)

For each candidate, the model fills four slots:

```
{
  "vanity_risk": "<is this event gameable without correlating with retention?>",
  "leading_or_lagging_vs_retention": "<is this event a leading indicator of 30/90-day retention, coincident, or lagging?>",
  "friction_balance": "<friction-as-filter (improves retention) vs friction-as-drop (kills activation) — which is this?>",
  "customer_interview_signal": "<the specific story a confirming user would tell — what should you hear in interviews?>"
}
```

Anchors:
- `activation-metric.md` (primary — Lauryn Isford onboarding mastery, aha-moment quantification)
- `retention.md` (correlation framing)
- `cohort-retention.md` (curve-shape framing)
- `hierarchy-of-engagement.md` (depth-of-use ladders)
- `marketplace-metrics.md` (for marketplace shape)
- `pm-pitfalls.md` (gameability framing)

## Pass 3: benchmark range (LLM-narrated against corpus)

For each candidate, the LLM narrates the typical activation-rate range expected for this business shape, reading the corpus anchors. Includes the Cat Wu wow-moment-vs-aha-moment distinction for AI products if `business_shape` or `business_unusual` flags AI-product characteristics.

Output per candidate:
```
{
  "benchmark_range_low": "<integer percent>",
  "benchmark_range_high": "<integer percent>",
  "category_caveat": "<one-sentence note: corpus source, AI-product caveat, or 'subsidized activation' warning if relevant>"
}
```

Note on variance: numbers will drift across calls because the LLM is reading the corpus each time. That's the chosen design — captures nuance the corpus actually contains (e.g., AI-product two-funnel shapes, subsidized activation distortion).

## Pass 4: funnel audit (only if `funnel_paste` provided)

For each step in the user's pasted funnel:

```
{
  "step_name": "<as pasted>",
  "verdict": "value-moment" | "friction-filter" | "friction-drop" | "bypass" | "drop-off",
  "one_line_why": "..."
}
```

Heuristics:
- The step where the user does what the product promises → `value-moment`.
- A step with high drop-off where the survivors retain better → `friction-filter`.
- A step with high drop-off and no retention upside → `friction-drop`.
- A step users skip entirely (e.g., onboarding tour click-through) → `bypass`.
- A step with high drop-off and unclear cause → `drop-off`.

## Pass 5: input-metrics tree (shared schema with #9 NSM Finder)

Each candidate gets 3-5 leading input metrics. The output shape is identical to #9's `input_metrics` field so a user who runs #9 then #37 (or vice versa) can copy-paste between them.

```
candidate: "workspace created + 3 team members invited within 7 days"
inputs:
  - signup → workspace-creation conversion
  - workspace-creation → first-invite rate
  - invite-acceptance rate
  - invite → 3-active-members time (median days)
```

## Output shape

```
Three activation candidates for {business_shape}, {stage}

Candidate 1: {name}
  Argument for: {rationale}
  Vanity risk: {vanity_risk}
  Leading vs retention: {leading_or_lagging_vs_retention}
  Friction balance: {friction_balance}
  Customer interview signal: {customer_interview_signal}
  Benchmark: {benchmark_range_low}–{benchmark_range_high}% for {business_shape}
              ({category_caveat})
  Input metrics:
    - {input_1}
    - {input_2}
    - ...

Candidate 2: ...
Candidate 3: ...

[If funnel_paste used:]

Your current funnel
─────────────────
{step_1}: {verdict} — {one_line_why}
{step_2}: {verdict} — {one_line_why}
...
```

## Phase 0 URL-trick handoff (interim)

```
I'm trying to find an activation event for my product. Help me think
through 2-3 candidates.

Business shape: {business_shape}
What makes us unusual: {business_unusual}
Primary value moment guess: {primary_value_action}
Monetization: {monetization}
Stage: {stage}
{If marketplace:}
Side: {marketplace_side}
{If provided:}
Current activation rate estimate: {current_activation_rate_estimate}
Aha-moment guess: {aha_moment_guess}

Using Lenny Rachitsky's corpus (especially activation-metric, retention,
cohort-retention, and hierarchy-of-engagement topics; for marketplaces,
marketplace-metrics; for AI products, the Cat Wu wow-moment-vs-aha-moment
distinction developed in activation-metric.md), please:

1. Propose 2-3 candidate activation events that fit my business shape
   and stage.
2. For each, give me four arguments-against: vanity risk, leading-vs-
   retention correlation, friction-as-filter vs friction-as-drop, and
   the specific customer-interview signal that would confirm it.
3. Give me the typical activation-rate benchmark range for my shape,
   cited from the corpus, including any AI-product caveat.
4. List 3-5 input metrics per candidate that drive the activation event.

{If funnel pasted:}
5. Audit my pasted funnel. For each step, label it value-moment,
   friction-filter, friction-drop, bypass, or drop-off, with one line on why.

Be direct. If my aha-moment guess is the wrong primitive, say so.
```

## Schema link to #9 NSM Finder

The `input_metrics` array per candidate in this app is structured identically to #9's `input_metrics` field. Concretely:

- A user who has run #9 to pick an NSM and the input-metrics tree can paste those metrics into #37's `funnel_paste` to validate that the activation event sits at the top of the NSM tree.
- A user who has run #37 to pick an activation event can paste the input-metrics tree into #9's optional `dashboard_paste` to cross-check NSM coverage.

The link is documentary, not automatic. The Phase 2 `.mcpb` bundle has no inter-app messaging; the schema-share is what makes the manual copy-paste lossless.

## Voice rules

Same as the other Phase 1 apps. No em dashes, no AI-writing tells, candid not corporate. Block-3 ironic-blurb shape is **pattern-reveal** (locked 2026-05-18):

> Activation looks like retention.
> Until it doesn't.
> Then it looks like everyone leaves Tuesday.

Structurally distinct from the 11 existing voice shapes — no current app uses "looks-like / until-it-doesn't / then-it-looks-like" pattern-reveal.

## Autonomous-routine backlog

- [ ] Author 3 worked candidate examples per business shape (6 shapes × 3 = 18 candidates total) for the few-shot pattern in `authoring.md`. Include marketplace supply-side AND demand-side variants.
- [ ] Author 5-10 funnel-audit exemplars showing step → verdict mapping. Cover all five verdict types (value-moment / friction-filter / friction-drop / bypass / drop-off).
- [ ] Author 6 synthetic business + funnel descriptions (one per business shape) for golden-set evals.
- [x] Cross-check that `activation-metric.md`, `retention.md`, `cohort-retention.md`, `hierarchy-of-engagement.md`, `marketplace-metrics.md`, `pm-pitfalls.md` exist in `knowledge/topics/`. → All six confirmed present 2026-05-18.
- [x] Verify Cat Wu / wow-moment / aha-moment framing is anchored. → Confirmed present in `activation-metric.md` (line 17 — explicit attribution to Cat Wu with the framing; line 23 — AI-product two-funnel shape with 30-second wow + stickiness-cliff specifics). `vibe-coding.md` cites Cat Wu for AGI-calibration / research-preview / taste-vs-execution but does NOT itself develop the wow-vs-aha distinction. Stage C content should cite `activation-metric.md` only; the `vibe-coding.md` cross-reference inside activation-metric.md is for AI-product context, not for the wow-vs-aha framing itself.
- [x] Verify Lauryn Isford onboarding-mastery framing is corpus-anchored. → Confirmed present in `activation-metric.md` (line 19 — "Mastering onboarding" 2023 citation with the first-session-is-where-retention-is-lost framing; line 35 — "How thinking has evolved" entry). Cross-referenced in `retention.md` (line 26). No substitution needed; no separate `onboarding.md` topic file exists.

## Phase 2 MCP App spec

Same engine, plus:
- `activation_calibration` tool: persists prior activation picks per user. "Six months ago you picked 'workspace created + 3 team members invited within 7 days.' Has the cohort that hit that event actually retained better at 30 and 90 days than the cohort that didn't?" Calibration shape parallels #9's `nsm_calibration`. `_meta.annotations.readOnlyHint: false`.
- Local read of `knowledge/topics/` for corpus anchors instead of Worker-side retrieval.
- Output's `input_metrics` tree in #9-compatible shape so the MCP version can suggest "want to run NSM Finder on these inputs?" in the narration text — not as inter-tool messaging, but as a user-facing handoff prompt.
