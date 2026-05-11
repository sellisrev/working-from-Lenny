---
app-id: 38
app-name: Founder-mode vs Hire-PM
phase: 0
type: wizard / diagnostic
updated: 2026-05-11
---

# Page copy — #38 Founder-mode vs Hire-PM

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/founder-mode-vs-hire`:

- Four fields rendered in a single short form: how often you do PM-flavored work, whether you enjoy it, your CEO bandwidth across other functions, the next 6 months' product density.
- Submit button: "Tell me which".
- Output renders below in three sections: the verdict (stay founder-mode, hire APM, hire mid-level PM, hire head of product), what good looks like at that level, and the cost of getting it wrong.
- A line at the bottom of the output linking back to #12 if the user wants to revisit the timing question.

If the user arrived from #12 with a "yes" verdict, a note at the top of the form says "carried over from your previous answer".

No preamble above the form.

Below the output:
- `share this answer` (copies a URL with the verdict only, no inputs)
- `fuller read in Claude` (URL-trick handoff)
- `retake`
- `back to: should I hire a PM yet?` (#12)

Privacy: inputs are not stored. Only tool-invocation count.

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

This is the second half of the founder hiring question: not whether to hire a PM, but which one. Tell the app four things — how much PM-flavored work you do now, whether you actually enjoy it, your CEO bandwidth across other functions, and how product-dense the next six months will be — and the app returns one of four answers: stay founder-mode, hire an APM, hire a mid-level PM, or hire a head of product. Each answer comes with the specific cost of getting it wrong. The head-of-product wrong hire is by a long margin the most expensive: typically a year of company drag plus a six-month replace cycle. Pairs with #12 (Should I Hire a PM Yet?) as the second step in a two-part founder onboarding flow. Built for the founder ready to be honest about which rung they need next, and for the PM trying to advise their boss past a flattering wrong answer.

### 2b. How it works

The verdict is deterministic, drawn from the same founder-mode and team-composition topics as #12 but focused on the type-of-PM question instead of the timing question. Your time-on-product and your enjoyment of that work get the first cut: a founder who does PM work full-time and dislikes it has a different right answer than one who does it part-time and enjoys it. The six-month product density and your CEO bandwidth across other functions act as overrides. The decision tree is biased away from the head-of-product verdict for any non-heavy product density, because the corpus is consistent that head-of-product is the highest-cost wrong call and founders reach for it too soon when the answer is mid-level. The narration runs through Gemini Flash on the web with the usual free-tier ceiling.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Owner review point. Parenthetical-aside shape — new for the sequence (#53 two-beat, #44 tripartite, #51 single-line, #52 Q&A, #3 conditional, #12 fragments, #38 parenthetical).

**Draft:**

There's no shame in 'stay founder-mode' (until there is).

---

## Editorial notes

- Block 2a opens with the relationship to #12 ("the second half of the founder hiring question") because the two-step flow is the wedge. Audience-naming at the end (founder + PM advising boss) keeps the non-PM door open.
- Block 2b is explicit about the bias away from head-of-product because the bias is a load-bearing design decision that should not feel arbitrary.
- Block 3 parenthetical shape: the parenthetical undercuts the main statement. Voice constant (ironic-but-humble, owner's voice, no em dashes, no AI tells).
