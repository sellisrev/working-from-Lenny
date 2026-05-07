---
topic_slug: ai-developer-productivity
display_name: Measuring AI developer productivity
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 4
date_range_processed: 2025-10-19 .. 2026-04-20
---

# Measuring AI developer productivity

## Current consensus

The DORA + SPACE frameworks (Nicole Forsgren, codified in *Accelerate*) remain the canonical measurement systems and have not been displaced by AI tooling. What has changed is the *magnitudes* and the *additional things you need to measure* on top.

Two practical claims dominate the corpus:

1. **DORA + SPACE still apply.** Forsgren (Oct 2025): start with the goal first ("80% of the folks I work with, this is their biggest problem"); use DORA's four metrics for delivery and SPACE for the broader picture. Satisfaction and well-being are not "touchy-feely" — they correlate with every other dimension and degrade first when something breaks. The frameworks pre-date AI but are if anything more relevant, since teams want a way to validate AI tools' impact rigorously.

2. **2x merged-PR-throughput-per-R&D-headcount in 9 months is real, measurable, and replicable.** Brian Scanlan (Intercom, How I AI 2026-04-20): they instrumented Claude Code with telemetry into Honeycomb, session data into S3, structured data into Snowflake, then drove adoption with a CTO-set goal to "2x R&D throughput." Per-R&D-employee merged PRs roughly doubled in 9 months. Code quality measured externally (Stanford research collaboration) actually went *up*, not down. Customer-incident metrics did not increase. Time from first line of code to public ship dropped consistently.

The Intercom playbook (worth pattern-matching against your org):

- **Measure adoption with telemetry, not surveys.** Hook coding agents into observability tools (Honeycomb, Datadog, etc.); collect session data; analyze.
- **Set ambitious goals at the CTO level.** "2x R&D throughput" was Intercom's; everyone aimed at it.
- **Track quality alongside throughput.** PR description quality (Intercom built an LLM judge to grade their own PR descriptions). Code quality (academic research collaboration). Customer-facing incident rates (no significant change).
- **Build skills + hooks repository.** Force agents through standard paths (e.g., a `create-pr` skill that's required via a hook so engineers can't bypass it). This is how you maintain quality at velocity.
- **Watch the bottleneck migrate.** Intercom: CI used to bottleneck; they fixed it; now code review is the bottleneck. Each generation of fix exposes the next.
- **Cost reality**: Anthropic API bill scales with adoption; Brian Scanlan: "we just kind of avoiding that optimization phase until a point where we've gotten serious benefits from investment in this platform." Cost discipline is a deliberate Phase 2.

## What this means for non-PM consumers

- **If you're a CTO or VP Eng**: do the Intercom playbook. Measure end-to-end. Don't just count PRs; instrument the agent itself. The 2x claim needs evidence in your own org for your engineers to trust it.
- **If you're a CFO**: the marginal cost (frontier-lab API bill) and the productivity benefit (PR throughput) need to be modeled together. Intercom's "spend-now-optimize-later" stance is defensible while the productivity returns are dramatic; budget for the bill to scale faster than headcount in the early adoption phase.
- **If you're a board member**: ask portfolio CTOs for their AI-adoption telemetry, not just developer-survey results. "Engineers say they like Claude Code" is not data; "merged PRs per R&D headcount" is.
- **If you're a non-engineer cross-functional partner (PM, designer, support)**: the Intercom number includes you. "All of R&D" — engineers, designers, PMs, TPMs — were shipping code via Claude Code. If your org excludes non-engineers from the productivity measurement, you're undercounting.
- **If you're an investor evaluating AI-engineering startups**: the "AI productivity" market is consolidating around vendors who can prove measured delta. Pure-vibes "engineers love it" pitches are already losing to vendors with telemetry partnerships.

## How thinking has evolved

Earliest takes:

- **Pre-2023 (Forsgren / DORA)**: Accelerate book, State of DevOps Reports established the canonical productivity-measurement frameworks. DORA = 4 metrics on delivery; SPACE = 5 dimensions for complex creative work.

- **2024-2025**: industry quietly experiments with "AI raises productivity" claim. Most evidence anecdotal.

Recent takes:

- **2025-10-19**: Nicole Forsgren (Microsoft Research; *Accelerate* author; about to release *Frictionless*) — explicit treatment of how DORA/SPACE adapt to AI era. Frameworks unchanged; magnitudes change. ([Lenny's Podcast](https://www.youtube.com/watch?v=SWcDfPVTizQ))

- **2026-04-20**: Brian Scanlan (Intercom Senior Principal Engineer) — concrete case study with measurements. 2x merged-PR-per-R&D throughput in 9 months. Telemetry-first approach. Quality + safety metrics tracked alongside throughput. (How I AI episode, [YouTube](https://www.youtube.com/watch?v=BRDKft0-dUU))

Cross-corpus reinforcement: How I AI episodes (Hilary Gridley, Owen Wilson at Stripe, Al Chen at Galileo) consistently show concrete velocity inflections though without Intercom's level of measurement rigor. Reinforces the main-corpus claim that the velocity wins are real.

External current consensus (web, weighted recent + AI-aware):

- GitHub's annual State of the Octoverse 2025 (and various academic papers from MIT, Princeton, Stanford) document productivity gains in the 25-50% range for individual tasks, with team-level effects depending heavily on adoption depth.
- Anthropic's own customer reference set (Intercom, Block, Cognition, Glean) gives credibility to the 2x range as achievable, not aspirational.

## Inflection points

- **Sonnet 4.6 / Opus 4.6 release (Nov-Dec 2025)**: per Brian Scanlan, the moment teams flipped from "AI tools help a bit" to "AI tools change the game." Christmas break 2025 pivotal: engineers worked through the break and came back demonstrably more capable.
- **Cat Wu episode (April 2026)**: Anthropic's product team itself ships features in research preview within 1-2 weeks. Internal adoption proof.
- **Brian Scanlan / Intercom episode (April 2026)**: first detailed externally-validated case study with full measurement infrastructure documented.

## Open questions

- Does the 2x throughput claim hold at companies without Intercom's culture (high trust, opinionated CTO, willingness to instrument)? Or is "2x" specifically a high-functioning-team multiplier?
- How much of the throughput gain is durable (skills compound) vs. transient (the easy-PR backlog gets cleared)? No long-term data yet.
- Cost-curve question: at what point does the API bill exceed productivity gains? Intercom is willing to defer; smaller companies aren't.
- Quality-tail-risk question: does AI-augmented code have different long-term defect distribution than human-written code? Stanford collaboration data is early; not yet conclusive.

## Cross-corpus reinforcement (How I AI as secondary signal)

Multiple How I AI episodes (Hilary Gridley automation workflows, Owen Wilson's Stripe AI prototyping tool, Al Chen's 15-repo customer support, Brian Scanlan's full Intercom case study) all reinforce the main-corpus claim that AI-augmented engineering velocity gains are large, real, and measurable when teams instrument for them. **Reinforces** without contradiction.

## See also

- Related topics: `vibe-coding`, `ai-coding-agents`, `velocity-core4`, `ship-like-startup`, `evals-for-ai-products`, `experimentation`.
- Books: [Accelerate](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339) by Nicole Forsgren (et al.) — canonical reference; should be added to books.yml. [Frictionless](https://www.nicolefv.com/) — Forsgren's upcoming book specifically on AI-era productivity.
