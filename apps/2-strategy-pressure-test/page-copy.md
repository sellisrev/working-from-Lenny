---
app-id: 2
app-name: Strategy Pressure-Tester
phase: 1
type: paste + LLM critique (Rumelt-style diagnosis)
updated: 2026-05-17
---

# Page copy — #2 Strategy Pressure-Tester

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/pressure-test`:

- One textarea, labelled "Paste your strategy doc, PRD, or roadmap." Min 200 characters; max 4000 (Worker token budget cap).
- Optional second textarea, collapsed by default: "Context: stage, market, your role." Free-text, max 400 characters.
- Single submit button: "Surface the five strongest objections."
- Output renders below in five numbered cards. Each card: objection label, one-paragraph diagnosis, one canonical anchor from the corpus.
- Each card has a "rehearse the counter" button (Phase 1 mode 2) that opens a follow-up turn with Gemini Flash to argue back.

No preamble. Strategy paste is the landing.

Below the output:
- `share this critique` (copies a URL; the doc text is NOT encoded, only the five objection labels and the timestamp)
- `keep going in Claude` (URL-trick handoff — opens claude.ai/new with the strategy doc and a more thorough prompt)
- `start over` (clears the textarea)

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

You paste a strategy doc, PRD, or roadmap. The app returns the five strongest objections a smart skeptic would raise before they raise them, drawn from the corpus's product-strategy, defending-big-bets, and Rumelt-style diagnosis topics. Built for the moment before a board review, an exec readout, or a strategy meeting where someone in the room is going to ask the hard question and you want to know which one first. Mode 2 lets you pick one objection and rehearse the counter-argument in chat, so you walk in with the answer instead of inventing it under pressure.

### 2b. How it works

The doc goes to Gemini Flash on the web with a system prompt that runs four passes: (1) Rumelt's diagnosis test (does this name a real challenge?), (2) missing tradeoffs (what is this strategy choosing not to do?), (3) untested assumptions (which beliefs in this doc would collapse the strategy if wrong?), and (4) a "six-month stress scenario" (what condition in the world would render this doc obsolete by Q4?). Each objection is anchored to a corpus chunk so the critique has a citation, not just an assertion. The doc text never leaves the Worker after the response — it is not stored, not logged in plaintext, not used for training. The Worker hits a free-tier rate limit at roughly 30 critiques per IP per day; past that, the page offers the URL-trick handoff to claude.ai.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice draft — owner review point.

**Draft:**

Pressure-test it now. The board has fewer hobbies than you do.

**Alternate (more on-corpus):**

A real strategy names a challenge. Yours might name a quarter.

---

## Editorial notes

- Block 2a leans on "smart skeptic" framing because Rumelt and "diagnosis test" are insider terms; the wedge is the *moment* (before-a-review urgency), not the framework name. The framework name shows up in 2b where the buyer is ready for it.
- Block 2b is explicit about data handling because strategy docs are sensitive. The "doc not stored, not logged" line is non-negotiable copy.
- Block 3 alternate is more on-corpus but the first draft is shareable; visitors recognize the "board has fewer hobbies" beat. Owner picks.
- Voice rules apply: no em dashes in Claude-authored text, no "delve" / "leverage" / "navigate" / "unpack".
