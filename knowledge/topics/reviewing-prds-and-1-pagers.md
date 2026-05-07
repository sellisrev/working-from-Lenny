---
topic_slug: reviewing-prds-and-1-pagers
display_name: Reviewing PRDs, 1-pagers, and product strategy docs as a non-PM
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2021-08-31 .. 2026-04-23
---

# Reviewing PRDs, 1-pagers, and product strategy docs as a non-PM

For engineers, designers, sales / GTM leads, finance / ops leads, execs, and board members reviewing product documents written by PMs.

## Current consensus

A good PRD or 1-pager has five elements (Lenny, 2021, durable in 2026). Use these as your review checklist.

1. **Problem-oriented.** The problem is crystallized in a few strong sentences near the top. If you can't restate the problem in one sentence after reading the doc, the doc is failing here.
2. **Clear success criteria.** Specifically defined success: how do we know if it shipped successfully? Quantitative where possible (target metric), qualitative where necessary (user behavior change). If you can't tell whether this would be a win, push back.
3. **Just enough direction.** Engineers and designers should have enough constraint to align without their creativity being eliminated. PRDs that read like specs of every UI element / API contract are usually too prescriptive (cf. [spotting-bad-pm-behaviors](spotting-bad-pm-behaviors.md) — "Dictator" pattern).
4. **Urgency.** Proposed timeline to review, align, build, ship. Without this, the document drifts.
5. **Short and sweet.** A 1-pager is one page for a reason. If it's 30 pages, it's mostly defending against attack rather than communicating.

The 2026 update (Cat Wu / Anthropic):

- **PRDs are now lightweight.** "Clear goal, clear user, top use cases" — not heavyweight specs. The detailed-spec PRD has been retired at AI-native companies. If you're reviewing a 30-page PRD in 2026, the document is probably wrong before you start critiquing the content.
- **Prototypes substitute for spec text.** A clickable mock or vibe-coded prototype attached to the doc is now standard. Reviewing without checking the prototype is reviewing half the artifact.
- **Eval criteria are now part of the PRD for AI features.** What does success look like, and how is it measured? Cf. [evals-for-ai-products](evals-for-ai-products.md).

## What this means for non-PM consumers reviewing these documents

### As an engineer or eng lead

- **Insist on the problem statement.** If you don't believe the problem, no amount of engineering will fix the resulting product.
- **Push back on overly-detailed specs.** Engineers should have room to choose implementation. If the PM has specified the data model and API contract, ask "is this the spec or the suggestion?"
- **Demand effort calibration.** A PRD that has no sense of effort estimation will set false expectations. Ask: "Have you talked to engineering about the cost of this?"
- **Look for unnecessary scope.** PRDs often grow during review. Push for cuts; defer to v2 anything that doesn't move the success metric.

### As a designer or design lead

- **Check the problem against UX reality.** Does the problem statement match the user research? If the PM cites research, ask to see it.
- **Ensure you have UX latitude.** A spec that pre-determines the design path forfeits design value. If you're handed a PRD with screenshots that aren't yours, push back.
- **Insist on a prototype review** before the PRD is "approved." A prototype reveals problems text won't.

### As a sales / GTM lead

- **Check whether the spec serves your sales pipeline or the broader user need.** Both can be valid; alignment is required either way. PRDs that explicitly mention a deal often serve a single customer, not the broader market — sometimes correct (early-stage land-and-expand) but usually flag-worthy.
- **Ask about pricing and packaging.** A PRD without a pricing/packaging story is incomplete for any feature that ships to paying customers.

### As a finance / ops lead

- **Look for cost assumptions.** What does this feature cost per user / per call? Particularly for AI features (cf. [ai-pricing](ai-pricing.md)).
- **Ask about ROI.** Does the doc connect the success metric to revenue, retention, or cost? If not, push for it.

### As an exec or board member

- **The strategic context belongs at the top.** If you have to read three pages before understanding why this matters, the doc is failing.
- **Be wary of the "we have to ship X" framing.** Asks framed as inevitabilities usually lack rigorous tradeoff thinking. Push back: "Why this and not Y?"
- **Insist on what the team is *not* doing.** A PRD without explicit non-goals is incomplete; you'll invariably discover the team has scope-crept downstream.

### Universal red flags across all roles

- **No customer mentioned.** A PRD that doesn't ground in a user need is reactive (sales-driven, exec-driven) — sometimes correct, more often wrong.
- **No success metric.** "We'll see if it's good after we ship" is failure-mode pre-baked.
- **Vague timeline.** "Sometime this quarter" is not a timeline.
- **Excessive feature list.** If the PRD lists 12 things to ship, it's a roadmap, not a 1-pager.
- **No mention of what was cut from scope.** Suggests scope hasn't been confronted yet.
- **No author or single-owner.** Multi-author PRDs without a single accountable owner often die in committee.

## How thinking has evolved

Earliest takes:

- **2021-08-31**: Lenny — "Examples and templates of 1-pagers and PRDs." Foundational doc, includes Lyft Lost and Found example, Coda templates, etc. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/examples-and-templates-of-1-pagers-and-prds))

- **2022-2023**: corpus expands the canon: Marty Cagan / SVPG, Brandon Chu (Shopify) on writing as a PM craft.

- **2024-09-15**: Camille Fournier — engineer-side critique of detail-dismissive PRDs.

Recent takes:

- **2026-04-23**: Cat Wu — Anthropic's lightweight PRD model. Goal + user + top use cases. Research preview within 1-2 weeks; iteration replaces upfront specification.

- **2025-09-29**: Ravi Mehta — "start with JSON, not design" applies to PRDs too: data-model-first PRDs survive UI iteration better than UI-first PRDs.

External current consensus (web, weighted recent + AI-aware):

- Reforge's PRD framework, Coda's "Writing your way to a 1-pager," Brandon Chu's [The Black Box of PM](https://blackboxofpm.com/) blog all align on the brief problem-then-context-then-success structure.
- AI-era addition: prototypes attached to PRDs are now industry-standard.

## Inflection points

- **Lenny's 2021 piece**: codified the modern 1-pager structure for the corpus.
- **Move from PRDs-as-defense-documents to PRDs-as-communication-documents (2022-2024)**: as Empowered teams replaced spec-driven teams, PRDs got shorter.
- **AI-prototyping ubiquity (2025-2026)**: prototypes substitute for spec text; PRDs further shrink.

## Open questions

- For regulated industries (medical devices, financial services, defense): how much PRD detail is required as compliance artifact vs. communication artifact? Corpus has not addressed.
- Is the "30-page PRD" ever right? Possibly for new platform / very large initiatives — but most orgs over-document.
- For AI features specifically: where does the eval suite live relative to the PRD? Some teams keep them separate; some include eval criteria in the PRD. Pre-consensus.

## See also

- Related topics: `prds-and-1-pagers` (PM-side authoring), `roadmaps`, `evaluating-product-bets`, `ai-prototyping`, `evals-for-ai-products`, `working-with-pms-as-engineer`, `assessing-product-strategy-as-board`, `spotting-bad-pm-behaviors`, `defending-big-bets`.
- Books: none directly applicable; Brandon Chu's [The Black Box of PM](https://blackboxofpm.com/) and Marty Cagan's [Empowered](https://www.amazon.com/EMPOWERED-Ordinary-Extraordinary-Products-Silicon/dp/111969129X) are useful adjacent reading.
