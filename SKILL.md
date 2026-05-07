---
name: lenny-actualize
description: Build and refresh a current-consensus knowledge base over Lenny's Newsletter + Podcast corpus, plus referenced non-fiction books. Tracks contradictions across guests/dates, flags AI-driven obsolescence, weights newer sources, and keeps a parallel "no longer fully true" reference. Portable to any expert-interview corpus. Use when asked to "actualize Lenny", "refresh Lenny knowledge base", "update Lenny consensus", "build Lenny topic file", "process Lenny topic <X>", or "check what's obsolete in Lenny".
---

# lenny-actualize

Builds a living, citation-backed knowledge base over a multi-year expert-interview corpus. Surfaces current consensus, marks inflection points, maintains a parallel obsolete-advice index, and flags caution claims that audience pushback has called out as out of touch. Designed for the Lenny's Newsletter + Podcast archive but portable.

## Audiences (who consumes the knowledge base)

The output should be useful to multiple roles, not just PMs:

- **PMs** — current consensus on craft topics; what's decayed in the AI era.
- **Non-PM hiring managers** (founders, eng leaders) hiring PMs.
- **Cross-functional partners** (engineers, designers, sales, data) who need to work with PMs without becoming one.
- **Execs / board / investors** evaluating product bets, roadmaps, and strategy docs without owning implementation.
- **Anyone reviewing a PRD, roadmap, or strategy artifact** and wanting to apply a strong product-management lens.

The taxonomy in `references/topics.yml` includes a `cross-functional consumption` section (`working-with-pms-as-engineer`, `hiring-pms-as-non-pm`, `evaluating-product-bets`, `reviewing-prds-and-1-pagers`, `giving-feedback-as-leader`, `assessing-product-strategy-as-board`, `understanding-pm-role-as-non-pm`, `spotting-bad-pm-behaviors`, etc.). When generating these topic files, write the "Current consensus" section so a non-PM reader can act on it immediately.

## Why this skill exists

Existing community projects extract static skills/SOPs from the corpus (RefoundAI/lenny-skills, qingxuantang/Lennys-to-sop-and-skills, arjunlall/lenny-for-claude). None track knowledge decay. Advice from 2021 about virality, freemium, hiring, or PMF often disagrees with 2025-26 takes, especially where AI has reshaped workflow. This skill makes that decay legible.

## Tone and depth (applies to every invocation)

This skill answers whatever the user asks. There are no mandatory gates, no scope-confirmation announcements, no quick/full mode toggle, and no refuse-on-thin-input behavior. Internal cost decisions (when to run a web search vs. trust the existing topic file) stay opaque to the user — they get a useful answer, not a meta-conversation.

For **specific** asks (a topic slug, a book, a guest, a clear-scoped question), produce a full synthesis: anchor in the relevant `knowledge/topics/<slug>.md` (or generate one), cite the same way the topic files do, surface obsolete/cautions where they apply.

For **vague or thin** asks ("what about hiring?", "is OKRs still good?", "I'm thinking about pricing"):

1. Pick the most likely interpretation, name it in one sentence ("Reading this as a question about hiring early-team in scale-early B2B SaaS"), and produce a **compact** answer — typically 4-8 sentences, citing 1-3 sources.
2. List 2-4 suggested extensions or alternative interpretations as one-liners ("- you might also want: hiring-pms-as-non-pm", "- alternatively, are you thinking about *contractor* hiring?", etc.).

Multi-facet output: if the active profile has ≥2 facets with weight ≥0.5 that are plausibly relevant to the question, answer through both lenses concisely (typically one short paragraph each) rather than picking one and dropping the others. Example: a user with active facets `founder/medtech` and `gtm-advisor` asking about hiring sees both a founder-stage view and a GTM-advisor view in the same response.

Never refuse to answer on the grounds that input is thin. If the input is genuinely ambiguous between very different topics, ask a single short clarifying question alongside the compact-answer-on-most-likely interpretation — never instead of it.

## Inputs

- **Corpus path** (default: `/Users/sergev/Downloads/lennys-newsletterpodcastdata-all/`). The corpus is structured as:
  - `01-start-here/index.json` — official Lenny corpus index
  - `02-newsletters/`, `03-podcasts/` — primary corpus (human-edited, high quality)
  - `04-how-i-ai/` — Claire Vo's "How I AI" YouTube auto-captions (lower quality, AI-workflow-focused). Optional; created by `scripts/fetch_how_i_ai.py`. Treated as a secondary signal source (see "Two-corpus signal weighting" below).
- **Topic** (optional; if omitted, process all topics in `references/topics.yml`)
- **Mode**: `init` | `topic <name>` | `book <slug>` | `all` | `verify <topic>` | `fetch-hia`

## Outputs (under `knowledge/`)

- `topics/<topic>.md` — current consensus, inflection points, citations grouped by era. Written for the audience implied by the topic (PM, cross-functional, exec, etc.).
- `obsolete/<topic>.md` — claims that were once correct but no longer fully hold (decay over time), with conditions where they may still apply; includes footer linking to community skill packs that may now be stale.
- `cautions/<topic>.md` — claims to treat with extreme skepticism: guest advice that high-vote audience pushback has called out as out of touch, ethically dubious, or only safe inside a narrow privilege/context. Distinct from `obsolete` — these were probably never wise; they reflect speaker blind spots.
- `pending-review/<topic>.md` — flagged uncertainties or large shifts requiring human judgment.
- `books/<book-slug>.md` — book-level digest: consensus interpretation + rarer-but-flagged insights.
- `CHANGELOG.md` — append-only log of every run with date, model, topics touched, decisions.
- `DIGEST_consensus.md` / `DIGEST_full.md` — single-file domain-grouped exports (run `export_digest.py` after a batch).

## References (under `references/`)

- `topics.yml` — canonical fine-grained topic taxonomy
- `books.yml` — books referenced in the corpus with metadata
- `guests.yml` — repeat podcast guests for old-vs-new claim comparison (auto-rebuilt by `guest_tracker.py`)
- `external_skills.yml` — community SOP/skill repos and which topics they cover
- `_corpus_normalized.json` — flat row table emitted by `parse_corpus.py`

## Workflow

### Step 0: Read scaffolding (always)

Read `references/topics.yml` and `references/books.yml`. If empty or stale (older than 30 days vs. corpus generated_at), run init.

### Step 0.5: Auto-context (every invocation, silent)

Before answering, run these in order. None of these steps are announced to the user unless they produce an actionable signal (drop processed, 2-week reminder, etc.).

1. **Process any new manual drops.** Run `python3 scripts/process_drop.py --corpus <path>`. If new files were processed, mention it in one line ("Processed N new lennysdata.com transcripts before answering."). Otherwise silent. The processor exits in <100ms when the drop folder is empty, so this is cheap to run unconditionally.

2. **Read `<corpus>/_state.json`.** Two checks:

   - If `last_lennysdata_pull` is `null` or older than 14 days, AND `last_reminder_shown` is `null` or older than 7 days, surface a one-line passive notice in the response:

     > _(Heads up: it's been N days since your last `lennysdata.com` pull. If you have a subscription, fresh clean transcripts there yield higher fidelity than YouTube auto-captions. Drop new transcripts in `<corpus>/_manual_drop/` and they'll be processed on next call.)_

     Then update `last_reminder_shown` in `_state.json` to today's date. Suppress otherwise.

   - `_state.json` may not exist on the very first run; treat absence as "needs reminder."

3. **Load profile.** Run `python3 scripts/profile_load.py`. Output is `{}` if no profile exists yet — that's fine, treat the user as someone whose profile will accumulate over the next few invocations.

4. **Read memory + decisions.** If memory file exists, read the most recent ~20 entries from `<home>/.lenny-actualize/memory/default.md`. If decisions file exists, read the most recent ~10 entries from `<home>/.lenny-actualize/decisions/default.md`. Use these to spot recurring themes, prior priorities, and any pending outcomes the user might be reporting back on.

5. **Choose facets to answer through.** From the loaded profile, pick the facets with weight ≥0.5 that are plausibly relevant to the user's question. If ≥2 are relevant, the response will be multi-lens per the Tone-and-depth section. If 0 facets exist (cold profile), answer generically and use observations from this interaction to seed inference.

### Step 1: init (first run only, or on demand)

```bash
python3 scripts/parse_corpus.py --corpus <path>
python3 scripts/guest_tracker.py --rebuild
```

`parse_corpus.py` emits `references/_corpus_normalized.json` (one row per file with date, guest, title, tags, filename, word_count). It does NOT load file bodies. It also warns if the corpus is more than 90 days behind today — the Lenny archive intentionally omits the last 3 months of newsletters.

`guest_tracker.py --rebuild` regenerates `references/guests.yml` from the normalized corpus, identifying repeat podcast guests so old-vs-new claim comparison is possible.

Then the agent:
1. Reviews `_corpus_normalized.json` titles/tags/descriptions to derive ~80–150 fine-grained topics. Output is a YAML mapping `topic_slug → { display_name, seed_keywords, related_tags }`. Write to `references/topics.yml`.
2. Reads the book-recommendation newsletters (`essential-reading-for-product-builders-part-1.md`, `essential-reading-for-product-builders-part-2.md`, `my-all-time-favorite-reads-on-product-growth-leadership-writing-investing-and-mu.md`, gift guides) to extract book references. For each, capture: title, author, distinctive aliases, mention context (post slug + date), domain. Write `references/books.yml`. Book digests are pulled lazily — only when a topic links to the book or the user asks for a specific book.

Always commit `topics.yml`, `books.yml`, and `guests.yml` for human review before bulk processing.

### Step 2: topic processing (one topic per invocation)

For topic `<T>`:

```bash
python3 scripts/topic_chunks.py --topic <T> --topics-yml references/topics.yml --corpus <path>
```

This returns a JSON list of `{file, date, guest_or_author, title, excerpt}` items, sorted oldest → newest, where `excerpt` is the relevant section(s) of the file. The script is plumbing only; it filters by topic seed keywords and tag membership.

Then the agent does the LLM work, in this order:

**(a) Extract claims** — for each excerpt, list the load-bearing claims as: `{claim, source_id, date, speaker, hedges, context}`. Aim for 5–15 atomic claims per topic across all sources. Drop verbose excerpts from working context after extraction; keep only the structured claim list.

**(b) Detect contradictions and inflection points** — pairwise scan claims; group into clusters of agreement and disagreement. For each disagreement, note: dates, whether the divergence is era-driven (older vs newer), AI-driven (one side mentions AI shifting the conclusion), or stylistic (same advice, different framing).

**(c) Current-consensus check** — invoke WebSearch with queries shaped per cluster (e.g., `"current consensus on freemium vs free trial 2025"`, `"north star metric AI products 2026"`). Weight: prefer sources from the last 18 months; double-weight sources that explicitly discuss AI's effect on the practice. Capture 2–4 citations per cluster.

**(d) Synthesize** three outputs:

  - `knowledge/topics/<T>.md` — sections: `Current consensus`, `How thinking has evolved` (with dated citation chain), `Inflection points` (named events: e.g., "ChatGPT release", "Claude Code GA"), `Open questions`.
  - `knowledge/obsolete/<T>.md` — for each retired claim: `Claim`, `Originally said by` (source + date), `Why obsolete`, `Where it may still apply` (conditions), `Replaced by` (link to current consensus section). Run `python3 scripts/find_external_overlap.py --topic <T>` and append the result as a `## Community skill packs that may need updating` footer if any community repo covers this topic.
  - `knowledge/pending-review/<T>.md` — for each high-uncertainty cluster: `Claim`, `Why flagged`, `What human reviewer should decide`. Only write if there is something to flag; otherwise skip.

**Repeat-guest cross-check**: before finalizing, check `references/guests.yml`. If any source for this topic is from a guest with multiple episodes, run `python3 scripts/guest_tracker.py --diff <guest-slug>` and inspect whether the same guest's later episode contradicts their earlier claim. Same-guest stance changes are first-class inflection-point evidence and should be called out by name in the topic file.

### Two-corpus signal weighting (auto-caption sources as secondary signal)

The corpus may contain rows from auto-caption sources alongside the primary human-edited corpus. Two are currently supported:

- `04-how-i-ai/` — Claire Vo's How I AI podcast (YouTube auto-captions). `kind: "how-i-ai"`, `transcript_quality: "auto"`.
- `06-lennys-podcast-yt/` — Lenny's main podcast YouTube channel (auto-captions). `kind: "lennys-podcast-yt"`, `transcript_quality: "auto"`. Used to fill the ~3-month gap where the licensed corpus archive lags behind YouTube publishing, plus any episodes the licensed archive has not yet indexed.

The weighting policy below keys on `transcript_quality: "auto"`, so any new auto-caption corpus segment falls under the same treatment automatically.

**Treat them differently** from primary-corpus claims:

1. **Process the main corpus first.** Extract claims, detect contradictions, decide whether the topic shows a decay signal (older Lenny-guest claim contradicted by newer Lenny-guest claim, or replaced by external web consensus).

2. **Then layer How I AI claims**. For each How I AI claim found, classify it:

  - **Reinforcing signal** — the How I AI claim matches the *newer* / current-consensus side of an already-detected decay in the main corpus. Action: append to the corresponding entry in `obsolete/<topic>.md` under a "Cross-corpus reinforcement" subsection, citing the How I AI episode + date + Claire Vo as host. This strengthens confidence that the older advice is genuinely retired.

  - **Warning** — the How I AI claim contradicts an older Lenny-guest claim, **but no main-corpus newer claim has yet contradicted it**. The main corpus still treats the older claim as live; only How I AI dissents. Action: write a `Cross-corpus warning: How I AI dissents` entry in `pending-review/<topic>.md`. Do NOT mark the older claim obsolete on the strength of How I AI alone, since (a) auto-caption quality is lower and (b) Claire Vo represents one perspective, not the multi-guest consensus the obsolete file requires.

  - **Agreement with main corpus** — How I AI says roughly what the main corpus already says. No action needed; do not add it to citations (avoids citation noise).

3. **Never use How I AI as the primary citation** for a current consensus claim in `topics/<topic>.md`. It can be a supporting citation, but the topic file's "Current consensus" section should be anchored in main corpus + web sources.

4. **In the CHANGELOG entry** for the topic, log How I AI's role separately: `HIA reinforcing: <count>`, `HIA warnings: <count>`. This makes drift across corpora auditable.

The rationale: How I AI is purposefully an early-signal source for AI-era practice changes. It's likely to predict where the broader corpus is heading. Treating it as a tiebreaker (when main corpus already disagrees with itself) accelerates obsolete-flag confidence; treating it as a flag (when main corpus is silent) gives a human a chance to validate before declaring decay.

**(e) Append to CHANGELOG.md**: `## YYYY-MM-DD <topic>` with `Sources processed: N`, `Contradictions found: M`, `Web citations added: K`, `Flagged for review: J`, model used.

**(f) Drop processed material** from the active context window. The CHANGELOG entry and the three output files are the only persistent state. Re-running on the same topic should be idempotent (overwrites with newer takes; old citations remain in the topic file's "How thinking has evolved" section).

### Step 3: book processing (one book per invocation)

For book `<B>`:

```bash
python3 scripts/book_mentions.py --book <B> --books-yml references/books.yml --corpus <path>
```

Returns mentions across the corpus (post + date + surrounding paragraph). Then the agent:

1. WebSearch for `<book title> <author> summary key insights` and `<book title> critical review` and `<book title> outdated AI` (last query is for newer commentary on whether the book's advice still holds).
2. Synthesize `knowledge/books/<book-slug>.md` with sections:
   - `Consensus key insights` (with citation count from sources)
   - `How Lenny's guests use it` (corpus mentions)
   - `Potentially interesting but rarer takes` — explicitly labeled `[CRITICAL READING REQUIRED]` so the reader weighs them skeptically
   - `Where the consensus may have decayed` (if any post-publication critiques exist)

### Step 4: verify (drift check)

Re-runs steps 2(c)–(e) for an existing topic without re-extracting claims. Cheaper. Use this for monthly maintenance loops.

### Step 5: digest export (after a batch)

```bash
python3 scripts/export_digest.py            # consensus-only digest
python3 scripts/export_digest.py --format full
```

Concatenates `knowledge/topics/*.md` into a single domain-grouped file. Use for periodic sync to Notion, email summaries, or human review.

### Step 5b: Audience-pushback scan (caution generation)

Before finalizing a topic, scan YouTube comments for any episodes cited in the topic file. The point is to catch claims that audience pushback marks as harmful or out of touch (e.g., Keith Rabois's "no day off is good practice" type advice) and route them to `cautions/<topic>.md`.

Process:

1. **Identify cited episodes.** From the structured claim list (Step 2a), get the unique set of episodes (slug + youtube_id where known). For Lenny episodes, use `python3 scripts/fetch_yt_comments.py --lenny-episode <slug> --skip-existing`. For How I AI, use `--episode <youtube_id>`. The comments end up in `<corpus>/05-comments/<youtube-id>.json`.

2. **Read the top comments** (sorted by votes, capped at 50) for each episode. The script keeps the top-voted public comments. Read the JSON file directly with the `Read` tool.

3. **Filter for substantive critique.** Drop pure ad hominem, off-topic snark, single-word reactions, or comments that just say "great episode!". Keep comments that:
   - Have at least 5 votes (or >= 3x the median votes on that video)
   - Make a substantive argument (not just disagreement, but a stated reason)
   - Reference a specific claim from the episode

4. **Classify each surviving comment:**

   - **Caution-eligible**: the comment explicitly disputes a guest claim with grounds suggesting the claim is *not safe to generalize* (privilege-blind, normalizes burnout, ethically dubious, factually wrong about the speaker's own example, etc.). Examples of legitimate caution flags:
     - "fascinating conversation, from the people who will never be affected by any of it" (191 votes on Keith Rabois ep) → flags Rabois's claims as privilege-blind
     - "his example for X is wrong, the founder said the opposite" (57 votes on same ep) → factual contradiction with episode's own evidence
     - "Marie Antoinette explaining what farmers should do" (145 votes) → reinforces privilege-blind frame
   - **Healthy disagreement**: the comment disputes the claim but on grounds where reasonable people disagree (different industry, different stage, different stack). This is *not* a caution; can be noted as a counterpoint in `pending-review` if it points to genuine ambiguity.
   - **Noise**: anything else.

5. **Write `cautions/<topic>.md`** if at least one caution-eligible claim was identified. Use the template under `knowledge/cautions/_TEMPLATE.md`. Each caution entry must:
   - Quote the top 1-3 pushback comments verbatim with vote counts.
   - Give a "Why flagged" rationale (do not just say "the audience didn't like it"; identify the *kind* of out-of-touch — privilege-blind, factually wrong, normalizes harm, etc.).
   - Note "Where (if anywhere) it might still apply" — sometimes psychotic-sounding advice has a narrow valid context (e.g., the speaker's own founder-mode reality), and the reader deserves that nuance.
   - Cross-check against other guests on the same topic. If multiple non-flagged guests have given gentler versions of similar advice, surface them as healthier alternatives.

6. **Confidence calibration:**
   - High confidence caution: top comment > 100 votes AND multiple substantive pushback comments AND another corpus source contradicts the claim.
   - Medium confidence: top comment 30-100 votes AND substantive critique.
   - Low confidence: borderline cases — write to `pending-review/<topic>.md` instead, with a note that comment-signal alone isn't enough.

7. **Never weaponize comments alone.** A 200-vote comment from a hostile commenter is still one perspective; the cautions file is a *flag for the reader to apply skepticism*, not a verdict. The template's "How this section was generated" footer must be present so readers can audit.

8. **CHANGELOG entry**: log `Cautions written: N`, `Cautions skipped to pending-review: M`. Track this separately from `Contradictions found` so caution-versus-decay drift can be inspected.

### Step 6: YouTube auto-caption fetch (refresh secondary corpus)

```bash
python3 scripts/fetch_how_i_ai.py --corpus <path> --skip-existing            # How I AI incremental
python3 scripts/fetch_lenny_yt.py  --corpus <path> --skip-existing            # Lenny main pod (newer-than-corpus-max)
python3 scripts/fetch_lenny_yt.py  --corpus <path> --since 2026-04-01         # Lenny main pod since date
python3 scripts/fetch_how_i_ai.py --corpus <path> --newest-only --dry-run     # preview
```

`fetch_how_i_ai.py` pulls Claire Vo's How I AI channel into `<corpus>/04-how-i-ai/`.

`fetch_lenny_yt.py` pulls Lenny's main podcast YouTube channel into `<corpus>/06-lennys-podcast-yt/`. By default it operates in `--newer-than-corpus-max` mode: reads max date among `kind: podcast` rows in `01-start-here/index.json` and only fetches strictly-newer YouTube videos so it doesn't duplicate already-human-transcribed material. Override with `--since YYYY-MM-DD` or `--all` (the latter applies title-fuzzy + same-date dedup against the corpus).

Re-run `parse_corpus.py` afterward so new rows appear in `_corpus_normalized.json`. Recommended cadence: weekly (Lenny publishes Thursdays, How I AI publishes Mondays). All output rows are tagged `transcript_quality: auto` so the two-corpus weighting policy above applies.

### Step 6b: Manual drop processing (lennysdata.com clean transcripts)

```bash
python3 scripts/process_drop.py --corpus <path>            # process new drops
python3 scripts/process_drop.py --corpus <path> --dry-run  # preview
```

Subscribers to `https://www.lennysdata.com/` get clean human-edited transcripts. There is no public API; the workflow is manual:

1. User downloads transcripts and drops them in `<corpus>/_manual_drop/` as markdown files with the YAML frontmatter shown in `_manual_drop/_TEMPLATE.md` (auto-created on first run).
2. `process_drop.py` validates frontmatter, routes files to `02-newsletters/` or `03-podcasts/` with `transcript_quality: human` and `source: lennysdata`, moves source files to `_manual_drop/processed/`, malformed files to `_manual_drop/_unparseable/` with `.error` notes, updates `<corpus>/_state.json.last_lennysdata_pull`.
3. The next `parse_corpus.py` picks them up via the directory-scan fallback (no need to mutate the official `index.json`).

The skill auto-runs `process_drop.py` at Step 0.5 of every invocation, so users do not need to remember to invoke it.

### Step 7: YouTube comment fetch (caution input)

```bash
python3 scripts/fetch_yt_comments.py --corpus <path> --lenny-episode <slug>   # single Lenny ep
python3 scripts/fetch_yt_comments.py --corpus <path> --episode <youtube-id>   # by ID (any source)
python3 scripts/fetch_yt_comments.py --corpus <path> --from-corpus            # all How I AI eps
python3 scripts/fetch_yt_comments.py --corpus <path> --from-corpus --include-lenny --max-episodes 30
```

Fetches top 50 comments by likes via `youtube-comment-downloader` (no auth needed). Comments are written to `<corpus>/05-comments/<youtube-id>.json` with vote counts, author, text, and a `_index.json`. Used by Step 5b to generate cautions. Recommended cadence: fetch comments lazily per-topic (only when a topic processing run will read them) rather than bulk-fetching upfront, since comment counts change over time.

### Step 8: Auto-update profile + memory + decisions (every invocation, end)

After answering the user, the skill silently updates the auto-context layer. None of these steps are announced to the user (with the rare exception noted below).

1. **Compute a profile inference patch.** From the user's input + the active facets used for the response + any new role/stage/domain signals observed:

   - For each candidate facet (existing match, or new), build an observation entry: `{match: {role, domain}, label, current_focus, stage, tenure, observation: "<short evidence quote>"}`.
   - Aggregate into a single JSON patch with `facet_observations`, optional `interest_tags_add`, `ongoing_initiatives_add`, `biases_add`. Keep observation strings short (1 sentence, quoting or close-paraphrasing the user).
   - Apply: `echo '<json>' | python3 scripts/profile_update.py --json -`.
   - The patch handler reinforces matching facets (weight + 0.1, capped at 1.0) or adds new facets at weight 0.2.

2. **Append memory entry.** Always: `python3 scripts/memory_append.py --skill lenny-actualize --input "<one-line summary>" --facets "<active-facet-labels>" --surfaced "<comma-list of paths>" --themes "<themes>"`.

3. **Append decisions entry only when divergence is detected.** Triggers: user pushes back ("no, I'd actually do X"), states a different course of action ("we're going to go with Y instead"), or otherwise indicates the recommendation isn't going to be followed.

   - `python3 scripts/decisions_append.py --skill lenny-actualize --recommendation "<text>" --user-action "<text>" --reasoning "<text>"`.
   - On a later invocation, if a recent unmuted decision lacks an outcome AND the user mentions related context (e.g., "the junior PM hire is going great"), write an outcome update: `python3 scripts/decisions_append.py --outcome-update --references <prior-timestamp> --outcome "<text>"`.

4. **Decay sweep on a low cadence.** Every ~50 invocations (check `meta.inference_runs`), include `"decay": true` in the profile patch so stale facets shrink toward dormancy without ceremony.

5. **Light user-facing aside, occasionally.** Every ~10 invocations, OR whenever a *new* facet is added, OR whenever a strong observation moves a facet's weight by ≥0.3, surface a single one-line aside at the end of the response. Examples:

   > _(Noted that you also work on GTM advisory — refining your profile.)_
   > _(Adding "non-fiction reader" to your interest tags.)_

   Most invocations stay silent on profile updates. The aside should never lead the response.

## Context management rules (critical)

- **Never load full file bodies** unless processing them right now. Use `scripts/topic_chunks.py` to pull only excerpts.
- **After Step 2(a)**, the structured claim list replaces the excerpts. Do not keep both.
- **Process topics serially**, not in parallel within one session. Each topic is a self-contained unit. (For batch runs, prefer `/loop` with one topic per iteration.)
- **WebSearch results are summarized to citations**, not kept verbatim.

## Decision log

Every run must capture in CHANGELOG.md:
- Topics where the agent could not reach a confident consensus (and why)
- Topics where >2 inflection points were detected (often signals AI disruption)
- Citations that disagreed with the corpus consensus and won the recency weighting
- Books skipped because no online digest was findable

Significant uncertainties (tier-1 disagreements between recent authoritative sources, or shifts in stance from a guest who returned on a later episode) get flagged in `pending-review/<topic>.md` for human sign-off.

## Portability

To use on another expert-interview corpus:
1. Replace `--corpus <path>` with the new corpus root.
2. Adapt `scripts/parse_corpus.py` to the new index format (currently expects `01-start-here/index.json` with `podcasts` and `newsletters` arrays).
3. The taxonomy derivation, claim extraction, contradiction detection, and consensus check steps are corpus-agnostic.

## Known gaps and how the skill handles them

- **Repeat-guest stance changes**: handled via `references/guests.yml` and `scripts/guest_tracker.py`. Currently 3 confirmed repeat guests (Elena Verna, Nikhyl Singhal, Claire Vo); rerun `--rebuild` after each parse_corpus to refresh.
- **Community SOP/skill staleness**: handled via `references/external_skills.yml` and `scripts/find_external_overlap.py`. When an obsolete claim is written, the obsolete/<topic>.md file gets a footer linking community packs that cover the same topic so their maintainers can be notified.
- **Reader-mode export**: handled via `scripts/export_digest.py`.
- **Last-3-months newsletter gap**: `parse_corpus.py` warns when the corpus max date is more than 90 days behind today. Two ways to close the gap: (1) `fetch_lenny_yt.py` pulls Lenny's main podcast YouTube channel for newer-than-corpus episodes (auto-caption fidelity); (2) lennysdata.com manual-drop path (`_manual_drop/` + `process_drop.py`) brings in clean human-edited transcripts for subscribers. Step 0.5 surfaces a 14-day reminder if the manual path has been idle.
- **Newsletter `post_url` reuse**: when citing a newsletter, prefer the `post_url` field from `_corpus_normalized.json` over a hand-built URL, since post slugs sometimes diverge from filenames.
- **How I AI as AI-era early-signal corpus**: handled via `scripts/fetch_how_i_ai.py` and the "Two-corpus signal weighting" policy. Auto-captions are lower fidelity than human-edited Lenny transcripts, so they reinforce existing decay signals or flag warnings, but never trigger obsolete entries on their own.
- **Lenny YouTube auto-caption corpus**: handled via `scripts/fetch_lenny_yt.py` and the same "Two-corpus signal weighting" policy. Default mode `--newer-than-corpus-max` avoids duplicating already-human-transcribed material in `03-podcasts/`. Each fetched markdown carries a `dedup_basis` frontmatter line for audit.
- **lennysdata.com clean transcripts (manual)**: subscribers can drop fresh transcripts into `<corpus>/_manual_drop/`; `scripts/process_drop.py` (auto-run at every Step 0.5) routes them into `02-newsletters/`/`03-podcasts/` with `transcript_quality: human` and `source: lennysdata`. `parse_corpus.py` picks them up via a directory-scan fallback. After 14 days idle, the skill surfaces a one-line reminder once per ~7 days.
- **Auto-inferred multi-faceted profile**: handled via `scripts/profile_load.py` + `scripts/profile_update.py` + `references/profile_schema.yml`. The skill never asks the user to set up a profile; it accumulates one from observed signals over time. Multi-facet outputs surface when ≥2 facets carry weight ≥0.5 and are plausibly relevant.
- **Auto memory + decisions logs**: handled via `scripts/memory_append.py` and `scripts/decisions_append.py`. Memory writes after every invocation; decisions write when the skill detects a divergence between its recommendation and the user's stated course. Outcome updates are written as new entries that reference the prior decision (append-only).
- **Audience-pushback as caution signal**: handled via `scripts/fetch_yt_comments.py` and Step 5b. High-vote pushback comments produce `cautions/<topic>.md` flags for advice that is privilege-blind, factually wrong, or unsafe to generalize. Distinct from `obsolete/` (decay over time) since cautions surface even when there's no temporal contradiction.
