---
app-id: 2
app-name: Strategy Pressure-Tester
phase: 1
type: paste + LLM critique (Rumelt-style diagnosis)
updated: 2026-05-17
---

# Critique engine — #2 Strategy Pressure-Tester

> Phase 1 is the public web app on Gemini Flash. The existing `lenny-pressure-test` skill in this repo is the engine reference — it uses corpus routing and topic-map attribution that this app reuses.

## Inputs

- `strategy_text` (200–4000 chars). Paste of strategy doc / PRD / roadmap.
- `user_context` (0–400 chars, optional). Stage, market, role.

## Pre-routing (deterministic, before LLM)

Before hitting Gemini, the Worker runs a cheap router that classifies the doc:

```
doc_type = one of:
  "strategy"  (has bets, named challenge, multi-quarter horizon)
  "roadmap"   (list of features by quarter, no named challenge)
  "prd"       (single-feature scope, success criteria, edge cases)
  "mixed"     (looks like a strategy but reads like a roadmap)
```

Router output is passed to the LLM as `doc_type` so the critique uses the right vocabulary. A "mixed" classification triggers a sixth objection above the regular five: "this document is a roadmap with strategy vocabulary on top."

## Four-pass critique (the heart)

Each pass is one LLM call OR (preferred) one section of a single longer call. All four passes use the same model + temperature.

### Pass 1 — Rumelt diagnosis test

```
Does this document name a real challenge? Rumelt's test: a good strategy
identifies the obstacle (diagnosis), proposes a coherent response (guiding
policy), and lists the actions that follow (coherent actions). A
non-strategy is a list of aspirations.

For this doc:
- What is the named challenge? Quote the sentence (or note: no challenge named).
- What is the proposed response? Quote it (or note: no response named).
- Where do the named actions sit on the diagnosis → policy → action chain?
  If they jump straight to action, the strategy is incoherent at the source.
```

Anchor: `good-strategy-rumelt.md`, `product-strategy.md`.

### Pass 2 — Missing tradeoffs

```
What is this strategy explicitly choosing NOT to do? A strategy with no
tradeoffs is a wishlist.

For this doc, list:
- Three markets / customers / features the doc implicitly opts into.
- Three the doc says nothing about. Are those silent choices conscious,
  or are they invisible to the author?
- One tradeoff the doc gets right (so the critique reads as fair, not
  just antagonistic).
```

Anchor: `product-strategy.md`, `defending-big-bets.md`, `saying-no.md`.

### Pass 3 — Untested assumptions

```
For each bet named in this doc, identify the assumption that would have to
be false for the bet to lose. Then: how would the author find out the
assumption is false BEFORE shipping?

Returns three items max, prioritized by:
1. How load-bearing the assumption is (does the whole bet collapse if
   wrong, or just degrade?)
2. How cheap it is to test before commitment.
```

Anchor: `defending-big-bets.md`, `pm-pitfalls.md` (untested-assumptions pattern).

### Pass 4 — Six-month stress scenario

```
Name one specific condition in the world that would render this doc
obsolete by Q4. Format: "If [specific market / regulatory / competitive
event] happens, this strategy [specific failure mode]." 

Pick conditions that are plausible (not "an asteroid hits"). Examples of
the right shape:
- "If OpenAI ships a free tier matching your paid feature in October,
  the moat in section 3 evaporates."
- "If your top-three customer concentrates to 60%+ of revenue and asks
  for an enterprise pivot, your stated bet on PLG dies quietly."
```

Anchor: `competitive-positioning.md`, `pivots-art.md`, `business-model-evolution.md`.

## Output shape

Five cards. Each:

```
Objection {N}: {short label, 5-10 words}

{2-4 sentence diagnosis. Direct. No corporate softening.}

Anchor: {corpus topic file} — {one canonical quote, ≤30 words}
```

If `doc_type == "mixed"`, a sixth card prepends the others:

```
Before the five: this document is shaped like a roadmap. It uses strategy
vocabulary but the operative content is a feature list by quarter. The
critique below assumes you wanted strategy. If you wanted a roadmap, ignore
all five and ask instead: "are these features the right ones?"
```

## Mode 2: rehearse the counter

User clicks a card's "rehearse the counter" button. A second Worker call:

```
System: You are now playing the skeptic who raised objection {N}. The user
is going to argue back. Push, but fairly — if their counter is good, say so.
If it has a weak link, name the link. Three turns max, then close with:
"OK, here's the version of your strategy that survives this objection."

User: {strategy_text}
Skeptic raised: {objection_text}
User's counter: {user_input}
```

## Phase 0 URL-trick handoff (interim)

While Phase 1 inference isn't wired yet, the page can ship in Phase 0 mode with a single "Critique this in Claude" button:

```
I'm preparing for a strategy review. Below is my doc. Using Lenny Rachitsky's
interview corpus (especially good-strategy-rumelt, defending-big-bets, and
product-strategy), please:

1. Apply Rumelt's diagnosis test. What's the named challenge? What's the
   guiding policy? Are the actions coherent with both?
2. Identify three missing tradeoffs — what is this strategy NOT doing?
3. Surface the three load-bearing assumptions that would kill the strategy
   if wrong, with one cheap pre-ship test for each.
4. Name one specific six-month stress scenario that would render this
   obsolete.

Be direct. Don't soften it.

{strategy_text}
```

## Voice rules (applied to all LLM output)

- No em dashes.
- No "delve", "leverage", "unpack", "navigate", "unlock".
- No "in today's fast-paced".
- Curly quotes are fine.
- Direct, candid. If the doc is bad, say it is. If it's good, say that too.

## Autonomous-routine backlog

Items the every-2h routine can pick up (Phase 1 content authoring):

- [x] Author 8–12 "doc-type classifier" exemplars per category (strategy / roadmap / PRD / mixed) for the deterministic router. Drawn from `knowledge/topics/` corpus excerpts where strategy vs roadmap drift is named. → 10 exemplars in `authoring.md` (s-01, s-02, r-01, r-02, p-01, p-02, m-01, m-02, m-03).
- [x] Author ~30 anchor-quote candidates across the four passes, so the LLM can pull from a vetted pool when corpus chunks are sparse. → 30 vetted quotes in `authoring.md`, 7-8 per pass.
- [x] Cross-check the four-pass anchor files exist in `knowledge/topics/` (`good-strategy-rumelt.md`, `defending-big-bets.md`, etc.). Substitute and log to `UNCERTAIN_DECISIONS.md` if any are missing. → Two missing: `competitive-positioning.md` → `positioning.md`; `business-model-evolution.md` → `seven-powers.md`. Logged.
- [x] Draft 5–10 sample strategy paragraphs (synthetic, anonymized) covering each `doc_type` category, for golden-set evals once inference is wired. → 8 golden-set paragraphs (2 per doc_type) with expected critique profiles in `authoring.md`.

## Phase 2 MCP App spec

Same engine, but:
- Persists prior critiques per user. "Last quarter's pressure-test found these three assumptions. Two are no longer load-bearing. Re-test the third." (Calibration shape.)
- Corpus access is local file read on the user's machine, not Worker-side retrieval. The .mcpb bundle ships with `knowledge/topics/` embedded.
- Mode 2 (rehearse-the-counter) becomes multi-turn natively rather than per-button.
