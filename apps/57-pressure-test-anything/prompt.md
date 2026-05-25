---
app-id: 57
app-name: Pressure-Test Anything
phase: 3
type: open critique / router (corpus-wide retrieval, no state)
updated: 2026-05-25
neighbor: #54 Lenny AMA (same single-call Path 4 shape — PHASE2_BUILD #11)
skill-engine: lenny-pressure-test
narrow-sibling: #2 Strategy Pressure-Tester
---

# Engine — #57 Pressure-Test Anything

> The broad critique front door. Paste any plan, PRD, strategy doc, GTM plan, pricing
> decision, or architectural decision and get the strongest **corpus-grounded** objections,
> each attributed to a guest with a concrete next step. The general-scope sibling of the
> narrow, deterministic #2 Strategy Pressure-Tester. Single-call Path 4 — `pressure_test_ask`
> returns a `narration_brief` directly and the host renders the critique on the same turn.
> No scoring engine, no persistence, no sampling. `readOnlyHint: true`.

## Canonical behavior

This app is the **MCP-app surface of the `lenny-pressure-test` skill** (repo root). The skill is
the source of truth for behavior; this engine wraps it as a single bundle tool. Do not
re-derive the rules here — mirror `lenny-pressure-test/SKILL.md`:

- Every objection is **specific, actionable, and attributed** (guest + date + post URL), and
  **always ends in a concrete next step** (a missing next step is a bug, not a valid state).
- **Second-opinion mode** when the plan is sound: add "what the corpus would NOT push back on,"
  cite which guest claims align, and downgrade weak concerns to pre-ship questions.
- **No mandatory gates, no quick/full toggle, no refuse-on-thin-input.** Thin input -> a compact
  3-4 objection pressure test plus 2-4 suggested extensions.
- **Surface cautions** explicitly when citing a guest with an active caution file.

## Shape (PHASE2_BUILD #11)

- `pressure_test_ask(plan, k=10)` -> `narration_brief` directly (it IS the narration step; no
  score -> narrate -> get-pending spine, no persistence).
- Retrieval via the shared `retrieveAcrossCorpus(text, k)` helper over
  `knowledge/topics/ + obsolete/ + cautions/ + books/`, tagging each hit with kind + last_updated.
- Decay-aware: obsolete/caution hits flow into `inputs.decay`; the directive surfaces what changed
  rather than repeating expired advice.
- Routing: `inputs.suggested_app` set when the input maps cleanly — a structured strategy doc ->
  **#2 Strategy Pressure-Tester**, a hiring question -> **#58 Hiring Playbook**. Offer softly at the
  end, never as a deflection from the critique.

## Stage status

Stage A (spec inputs) and Stage B (this prompt) done 2026-05-25. **Stage C (bundle tool handler +
manifest registration) and Stage D (Opus voice QA + validate/smoke) are queued for the routine**
(see ROUTINE.md). Until then the app is discoverable via the launcher catalog + the Replit site
tile; the wired tool ships when the routine completes the build. The web variant is a claude.ai
handoff (the site tile builds a structured prompt — APP_IDEAS implementation note).
