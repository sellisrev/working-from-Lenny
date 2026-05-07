---
topic_slug: ai-coding-agents-cautions
display_name: AI-coding-agent claims at face value
last_updated: 2026-05-07
last_model: claude-opus-4-7
---

# Caution: AI-coding-agent claims to treat with skepticism

## Boris Cherny "100% of my code is written by Claude Code" + "use as many tokens as possible"

- **Claim summary**: Boris Cherny (Anthropic, Claude Code creator) opens his Lenny episode with "100% of my code is written by Claude Code. I have not edited a single line by hand since November. Every day, I ship 10, 20, 30 pull requests... I have, like, five agents running." Reinforced with framings encouraging "use as many tokens as possible."
- **Said by**: Boris Cherny (Anthropic), Lenny's Podcast, episode dated 2026-02-19. YouTube ID `We7BZVKbCVw`.
- **Audience pushback (top comments by likes — extraordinarily high signal)**:
  - **691 votes**: "'I haven't edited any single line by hand', I imagine this guy prompts look like: 'Claude please change this variable name for a to b'." — @Famouzi
  - **673 votes**: "the advice: 'use as many tokens as possible' from an Anthropic employee is hilarious 🤣" — @vityasinkov
  - **428 votes**: "Stopped writing code, started write tons of prompts and md files. Seems legit." — @davidbasil3161
  - **211 votes**: "Ah yes, 'by the end of the year' again. Starting to feel like Groundhog Day." — @jacksonholidaywheeler (calling out the recurring "AI will do X by end of year" framing)
  - **192 votes**: "Marketing interview versus comments... comments win every fucking time." — @ChaseElliottBand
  - **100 votes**: "I spent a week to re-read The Mythical Man-Month. If Mr. Brooks was alive, he would write a new edition: The Mythical Agent-Month." — @minghuiyu2073 (substantive engineering-history critique)

- **Why this is flagged as a caution** (not just disagreement):
  - **Conflict of interest**: Boris Cherny works at Anthropic, the company that bills for Claude Code tokens. "Use as many tokens as possible" is a self-serving prescription. The 673-vote comment captures this directly.
  - **Selection bias**: 100% Claude-Code-written code with no manual edits is plausible for a senior Anthropic engineer with full-time AI use, free API access (cf. 87-vote comment on `julbw1JuAz0` about "free api usage" being a perk at Anthropic), and a context that allows multiple parallel agents. Generalizing this to engineers in non-Anthropic contexts (with API costs, mixed-quality codebases, regulated domains) is unsafe.
  - **Productivity claim conflict**: the 195-vote top comment on the related Cat Wu episode (`PplmzlgE0kg`) — "Anthropic shipped their .map file too. They truly ship fast" — flags the Claude Code source code leak as an indictment of the claimed velocity. The 129-vote comment ("seeing a detriment to speed in terms of product quality. I am not sure speed matters anymore") is substantive engineering critique.
  - **The "ship 10-30 PRs/day" claim** isn't a sustainable engineering pattern in most contexts. PR review at that volume requires either trivial PRs or under-staffed review processes; both produce quality decay over time.
  - **Survivorship-and-context bias**: similar pattern to Keith Rabois "no days off" and Matt MacInnis "soul crushing... by design" — a person whose context is unusual prescribes their context as the model.

- **Where (if anywhere) the claim might still apply**:
  - **At Anthropic itself** with Anthropic's tooling, infrastructure, free-API access, and AI-native culture: Boris Cherny's workflow may be reproducible for Anthropic engineers. Generalizing outside Anthropic is the unsafe leap.
  - **For specific narrow workflows** (greenfield projects, rapid prototyping, internal tools): high-percentage AI-written code is increasingly normal. The "100% with no manual edits" framing is the part that's least generalizable.
  - **For experienced senior engineers with strong code review hygiene + skill repositories + telemetry**: the 2x velocity gains documented at Intercom (cf. [ai-developer-productivity](../topics/ai-developer-productivity.md), Brian Scanlan How I AI episode 2026-04-20) are real. The framing should be "we 2x'd merged-PR throughput" (Intercom) rather than "100% of my code" (Boris Cherny).

- **Cross-checks**:
  - Same-corpus contrasts: Brian Scanlan / Intercom (cf. [ai-developer-productivity](../topics/ai-developer-productivity.md)) reports a careful 2x throughput claim with measured quality alongside, code-review hooks, telemetry, and specific operational discipline. That's the responsible version of the claim. Boris Cherny's framing is the unconstrained version.
  - Other Anthropic voices (Cat Wu, [How Anthropic's product team moves faster](https://www.lennysnewsletter.com/p/how-anthropic-product-team-moves-faster), 2026-04-23) are more measured: "ship in research preview within 1-2 weeks" with dogfooding and clear cross-functional process. Cat Wu's episode produced the related caution-eligible 195-vote critique on Anthropic-PR-saturation, suggesting audience is sensitive to the recurring Anthropic-as-aspiration framing.
  - External: software-engineering literature on PR-review-quality + code-review-velocity tradeoffs is extensive. *The Mythical Man-Month* (Brooks) is the canonical reference cited by the 100-vote top comment.

- **Confidence level**: **very high** — the audience pushback is unprecedented in this corpus (691 + 673 + 428 + 211-vote critical comments, all substantive). Combined with Anthropic's own conflict of interest and the corpus counter-voice (Brian Scanlan / Intercom) showing the responsible version of the claim, this is the strongest caution-eligible signal documented to date.

## How this section was generated

- **Source comments**: `<corpus>/05-comments/We7BZVKbCVw.json` (Boris Cherny / Anthropic episode) plus `PplmzlgE0kg.json` (Cat Wu) and `julbw1JuAz0.json` (related Anthropic content). Top comments at 691, 673, 428, 211, 195, 129 votes.
- **Top comment threshold**: surfaced when at least one comment with >= 100 votes substantively disputes the claim AND the dispute makes a specific argument (conflict-of-interest, factual contradiction, cited counter-evidence, or context-bias diagnosis). The Boris Cherny case far exceeds this bar.
- **LLM screening**: kept comments that articulate substantive disagreement; excluded humor-only / single-word reactions.
- **The reader should still apply their own judgment**; this is a heuristic flag, not a verdict. Boris Cherny is the creator of Claude Code and his technical credibility is strong; the flagged claims are flagged for being unsafe to generalize, not for being categorically wrong inside Anthropic's specific context.

## Cross-reference

This caution applies to multiple corpus topics:
- [`ai-coding-agents`](../topics/ai-coding-agents.md) — AI-coding-agent claims at face value need calibration.
- [`vibe-coding`](../topics/vibe-coding.md) — generalization caveats.
- [`ai-developer-productivity`](../topics/ai-developer-productivity.md) — Intercom is the responsible-claim counter-voice.
- [`ai-pm-skills`](../topics/ai-pm-skills.md) — productivity claims affect what skills PMs should bet on developing.
