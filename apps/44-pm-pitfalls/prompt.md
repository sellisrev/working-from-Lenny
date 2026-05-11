---
app-id: 44
app-name: PM Pitfalls Self-Audit
phase: 0
type: quiz + LLM narration (LLM optional in Phase 0)
updated: 2026-05-11
---

# Audit template — #44 PM Pitfalls Self-Audit

> Quiz logic is deterministic. LLM narration is optional in Phase 0 (URL-trick handoff) and richer in Phase 1+ (Worker inference).

## The twenty pitfalls

Drawn from the corpus topics `pm-pitfalls.md` and `spotting-bad-pm-behaviors.md`, plus the related saying-no, bet-defending, and AI-eval-coverage anchors. User rates each: **always / sometimes / never**.

Build note: anchors below are best-effort guesses against the corpus. Before locking the deployed copy, cross-check each anchor against `knowledge/topics/` and substitute the closest real file where the named one doesn't exist.

| # | Pitfall | Anchor | Leverage (1–3) |
|---|---|---|---|
| 1 | Letting AI write the spec without owning the judgment behind it | `pm-pitfalls.md`, AI-eval-coverage topic | 3 |
| 2 | Shipping AI features without an eval set | AI-eval-coverage topic | 3 |
| 3 | No paying-customer conversation in the last 30 days | `customer-research.md` | 3 |
| 4 | Conflating roadmap with strategy | `strategy.md`, Rumelt-related topics | 3 |
| 5 | Stakeholder-pleasing over bet-defending | `pm-pitfalls.md`, `bet-defending.md` | 3 |
| 6 | Not measuring shipped features after launch | `pm-pitfalls.md` | 3 |
| 7 | OKRs as activity lists ("ship X" instead of "Y users adopt X") | `okrs.md` (or closest) | 3 |
| 8 | Spending time on the roadmap when the unanswered question is the bet | `bet-defending.md` | 3 |
| 9 | Theatre standups — status ritual, no real coordination | `pm-pitfalls.md`, `process-vs-outcomes.md` | 2 |
| 10 | Treating internal stakeholders as customers | `customer-research.md` | 2 |
| 11 | Letting "data-driven" replace a hard judgment call | `pm-pitfalls.md` | 2 |
| 12 | Confusing consensus with alignment | `spotting-bad-pm-behaviors.md` | 2 |
| 13 | Avoiding the hard "no" | `saying-no.md` | 2 |
| 14 | Over-indexing on the loudest customer complaint | `customer-research.md` | 2 |
| 15 | Velocity as a goal rather than a side effect | `process-vs-outcomes.md` | 2 |
| 16 | Skipping the "why" in every spec | `pm-pitfalls.md` | 2 |
| 17 | Not noticing when politics shift around your bet | `bet-defending.md` | 2 |
| 18 | Hiding from the post-mortem when something flops | `spotting-bad-pm-behaviors.md` | 2 |
| 19 | Hoarding credit from engineers and designers | `spotting-bad-pm-behaviors.md` | 2 |
| 20 | Confusing being busy with being useful | `top-1-percent-pm.md` | 1 |

## Scoring

```
score_raw = sum over pitfalls of:
  2 if answer == "always"
  1 if answer == "sometimes"
  0 if answer == "never"

score_display = round(score_raw / 2)  # "I scored 14/20"
```

`score_display` is the shareable integer, 0–20. The deterministic version of the visible score.

## Top-three picker

```
for each pitfall:
  weight = user_score(2/1/0) * leverage(3/2/1)
sort pitfalls by weight desc, break ties by leverage desc
return top 3
```

If the user picked "never" on everything (weight = 0 for all), return the three highest-leverage pitfalls unanchored, with copy that gently nudges: "Either you're in the top 1% or you're being kind to yourself. Try again being a little more honest."

## Output shape

```
Your score: {score_display}/20.

Your three highest-leverage to fix this quarter:

1. {pitfall_1}
   {exemplar_quote_1}
   Read more: {corpus_topic_link_1}

2. {pitfall_2}
   {exemplar_quote_2}
   Read more: {corpus_topic_link_2}

3. {pitfall_3}
   {exemplar_quote_3}
   Read more: {corpus_topic_link_3}
```

Exemplar quotes are pre-written per pitfall (one short corpus-anchored line each). They are deterministic. The LLM narration adds personalization on top.

## Phase 0 URL-trick handoff

For users who want a fuller reading, the page offers a "fuller reading in Claude" button that opens `claude.ai/new?q=<encoded>` with:

```
I just took a PM pitfalls self-audit on Working from Lenny and scored
{score_display}/20. My three highest-leverage pitfalls to fix this quarter
are:

1. {pitfall_1}
2. {pitfall_2}
3. {pitfall_3}

For each, please pull from Lenny Rachitsky's interview corpus (especially the
pm-pitfalls and spotting-bad-pm-behaviors themes) and give me:
- a one-paragraph diagnosis of why this pitfall compounds for someone in
  my shoes,
- two concrete behaviors to start practicing this quarter, and
- one canonical example from the corpus of a PM who fell into this pitfall
  and what it cost them.

Keep it honest. Don't soften it.
```

## Phase 1 Worker inference prompt

When the public web app hits Gemini Flash for personalized narration:

```
System: You are a candid PM coach drawing from a synthesized corpus of
~700 product, founder, and operator interviews. The user has just self-
audited their PM behavior on twenty pitfalls. You will return personalized
narration for their three highest-leverage picks. Be direct. No corporate
softening. No em dashes. No "delve" or "leverage" or "in today's fast-paced".

Inputs:
- pitfall_1, pitfall_2, pitfall_3 (each from the locked twenty)
- exemplar_quote_1, exemplar_quote_2, exemplar_quote_3 (pre-written, do not rewrite)
- score_display (0–20)
- corpus_chunks (top 2-3 chunks per pitfall, retrieved server-side)

For each of the three pitfalls, output:
- a one-paragraph diagnosis ("why this is harder than it looks")
- two concrete behaviors to start this quarter
- one named example from the corpus_chunks

Order by user's leverage rank. Keep each pitfall's section to <120 words.
Total output <500 words.
```

## Phase 2 MCP App spec

Same scoring, same narration, but:
- Quiz state persists per user in the .mcpb data dir
- Re-audit annually with calibration drift report ("you were 14/20 a year ago, now 9/20 — here's what shifted")
- The exemplar quotes are pulled from local corpus, not hardcoded
