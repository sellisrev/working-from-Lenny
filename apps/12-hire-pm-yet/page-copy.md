---
app-id: 12
app-name: Should I Hire a PM Yet?
phase: 0
type: wizard / diagnostic
updated: 2026-05-11
---

# Page copy — #12 Should I Hire a PM Yet?

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/hire-pm-yet`:

- Five fields rendered in a single short form: stage, team size, who does the PM work today, founder's % time on product, biggest bottleneck.
- Submit button: "Tell me".
- Output renders below in four sections: the verdict (yes/no/not yet), the PM type if applicable, the wrong-fit cost, and the signals that would flip the answer in either direction.
- If the verdict is "yes": a link to #38 (Founder-mode vs Hire-PM) for the second step.
- If the verdict is "not yet": the interim playbook renders as the second section instead of the PM type.

No preamble above the form.

Below the output:
- `share this answer` (copies a URL with the verdict only, no inputs)
- `fuller read in Claude` (URL-trick handoff)
- `retake`

Privacy: inputs are not stored. Only tool-invocation count.

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Founders agonize over when to hire their first product manager and tend to flip a coin. Tell the app five things: the company's stage, team size, who's doing the PM-flavored work today, your own time mix, and the biggest bottleneck this quarter. The app returns one of three answers (yes, no, or not yet), the type of PM to hire if it's yes (feature-team executor, empowered PM, or head of product), the typical wrong-fit cost if you pick the wrong type, and an interim playbook if the answer is not yet. Built for the founder who already suspects the right answer is uncomfortable, and the PM trying to help their boss think through it.

### 2b. How it works

The verdict itself is deterministic, drawn from a decision tree the corpus's founder-mode and team-composition topics agree on within reasonable bounds: stage gets the first cut, team size and your time on product narrow the answer, and the bottleneck flips a couple of edge cases. The narration (signals, wrong-fit cost, interim playbook) runs through Gemini Flash on the web with the usual free-tier ceiling. The wrong-fit cost numbers (12-18 months for a wrong head-of-product hire, for example) are typical ranges from the corpus, not promises. The decision tree is biased toward "not yet" for early stages because the corpus is consistent that founders hire too early more often than too late.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Owner review point. Three-fragment shape — new for the Block 3 sequence (#53 two-beat, #44 tripartite full sentences, #51 single-line, #52 Q&A, #3 conditional, #12 fragments).

**Draft:**

No. Soon. Not yet.

---

## Editorial notes

- Block 2a opens with the audience name ("founders") and closes with the secondary audience door (PMs advising their boss). No PM jargon used in a way that gatekeeps non-PM readers.
- Block 2b is explicit about the bias toward "not yet" because that bias is a load-bearing design decision and skipping it would make the verdict feel arbitrary.
- Block 3 fragment shape (three one-word/short statements) is intentionally distinct from prior Block 3s. Mirrors the trinary verdict structure (yes/no/not-yet) without naming it.
