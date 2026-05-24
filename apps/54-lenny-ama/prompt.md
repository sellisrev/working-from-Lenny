---
app-id: 54
app-name: Lenny AMA (always fresh)
phase: 3
type: open Q&A / router (corpus-wide retrieval, no state)
updated: 2026-05-24
neighbor: none (new shape — PHASE2_BUILD #11)
---

# Engine — #54 Lenny AMA (always fresh)

> The catch-all front door. Ask any product / growth / strategy / hiring / career /
> leadership question and get an answer drawn from the **current** corpus synthesis, in
> a PM lens. The only **corpus-wide** tool in the bundle: open-ended input, retrieval
> across the whole synthesis (not per-app pinned anchors), decay-aware. Single-call
> Path 4 — `ama_ask` returns a `narration_brief` directly and the host renders the
> answer on the same turn. No scoring engine, no persistence, no sampling.
>
> Architecture locked in [`PHASE2_BUILD.md`](PHASE2_BUILD.md) **#11**. Do not redesign the
> tool shape: one tool, `readOnlyHint: true`, no state, whole-corpus retrieval, the
> decay sweep, and the optional app-routing suggestion.

## Audience and framing

Two audiences, one tool. (1) People who don't want to pick a specific app: they have a
question and want a grounded answer. (2) People asking a general question where a
product-thinking lens is the useful one ("how do I prioritize across three things my
boss wants?", "is this a good metric?", "how should I think about this tradeoff?"). The
AMA answers directly when no specific app fits, and routes to the right app when one
does. It is the project's highest-visibility entry point and is featured first on the
launcher home.

The pitch is **freshness**, not breadth. Two senses of always-fresh: (a) it reads the
live `knowledge/topics/` synthesis at answer time, so every monthly corpus refresh
improves it with no per-app rework; (b) it actively sweeps `knowledge/obsolete/` and
`knowledge/cautions/` so the answer flags when the corpus's older advice on the topic
has decayed or drew strong audience pushback. Every answer names the topic files it
leaned on and the guests/dates behind the claim, and ends with a concrete next step.

## Inputs

- `question` (free text, required): the user's question, any length up to ~1000 chars.
- `k` (int, optional, default 8): how many corpus chunks to retrieve. The host rarely sets this; it exists so a future caller can widen/narrow retrieval.

## The tool (single-call Path 4)

`ama_ask` is both the entry and the narration tool. It does not persist anything and is
not part of a score -> narrate -> get-pending spine (those apps need persistence because
the iframe submit and the chat are different surfaces; AMA is one synchronous call). It:

1. Runs **whole-corpus retrieval** via `retrieveAcrossCorpus(question, k)` (a shared
   helper added to `bundle/src/lib/corpus.ts` per PHASE2_BUILD #11): keyword/topic match
   over `knowledge/topics/` AND `knowledge/obsolete/` AND `knowledge/cautions/`, returning
   the top-k chunks each tagged with `slug` + `kind` (`topic` | `obsolete` | `caution`)
   + the topic's `last_updated` date. v1 is keyword matching, consistent with the shared
   retrieval function the rest of the bundle plans to use; no embeddings required for v1.
2. Builds the **decay flags**: any `obsolete` or `caution` hit in the retrieved set is
   carried in `inputs.decay` with its claim + what changed / what drew pushback (+ vote
   counts for cautions), so the directive can tell the host to surface "the corpus used to
   say X; here's what changed" instead of answering as if the old claim still holds.
3. Resolves **routing**: matches the question against the keyword->app map (below); when
   it maps cleanly to one app, sets `inputs.suggested_app = { id, name, entry_tool }` and
   the directive offers it. Absent when nothing fits (most general questions).
4. Returns a `narration_brief` (Path 4 contract, decision #2): the host renders the
   answer from `directive` + `voice_rules` + `structure` + `inputs` + `corpus`. No
   sampling, no inference call inside the tool.

`_meta.ui.resourceUri` binds `ama_ask` to an optional question-box UI
(`ui://working-from-lenny/lenny-ama`) for hosts that mount it; per PHASE2_BUILD #11 the
UI is not required (the tool is question-in/answer-out and works chat-natively). The
launcher home features the same question box at the top.

## Output shape (the rendered answer)

```
{Direct answer, PM-lensed, grounded in the retrieved chunks, 2-4 short paragraphs.}

{If a decay flag is present:} What's changed: the corpus used to hold {old claim}
({who/when}); {what changed / what drew the strongest pushback, with the vote count for
a caution}. So treat {the old advice} carefully.

Sources: {topic files leaned on} ({guests/dates behind the claim}).

Next: {one concrete next step, not a summary}.

{If suggested_app present:} This is really a {app topic} question, want {App Name}? I
can open it.
```

## Keyword -> app routing map (authored in authoring.md; summarized here)

The map points a clean topical question at the app whose entire job is that question.
When several could fit, prefer the most specific. Examples: north-star / one-metric ->
#9 NSM Finder (`nsm_finder_get_form`); activation / aha-moment -> #37
(`activation_finder_get_form`); "is this a real strategy" / Rumelt -> #2
(`strategy_pressure_test_get_form`); OKRs / key results -> #24
(`okr_critique_get_form`); mission/vision drift -> #47 (`mvs_alignment_get_form`); AI
evals -> #6 (`ai_eval_coverage_get_form`); should-I-hire-a-PM / founder-mode -> #12-38
(`founder_pm_hire_get_form`); am-I-a-good-PM / pitfalls -> #44
(`pm_pitfalls_get_questions`); what-level / promotion -> #3 (`pm_ladder_get_questions`);
moat / network-effects -> #33 (`seven_powers_get_questions`); GTM-stage / chasm -> #34
(`chasm_get_form`); burnout -> #28 (`burnout_get_form`); saying-no -> #17
(`saying_no_get_scenario`); hard-conversation / feedback / PIP -> #18
(`difficult_conversations_get_scenario`); decision-calibration / Brier -> #25
(`decision_log_get_form`); my-PM-is-bad -> #46 (`spotting_get_questions`); new-to-a-PM-
company -> #30 (`onboarding_get_modes`); non-software-domain leader -> #31
(`pm_non_pm_get_modes`). No match -> answer directly, no suggestion.

## Voice rules (applied to the rendered answer)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Direct, candid, second person. Answer the question first; do not open with a preamble.
- Always name the source files + the guests/dates behind the claim; never present a claim
  as settled when a caution or obsolete entry contradicts it.
- End with one concrete next step, not a recap. Offer the matching app only when one fits.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> freshness-caveat: "Ask anything. You'll get an answer, and which part of it expired last quarter."

Per PROCEDURAL_REFERENCE.md the blurb should foreground freshness/decay, not catch-all
breadth. Alternative: "No wrong question. A few of the old answers, though."

## Phase 0 URL-trick handoff (interim)

Open Q&A does not fit a single deterministic page well; on the web the AMA is a claude.ai
handoff (per the implementation note in APP_IDEAS): the page builds a prompt that asks
Claude to answer the user's question in a PM lens using the Lenny corpus and to flag where
the older advice has decayed, and opens `claude.ai/new?q=<encoded>`. The heavy,
decay-sweeping version lives in the MCP App and the `lenny-actualize`-adjacent skill.

```
Answer this in a product-management lens, grounded in Lenny Rachitsky's current corpus
synthesis: "{question}". Name the topics and the guests/dates behind your claims. If the
corpus's older advice on this has decayed or drew strong audience pushback, say so and
what changed. End with one concrete next step.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author the keyword->app routing map (question patterns -> app + entry_tool) covering all shipped + spec'd apps.
- [ ] Author the decay-sweep behavior notes (how obsolete/caution hits surface; vote-count handling for cautions; the guest_tracker old-vs-new diff as a future source).
- [ ] Author 5-6 golden-set example questions for QA, spanning: a clean topic, an obsolete-flagged topic (e.g. SEO), a caution-flagged topic (e.g. AI-replacing-PMs), a clearly-routable question, and a general-tradeoff question with no app match.
- [x] Cross-check the corpus surfaces exist: `knowledge/topics/`, `knowledge/obsolete/` (5 files), `knowledge/cautions/` (3 files + template) all present 2026-05-24; `scripts/guest_tracker.py` present.

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Single-tool corpus-wide app, locked in PHASE2_BUILD #11:

- `ama_ask` — free-text `question` (+ optional `k`) in; returns a `narration_brief`
  directly (single-call Path 4 — it IS the narration tool). Runs `retrieveAcrossCorpus`
  over topics + obsolete + cautions; builds `inputs.decay` from any obsolete/caution hit;
  resolves `inputs.suggested_app` from the routing map when one fits. `readOnlyHint: true`,
  no persistence, no sampling. Optional `_meta.ui.resourceUri` -> `ui://working-from-lenny/lenny-ama`.

`retrieveAcrossCorpus(question, k)` is the one shared-lib addition (`bundle/src/lib/corpus.ts`);
it is the corpus-wide sibling of the per-app fixed-anchor loads the rest of the bundle uses.
This is a later bundle implementation pass (same as the l->s and #31 `.ts`); this Phase-3
mode produces the spec + content + `mcp-resource.json` only. Because there is no scoring,
no persistence, and no iframe/chat surface split, there is no `narrate` / `get-pending`
pair and no calibration/history tool — note that absence explicitly so a reviewer does not
expect the four-tool spine; AMA's single-call shape is the deliberate #11 design.
