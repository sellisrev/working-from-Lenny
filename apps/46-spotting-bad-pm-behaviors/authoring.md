---
app-id: 46
app-name: Spotting Bad PM Behaviors (field guide)
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #46 Spotting Bad PM Behaviors

Items from the `## Autonomous-routine backlog` in `prompt.md`. Written in the non-PM register: the reader is an engineer, designer, sales rep, or CS lead, not a PM.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `spotting-bad-pm-behaviors.md` | YES | No change |
| `pm-pitfalls.md` | YES | No change |
| `continuous-discovery.md` | YES | No change |
| `saying-no.md` | YES | No change |
| `defending-big-bets.md` | YES | No change |
| `decision-making-frameworks.md` | YES | No change |
| `top-1-percent-pm.md` | YES | No change |
| `getting-buy-in.md` | YES | No change |
| `communicating-bad-news.md` | YES | No change |
| `managing-up.md` | YES | No change |

Named-author cross-check:
| Author | Corpus presence | Action |
|---|---|---|
| Camille Fournier | Present (spotting-bad-pm-behaviors.md: four engineer-side complaints, 2024) | No change |
| Lenny Rachitsky | Present (spotting-bad-pm-behaviors.md: 2021 pitfalls + annoying-habits taxonomy) | No change |
| John Cutler | Present (spotting-bad-pm-behaviors.md: feature-factory concept) | No change |
| Nikhyl Singhal | Present (spotting-bad-pm-behaviors.md: 2026 bifurcation framing) | No change |

No substitutions needed. All ten anchors verified present 2026-05-24. The prompt's build note (cross-check before locking) is satisfied: every named anchor resolves to a real file.

---

## Per-behavior diagnosis line (15)

One corpus-anchored "what this usually means" line per behavior, in the non-PM register, with the named source where the corpus attributes it. Severity weight (1-3) carried from the prompt for the scoring engine.

| # | Behavior (as the non-PM sees it) | What this usually means | Anchor(s) | Sev |
|---|---|---|---|---|
| 1 | Never talks to paying customers, but speaks for them constantly | This is the Coordinator pattern (Lenny, 2021): when you ask "why this?", the answer is a stakeholder, not a customer. A PM who never does discovery is guessing, and dressing the guess as the customer's voice. | spotting-bad-pm-behaviors, continuous-discovery | 3 |
| 2 | Dismisses details as "small" without understanding why they aren't | Camille Fournier's detail-dismissal complaint. Calling something a one-day job they don't understand erodes the team's trust and usually means the spec was never thought through. | spotting-bad-pm-behaviors | 3 |
| 3 | Presents the team's work as their own; engineers and designers go uncredited | Fournier's credit-hoarding complaint. It is the fastest way to lose a team, and it signals the PM measures themselves by visibility, not outcomes. | spotting-bad-pm-behaviors | 3 |
| 4 | Can't say why you're building something beyond a stakeholder's name | The Coordinator again: specs about who-does-what-by-when, never why-this-is-right. If "because Sales asked" is the whole answer, no one is steering toward user value. | pm-pitfalls, spotting-bad-pm-behaviors | 3 |
| 5 | Avoids the decision; waits for consensus and calls the wait "alignment" | The avoiding-decisions pattern: the call that should be theirs gets punted to the team. Consensus-seeking that never resolves is indecision with better branding. | spotting-bad-pm-behaviors, decision-making-frameworks | 3 |
| 6 | Roadmap whiplash; priorities reorder every week with no new information | The Busted Umbrella: every executive ask becomes a P0 and the team thrashes. Reprioritizing without new information means the PM isn't shielding the team or holding a thesis. | pm-pitfalls, defending-big-bets | 3 |
| 7 | Says yes to everyone; never defends a tradeoff to a stakeholder | The Feature Factory (Cutler): the roadmap is reactive to the loudest voice. A PM who can't say no isn't protecting the bet, they're outsourcing it. | saying-no | 2 |
| 8 | Specs hand over the what and the when but never the why | Coordinator-flavored: a spec without a why leaves engineers unable to make the hundred small calls well. The why is the PM's actual job. | pm-pitfalls | 2 |
| 9 | Runs standup as a status broadcast, not coordination | Process-as-theater: if standup is a round of updates with no decisions, it's a status report the PM could have read async. Coordination means unblocking, not narrating. | pm-pitfalls, spotting-bad-pm-behaviors | 2 |
| 10 | Ships and moves on; never asks whether the last thing worked | No outcome loop: shipping is treated as the finish line, not the experiment. Without a "did it work?" the team can't learn, and the PM can't tell strategy from activity. | pm-pitfalls | 2 |
| 11 | Hides from the post-mortem, or runs it as blame-diffusion | A top-1% PM (the corpus's bar) runs the retro toward learning, not cover. Blame-diffusion retros teach the team to stop being honest. | spotting-bad-pm-behaviors, top-1-percent-pm | 2 |
| 12 | "Data-driven" is a way to avoid owning a judgment call | Data as a shield: real judgment calls get hidden behind "the data will tell us." Sometimes the data can't, and the PM is paid to decide anyway. | pm-pitfalls | 2 |
| 13 | Treats internal stakeholders as if they were the customer | Stakeholder-as-proxy: optimizing for the loudest internal voice instead of the user is how discovery quietly dies. The customer and the VP who emailed are not the same person. | continuous-discovery | 2 |
| 14 | Over-rotates on the loudest complaint; one Slack message reorders the quarter | Anecdote-driven prioritizing: a single vivid complaint outweighs the pattern. One angry message is a data point, not a roadmap. | continuous-discovery | 1 |
| 15 | Confuses being busy with being useful; the calendar is full, the why is empty | Motion mistaken for progress: a packed calendar can hide the absence of a thesis. Busy is not the same as moving the thing that matters. | top-1-percent-pm | 1 |

---

## Action-ladder scripts

Four rungs, each ≤4 sentences, anchored. The deterministic engine picks the default rung from observed frequency + severity (per the prompt's rung-selection table); the narration explains and can nuance it.

**private_feedback** (default: sometimes + severity ≤ 2)
> Raise it directly and once, framed as your own experience, not a verdict. Per `getting-buy-in.md`, lead with the specific moment and the effect it had on your work ("when the spec didn't say why, I built the wrong thing twice"), then ask an open question and let them respond. The GAIN-style move is evidence plus a real opening to update, not an ambush. Give it a genuine shot before you escalate; most one-or-two-pattern situations resolve here.

**document_then_feedback** (default: often + severity 2)
> Start keeping a short, factual record: the behavior, the date, the concrete cost (a rebuilt feature, a missed decision). You're not building a case file, you're replacing "it feels like" with "on these three dates." Then have the private conversation with the examples in hand, per `getting-buy-in.md`. Documentation makes the feedback specific and gives you something real if you do need to escalate later.

**document_and_escalate** (default: often + severity 3)
> When a high-severity pattern is frequent and direct feedback hasn't moved it, bring it to your manager or the head of product, with the documented examples. Per `communicating-bad-news.md`, frame it around impact on the work and the team, not the person's character, and propose what would help. If the PM is more senior than you, `managing-up.md` applies: route it through your own manager rather than going around them. Bring dates and decisions, not impressions.

**reframe_or_leave** (default: pattern spans 3+ severity-3 behaviors)
> When several severe patterns cluster, the honest question is whether this is fixable from where you sit. Some patterns are coachable (the corpus puts the Coordinator and Dreamer here); two or three (entrenched Dictator, deep Feature Factory) are usually hire-mistakes that an IC can't fix. Document, escalate once with the full picture, and give it a defined window. If nothing changes and it's degrading your work and well-being, leaving is a legitimate, non-dramatic option, not a failure on your part.

---

## Synthetic scenarios (golden-set evals)

Six "my PM does X" scenarios spanning green / yellow / red, with expected tier and top patterns.

**golden-spot-01 — green (strong PM, impatient partner)**
> Ratings: "haven't seen it" on 13 of 15; "sometimes" on #9 (standup) and #14 (loudest complaint). The user is a senior engineer frustrated by pace.

Expected: **green** (total ≤ 6). No high-severity patterns. Fairness check fires: "Either you have a genuinely strong PM or the friction is somewhere you haven't looked. Both are worth knowing." No action rung beyond "maybe the gap is expectation."

**golden-spot-02 — green (everything unseen)**
> Ratings: "haven't seen it" on all 15.

Expected: **green**, zero patterns. The expectation-gap headline, gently: the tool found nothing, so the friction, if real, is somewhere else.

**golden-spot-03 — yellow (a couple of real patterns)**
> Ratings: "often" on #8 (specs with no why) and #10 (ships and moves on); "sometimes" on #4, #9, #12; rest unseen.

Expected: **yellow** (total in 7-16). Top patterns: #8, #10, #4. Action rung: document_then_feedback on the "often" severity-2 patterns. Fairness check: these are coachable; worth a direct conversation.

**golden-spot-04 — yellow tipping toward red**
> Ratings: "often" on #5 (avoids decisions) and #6 (roadmap whiplash); "sometimes" on #2, #7, #13.

Expected: **yellow or low red** (two severity-3 "often" patterns push the total up). Top: #6, #5, plus one of the sometimes. Action rung: document_and_escalate on #5/#6. The diagnosis names indecision and thrash plainly.

**golden-spot-05 — red (clear pattern)**
> Ratings: "often" on #1, #3, #4, #5; "sometimes" on #2, #6, #11; rest unseen.

Expected: **red** (total ≥ 17). Top: #1, #3, #4 (three severity-3 patterns). Action rung: reframe_or_leave is in play because 3+ severity-3 behaviors cluster. Direct line: this is a pattern, not a bad week. Credit-hoarding (#3) is named with Fournier's attribution.

**golden-spot-06 — red (Feature Factory + busted umbrella)**
> Ratings: "often" on #6, #7, #4, #10; "sometimes" on #5, #8, #12.

Expected: **red**. Top: #6, #4, #7. The diagnosis ties the cluster to the Feature-Factory / Busted-Umbrella combination (reactive roadmap + no shielding + no why + no outcome loop). Action rung: document_and_escalate, with the reframe question raised given the breadth.
