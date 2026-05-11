---
app-id: 12
app-name: Should I Hire a PM Yet?
phase: 0
type: wizard / diagnostic
updated: 2026-05-11
---

# Diagnostic spec — #12 Should I Hire a PM Yet?

> Five-input wizard. Deterministic decision tree drives the verdict; LLM narrates the signals, the interim playbook, and the wrong-fit cost.

## The five inputs

| Field | Type | Options |
|---|---|---|
| Stage | enum | pre-seed, seed, series-a, series-b-plus |
| Team size | composite | engineer count + designer count |
| Who does the PM work today | enum | the founder, a doubling-up engineer, a doubling-up designer, the CEO and the head of eng together, nobody (work goes undone) |
| Founder's % time on product | enum | <30%, 30-50%, 50-70%, >70% |
| Biggest bottleneck right now | enum | we don't know what to build, we can't keep up with stakeholder asks, engineering keeps building the wrong thing, no time for customer research, no time for strategy |

Total inputs: 5. Fits on one page with no scroll on most screens.

## Decision tree (deterministic)

The verdict is one of `yes`, `no`, `not_yet`. The PM type (if yes) is one of `feature-team-executor`, `empowered-pm`, `head-of-product`.

```
team_size = engineer_count + designer_count

# Stage-based first cut
if stage == "pre-seed":
    verdict = "not_yet"
    pm_type = "feature-team-executor"  # what to hire when ready
    interim = "pre-seed-founder-owns-product"

elif stage == "seed":
    if team_size < 5:
        verdict, pm_type, interim = "not_yet", "feature-team-executor", "seed-early-team"
    elif team_size < 12 and founder_pct >= "50-70":
        verdict, pm_type = "yes", "feature-team-executor"
    elif team_size < 12 and founder_pct < "50-70":
        verdict, pm_type, interim = "not_yet", "feature-team-executor", "seed-founder-distracted"
    else:  # team_size >= 12
        verdict, pm_type = "yes", "empowered-pm"

elif stage == "series-a":
    if team_size < 20:
        verdict, pm_type = "yes", "empowered-pm"
    else:
        verdict, pm_type = "yes", "head-of-product"

elif stage == "series-b-plus":
    verdict, pm_type = "yes", "head-of-product"

# Bottleneck overrides
if bottleneck == "we-dont-know-what-to-build":
    # The founder needs to answer this before delegating it
    verdict, pm_type, interim = "not_yet", pm_type, "need-product-clarity-first"

elif bottleneck == "no-time-for-customer-research" and verdict == "not_yet":
    # If the founder can't do customer research, that's an explicit signal to hire
    verdict, pm_type = "yes", pm_type

elif bottleneck == "we-cant-keep-up-with-stakeholder-asks" and founder_pct >= "50-70":
    # Pure executor problem; hire accelerates relief
    verdict, pm_type = "yes", "feature-team-executor"

# PM-work-today override
if pm_today == "nobody":
    if stage in ("seed", "series-a", "series-b-plus"):
        verdict, pm_type = "yes", pm_type or "feature-team-executor"
```

The decision table is intentionally biased toward `not_yet` for early stages: the corpus is consistent that founders hire too early more often than too late, and the wrong-fit cost on a too-early hire is high.

## Wrong-fit cost (anchored ranges, not guarantees)

| Wrong call | Typical cost |
|---|---|
| Hire empowered PM when you needed an executor | 9–12 months (the PM is frustrated, the founder still does the senior work) |
| Hire head of product before Series A scale | 12–18 months (over-engineered process, founder bypass, eventual replace cycle) |
| Hire feature-team executor when you needed empowered PM | 6–9 months (shorter recognition cycle) |
| Don't hire when you should have | 1–2 quarters of slipped velocity per cycle, compounding |

These figures live in the LLM narration. The deterministic verdict + PM type drives the rest of the output.

## Interim playbooks (when verdict is `not_yet`)

| Playbook ID | When | What it says |
|---|---|---|
| `pre-seed-founder-owns-product` | Pre-seed | Founder owns product full-time. No part-time PM. Time-box this to first paid customer. |
| `seed-early-team` | Seed, team < 5 | One specific person does the PM work (usually founder or designer-doubling). Time-box to team-size 7. |
| `seed-founder-distracted` | Seed, founder spends <50% on product | Founder gets back to 60%+ on product, or hires now. The middle path is the wrong-fit cost trap. |
| `need-product-clarity-first` | Bottleneck is "we don't know what to build" | Founder runs 5 customer interviews + a 2-hour Friday strategy block weekly for 4 weeks before re-running this diagnostic. |

## LLM narration prompt

```
You are a candid founder coach drawing from a synthesized corpus of
founder, product, and operator interviews. The user has just run a
"should I hire a PM yet" diagnostic.

Inputs:
- verdict: "yes" | "no" | "not_yet"
- pm_type: "feature-team-executor" | "empowered-pm" | "head-of-product" | null
- interim_playbook_id: one of {pre-seed-founder-owns-product, seed-early-team,
  seed-founder-distracted, need-product-clarity-first} or null
- user_inputs: the five raw inputs the user provided
- corpus_chunks: 2-3 chunks from founder-mode, hire-pm-yet, and team-
  composition topics

Output four sections:

1. The verdict in one paragraph. Lead with the verdict word ("Yes",
   "No", "Not yet"). Two sentences explaining why, anchored in the
   specific inputs.

2. If verdict is yes: a paragraph on the PM type and what good looks
   like for that level. Reference one specific behavior pattern from
   the corpus.

3. Wrong-fit cost: one paragraph on the typical cost if the founder
   ignores this verdict (hires the wrong type, hires too early, hires
   too late). Use the anchored ranges from the spec, framed as
   "typical" not "guaranteed".

4. The signals that would flip the verdict in either direction: 2-3
   bullets each for "what would flip this to yes" and "what would
   flip this back to not_yet".

If verdict is not_yet: replace section 2 with the interim playbook
(2-3 sentences of concrete action) and section 3's wrong-fit cost
becomes the cost of premature hiring specifically.

Voice:
- Direct. No corporate softening.
- No em dashes. No "delve", "leverage", "unpack".
- Owner voice: a coach who has seen this pattern before.

Length: 400-500 words.
```

## Phase 0 URL-trick handoff

Page collects the five inputs, runs the deterministic decision tree client-side, then offers two paths:

- **See the result here** (Phase 1 inference, when ready) or **Get a deeper read in Claude** (URL-trick).
- The URL-trick handoff includes the verdict + pm_type + interim_id + the five raw inputs, plus the LLM narration prompt above.

## Phase 1 Worker inference

Same prompt to Gemini Flash. Output streams into the page sections.

User inputs are NOT logged.

## Phase 2 MCP App

Same tool. Optional state: the founder re-runs the diagnostic quarterly and gets a drift report ("a quarter ago you were 'not yet' on the seed-founder-distracted playbook; now you're 'yes' on empowered-pm").

## Pair with #38

#12 and #38 are explicitly designed to be a two-step founder onboarding flow per APP_IDEAS.md: "should I hire one" (#12) then "which kind" (#38). The page should link to #38 in the "Yes" verdict path, and #38 should link back to #12 in its intro if the user lands there first.
