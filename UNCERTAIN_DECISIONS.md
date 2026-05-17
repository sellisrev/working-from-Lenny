# Uncertain decisions log — Working from Lenny

> Log of decisions made during autonomous work that felt under-substantiated, random, or worth surfacing for owner review. The author (Claude) made these calls with best-effort judgment; the owner should review and either accept, override, or flag for follow-up.

## Scheduled autonomous run (active routine)

**Setup:** 2026-05-14 around 06:50 local (Europe/Berlin / CEST). Replaced an earlier attempted local-cron setup that never actually fired (Claude described the plan but did not call `CronCreate` before the response ended; the local repo state matches that gap).

**Routine:** remote scheduled agent via `/schedule` (runs on Anthropic's cloud, not on the owner's machine — no local Claude Code session needed).

- Cron expression: `33 */2 * * *` (UTC) — **updated 2026-05-17 ~18:28 UTC** (was `33 4,10,16,22 * * *`, every 6h)
- Fires every 2 hours at minute :33 (12×/day)
- Model: `claude-sonnet-4-6`
- Allowed tools: `Bash`, `Read`, `Write`, `Edit`, `Glob`, `Grep`

**Scope change (same update 2026-05-17):** the prompt no longer caps each run to one logical commit. Runs now chain multiple batches and only exit on the 45-min time stop, full-backlog completion, or a genuine blocker. Reason: cadence + per-run cap together were producing ~one chunk per 6h, much slower than the work could move.

**To disable** (manual, no auto-expiry): https://claude.ai/code/routines.

**Prerequisite:** GitHub auth must be connected for the remote agent (the repo is private). The owner needs to either run `/web-setup` in Claude Code or install the Claude GitHub App on `sellisrev/lenny-actualize` before the first run at `12:33 local`. Without this, the routine fires but the agent fails at `git clone`.

## Run log

*(Routine appends a one-line summary here at the end of each run.)*

- 2026-05-14T10:33Z: Authored 10 PM Pitfalls exemplar quotes (pitfalls 1-10), wired into pitfalls.html via PITFALL_QUOTES + .pitfalls-pick-quote, added CSS rule, updated prompt.md spec; next item: pitfalls 11-20 exemplar quotes (batch 2)
- 2026-05-14T16:33Z: Authored 10 PM Pitfalls exemplar quotes (pitfalls 11-20, batch 2), wired into pitfalls.html and updated prompt.md spec; all 20 pitfall quotes complete; next item: #3 PM Ladder 150 answer choices (batch 1: first dimension)
- 2026-05-14T22:33Z: Authored 30 anchored Scope choices for #3 PM Ladder (batch 1 of 5, Q1-Q6), wired into pm-ladder.html and prompt.md spec; CSS added for .ladder-choice-list/.ladder-choice-item; next item: #3 PM Ladder Ambiguity dimension (Q7-Q12, batch 2 of 5)
- 2026-05-15T04:33Z: Authored 30 anchored Ambiguity tolerance choices for #3 PM Ladder (batch 2 of 5, Q7-Q12), wired into pm-ladder.html and updated prompt.md spec; next item: #3 PM Ladder Influence dimension (Q13-Q18, batch 3 of 5)
- 2026-05-15T10:33Z: Authored 30 anchored Influence choices for #3 PM Ladder (batch 3 of 5, Q13-Q18), wired into pm-ladder.html and updated prompt.md spec; next item: #3 PM Ladder Judgment dimension (Q19-Q24, batch 4 of 5)
- 2026-05-15T16:33Z: Authored 30 anchored Judgment choices for #3 PM Ladder (batch 4 of 5, Q19-Q24), wired into pm-ladder.html and updated prompt.md spec; next item: #3 PM Ladder Craft dimension (Q25-Q30, batch 5 of 5)
- 2026-05-15T22:33Z: Authored 30 anchored Craft choices for #3 PM Ladder (batch 5 of 5, Q25-Q30), completing all 150 choices across 5 dimensions; next item: #53 PM Horoscope (archetype quiz + 132 aspect-pair lines, batch 1)
- 2026-05-16T04:33Z: Cross-checked all 12 archetype corpus anchors (8 substitutions logged), authored 30 predictions + 20 nudges + 11 aspect lines for archetype 1 (The Bet-Defender), wired deterministic reading engine into horoscope.html (live for archetype 1, placeholder for 2-12); next item: #53 PM Horoscope archetype 2 (The Theatre Director) predictions + nudges + aspect lines
- 2026-05-16T10:33Z: Authored 30 predictions + 20 nudges + 11 aspect lines for archetype 2 (The Theatre Director), wired into horoscope.html HOROSCOPE_DATA and updated prompt.md spec; next item: #53 PM Horoscope archetype 3 (The Cornered Resource) predictions + nudges + aspect lines
- 2026-05-16T16:33Z: Authored 30 predictions + 20 nudges + 11 aspect lines for archetype 3 (The Cornered Resource) anchored in seven-powers.md (Helmer benefit+barrier framing), wired into horoscope.html HOROSCOPE_DATA and updated prompt.md spec; next item: #53 PM Horoscope archetype 4 (The Pivot-Hanged) predictions + nudges + aspect lines
- 2026-05-16T22:33Z: Authored 30 predictions + 20 nudges + 11 aspect lines for archetype 4 (The Pivot-Hanged) anchored in pivots-art.md (signal-before-panic, speed-after-commitment, half-pivot-as-drain, be-honest-first), wired into horoscope.html HOROSCOPE_DATA and updated prompt.md spec; next item: #53 PM Horoscope archetype 5 (The Customer-Adjacent) predictions + nudges + aspect lines
- 2026-05-16T10:33Z: Authored 30 predictions + 20 nudges + 11 aspect lines for archetype 5 (The Customer-Adjacent) anchored in continuous-discovery.md (story-based interviewing, workaround discovery, Mom Test layer) and jobs-to-be-done.md (switch interview, job hiring framing, forces model), wired into horoscope.html HOROSCOPE_DATA and updated prompt.md spec; next item: #53 PM Horoscope archetype 6 (The Founder-Mode Returnee) predictions + nudges + aspect lines
- 2026-05-17T10:33Z: Authored 30 predictions + 20 nudges + 11 aspect lines for archetype 6 (The Founder-Mode Returnee) anchored in founder-mode.md (hands-on vs. interrupt distinction, selective engagement), pm-influence.md (rebuild-through-reliability, conviction-vs-update), and decision-making-frameworks.md (reversibility test, Type-1/Type-2 framing); wired into horoscope.html HOROSCOPE_DATA, updated prompt.md spec; next item: #53 PM Horoscope archetype 7 (The Stakeholder-Pleaser) predictions + nudges + aspect lines
- 2026-05-17T16:33Z: Authored 30 predictions + 20 nudges + 11 aspect lines for archetype 7 (The Stakeholder-Pleaser) anchored in pm-pitfalls.md (Feature Factory pattern) and saying-no.md (yes-by-default cost); wired into horoscope.html HOROSCOPE_DATA, updated prompt.md spec; archetypes 1-7 of 12 complete; next item: #53 PM Horoscope archetype 8 (The Top-1-Percent) predictions + nudges + aspect lines
- 2026-05-17T22:33Z: Authored 30 predictions + 20 nudges + 11 aspect lines for archetype 8 (The Top-1-Percent) anchored in top-1-percent-pm.md (customer obsession, crisp judgment, bias-to-action, burnout-as-trust-gap, operates-at-next-level); wired into horoscope.html HOROSCOPE_DATA, updated prompt.md spec; archetypes 1-8 of 12 complete; next item: #53 PM Horoscope archetype 9 (The Saying-No) predictions + nudges + aspect lines
- 2026-05-17T00:33Z (scheduled): Authored archetypes 9-12 for #53 PM Horoscope (saying-no.md, evals-for-ai-products.md, good-strategy-rumelt.md+product-strategy.md, continuous-discovery.md+spotting-bad-pm-behaviors.md); wired all 12 into horoscope.html HOROSCOPE_DATA completing the deterministic engine; added six-question archetype quiz (quiz.md) wired into horoscope.html; refined #12-38 Founder PM hire narrations (stay-founder-mode, hire-apm, hire-head-of-product) against when-to-hire-first-pm.md + founder-mode.md; fixed stale anchor table in #44 PM Pitfalls prompt.md; next item: backlog a+b+c complete, d mostly done, further cross-checks or Phase 1 prep

---

## Decisions log

*(Entries appended below in chronological order. Each entry format:*
*  `### YYYY-MM-DD HH:MM UTC — <area>`*
*  *`**Decision:** <what>`*
*  *`**Why:** <best-judgement rationale>`*
*  *`**Verify with owner:** <specific question>`*
*  *)*

### 2026-05-17 — #24 OKR Critique anchor substitutions
**Decision:** Three of four referenced anchor files are missing from `knowledge/topics/`. Substituted: `goal-setting.md` → `okrs.md` (topic slug is "OKRs and goal-setting," covers goal-setting comprehensively); `cross-functional-collaboration.md` → `getting-buy-in.md` (closest file covering cross-functional alignment, shared ownership, and stakeholder agreement); `metrics-for-pms.md` → `north-star-metric.md` (covers measurable metric selection criteria and the "active not aggregate" framing used in Test 2).
**Why:** All three substitutes are the nearest real corpus file for the intended subject. `okrs.md` is effectively `goal-setting.md` under a different name. `getting-buy-in.md` covers the "does another team have to do something they can't be made to do?" question in Test 3. `north-star-metric.md` provides the measurability criteria used in Test 2.
**Verify with owner:** Should `goal-setting.md`, `cross-functional-collaboration.md`, and `metrics-for-pms.md` be created as new synthesis files? `cross-functional-collaboration.md` in particular is referenced across multiple apps and might be worth creating as a standalone file synthesizing `getting-buy-in.md`, `communicating-tradeoffs.md`, `reorgs-and-org-design.md`, and related content.

### 2026-05-15 22:33 UTC — #53 PM Horoscope anchor substitutions (all 12 archetypes cross-checked)
**Decision:** Original spec listed several topic files that do not exist in `knowledge/topics/`. Substituted with nearest real files: `bet-defending.md` → `defending-big-bets.md`; `process-vs-outcomes.md` → `velocity-core4.md`; `7-powers.md` → `seven-powers.md`; `pivot-stories.md` → `pivots-art.md`; `customer-research.md` → `continuous-discovery.md`; `jtbd.md` → `jobs-to-be-done.md`; "AI eval coverage topics" → `evals-for-ai-products.md`; "Rumelt-related topics" → `good-strategy-rumelt.md`.
**Why:** All substitutes are the closest real corpus file covering the intended subject matter. Cross-check verified all substitutes are present in `knowledge/topics/`.
**Verify with owner:** Should `customer-research.md`, `process-vs-outcomes.md`, `pivot-stories.md`, `bet-defending.md`, and `jtbd.md` be created as new topic synthesis files, or do the substituted anchors adequately cover each archetype's framing?

### 2026-05-15 22:33 UTC — #53 PM Horoscope lucky-topic-file display (no hyperlink in Phase 0)
**Decision:** The spec says the lucky topic file should link to "the matching corpus page on the site (or to the GitHub raw file for the skills-library audience)." The site has no corpus page viewer and the repo is private. For Phase 0, displaying the topic filename as plain bold text with a "Lucky topic:" label.
**Why:** No public URL to link to yet. Linking to GitHub raw would require the repo to be public or the user to be logged into GitHub. Plain text is better than a broken or auth-gated link.
**Verify with owner:** When should the topic link actually become a hyperlink? Options: (a) after the repo goes public (GitHub raw), (b) when a corpus viewer page is built on the site, (c) link to the Lenny Newsletter post the topic was sourced from.

### 2026-05-17 — #2 Strategy Pressure-Tester anchor substitutions (Pass 4)
**Decision:** `prompt.md` referenced `competitive-positioning.md` and `business-model-evolution.md` as Pass 4 anchors; neither file exists in `knowledge/topics/`. Substituted: `competitive-positioning.md` → `positioning.md` (April Dunford / Arielle Jackson positioning framework); `business-model-evolution.md` → `seven-powers.md` (Helmer moat/barrier framing for stress-scenario reasoning about whether a strategy's competitive advantage is durable).
**Why:** `positioning.md` is the closest real corpus file covering competitive context for Pass 4 stress scenarios. `seven-powers.md` covers the structural-durability question that `business-model-evolution.md` would have addressed — particularly the "better product is not a power" insight and the 7-Powers diagnostic for whether a moat survives market shifts.
**Verify with owner:** Should `competitive-positioning.md` and `business-model-evolution.md` be created as new synthesis files? `competitive-positioning.md` could synthesize across `positioning.md`, `seven-powers.md`, and `assessing-product-strategy-as-board.md`. `business-model-evolution.md` might synthesize `pivots-art.md`, `consumer-business-stages.md`, and `pattern-breakers.md` for the "model shifts under external pressure" angle.

### 2026-05-14 16:33 UTC — #44 PM Pitfalls anchor substitutions (pitfalls 14 and 15)
**Decision:** Used `continuous-discovery.md` as anchor for pitfall 14 ("Over-indexing on the loudest customer complaint") and `velocity-core4.md` for pitfall 15 ("Velocity as a goal rather than a side effect"). The spec table listed `customer-research.md` and `process-vs-outcomes.md` respectively but neither file exists in `knowledge/topics/`.
**Why:** Both substitutes are the closest real corpus file to the intended topic. Teresa Torres's continuous discovery content in `continuous-discovery.md` directly covers the "story-based interviews over loudest-complaint" point. The Core 4 framing in `velocity-core4.md` explicitly addresses velocity-as-metric-vs-goal.
**Verify with owner:** Should `customer-research.md` and `process-vs-outcomes.md` be created as new topic synthesis files, or do the substituted anchors adequately cover those pitfalls?
