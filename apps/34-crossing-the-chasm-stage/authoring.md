---
app-id: 34
app-name: Crossing-the-Chasm Stage Finder
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #34 Crossing-the-Chasm Stage Finder

Items from the `## Autonomous-routine backlog` in `prompt.md`.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `crossing-the-chasm.md` | YES | No change |
| `category-creation.md` | YES | No change |
| `consumer-business-stages.md` | YES | No change |
| `b2b-pmf.md` | YES | No change |
| `gtm-motions.md` | YES | No change |

Named-author cross-check:
| Author | Corpus presence | Action |
|---|---|---|
| Geoffrey Moore | Present (crossing-the-chasm.md; books/crossing-the-chasm.md digest; 2024 Lenny's Podcast episode) | No change |

No substitutions needed. All five anchors verified present 2026-05-24.

---

## Cascade thresholds

The prompt locks the cascade *order*; Stage C sets the "heavy" / "majority" thresholds. `customer_mix` is three integers summing to ~100 (the wizard does not force an exact sum; the engine normalizes).

```
visionaries_heavy   := customer_mix.innovators_visionaries >= 50
pragmatists_majority := customer_mix.pragmatists >= 50
dontknow_dominant   := customer_mix.dont_know > 50
```

Resolved cascade (evaluated top to bottom; first match wins):

```
1. if pain_specificity == "still-figuring-it-out" OR dontknow_dominant:
       stage = "early market"   # pre-chasm; you don't yet know who you're for

2. elif visionaries_heavy AND acquisition_trend in {stalling, lumpy-referral-only}
        AND whole_product != "yes-complete":
       stage = "at the chasm"   # the dangerous diagnosis; the headline case

3. elif beachhead_named == "yes-one-segment" AND whole_product in {partial, yes-complete}
        AND reference_customers == "pragmatist-references-exist":
       stage = "bowling alley"

4. elif acquisition_trend == "accelerating" AND pragmatists_majority:
       stage = "tornado"

5. elif pragmatists_majority AND acquisition_trend in {steady, stalling}:
       stage = "main street"

6. else:
       stage = "early market"   # default; narration explains the ambiguity
```

Notes:
- `reference_customers` is optional. When absent, rule 3 cannot fire (bowling alley requires pragmatist references by definition), so the engine falls through; the narration flags that a missing reference-customer answer is itself a signal worth resolving.
- Rule 2 is dispositive: a heavy-visionary, stalling-or-referral-only, incomplete-whole-product company is at the chasm regardless of beachhead or references. This is the load-bearing reason for a cascade over a score sum.

---

## Per-stage narration — "why you're here" lines

One template per stage for the `PLACING_SIGNALS` section. The host names the two or three actual inputs that triggered the rule; these lines give the framing.

**Early market.** You're selling to people who buy on vision and tolerate rough edges. The signal that placed you here is that you can't yet name who you're for (still figuring out the pain, or most of your customer mix is "don't know"). That is normal this early, and it is also the thing to fix before anything else: you cannot cross a chasm you haven't located.

**At the chasm.** You won early adopters and the engine is sputtering, because early-adopter referrals don't reach pragmatists. Per `crossing-the-chasm.md`, the early majority buys on proof from people like them, not on vision, and they don't share the innovator's tolerance for an incomplete product. The signals that placed you: a visionary-heavy base, acquisition that has stalled or gone lumpy-referral-only, and a whole product that isn't complete. This is the gap most products die in.

**Bowling alley.** You've picked one segment and you're winning it with a whole product, and pragmatist references exist. Per Moore, this is the springboard: dominate the niche (the corpus puts the bar at 30%+ segment share), then bridge to the adjacent segment, not to "everyone."

**Tornado.** Mainstream pragmatist demand has inflected and acquisition is accelerating. The dynamics are land-grab: the constraint is no longer convincing buyers, it's shipping and scaling fast enough to take share before rivals do.

**Main street.** Pragmatists are the majority and growth has settled to steady or is starting to soften. The game is defend, segment, and extend the whole product. The risk is running tornado tactics after the grab is over.

---

## Per-transition play + failure mode

For the assigned stage, the narration returns the play for the *next* transition and the way it most commonly goes wrong (the `NEXT_PLAY` + `FAILURE_MODE` sections), grounded in `crossing-the-chasm.md`, `category-creation.md`, `b2b-pmf.md`, and `gtm-motions.md`.

| From → next | The play | How it usually goes wrong |
|---|---|---|
| **early market → chasm** | Pick one beachhead and name it at the level of "mid-market HR-tech for hospitality," not "B2B SaaS." Aim the GTM motion at that single segment. | The instinct to stay horizontal and chase every inbound segment at once. Going broad pre-crossing dilutes resources and you dominate nothing. |
| **chasm → bowling alley** | Build the whole product for ONE pragmatist segment (docs, integrations, references, support, not just code) and win it completely before adjacency. | Declaring victory on visionary logos and assuming pragmatists will follow. They won't; they need proof from people like them, and an incomplete product reads as incomplete. |
| **bowling alley → tornado** | Standardize the offering, simplify install and onboarding, and prepare the GTM machine to scale when demand inflects. | Over-customizing per deal so the product and the sales motion can't scale the moment the tornado hits. |
| **tornado → main street** | Defend share, segment the base, and keep extending the whole product into the next adjacency. | Still running land-grab tactics after the grab is over, while ignoring the retention and segmentation work that actually compounds now. |

At-the-chasm direct line (only when stage = "at the chasm"): "This is the part where most products die. The one move that matters: stop trying to cross with the innovator pitch. Pick a single pragmatist beachhead and build the whole product for it before you spend another dollar going wide."

---

## Synthetic company profiles (golden-set evals)

Six profiles that exercise each cascade branch, including a clean at-the-chasm case (the headline diagnosis) and the ambiguous default.

**golden-chasm-01 — early market (pre-chasm, don't-know dominant)**
> A six-month-old dev-tools startup. Customer mix: 25 / 15 / 60 (innovators / pragmatists / don't-know). Acquisition lumpy-referral-only. Pain specificity: still figuring it out. Whole product: no. Beachhead: no, we sell to anyone. No references named.

Expected: **early market** (rule 1 fires on still-figuring-it-out and dont_know > 50). Next transition: pick one beachhead. Failure mode: staying horizontal.

**golden-chasm-02 — at the chasm (the clean headline case)**
> A Series A B2B analytics product. Customer mix: 65 / 20 / 15. Acquisition stalling after a strong first year. Pain: broad value prop. Whole product: partial. Beachhead: several segments. References: only-visionary-references.

Expected: **at the chasm** (rule 2: visionaries_heavy + stalling + whole_product != complete). The direct line fires. Next transition: build the whole product for one pragmatist segment.

**golden-chasm-03 — bowling alley**
> A vertical SaaS for hospitality HR. Customer mix: 35 / 55 / 10. Acquisition steady. Pain: one-sentence named pain. Whole product: yes-complete. Beachhead: yes-one-segment. References: pragmatist-references-exist.

Expected: **bowling alley** (rule 3: yes-one-segment + whole product complete + pragmatist references). Next transition: standardize and prepare to scale. Failure mode: over-customizing per deal.

**golden-chasm-04 — tornado**
> A workflow product whose category just tipped mainstream. Customer mix: 20 / 70 / 10. Acquisition accelerating. Pain: one-sentence named pain. Whole product: yes-complete. Beachhead: several-segments. References: pragmatist-references-exist.

Expected: **tornado** (rule 4: accelerating + pragmatists_majority). Next transition: defend share, segment, extend. Failure mode: running land-grab after the grab.

**golden-chasm-05 — main street**
> A mature mid-market SaaS. Customer mix: 15 / 75 / 10. Acquisition steady, slightly softening. Pain: one-sentence named pain. Whole product: yes-complete. Beachhead: several-segments. References: pragmatist-references-exist.

Expected: **main street** (rule 5: pragmatists_majority + steady). The narration warns against tornado tactics post-grab.

**golden-chasm-06 — ambiguous default**
> An early product with a mixed base. Customer mix: 45 / 45 / 10. Acquisition steady. Pain: broad value prop. Whole product: partial. Beachhead: several-segments. References: none.

Expected: **early market** via the default branch (rule 6; no earlier rule fires because no single signal is dispositive). The narration explains the ambiguity and points to the missing reference-customer answer and the unfocused beachhead as the things to resolve first.
