---
topic_slug: prds-and-1-pagers
display_name: PRDs and 1-pagers (authoring)
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 3
date_range_processed: 2021 .. 2026-04
---

# PRDs and 1-pagers (authoring)

## Current consensus

For the reviewer side, see [reviewing-prds-and-1-pagers](reviewing-prds-and-1-pagers.md). This is the author's view.

### The five elements of a great 1-pager (Lenny 2021, durable)
1. **Problem-oriented.** Crystallize the problem in a few strong sentences near the top.
2. **Clear success criteria.** Specifically defined success.
3. **Just enough direction.** Constraints + guidance without eliminating engineering / design creativity.
4. **Urgency.** Clear timeline.
5. **Short and sweet.** A 1-pager is one page for a reason.

### The 2026 update (Cat Wu / Anthropic)
- **Lightweight: clear goal + clear user + top use cases.** Not 30-page heavyweight specs.
- **Prototype attached.** Increasingly standard — clickable mock or vibe-coded demo as part of the artifact.
- **Eval criteria for AI features.** What does success look like? How is it measured? Cf. [evals-for-ai-products](evals-for-ai-products.md).

### The Amazon counter (6-page narrative)
- **Working Backwards canon (cf. [working-backwards](../books/working-backwards.md)):** detailed prose document; 30 minutes silent reading at the start of meetings.
- Fits Amazon's culture; doesn't fit every company. Pick the format to fit decision weight + culture.

### Authoring discipline
- **Draft → socialize 1:1 → revise → distribute.** Documents that surprise stakeholders die.
- **Cite evidence.** Customer quotes, data, prior art.
- **Acknowledge what you're cutting.** Explicit non-goals.
- **Invite challenge.** Make it easy to disagree with you in the doc.

### Common failure modes
- **Specifying the design.** Engineers and designers should have UX latitude.
- **Burying the goal.** First sentence should make the goal obvious.
- **Defending against attack.** Documents written to prevent criticism rather than to communicate are too long.
- **Over-elaborate templates.** A great 1-pager > a perfect template.

### What's changed in 2025-2026
- **AI tooling generates first drafts in seconds.** Don't ship the AI draft; revise heavily. The PM's craft is in the revision and the reasoning, not the prose.
- **Prototype + 1-pager > 1-pager alone.** Cf. Aparna Chennapragada / Cat Wu — prototypes carry conviction text can't.

## What this means for non-PM consumers

- **If you're an engineer or designer**: a great 1-pager is a gift; demand them. Push back on multi-page specs.
- **If you're a hiring manager evaluating PM candidates**: ask for an example PRD or 1-pager. Quality is highly diagnostic.
- **If you're an exec reviewing PRDs**: the structure tells you about the team's discipline. Bullet-list features without problem framing reveals the team isn't doing the upstream work.

## How thinking has evolved

- **2021**: Lenny "Examples and templates of 1-Pagers and PRDs" — foundational corpus piece.
- **2022-2024**: Brandon Chu (Shopify) on writing as PM craft.
- **2026-04**: Cat Wu (Anthropic) — modern lightweight PRD model.

## See also

- Related topics: `reviewing-prds-and-1-pagers` (reviewer side), `roadmaps`, `mission-vision-strategy`, `product-strategy`, `evals-for-ai-products`, `ai-prototyping`.
- Books: [Working Backwards](../books/working-backwards.md) (Carr & Bryar) — Amazon's 6-page narrative.
