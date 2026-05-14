---
app-id: 3
app-name: PM Ladder Self-Assessment
phase: 0
type: quiz + LLM narration
updated: 2026-05-11
---

# Assessment spec — #3 PM Ladder Self-Assessment

> Thirty deterministic questions across five dimensions. LLM narrates the gap report and three behaviors. Optional calibration-delta mode pastes the manager's last review and runs a second prompt.

## The five dimensions

Canonical PM career-ladder axes used across the corpus's ladder topics (Petra Wille's PMwheel, Sean Sullivan's PM Scorecard, Lenny's own ladder post, Julia Nechaieva's PM Daisy). Six questions per dimension.

| Dimension | What it measures |
|---|---|
| **Scope** | The size and time-horizon of the work the PM owns end-to-end |
| **Ambiguity tolerance** | Comfort and competence when the goal isn't pre-defined |
| **Influence** | Ability to move people who don't report to the PM |
| **Judgment** | Quality of decisions made under incomplete information |
| **Craft** | Depth of skill in the trade itself (writing, research, data, AI literacy) |

## Level mapping

Five levels per dimension. Each answer choice maps to a level 1-5.

| Level | Title | Anchor |
|---|---|---|
| 1 | APM / Associate PM | Owns small slices; needs ambient direction |
| 2 | PM | Owns features that ship in one sprint; informed by clear product direction |
| 3 | Senior PM | Owns multi-sprint initiatives; sets product direction for a small surface |
| 4 | Staff PM | Owns product lines or platform direction; influences strategy at the org level |
| 5 | Principal PM | Owns bets that define the next 12–18 months; sets craft standards for the function |

## The thirty questions

Six per dimension. Each question presents five answer choices that map to levels 1-5. User picks the choice that best describes their current behavior (not aspirations).

The five-choice structure for each question is the same — what changes is the anchor behavior. Example for Scope/Q1:

> **Q1 (Scope). What was the largest decision you owned end-to-end in your most recent quarter?**
> - (1) A feature flag or a copy change.
> - (2) A feature that shipped in one sprint.
> - (3) A multi-team initiative spanning a quarter.
> - (4) A product line or platform direction.
> - (5) A bet that defines the next 12–18 months for the business.

The six question prompts per dimension (full answer banks to be authored against the corpus's ladder topics — first drafts below; flag and revise before locking):

### Scope (Q1-Q6)

Choices authored 2026-05-14. Anchors: `pm-career-ladders.md`, `becoming-senior-pm.md`, `pm-promotion.md`.

**Q1. Largest decision you owned end-to-end in your most recent quarter.**
- (1) A feature flag, a copy change, or a single UI component.
- (2) A feature that shipped in one sprint, end-to-end.
- (3) A multi-team initiative that spanned the whole quarter.
- (4) A product line or platform direction that affected multiple teams.
- (5) A bet that defines where the business is going in the next 12-18 months.

**Q2. Time horizon of your typical commitments.**
- (1) The current sprint. Two weeks out, at most.
- (2) This quarter. You think about what ships in the next three months.
- (3) Two or three quarters out. You carry strategy across planning seasons.
- (4) Six to twelve months out. You anchor the roadmap conversation for your area.
- (5) Twelve to eighteen months out. Your conviction shapes the company's long-range bets.

**Q3. Number of teams affected by your typical work.**
- (1) Your own team, or a small pod. One surface, minimal coordination.
- (2) One or two teams. You coordinate occasionally with adjacent functions.
- (3) Three or more teams. You own the cross-team outcome.
- (4) An entire org area. Multiple squads, one direction.
- (5) The whole product org. Your work sets the direction others orient around.

**Q4. Customer segment scope (a feature, a segment, or the whole market).**
- (1) One user flow or a narrow feature edge case.
- (2) A coherent feature set that one user persona cares about.
- (3) A customer segment or a recognized product surface.
- (4) Multiple segments, or a platform layer all customers depend on.
- (5) The market itself. Your work shapes how the company positions against competitors.

**Q5. Strategic-to-tactical mix in your week.**
- (1) Mostly tactical. Tickets, standups, and responding to questions.
- (2) About 80% tactical, 20% looking ahead. You own the near-term roadmap.
- (3) Roughly half and half. You're in planning conversations as often as in execution.
- (4) More strategy than execution. You spend your week unblocking others more than shipping personally.
- (5) Primarily strategic. Your week is shaped by where the org needs direction, not by the sprint board.

**Q6. Org-level visibility of your work (who reviews it).**
- (1) Your direct manager reviews your work before it ships.
- (2) Your team lead, with occasional skip-level review of key artifacts.
- (3) A director or VP reviews your roadmap before it goes to the broader team.
- (4) Senior leadership has input into your area. C-level is occasionally in the loop.
- (5) You present to execs and board-level stakeholders. Your work sets the reference point others are measured against.

### Ambiguity tolerance (Q7-Q12)

Choices authored 2026-05-14. Anchors: `pm-career-ladders.md`, `becoming-senior-pm.md`, `decision-making-frameworks.md`, `saying-no.md`, `top-1-percent-pm.md`.

**Q7. What you do when the goal isn't pre-defined.**
- (1) You wait for your manager to clarify the goal before starting.
- (2) You draft a rough problem statement and get your manager's sign-off before moving.
- (3) You define the goal yourself, write it up, and socialize it until stakeholders align.
- (4) You set the problem definition for a large surface and make it the team's north star across multiple squads.
- (5) You define the problem space others work within. When the org doesn't know what it's optimizing for, that's your question to answer.

**Q8. Default response when data is missing.**
- (1) You wait for data. You feel blocked making calls without numbers.
- (2) You make the call but hedge heavily and flag the gap upward.
- (3) You state your confidence level, name the assumption you're making, decide, and schedule a review.
- (4) You apply a reversibility test, sequence the decision, and commission the missing data in parallel.
- (5) You structure the sequence of bets so the easiest ones generate the data the harder ones need.

**Q9. How you handle conflicting requirements between two senior stakeholders.**
- (1) You escalate to your manager. Not sure how to proceed without their call.
- (2) You try to find a middle path that satisfies both. It often ends up serving neither.
- (3) You write a one-pager surfacing the tradeoffs and ask the stakeholders to decide together.
- (4) You mediate the conflict directly. It rarely needs to escalate; you anchor on the shared goal.
- (5) You mostly prevent these conflicts. The strategy is clear enough upstream that they rarely reach the team.

**Q10. Reaction time to a leadership pivot.**
- (1) You need significant re-explanation before the team can move. The disruption is visible.
- (2) It takes a sprint or two to reorient. The team can tell there was a direction change.
- (3) Within a week, you have a revised plan that integrates the pivot. The team is moving again.
- (4) You had a contingency sketch ready. The team barely notices the turn.
- (5) You helped shape the pivot. Your read of the market fed the leadership conversation. The team is already moving before the announcement.

**Q11. Comfort with shipping a product you're not 100% sure about.**
- (1) You wait for more research or more sign-offs before shipping with meaningful uncertainty.
- (2) You ship when directed to, but flag the uncertainty upward. You don't fully own the risk.
- (3) You set kill criteria and a rollback plan before shipping. Success metrics are defined up front.
- (4) You distinguish reversible from irreversible risk, ship fast on Type-2 decisions, and explain the logic to the team.
- (5) You define what "good enough to ship" means for the current product stage. Teams use your framework.

**Q12. How you frame "I don't know" out loud.**
- (1) You avoid saying it directly. You stay quiet or deflect when you don't have the answer.
- (2) You say it, but it sounds apologetic and you don't follow it with structure.
- (3) You say "I don't know yet" and follow it with what you're doing to find out, and by when.
- (4) You separate what can be found out from what has to be decided under uncertainty, and use that to frame the next step.
- (5) You make it safe for everyone to say what they don't know. Decision logs and pre-mortems are team norms because of you.

### Influence (Q13-Q18)
- Q13. How you handle disagreement with engineering leadership.
- Q14. How exec stakeholders engage with your work (and at what cadence).
- Q15. Cross-functional pull (does design / GTM / data come to you proactively).
- Q16. Mentorship reach (how many PMs do you have ongoing coaching relationships with).
- Q17. External visibility (talks, writing, hiring panels).
- Q18. How you frame proposals (which audience do you build for).

### Judgment (Q19-Q24)
- Q19. How you make trade-offs under time pressure.
- Q20. Calibration on your bets (do you track confidence at the time of decision).
- Q21. How you handle a failed launch.
- Q22. Reaction to a clear signal that disconfirms your strategy.
- Q23. Stop-doing list quality (what you cut last quarter and why).
- Q24. Speed-vs-quality discernment (which one was wrong in your last 90 days).

### Craft (Q25-Q30)
- Q25. Quality of your written artifacts (specs, decision docs).
- Q26. Customer-research depth (frequency and shape).
- Q27. Data fluency (what you can run yourself vs ask for).
- Q28. Design-quality literacy (can you red-line a design).
- Q29. Engineering-system literacy (can you read a service map).
- Q30. AI / eval literacy — the new craft (do you ship AI features with an eval set).

## Scoring (deterministic)

```
for each dimension:
  dimension_level = median(answer_levels_in_that_dimension)  # 6 answers → median

effective_level = median(dimension_levels)  # 5 dimensions → median
```

Median (not average) so outliers in either direction don't distort. Reporting two numbers per dimension keeps the gap clear:

```
Scope:               2.5  (your level on this axis)
Ambiguity tolerance: 3
Influence:           2
Judgment:            3
Craft:               3

Effective level: 3 (Senior PM)
Gap to level 4 (Staff PM): Influence is your widest gap (2 → 4).
```

## LLM narration prompt (gap report + three behaviors)

```
You are a candid PM coach drawing from a synthesized corpus of product
leadership interviews (Lenny Rachitsky's corpus + adjacent ladder
frameworks). The user has just completed a 30-question self-assessment
across five dimensions. You will return a gap report.

Inputs:
- dimension_levels: {Scope, Ambiguity, Influence, Judgment, Craft} as numbers 1-5
- effective_level: integer 1-5
- target_level: effective_level + 1 (or 5 if already at 5)
- corpus_chunks: 2-3 relevant chunks per dimension, retrieved server-side

Output structure:
1. One-paragraph summary of where the user is, in plain language, no
   level-name worship. Lead with the strongest dimension and the
   widest gap.
2. The three behaviors to start practicing this quarter that close
   the widest gap. Each behavior is one paragraph: what to do, why
   it matters at the target level, what the dropoff looks like if
   the PM skips it. Anchored in the corpus chunks.
3. One sentence about the dimensions that are already at or above
   target_level. Brief acknowledgment, no over-praise.

Voice:
- Direct. No corporate softening.
- No em dashes. No "delve", "leverage", "unpack". No "in today's
  fast-paced".
- Owner-of-the-tool voice: a candid coach who has seen this pattern
  before.

Length: 350-450 words total.
```

## Optional mode: manager-calibration delta

Second flow. User pastes their manager's last performance review. App runs a separate prompt:

```
You are reading two things and finding the disagreements:
1. The user's self-assessment on five dimensions (scores 1-5 each).
2. Their manager's last performance review (pasted text).

Identify the 1-3 dimensions where the user's self-rating diverges
most from the manager's implied rating. For each:
- name the dimension
- summarize what the user said about themselves
- summarize what the manager said (specific quote if possible)
- one sentence on which view is likely more accurate and why
- one specific discussion question for the next 1:1

Length: under 400 words.

Voice rules same as gap report prompt above.

No em dashes. No softening.
```

This is the calibration-delta differentiator — it's the wedge that distinguishes this tool from static ladder rubrics.

## Phase 0 URL-trick handoff

Phase 0 hands off the user's scoring vector to claude.ai/new with a structured prompt asking for the gap report (or the calibration delta, if a manager review was pasted). The 30 questions and scoring happen client-side; only the result is handed off.

URL template:
```
https://claude.ai/new?q=<encoded prompt with dimension_levels + effective_level>
```

## Phase 1 Worker inference

Same prompts, submitted to Gemini Flash server-side. Output streams in.

User input (manager review, in particular) is NOT logged.

## Phase 2 MCP App

Quiz state persists. Re-take annually with drift report ("a year ago you were level 2.5 on Scope; today 3. Your widest gap shifted from Influence to Judgment."). Calibration delta optionally saved if the user opts in.
