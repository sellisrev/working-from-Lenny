---
topic_slug: ai-replacing-pms
display_name: How AI is changing or replacing the PM role
last_updated: 2026-05-07
last_model: claude-opus-4-7
---

# Obsolete advice: How AI is changing or replacing the PM role

## "Hard skills (coding, design, writing) are safe; soft skills (leadership, strategy) are at risk"

- **Claim**: April 2024 Lenny audience poll showed audience expectation: hard skills survive, soft skills replaced.
- **Originally said by**: implicit consensus in the Lenny Twitter/LinkedIn audience as polled in [How AI will impact product management](https://www.lennysnewsletter.com/p/how-ai-will-impact-product-management), 2024-04-09.
- **Why obsolete**: Lenny himself argued the opposite in the same piece, and by 2025-02 Karina Nguyen (OpenAI) had confirmed his framing from the inside of a frontier lab: "AI is actually really good at [hard skills] because it's taking a bunch of data, synthesizing it." By 2026, the "hard skills" position is widely treated as inverted: code generation is cheap, judgment is expensive (Cat Wu, Nikhyl Singhal v2).
- **Where it may still apply**:
  - In organizations where PMs have very limited technical context, hard-skill development is still personally valuable for the PM (it broadens their range, even if not for AI-replacement reasons).
  - For *junior* skill development: writing PRDs by hand is still a useful learning exercise even if AI can do it faster.
- **Replaced by**: see [Current consensus](../topics/ai-replacing-pms.md#current-consensus).
- **Confidence in retirement**: high — multi-source recency.

## "PMs need to learn to work with AI" (framed as still optional)

- **Claim**: Implied by 2024 framing that PMs who adapt will be fine. Suggested AI use was a competitive advantage rather than table stakes.
- **Originally said by**: Lenny, "Why PMs are best positioned to thrive in an AI world," 2024.
- **Why obsolete**: By 2026, AI use is table stakes, not advantage. Aparna Chennapragada: "If you aren't prototyping with AI, you're doing it wrong." Brian Scanlan (Intercom): "100% of engineers, designers, PMs, TPMs" using Claude Code. Nikhyl Singhal: massive shedding will favor "AI first" hires.
- **Where it may still apply**:
  - In conservative enterprises (regulated industries, very large legacy companies) where AI tooling adoption lags, the "learning to use AI" pitch is still novel-positioning and still works.
- **Replaced by**: see [Current consensus](../topics/ai-replacing-pms.md#current-consensus). The framing shifted from "use AI to thrive" to "use AI or be the 30k that get shed."
- **Confidence in retirement**: high.

## "Information-mover PM is a viable archetype"

- **Claim**: For most of the corpus's history, "PM as orchestrator who translates between functions and owns the roadmap" was a recognized, hireable archetype (one of the [archetypes Singhal had previously discussed](https://www.lennysnewsletter.com/p/building-a-long-and-meaningful-career-nikhyl)).
- **Originally said by**: Nikhyl Singhal v1 (2023-06-11), among others; widely held in 2018-2024 corpus.
- **Why obsolete**: Nikhyl Singhal himself updated his stance in v2 (2026-04-19): "The information mover is essentially going to become a dinosaur." Same speaker, three-year gap, explicit reversal. Canonical inflection-point evidence.
- **Where it may still apply**:
  - At companies with deep cross-org coordination needs (large public-company-stage or regulated environments) where the PM's translator role is genuinely load-bearing on outcomes other functions can't do.
  - For PM teams whose orchestration includes high-context human judgment (compliance, regulatory, multi-party negotiations) that is not yet routinely AI-assisted.
- **Replaced by**: "Builder PM" archetype + "AI-first orchestration via agents" model; see [Current consensus](../topics/ai-replacing-pms.md#current-consensus).
- **Confidence in retirement**: high — same-guest reversal across episodes is the strongest available signal.

## Community skill packs that may need updating

`find_external_overlap.py --topic ai-replacing-pms` returns no community repos that have explicitly tagged this topic. Likely-affected packs:

- [RefoundAI/lenny-skills](https://github.com/RefoundAI/lenny-skills) and [qingxuantang/Lennys-to-sop-and-skills](https://github.com/qingxuantang/Lennys-to-sop-and-skills) likely contain career-advice skills extracted from pre-2026 episodes that assume the "information mover" archetype is viable. Maintainers should review whether their PM career skills explicitly include the bifurcation framing or still assume the archetype is hireable.
- [arjunlall/lenny-for-claude](https://github.com/arjunlall/lenny-for-claude) — semantic search over the corpus may surface 2024-04 "hard skills are safe" content alongside 2026-04 "PM is dead" content with no temporal weighting. Recommend confirming date-weighted ranking in plan-mode hooks.
