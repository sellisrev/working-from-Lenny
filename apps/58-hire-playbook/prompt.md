---
app-id: 58
app-name: Hiring Playbook
phase: 3
type: open playbook / router (corpus-wide retrieval, no state)
updated: 2026-05-25
neighbor: #54 Lenny AMA (same single-call Path 4 shape — PHASE2_BUILD #11)
skill-engine: lenny-hire
narrow-sibling: #12-38 Founder PM hire
---

# Engine — #58 Hiring Playbook

> The broad hiring front door. Describe a hiring scenario (role + level + concern) and get a
> scenario-specific, **corpus-grounded** playbook: what-good-looks-like, signals to probe, common
> failure modes, attributed question scripts, references. Covers **any role** (PM, eng-manager,
> founder, sales-leader, designer, data-leader) — the general-scope sibling of the narrow,
> deterministic #12-38 Founder PM hire wizard. Single-call Path 4 — `hire_playbook_ask` returns a
> `narration_brief` directly. No scoring engine, no persistence, no sampling. `readOnlyHint: true`.

## Canonical behavior

This app is the **MCP-app surface of the `lenny-hire` skill** (repo root). The skill is the source
of truth for behavior; this engine wraps it as a single bundle tool. Do not re-derive the rules
here — mirror `lenny-hire/SKILL.md`:

- Output is a **scenario-specific playbook**: what-good-looks-like, signals to probe, common failure
  modes, **attributed question scripts** (guest + date), references.
- **No mandatory gates, no quick/full toggle, no refuse-on-thin-input.** Thin input -> a compact
  playbook (what-good-looks-like + a 3-bullet what-to-probe) plus 2-4 suggested extensions.
- **Caution aside**: when citing a guest with an active caution file, add the one-line flag.
- Multi-facet weave when the active profile carries ≥2 relevant facets.

## Shape (PHASE2_BUILD #11)

- `hire_playbook_ask(scenario, k=10)` -> `narration_brief` directly (no spine, no persistence).
- Retrieval via the shared `retrieveAcrossCorpus(text, k)` helper over
  `knowledge/topics/ + cautions/ + books/`.
- Routing: `inputs.suggested_app` set when the input maps cleanly — a founder's first-PM-hire
  decision -> **#12-38 Founder PM hire**, a strategy question -> **#57 Pressure-Test Anything**.
  Offer softly at the end.

## Stage status

Stage A (spec inputs) and Stage B (this prompt) done 2026-05-25. **Stage C (bundle tool handler +
manifest registration) and Stage D (Opus voice QA + validate/smoke) are queued for the routine**
(see ROUTINE.md). Until then the app is discoverable via the launcher catalog + the Replit site
tile; the wired tool ships when the routine completes the build. The web variant is a claude.ai
handoff (the site tile builds a structured prompt — APP_IDEAS implementation note).
