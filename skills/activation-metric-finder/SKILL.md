---
name: activation-metric-finder
description: Propose two or three activation-event candidates for a product, argue each one down (vanity risk, leading-vs-retention correlation, friction-as-filter vs friction-as-drop, the customer-interview signal that confirms it), give a corpus-cited benchmark range and the 3-5 input metrics under each, and optionally audit a pasted funnel step by step. Reads `knowledge/topics/`. Use when the user asks "what's my activation metric", "what's our aha moment", "when does a user actually activate", "audit my onboarding funnel", or describes a product and wants activation candidates. The Claude Code skill version of the Working from Lenny Activation Metric Finder app.
---

# activation-metric-finder

The skill version of the #37 Activation Metric Finder. Collect a few structured inputs, propose two or three activation-event candidates, and pressure-test each against retention rather than declaring a single aha moment. Pairs with the `nsm-finder` skill via a shared input-metrics tree. Companion to `lenny-actualize` and `lenny-pressure-test`; consumes the knowledge base.

## Why this exists

Teams guess at an aha moment and instrument it before checking whether it actually predicts 30/90-day retention. The differentiator here is the retention-correlation test and the friction read: a high-drop step whose survivors retain better is a filter worth keeping, not a leak to fix. Every candidate carries the specific customer-interview story that would confirm it, so the user knows what to listen for.

## When to use

Trigger on "what's my activation metric", "what's our aha moment", "when does a user activate", "audit my onboarding funnel". Never refuse on thin input: infer the business shape from a one-line description, name the assumption, produce a compact read. If the user's stated aha-moment guess is the wrong primitive, say so.

## Inputs (collect or infer; business shape is load-bearing)

`business_shape` (B2C-subscription / B2C-transactional / B2B-PLG / B2B-sales-led / marketplace / prosumer) routes the activation-event family. Also useful: the primary value action, monetization, stage, marketplace side, a current activation-rate estimate, the aha-moment guess, and an optional pasted funnel (one step per line) that triggers the audit pass.

## The activation-event families (corpus-anchored, do not invent)

```
B2C-subscription   -> first session-of-value within 7 days
B2C-transactional  -> first purchase + repeat-intent signal
B2B-PLG            -> workspace creation + team-of-3+ engagement
B2B-sales-led      -> first stakeholder-value-moment + decision-maker buy-in
marketplace        -> first matched transaction (side-specific)
prosumer           -> power-user depth signal (usage threshold)
```

Full pattern set and worked candidate exemplars live in `apps/37-activation-metric-finder/prompt.md`.

## The four arguments-against (run for every candidate)

```
vanity_risk                       -- gameable without correlating with retention?
leading_or_lagging_vs_retention   -- leads, coincides with, or lags 30/90-day retention?
friction_balance                  -- friction-as-filter (raises retention) vs friction-as-drop (kills activation)?
customer_interview_signal         -- the exact story a confirming user would tell
```

Then a benchmark range for the business shape, read fresh from the corpus and cited, including the AI-product two-funnel caveat (Cat Wu's wow-moment vs aha-moment distinction) when the product is AI-shaped, and a "subsidized activation" warning when relevant. Then 3-5 input metrics per candidate, shaped identically to the `nsm-finder` tree.

## Funnel audit (only if a funnel is pasted)

Per step: `value-moment` (the user does what the product promises), `friction-filter` (high drop, survivors retain better), `friction-drop` (high drop, no retention upside), `bypass` (users skip it), or `drop-off` (high drop, unclear cause), each with one line of why.

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/activation-metric.md (primary, Lauryn Isford onboarding-mastery + Cat Wu wow-vs-aha)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/retention.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/cohort-retention.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/hierarchy-of-engagement.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/marketplace-metrics.md (marketplace shape)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/pm-pitfalls.md (gameability)

All verified present. Check obsolete/caution layers and surface inline. Cite the Cat Wu wow-vs-aha framing from activation-metric.md only.

## Output

```
Activation candidates for {business_shape}, {stage}

Candidate 1: {name}
  Argument for: {rationale}
  Vanity risk / Leading vs retention / Friction balance / Customer interview signal
  Benchmark: {low}-{high}% for {business_shape} ({caveat})
  Input metrics: {3-5}
Candidate 2: ...

[If a funnel was pasted:]
Your current funnel
  {step}: {verdict} - {one line}
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Candid. The Block-3 framing is pattern-reveal ("Activation looks like retention. Until it doesn't. Then it looks like everyone leaves Tuesday.").
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Parse or infer the business shape (name the assumption); collect optional fields.
2. Generate two or three candidates from the matching family.
3. Run the four arguments-against, the benchmark range, and the input-metrics tree, reading the anchors.
4. If a funnel was pasted, run the step audit. Offer the input-metrics tree to `nsm-finder`.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. Re-anchor the families and benchmark ranges to another corpus; the retention-correlation test and friction read are corpus-agnostic.
