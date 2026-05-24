---
app-id: 31
app-name: PM-for-Non-PMs Operating Manual
phase: 3
type: generator (per-domain artifact set, no scoring state)
updated: 2026-05-24
neighbor: 30, 52
---

# Engine — #31 PM-for-Non-PMs Operating Manual

> Translates the core PM operating frameworks for leaders in domains where product
> thinking would help but does not yet exist as practice. The user picks one of four
> non-parenting domains; the tool returns three working artifacts adapted to that
> domain's stakeholder reality: a **JTBD interview kit**, a **prioritization rubric**,
> and a **"stop doing" list**. Not a quiz and not a score: a **generator**, cloning
> #30 Onboarding's four-tool Path-4 architecture (structured input -> domain-specific
> directives -> corpus-grounded narration) with three fixed artifacts in place of
> #30's five fixed lessons. No per-user state.

## Scope note (read first)

**Parenting is out of scope.** The parenting adaptation of this idea already has an
incumbent (tinyStakeholders.com). This app ships the **non-parenting domains only**:
school principals, nonprofit executive directors, hospital service-line leads, and
research-lab principal investigators. Do not draft, render, or offer a parenting
domain. tinyStakeholders is studied as proof the cross-domain transfer works, not
displaced.

## Audience and framing

The user runs something, has real stakeholders, and has never been called a product
manager. They are not trying to become one. They have heard that "product thinking"
might help and want the parts that transfer, in their own vocabulary, without the SaaS
jargon. The transfer is real and specific: you already do discovery (you talk to the
people you serve), you already prioritize (you have more asks than capacity), and you
already over-invest in things you should stop. The PM craft just names those moves and
gives them a sharper edge. Tone is plain, practical, and respectful of the user's own
domain expertise: the frameworks adapt to their world, not the other way around. Never
reverent about product management, never "here is how tech does it better."

Pairs conceptually with #30 (the cross-functional non-PM orientation) and #46
(the bad-PM diagnostic); #31 is the cross-*domain* sibling: same transfer, different
walk of life.

## Inputs

- `domain` (enum, required): `school-principal` / `nonprofit-ed` / `hospital-service-line` / `research-lab-pi`
- `scale` (enum, optional): `small` / `mid` / `large` — calibrates stakeholder count and how formal the rituals are (a 12-person nonprofit vs a national one; a single-school principal vs a district lead; a 4-person lab vs a center). Defaults to `mid`.
- `biggest_friction` (free text <=200 chars, optional): "The one decision or tension you most want a framework for." Drives an optional coda.

## The three fixed artifacts

The artifact *titles* are fixed; the *content* is tailored to `domain` (+ `scale`).
Each artifact is a usable working document, not an essay.

```
1. JTBD interview kit
   Who to interview (the domain's "users" vs its "buyers"/funders), the handful of
   questions that surface the job they are actually hiring you for, and what to listen
   for vs what to discount. The point: separate the stated request from the underlying
   job, in a domain where the loudest voice is rarely the user.
   Anchors: jobs-to-be-done, continuous-discovery

2. Prioritization rubric
   A RICE-style rubric relabeled for the domain, with the four axes named in the
   domain's own terms and the scarce resource named honestly (it is almost never money
   first; it is attention, change-fatigue, clinician/teacher adoption, or person-months).
   Includes the one gate that overrides the score (safety/regulatory in healthcare;
   mandates in schools; restricted funding in nonprofits; grant-cycle timing in labs).
   Anchors: prioritization-frameworks, decision-making-frameworks

3. "Stop doing" list
   The three or four things this domain reliably over-invests in, why each persists,
   and the script for stopping it given who you have to say it to. The honest part:
   the hardest no in each domain is to the person who funds or governs you, and the
   rubric in artifact 2 is the cover that makes that no defensible.
   Anchors: saying-no, communicating-tradeoffs
```

A shared stakeholder/goal anchor (`getting-buy-in`, and `okrs` for the research-lab
domain's grant-funded-work framing) grounds the cross-cutting "stakeholders don't
report to you" reality.

## Domain tailoring (the generator logic)

Each artifact carries a domain lens. The deterministic side resolves the stakeholder
roster, the RICE-axis relabeling, and the stop-doing candidates per domain; the host
renders the artifacts from the brief. The deltas:

```
school-principal:
  users = students; buyers/influencers = families + the district.
  JTBD: interview teachers about what slows good instruction and families about what
    they are hiring the school to do; discount the "more homework" feature-request.
  Rubric (curriculum/initiative changes): Reach = students/classrooms touched;
    Impact = learning outcome + equity; Confidence = evidence base; Effort = teacher
    time + change-fatigue. Gate: district mandate (you negotiate scope, not whether).
  Stop doing: the initiative pile-up (every year adds a program, none retire);
    meetings that could be a memo; data collected and never acted on.

nonprofit-ed:
  users = beneficiaries; buyers = donors + board.
  JTBD: interview beneficiaries about the job they hire the program for ("what did you
    do before, what were you trying to get done"), kept separate from donor preference.
  Rubric (across competing asks): Reach = beneficiaries served; Impact = mission
    outcome; Confidence = evidence; Effort = staff capacity. Gate: restricted funding
    (a grant can buy a priority you would not otherwise pick; name the distortion).
  Stop doing: mission drift via adjacent grants; founder-era reporting nobody reads;
    the gala that nets less than the staff time it costs.

hospital-service-line:
  users = patients; team = clinicians; buyers = administration + payers.
  JTBD: interview clinicians about pathway friction and patients about the real job
    (rarely "more appointments"; usually "get back to my life"); watch the workarounds.
  Rubric (clinical-pathway changes): Reach = patient volume; Impact = outcomes +
    experience; Confidence = clinical evidence/guidelines; Effort = clinician adoption +
    EHR change. Gate: safety + regulatory (a hard gate, never a score input).
  Stop doing: low-value recurring visits/tests; status meetings; dashboards nobody acts
    on. Naming the defensive-medicine "but what if" is part of the no.

research-lab-pi:
  users = the field that would use the finding; team = lab members; buyers = funders.
  JTBD: interview the field about what decision a finding would change, and lab members
    about what slows good science; discount the reviewer-pleasing add-on experiment.
  Rubric (research bets): Reach = how much of the field cares; Impact = would it change
    practice/understanding; Confidence = feasibility + preliminary data; Effort =
    person-months + equipment. Gate: grant-cycle timing + funder scope. (This is the
    domain where OKRs-for-grant-funded-work is the most direct transfer.)
  Stop doing: the zombie project that is 80% done and never publishes; chasing every
    reviewer suggestion; the standing lab meeting that is status theater.
```

`scale` calibrates formality and stakeholder count: small = "most of this is a
conversation, not a process, and that is fine"; large = "the stakeholders are many and
the rituals are real; the rubric is your shield in the meeting."

## Output shape

```
Your PM operating manual, adapted for a {domain} ({scale}):

Artifact 1 — JTBD interview kit
{who to interview, 5-7 questions, what to listen for / discount; domain-lensed}

Artifact 2 — Prioritization rubric
{the four relabeled axes with domain definitions, how to score, the one override gate;
 a short worked example using a plausible decision in that domain}

Artifact 3 — "Stop doing" list
{3-4 domain over-investments, why each persists, the script for stopping each given who
 you must say it to}

{If biggest_friction supplied: a short coda that points the user to whichever artifact
 most directly addresses the tension they named.}
```

Optional export (markdown/doc the user drops into a planning offsite or a board packet)
is just "ask Claude to format this as a doc"; no special export tooling.

## Voice rules (applied to all narration)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Plain, practical, second person. Respect the user's domain expertise; the frameworks
  adapt to their world. Never reverent about product management; never "here is how tech
  does it better." The transfer is offered, not preached.
- Short paragraphs and real artifacts (lists, scoreable axes, scripts), not essays. A
  reader should be able to use artifact 2 in a meeting next week.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> transfer-reveal: "Your stakeholders don't report to you either. That part transfers. The roadmap part is easier than you think."

Distinct from the locked shapes (it reveals a hidden commonality, then de-risks the
unfamiliar part). Alternative: "Principals, EDs, lab PIs: same job, different stop-doing list."

## Phase 0 URL-trick handoff (interim)

```
I lead in a domain that is not software product management, but I think product
thinking would help me. My domain: {domain}. Scale: {scale}.
{If supplied:} The tension I most want a framework for: {biggest_friction}.

Using Lenny Rachitsky's product corpus, translate three PM tools into my world,
adapted to my actual stakeholders:
1. A jobs-to-be-done interview kit (who to talk to, what to ask, what to listen for).
2. A prioritization rubric (a RICE-style scorecard relabeled for my decisions, with the
   one override that beats the score).
3. A "stop doing" list (what my domain over-invests in, and how to stop it given who I
   have to tell).

Keep it plain and usable. Adapt to my world; do not tell me how tech does it better.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author each of the three artifacts per domain (the few-shot spine the host renders from): the JTBD interview kit (roster + questions + listen-for), the prioritization rubric (four relabeled axes + override gate + worked example), and the stop-doing list (3-4 candidates + persistence reason + the no-script) for all four domains.
- [ ] Author the `scale` calibration lines (small / mid / large).
- [ ] Author 4 synthetic domain+scale combos for golden-set evals (one per domain), one of them carrying a `biggest_friction` to exercise the coda.
- [x] Cross-check anchors exist in `knowledge/topics/`: jobs-to-be-done, continuous-discovery, prioritization-frameworks, decision-making-frameworks, saying-no, communicating-tradeoffs, okrs, getting-buy-in. -> all present 2026-05-24.

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Four-tool Path 4 clone of #30 Onboarding (generator shape, no scoring engine):

- `pm_non_pm_get_modes` — entry tool, UI binding; returns the four domain options (+ the optional scale options + the free-text friction field) and the three fixed artifact titles (the "modes" analogue from #52, the fixed-section analogue from #30).
- `pm_non_pm_generate` — deterministic validation + domain resolution; resolves the stakeholder roster, RICE-axis relabeling, override gate, and stop-doing candidates, selects the corpus anchors per artifact; persists the Path-4 narration brief via `writePending`. `readOnlyHint: true`.
- `pm_non_pm_narrate` — pure compute; returns the `narration_brief` (directive + voice_rules + structure {ARTIFACT_1..3, friction_coda?} + inputs + corpus). No persistence, no sampling.
- `pm_non_pm_get_pending_narration` — disk read, MUST CALL framing. Triggers: "give me my operating manual", "build my PM manual", "render my artifacts", "I just filled in the domain form", embedded-widget phrasing. Anti-short-circuit + state-on-disk language per the worked examples.

Corpus access is local read. Because there is no score, the iframe's post-submit job is
small: confirm the domain + scale selection and "your three artifacts are rendering in
chat." The artifacts (the spine) render in chat, not in the iframe, per the
iframe-output design rule. No stateful follow-up is natural here (it is a generator, run
per domain), so no calibration/history tool — note that absence explicitly so a reviewer
does not expect one. Mirrors #30's deliberate no-history decision.
