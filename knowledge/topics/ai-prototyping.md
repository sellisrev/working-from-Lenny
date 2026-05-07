---
topic_slug: ai-prototyping
display_name: AI prototyping for product managers
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2025-01 .. 2026-04-23
---

# AI prototyping for product managers

## Current consensus

AI prototyping has progressed from "PM curiosity" (Lenny's January 2025 guide) to "table stakes for any product role" (Aparna Chennapragada's "if you aren't prototyping with AI, you're doing it wrong," May 2025) to "the dominant team practice with structured handoff workflows" (Colin Matthews, June 2025). As of 2026, three orthogonal recommendations stack:

1. **Use coding agents (Cursor / Claude Code), not consumer tools.** Tal Raviv & Aman Khan (2026-02): consumer chat UIs hide what's actually happening; coding agents make context, tool calls, and reasoning visible. PMs build durable AI product sense by working in Cursor for daily non-technical tasks for 2-3 months. ([How to build AI product sense](https://www.lennysnewsletter.com/p/how-to-build-ai-product-sense))

2. **Start with the data model and JSON, not the UI.** Ravi Mehta (Tinder ex-CPO, 2025-09-29): prototypes that start with the visual jump straight to UI debate; prototypes that start with the underlying JSON / data structure force the team to reason about what actually moves through the system. The thesis: "Why Tinder's CPO starts with JSON, not design." ([Lenny's Podcast](https://www.youtube.com/watch?v=_yQMGHHl49g))

3. **Operationalize handoff between PM, design, and engineering.** Colin Matthews (June 2025): use a shared component library (built three ways: from screenshots, Chrome extensions, or real codebase components). Without a shared library, AI prototypes accumulate visual divergence and get rejected at handoff. ([How to get your entire team prototyping with AI](https://www.lennysnewsletter.com/p/how-to-get-your-entire-team-prototyping-with-ai))

**NLX is the new UX** (Aparna Chennapragada). Natural language interfaces have invisible grammars: prompts as UI elements, plans as new constructs, "show your work" patterns, follow-up suggestions. The discipline of prototyping NLX is its own emerging craft, not just "make it look like ChatGPT." Three agent-product principles per Aparna: (a) autonomy spectrum — what can you delegate, (b) complexity — multi-step rather than one-shot, (c) asynchronous — works while you're not there.

The standard 2026 toolkit:
- **For visual prototyping**: v0, Bolt, Magic Patterns, Lovable, Replit. Largely interchangeable for clickable mocks.
- **For deeper agent prototyping**: Cursor (for pairing with AI), Claude Code (for delegating), n8n + Zapier Agent for workflow plumbing.
- **For data-model-first prototyping**: any of the above, but start by writing the JSON schema in a `.json` file or pseudo-API; then have the agent build the UI to render that schema.

What's increasingly considered an anti-pattern:
- "Have the model write the React component as a one-shot from a vague description" — produces brittle artifacts
- "Use AI prototypes as an end-state product" — they're prototypes, not production code (with the harness exceptions noted in [vibe-coding](vibe-coding.md))
- Skipping the component library step and letting prototypes diverge visually from the real product

## What this means for non-PM consumers

- **If you're a designer**: AI prototyping is now part of design, not adjacent to it. The Magic Patterns / Cursor combination produces interactive prototypes faster than Figma + manual handoff. Designers who don't include AI-prototyping output in their portfolios are losing roles to designers who do.
- **If you're an engineer reviewing PM prototype output**: don't reject for code quality. The prototype is communication, not deployment. But do enforce that the PM prototype uses your component library; if it doesn't, push back at intake, not at handoff.
- **If you're a sales / marketing lead**: AI prototypes are a powerful tool for prospect demos. Aparna and Lenny both note that "build me a prototype that expresses my idea" is now a complex task you can delegate to an agent overnight. For sales engineers, this changes the demo cadence dramatically.
- **If you're a CEO / founder**: budget time for your team to use coding agents for non-technical work. Tal & Aman's prescription (3 months in Cursor) is real; the alternative (read about AI) does not produce comparable intuition.

## How thinking has evolved

Earliest takes:

- **2025-01**: Lenny — "A guide to AI prototyping for product managers." Framing: this is a PM-distinct skill emerging. Tools at the time: v0, Bolt early. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/a-guide-to-ai-prototyping-for-product))

- **2025-05-18**: Aparna Chennapragada (Microsoft CPO) — "If you aren't prototyping with AI, you're doing it wrong." Hard normative push from a CPO of one of the largest software companies. Introduces NLX framing. ([Lenny's Podcast](https://www.youtube.com/watch?v=HbbfXAWcuUo))

Middle period:

- **2025-06-10**: Colin Matthews — "How to get your entire team prototyping with AI." Reframes from PM-only to team-wide, with handoff and component-library guidance.

Recent takes:

- **2025-09-29**: Ravi Mehta (Tinder ex-CPO) — "Why Tinder's CPO starts with JSON, not design." Methodology shift: data-model-first prototyping. The top output is more durable because the data structure survives UI iteration.

- **2026-02-03**: Tal Raviv & Aman Khan — "How to build AI product sense." Establishes the Cursor-as-daily-driver method; this is the highest-leverage prescription in the corpus for becoming proficient.

- **2026-04-23**: Cat Wu — Anthropic ships features in research preview within 1-2 weeks; the prototype-to-ship path is now near-zero friction at AI-native companies.

External current consensus (web, weighted recent + AI-aware):

- v0, Bolt, Lovable, Replit, and Magic Patterns are all venture-backed at scale and have multi-million-user bases; the practice has become mainstream.
- Brian Halligan's [AI-era founder advice](https://www.youtube.com/watch?v=lNDV-2CK8nc) (2026): "never been easier to start a company" centers on prototyping speed.

## Inflection points

- **v0 / Bolt / Lovable / Replit reaching parity (mid-2025)**: prototype quality stops being a differentiator between tools; team practice and methodology become the differentiator.
- **Aparna Chennapragada's "doing it wrong" framing (May 2025)**: shifts AI prototyping from "competitive advantage" to "table stakes."
- **Cursor + Claude Code separation (mid-2025)**: visual coding agents (Cursor) for pairing diverge from delegation agents (Claude Code) for autonomous tasks; the workflow choice matters.
- **Ravi Mehta JSON-first method (Sept 2025)**: marks the field's maturation from "make it look real" to "make it think right."

## Open questions

- Where does the boundary land between "prototype" and "production app" as AI-tooling closes the gap? Brian Scanlan's Intercom case (vibe-coded in production with harnesses) suggests the distinction is dissolving for some teams.
- How do you train the data-model-first instinct (Ravi Mehta) in PMs without engineering background? The corpus has not addressed this directly.
- For B2B / enterprise products with complex backend integrations, how much of "AI prototyping" is meaningful given the work that doesn't fit into a clickable mock?

## Cross-corpus reinforcement (How I AI as secondary signal)

Multiple How I AI episodes (2026-04 onward) demo concrete prototyping workflows: Hilary Gridley's automation workflows, Owen Wilson's Stripe internal AI design tool, the various "non-engineer builds X" examples. **Reinforces** the main-corpus claim that AI prototyping is broadly accessible and not gated to engineering background.

## See also

- Related topics: `vibe-coding`, `evals-for-ai-products`, `prompt-engineering`, `ai-pm-skills`, `ai-coding-agents`, `product-design-craft`.
- Books: none directly applicable.
