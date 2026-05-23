---
app-id: 30
app-name: Onboarding to PM 101 for Non-PMs
phase: 3
type: generator (tailored lesson set, no scoring state)
updated: 2026-05-23
neighbor: 52
---

# Engine — #30 Onboarding to PM 101 for Non-PMs

> Five short lessons for engineers, designers, sales reps, and CS folks who just joined a PM-led company and don't actually know what PMs do. Not a quiz and not a score: a **generator** that tailors the five fixed lessons to the user's role + company shape. Clones #52 How [You] Build's generator architecture (structured input -> mode/role-specific directives -> Path 4 narration), but the output is earnest and useful rather than parody. No per-user state.

## Audience and framing

The user is a non-PM, recently joined, slightly confused or quietly skeptical about the product function. The goal is to make them effective and unsurprised, not to sell them on PM. Tone is plain, a little wry, never reverent about the role. It explicitly includes "how to push back" and "what a bad PM looks like" so it reads as honest rather than as PM propaganda. (Pairs naturally with #46 for the same audience: #30 is the orientation, #46 is the diagnostic.)

## Inputs

- `role` (enum): engineer / designer / sales / customer-success / other-cross-functional
- `company_stage` (enum): seed / series-a-b / growth / enterprise — calibrates how formal the rituals are
- `pm_ratio` (enum, optional): solo-pm / pm-per-squad / heavy-pm-org — sets how much PM the user will actually encounter
- `biggest_confusion` (free text ≤200 chars, optional): "What's the one thing about working with the PM you most want decoded?"

## The five fixed lessons

The lesson *titles* are fixed; the *content* is tailored to `role` + `company_stage`. Each lesson is ~10 minutes of reading.

```
1. What artifacts you'll see, and what they actually mean
   (PRD, roadmap, spec, OKRs, the difference between a roadmap and a strategy)
   Anchor: how-x-builds-product, product-strategy, okrs

2. When and how to push back
   (disagreement is the job; how to do it so it lands; the difference between
    "I'd build it differently" and "this is the wrong thing to build")
   Anchor: getting-buy-in, communicating-tradeoffs, saying-no

3. What a good PM looks like vs a bad one
   (the honest version: a good PM clears your path and owns the why; a bad one
    is a ticket-mover with a Gantt chart. Names the patterns from #46.)
   Anchor: top-1-percent-pm, spotting-bad-pm-behaviors, pm-pitfalls

4. How to be useful in cross-functional rituals
   (standup, planning, retro, discovery: what each is for from your seat, and
    the one contribution that makes you the person the PM wants in the room)
   Anchor: continuous-discovery, getting-buy-in

5. When to escalate
   (the difference between friction you absorb and friction you flag; who to
    flag to; how to do it without torching the relationship)
   Anchor: communicating-bad-news, managing-up, decision-making-frameworks
```

## Role tailoring (the generator logic)

Each lesson carries a role lens. Examples of the directive deltas the narration applies:

```
engineer:        artifacts -> "the spec is a hypothesis, not a contract; here's
                 how to read the why behind a ticket"; push-back -> estimate
                 honesty + scope challenge.
designer:        artifacts -> "where your craft judgment outranks the PM's, and
                 where it doesn't"; rituals -> discovery is your home turf.
sales:           artifacts -> "the roadmap is not a promise you can sell; here's
                 how to read commit vs. aspiration"; escalate -> the deal-blocking
                 gap path.
customer-success: artifacts -> "your churn signal is discovery data; how to make
                 the PM act on it"; push-back -> turning a complaint into a bet.
```

`company_stage` calibrates formality: seed = "most of this is a Slack thread and that's fine"; enterprise = "the ritual is real, here's how to survive it."

## Output shape

```
Your 5-lesson orientation, tailored for a {role} at a {company_stage} company:

Lesson 1 — {title}
{3-5 short paragraphs, role-lensed, corpus-grounded}

... (lessons 2-5)

{If biggest_confusion supplied: a short "the thing you asked about" coda that
answers it directly using the most relevant lesson.}
```

Optional company-branded export (HTML/markdown the user can drop into an HR onboarding packet) is the in-company viral hook from APP_IDEAS. In the `.mcpb` it's just "ask Claude to format this as a doc"; no special export tooling needed.

## Voice rules (applied to all narration)

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Plain and useful, lightly wry, never reverent about the PM role. Honesty over advocacy: a good PM is described by what they do for the user, a bad one by name.
- Second person, short paragraphs. This is a thing someone reads on their second day.

**Block-3 ironic-blurb shape — PROPOSED (owner sign-off needed; voice shapes are owner-locked):**

> reassurance-by-correction: "You don't need to become a PM. You need to stop being surprised by one."

Distinct from the 12 locked shapes (it corrects a misconception in two beats rather than listing, defining, or confessing). Alternative: "No, the PM is not your boss. Yes, they can move your ticket. Here's the rest."

## Phase 0 URL-trick handoff (interim)

```
I just joined a PM-led company as a {role} and I don't fully get what the PMs
do or how to work with them. Company stage: {stage}.
{If supplied:} The thing I most want decoded: {biggest_confusion}.

Using Lenny Rachitsky's cross-functional corpus, give me five short lessons
tailored to my role:
1. What artifacts I'll see and what they mean.
2. When and how to push back.
3. What a good PM looks like vs a bad one (be honest).
4. How to be useful in cross-functional rituals.
5. When to escalate.

Keep it plain and useful. Don't sell me on product management. Tell me how to
be effective and unsurprised.
```

## Autonomous-routine backlog (Phase 3 Stage C)

- [ ] Author the base content for all five lessons (role-neutral spine), then the four role-lens deltas per lesson.
- [ ] Author the stage-calibration lines (seed / series-a-b / growth / enterprise) per lesson.
- [ ] Author 5 synthetic role+stage combos for golden-set evals (one per role).
- [x] Cross-check anchors exist in `knowledge/topics/`: how-x-builds-product, product-strategy, okrs, getting-buy-in, communicating-tradeoffs, saying-no, top-1-percent-pm, spotting-bad-pm-behaviors, pm-pitfalls, continuous-discovery, communicating-bad-news, managing-up, decision-making-frameworks. → all present 2026-05-23.

## Phase 2 MCP App spec (Path 4, .mcpb bundle — the real target)

Four-tool Path 4 clone of #52 (generator shape, no scoring engine):

- `onboarding_get_modes` — entry tool, UI binding; returns the role/stage field options + the five fixed lesson titles (the "modes" analogue from #52).
- `onboarding_generate` — deterministic validation + role/stage resolution; selects the lesson directives + corpus anchors; persists the Path 4 narration brief via `writePending`. `readOnlyHint: true`.
- `onboarding_narrate` — pure compute; returns the `narration_brief` (directive + voice_rules + structure {lesson_1..5, confusion_coda?} + inputs + corpus). No persistence, no sampling.
- `onboarding_get_pending_narration` — disk read, MUST CALL framing. Triggers: "give me my onboarding lessons", "explain what PMs do", "render my orientation", "I just filled in the onboarding form", embedded-widget phrasing. Anti-short-circuit + state-on-disk language per the worked examples.

Corpus access is local read. Because there's no score, the iframe's post-submit job is small: confirm the role/stage selection + "your 5 lessons are rendering in chat." The five lessons (the spine) render in chat, not in the iframe, per the iframe-output design rule. No stateful follow-up is natural here (it's orientation, run once), so no calibration/history tool — note that absence explicitly so a reviewer doesn't expect one.
