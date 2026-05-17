---
app-id: 47
app-name: Mission / Vision / Strategy Alignment Checker
phase: 1
type: paste-three + LLM drift analysis
updated: 2026-05-17
---

# Engine — #47 Mission / Vision / Strategy Alignment Checker

> Phase 1 is the public web app on Gemini Flash. Four-section output: drift map, platitude detector, operational gaps, Rumelt diagnosis.

## Inputs

- `mission_text` (≤500 chars)
- `vision_text` (≤500 chars)
- `strategy_text` (200–3000 chars)

If any of the three is missing or trivially short (<50 chars), the app returns: "We need all three documents to surface drift. Mission and vision under 50 characters are typically titles, not content. Paste the full statement."

## Pass 1: drift map (three pairwise comparisons)

The LLM runs three pairwise comparisons:

```
mission ↔ vision   — does the vision describe a future state that, if reached,
                     would make the mission complete? Or are they in
                     different conceptual planes?
mission ↔ strategy — does this quarter's strategy spend energy on the mission,
                     or has the mission become decorative?
vision ↔ strategy  — is the strategy's named direction a step on the path
                     to the vision, or orthogonal?
```

Output per comparison:
```
{
  "pair": "mission_vs_strategy",
  "drift_severity": "none" | "low" | "med" | "high",
  "drift_label": "<10-word phrase: 'mission says X, strategy is doing Y'>",
  "diagnosis": "<one paragraph>"
}
```

Anchor: `mission-vision.md`, `product-strategy.md`, `good-strategy-rumelt.md`.

## Pass 2: platitude detector (each doc, independently)

Heuristic patterns the model is primed to look for (corpus-anchored):

- "Delight [customers/users/audience]" — almost always platitude unless paired with a specific behavior or metric.
- "Best-in-class [X]" — comparative claim without a comparator.
- "World-class [X]" — same.
- "Empower [X]" — generic agency-grant; rarely operationalized.
- "Reimagine [X]" — vague intent; rarely tied to a specific change.
- "Transform [X]" — same.
- "Drive [growth/value/outcomes]" — agentless growth.
- "Be the [X] for [Y]" — positioning claim that may or may not be load-bearing; flag if the rest of the doc doesn't name what would have to be true.

Output:
```
[
  {
    "phrase_verbatim": "delight our customers",
    "from_doc": "mission",
    "what_it_would_have_to_say": "If this were load-bearing, it would read: 'reduce customer onboarding friction by half by Q4' or similar."
  }
]
```

Anchor: `pm-pitfalls.md` (corporate-jargon pattern), `mission-vision.md`.

## Pass 3: operational gaps (strategy → team roadmaps)

The LLM extracts named bets from the strategy doc — concrete commitments like "we'll launch in EMEA," "we'll move from per-seat to consumption pricing," "we'll ship the agentic agent platform" — and then notes that the user hasn't given us any team roadmaps to cross-check against.

In Phase 1, the output is therefore phrased as questions, not assertions:

```
{
  "bet": "expand to EMEA in H2",
  "operational_question": "Whose roadmap names EMEA-specific work? Sales hiring, localization, regional compliance, GTM partnerships?"
}
```

If the strategy doc is vague enough that no concrete bets can be extracted, the output is:

```
"Your strategy is too vague to test operationally. Before doing this
exercise again, rewrite the strategy to name 3-5 specific bets with a
concrete first observable signal each."
```

Phase 2 MCP version adds the ability to ingest team roadmap files and produce assertion-shaped findings ("Engineering's roadmap names EMEA; Sales' roadmap does not").

Anchor: `product-strategy.md`, `defending-big-bets.md`, `cross-functional-collaboration.md`.

## Pass 4: Rumelt diagnosis

Direct application of Rumelt's diagnosis test to the strategy_text only (vision and mission are not strategy documents and are not held to the diagnosis test):

```
- Named challenge? quote the sentence.
- Guiding policy? quote the sentence.
- Coherent actions? list them.

Verdict: yes / partial / no
```

If any of the three is absent, the verdict is "partial" (or "no" if all three are absent). Anchor: `good-strategy-rumelt.md`.

## Output shape

```
Drift map
─────────
  mission   ↔   vision    [severity, drift_label]
  mission   ↔   strategy  [severity, drift_label]
  vision    ↔   strategy  [severity, drift_label]

  [Per-pair diagnosis paragraph]

Platitude detector
──────────────────
  "delight our customers" (mission)
  → would have to say: "..."
  
  "best-in-class onboarding" (strategy)
  → would have to say: "..."

Operational gaps
────────────────
  Strategy names: {bet 1}
  → Question: {operational_question}
  
  Strategy names: {bet 2}
  → Question: {operational_question}

  [Or: your strategy is too vague to test operationally...]

Rumelt diagnosis
────────────────
  Named challenge: {quote or "absent"}
  Guiding policy: {quote or "absent"}
  Coherent actions: {list or "absent"}
  
  Verdict: {yes | partial | no}
  {one-paragraph justification}
```

## Phase 0 URL-trick handoff (interim)

```
I want to surface drift between my mission, vision, and current quarter's
strategy doc.

Mission: {mission_text}

Vision: {vision_text}

Strategy: {strategy_text}

Using Lenny Rachitsky's corpus (especially mission-vision, good-strategy-
rumelt, and product-strategy topics), please:

1. Drift map: do three pairwise comparisons (mission-vs-vision, mission-
   vs-strategy, vision-vs-strategy). For each, tell me the drift severity
   and the one-sentence drift label.
2. Platitude detector: list any lines from any of the three docs that mean
   nothing. For each, write what it would have to say to be load-bearing.
3. Operational gaps: extract the named bets from my strategy. For each,
   give me the question I should ask my team leads to test whether anyone
   is actually working on it.
4. Rumelt diagnosis: does my strategy name a real challenge with a coherent
   response, or is it a list of aspirations? Yes / partial / no with one
   paragraph.

Be direct. If the strategy doesn't survive Rumelt's test, say so.
```

## Voice rules

Same. No em dashes. The platitude detector cannot itself be platitudinous; the rewrites should be more concrete than the original lines.

## Autonomous-routine backlog

- [x] Author 8–10 "platitude → rewrite" pairs across mission, vision, strategy doc types. → 10 pairs (plat-m-01 through plat-s-04) spanning all three doc types with operationalized rewrites and corpus anchors in `authoring.md`.
- [x] Author 4 worked drift-map examples spanning the severity spectrum (none / low / med / high) so the LLM can pattern-match. → 4 examples (drift-none-01, drift-low-01, drift-med-01, drift-high-01) with full three-pair analysis in `authoring.md`.
- [x] Cross-check that `mission-vision.md`, `good-strategy-rumelt.md`, `product-strategy.md`, and `strategy-as-jargon.md` exist in `knowledge/topics/`. → `good-strategy-rumelt.md` and `product-strategy.md` confirmed present. `mission-vision.md` → `mission-vision-strategy.md` (actual filename); `strategy-as-jargon.md` → `pm-pitfalls.md` (as spec predicted). Also: `cross-functional-collaboration.md` (Pass 3) → `getting-buy-in.md`. Three substitutions logged to UNCERTAIN_DECISIONS.md.
- [x] Author 3 synthetic mission/vision/strategy triples (one passing Rumelt cleanly, one borderline, one failing) for golden-set evals. → 3 triples (golden-mvs-01 through golden-mvs-03) with Rumelt verdicts in `authoring.md`.
- [x] Author the "vague strategy" fallback copy with 3 specific suggestions for how to rewrite a vague strategy doc. → Fallback copy authored in `authoring.md` with three constraints: name the challenge, name three bets, name one 60-day signal per bet.

## Phase 2 MCP App spec

Same engine, but:
- Ingests team roadmap files alongside the three documents. The operational gaps section becomes assertion-shaped: "Engineering names EMEA; Sales does not."
- Quarterly mission/vision/strategy diff. "Last quarter your mission said X; this quarter's strategy is doing Y. Mission has drifted to follow the strategy, not the other way around. Was that intended?"
- Board-prep mode: outputs a one-page artifact formatted for a board pre-read.
