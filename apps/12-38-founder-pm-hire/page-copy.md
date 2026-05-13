---
app-id: 12-38
app-name: Founder PM hire
phase: 0
type: wizard / diagnostic
updated: 2026-05-13
supersedes: [apps/12-hire-pm-yet, apps/38-founder-mode-vs-hire]
---

# Page copy — Founder PM hire (merged #12 + #38)

> Three blocks per `apps/_shared/aeo-seo-template.md`.
> Merged from #12 (timing) and #38 (level) into a single decision. One reconciled PM-level taxonomy: APM / empowered PM / head of product.

---

## Block 1: Value first

The working interface. On `/founder-pm-hire`:

- Eight fields rendered in a single short form: stage, team size, who does the PM work today, founder's time on product, founder's enjoyment of PM work, CEO bandwidth across other functions, next 6 months' product density, biggest bottleneck right now.
- Submit button: "Tell me".
- Output renders below in three sections: the verdict, what good looks like at that level (or the interim playbook if "not yet"), and the cost of getting it wrong.
- Five possible verdicts: `stay-founder-mode`, `not-yet` (with one of four interim playbooks), `hire-apm`, `hire-empowered-pm`, `hire-head-of-product`.

No preamble above the form.

Below the output:
- `share this answer` (copies a URL with the verdict only, no inputs)
- `fuller read in Claude` (URL-trick handoff)
- `retake`

Privacy: inputs are not stored. Only tool-invocation count.

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Founders agonize over the PM hiring question and tend to split it into two coin flips: "should I hire?" and "which level?". This app collapses both into one answer. Tell it eight things about your company's stage, your time on product, your appetite for the work, and what the next six months look like, and it returns one of five answers: stay founder-mode, not yet (with an interim playbook), hire an APM, hire an empowered PM, or hire a head of product. Each answer comes with what good looks like at that level and the typical cost of getting it wrong. Built for the founder who already suspects the right answer is uncomfortable, and the PM trying to help their boss think through it.

### 2b. How it works

The verdict is deterministic, drawn from a decision tree the corpus's founder-mode, hiring, and team-composition topics agree on within reasonable bounds. Stage and team size give the first cut. Your time on product and your enjoyment of it decide between staying in founder-mode and hiring. The product density of the next six months and your CEO bandwidth across other functions pick the level. The bottleneck flips a couple of edge cases — particularly the "we don't know what to build" answer, which routes to a clarity-first playbook rather than a hire. The tree is biased toward "not yet" for early stages, and biased away from "head of product" for any non-heavy product density, because the corpus is consistent that both of those are the most expensive wrong calls. The personalized narration runs through Gemini Flash on the web; the verdict itself doesn't need a model.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Owner review point. Three drafts — pick one.

**Draft A (fragments + parenthetical):**

Maybe. Not yet. Yes (and at which level).

**Draft B (cost-anchored):**

Five answers. One wrong call. Twelve wasted months.

**Draft C (two-beat):**

The when is uncomfortable. The which is more so.

---

## Editorial notes

- This app supersedes #12 ("Should I Hire a PM Yet?") and #38 ("Founder-mode vs Hire-PM"). The two were too close: both founder-facing, both touching the PM-type question with mismatched taxonomies. The fused version reconciles one taxonomy (APM / empowered PM / head of product) and collapses the two-step "if then which" into one answer.
- Block 2a opens with the audience name ("founders") and closes with the secondary audience door (PMs advising their boss). No PM jargon used in a way that gatekeeps non-PM readers.
- Block 2b is explicit about the two biases (toward "not yet" for early stages, away from "head of product" for non-heavy density) because those biases are load-bearing design decisions and skipping them would make the verdict feel arbitrary.
- Block 3 is new — replaces the locked drafts for #12 (fragments) and #38 (parenthetical). Three drafts above; owner picks one.
