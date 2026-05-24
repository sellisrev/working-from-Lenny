---
app-id: 55
app-name: Daily Dose of Knowledge
phase: 3
type: selector + narration (date-seeded / gap-weighted pick, single-record state, invalidation feed)
updated: 2026-05-24
neighbor: #44 (score -> narrate -> get-pending spine); new selection + invalidation logic (PHASE2_BUILD #12)
---

# Engine — #55 Daily Dose of Knowledge

> The other always-fresh front door. One thing to learn today, drawn from the current
> corpus synthesis, paired with one thing the corpus has quietly taken back. The lesson
> is a single topic with one grounding passage and one concrete action; the unlearning
> feed surfaces the most recent thing that decayed or drew strong audience pushback that
> you have not seen yet. Path 4 for the narration; light single-record state for the
> selection and the "what have I already seen" memory.
>
> Architecture locked in [`PHASE2_BUILD.md`](PHASE2_BUILD.md) **#12**. Do not redesign the
> tool shape: `daily_dose_pick` (selects + records, `readOnlyHint: false`) ->
> `daily_dose_narrate` (pure compute, returns the brief) -> `daily_dose_get_pending_narration`
> (MUST CALL, reads the pending brief). Mirrors the #44 score -> narrate -> get-pending
> spine. State is a single record per [`PHASE2_BUILD.md`](PHASE2_BUILD.md) #6 (not the #8
> collection store). No sampling.

## Audience and framing

Anyone who wants a small, current, trustworthy thing to chew on — the corpus as a daily
habit rather than a tool you reach for with a specific question. It pairs with #54 AMA in
the featured "Ask & learn" band: AMA answers what you ask; Daily Dose decides what is worth
showing you today.

The pitch is the **learn/unlearn pairing**, not novelty for its own sake. Every dose has
two halves: (1) one lesson worth keeping, grounded in a real passage with one action you can
take, and (2) one piece of the old playbook the corpus has retired or that drew heavy
audience pushback. The second half is the differentiator: most "tip of the day" surfaces only
add; this one also subtracts. The same decay layers that make #54 trustworthy (obsolete +
cautions) become a feed here, so a returning user sees a steady stream of "here is the thing
everyone still repeats that stopped being true."

Two senses of always-fresh, same as #54: (a) it reads the live `knowledge/topics/` synthesis
at narration time, so every monthly refresh improves it with no per-app rework; (b) the
invalidation half actively reads `knowledge/obsolete/` + `knowledge/cautions/` (and, later,
the `guest_tracker` old-vs-new diff) and shows you what has changed since you last looked.

## Inputs

- `user_context` (free text, optional): role / stage / company size, forwarded into the
  brief to sharpen the action. Empty by default; the iframe never sets one, chat-side Claude
  may.
- `topic_slug` (string, optional): force a specific topic ("dose me on retention"). Absent by
  default; when absent the pick is deterministic (see selection below). Also the lever the
  smoke test uses to make the pick deterministic.

There is no questionnaire. Unlike the quiz/wizard apps there is nothing for the user to fill
in, so `daily_dose_pick` is itself the entry tool (it binds the UI) — the selection is what
the deterministic engine does, not what the user supplies.

## The spine (three tools, Path 4)

`daily_dose_pick` — entry tool, binds `ui://working-from-lenny/daily-dose`,
`readOnlyHint: false`. On call it:

1. **Selects today's topic.** Deterministic. Default is **date-seeded random** over
   `knowledge/topics/` (a given calendar day is stable, so re-opening the dose shows the same
   thing), skipping slugs already in `data.shown`. When in-bundle user data exists it is
   **gap-weighted** (see "Selection" below) toward under-covered topics; it degrades to plain
   date-seeded random when no user data is present, so it works on first run with no setup.
   An explicit `topic_slug` overrides selection.
2. **Builds the invalidation entry.** Reads `knowledge/obsolete/` + `knowledge/cautions/`,
   takes the most recent entry the user has not seen (newer than `data.last_seen_invalidation`,
   or most-recent on first run), preferring one tied to today's topic when one exists.
3. **Records state** (single record per #6, durable): appends the shown slug to `data.shown`
   (avoid repeats), increments `data.streak`, advances `data.last_seen_invalidation` to the
   surfaced entry's date. Whole-file atomic write. This is durable cross-day user data, so
   `daily_dose_pick` is `readOnlyHint: false` (unlike #44's ephemeral score write).
4. **Persists the pending narration brief** (the same `writePending` side-effect #44's score
   does) so the chat-side `daily_dose_get_pending_narration` resolves after an iframe submit.
5. Returns the picked topic display name + the invalidation headline (the identifier-level
   result the iframe shows) + a `persistence_warning` if the write failed.

`daily_dose_narrate` — pure compute, no persistence. Returns the `narration_brief` (Path 4
contract, decision #2): the lesson (topic chunk + one passage + one action) plus the
`recent_invalidation` block. The chat-side handoff uses the persisted brief via get-pending;
narrate is the pure version a caller can invoke directly with a topic slug.

`daily_dose_get_pending_narration` — reads disk, MUST CALL framing copied/adapted from #44.
On `status='ready'` render the dose from the brief; on `status='no_pending'` direct the user
to open `ui://working-from-lenny/daily-dose` (or call `daily_dose_pick`) to get today's dose.

## Selection (deterministic; gap-weighted when data exists)

PHASE2_BUILD #12: random by default (date-seeded), gap-weighted when in-bundle user data
exists. The picker reads **only the bundle's own data dir** — never the skills library's
`~/.lenny-actualize/` — and biases toward topics the user is under-covered on. The signals
(authored in `authoring.md` as a slug-cluster map):

- **#44 drift** (`<data-dir>/<user>/pm-pitfalls.json`): the pitfalls the user flagged
  "always/sometimes" are weak spots; bias toward the corpus topics behind those pitfalls.
- **#3 PM-Ladder** (`<data-dir>/<user>/pm-ladder.json`): the dimensions the user scored low
  on; bias toward topics that strengthen them.
- **#25 Decision Log** (`<data-dir>/<user>/decision-log.json`): the decision types the user
  logs reveal their focus; bias toward adjacent under-covered areas.

Gap-weighting is additive and soft: it tilts the date-seeded draw, it does not hard-pin. When
none of these files exist (first run, or a user who only uses the always-fresh apps), the pick
is plain date-seeded random. No cross-process reach, no network, no setup step.

## Invalidation feed (the unlearning half)

The brief's `recent_invalidation` block is built from, in priority order:

1. `knowledge/obsolete/` — structured fields per entry (Claim / Originally said by / Why
   obsolete / Where it may still apply / Replaced by / Confidence in retirement). Surface
   "the corpus used to hold X (who/when); it changed because Y; replaced by Z," carrying the
   confidence through so a high-confidence retirement reads firmly.
2. `knowledge/cautions/` — Claim / Said by / audience pushback with **top-comment vote
   counts** / why flagged. Surface "this drew strong pushback (N votes): {one-line reason}";
   a caution is "treat with skepticism," not "false."
3. `guest_tracker` old-vs-new diff (**future** source — "a guest has since contradicted what
   was held true"). v1 uses obsolete/ + cautions/ only; the spec leaves room to fold the diff
   in without changing the tool shape (same posture as #54).

Filtering: most recent entry newer than `data.last_seen_invalidation`; on first run, the
single most-recent. Preference: when today's topic itself has an obsolete/caution entry, pair
them (more coherent dose); otherwise the most-recent-unseen across the corpus. `daily_dose_pick`
advances `last_seen_invalidation` so a returning user moves through the feed instead of
repeating.

## Output shape (the rendered dose)

```
Today's dose: {topic display name}.

{The lesson: 2-3 sentences of the current consensus, grounded in the corpus passage.}

{One passage, attributed to the guest/source.}

Try this: {one concrete action, calibrated to user_context when supplied}.

Unlearn: the corpus used to hold {old claim} ({who/when}); {what changed / what drew
pushback, with the vote count for a caution}. {If paired with today's topic, say so.}

{Optional, low-key:} Day {streak} of your dose.
```

## Voice rules (applied to the rendered dose)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Direct, candid, second person. Lead with the lesson; do not open with a preamble.
- Always attribute the passage and the invalidation claim to the guest/source + date; never
  present a retired claim as current.
- The unlearn half is non-negotiable: a dose without the unlearning half is not a dose. If no
  unseen invalidation exists, say "nothing new retired since you last looked" rather than
  inventing one.
- Keep the streak line optional and quiet; it is a habit nudge, not a score.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> learn/unlearn pairing: "One thing to learn today. And one a guest quietly took back."

Per PROCEDURAL_REFERENCE.md the blurb foregrounds the learn/unlearn pairing (the subtractive
half is the differentiator). Alternative: "Today's lesson, plus the thing everyone still
repeats that stopped being true."

## Phase 0 URL-trick handoff (interim)

A daily-changing surface does not fit a single static page well; on the web Daily Dose is a
claude.ai handoff (per the APP_IDEAS implementation note). The page builds a prompt that asks
Claude to give one current lesson from the Lenny corpus with a passage and an action, then one
thing the corpus has retired or that drew strong pushback, and opens `claude.ai/new?q=<encoded>`.
The stateful, feed-advancing version lives in the MCP App + the `lenny-actualize`-adjacent skill.

```
Give me one thing worth learning today from Lenny Rachitsky's current corpus synthesis:
one lesson with a real passage (name the guest and date) and one concrete action. Then give
me one thing the corpus has since retired or that drew strong audience pushback on the same
or a related topic, and what changed. Keep it short.
```

## Autonomous-routine backlog (Phase 3 Stage C — content the routine authors next)

- [ ] Author the gap-weighting slug-cluster map: which `knowledge/topics/` slugs each signal
      (#44 flagged pitfalls, #3 low dimensions, #25 decision types) biases toward.
- [ ] Author the invalidation-feed behavior notes (obsolete vs caution surfacing, vote-count
      handling, the topic-pairing preference, the "nothing new retired" empty state).
- [ ] Author 5-6 golden-set scenarios for QA: a first-run random pick (no data), a gap-weighted
      pick (with #44 data present), an obsolete-paired dose, a caution-paired dose, a dose where
      the invalidation feed is exhausted (empty state), and a forced `topic_slug` dose.
- [x] Cross-check the corpus surfaces exist: `knowledge/topics/` (155 files), `knowledge/obsolete/`
      (5 files), `knowledge/cautions/` (3 files), `scripts/guest_tracker.py` all present 2026-05-24.

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Three-tool Path 4 spine (clone the #44 score -> narrate -> get-pending shape; the selection +
invalidation logic is the #12 difference), locked in PHASE2_BUILD #12:

- `daily_dose_pick` — entry tool, `_meta.ui.resourceUri` -> `ui://working-from-lenny/daily-dose`,
  `readOnlyHint: false`. Selects (date-seeded random, gap-weighted when data exists, `topic_slug`
  override), builds the invalidation entry, records the single-record state (`shown` / `streak` /
  `last_seen_invalidation`), and persists the pending narration brief via `writePending`. Single
  persistence point (iframe submit and chat-side both call it). Returns the topic display name +
  invalidation headline (identifier-level) + optional `persistence_warning`.
- `daily_dose_narrate` — pure compute. Returns the `narration_brief` (directive + voice_rules +
  structure {lesson, passage, action, unlearn} + inputs {topic, user_context, streak,
  gap_weighted, recent_invalidation} + corpus). No persistence, no sampling.
- `daily_dose_get_pending_narration` — reads disk, MUST CALL framing copied/adapted from #44.
  Triggers: "today's dose", "my daily dose", "what should I learn today", "I just opened the
  dose", embedded-widget phrasing. Anti-short-circuit: do not answer "there's nothing waiting"
  without calling the tool; the state lives on disk, not in chat context.

State is a single record (#6 envelope: `{ schema_version, user_id, data: { shown, streak,
last_seen_invalidation } }`), not the #8 collection store — it is small and bounded. Corpus
access is local read of `knowledge/topics/` + `knowledge/obsolete/` + `knowledge/cautions/`.
Per the iframe-output design rule, the iframe shows the identifier-level result (today's topic
title + the invalidation headline) and the staged message; the chat narration adds the
corpus-grounded lesson + passage + action + the full unlearn block — the iframe does not
duplicate the narration spine. This is a later bundle implementation pass (same as the l->s
apps + #31 + #54); this Phase-3 mode produces the spec + content + `mcp-resource.json` only.
