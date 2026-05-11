---
app-id: 38
app-name: Founder-mode vs Hire-PM
phase: 0
type: wizard / diagnostic
updated: 2026-05-11
---

# Diagnostic spec — #38 Founder-mode vs Hire-PM

> Second half of the founder hiring pair. #12 answers "should I hire one"; #38 answers "which one". Four-input wizard, deterministic verdict, LLM-narrated cost-of-wrong-call section.

## The four inputs

| Field | Type | Options |
|---|---|---|
| How often you do PM-flavored work | enum | full-time, most-of-the-time, some-of-the-time, rarely |
| Whether you enjoy doing PM work | enum | enjoy, tolerate, dislike |
| Your CEO bandwidth across other functions | enum | room-to-add-product, stretched-but-functioning, overstretched |
| Product-density of the next 6 months | enum | heavy (new launches, expansions, bets), moderate (steady shipping), light (refinement, hardening) |

## The four outputs

| Verdict | Meaning |
|---|---|
| `stay-founder-mode` | Founder stays primary on product. No hire. |
| `hire-apm` | Hire an APM to offload execution; founder stays directional |
| `hire-mid-pm` | Hire a mid-level PM to own an area; founder shares the wheel |
| `hire-head-of-product` | Hire a head of product to lead the function |

## Decision tree (deterministic)

The decision is intentionally type-focused, not timing-focused. Timing is #12's job.

```
# Heavy product density forces the hire side; only question is what level
if product_density == "heavy":
    if ceo_bandwidth == "overstretched":
        return "hire-head-of-product"
    elif ceo_bandwidth == "stretched":
        return "hire-mid-pm"
    else:  # room to add product
        return "hire-mid-pm"  # founder co-pilots, but type matches density

# Moderate product density
elif product_density == "moderate":
    if pm_frequency in ("full-time", "most-of-the-time"):
        if pm_enjoyment == "enjoy":
            if ceo_bandwidth == "overstretched":
                return "hire-mid-pm"  # founder needs relief regardless
            else:
                return "stay-founder-mode"
        else:  # tolerate or dislike
            return "hire-mid-pm"  # founder is doing it badly because they hate it OR
                                  # founder is okay at it but it's not the highest use
    else:  # some-of-the-time or rarely
        if pm_enjoyment == "dislike":
            return "hire-apm"  # offload the part the founder hates
        else:
            return "hire-apm"  # build capacity for moderate density

# Light product density
elif product_density == "light":
    if pm_frequency == "rarely":
        return "stay-founder-mode"
    elif pm_enjoyment == "dislike":
        return "hire-apm"
    else:
        return "stay-founder-mode"

# Bandwidth override: a fully overstretched CEO is a forcing function
if ceo_bandwidth == "overstretched" and verdict == "stay-founder-mode":
    return "hire-apm"  # smallest hire that frees real CEO time
```

The decision tree is biased away from `hire-head-of-product` for any non-heavy product density: per the corpus, head-of-product is the highest-cost wrong call, and most founders reach for it too soon when the answer is `hire-mid-pm`.

## Wrong-fit cost (anchored ranges, not guarantees)

| Wrong call | Typical cost | Why |
|---|---|---|
| `hire-head-of-product` when you needed `hire-mid-pm` | 12–18 months | Year of company drag (over-engineered process, founder bypass) plus a 6-month replace cycle. Most expensive wrong call by a margin. |
| `hire-mid-pm` when you needed `hire-head-of-product` | 6–9 months | PM does the IC work well but can't set function strategy; founder ends up doing the head-of-product job uncompensated. |
| `hire-apm` when you needed `hire-mid-pm` | 6 months | APM ships, but the IC-level decisions still go through the founder. Velocity ceiling. |
| `hire-mid-pm` when you needed `hire-apm` | 6 months | Mid-level PM is bored and frustrated; usually leaves within a year. |
| `stay-founder-mode` when you should have hired | 1–2 quarters of slipping velocity per cycle, compounding | The CEO loses time to other functions, product slips faster. |
| Any "hire" verdict when you should have stayed | 6–12 months | Premature hire, founder still does the senior work, hire frustrated. |

These figures live in the LLM narration. The deterministic verdict drives the rest.

## LLM narration prompt

```
You are a candid founder coach drawing from a synthesized corpus of
founder, product, and operator interviews. The user has just run a
"founder-mode vs hire-PM" diagnostic. The verdict is the type of PM
to hire (or "stay founder-mode" if no hire).

Inputs:
- verdict: "stay-founder-mode" | "hire-apm" | "hire-mid-pm" | "hire-head-of-product"
- user_inputs: the four raw inputs
- corpus_chunks: 2-3 chunks per dimension, retrieved server-side

Output three sections:

1. The verdict, one paragraph. Lead with the verdict in plain language
   ("Stay founder-mode for now", "Hire an APM", etc.). Two sentences
   explaining why, anchored in the user's specific inputs (which time
   pattern, which density, which bandwidth state).

2. What good looks like at that level (one paragraph). Reference one
   specific behavior pattern from the corpus chunks. If the verdict
   is "stay-founder-mode", describe what good founder-mode looks like
   at this density (not "you don't need to do anything").

3. The cost of getting it wrong: a list of the 2-3 most relevant wrong
   calls for this verdict, drawn from the wrong-fit cost table. Each
   wrong call gets one sentence on what it looks like in practice.
   The head-of-product mis-hire gets included on every reading except
   when the verdict already IS hire-head-of-product (then include the
   "too late" version: how a mis-timed head-of-product hire wastes
   the first 6 months).

Voice:
- Direct. No corporate softening.
- No em dashes. No "delve", "leverage", "unpack". No "in today's
  fast-paced".
- Owner voice.

Length: 400-500 words.

End with a single line: "If you want to revisit whether to hire at
all, go back to #12."
```

## Phase 0 URL-trick handoff

Page collects the four inputs, runs the deterministic decision tree, then offers `Get the deeper read in Claude` (URL-trick with the verdict + raw inputs + LLM narration prompt encoded).

## Phase 1 Worker inference

Same prompt to Gemini Flash. Streams in.

User inputs are NOT logged.

## Phase 2 MCP App

Same tool. Optional state: founder re-runs quarterly and gets a drift report.

## Pair with #12

#12 ("should I hire a PM yet?") and #38 are explicitly designed as a two-step founder flow per APP_IDEAS.md.

- #12 → "yes" verdict path: link to #38 prominent on the result page.
- #38 → opening copy notes the existence of #12 and offers to back up if the user hasn't decided on the timing question yet.

If the user arrived from #12 with a "yes" verdict, pre-fill the stage and team-size fields if relevant. (Not in the four #38 inputs directly, but useful for the LLM narration context.)
