---
app-id: 18
app-name: Difficult-Conversations Rehearsal
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #18 Difficult-Conversations Rehearsal

Items from the `## Autonomous-routine backlog` in `prompt.md`. Clones #17's structure; this file authors only what differs (the six scenarios, the rubric content, the fournier mode). The host conducts the dialog from these.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `difficult-conversations.md` | YES | No change |
| `communicating-bad-news.md` | YES | No change |
| `giving-feedback-as-leader.md` | YES | No change |
| `performance-reviews.md` | YES | No change |

Fournier attribution check (open question #2, settled here): `grep` confirms Camille Fournier is quoted in `giving-feedback-as-leader.md` and `performance-reviews.md`, but NOT in `difficult-conversations.md` or `communicating-bad-news.md`. So fournier mode names her only in the two scenarios those files ground (poor-performance, pip-kickoff feedback framing); elsewhere it says "canonical leadership guidance in the corpus." Logged to DECISIONS.md 2026-05-24.

No substitutions needed. All four anchors verified present 2026-05-24.

---

## The six scenario personas

Each: how the counterparty realistically reacts, and the trap the scenario sets for the user.

| Scenario | Counterparty reaction (in persona) | The trap it sets |
|---|---|---|
| **poor-performance** | The report is surprised or defensive; may externalize ("the requirements kept changing"). | Softening the message into ambiguity so they leave unsure whether it was serious. |
| **peer-escalation** | The peer is defensive and frames the end-run as efficiency ("I was just moving fast"). | Making it about authority or turf instead of impact, which escalates the conflict. |
| **layoff-delivery** | The report is shocked; may go silent, or get emotional. | Over-explaining the business rationale to ease your own discomfort, which robs them of dignity and the moment to react. |
| **scope-cut-to-customer** | The customer feels betrayed and may threaten to churn. | Hiding behind "the company decided," or over-promising a replacement to smooth it over. |
| **killing-pet-project** | The exec is invested; may pull rank or get emotional. | Hedging ("maybe we revisit next year") to dodge the conflict, leaving the project undead. |
| **pip-kickoff** | The report hears "I'm being managed out" and shuts down or panics. | Blurring whether the PIP is a genuine path to success or a formality, which destroys trust either way. |

Silence is the dimension most people fail (per `difficult-conversations.md`, `communicating-bad-news.md`): the four seconds after the hard sentence belong to the other person.

---

## Canonical handling per scenario (silence beat marked)

The version the coach delivers. The hard sentence is stated plainly; `[pause]` marks where the user must stop and let the other person respond.

**poor-performance**
> "I want to be direct with you: your last two deliverables didn't meet the bar we need, and that has to change. `[pause: let them respond]` I'm telling you now because I think you can close the gap, and I'd rather you hear it clearly than wonder. Here's specifically what meeting the bar looks like, and the support I'll give you."
> *Why it works:* clarity and empathy together; the pause hands them the floor instead of softening the message away.

**peer-escalation**
> "Decisions on X keep getting made without looping me in, and it's creating rework for both our teams. `[pause]` I'm not raising this as a turf thing; I want us to agree where the line is so we stop tripping over each other. What's the fastest way for us to stay in sync?"
> *Why it works:* leads with impact, not authority (getting-buy-in framing), and invites a shared fix rather than a fight.

**layoff-delivery**
> "I have hard news, and I'm going to say it plainly: your role is being eliminated, and today is your last day. `[pause: say nothing, let it land]` This is not a reflection of your work, and I'll walk you through exactly what happens next and the support you'll have."
> *Why it works:* dignity and the silence beat are the whole thing here. You deliver it and stop.

**scope-cut-to-customer**
> "I owe you a straight answer: we've decided not to build the X we discussed, and I made that call. `[pause]` I know that's a real cost to you, and I won't dress it up. Here's the why, what we are doing that touches the same need, and the honest timeline."
> *Why it works:* owns the decision in the first person (decisiveness, not 'the company decided') and resists the over-promise.

**killing-pet-project**
> "I've decided to stop X, and I wanted to tell you directly rather than let it drift. `[pause]` I know you've put real care into it. Here's the reasoning, and I'm not leaving it as a maybe: it's done, and here's where that lets us focus."
> *Why it works:* decisiveness kills the undead 'revisit later,' while the acknowledgment keeps the exec's dignity intact.

**pip-kickoff**
> "I'm putting you on a formal improvement plan, and I want to be clear what that means: it's a genuine path back on track, not a countdown. `[pause]` Here are the specific outcomes, the timeline, and the support, and I'll be working it with you."
> *Why it works:* clarity about what the PIP actually is kills the ambiguity trap; empathy and dignity keep trust alive.

---

## "What would Camille Fournier do" mode — keep / cut / missing-move template

The user pastes their intended opening; the narration contrasts it with canonical leadership guidance. Template the host fills (framed as guidance, not a verdict):

```
Keep:    {the part of your opening that already does empathy-then-clarity well}
Cut:     {the hedge, the over-explanation, or the 'the company decided' deflection}
The one move you're missing: {the canonical move your opening skips — usually
         either stating the hard thing and then letting silence work, owning the
         decision in the first person, or saying plainly what the plan IS}
```

Attribution rule: name Camille Fournier only for the scenarios grounded in `giving-feedback-as-leader.md` / `performance-reviews.md` (poor-performance, pip-kickoff). For the other scenarios, attribute to "canonical leadership guidance in the corpus." Never put a specific quote in her mouth that the corpus doesn't carry.

---

## Synthetic scenario+approach pairs (rubric evals)

Six pairs: one strong response, one that fills the silence (the signature #18 failure), with the expected rubric read.

**golden-dc-01 — poor-performance.** Strong: states the bar miss, pauses, then offers the path. → high on clarity, silence, dignity. Fills-the-silence: states the miss then immediately piles on reassurance and excuses for them. → flags silence (filled) and clarity (softened to ambiguity).

**golden-dc-02 — peer-escalation.** Strong: impact framing, then a shared-fix question. → high on clarity, decisiveness, relationship/dignity. Weak: "you keep going around me and it needs to stop" (authority/turf). → flags empathy and dignity.

**golden-dc-03 — layoff-delivery.** Strong: plain sentence, long pause, then logistics. → high on clarity, silence, dignity. Fills-the-silence: delivers the news then talks for a paragraph about the macro environment. → flags silence (filled to ease own discomfort) and dignity.

**golden-dc-04 — scope-cut-to-customer.** Strong: "I made that call," owns it, no over-promise. → high on decisiveness, clarity. Weak: "the company decided and there's nothing I can do" + a vague promise of something later. → flags decisiveness (hides behind the company) and clarity (over-promise).

**golden-dc-05 — killing-pet-project.** Strong: "it's done," with the reasoning and acknowledgment. → high on decisiveness, dignity. Weak: "let's maybe revisit next year" to avoid the conflict. → flags decisiveness (leaves it undead) and clarity.

**golden-dc-06 — pip-kickoff.** Strong: names the PIP as a genuine path, with outcomes and support, then pauses. → high on clarity, empathy, silence. Weak: euphemisms that blur whether it's a real chance or a formality. → flags clarity (ambiguity) and dignity (trust). Fournier-mode check: name Fournier (performance-reviews.md grounds this) in the keep/cut/missing-move.
