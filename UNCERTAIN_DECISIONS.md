# Uncertain decisions log — Working from Lenny

> Log of decisions made during autonomous work that felt under-substantiated, random, or worth surfacing for owner review. The author (Claude) made these calls with best-effort judgment; the owner should review and either accept, override, or flag for follow-up.

## Scheduled autonomous run (active routine)

**Setup:** 2026-05-14 around 06:50 local (Europe/Berlin / CEST). Replaced an earlier attempted local-cron setup that never actually fired (Claude described the plan but did not call `CronCreate` before the response ended; the local repo state matches that gap).

**Routine:** remote scheduled agent via `/schedule` (runs on Anthropic's cloud, not on the owner's machine — no local Claude Code session needed).

- Cron expression: `33 4,10,16,22 * * *` (UTC)
- Fires 4×/day at: `04:33`, `10:33`, `16:33`, `22:33` UTC
- Local equivalents (Europe/Berlin CEST = UTC+2): `06:33`, `12:33`, `18:33`, `00:33`
- First run: ~`2026-05-14T10:33Z` (`12:33 local`)
- Total runs over 4 days: ~16
- Model: `claude-sonnet-4-6`
- Allowed tools: `Bash`, `Read`, `Write`, `Edit`, `Glob`, `Grep`

**To disable after 4 days** (manual, no auto-expiry): https://claude.ai/code/routines. Target disable: any time after `2026-05-17T22:33Z` (the 16th run).

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

---

## Decisions log

*(Entries appended below in chronological order. Each entry format:*
*  `### YYYY-MM-DD HH:MM UTC — <area>`*
*  *`**Decision:** <what>`*
*  *`**Why:** <best-judgement rationale>`*
*  *`**Verify with owner:** <specific question>`*
*  *)*

### 2026-05-15 22:33 UTC — #53 PM Horoscope anchor substitutions (all 12 archetypes cross-checked)
**Decision:** Original spec listed several topic files that do not exist in `knowledge/topics/`. Substituted with nearest real files: `bet-defending.md` → `defending-big-bets.md`; `process-vs-outcomes.md` → `velocity-core4.md`; `7-powers.md` → `seven-powers.md`; `pivot-stories.md` → `pivots-art.md`; `customer-research.md` → `continuous-discovery.md`; `jtbd.md` → `jobs-to-be-done.md`; "AI eval coverage topics" → `evals-for-ai-products.md`; "Rumelt-related topics" → `good-strategy-rumelt.md`.
**Why:** All substitutes are the closest real corpus file covering the intended subject matter. Cross-check verified all substitutes are present in `knowledge/topics/`.
**Verify with owner:** Should `customer-research.md`, `process-vs-outcomes.md`, `pivot-stories.md`, `bet-defending.md`, and `jtbd.md` be created as new topic synthesis files, or do the substituted anchors adequately cover each archetype's framing?

### 2026-05-15 22:33 UTC — #53 PM Horoscope lucky-topic-file display (no hyperlink in Phase 0)
**Decision:** The spec says the lucky topic file should link to "the matching corpus page on the site (or to the GitHub raw file for the skills-library audience)." The site has no corpus page viewer and the repo is private. For Phase 0, displaying the topic filename as plain bold text with a "Lucky topic:" label.
**Why:** No public URL to link to yet. Linking to GitHub raw would require the repo to be public or the user to be logged into GitHub. Plain text is better than a broken or auth-gated link.
**Verify with owner:** When should the topic link actually become a hyperlink? Options: (a) after the repo goes public (GitHub raw), (b) when a corpus viewer page is built on the site, (c) link to the Lenny Newsletter post the topic was sourced from.

### 2026-05-14 16:33 UTC — #44 PM Pitfalls anchor substitutions (pitfalls 14 and 15)
**Decision:** Used `continuous-discovery.md` as anchor for pitfall 14 ("Over-indexing on the loudest customer complaint") and `velocity-core4.md` for pitfall 15 ("Velocity as a goal rather than a side effect"). The spec table listed `customer-research.md` and `process-vs-outcomes.md` respectively but neither file exists in `knowledge/topics/`.
**Why:** Both substitutes are the closest real corpus file to the intended topic. Teresa Torres's continuous discovery content in `continuous-discovery.md` directly covers the "story-based interviews over loudest-complaint" point. The Core 4 framing in `velocity-core4.md` explicitly addresses velocity-as-metric-vs-goal.
**Verify with owner:** Should `customer-research.md` and `process-vs-outcomes.md` be created as new topic synthesis files, or do the substituted anchors adequately cover those pitfalls?
