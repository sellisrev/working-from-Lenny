---
app-id: 25
app-name: Decision Log + Brier Calibration Tracker
phase: 3
type: stateful log + deterministic Brier math + LLM narration
updated: 2026-05-24
---

# Page copy — #25 Decision Log + Brier Calibration

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/decision-log`:

A small log-and-resolve console, single page.

- **Log a decision.** What you're deciding, a decision type (pick a preset or type your own), how sure you are (1-99%), and what specifically you expect to be true if you're right.
- **Your open decisions**, each with a resolve button. Resolving asks: were you right, and an optional note.
- **Read your calibration** any time once you've resolved a few.

The confidence slider stops at 1 and 99 on purpose: 0 and 100 are not forecasts, they're claims of certainty, and they break both the math and the lesson.

Output (the calibration read):
- **Overall Brier score** with a plain-language band (sharp / decent / coin-flip / confidently-wrong) and the n= count of resolved decisions.
- **Where you're miscalibrated**, by decision type: overconfident, underconfident, or well-calibrated, with the felt-confidence vs actual-hit-rate numbers.
- **Open decisions waiting on outcomes**, including the oldest one still open.
- **The pattern worth knowing**: one corpus-grounded line on what your biggest miscalibration tends to cost someone in your seat, and the one habit that narrows the gap.

Below the output:
- `log another`
- `keep going in Claude`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Log every meaningful call with the confidence you had at the time. Resolve it when you know how it turned out. The tool keeps the running history and computes your Brier score, the honest measure of whether your confidence tracks reality, and shows you which kinds of decisions you're systematically too sure or not sure enough about. When you log a new decision, it warns you if your confidence is drifting from your own track record on that type. This is Annie Duke's Thinking in Bets applied to your actual job. It's a coach with a spreadsheet, not a fortune teller: the number is the number, and it gets better only because real outcomes resolve it. Built for PMs, founders, eng managers, and investors making repeated judgment calls who want to know if they're actually improving.

### 2b. How it works

Unlike every other tool here, this one keeps a durable history: your decisions live in a local per-user log that grows over time, appended to when you log and updated in place when you resolve. The Brier math is deterministic and runs locally. Calibration verdicts only appear once you've resolved at least three decisions of a type, so the tool never invents a pattern from one data point. The interpretation, the plain-language band and the habit that narrows your biggest gap, is corpus-grounded and rendered by the chat assistant from `decision-making-frameworks.md`, `evaluating-product-bets.md`, and `defending-big-bets.md`. Decision types are open: seven presets plus any custom type you type in, and it remembers yours for next time. Your log stays local and is not stored remotely.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape owner-approved 2026-05-23 (DECISIONS.md): scoreboard.

**Draft:**

You felt 80% sure. You were right 55% of the time. The gap is the whole point.

**Alternate:**

Confidence is a forecast. The Brier score is the weather report.

---

## Editorial notes

- Block 2a leads with the longitudinal value because that's the differentiator: this is the one tool whose worth accrues with use, not in a single session.
- Block 2b states plainly that this app keeps durable local history (the others don't) and that verdicts wait for n≥3, because the honesty about small samples is the trust hook for a numerate audience.
- Block 3 is the owner-approved scoreboard shape (a two-number confrontation resolving to a thesis). The alternate is cleaner as a definition but loses the personal sting; keep the first.
