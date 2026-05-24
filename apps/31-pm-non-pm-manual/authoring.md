---
app-id: 31
app-name: PM-for-Non-PMs Operating Manual
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #31 PM-for-Non-PMs Operating Manual

Items from the `## Autonomous-routine backlog` in `prompt.md`. Written in the
non-PM-leader register: the reader runs something real and knows their domain cold; the
PM frameworks adapt to their world, not the other way around. Plain, practical, second
person, never reverent about product management. Parenting is out of scope and appears
nowhere below.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `jobs-to-be-done.md` | YES | No change |
| `continuous-discovery.md` | YES | No change |
| `prioritization-frameworks.md` | YES | No change |
| `decision-making-frameworks.md` | YES | No change |
| `saying-no.md` | YES | No change |
| `communicating-tradeoffs.md` | YES | No change |
| `okrs.md` | YES | No change |
| `getting-buy-in.md` | YES | No change |

No substitutions needed. All eight anchors verified present 2026-05-24.

---

## The three artifacts — spine + per-domain rendering

The artifact titles are fixed. For each artifact: a domain-neutral spine (the source
PM move, stated plainly), then the four domain renderings the host fills in, then the
`scale` calibration line. The deterministic engine resolves the per-domain roster /
axes / candidates; the host renders the working artifact from this spine.

---

### Artifact 1 — JTBD interview kit
Anchors: `jobs-to-be-done`, `continuous-discovery`.

**Spine.** People do not buy products; they hire them to do a job. The job is what they
were trying to get done before you existed, and the loudest request is usually a feature,
not the job. The four questions that surface it (Moesta's switch interview, adapted): what
were you doing before, what were you trying to get done, what finally pushed you to change,
and what does "this worked" look like for you. You almost certainly already talk to the
people you serve. The kit just makes you separate the stated request from the underlying
job, and discount the request that comes from whoever is loudest rather than whoever has
the job.

- **school-principal:** Your users are students; your loudest voices are families and the
  district. Interview teachers about what slows good instruction and a handful of families
  about what they are hiring the school to do for their kid. The job is rarely "more
  homework" or "a new app"; it is "my kid is seen and is making progress." Listen for the
  workaround a family already built (the tutor, the spreadsheet). That is the unmet job.
- **nonprofit-ed:** Your users are beneficiaries; your buyers are donors and the board.
  The single most important discipline here is keeping the beneficiary interview separate
  from the donor preference. Ask a beneficiary what they did before your program existed
  and what they were trying to accomplish, not whether they like the program. Discount the
  donor's pet outcome until a beneficiary's job confirms it.
- **hospital-service-line:** Your users are patients; your team is clinicians; your buyers
  are administration and payers. Interview clinicians about pathway friction (where do they
  route around the official process) and patients about the real job, which is almost never
  "more appointments" and almost always "get back to my life." The workaround is the
  signal: the patient who skips the follow-up has told you something about the job.
- **research-lab-pi:** Your users are the people in your field who would act on a finding;
  your team is the lab; your buyers are funders. Interview the field about what decision a
  result would actually change ("if this were true, what would you do differently?") and
  lab members about what slows good science. Discount the reviewer-pleasing add-on
  experiment that changes no one's decision.

**Scale calibration.** small: this is three conversations, not a research program, and
that is enough to start. mid: build a short standing rhythm (a few interviews a quarter).
large: you have many stakeholder types; pick the two whose job is least understood and
interview those, not the ones easiest to reach.

---

### Artifact 2 — Prioritization rubric
Anchors: `prioritization-frameworks`, `decision-making-frameworks`.

**Spine.** RICE: Reach × Impact × Confidence ÷ Effort. The framework's real value is not
the number; it is forcing a relative ranking and an honest estimate of effort, then being
willing to cut, not just sequence. Two adaptations matter for you. First, relabel the axes
in your own terms so the score means something. Second, name the scarce resource honestly:
it is almost never money first; it is attention, change-fatigue, or the capacity of the
people who must adopt the change. And keep one **override gate** above the score: the thing
you must do regardless of how it ranks. Score everything else; never let the score
overrule the gate.

- **school-principal (curriculum / initiative changes):** Reach = students or classrooms
  touched. Impact = learning outcome and equity. Confidence = the evidence base behind the
  change. Effort = teacher time and change-fatigue (the real bottleneck). **Override gate:
  a district mandate.** You do not score whether to comply, you score how to scope it.
  *Worked example:* a new reading curriculum (Reach: all of K-2; Impact: high; Confidence:
  medium, decent evidence; Effort: high, heavy retraining) outranks a schoolwide tablet
  rollout (Reach: high; Impact: unproven; Confidence: low; Effort: high): the tablet's low
  confidence and unproven impact sink it despite equal reach.
- **nonprofit-ed (across competing asks):** Reach = beneficiaries served. Impact = mission
  outcome. Confidence = evidence it works. Effort = staff capacity. **Override gate:
  restricted funding.** A grant can buy a priority you would not otherwise pick; score the
  rest, but name the distortion out loud so the board sees what the restriction cost. *Worked
  example:* a deep program for 40 beneficiaries with strong evidence can outrank a shallow
  one for 400 with none; the rubric is how you defend the smaller number to a board that
  counts heads.
- **hospital-service-line (clinical-pathway changes):** Reach = patient volume on the
  pathway. Impact = outcomes and patient experience. Confidence = clinical evidence and
  guideline strength. Effort = clinician adoption and EHR change (adoption is the real
  cost). **Override gate: safety and regulatory.** A hard gate, never a score input; a
  safety fix ships whether or not it "scores." *Worked example:* a discharge-instruction
  redesign (high volume, real readmission impact, good evidence, moderate adoption cost)
  outranks a new optional screening with thin evidence.
- **research-lab-pi (research bets):** Reach = how much of the field would care. Impact =
  would it change practice or understanding. Confidence = feasibility and preliminary data.
  Effort = person-months and equipment. **Override gate: grant-cycle timing and funder
  scope.** The deliverable a funder is paying for this cycle is a gate, not a score. This
  is the domain where OKRs for grant-funded work are the most direct transfer: set the
  outcome the grant is accountable for, then prioritize bets against it. *Worked example:*
  a high-impact, low-feasibility moonshot ranks below a feasible result that the field is
  waiting on and that sets up the next grant.

**Scale calibration.** small: do this on one page, by hand, with the team in the room;
the conversation is the value. mid: keep a living rubric you revisit each planning cycle.
large: the rubric is your shield in the meeting. The stakeholders are many, and a written,
agreed scoring is how you keep a single loud voice from setting the agenda.

---

### Artifact 3 — "Stop doing" list
Anchors: `saying-no`, `communicating-tradeoffs`.

**Spine.** Yes-by-default is the most expensive habit there is; every yes commits future
capacity. Saying no is how you actually operate a strategy instead of just having one. Do
it well: lead with the rationale, not the rejection; acknowledge the request before
declining; offer an alternative (a smaller version, later, by someone else); be consistent
across who is asking; and do not over-apologize, because a confident no is clearer than an
anxious one. The hardest no in every domain below is to the person who funds or governs
you, and artifact 2's rubric is the cover that makes that no defensible: "here is what we
are prioritizing and why; this did not make the cut."

- **school-principal:** Stop the initiative pile-up (every year adds a program and none
  retire, so teachers carry ten half-implemented things). Stop the meeting that could be a
  memo. Stop collecting data nobody acts on. The hard no is to the district or a vocal
  parent group; the script: name the cut as protecting what is working, point at the rubric,
  offer the smaller pilot instead of the schoolwide rollout.
- **nonprofit-ed:** Stop mission drift via adjacent grants (the grant that is "close enough"
  pulls staff off the work that defines you). Stop founder-era reporting nobody reads. Stop
  the event that nets less than the staff time it costs. The hard no is to a donor; the
  script: thank them, restate the mission the gift would pull you from, and offer the
  version of their interest that does fit the mission.
- **hospital-service-line:** Stop low-value recurring visits and tests that persist out of
  habit. Stop the status meeting that produces no decision. Stop the dashboard nobody acts
  on. The hard no runs into defensive medicine ("but what if we miss one"); name that fear
  directly, show the evidence on the low-value test, and replace the blanket rule with a
  clear when-to-escalate trigger so the no is safer, not riskier.
- **research-lab-pi:** Stop the zombie project that is 80 percent done and will never
  publish (it is eating the person-months that could start the next thing). Stop chasing
  every reviewer suggestion. Stop the standing lab meeting that is status theater. The hard
  no is to a collaborator or a funder's scope creep; the script: tie the no to the grant's
  stated outcome, offer the narrower contribution you can actually deliver, and protect the
  lab's focus as the thing that makes the yes credible.

**Scale calibration.** small: the no is a direct conversation; you can stop something this
week. large: the no needs the rubric and usually a stakeholder you brief first
(`getting-buy-in`), because in a big org an unexplained stop reads as a threat rather than
a focus.

---

## Cross-cutting note for the host (renders into the brief, not as a section)

The connective tissue across all three artifacts is the same uncomfortable truth: in
every one of these domains the people you most need to move do not report to you. That is
exactly the PM's structural reality (`getting-buy-in`), and it is why the transfer works:
you already lead through influence, not authority. The manual names the moves you are
half-making and sharpens them. Do not preach product management; offer the tool and let
the user keep their own domain language.

---

## Synthetic domain+scale combos (golden-set evals)

Four combos, one per domain; the last carries a `biggest_friction` to exercise the coda.

**golden-pnp-01 — school-principal, mid.** Expect Artifact 1 to interview teachers + a
few families and discount the "more homework" feature-request; Artifact 2 to relabel the
RICE axes around students/classrooms, learning outcome, evidence, and teacher
change-fatigue, with the district mandate as the override gate; Artifact 3 to lead with
the initiative pile-up. Scale: a living rubric revisited each cycle.

**golden-pnp-02 — nonprofit-ed, small.** Expect Artifact 1 to keep the beneficiary
interview separate from donor preference; Artifact 2 to name restricted funding as the
distortion and defend a smaller deep program over a shallow large one; Artifact 3 to lead
with mission drift and the hard no to a donor. Scale: one page, in the room.

**golden-pnp-03 — hospital-service-line, large.** Expect Artifact 1 to read clinician
workarounds and the "get back to my life" patient job; Artifact 2 to set safety/regulatory
as a hard gate above the score; Artifact 3 to handle the defensive-medicine "but what if"
when stopping a low-value test. Scale: the rubric is the shield in a many-stakeholder
meeting.

**golden-pnp-04 — research-lab-pi, mid, biggest_friction = "I can't decide which of three
projects to drop."** Expect Artifact 2 (the rubric) to carry the weight, with grant-cycle
timing as the override gate and OKRs-for-grant-funded-work as the framing; Artifact 3 to
name the zombie project; and a FRICTION_CODA that points the user straight at Artifact 2 +
the stop-doing list as the two artifacts that resolve "which of three to drop," noting the
zombie-project pattern as the likely answer.
