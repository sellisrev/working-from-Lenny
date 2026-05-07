# Restart: build skill 3 (lenny-pressure-test)

This file is a bootstrap brief for a new Claude Code session to build the third skill in the bundle. Created at the end of the 2026-05-07 session that landed the foundation + skill 2.

## Where things stand

- `main` carries: skill 1 (`SKILL.md` at root, lenny-actualize, knowledge-base maintenance) and skill 2 (`lenny-hire/SKILL.md`, scenario-specific hiring playbook).
- Auto-context layer is in place and shared: profile (auto-inferred, multi-faceted) at `~/.lenny-actualize/profiles/default.yml`; memory and decisions logs alongside. Helpers under `scripts/`: `paths.py`, `profile_load.py`, `profile_update.py`, `memory_append.py`, `decisions_append.py`, `process_drop.py`, `weekly_refresh.py`, `yt_fetch_lib.py`, `fetch_lenny_yt.py`.
- Knowledge base: 154 topic files, 5 obsolete, 3 cautions, 5 books in `knowledge/`.
- Detailed plan from the foundation push (still relevant for the auto-context patterns): `~/.claude/plans/modular-sprouting-pillow.md`.

## What skill 3 is

`lenny-pressure-test` — the user feeds a plan / PRD / strategy doc / proposed decision; the skill returns the strongest corpus-grounded objections, attributed to specific guests and arguments, with prerequisite episodes/newsletters worth reading first and pre-ship questions worth answering.

## Design constraints (hard rules — do not weaken)

1. **Every objection is specific and actionable.** Not "have you considered retention?" but "the plan does not specify a retention metric; corpus consensus per Brian Balfour and Casey Winters is that growth without a retention floor compounds churn — concrete next step: define a 30-day retention threshold for the target user before increasing acquisition spend, and disable the new acquisition channel if it ships below threshold."

2. **Nobody is ever left without a what-to-do-next recommendation.** Every objection MUST carry an actionable next step. When the plan is fundamentally broken, the recommendation is `"start from scratch"` with a concrete framing of where to start (e.g., "the unit economics premise contradicts marketplace consensus; recommend restarting from the question 'who is the constrained side and what does liquidity for them look like?' before any feature work"). Not having a recommendation is a bug, not a valid output state.

3. **No mandatory gates, no quick/full toggles, no refuse-on-thin-input.** If the input is a 2-line idea instead of a full PRD, give a compact pressure test (3-4 strongest objections) plus 2-4 suggested extensions ("- you might want to share the section on metrics — that's where the corpus would push back hardest", "- alternatively, want a sanity check against a specific framework like Good Strategy?"). Never refuse to engage. (See `~/.claude/projects/C--Users-serge/memory/feedback_skill_friction.md` — this is a saved durable preference.)

4. **Shared auto-context layer.** Step 0.5 (silent auto-context: process_drop, _state.json, profile, memory, decisions) and Step 8 (silent end-of-invocation profile/memory/decisions update) are the same as skills 1 and 2. Mirror the patterns in their SKILL.md files; do not invent new conventions.

5. **Multi-facet output where applicable.** If the active profile has ≥2 facets at weight ≥0.5 and both plausibly apply (e.g., a `founder` and a `gtm-advisor` reviewing the same plan), produce two short framing paragraphs at the top before the unified objection list.

6. **Attribute every objection to a corpus source.** Same citation format the topic files use (guest + date + post URL where available). Don't paraphrase corpus consensus into anonymous "the experts say" — the whole point is grounding.

## Suggested layout

```
lenny-pressure-test/
  SKILL.md                              # frontmatter + workflow
references/
  pressure_test_topic_map.yml           # plan-shape -> topic-slug routing
knowledge/
  pressure-test/                        # opt-in saved pressure tests
```

## Suggested input parsing

The user might paste:
- A full PRD or strategy doc (likely thousands of words)
- A 1-pager or short bullet list
- A casual description ("we're thinking about launching a free tier")

For each, the skill should extract:
- **Plan kind**: PRD | strategy-doc | go-to-market-plan | pricing-decision | hiring-plan | architectural-decision | casual-idea
- **Domain** and **company stage** (default to active profile facets)
- **Implicit metrics** mentioned (or absent — absence is itself an objection target)
- **Implicit assumptions** (these are usually where the corpus pushes back hardest)

## Suggested workflow (mirror skills 1 + 2 step numbering for muscle memory)

- **Step 0**: read scaffolding (`references/topics.yml`, `references/books.yml`, `references/pressure_test_topic_map.yml`).
- **Step 0.5**: auto-context (drop processor, state file + 14-day reminder, profile/memory/decisions read). **Same as skill 1 and 2 — copy that section verbatim and adjust the skill name.**
- **Step 1**: parse the plan. Classify kind, extract metrics + assumptions + decisions made.
- **Step 2**: route to relevant topic files via `pressure_test_topic_map.yml`. Always include `evaluating-product-bets`, `good-strategy-rumelt`, `seven-powers` as durable framework lenses; add domain/kind specific topics on top.
- **Step 3**: read the topic files + relevant `obsolete/` + `cautions/` + `books/`. (Direct reads — no claim re-extraction. Same approach as skill 2.)
- **Step 4**: generate 4-8 ranked objections. For each: claim, source attribution, why-it-applies-to-this-plan in one sentence, **specific next step**.
- **Step 5**: pre-ship questions (3-6) — questions the user should answer before shipping, drawn from the same corpus material. Each question references the source.
- **Step 6**: prerequisite episodes/newsletters/books — 2-4 items, each with a one-line "why this first" rationale.
- **Step 7**: optional save to `knowledge/pressure-test/<plan-slug>-<YYYY-MM-DD>.md` if the user asks.
- **Step 8**: auto-update profile + memory + decisions. Same as skills 1 and 2.

## Topic files most likely to be load-bearing

(Don't read all of these — the routing in Step 2 picks a subset.)

- Strategic frame: `evaluating-product-bets`, `good-strategy-rumelt`, `seven-powers`, `product-strategy`, `assessing-product-strategy-as-board`
- Growth + GTM: `growth-loops`, `north-star-metric`, `retention`, `cohort-retention`, `activation-metric`, `scaling-b2b-growth`, `icp-identification`
- Marketplaces: `marketplace-cold-start`, `marketplace-quality`, `marketplace-failure`, `atomic-network`
- Pricing: `pricing-strategy`-related slugs (check `references/topics.yml`), plus the Madhavan Ramanujam 2026 episode
- AI-era pressure: `ai-pm-skills`, `ai-replacing-pms`, `vibe-coding`, `ai-prototyping`, `evals-for-ai-products`
- Product sense: `product-market-fit`, `startup-not-growing`, `minimum-lovable-product`
- Hiring/org: defer to skill 2 if the plan is hiring-shaped; skill 3 should detect that and suggest invoking lenny-hire instead

## Things to NOT do

- Do not build a full claim-extraction pipeline. The knowledge base already has the synthesis; skill 3 reads it.
- Do not write a "pressure test" that ends with vague hedges. Every objection has a next step.
- Do not block on input thinness. Compact answer + extensions.
- Do not silently route to one facet when the profile carries two relevant ones. Multi-facet weave at the top.
- Do not introduce a new auto-context pattern. Reuse Step 0.5 + Step 8 exactly.

## How to start tomorrow

1. `cd C:\Users\serge\source\repos\lenny-actualize`
2. `git checkout -b feature/skill-3-lenny-pressure-test`
3. Read `lenny-hire/SKILL.md` end-to-end (it's the closest template).
4. Build `lenny-pressure-test/SKILL.md` and `references/pressure_test_topic_map.yml`.
5. Update `README.md` to register skill 3 in the bundle list.
6. Smoke-test by mentally walking a 1-pager idea through the workflow.
7. Commit on the feature branch; merge to main when satisfied; push.

## Open questions (decide tomorrow)

- Does pressure-test need its own routing YAML, or is the topic-map small enough to inline in SKILL.md? Recommend a YAML — it scales as the corpus grows.
- Should the skill include a "second-opinion" mode where it argues both sides? Probably yes, since some plans get a clean "ship it" — that's a valid output too. Keep it light: add a section "What the corpus would NOT object to about this plan" when the plan is mostly sound.
- Save format for opt-in pressure tests: same frontmatter shape as `knowledge/topics/<slug>.md`? Probably yes.
