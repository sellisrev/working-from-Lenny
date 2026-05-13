---
app-id: 12-38
app-name: Founder PM hire
phase: 0
type: wizard / diagnostic (LLM narration optional in Phase 0)
updated: 2026-05-13
supersedes: [apps/12-hire-pm-yet, apps/38-founder-mode-vs-hire]
---

# Diagnostic spec — Founder PM hire (merged #12 + #38)

> Eight-input wizard. Deterministic decision tree drives the verdict; LLM narrates the level description, the interim playbook (when "not yet"), and the wrong-fit cost.

## The eight inputs

| Field | Type | Options |
|---|---|---|
| Stage | enum | pre-seed, seed, series-a, series-b-plus |
| Team size | composite | engineer count + designer count (combined number) |
| Who does the PM work today | enum | the founder, a doubling-up engineer, a doubling-up designer, the CEO and the head of eng together, nobody (work goes undone) |
| Founder's time on product | enum | rarely (<30%), some-of-the-time (30-50%), most-of-the-time (50-70%), full-time (>70%) |
| Founder's enjoyment of PM work | enum | enjoy, tolerate, dislike |
| CEO bandwidth across other functions | enum | room-to-add-product, stretched-but-functioning, overstretched |
| Next 6 months' product density | enum | light (refinement, hardening), moderate (steady shipping), heavy (new launches, expansions, bets) |
| Biggest bottleneck right now | enum | we don't know what to build, we can't keep up with stakeholder asks, engineering keeps building the wrong thing, no time for customer research, no time for strategy |

Total inputs: 8. Fits on one page; longer than #12 or #38 alone, but the founder commits to one experience instead of two.

## The five verdicts (unified taxonomy)

| Verdict | Meaning |
|---|---|
| `stay-founder-mode` | Founder owns product. No hire. Not "not yet" — this is the right answer for the foreseeable future. |
| `not-yet` (+ playbook) | Stage or signal isn't ready for a hire. Interim playbook bridges to the moment when re-running this app should flip the answer. |
| `hire-apm` | First-PM hire to offload execution. Founder stays directional. ~Feature-team-executor in older taxonomies. |
| `hire-empowered-pm` | First-PM hire or upgrade who owns an area end-to-end. Founder shares the wheel. ~Mid-level / empowered PM in older taxonomies. |
| `hire-head-of-product` | Function leader. Sets product strategy, owns the PM team. Highest-cost wrong call by a margin. |

## Decision tree (deterministic)

The tree runs in order. Once a verdict is set, subsequent steps may CANCEL it (and re-route) but the order matters.

```
verdict = null
playbook = null

# ─────────────────────────────────────────────────────────────
# STEP 1 — Not-yet by stage and team size (timing gate)
# ─────────────────────────────────────────────────────────────
if stage == "pre-seed":
    verdict, playbook = "not-yet", "pre-seed-founder-owns-product"

elif stage == "seed" and team_size < 5:
    verdict, playbook = "not-yet", "seed-early-team"

elif stage == "seed" and team_size < 12 and founder_time in ("rarely", "some-of-the-time"):
    verdict, playbook = "not-yet", "seed-founder-distracted"

# ─────────────────────────────────────────────────────────────
# STEP 2 — Bottleneck-based clarity gate
# ─────────────────────────────────────────────────────────────
if bottleneck == "we-dont-know-what-to-build":
    verdict, playbook = "not-yet", "need-product-clarity-first"

# ─────────────────────────────────────────────────────────────
# STEP 3 — Forcing functions that CANCEL not-yet
# (Only apply when stage > pre-seed. Pre-seed stays not-yet.)
# ─────────────────────────────────────────────────────────────
if verdict == "not-yet" and stage != "pre-seed":
    if pm_today == "nobody":
        verdict, playbook = None, None   # fall through to hire/stay logic
    elif ceo_bandwidth == "overstretched":
        verdict, playbook = None, None
    elif bottleneck == "no-time-for-customer-research":
        verdict, playbook = None, None

# ─────────────────────────────────────────────────────────────
# STEP 4 — Stay-founder-mode detector
# (Only reached if no not-yet verdict survived.)
# ─────────────────────────────────────────────────────────────
if verdict is None:
    stay_clear_signal = (
        founder_time == "full-time"
        and enjoyment == "enjoy"
        and product_density != "heavy"
        and ceo_bandwidth != "overstretched"
        and bottleneck not in ("no-time-for-customer-research", "no-time-for-strategy")
    )
    light_density_signal = (
        product_density == "light"
        and founder_time in ("rarely", "some-of-the-time")
        and ceo_bandwidth != "overstretched"
    )
    if stay_clear_signal or light_density_signal:
        verdict = "stay-founder-mode"

# ─────────────────────────────────────────────────────────────
# STEP 5 — Level selection if hiring
# ─────────────────────────────────────────────────────────────
if verdict is None:
    # Head of product candidates
    if product_density == "heavy" and (
        ceo_bandwidth == "overstretched"
        or stage in ("series-a", "series-b-plus")
        or team_size >= 20
    ):
        verdict = "hire-head-of-product"

    # Empowered PM candidates
    elif (
        product_density == "heavy"
        or (stage == "series-a" and team_size >= 12)
        or stage == "series-b-plus"
        or (
            founder_time in ("full-time", "most-of-the-time")
            and product_density == "moderate"
            and enjoyment in ("tolerate", "dislike")
        )
    ):
        verdict = "hire-empowered-pm"

    # Default: APM
    else:
        verdict = "hire-apm"

# ─────────────────────────────────────────────────────────────
# STEP 6 — Head-of-product down-bias
# Down-weight HoP unless density is heavy AND another forcing
# signal (overstretched CEO, series-a/b stage, or team_size >= 20)
# is present. Step 5 already enforces this, so step 6 is a safety
# net for any rule additions that bypass step 5's gate.
# ─────────────────────────────────────────────────────────────
if verdict == "hire-head-of-product" and product_density != "heavy":
    verdict = "hire-empowered-pm"

return verdict, playbook
```

### Biases (load-bearing, surface in narration)

- **Toward `not-yet` for early stages.** The corpus is consistent that founders hire too early more often than too late, and the wrong-fit cost on a too-early hire is high.
- **Away from `hire-head-of-product` for non-heavy density.** Head-of-product is the highest-cost wrong call by a margin. Founders reach for it too soon when the answer is `hire-empowered-pm`.

## Interim playbooks (when verdict is `not-yet`)

| Playbook ID | When | What it says |
|---|---|---|
| `pre-seed-founder-owns-product` | Pre-seed | Founder owns product full-time. No part-time PM. Time-box this to first paid customer. |
| `seed-early-team` | Seed, team < 5 | One specific person does the PM work (usually founder or designer-doubling). Time-box to team-size 7. |
| `seed-founder-distracted` | Seed, founder spends <50% on product, team < 12 | Founder gets back to 60%+ on product, or hires now. The middle path is the wrong-fit cost trap. |
| `need-product-clarity-first` | Bottleneck is "we don't know what to build" (any stage) | Founder runs 5 customer interviews + a 2-hour weekly strategy block for 4 weeks before re-running this diagnostic. |

## Wrong-fit cost (anchored ranges, not guarantees)

| Wrong call | Typical cost | Why |
|---|---|---|
| `hire-head-of-product` when you needed `hire-empowered-pm` | 12–18 months | Over-engineered process, founder bypass, eventual replace cycle. Most expensive wrong call by a margin. |
| `hire-head-of-product` when you needed `hire-apm` | 12–18 months | Same dynamic, harsher version (the gap is two tiers). |
| `hire-empowered-pm` when you needed `hire-head-of-product` | 6–9 months | PM does IC work well, can't set function strategy; founder ends up doing the head-of-product job uncompensated. |
| `hire-empowered-pm` when you needed `hire-apm` | 6 months | Mid-level PM is bored and frustrated; usually leaves within a year. |
| `hire-apm` when you needed `hire-empowered-pm` | 6 months | APM ships, but the IC-level decisions still go through the founder. Velocity ceiling. |
| `not-yet` (premature hire) when you should have | 6–12 months | Premature hire, founder still does the senior work, hire frustrated. |
| `stay-founder-mode` when you should have hired | 1–2 quarters of slipping velocity per cycle, compounding | The CEO loses time to other functions, product slips faster. |

These figures live in the LLM narration. The deterministic verdict drives the rest of the output.

## LLM narration prompt

```
You are a candid founder coach drawing from a synthesized corpus of
founder, product, and operator interviews. The user has just run a
"founder PM hire" diagnostic. The verdict answers both "should I
hire" and "which level" in one call.

Inputs:
- verdict: "stay-founder-mode" | "not-yet" | "hire-apm" |
  "hire-empowered-pm" | "hire-head-of-product"
- playbook_id: one of {pre-seed-founder-owns-product, seed-early-team,
  seed-founder-distracted, need-product-clarity-first} or null
- user_inputs: the eight raw inputs the user provided
- corpus_chunks: 2-3 chunks per dimension, retrieved server-side

Output three sections:

1. The verdict, one paragraph. Lead with the verdict word in plain
   language ("Stay founder-mode for now", "Not yet", "Hire an APM",
   "Hire an empowered PM", "Hire a head of product"). Two sentences
   explaining why, anchored in the user's specific inputs (which
   stage, which density, which bandwidth, which bottleneck).

2. If verdict is "not-yet": render the interim playbook (2-3 sentences
   of concrete action) and the date/signal that should prompt the
   founder to re-run this diagnostic.

   Otherwise: what good looks like at that level (one paragraph).
   Reference one specific behavior pattern from the corpus chunks.
   If the verdict is "stay-founder-mode", describe what good
   founder-mode looks like at this density and bandwidth (not "you
   don't need to do anything").

3. The cost of getting it wrong: the 2-3 most relevant wrong calls
   for this verdict, drawn from the wrong-fit cost table. Each wrong
   call gets one sentence on what it looks like in practice. The
   head-of-product mis-hire gets included on every reading except
   when the verdict already IS hire-head-of-product (then include the
   "too late" version: how a mis-timed head-of-product hire wastes
   the first 6 months).

Voice:
- Direct. No corporate softening.
- No em dashes. No "delve", "leverage", "unpack". No "in today's
  fast-paced".
- Owner voice.

Length: 400-500 words.
```

## Phase 0 URL-trick handoff

Page collects the eight inputs, runs the deterministic decision tree client-side, then offers `Get the deeper read in Claude` (URL-trick with the verdict + playbook_id + raw inputs + LLM narration prompt encoded).

User inputs are NOT logged.

## Phase 1 Worker inference

Same prompt to Gemini Flash. Output streams into the page sections.

## Phase 2 MCP App

Same tool. Optional state: founder re-runs quarterly and gets a drift report ("a quarter ago you were 'not-yet' on the seed-founder-distracted playbook; now you're 'hire-empowered-pm'").

## Lineage

- Supersedes `apps/12-hire-pm-yet/` and `apps/38-founder-mode-vs-hire/`. Both folders move to `apps/_archive/` once this spec is approved.
- Original two-step design was: #12 answers "should I hire one"; #38 answers "which one". The two had mismatched PM-level taxonomies (#12 used feature-team-executor / empowered-pm / head-of-product; #38 used apm / mid-pm / head-of-product), which would have confused founders crossing between the two. Reconciled here to: APM / empowered PM / head of product.
- "Not-yet" with playbook (from #12) and "stay-founder-mode" (from #38) preserved as distinct verdicts. They both mean "no hire" but for different reasons: `not-yet` implies the company will need one soon and the playbook bridges to that moment; `stay-founder-mode` implies the founder is the right person for the foreseeable future.
