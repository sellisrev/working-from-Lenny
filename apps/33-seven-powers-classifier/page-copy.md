---
app-id: 33
app-name: 7 Powers Self-Classifier
phase: 3
type: wizard-quiz + claim-vs-evidence classification + LLM narration
updated: 2026-05-24
---

# Page copy — #33 7 Powers Self-Classifier

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/seven-powers`:

Seven sections, one per power, single page. A section indicator at the top (1 of 7 ... 7 of 7). Each power asks one claim question and two or three evidence questions.

1. For each power, a **claim** question first: "We have this." Answer have / maybe / no.
2. Then two or three **evidence** questions, each a specific observable thing, answered true / partly / false. The evidence questions never ask what you believe; they ask what you can show (a competitor who would lose money at your prices, a churned customer who came back, an incumbent who declined to copy you).

Submit button: "Classify my powers."

Output:
- **Your power map**, the identifier-level result: each of the seven sorted into HAS EVIDENCE, PLAUSIBLE, ABSENT, and the divergence flags where your claim and your evidence disagree, DELUSIONAL (you claimed it, the evidence says no), OVERSTATED (more sure than the evidence warrants), BLIND SPOT (you may have it and aren't leaning on it).
- For each real or plausible power, a benefit-and-barrier reading and **one observable test next quarter** that would confirm or kill it.
- **The honest headline**: the single biggest gap between what you believe and what you can show.

Below the output:
- `share this map`
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Hamilton Helmer's seven powers, turned into a diagnostic that separates the moats you have evidence for from the ones you're fooling yourself about. For each power you make a claim and then answer specific, observable evidence questions. The app classifies each power and, where your claim outruns your evidence, says so plainly: claiming network effects with nothing behind them is the headline finding, not a footnote. For every power that holds up, you get one test you can run next quarter to confirm or kill it. Built for founders, strategists, and investors who want a power map a board can read together, and who would rather hear "you don't have that moat" now than in a down round.

### 2b. How it works

The classification is deterministic and runs locally: each power's evidence answers are scored, sorted into has-evidence, plausible, or absent, and checked against your claim to raise the delusion, overstated, and blind-spot flags. The narration around that map is corpus-grounded and rendered by the chat assistant, drawn from `seven-powers.md` (Helmer's benefit-and-barrier discipline) plus `good-strategy-rumelt.md`, `distribution-as-moat.md`, and `ai-data-as-moat.md` for the moat-durability reasoning. The questions are fixed so the classification is honest; the assistant supplies the per-power reading and the test next quarter. Your answers stay local and are not stored remotely.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape owner-approved 2026-05-23 (DECISIONS.md): delusion-puncture.

**Draft:**

Everyone claims network effects. Almost no one has them. Let's find out which one you are.

**Alternate:**

Seven powers. You probably have one. You'll claim four.

---

## Editorial notes

- Block 2a names all three audiences (founders, strategists, investors) because the corpus framing is unsentimental about the reflexive "we have a moat" claim regardless of who is making it. The wedge is the same for each: claim, then prove.
- Block 2b describes the locked Phase 3 delivery honestly: deterministic local classification plus assistant-rendered corpus-grounded narration (Path 4 per `PHASE2_BUILD.md` #2). It deliberately does not name a single inference vendor, since the canonical surface is the `.mcpb` bundle where the host chat model renders.
- Block 3 is the owner-approved delusion-puncture shape (setup, then a challenge with an implied test). Distinct from the 12 locked Phase 0/1/2 shapes. The alternate is sharper on the "you'll over-claim" beat but loses the invitation; keep the first.
