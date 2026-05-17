---
app-id: 47
app-name: Mission / Vision / Strategy Alignment Checker
phase: 1
type: paste-three + LLM drift analysis
updated: 2026-05-17
---

# Page copy — #47 Mission / Vision / Strategy Alignment Checker

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/alignment`:

Three stacked textareas:

1. "Paste your mission." (≤500 chars)
2. "Paste your vision." (≤500 chars)
3. "Paste this quarter's strategy doc." (≤3000 chars)

Submit: "Surface the drift."

Output renders below as four sections:

1. **Drift map.** Visual: three labelled boxes (mission / vision / strategy) with arrows between them. Each arrow is labelled with the largest drift between those two documents (e.g., "mission says X, strategy is doing Y").
2. **Platitude detector.** Lines from any of the three docs that mean nothing. Listed verbatim with a one-line "what this would have to say to be load-bearing" rewrite.
3. **Operational gaps.** Bets named in the strategy that don't appear in any team's roadmap. Phrased as questions the user can take to their team leads: "Strategy says we're investing in X; whose roadmap reflects this?"
4. **Rumelt diagnosis.** Does the strategy doc name a real challenge with a coherent response, or is it a list of aspirations? Answers: yes / partial / no with a one-paragraph justification.

Below the output:
- `share this drift map` (verdict + drift labels only; document text does NOT round-trip)
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Paste your mission, vision, and current quarter's strategy doc. The app surfaces drift between the three — where the mission says X and the strategy is doing Y — the platitudes that mean nothing ("delight customers"), the operational gaps where the strategy's named bets aren't reflected in any team's roadmap, and a Rumelt diagnosis of whether the strategy is real strategy or aspirations dressed as strategy. Built for founders, heads of product, and COOs who need a defensible answer to "are we actually doing what we said we'd do?" — and for board members using it as meeting-prep.

### 2b. How it works

Your three documents go to Gemini Flash with a system prompt drawn from the corpus's `mission-vision.md`, `good-strategy-rumelt.md`, and `product-strategy.md` topics. The drift map is generated from cross-document semantic comparison; the platitude detector runs a heuristic over each doc looking for empty phrases the corpus has flagged (drawn from `pm-pitfalls.md` and `strategy-as-jargon.md`); the operational gap check requires the user's strategy doc to be specific enough to name bets — vague strategies produce a "your strategy is too vague to test operationally" verdict rather than a false gap list. Your documents stay in the Worker request scope and are not stored. Worker ceiling: ~30 alignment checks per IP per day.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output.

**Draft:**

A mission is what you'd still do if the funding stopped. The rest is decoration.

**Alternate:**

The drift is rarely between the documents. It's between the documents and Tuesday.

---

## Editorial notes

- Block 2a names the buyers explicitly (founders, heads of product, COOs, board members) because Block 1's interface alone doesn't convey altitude. The doc-paste shape can read as a tactical tool until 2a says it's not.
- Block 2b is honest about what the app can't do (vague strategies can't be tested operationally) because the corpus's Rumelt framing demands it — if we pretended a vague strategy could be operationalized, we'd be the platitude detector's first target.
- Block 3 alternate is more on-corpus (the gap between document and Tuesday is the corpus's recurring strategy-rot observation) but reads as too tactical. Owner picks; first draft has the cleaner cadence.
