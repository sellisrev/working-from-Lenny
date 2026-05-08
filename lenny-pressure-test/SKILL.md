---
name: lenny-pressure-test
description: Pressure-test a plan / PRD / strategy doc / GTM plan / pricing decision / architectural decision against the strongest corpus-grounded objections from the Lenny knowledge base. Returns ranked objections (each attributed to a specific guest with a concrete next step), pre-ship questions worth answering, and prerequisite episodes/newsletters/books. Reads `knowledge/topics/`, `knowledge/cautions/`, `knowledge/obsolete/`, `knowledge/books/`. Use when the user asks for a "pressure test", a "second opinion on this PRD/strategy/plan", "what would the corpus push back on", "stress-test this idea", "argue against this", "find the holes in this plan", or pastes a plan/decision and asks for review.
---

# lenny-pressure-test

Pressure-tests a plan against the corpus. Companion skill to `lenny-actualize` (which builds and refreshes the knowledge base) and `lenny-hire` (which composes hiring playbooks). lenny-pressure-test **consumes** the knowledge; it does not extract new claims or add to the knowledge base directly.

## Why this exists

A user with a PRD, strategy doc, GTM plan, or proposed decision wants the strongest corpus-grounded objections before shipping. Doing this manually means reading 6-12 topic files, checking obsolete and caution layers, and synthesizing a ranked critique. This skill does that synthesis on demand, attributing every objection to a specific guest + date + post URL, and ending each objection with a concrete next step.

The point is not to find "things to worry about." The point is to surface objections that are **specific, actionable, and attributable**, and to do so even when the input is thin.

## Hard rules (do not weaken)

1. **Every objection is specific and actionable.** Not "have you considered retention?" but "the plan does not specify a retention metric; corpus consensus per Brian Balfour and Casey Winters is that growth without a retention floor compounds churn. Concrete next step: define a 30-day retention threshold for the target user before increasing acquisition spend, and disable the new acquisition channel if it ships below threshold."

2. **Nobody is ever left without a what-to-do-next recommendation.** Every objection MUST carry a concrete next step. When the plan is fundamentally broken, the recommendation is `"start from scratch"` with a concrete framing of where to start (e.g., "the unit economics premise contradicts marketplace consensus; recommend restarting from the question 'who is the constrained side and what does liquidity for them look like?' before any feature work"). Not having a recommendation is a bug, not a valid output state.

3. **No mandatory gates, no quick/full toggles, no refuse-on-thin-input.** If the input is a 2-line idea instead of a full PRD, give a compact pressure test (3-4 strongest objections) plus 2-4 suggested extensions ("you might want to share the section on metrics; that's where the corpus would push back hardest", "alternatively, want a sanity check against a specific framework like Good Strategy?"). Never refuse to engage.

4. **Attribute every objection to a corpus source.** Same citation format the topic files use (guest + date + post URL where available). Don't paraphrase corpus consensus into anonymous "the experts say"; the whole point is grounding.

5. **Multi-facet output where applicable.** If the active profile has ≥2 facets at weight ≥0.5 and both plausibly apply (e.g., a `founder` and a `gtm-advisor` reviewing the same GTM plan), produce two short framing paragraphs at the top before the unified objection list. Do not duplicate the objection list per facet.

6. **Second-opinion mode when the plan is sound.** If the corpus would NOT object meaningfully, say so. Add a "What the corpus would NOT push back on" section calling out specifically which guest claims align with the plan, and surface 1-2 weaker concerns as pre-ship questions rather than objections.

7. **Surface cautions explicitly.** When citing a guest who has an active caution file (Keith Rabois, Matt MacInnis, Boris Cherny), include a one-line aside identifying the flag. The objection itself is still useful; the reader deserves the speaker context.

## Tone and depth (applies to every invocation)

Same principle as lenny-actualize and lenny-hire: no mandatory gates, no quick/full toggle, no refuse-on-thin-input.

For a **specific, well-scoped plan** (PRD, strategy doc, GTM plan with metrics, pricing rationale): produce the full pressure test (sections below).

For a **vague or thin** ask ("we're thinking about launching a free tier", "what would you push back on with this idea?"):

1. Pick the most likely interpretation, name it in one sentence ("Reading this as a freemium-vs-trial question for an AI-product B2B SaaS at scale-early"), and produce a **compact** pressure test: 3-4 strongest objections, each with attribution + next step.
2. List 2-4 suggested extensions ("want a deeper look if you share the unit economics?", "alternatively, want a sanity check against Good Strategy / Bad Strategy specifically?").

Multi-facet weave: if two facets carry weight ≥0.5 and both apply, produce two short framing paragraphs at the top of the response, then the unified objection list. Do not duplicate sections per facet.

Never refuse on thin input. If genuinely ambiguous, ask one short clarifying question alongside (not instead of) the compact-answer-on-most-likely interpretation.

## Inputs (all optional; defaults applied where missing)

The agent parses these from the user's message. Most of the time, only the plan text is supplied.

- **plan_text**: the artifact being pressure-tested. Ranges from a 2-line idea to a full PRD.
- **plan_kind**: prd | strategy-doc | go-to-market-plan | pricing-decision | hiring-plan | architectural-decision | launch-plan | roadmap | casual-idea (agent classifies in Step 1).
- **company_stage**: 0-1 | 0-1-pmf | scale-early | scale-late | public (defaults to active profile facet's `company_stage`).
- **domain**: b2b-saas | consumer | marketplace | fintech | devtools | infra | ai-product | medtech | enterprise (defaults to active profile facet's `domain`).
- **current_concern**: the specific worry the user has stated alongside the plan ("I'm worried we're shipping too late", "exec is going to push back on the pricing"). Used to weight which objections lead.

If the plan-kind is omitted but the text is rich enough to infer one, the agent infers and announces the assumption ("Reading this as a GTM plan for B2B SaaS at scale-early; let me know if it's actually a launch plan").

## Outputs

The default output is **conversational**: a pressure test delivered in the response. The user can ask "save this" to persist a copy at `knowledge/pressure-test/<plan-slug>-<YYYY-MM-DD>.md` for later reference. This is opt-in; the skill doesn't write files unless asked.

**Pressure-test structure** (sections; can be compressed to 1-3 lines each in compact mode):

1. **Plan summary**: one paragraph. State assumptions inferred (kind, domain, stage). Name the active profile facets if multi-lens.
2. **Multi-facet framing** (when applicable): two short paragraphs, one per facet, before the unified objection list. Skip if only one facet applies.
3. **Ranked objections**: 4-8 objections, strongest first. Each one:
   - **Claim**: what the objection actually says, in one sentence.
   - **Source**: guest + date + post URL or filename, in the same format the topic files use.
   - **Why it applies to this plan**: one sentence connecting the claim to the specific text the user shared.
   - **Concrete next step**: what the user should do before shipping. If the plan is fundamentally broken, "start from scratch from question X."
   - **Caution flag** (if cited guest has an active `cautions/` file): one-line aside.
4. **Pre-ship questions**: 3-6 questions the user should answer before shipping. Each cites the corpus source the question came from. These are softer than objections; they surface ambiguity rather than disagreement.
5. **What the corpus would NOT push back on** (when applicable): 1-3 bullets when parts of the plan align with strong corpus consensus. Cite the supporting guest. Skip the section entirely if the plan has no clear "wins."
6. **Prerequisite reading**: 2-4 episodes / newsletters / books, each with a one-line "why this first" rationale. Order by which one would change the plan the most if read.
7. **Hand-off** (when applicable): if the plan is hiring-shaped, recommend invoking `lenny-hire` for the question-script + signal-probing layer rather than handling it here.

## Workflow

### Step 0: Read scaffolding (always, cheap)

Read:
- `references/pressure_test_topic_map.yml` for the plan-kind + domain + assumption routing
- `references/topics.yml` to know what topic slugs exist
- `references/books.yml` for book citations

If any are missing, fall back to scanning `knowledge/topics/` filenames directly.

### Step 0.5: Auto-context (every invocation, silent)

Run the same auto-context steps as lenny-actualize and lenny-hire. This is the shared layer; the user has one profile / memory / decisions across all skills.

1. Run `python3 scripts/process_drop.py --corpus <path>` (silently; only mention the count if files were processed).
2. Read `<corpus>/_state.json`. If `last_lennysdata_pull` is null or older than 14 days AND `last_reminder_shown` is null or older than 7 days, surface the one-line reminder. Then update `last_reminder_shown`.
3. Run `python3 scripts/profile_load.py` and use the active facets to shape output.
4. Read recent memory (`<home>/.lenny-actualize/memory/default.md`, last ~20 entries) and decisions (`<home>/.lenny-actualize/decisions/default.md`, last ~10) for context. Look especially for prior pressure-test invocations and any decisions whose outcomes the user may now be reporting (e.g., "we shipped the freemium tier we pressure-tested last month, here's the data").

### Step 1: Parse the plan

From the user's input, extract:

- **plan_kind**: classify into prd | strategy-doc | go-to-market-plan | pricing-decision | hiring-plan | architectural-decision | launch-plan | roadmap | casual-idea. Use signal phrases:
  - "PRD", "user story", "acceptance criteria", "design doc" → prd
  - "strategy", "where to play", "how to win", "vision" → strategy-doc
  - "GTM", "go to market", "channels", "ICP", "sales motion" → go-to-market-plan
  - "pricing", "free tier", "freemium", "willingness to pay", "package" → pricing-decision
  - "hire", "interviewing", "candidate", "headcount" → hiring-plan
  - "migrate to", "rewrite", "stack choice", "architecture", "platform decision" → architectural-decision
  - "launch", "ship", "GA", "release announcement", "Product Hunt" → launch-plan
  - "roadmap", "Q1/Q2 priorities", "what we're building this half" → roadmap
  - 1-2 lines, casual phrasing, "we're thinking about…" → casual-idea
- **domain** and **company_stage**: default to active profile's most-relevant facet. Override if the plan text contradicts the profile (e.g., the user is `founder/medtech` but the plan is clearly about a consumer marketplace; assume the user is asking on behalf of someone else and use the domain from the plan).
- **stated metrics**: list every metric the plan names (DAU, MAU, retention, activation, conversion, NPS, ARR, payback, etc.).
- **missing metrics**: for the plan-kind + domain, identify metrics the corpus considers load-bearing that the plan does NOT name. Use `pressure_test_topic_map.yml` `missing_metric_to_topics` keys.
- **stated assumptions**: explicit claims the plan makes ("our virality coefficient will exceed 1.2", "we'll achieve PMF by Q3", "we'll convert 5% of free users").
- **implicit assumptions**: premises the plan operates on without justifying. Use `pressure_test_topic_map.yml` `implicit_assumption_to_topics` keys (e.g., `claims-virality-without-loops`, `assumes-feature-launch-equals-traction`, `proposes-acquisition-without-retention-floor`).
- **decisions made**: choices the plan locks in (vendor selection, pricing model, channel mix, hiring sequence). These are first-class objection targets; the corpus often disagrees with locked-in decisions that ignore alternatives.

If `plan_kind` is genuinely ambiguous, pick the most plausible and name the assumption in the plan-summary line.

If the plan is hiring-shaped, **flag for hand-off**: produce a 2-3 objection compact pressure test on the strategic framing (is now the right time to hire? is this the right role?) and recommend invoking `lenny-hire` for the playbook layer.

### Step 2: Route to topic files

Build the topic-file list from `pressure_test_topic_map.yml`:

1. Start with `shared_baseline` (always considered: Rumelt, 7 Powers, board lens).
2. Add `plan_kind_to_topics[<kind>].primary`.
3. Add `plan_kind_to_topics[<kind>].metrics_to_probe` if the plan has stated or missing metrics.
4. Add `plan_kind_to_topics[<kind>].common_failure_modes`.
5. Add `domain_specific[<domain>].topics`.
6. Add `stage_specific[<stage>].topics`.
7. For each implicit assumption surfaced in Step 1, apply `implicit_assumption_to_topics` lookups and merge.
8. For each missing metric, apply `missing_metric_to_topics` lookups and merge.
9. If the company_stage is `scale-early` or later, OR the domain is `ai-product`, OR the plan mentions AI in any form, add `ai_era_overlay.topics`, `ai_era_overlay.cautions`, `ai_era_overlay.obsolete`.
10. For the user's `current_concern`, apply `concern_to_topics` lookups and merge.

The resulting list is typically 6-12 topic slugs. Cap at 14 to keep token budget reasonable. If the cap is hit, drop slugs in this priority order: stage-specific > domain-specific > shared_baseline > plan-kind primary. Never drop AI-era overlay if it was triggered. Never drop slugs added by `implicit_assumption_to_topics`; those are the load-bearing matches.

### Step 3: Read the topic files (lazy, only what's needed)

For each slug, read `knowledge/topics/<slug>.md` directly. The file is already a synthesis; no need to re-extract claims.

For each topic, also check:
- `knowledge/obsolete/<slug>.md`: if present, the topic has decay; this is often where the strongest objection lives ("the plan operates on advice that the corpus has retired").
- `knowledge/cautions/<slug>.md`: if present, the topic has speaker-blind-spot flags; surface in the citation aside.

For book citations: if `shared_books` includes a book that's load-bearing for an objection, read `knowledge/books/<book-slug>.md` for its consensus framing. The strongest objections often combine a guest claim with a book's framework (e.g., "Rumelt would call this a 'fluff strategy': it states the desired outcome without identifying the actual obstacle").

### Step 4: Generate ranked objections

Compose 4-8 objections, ranked by severity. Severity = (corpus consensus strength × directness of contradiction with the plan × likely impact if ignored).

For each objection:

- **Claim**: one sentence. Specific. "The plan assumes a virality coefficient > 1, but the corpus consensus is that virality without a retention floor produces vanity growth."
- **Source**: `Guest Name on YYYY-MM-DD ([Episode Title](post_url))`, the same shape topic files use. If the citation comes from an obsolete file, format as `(per obsolete/<slug>.md, retired claim originally from Guest YYYY-MM-DD)`. If from a caution file, format as `(per cautions/<slug>.md, audience pushback)`.
- **Why it applies**: one sentence connecting the claim to the specific text the user shared. Quote the plan when possible. "The plan says 'we'll grow through invitations' but does not name a retention metric, so the strength of the loop is unverifiable."
- **Concrete next step**: what to do before shipping. Examples:
  - "Define a 30-day retention threshold for the target user before increasing acquisition spend; disable the new acquisition channel if it ships below threshold."
  - "Re-run the unit economics with payback ≤ 12 months as the constraint, not LTV/CAC ≥ 3. The corpus consensus per [guest] is that LTV-based math hides cash crunches at this stage."
  - "Start from scratch from the question 'who is the constrained side and what does liquidity for them look like?' before further feature work."
- **Caution flag** (if applicable): `(Note: <guest> has audience-pushback flags around <topic>; see cautions/<slug>.md. The objection above doesn't depend on those flagged claims.)`

Style guidelines:

- **Lead with the strongest objection.** If the plan has a fundamental flaw, the first objection names it directly.
- **Disagree with the plan, not with the user.** "The plan does X" not "you've made the mistake of X."
- **Use the obsolete layer as a sword.** If the plan operates on advice that the corpus has retired (e.g., "the plan's freemium framing matches the 2021 consensus, but obsolete/freemium-vs-trial.md has retired this in favor of trial-with-conversion-step for B2B"), this is usually the strongest objection.
- **Use the caution layer as a flag, not a sword.** Don't suppress useful patterns from caution-flagged speakers; do mention the flag inline.

### Step 5: Pre-ship questions (3-6)

Questions the user should answer before shipping. These are softer than objections; they surface ambiguity rather than disagreement.

For each question:

- The question itself (open-ended, specific).
- The corpus source it came from (same citation format as objections).
- Why it matters in one phrase ("if you can't answer this, the obsolete/<slug>.md decay applies").

Examples:

- "What is the retention floor at which you'd disable the acquisition channel? (Brian Balfour 2024-09-10 on growth loops without a retention floor.)"
- "Which side of the marketplace is the constrained side, and what does liquidity for them look like in your launch city? (Lenny on marketplaces, marketplace-cold-start.md.)"
- "If the AI feature does not show measurable improvement on your top eval after 90 days, what's the kill criterion? (evals-for-ai-products.md; the AI-era consensus is to define kill criteria up front.)"

### Step 6: Prerequisite reading (2-4 items)

Episodes, newsletters, or books worth reading before shipping. Order by which one would change the plan the most if read first.

For each item:

- Title + guest/author + date + URL.
- One-line "why this first" rationale.

Examples:

- "*Good Strategy / Bad Strategy* (Rumelt), chapters 1-3. Read first if the plan reads as a goals-and-aspiration list rather than a kernel (diagnosis + guiding policy + coherent action). The corpus pushes back hardest when 'strategy' = 'wishful outcome'."
- "Brian Balfour on the four-fit framework, Lenny's Podcast 2024-09-10. Read before locking the GTM channel mix."

### Step 7: Optional save

If the user says "save this", "keep this for reference", or similar:

```bash
# Write the pressure-test to:
knowledge/pressure-test/<plan-slug>-<YYYY-MM-DD>.md
```

Use the same frontmatter shape as `knowledge/topics/<slug>.md`:

```yaml
---
pressure_test_slug: <plan-slug>
plan_kind: <kind>
domain: <domain>
company_stage: <stage>
created: <YYYY-MM-DD>
created_by_skill: lenny-pressure-test
sources_consulted: [<topic-slug>, ...]
objection_count: <N>
---
```

Append a one-line reference to the pressure test in `knowledge/CHANGELOG.md` under `## YYYY-MM-DD lenny-pressure-test`.

If the directory `knowledge/pressure-test/` does not exist yet, create it as part of the save.

### Step 8: Auto-update profile + memory + decisions (every invocation, end)

Same as lenny-actualize and lenny-hire. The shared auto-context layer accumulates context across all three skills.

1. **Profile inference patch**: from the plan inputs, derive observations. A user pasting a "GTM plan for B2B SaaS at scale-early" while their active facet is `founder/medtech` reinforces the founder facet and may add a `b2b-saas` interest tag. A user repeatedly pressure-testing strategy docs introduces or reinforces a `strategy-reviewer` facet.
2. **Memory append** (always): `python3 scripts/memory_append.py --skill lenny-pressure-test --input "<one-line>" --facets "<labels>" --surfaced "<topic-slugs-and-files>" --themes "<plan-kind,domain,top-objection-themes>"`.
3. **Decisions append** (when divergence detected): the user pushes back on an objection ("we're going to ship the freemium tier anyway, the corpus is wrong about our case") triggers a decisions entry. Future pressure-test invocations consult this and adjust default emphasis (e.g., next time freemium comes up for this user, lead with the corpus disagreement they already weighed).
4. **Decay sweep periodically** (every ~50 invocations): include `"decay": true` in the profile patch.
5. **Light user-facing aside, occasionally**: same rule as the other skills.

## Hard-won corpus patterns to lean on

These are recurring, well-supported patterns the skill should weave into pressure tests across plan-kinds. The skill does not need to read these patterns from a topic file; they are durable enough to use as priors.

- **Rumelt's kernel** (Good Strategy): a strategy must have (a) a diagnosis of the obstacle, (b) a guiding policy, (c) a coherent set of actions. Plans that name desired outcomes ("we'll be the leader in X") without naming the obstacle are "fluff strategy." Use this lens on any strategy doc.
- **Helmer's 7 Powers**: durable advantage requires one of seven mechanisms (scale economies, network economies, counter-positioning, switching costs, branding, cornered resource, process power). Plans claiming "moat" without naming a mechanism are objection-eligible.
- **Brian Balfour's four-fit**: market, product, channel, model must all fit. GTM plans that lock channel without testing model-fit (e.g., paid acquisition with > 18-month payback) are objection-eligible.
- **Casey Winters / Lenny on retention floors**: virality and acquisition without a retention floor compound vanity. Any growth plan without a stated retention threshold is objection-eligible.
- **Marketplace cold-start (Lenny)**: identify the constrained side (usually supply); achieve atomic-network liquidity in one micro-market before scaling. Marketplace plans that propose national or multi-city launches without naming the constrained side are objection-eligible.
- **Madhavan Ramanujam on willingness-to-pay**: pricing should follow customer research, not cost-plus. Pricing decisions made without willingness-to-pay evidence are objection-eligible.
- **AI-era patterns**:
  - **Evals are not optional.** AI plans without a defined eval system have no kill criteria; the corpus pushes back hard.
  - **AI moats are data + workflow, not models.** Plans claiming AI-as-moat that name only model selection are objection-eligible. The data-as-moat and workflow-lock-in framings are stronger.
  - **Information-mover PM archetype is decaying.** Plans assuming "PM defines, eng builds" workflows are objection-eligible at scale-early or later.

The 2026 update:
- **AI-tooling fluency is now table stakes for builder roles**, but plans that **lock in 100% AI-generated code** carry separate audience-pushback flags (see `cautions/100-percent-claude-code.md`). Surface both: the legacy-archetype objection AND the 100%-claim caution.

## Known gaps in the corpus (call out when relevant)

- **Medtech, fintech, regulated-industry** plans: the corpus is light. Pressure tests on these plans will lean heavily on durable strategic-frame lenses (Rumelt, 7 Powers) and `evaluating-product-bets`, with explicit acknowledgment that domain-specific topics are sparse.
- **Hardware, biotech, deep tech**: corpus essentially silent. Note the gap; produce a framework-only pressure test.
- **Compliance / regulatory readiness** as a plan dimension: not directly covered. Cross-reference `evaluating-product-bets` and surface as an open question rather than an objection.
- **Compensation / pricing for regulated buyers**: pricing topics are written for SaaS / consumer; transfer carefully.
- **Crisis communication / incident-driven decisions**: not directly covered. The skill should note the gap and offer general framing.

When a known gap applies, surface it in the response (one line: "Corpus is light on regulated-industry plans; objections below lean on Rumelt + 7 Powers as durable lenses"); don't silently produce hand-wavy advice.

## Hand-off to other skills

- **Hiring-shaped plans**: recommend `lenny-hire` for question scripts and signal probes. Pressure-test the strategic framing only ("is now the right time to hire?", "is this the right role?", "is the comp band defensible?").
- **Plans built on retired advice**: recommend running `lenny-actualize verify <topic>` to confirm the obsolete file is current before shipping the objection. Rare; only when the user explicitly asks how confident the obsolete file is.
- **Plans that surface a topic gap**: note that the corpus would benefit from a topic file and suggest `lenny-actualize topic <slug>`. Do not block on it.

## Portability

To use lenny-pressure-test on another expert-interview corpus:
1. The corpus must already be processed by lenny-actualize (or an equivalent skill that produces `knowledge/topics/<slug>.md` files in the same shape).
2. Adapt `references/pressure_test_topic_map.yml` to the new corpus's topic taxonomy and the strategic frames the corpus is best at (Rumelt + Helmer + Balfour are Lenny-native; another corpus might lead with different durable lenses).
3. The Step 1 / Step 4 logic is corpus-agnostic.
