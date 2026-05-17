---
app-id: 24
app-name: OKR Critique
phase: 1
type: paste + LLM critique with stance picker
updated: 2026-05-17
---

# Page copy — #24 OKR Critique

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/okr-critique`:

- One textarea: "Paste your draft OKRs." Min 100 chars; max 3000. Format-agnostic (the engine parses bulleted, numbered, or table-formatted input).
- Stance picker (three radio buttons): **orthodox** / **skeptical** / **hybrid**. Default: hybrid.
  - Orthodox: critique against canonical OKR doctrine (Doerr / Grove). Assumes OKRs are a load-bearing system you want to do well.
  - Skeptical: critique from the perspective that OKRs are often theatre; whether to keep them at all is on the table.
  - Hybrid: identifies which of your OKRs would survive in either stance and which would only survive in one. Default because most PMs aren't sure which camp they're in.
- Optional: "team or org level?" radio (team / org). Default: team. Org-level OKRs trigger an additional cross-team coherence check.
- Submit: "Critique these OKRs."

Output renders below in three sections:

1. **Per-OKR critique.** Each OKR (objective + its key results) gets a card with:
   - The four-test verdict per key result: outcome-vs-activity, measurable, single-team-fit, too-many (count check).
   - One rewritten variant of each KR that survives all four tests, where possible.
   - Anchor: corpus quote that names the pattern.
2. **Stance-specific take.** One paragraph applying the chosen stance.
3. **Rewritten set.** The full proposed rewrite of the user's OKRs, ready to paste back into the team's planning doc.

Below the output:
- `share this critique` (URL-encoded; the OKR text does NOT round-trip — share is verdicts only)
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Paste your draft OKRs. The app returns: which key results are activities disguised as outcomes ("ship feature X" vs "Y users adopt feature X"), which are unmeasurable, which over-fit to a single team's work, which OKRs you have too many of, and a rewritten set you can paste back into your planning doc. Pick a stance — orthodox (you want to do OKRs well), skeptical (you want to know if you should keep them at all), or hybrid (both lenses). Built for the PM, founder, or eng lead who's about to lock OKRs for the quarter and would rather find the activity-disguised-as-outcome now than at the readout in week ten.

### 2b. How it works

Your paste goes to Gemini Flash on the web with a system prompt drawn from the corpus's `okrs.md` and `goal-setting.md` topics, weighted to surface both the orthodox view (Doerr's framework as load-bearing) and the skeptical view (OKRs as theatre, per corpus voices like Lenny himself in the "objection to OKRs" thread). The four tests — outcome-vs-activity, measurable, single-team-fit, too-many — are deterministic and applied as a structured check. The rewrite is generated. Your OKR text stays in the Worker request scope and is not stored. Worker free-tier ceiling: ~30 critiques per IP per day.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output.

**Draft:**

Activity disguised as outcome. Outcome disguised as platitude. The actual outcome, still unspoken.

**Alternate:**

If you have nine, you have none. If you have three, you might have one.

---

## Editorial notes

- Block 2a uses "PM, founder, or eng lead" because OKR critique audience is broader than PM-only (the spec explicitly extends beyond PMs).
- Block 2b is honest about the corpus's split opinion on OKRs because hiding it would feel propagandistic for a tool meant to help users think.
- Block 3 alternate is more on-corpus (the "if you have nine" line is verbatim from Doerr's framing in `okrs.md`) but reads as advice rather than ironic blurb. The first draft has the tripartite cadence (matches #44's style) and is the better Block 3.
