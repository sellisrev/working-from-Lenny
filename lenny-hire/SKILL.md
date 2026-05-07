---
name: lenny-hire
description: Produce a scenario-specific hiring playbook drawn from the Lenny corpus knowledge base. Inputs: role being hired (PM, eng-manager, founder, sales-leader, designer, data-leader), level, signals to test, candidate context, current concern. Output: a playbook with what-good-looks-like, signals to probe, common failure modes, attributed question scripts, and references. Reads `knowledge/topics/`, `knowledge/cautions/`, `knowledge/obsolete/`, `knowledge/books/`. Use when the user asks for help "hiring a <role>", "interviewing for <role>", "how to evaluate a <role> candidate", "should I hire <X>", or any scenario-specific hiring question.
---

# lenny-hire

Composes a scenario-specific hiring playbook from the corpus knowledge base. Companion skill to `lenny-actualize` (which builds and refreshes the knowledge base). lenny-hire **consumes** the knowledge — it does not extract new claims or add to the knowledge base directly.

## Why this exists

Hiring advice in the Lenny corpus is scattered across ~10 topic files (hiring-early-team, pm-interviews, hiring-pms-as-non-pm, when-to-hire-first-pm, pm-promotion, becoming-senior-pm, work-trial-interviews, hiring-for-growth, plus role-specific working-with-pms-as-* files), several books (Inspired, Working Backwards), and a meaningful caution layer (Keith Rabois, Matt MacInnis claims). A user asking "how should I hire a senior PM at a scale-early B2B SaaS company who's worried about AI fluency?" would otherwise have to read all of these files, mentally filter for their scenario, and synthesize.

This skill does that synthesis on demand, attributing every recommendation to a corpus source.

## Tone and depth (applies to every invocation)

Same principle as lenny-actualize: no mandatory gates, no quick/full toggle, no refuse-on-thin-input.

For a **specific** scenario (role + level + concrete concern), produce a full playbook (sections below).

For a **vague** ask ("what about hiring?", "interviewing tips?", "should I hire someone?"):

1. Pick the most likely interpretation, name it in one sentence ("Reading this as a question about first-time PM hiring at scale-early B2B SaaS"), and produce a **compact** answer — typically 5-10 sentences with 2-4 citations and a 3-bullet "what to probe."
2. List 2-4 suggested extensions ("- you might also want: a question script for the technical bar", "- alternatively, are you asking about *retention*, not hiring?", "- want me to also surface common failure modes for this role?").

Multi-facet output: if the active profile carries ≥2 facets with weight ≥0.5 plausibly relevant (e.g., the user is both a `founder` and a `gtm-advisor` and is hiring an AE), answer through both lenses concisely rather than picking one.

Never refuse on thin input. If genuinely ambiguous, ask one short clarifying question alongside (not instead of) the compact-answer-on-most-likely interpretation.

## Inputs (all optional; defaults applied where missing)

The agent parses these from the user's message. They may be partial.

- **role**: pm | eng-manager | founder | sales-leader | designer | data-leader | other
- **level**: junior | mid | senior | director | exec | first-hire (for sales) | first-time (for founder)
- **company_stage**: 0-1 | 0-1-pmf | scale-early | scale-late | public — default to active profile's most-relevant facet's `company_stage`
- **domain**: b2b-saas | consumer | marketplace | fintech | devtools | infra | ai-product | medtech | enterprise — default to active profile facet's `domain`
- **signals**: free-text list of competencies the user wants to probe (e.g., "judgment under uncertainty, AI fluency, founder-mode hunger"). If omitted, the agent infers a sensible default set from role + level + corpus.
- **candidate_context**: optional notes about the candidate (e.g., "ex-FAANG, 8 years PM experience, only worked at scale-late companies"). Used to tailor question scripts.
- **current_concern**: the specific worry the user has (e.g., "I'm afraid they're a great resume but won't ship in the AI era"). Used to weight the "common failure modes" and "signals to probe" sections.

If the role is omitted but other context is rich enough to infer one, the agent infers and announces the assumption ("Reading this as eng-manager hiring at scale-early infra").

## Outputs

The default output is **conversational** — a playbook delivered in the response. The user can ask "save this" to persist a copy at `knowledge/hire/<role>-<level>-<scenario-slug>-<YYYY-MM-DD>.md` for later reference. This is opt-in; the skill doesn't write files unless asked.

**Playbook structure** (sections; can be compressed to 1-3 lines each for vague-input mode):

1. **Scenario summary** — one paragraph. State assumptions inferred from context. Name the active profile facets if multi-lens.
2. **What good looks like for this role/level/stage/domain** — 4-7 bullets, each citing a corpus source by guest + date + filename or post URL. Lead with durable principles, then the AI-era overlay.
3. **Signals to probe (and how)** — table or list. For each signal: a sentence on what good looks like, plus a concrete probe (interview question, take-home, work-trial, reference question). Cite sources where the probe pattern came from a guest.
4. **Common failure modes** — 3-5 bullets. Pull from `knowledge/cautions/`, `knowledge/obsolete/`, and repeat-guest patterns. If the user's `current_concern` matches a known failure mode, lead with it.
5. **Question scripts** — 4-8 verbatim or close-paraphrased questions, attributed to corpus sources. Include 1-2 that test for the user's specific `current_concern`.
6. **References** — flat list of episodes, newsletters, and books cited in the playbook above. Use the same citation format as `knowledge/topics/<slug>.md` files (guest + date + post_url where available).

## Workflow

### Step 0: Read scaffolding (always, cheap)

Read:
- `references/hiring_topic_map.yml` — the role-to-topic-files routing
- `references/topics.yml` — to know what topic slugs exist
- `references/books.yml` — for book citations

If any are missing, fall back to scanning `knowledge/topics/` filenames directly.

### Step 0.5: Auto-context (every invocation, silent)

Run the same auto-context steps as lenny-actualize. This is the shared layer; the user has one profile / memory / decisions across all skills.

1. Run `python3 scripts/process_drop.py --corpus <path>` (silently — only mention the count if files were processed).
2. Read `<corpus>/_state.json`. If `last_lennysdata_pull` is null or older than 14 days AND `last_reminder_shown` is null or older than 7 days, surface the one-line reminder. Then update `last_reminder_shown`.
3. Run `python3 scripts/profile_load.py` and use the active facets to shape output.
4. Read recent memory (`<home>/.lenny-actualize/memory/default.md`, last ~20 entries) and decisions (`<home>/.lenny-actualize/decisions/default.md`, last ~10) for context. Look especially for prior hiring-related invocations and any decisions whose outcomes the user may now be reporting.

### Step 1: Parse the scenario

From the user's input, extract `role`, `level`, `company_stage`, `domain`, `signals`, `candidate_context`, `current_concern`. Where missing:

- Use defaults from the active profile's most-relevant facet (e.g., facet's `domain` and `company_stage`).
- Infer from candidate context if present (e.g., "8 years PM experience" → senior level).
- If still missing and the field matters for the playbook (typically just `role`), pick the most plausible interpretation and name the assumption.

Never block on missing input. Produce something useful.

### Step 2: Look up relevant topic files

Build the topic-file list from `hiring_topic_map.yml`:

1. Start with `shared_baseline` (always considered).
2. Add `role_to_topics[<role>].primary`.
3. Add `role_to_topics[<role>].by_level[<level>]` if a match exists.
4. Add `role_to_topics[<role>].domain_specific[<domain>]` if a match exists.
5. If the company_stage is `scale-early` or later, OR the domain is `ai-product`, OR the user mentioned AI in their input, add `ai_era_overlay.topics`, `ai_era_overlay.cautions`, `ai_era_overlay.obsolete`.
6. For each item in the user's `current_concern` (or inferred concerns), apply `concern_to_topics` lookups and merge.

The resulting list is typically 4-8 topic slugs. Cap at 12 to keep token budget reasonable.

### Step 3: Read the topic files (lazy, only what's needed)

For each slug, read `knowledge/topics/<slug>.md` directly. The file is already a synthesis — no need to re-extract claims.

For each topic, also check:
- `knowledge/obsolete/<slug>.md` — if present, the topic has decay; surface that in "Common failure modes".
- `knowledge/cautions/<slug>.md` — if present, the topic has speaker-blind-spot flags; surface that in "Common failure modes" with explicit attribution.

For book citations: if `shared_books` or domain-specific recommendations include a book, read `knowledge/books/<book-slug>.md` for its consensus key insights and use them as supporting citations. If the book digest doesn't exist yet and the book matters for this scenario, note "Inspired by Cagan is referenced in `references/books.yml` but no per-book digest exists yet — consider running lenny-actualize book inspired."

### Step 4: Synthesize the playbook

Compose the playbook per the **Outputs** section above. Style guidelines:

- **Lead with durable principles**, then the AI-era overlay. The "barrels vs. ammunition" framing, "network is the highest-leverage early channel", and "best talent wants to work with best talent" patterns hold across roles and stages.
- **Cite specifically.** "Keith Rabois on the 30-day feedback loop ([2026-04-12 Lenny's Podcast](URL))" beats "research suggests…".
- **Surface cautions explicitly.** When citing a guest who has an active caution file (Keith Rabois, Matt MacInnis, Boris Cherny), include a one-line aside: "(Note: Rabois's broader claims about hours-worked have audience-pushback flags — see `cautions/ai-replacing-pms.md`. The 30-day feedback-loop pattern itself is uncontroversial and well-supported.)" Trust the reader; don't suppress useful patterns to avoid mentioning the speaker.
- **Question scripts must be specific.** "Tell me about a time you shipped something hard" is corpus-generic. "Walk me through the last prototype you vibe-coded — how long did it take, what got cut?" is scenario-specific.
- **Attribute failure modes.** "Hiring an information-mover PM in 2026" comes from Singhal 2026-04-19. "Soul-crushing-by-design" comes from Matt MacInnis (caution-flagged).

### Step 5: Multi-facet weave (when applicable)

If two facets in the active profile are weight ≥0.5 and both plausibly apply (e.g., user is `founder` and `gtm-advisor` and asking about an AE hire), produce **two short paragraphs** at the top of the playbook:

> _As a founder hiring this AE_: [paragraph]
>
> _As a GTM advisor scoping this hire_: [paragraph]

Then proceed with the unified playbook below. Do not duplicate the rest of the sections.

### Step 6: Optional save

If the user says "save this", "keep this for reference", or similar:

```bash
# Write the playbook to:
knowledge/hire/<role>-<level>-<scenario-slug>-<YYYY-MM-DD>.md
```

Use the same frontmatter shape as `knowledge/topics/<slug>.md`:

```yaml
---
playbook_slug: <role>-<level>-<scenario-slug>
role: <role>
level: <level>
company_stage: <stage>
domain: <domain>
created: <YYYY-MM-DD>
created_by_skill: lenny-hire
sources_consulted: [<topic-slug>, ...]
---
```

Append a one-line reference to the playbook in `knowledge/CHANGELOG.md` under `## YYYY-MM-DD lenny-hire`.

### Step 8: Auto-update profile + memory + decisions (every invocation, end)

Same as lenny-actualize. The shared auto-context layer accumulates context across both skills.

1. **Profile inference patch**: from the scenario inputs, derive observations. A user asking about "hiring a senior PM" while their active facet is `founder/medtech` reinforces that facet. A user asking about "advising a portfolio company on hiring" with no existing `gtm-advisor` facet introduces a new one at weight 0.2.
2. **Memory append** (always): `python3 scripts/memory_append.py --skill lenny-hire --input "<one-line>" --facets "<labels>" --surfaced "<topic-slugs-and-files>" --themes "<hiring,role-X,level-Y>"`.
3. **Decisions append** (when divergence detected): the user pushes back on a recommendation ("I'm going to skip the work trial — too much friction") → write a decisions entry. Future hiring invocations consult this and adjust default recommendations.
4. **Decay sweep periodically** (every ~50 invocations): include `"decay": true` in the profile patch.
5. **Light user-facing aside, occasionally**: same rule as lenny-actualize.

## Hard-won corpus patterns to lean on

These are recurring, well-supported patterns the skill should weave into playbooks across roles. Source: `knowledge/topics/hiring-early-team.md` and adjacent files.

- **Network beats inbound** for hires 1-10. Cite: Siqi Chen (Runway), Keith Rabois (PayPal era).
- **Recruiting is pitching, not sales.** Custom decks, scenario maps, full risk transparency. Cite: Reed McGinley-Stempel (Stytch), Brandon Hill (Vori).
- **Quality compounds; lowering the bar damages durably.** Cite: Nick Handel (Transform), Siqi Chen, Julianna Lamb (Stytch).
- **Define values first** so you can hire for them. Cite: Nick Handel.
- **References scale beyond what most teams do.** 20 references for senior hires (Tony Xu, DoorDash). Frame: "Is X capable of being world-class?" not "Did X do well?"
- **30-day "would I hire again?" check** ≈ as accurate as 1-2 year judgment. Cite: Keith Rabois (caveat with caution flags).
- **Barrels vs. ammunition** (Vinod Khosla via Rabois). Most companies have 2-3 barrels; ammunition without barrels increases coordination tax.
- **Founder-led sales until first AE** — typically $300-500k ARR. Cite: Lenny B2B series part 6.

The 2026 update:
- **AI-tooling fluency is now table stakes for builder roles.** "Have you shipped something you vibe-coded?" > "Have you written a PRD?" Cite: Singhal 2026-04-19, ai-replacing-pms.md, vibe-coding.md.
- **Information-mover archetype is decaying fast.** Builder archetype is the AI-era hire. Conservative companies that don't update their rubric over-index on legacy proxies and miss the strongest candidates.

## Known gaps in the corpus (call out when relevant)

- **Remote-vs-onsite hiring patterns**: corpus is light. If user asks specifically about remote hiring, note the gap and offer general framing only.
- **Diversity/inclusion in hiring rubrics**: corpus is light. Same handling.
- **Compensation negotiation specifics**: covered shallowly in `pm-which-companies.md` and B2B series part 6 (sales comp); deeper treatment may not exist.
- **First-time hiring manager training**: corpus has scattered references but no dedicated topic file. Consider running `lenny-actualize topic first-time-hiring-manager` if this comes up repeatedly.

When a known gap applies, surface it in the playbook (one line — "Corpus is light on remote hiring patterns; recommendations below are general"), don't silently produce hand-wavy advice.

## Portability

To use lenny-hire on another expert-interview corpus:
1. The corpus must already be processed by lenny-actualize (or an equivalent skill that produces `knowledge/topics/<slug>.md` files in the same shape).
2. Adapt `references/hiring_topic_map.yml` to the new corpus's topic taxonomy.
3. The Step 1 / Step 4 logic is corpus-agnostic.
