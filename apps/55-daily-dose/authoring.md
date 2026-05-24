---
app-id: 55
app-name: Daily Dose of Knowledge
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #55 Daily Dose of Knowledge

Like #54 AMA, Daily Dose's lesson content **is the corpus synthesis**: there is no
per-topic authoring to do here, because the lesson is whatever `knowledge/topics/` holds at
narration time and the unlearning half is whatever `knowledge/obsolete/` + `knowledge/cautions/`
hold. What this file holds is the three things the tool's behavior needs that are not in the
corpus itself: the gap-weighting slug-cluster map, the invalidation-feed behavior notes, and
the golden-set scenarios for QA. The retrieval set is the live corpus, so this app gets better
at every refresh with no edits here.

---

## Corpus-surface cross-check

| Surface | Present? | Notes |
|---|---|---|
| `knowledge/topics/` | YES | 155 files 2026-05-24. The lesson-selection set (current consensus). |
| `knowledge/obsolete/` | YES | 5 files 2026-05-24: ai-replacing-pms, freemium-vs-trial, prompt-engineering, seo-strategy, vibe-coding (+ _TEMPLATE). The retired-advice half of the feed. |
| `knowledge/cautions/` | YES | 3 files 2026-05-24: 100-percent-claude-code, leadership-style, ai-replacing-pms (+ _TEMPLATE). The audience-pushback half of the feed. |
| `scripts/guest_tracker.py` | YES | Old-vs-new claim diff; the planned third feed source ("a guest has since contradicted what was held true"). v1 does not consume it. |

No corpus authoring needed; no substitutions. Each obsolete/caution file carries a
`last_updated` front-matter date used to order the feed and to advance `last_seen_invalidation`.

---

## Gap-weighting slug-cluster map

When the picker finds in-bundle user data, it tilts the date-seeded draw toward under-covered
topics. It reads **only the bundle's own data dir**, never `~/.lenny-actualize/`. Each signal
maps to a cluster of `knowledge/topics/` slugs; a weak/under-covered signal raises the draw
weight of its cluster. Weighting is soft and additive (it biases, it does not hard-pin), and
the engine degrades to plain date-seeded random when none of these files exist.

| Signal (file in data dir) | Read | Biases toward (topic slugs) |
|---|---|---|
| #44 drift (`pm-pitfalls.json`) | Pitfalls the user flagged "always"/"sometimes" (their weak spots) | The corpus topic behind each flagged pitfall, e.g. flagged "ignores the loudest-complaint trap" -> `continuous-discovery`; flagged "ships velocity-as-goal" -> `velocity-core4`; flagged strategy pitfalls -> `good-strategy-rumelt`, `product-strategy` |
| #3 PM-Ladder (`pm-ladder.json`) | Dimensions scored low | `product-sense` / `execution` / `strategy` / `insight` / `leadership` dimension -> the topic cluster for that dimension (e.g. low strategy -> `good-strategy-rumelt`, `product-strategy`, `seven-powers`; low execution -> `velocity-core4`, `ship-like-startup`, `prioritization-frameworks`) |
| #25 Decision Log (`decision-log.json`) | The decision types/topics the user logs (their current focus) | Adjacent **under-represented** areas: if logs cluster on pricing -> bias toward retention/activation topics the user is not logging; the point is breadth, not reinforcing the existing focus |

Notes:
- The map keys off **gaps**, not strengths: the dose is a learning habit, so it leans toward
  what the user has not covered or scored weakly on, not what they already do well.
- The cluster targets are real `knowledge/topics/` slugs (verified present 2026-05-24). The
  bundle implementation resolves the exact pitfall->slug and dimension->cluster tables; this
  map is the authoring intent the .ts pass encodes.
- A topic already in `data.shown` is skipped regardless of weight (no repeats until the set is
  exhausted, then it resets).

---

## Invalidation-feed behavior

The `recent_invalidation` block is the unlearning half. Built each `daily_dose_pick` call:

- **Ordering.** Read every file in `knowledge/obsolete/` + `knowledge/cautions/`, sort by
  `last_updated` (front matter) descending. Take the most recent entry **newer than**
  `data.last_seen_invalidation`. On first run (no `last_seen_invalidation`), take the single
  most-recent. Advance `data.last_seen_invalidation` to the surfaced entry's date so a
  returning user moves through the feed.
- **Topic pairing.** Among the unseen entries (those newer than `last_seen_invalidation`),
  prefer one whose slug matches today's picked topic (e.g. topic `seo-strategy` + obsolete
  `seo-strategy` -> a coherent paired dose). When no unseen entry matches, use the
  most-recent-unseen across the corpus. The preference never re-surfaces an already-seen entry,
  so the feed still advances. This pairing preference is a Stage-D-reviewable framing call: it
  trades strict chronology for coherence within the unseen window; logged to DECISIONS.md.
- **Obsolete surfacing.** Use the structured fields: "the corpus used to hold {Claim}
  ({Originally said by}); it changed because {Why obsolete}; it may still apply for {Where it
  may still apply}; replaced by {Replaced by}." Pass through **Confidence in retirement** so a
  high-confidence retirement reads firmly and a medium one reads as "softening, not settled."
- **Caution surfacing.** "This drew strong audience pushback ({top-comment vote count} votes):
  {one-line reason it is flagged}." Name the guest who made the claim and at least one concrete
  rebuttal. A caution is "treat with skepticism," not "the claim is false."
- **Both present** (e.g. `ai-replacing-pms` has both an obsolete-adjacent framing and a caution
  file): lead with the caution (audience pushback is the sharper signal), then the consensus
  the corpus actually holds.
- **Empty state.** When no unseen invalidation exists, the brief carries
  `recent_invalidation: { status: "none_new" }` and the directive says "nothing new retired
  since you last looked" rather than inventing one or repeating a seen entry. The dose still
  ships its lesson half.

---

## Golden-set scenarios (QA)

Six scenarios spanning the behaviors. For each: the selection path, the invalidation behavior,
and the expected dose shape.

**golden-dose-01 — first run, no data, random pick.** No state file, no other-app data. Expect
a date-seeded random topic (stable for the day), `gap_weighted: false`, and the single
most-recent invalidation entry (by `last_updated`). Confirms the app works with zero setup.

**golden-dose-02 — gap-weighted pick.** `pm-pitfalls.json` present with several flagged pitfalls.
Expect the picked topic to be drawn from the flagged-pitfall clusters (e.g.
`continuous-discovery` if the loudest-complaint pitfall was flagged), `gap_weighted: true` with
the signal named in `inputs`. Confirms the soft bias fires and is surfaced.

**golden-dose-03 — obsolete-paired dose.** `topic_slug = "seo-strategy"` forced (or naturally
drawn). Expect the lesson half from `topics/seo-strategy` (current consensus: brand + authority +
AEO) AND `recent_invalidation` from `obsolete/seo-strategy` (Brian Ta 2020 "SEO is the lowest-cost
channel," high-confidence retirement, AI Overviews consume the click). The two halves are about
the same topic, the coherent paired dose.

**golden-dose-04 — caution-paired dose.** `topic_slug = "ai-pm-skills"` (or AI-role topic).
Expect the unlearn half from `cautions/ai-replacing-pms` (Keith Rabois "the idea of a PM makes
no sense," 191-vote pushback on the privilege asymmetry, plus the counter-signal). Must surface
the vote count and name a rebuttal; must NOT present "PMs are dead" as consensus.

**golden-dose-05 — feed exhausted, empty state.** `last_seen_invalidation` set to a date after
all obsolete/caution entries. Expect `recent_invalidation: { status: "none_new" }` and the dose
to say "nothing new retired since you last looked" while still shipping a fresh lesson half.
Confirms the empty state does not fabricate an invalidation.

**golden-dose-06 — repeat avoidance + streak.** `data.shown` already contains today's natural
draw. Expect the picker to skip it and draw the next, and `data.streak` to increment. Confirms
no-repeat and the quiet streak nudge.

---

## Editorial notes

- The dose never fabricates an invalidation. The empty state ("nothing new retired since you
  last looked") is in the directive's voice_rules; a dose without a real unlearn entry says so.
- The lesson half and the unlearn half are paired when the topic has a matching obsolete/caution
  entry, and independent otherwise. The pairing preference is the one Stage-D framing call here:
  it favors coherence over strict feed chronology. See DECISIONS.md.
- Selection reads only the bundle's own data dir. The skills-library `~/.lenny-actualize/` is
  deliberately off-limits (no cross-process reach, per PHASE2_BUILD #12), so the MCP App and a
  CLI skill never fight over the same state.
- The streak is a quiet habit nudge, not a score: it is the count of doses taken, surfaced
  low-key at the end, never a leaderboard or a guilt mechanic.
- No history/"doses I've seen" browse tool by design (single-record state, not a collection):
  the `shown` list exists only to avoid repeats and feed the streak, not to be listed back.
