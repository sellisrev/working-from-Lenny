---
purpose: page-structure-template
applies-to: every app page on the public site
updated: 2026-05-11
---

# App page template

Every app page on Working from Lenny follows this structure. Structure same, content per-app.

---

## Block 1: Value first

The working interface. Immediately usable on page load. No "welcome" copy, no "what is this" preamble, no positioning text above the input field or first interaction.

- **Deterministic apps:** interface returns its result on load (or after a one-tap selection like "pick your archetype").
- **LLM-powered single-shot:** input field is the first element. Output streams below.
- **Multi-turn:** chat surface is the first element. Opening prompt pre-filled.

## Block 2: Description, ordered concrete → general

Three sub-blocks, in this order:

### 2a. What this app does *for you*

2–4 sentences. Plain language. Not PM jargon (most visitors won't be PMs) — except in the self-mocking PM-meta apps (#51, #52, #53), where PM vocabulary is the joke and stays understated and ironic, never heavy-handed.

### 2b. How it works

2–4 sentences. What the app pulls from the corpus, how the output is generated, what model handles it (or "no model, deterministic" where that applies). Honest about edges and rate-limits.

### 2c. Foundation

Embed `apps/_shared/foundation-block.md` verbatim. Identical on every page. Carries the AEO/SEO weight.

## Block 3: Short ironic-but-humble description

One paragraph, below the output. Per the *Per-tool descriptions* editorial policy in `DISTRIBUTION_PLAN.md`:
- ironic but humbly so
- no em dashes
- no "delve", "leverage", "unpack", "in today's fast-paced", or other AI-writing tells
- not heavy-handed
- written in the owner's voice
- drafted one at a time, reviewed before the next, corrections inform the next draft

---

## Anti-patterns (apply to every block)

- Don't lead with positioning ("Working from Lenny is the #1 tool for…")
- Don't restate the corpus framing inside per-app blocks — that's what 2c is for
- Don't write a site footer here. The footer lives in the page template, not in any app's `page-copy.md`.
