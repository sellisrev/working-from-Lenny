---
topic_slug: spotting-bad-pm-behaviors
display_name: Spotting bad PM behaviors as a cross-functional partner
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2021-08-10 .. 2026-04-23
---

# Spotting bad PM behaviors as a cross-functional partner

Written for engineers, designers, sales, marketing, support, and other non-PM partners who suspect they're working with a poor PM and want to (a) confirm the diagnosis, (b) decide whether and how to push back, (c) decide whether to escalate.

## Current consensus

The corpus has converged on a clear taxonomy of bad-PM patterns. Cross-functional partners can spot these without needing to become PMs themselves.

### The five most common new-PM pitfalls (Lenny, 2021)

1. **The Coordinator** — they treat themselves as a project manager. Specs are about *who does what by when*, not *why this is the right thing to build*. **How to spot**: when you ask "why this feature?", they answer with stakeholders, not with customers.
2. **The Dictator** — fully embraces "mini-CEO." Micromanages decisions, expects engineers / designers to execute their plans. **How to spot**: their specs are extremely detailed; no room for input; they get defensive when challenged.
3. **The Dreamer** — vision without execution. Lots of strategy, no delivery. **How to spot**: roadmaps perpetually 6+ months out; little ships in the next 4-8 weeks.
4. **The Feature Factory** — ships everything sales / leadership asks for. Cf. John Cutler's "feature factory" concept. **How to spot**: the team's roadmap is reactive to the loudest stakeholder, not driven by a hypothesis about user value.
5. **The Busted Umbrella** — fails to shield the team from chaos. Every executive ask becomes a P0; engineering is constantly thrashing. **How to spot**: priorities change weekly; engineers describe the team as exhausted but unproductive.

### The five most annoying PM habits (Lenny, 2021, from Twitter survey)

6. **Obsessing over frameworks** — applies Twitter-celebrity framework dogmatically to a team that doesn't fit it. **How to spot**: they reference the framework more than the customer; the team makes passive-aggressive jokes about it.
7. **Prioritizing impulsively** — anecdotal data drives roadmap. **How to spot**: > 50% of the time you ask "why this priority?", you're not satisfied with the answer; the team pushes back routinely.
8. **Expecting everything to be quick** — doesn't understand engineering effort estimation. Cf. Camille Fournier's "details matter" warning. **How to spot**: they regularly say "this should be a 1-2 day thing" for work that takes a week.
9. **Avoiding decisions** — punts hard calls back to the team. **How to spot**: cross-functional partners feel the call is theirs to make even though it should be the PM's.
10. **Being too prescriptive** — see "The Dictator" above.

### Camille Fournier's four engineer-side complaints (2024)

11. **Hoarding credit.** Cf. [working-with-pms-as-engineer](working-with-pms-as-engineer.md).
12. **Not understanding details and acting like they don't matter.**
13. **Not involving engineers in ideation.**
14. **Triggering major rewrites without understanding the cost.**

### The 2026 AI-era addition

15. **Not engaging with AI tooling personally.** A 2026 PM who refuses to use Cursor / Claude Code / Bolt and treats AI as "engineers' problem" is increasingly unable to do their own job. **How to spot**: they can't explain what's hard about an AI feature; they over-promise on AI capability; they don't have a personal "AI product sense" (cf. [ai-pm-skills](ai-pm-skills.md)).

## What this means for non-PM consumers

- **If you're noticing one or two of these patterns**: it's not necessarily a bad PM. Coordination work matters. Frameworks help. Detailed specs are sometimes correct. Talk to the PM, share your perspective, see if they update.

- **If you're noticing four or more**: you're probably working with a PM who hasn't internalized the role. Direct feedback (via [GAIN framework](https://www.lennysnewsletter.com/p/introducing-the-gain-framework-for-feedback-an-evidence-based-approach-to-giving) or similar) is the first move. Escalate only if direct feedback fails.

- **If you're an engineering or design lead noticing patterns across multiple PMs in your org**: the issue is leadership / hiring / culture, not individual PMs. Consider a 1:1 with the head of product about the patterns you're observing. Bring data (specific examples, dates, decisions) — not just impressions.

- **If you're an exec or founder concluding "PM as a function isn't working here"**: pause. Read [understanding-pm-role-as-non-pm](understanding-pm-role-as-non-pm.md) first. The "PM is broken" framing is sometimes correct (especially in 2026 with the bifurcation Singhal describes) but often signals that hiring or leadership has selected for the wrong PM archetype, not that the function is unviable.

- **If you're a candidate evaluating a job offer**: when interviewing, ask non-PM members of the team "what's hard about working with PMs here?" Honest answers expose the patterns above. If the engineering manager can't articulate what their PMs do well, the role probably has structural problems beyond your potential predecessor.

## How to push back constructively

- **For the Coordinator pattern**: ask "what user need are we serving with this prioritization?" Give them a chance to articulate it; if they can't, escalate.

- **For the Dictator pattern**: bring concrete prototypes / counter-proposals (cf. Aparna Chennapragada / Ravi Mehta — prototypes are now table stakes for cross-functional debate). Engineers and designers with prototype-fluency win these fights more often than ones who only have verbal critiques.

- **For the Feature Factory pattern**: ask "what hypothesis does this feature test? What would success look like?" If there's no answer, the work is reactive, not strategic.

- **For the Busted Umbrella pattern**: directly tell the PM "we can't ship X this sprint because Y is also live, and changing again next week kills our velocity." Make the cost of context-switching visible.

- **For the AI-disengaged pattern (2026)**: send them the Tal Raviv & Aman Khan [How to build AI product sense](https://www.lennysnewsletter.com/p/how-to-build-ai-product-sense). Suggest they spend one week using Cursor for daily work. If they refuse, the pattern is likely permanent.

## How thinking has evolved

Earliest takes (corpus, oldest first):

- **2021-08-10**: Lenny — "Five habits of highly annoying product managers." Twitter-survey-driven; codified the early canon. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/five-habits-of-highly-annoying-product-managers))

- **2021-12-07**: Lenny — "The most common pitfalls of new product managers." Five pitfalls (Coordinator, Dictator, Dreamer, Feature Factory, Busted Umbrella) — the classic taxonomy. ([Lenny's Newsletter](https://www.lennysnewsletter.com/p/the-most-common-pitfalls-of-new-product-managers))

Middle period:

- **2024-09-15**: Camille Fournier — engineer-side perspective on what bad PMs do, codified four specific complaints (credit-hoarding, detail-dismissal, ideation-exclusion, rewrite-naivety).

Recent takes:

- **2025-various**: "Product manager is an unfair role. So work unfairly" (Lenny, related newsletter): reframes PM challenges as structural; doesn't dispute the bad-PM taxonomy but adds context.

- **2026-04-19**: Nikhyl Singhal — bifurcation framing. Information-mover PMs pattern-match exactly to "Coordinator + Feature Factory" combo. The structural question goes from "is this PM bad?" to "is this PM the wrong archetype for AI-native work?"

External current consensus (web, weighted recent + AI-aware):

- Marty Cagan's "[Top 12 Product Management Mistakes](https://svpg.com/assets/Files/toppmmistakes.pdf)" remains the canonical reference.
- Ben Horowitz's "[Good Product Manager / Bad Product Manager](https://a16z.com/good-product-manager-bad-product-manager/)" is widely cited for the bad-PM signs.
- Shreyas Doshi's tweet thread on "Good Product Managers, Great Product Managers" extends the framing.

## Inflection points

- **Lenny's pitfalls + annoying-habits pieces (2021)**: codified the cross-functional-partner-side view of bad PMs.
- **Fournier's episode (Sept 2024)**: engineer-side complaints crystallized.
- **Singhal bifurcation framing (April 2026)**: reframed bad-PM patterns as archetype mismatch, not individual failure.

## Open questions

- Is the "Feature Factory" pattern always bad, or sometimes the right operating mode (early-stage / pre-PMF / customer-success-driven companies)? Marty Cagan and Lenny both lean toward "always bad in the long run"; some founders disagree for short-term phases.
- Are the patterns above generally fixable through coaching, or are they more often hire-mistakes? Corpus consensus is that 2-3 are coachable (Coordinator with mentorship, Dreamer with delivery training); 2-3 are hire-mistakes (Dictator, deeply Feature Factory).
- For very-large-org PMs whose role really is largely orchestration: are the patterns above bugs or features? Singhal's "information mover dinosaur" framing suggests they're bugs.

## See also

- Related topics: `understanding-pm-role-as-non-pm`, `working-with-pms-as-engineer`, `working-with-pms-as-designer`, `working-with-pms-as-sales`, `pm-pitfalls`, `pm-influence`, `ai-replacing-pms`, `ai-pm-skills`, `giving-feedback-as-leader`.
- Books: [Inspired](../books/inspired.md), [The Manager's Path](../books/managers-path.md). Ben Horowitz's blog post above.
