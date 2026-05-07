# lenny-actualize

A Claude Code skill that builds and maintains a current-consensus knowledge base over the Lenny's Newsletter + Podcast corpus, plus referenced books and Claire Vo's How I AI podcast. Tracks knowledge decay across the multi-year corpus, identifies inflection points (especially AI-driven ones), maintains an obsolete-advice index, and flags advice claims that audience pushback has called out as out of touch.

Designed for the Lenny corpus but portable to any expert-interview corpus.

## Why this exists

Existing community projects extract static skills/SOPs from the Lenny corpus ([RefoundAI/lenny-skills](https://github.com/RefoundAI/lenny-skills), [qingxuantang/Lennys-to-sop-and-skills](https://github.com/qingxuantang/Lennys-to-sop-and-skills), [arjunlall/lenny-for-claude](https://github.com/arjunlall/lenny-for-claude)). None track decay. Advice from 2021 about virality, freemium, hiring, or PMF often disagrees with 2025-26 takes, especially where AI has reshaped workflow. This skill makes that decay legible, plus surfaces audience-flagged out-of-touch claims separately from genuinely-decayed advice.

## What's in the knowledge base

- **154 topic files** under `knowledge/topics/` covering AI-era practice, growth, marketplaces, pricing, B2B/sales, product strategy, PM career, hiring, leadership, business/founder, product sense, frameworks, personal/wellbeing, and 12 cross-functional consumer topics (working-with-pms-as-engineer/designer/sales/data, hiring-pms-as-non-pm, evaluating-product-bets, reviewing-prds-and-1-pagers, giving-feedback-as-leader, reading-product-roadmaps-as-stakeholder, assessing-product-strategy-as-board, understanding-pm-role-as-non-pm, spotting-bad-pm-behaviors).
- **5 obsolete files** under `knowledge/obsolete/` documenting claims that decayed (vibe-coding, ai-replacing-pms, freemium-vs-trial, prompt-engineering, seo-strategy).
- **3 caution files** under `knowledge/cautions/` flagging speaker claims that high-vote audience pushback called out as privilege-blind or unsafe to generalize:
  - **Keith Rabois** ("PM is dead" / "no days off") — 191-vote pushback
  - **Matt MacInnis / Rippling** ("soul crushing... by design") — 132-vote pushback
  - **Boris Cherny / Anthropic** ("100% of my code is written by Claude Code" / "use as many tokens as possible") — 691-vote pushback (highest in corpus)
- **5 book digests** under `knowledge/books/`: Inspired (Cagan), Working Backwards (Carr & Bryar), Good Strategy / Bad Strategy (Rumelt), 7 Powers (Helmer), Thinking in Bets (Annie Duke).
- **CHANGELOG.md** — append-only run log with model + sources + decisions per batch.

The knowledge base is written to be useful to **multiple audiences**: PMs, hiring managers (founders, eng leaders), cross-functional partners (engineers, designers, sales, data, support), execs / board / investors, and anyone reviewing a PRD / roadmap / strategy artifact. Most topic files include a "For non-PM consumers" section.

## Skill structure

```
SKILL.md                              # entry point + workflow for the skill
RUNBOOK.md                            # operational guide for batch processing
references/
  topics.yml                          # 154-topic taxonomy (slug, seed_keywords, related_tags)
  books.yml                           # 32 books referenced in the corpus
  guests.yml                          # repeat podcast guests (auto-rebuilt)
  external_skills.yml                 # 8 community skill packs catalogued
scripts/
  parse_corpus.py                     # normalize corpus index.json into row table
  topic_chunks.py                     # emit excerpts for a topic, sorted by date
  book_mentions.py                    # find every paragraph mentioning a book
  guest_tracker.py                    # repeat-guest old-vs-new claim comparison
  fetch_how_i_ai.py                   # pull Claire Vo's How I AI captions
  fetch_yt_comments.py                # top YouTube comments by likes
  find_external_overlap.py            # match topics to community skill packs
  list_topics.py                      # match counts + processed-status overview
  export_digest.py                    # consolidate topic files into single digest
knowledge/
  topics/<slug>.md                    # current consensus + inflection points
  obsolete/<slug>.md                  # decayed claims with where-they-may-still-apply
  cautions/<slug>.md                  # audience-pushback-flagged claims
  pending-review/<slug>.md            # high-uncertainty clusters (currently empty)
  books/<slug>.md                     # book-level digest
  CHANGELOG.md                        # append-only run log
```

## Key design decisions

- **Title-level matching with body-fallback** in `topic_chunks.py`: avoids tag-only matches that produce false positives. If title-level match returns < 3 sources, falls back to body-keyword scan.
- **Drop-after-extraction context discipline**: per-topic processing reads excerpts, extracts structured claims, then drops the excerpts from working context. The CHANGELOG entry and the three output files are the only persistent state.
- **Two-corpus signal weighting**: How I AI episodes are treated as **secondary** signal — they reinforce existing decay signals or flag warnings, but never trigger obsolete entries on their own. They never serve as the sole citation for a current-consensus claim.
- **Caution vs obsolete distinction**: Obsolete = was once correct, has decayed. Caution = was probably never wise; reflects speaker blind spot. Both warrant reader skepticism but for different reasons.
- **Comment-fetch caution bar**: Caution files require >= 30 votes substantive critique AND specific argument (not just disagreement) AND corpus or external counter-evidence. The Keith Rabois case (191/145/57/47 votes), Matt MacInnis case (132 votes), and Boris Cherny case (691/673/428/211 votes) all met this bar; many others examined did not.

## Setup

Requires Python 3.9+ and:

```bash
pip3 install --user pyyaml yt-dlp youtube-transcript-api youtube-comment-downloader
```

For each new environment, point the skill at your local corpus:

```bash
python3 scripts/parse_corpus.py --corpus /path/to/lennys-newsletterpodcastdata-all
python3 scripts/guest_tracker.py --rebuild
```

The corpus itself is licensed Lenny content — not redistributed by this repo. Get it from [LennysNewsletter/lennys-newsletterpodcastdata](https://github.com/LennysNewsletter/lennys-newsletterpodcastdata) (free public starter pack) or via [lennysdata.com](https://www.lennysdata.com) (full archive for paid subscribers).

Optional secondary corpus (Claire Vo's How I AI):

```bash
python3 scripts/fetch_how_i_ai.py --corpus /path/to/corpus --skip-existing
python3 scripts/parse_corpus.py --corpus /path/to/corpus  # re-run after fetch
```

Episode YouTube comments for caution-eligibility scanning:

```bash
python3 scripts/fetch_yt_comments.py --corpus /path/to/corpus --lenny-episode keith-rabois
python3 scripts/fetch_yt_comments.py --corpus /path/to/corpus --episode <youtube_id>  # if slug-search fails
```

## Workflow modes

See [SKILL.md](SKILL.md) for the full workflow. Brief overview:

- `/lenny-actualize init` — first run; parse corpus, build taxonomy + books + guests indices.
- `/lenny-actualize topic <slug>` — process one topic end-to-end (excerpts → claims → web search → 3 outputs).
- `/lenny-actualize book <slug>` — process one book digest.
- `/lenny-actualize verify <slug>` — drift check; refresh consensus without re-extracting claims.
- `/lenny-actualize fetch-hia` — pull new How I AI episodes.

For batch processing the remaining topics or running maintenance refreshes, see [RUNBOOK.md](RUNBOOK.md).

## Maintenance cadence

- **Weekly** (Monday after How I AI publishes): `fetch_how_i_ai.py --skip-existing`, then `parse_corpus.py`, then `guest_tracker.py --rebuild`.
- **Monthly**: drift check on Tier-1 AI-era topics via `verify` mode.
- **Quarterly**: bulk refresh — re-run `parse_corpus.py`, refetch How I AI, optionally fetch comments for new high-engagement episodes via `fetch_yt_comments.py --from-corpus --include-lenny --max-episodes 20`.

## License

This repository contains **only the skill scaffolding, scripts, and Claude-generated knowledge synthesis**. The underlying Lenny corpus is licensed content from [Lenny's Newsletter](https://www.lennysnewsletter.com) and is not included or redistributed.

The knowledge synthesis files quote audience YouTube comments verbatim with username attribution as fair-use commentary on public content; none of the corpus itself is reproduced.

## Cross-references

The skill catalogues 8 community Lenny-corpus repos in `references/external_skills.yml`. When this skill writes an obsolete claim, the corresponding obsolete file gets a footer linking community packs that may need updating.

## Status

154 / 154 topics processed (100%). Maintenance phase: web-citation verification, periodic refresh, occasional new caution detection. See `knowledge/CHANGELOG.md` for the full per-batch log.
