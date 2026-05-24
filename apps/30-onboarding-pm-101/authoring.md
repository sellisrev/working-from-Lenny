---
app-id: 30
app-name: Onboarding to PM 101 for Non-PMs
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #30 Onboarding to PM 101 for Non-PMs

Items from the `## Autonomous-routine backlog` in `prompt.md`. Written in the non-PM register (the reader is on their second day), plain and lightly wry, never reverent about the PM role.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `how-x-builds-product.md` | YES | No change |
| `product-strategy.md` | YES | No change |
| `okrs.md` | YES | No change |
| `getting-buy-in.md` | YES | No change |
| `communicating-tradeoffs.md` | YES | No change |
| `saying-no.md` | YES | No change |
| `top-1-percent-pm.md` | YES | No change |
| `spotting-bad-pm-behaviors.md` | YES | No change |
| `pm-pitfalls.md` | YES | No change |
| `continuous-discovery.md` | YES | No change |
| `communicating-bad-news.md` | YES | No change |
| `managing-up.md` | YES | No change |
| `decision-making-frameworks.md` | YES | No change |

No substitutions needed. All thirteen anchors verified present 2026-05-24.

---

## The five lessons — spine + role lens + stage calibration

The lesson titles are fixed. For each: a role-neutral spine (the few-shot the host renders from), four role-lens deltas (engineer / designer / sales / customer-success; `other-cross-functional` falls back to the spine), and the stage-calibration line that sets how formal the rituals are.

### Lesson 1 — What artifacts you'll see, and what they actually mean
Anchors: `how-x-builds-product`, `product-strategy`, `okrs`.

**Spine.** You will see a PRD, a roadmap, a spec, and OKRs, and the words get used loosely. The one distinction that matters: a roadmap is a sequence of bets, a strategy is the reasoning that chose them. A spec describes what to build; the why behind it is the part you should always be able to find, and if you can't, that's a real gap, not your misunderstanding. OKRs are the outcomes the team is accountable for, not a task list.

- **engineer:** The spec is a hypothesis, not a contract. Read for the why behind the ticket; if it's missing, ask, because the hundred small implementation calls go better when you know the goal.
- **designer:** The roadmap tells you when, not what good looks like. Where the artifact is silent on craft, that silence is usually yours to fill.
- **sales:** The roadmap is not a promise you can sell. Learn to read commit ("we're building this") versus aspiration ("we'd like to"); selling the second as the first creates the escalations in Lesson 5.
- **customer-success:** OKRs tell you what the team will actually act on this quarter. Map a customer's pain to an OKR and you've turned a complaint into something a PM can prioritize.

**Stage calibration.** seed: most of these artifacts are a Slack thread or a one-pager, and that's fine. series-a-b: they're starting to formalize; expect a real roadmap doc. growth: the artifacts are load-bearing and reviewed. enterprise: the ritual is real and the documents are contracts of attention; learn the format.

### Lesson 2 — When and how to push back
Anchors: `getting-buy-in`, `communicating-tradeoffs`, `saying-no`.

**Spine.** Disagreement is the job, not a breach of it. The move that lands: separate "I'd build it differently" (a craft preference, often yours to win) from "this is the wrong thing to build" (a strategy challenge, which needs evidence). Bring the specific cost or the specific user, not a vibe, and give the PM a real opening to update. A good PM wants this; a bad one treats it as insubordination, which is itself a signal (Lesson 3).

- **engineer:** Two highest-value push-backs are estimate honesty ("this is a week, not a day, and here's why") and scope challenge ("the why is served by half of this").
- **designer:** Bring a prototype or a counter-proposal, not just a verbal critique; the corpus is clear that prototype-fluency wins these debates.
- **sales:** Frame the push-back as a named deal or segment at risk, not as a personal preference; "three deals stalled on X" moves a roadmap.
- **customer-success:** Turn the churn pattern into a bet: "if we fix X, here's the retention I'd expect," not "customers are unhappy."

**Stage calibration.** seed: push back in the moment, in the open; there's no process to route through. enterprise: there's a forum for it; use the forum, and route through your manager when the PM outranks you (Lesson 5).

### Lesson 3 — What a good PM looks like vs a bad one
Anchors: `top-1-percent-pm`, `spotting-bad-pm-behaviors`, `pm-pitfalls`.

**Spine.** The honest version: a good PM clears your path, owns the why, and makes the call when the call is theirs. A bad one is a ticket-mover with a Gantt chart who speaks for customers they never talk to and reprioritizes every week with no new information. You don't have to diagnose this on day two, but you should know the patterns exist and that naming them is fair, not disloyal. (Companion tool #46 is the diagnostic if the suspicion sharpens.)

- **engineer:** A good PM involves you in ideation and understands that details matter; a bad one calls everything a quick one-day job.
- **designer:** A good PM treats discovery as shared; a bad one hands you pixel-level specs and gets defensive when challenged.
- **sales:** A good PM helps you sell the truth; a bad one is a pure feature factory, shipping whatever the loudest account asked for with no thesis.
- **customer-success:** A good PM acts on your churn signal; a bad one treats internal stakeholders as if they were the customer.

**Stage calibration.** seed: the founder may be the PM, and "bad PM" patterns read differently when it's the person who started the company. enterprise: archetype mismatch is common; the question is often "wrong PM for this work," not "bad person."

### Lesson 4 — How to be useful in cross-functional rituals
Anchors: `continuous-discovery`, `getting-buy-in`.

**Spine.** Standup is for unblocking, not status theater. Planning is where scope gets set, so it's where your estimate and your concerns count most. Retro is for learning, and it only works if people are honest. Discovery is where the team decides what's real. The one contribution that makes you the person the PM wants in the room: come with the specific thing only your seat can see, said early enough to change the plan.

- **engineer:** In planning, the honest estimate and the "this dependency will bite us" flag are your highest-leverage moments.
- **designer:** Discovery is your home turf; bring the user-behavior observation the PM can't get from a dashboard.
- **sales:** In discovery and planning, the pattern across deals (not the one loud anecdote) is the gold.
- **customer-success:** Your churn and support data is discovery data; bring the pattern, framed as a hypothesis.

**Stage calibration.** seed: the "rituals" are informal and you can shape them; show up with substance and you'll define the norm. enterprise: the rituals are fixed and crowded; the skill is being concise and bringing the one thing only you know.

### Lesson 5 — When to escalate
Anchors: `communicating-bad-news`, `managing-up`, `decision-making-frameworks`.

**Spine.** Most friction you absorb; some you flag. The line: a one-off bad call you let go, a repeated pattern that's degrading the work you escalate. Escalate with documented examples and impact, not character judgments, and propose what would help. If the PM is more senior than you, route through your own manager rather than going around them. Done well, escalation protects the work without torching the relationship.

- **engineer:** Escalate when repeated direction changes are burning real engineering time; bring the dates and the rebuilt work.
- **designer:** Escalate when craft quality is being overridden in a way that will ship something the team is embarrassed by; bring the prototype that shows the gap.
- **sales:** Escalate the deal-blocking gap with the revenue at risk attached; that's the version leadership acts on.
- **customer-success:** Escalate when a churn-driving issue keeps getting deprioritized despite the pattern; bring the retention math.

**Stage calibration.** seed: escalation is a hallway conversation with the founder. enterprise: there's a chain; respect it, and `managing-up` matters more the larger the org.

---

## Synthetic role+stage combos (golden-set evals)

Five combos, one per role, each naming the expected tailoring emphasis.

**golden-onb-01 — engineer at a series-a-b company.** Expect Lesson 1 to stress spec-as-hypothesis and reading the why; Lesson 2 to lead with estimate honesty and scope challenge; Lesson 4 to spotlight planning. Stage calibration: artifacts are starting to formalize.

**golden-onb-02 — designer at a growth company.** Expect Lesson 1 to stress where craft judgment outranks the PM and where it doesn't; Lesson 3 to name defensive pixel-spec PMs; Lesson 4 to frame discovery as home turf. Stage calibration: rituals are load-bearing and reviewed.

**golden-onb-03 — sales at an enterprise company.** Expect Lesson 1 to stress commit-vs-aspiration on the roadmap; Lesson 5 to lead with the deal-blocking gap and revenue-at-risk; managing-up emphasized. Stage calibration: the ritual is real, route through the chain.

**golden-onb-04 — customer-success at a seed company.** Expect Lesson 1 to frame churn signal as discovery data; Lesson 2 to turn complaints into bets; informal-rituals calibration ("most of this is a Slack thread"). The user can shape the norms.

**golden-onb-05 — other-cross-functional at a series-a-b company, with biggest_confusion = "why does the roadmap keep changing?"** Expect the role-neutral spine on all five lessons, plus a CONFUSION_CODA that answers the roadmap-churn question directly using Lesson 1 (roadmap as bets vs strategy as reasoning) and Lesson 3 (whiplash with no new information is a named bad-PM pattern, but some change is healthy re-prioritization).
