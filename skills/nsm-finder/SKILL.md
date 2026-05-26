---
name: nsm-finder
description: Propose three North Star Metric candidates for a business, argue each one down (vanity risk, leading vs lagging, gameability, what could break it in six months), give the 3-5 weekly-movable input metrics under each, and optionally audit a pasted dashboard into closest-to-NSM / useful-input / vanity-replace. Reads `knowledge/topics/`. Use when the user asks "what's my North Star Metric", "help me pick an NSM", "is this the right metric to optimize", "audit my dashboard", "what one metric should we move", or describes a business and wants metric candidates. The Claude Code skill version of the Working from Lenny North Star Metric Finder app.
---

# nsm-finder

The skill version of the #9 North Star Metric Finder. Collect a few structured inputs about the business, propose three NSM candidates, and pressure-test each one rather than picking a winner for the user. Companion to `lenny-actualize`, `lenny-pressure-test`, and the `activation-metric-finder` skill (shared input-metrics tree). Consumes the knowledge base; does not add to it.

## Why this exists

Most NSM advice stops at "pick a metric that captures value." The hard part is the argument against the candidate: which metric is gameable, which one lags the outcome you care about, which one a single market event would render useless. This skill always produces three candidates with the case for and four cases against each, so the user chooses with the failure modes in front of them, not after.

## When to use

Trigger on "what's my North Star Metric", "help me pick an NSM", "is this the right metric to optimize", "what one metric should we move", "audit my dashboard". Never refuse on thin input: if the user gives only a one-line business description, infer the business shape, name the assumption, and produce a compact three-candidate read.

## Inputs (collect or infer; only the business shape is load-bearing)

`business_shape` (B2C-subscription / B2C-transactional / B2B-PLG / B2B-sales-led / marketplace / prosumer) routes the candidate family. Also useful: what makes the business unusual, the primary user value action, monetization, revenue band, stage, the biggest current friction, and for marketplaces the side (supply / demand / both). An optional pasted dashboard (one metric per line) triggers the audit pass.

## The candidate families (corpus-anchored, do not invent)

```
B2C-subscription          -> weekly/monthly retained value-moments
B2C-transactional         -> repeat purchase rate x order frequency
B2B-PLG                   -> weekly active teams x retention shape
B2B-sales-led             -> product-qualified accounts that convert
marketplace (supply)      -> active suppliers x listings per supplier
marketplace (demand)      -> matched-transaction rate per buyer cohort
marketplace (both)        -> liquidity rate (matched / posted) x repeat frequency
prosumer                  -> power-user engagement depth
```

For marketplaces the side routes the family; a two-sided NSM names the metric on both sides, a single-side NSM names what the other side's leading indicator must look like for it to hold. The full pattern set and worked candidate exemplars live in `apps/9-nsm-finder/prompt.md` and `apps/9-nsm-finder/authoring.md`.

## The four arguments-against (run for every candidate)

```
vanity_risk            -- is it gameable without delivering user value, and how?
leading_or_lagging     -- does it lead, coincide with, or lag the outcome you care about?
gameability            -- which internal incentive could push it up without the value?
what_could_break_this  -- one market or product event that makes it uninformative
```

Then the input-metrics tree: 3-5 leading metrics the team can actually move week over week (this tree is shaped identically to the `activation-metric-finder` skill so a user can copy between them).

## Dashboard audit (only if a dashboard is pasted)

Per pasted line: `closest-to-NSM` (time-based aggregates of value-moments), `useful-input` (funnel-step conversions, retention curves), or `vanity-replace` (page views / sessions / downloads / signups without retention), each with one line of why. Revenue is special: usually lagging, but repeat-revenue per cohort is a candidate in transactional B2C and B2B-sales-led.

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/north-star-metric.md (primary)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/activation-metric.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/growth-loops.md (Sean Ellis / Hila Qu / Andrew Chen framings)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/pm-pitfalls.md (gameability)

All verified present. Check obsolete/caution layers for each and surface decay or flags inline.

## Output

```
Three NSM candidates for {business_shape}, {stage}

Candidate 1: {name}
  Argument for: {rationale}
  Vanity risk: {...}   Leading vs lagging: {...}
  Gameability: {...}   What could break this: {...}
  Input metrics: {3-5 weekly-movable metrics}
Candidate 2: ...   Candidate 3: ...

[If a dashboard was pasted:]
Your current dashboard
  {metric}: {verdict} - {one line}
```

Be direct. If two of three candidates are obvious vanity bait, say so.

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Candid. The value is the argument against the candidate, not a confident single answer.
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Parse or infer the business shape (name the assumption); collect the optional fields if offered.
2. Generate three candidates from the matching family.
3. Run the four arguments-against and the input-metrics tree for each, reading the anchors.
4. If a dashboard was pasted, run the audit. Offer to hand the input-metrics tree to `activation-metric-finder`.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. Re-anchor the candidate families to another corpus's growth topics; the four-argument structure and the audit heuristics are corpus-agnostic.
