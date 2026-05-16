---
app-id: 53
app-name: PM Horoscope
phase: 0
type: deterministic
updated: 2026-05-11
---

# Reading template — #53 PM Horoscope

> Deterministic. No LLM call. The "prompt" here is the spec of how a reading is composed from pre-written slots seeded by date + user's archetype.

## Twelve archetypes

Each grounded in a real corpus pattern. Each has one **virtue** and one **pitfall**. Locked for v1.

| # | Archetype | Corpus anchor (verified) | Virtue | Pitfall | Content status |
|---|---|---|---|---|---|
| 1 | The Bet-Defender | `defending-big-bets.md`, `top-1-percent-pm.md` | Holds the line on a bet under exec pressure | Cargo-cult dissent — saying no to look smart | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 2 | The Theatre Director | `pm-pitfalls.md`, `velocity-core4.md` | Runs the ritual well | Standups as performance art, no real coordination | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 3 | The Cornered Resource | `seven-powers.md` | Has a real moat | Mistakes "I'm the only one who knows" for a moat | placeholder |
| 4 | The Pivot-Hanged | `pivots-art.md` | Adaptive, learns fast | Hangs in indecision, can't commit to the new direction | placeholder |
| 5 | The Customer-Adjacent | `continuous-discovery.md`, `jobs-to-be-done.md` | Talks to paying customers weekly | Confuses sales Slack quotes for "talked to the customer" | placeholder |
| 6 | The Founder-Mode Returnee | `founder-mode.md` | Steps back into product after a stretch away | Re-overrides the team's hard-won judgment in week one | placeholder |
| 7 | The Stakeholder-Pleaser | `pm-pitfalls.md`, `saying-no.md` | Keeps the room calm | Ships nothing controversial enough to matter | placeholder |
| 8 | The Top-1-Percent | `top-1-percent-pm.md` | Rare quality bar | Martyrdom and burnout, can't trust the team | placeholder |
| 9 | The Saying-No | `saying-no.md` | Holds the line | Hedges to "let me check" and never closes | placeholder |
| 10 | The Eval-Forward | `evals-for-ai-products.md`, `pm-pitfalls.md` | Rigorous about AI feature evals | Blocks shipping with infinite eval requirements | placeholder |
| 11 | The Strategy-Skeptic | `good-strategy-rumelt.md`, `product-strategy.md` | Spots non-strategy | Diagnoses without proposing alternatives | placeholder |
| 12 | The Empathy-Tourist | `continuous-discovery.md`, `spotting-bad-pm-behaviors.md` | Does occasional user calls | Treats them as performance, doesn't change behavior | placeholder |

Anchor notes (2026-05-15 cross-check): original spec referenced several non-existent topic files. Substitutions made: `bet-defending.md` → `defending-big-bets.md`, `process-vs-outcomes.md` → `velocity-core4.md`, `7-powers.md` → `seven-powers.md`, `pivot-stories.md` → `pivots-art.md`, `customer-research.md` → `continuous-discovery.md`, `jtbd.md` → `jobs-to-be-done.md`, "AI eval coverage topics" → `evals-for-ai-products.md`, "Rumelt-related topics" → `good-strategy-rumelt.md`. All substitutes verified present in `knowledge/topics/`.

## Authored content

Deterministic content authored per archetype below. Each archetype needs: 30 predictions, 20 nudges, 11 aspect lines (one per partner), 5 topic files. Wired into `artifacts/api-server/public/horoscope.html` via `HOROSCOPE_DATA`.

### Archetype 1 — The Bet-Defender

Corpus anchors: `defending-big-bets.md`, `top-1-percent-pm.md`

Topic files (rotated daily): `defending-big-bets`, `top-1-percent-pm`, `evaluating-product-bets`, `getting-buy-in`, `pm-influence`

**Predictions (30):**
1. A stakeholder will ask you to soften the bet. Don't.
2. Today's data point looks like a refutation. It is not.
3. Someone with more title than insight will second-guess your prioritization. Smile.
4. The 80 percent will earn you the right to keep going on the 20 percent. Ship something this week.
5. Leadership will ask what success looks like. Have a one-sentence answer ready.
6. You will be tempted to call a meeting before you've written down your case. Write it down first.
7. A peer will drop their own bet. Watch what kills it and make sure your kill criteria are different.
8. The request to "just put it on ice for a quarter" is almost never temporary. Say that out loud.
9. Today is a good day to get one customer on record saying they'd pay for this.
10. Someone will notice the bet has been in the roadmap for six months. Have the receipts ready.
11. Your most important meeting is the one you haven't scheduled yet — with the senior ally who needs to hear this.
12. You'll be tempted to say no to something to show you can make hard calls. Only do it if you mean it.
13. The kill criteria you set in January will be tested today. Know where they are.
14. A well-timed small win can buy another month on the bet. Find one.
15. A deck that shows progress beats a deck that shows vision. Update the metrics slide.
16. The cargo-cult dissent trap: you'll see a chance to say no and wonder if it'll make you look decisive. Only a real no counts.
17. Customer signal you didn't collect last week is leverage you don't have this week.
18. The exec who sponsored this bet will be in a different fight today. That's normal. Don't panic.
19. You will have a five-minute window before the next planning cycle to make your case. Start now.
20. The team needs to hear why the bet still holds. Say it once, clearly, and mean it.
21. Stack-ranking your bet against its alternatives is not a sign of weakness. It is your strongest argument.
22. An incremental win shipped this week is worth more to the bet's survival than any memo.
23. Someone on the team is quietly losing faith. Find out who and why before the review.
24. Today's early data will look like noise. So will tomorrow's. That's the bet.
25. Leadership will ask for an update you're not ready to give. Be ready to give it anyway.
26. Your cover-fire wins are not unrelated to the bet. Describe them that way.
27. A VP will suggest a pivot. Your job is to know whether that's signal or pattern-matching.
28. The hardest no you'll say today will be to a request that sounds exactly like what the bet needs.
29. You are not defending the bet. You are building the case for the bet to defend itself.
30. Today the bet looks fragile. Tomorrow it looks the same. This is what bets feel like.

**Nudges (20):**
1. Write the bet down in one sentence and keep it on your second monitor.
2. Schedule a 15-minute walk after the review. You'll need it.
3. Pre-read your one-pager out loud before sending it.
4. Name one incremental win you can ship this week that is not the bet. Ship it.
5. Send your senior ally a one-sentence update on the bet before the end of today.
6. Pull up the kill criteria. If none of them have been hit, write that down and save it.
7. Find one customer who'd pay for this and ask if you can quote them at the next review.
8. Stack-rank the bet against one alternative right now. Write the result down.
9. Before the planning meeting, write the three things you'd be giving up to kill this bet.
10. Say no to one thing today that has nothing to do with the bet. Practice the muscle.
11. Update the artifact you're most likely to show in a review. Small delta, visible progress.
12. Look at the roadmap and find one thing that's not the bet. Ship that first this week.
13. Ask someone who doesn't work on the bet to explain what it is. Fix whatever they get wrong.
14. Block 30 minutes on Friday to review whether your cover-fire numbers are strong enough.
15. Write down the most likely kill argument against the bet. Now write the counter. Save both.
16. Text one customer you haven't talked to in a month. No agenda. Just signal-gathering.
17. Before you say no to something today, make sure it's a real no and not a performance.
18. Send a one-paragraph status to your sponsor this week. Not a deck. One paragraph.
19. Find the one person who is most skeptical of the bet. Have a coffee. Listen first.
20. Put the bet's current kill criteria in writing and share with one other person. Accountability beats conviction.

**Aspect lines (vs each partner):**
- vs #2 Theatre Director: "the Theatre Director squares your table today — meetings run long and the win condition slips off the agenda"
- vs #3 Cornered Resource: "the Cornered Resource trines your position — two moats reinforce each other; name yours before someone else defines it for you"
- vs #4 Pivot-Hanged: "the Pivot-Hanged opposes your stance — someone's indecision will read as caution; don't absorb it"
- vs #5 Customer-Adjacent: "the Customer-Adjacent trines your corner — fresh customer signal is in play today; treat it as evidence, not as permission to redirect"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your bet — the person with the original vision is forming opinions; your one-sentence case needs to be ready before they start talking"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser conjuncts your table — the room stays calm longer than it should; find the one person willing to tell you what they actually think"
- vs #8 Top-1-Percent: "the Top-1-Percent trines your conviction — high-bar day; spend it on the thing that matters most, not on the noise"
- vs #9 Saying-No: "the Saying-No opposes your corner — two people in this meeting know what they think; make sure one of them says it out loud, and that one is you"
- vs #10 Eval-Forward: "the Eval-Forward squares your clock — one more gate before the cover-fire win ships; negotiate the minimum viable check"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic trines your case — a gap in the strategy gets spotted today; let it happen, then fill it with the sentence you already have"
- vs #12 Empathy-Tourist: "the Empathy-Tourist squares your evidence — two user calls get cited in the meeting; verify whether anyone changed anything based on them"

### Archetype 2 — The Theatre Director

Corpus anchors: `pm-pitfalls.md`, `velocity-core4.md`

Topic files (rotated daily): `pm-pitfalls`, `velocity-core4`, `spotting-bad-pm-behaviors`, `ship-like-startup`, `prds-and-1-pagers`

**Predictions (30):**
1. The standup runs exactly on time today. Nothing else runs on time.
2. Someone will say "let's take that offline" to avoid having the real conversation in the room.
3. A blocker will be mentioned in standup and forgotten by lunch.
4. Someone will show up to the planning meeting not knowing the goal for the sprint.
5. You'll run the retro. The same things as last retro will come up. Nothing will change.
6. A decision that should have been made on Tuesday will surface in the Friday demo instead.
7. The throughput numbers look good. Ask what shipped and you'll like the answer less.
8. Someone will ask where the ticket is. The ticket exists. The work doesn't.
9. The ritual runs fine. The product is still stuck.
10. Someone's "status: in review" is going to turn into "status: still in review" by end of week.
11. Today's standup will have the same three agenda items it had on Monday.
12. The ceremony ends well. The coordination starts after the ceremony ends.
13. An engineer will solve a dependency problem you didn't know existed, because nobody said it at standup.
14. The sprint goal is technically achievable. It is not actually what the team is building.
15. The meeting will go smoothly. The outcome you needed from it will go unmet.
16. Someone will loop you in on a decision that got made without the meeting. Good. That's how decisions work.
17. Ask one team member what this sprint is for. The answer will tell you whether the ritual is landing.
18. Today's velocity metric looks great. The wrong things are getting done fast.
19. The PRD exists. The team is building a different thing.
20. The ticket count is up. The customer-facing impact is unclear.
21. A status update will substitute for a hard conversation today.
22. The meeting ran on time. The point was missed.
23. You will run a great standup and one person will leave it more confused than before.
24. A dependency the retro surfaced two weeks ago is still blocking something. Find it.
25. Someone has been waiting three days for a decision. The ceremony didn't catch it.
26. The planning went well. The sprint is over-committed. Both can be true.
27. A low-quality deliverable will sail through the ceremony without a flag. Stop it before the demo.
28. Today's update to leadership will obscure the actual problem. Fix the actual problem instead.
29. Your ceremonies are the most consistent thing about the team. Use that as a forcing function, not a trophy.
30. The blocker that matters isn't in the tracker. It's in someone's head. Ask.

**Nudges (20):**
1. Pull up your blocker list. Pick one. Make one call or send one message to unblock it.
2. Ask one person on the team today what's actually stopping them. Not in standup, after.
3. After the next standup, write down the one thing you should have said that nobody said.
4. Check whether last sprint's retro actions were followed up on. One minute.
5. Pick one ceremony this week and end it five minutes early by making the decision in the room.
6. Send the team the sprint goal in one sentence before lunch. If you can't write it in one sentence, the goal is unclear.
7. Look at your ticket board and find one "in review" item that has been there for more than two days.
8. Ask the engineer you talk to least what's hard right now. Listen without solving.
9. Write down what you think the team's top blocker is. Ask one other person. Compare answers.
10. Before the next planning session, read the last retro notes. Act on one thing.
11. Find the decision that's been "pending sync" for more than a week. Make it now.
12. Ask your design partner: "did the standup catch anything useful this week?" The answer is diagnostic.
13. Look at what shipped last sprint. Write down whether it moved the metric you care about.
14. Cancel one meeting this week and write the decision in a doc instead.
15. Take the sprint goal and ask: if we ship all of this, what changes for the customer? If no answer, reconsider the sprint.
16. Check in with one engineer outside of standup. Just a "how are things?" The ritual doesn't see everything.
17. Send a one-paragraph async update instead of scheduling a sync. See if the decision happens faster.
18. Before the weekly status update, ask: what is the one thing leadership needs to hear that I'm not saying?
19. Write down the coordination that actually happened this week outside the ceremonies.
20. Review sprint velocity from last quarter. Are you going faster? On what?

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender opposes your agenda today; conviction about a specific win condition puts pressure on whether the meeting is about the right thing"
- vs #3 Cornered Resource: "the Cornered Resource squares your standup; the person who holds the key context isn't saying it in the room, so ask before the meeting ends"
- vs #4 Pivot-Hanged: "the Pivot-Hanged trines your rhythm; the ceremony runs while the big decision stays stuck, and that's today's unspoken agenda item"
- vs #5 Customer-Adjacent: "the Customer-Adjacent conjuncts your table; someone brings actual customer context to the ceremony today, so let it shift the agenda instead of filing it away"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your ritual; a senior presence in the room changes the dynamics, so run the meeting for the decision, not for the room"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser trines your ceremony; the meeting goes well, everyone leaves satisfied, and nothing hard got resolved, so notice that before the next one"
- vs #8 Top-1-Percent: "the Top-1-Percent opposes your cadence; the high-bar instinct pushes back on the ritual, and the question is whether they say it out loud"
- vs #9 Saying-No: "the Saying-No squares your agenda; a no that should have ended a project three weeks ago gets raised during the ceremony today, so let it land"
- vs #10 Eval-Forward: "the Eval-Forward conjuncts your gate; a process requirement gets added to the workflow today, so make sure it produces an outcome, not just a checkbox"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic trines your retrospective; the gap between the sprint and the strategy gets named today, so use it to recalibrate, not to assign blame"
- vs #12 Empathy-Tourist: "the Empathy-Tourist squares your meeting; someone brings a user story to the standup today, so test whether it changes the plan or just fills the time"

---

## Reading template

A reading is one paragraph in horoscope rhythm. Composed from four deterministic slots seeded by `hash(date + archetype_id)`:

```
[Day of week and date]

[User's archetype name]

Today, [ASPECT]. [PREDICTION]. [NUDGE].

Lucky topic file: [TOPIC_FILE].
```

### ASPECT

Drawn from a 132-pair matrix of archetype interactions (12 × 11). Each pair has 3 written aspect lines.

Examples:
- "the Theatre Director squares the Bet-Defender" → "meetings will run long, and the win condition will keep slipping"
- "the Customer-Adjacent trines the Founder-Mode Returnee" → "real listening happens before the re-override"
- "the Pivot-Hanged opposes the Cornered Resource" → "don't pivot away from your actual moat"
- "the Stakeholder-Pleaser conjuncts the Saying-No" → "your firm no will sound like a polite yes — fix it before the meeting"

Author target: 396 aspect lines total (132 pairs × 3 variants). One day of writing. Most pairs are symmetric so the count halves with smart authoring (~200 lines).

### PREDICTION

Per-archetype list of ~30 prediction lines. Examples for Bet-Defender:
- "A stakeholder will ask you to soften the bet. Don't."
- "Today's data point looks like a refutation. It is not."
- "Someone with more title than insight will second-guess your prioritization. Smile."

### NUDGE

Per-archetype list of ~20 actionable nudges. Examples for Bet-Defender:
- "Write the bet down in one sentence and keep it on your second monitor."
- "Schedule a 15-minute walk after the review. You'll need it."
- "Pre-read your one-pager out loud before sending it."

### TOPIC_FILE

Per-archetype list of ~5 corpus topic files. Rotated by date. Links to the matching corpus page on the site (or to the GitHub raw file for the skills-library audience).

## Deterministic selection

```
seed = sha256(date_iso + "::" + archetype_id)
aspect_partner_id = seed[0:2] % 11 (skip self)
aspect_variant = seed[2] % 3
prediction_idx = seed[3:5] % len(predictions[archetype_id])
nudge_idx = seed[5:7] % len(nudges[archetype_id])
topic_idx = seed[7:9] % len(topics[archetype_id])
```

Same archetype + same date = same reading. Different archetype same date = different reading. Yesterday's reading is reproducible if anyone asks.

## Six-question archetype quiz

User answers 6 multiple-choice questions; scoring maps to one of 12 archetypes. Question dimensions:

1. Dissent tolerance (Bet-Defender ↔ Stakeholder-Pleaser)
2. Ritual-vs-outcome bias (Theatre Director ↔ Customer-Adjacent)
3. Moat self-image (Cornered Resource ↔ Strategy-Skeptic)
4. Change-readiness (Pivot-Hanged ↔ Founder-Mode Returnee)
5. Customer-proximity (Customer-Adjacent ↔ Empathy-Tourist)
6. Decision velocity (Saying-No ↔ Top-1-Percent vs Eval-Forward)

To be drafted in `quiz.md` once archetype slots 7–12 are locked.

## URL-trick handoff (Phase 0)

The Phase 0 deployment is a static page. It needs no inference. But the page can still hand off to claude.ai/new for a deeper reading on demand:

> "Want a longer reading? Open in Claude → [link]"

The link wraps a prompt like:
```
Today my PM horoscope archetype is {{archetype}}. The reading is: {{reading}}.
Please expand the reading into a full one-page narrative grounded in the
corpus topic file `{{topic_file}}`. Keep the tone of a horoscope: confident,
slightly dramatic, never actually predictive.
```

Optional. The deterministic reading stands on its own.
