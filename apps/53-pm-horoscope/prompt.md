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
| 3 | The Cornered Resource | `seven-powers.md` | Has a real moat | Mistakes "I'm the only one who knows" for a moat | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 4 | The Pivot-Hanged | `pivots-art.md` | Adaptive, learns fast | Hangs in indecision, can't commit to the new direction | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 5 | The Customer-Adjacent | `continuous-discovery.md`, `jobs-to-be-done.md` | Talks to paying customers weekly | Confuses sales Slack quotes for "talked to the customer" | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 6 | The Founder-Mode Returnee | `founder-mode.md`, `pm-influence.md`, `decision-making-frameworks.md` | Steps back into product after a stretch away | Re-overrides the team's hard-won judgment in week one | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 7 | The Stakeholder-Pleaser | `pm-pitfalls.md`, `saying-no.md` | Keeps the room calm | Ships nothing controversial enough to matter | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 8 | The Top-1-Percent | `top-1-percent-pm.md`, `becoming-senior-pm.md`, `pm-influence.md`, `product-sense.md`, `decision-making-frameworks.md` | Rare quality bar | Martyrdom and burnout, can't trust the team | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 9 | The Saying-No | `saying-no.md` | Holds the line | Hedges to "let me check" and never closes | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 10 | The Eval-Forward | `evals-for-ai-products.md`, `pm-pitfalls.md` | Rigorous about AI feature evals | Blocks shipping with infinite eval requirements | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 11 | The Strategy-Skeptic | `good-strategy-rumelt.md`, `product-strategy.md` | Spots non-strategy | Diagnoses without proposing alternatives | **authored** (30 predictions, 20 nudges, 11 aspect lines) |
| 12 | The Empathy-Tourist | `continuous-discovery.md`, `spotting-bad-pm-behaviors.md` | Does occasional user calls | Treats them as performance, doesn't change behavior | **authored** (30 predictions, 20 nudges, 11 aspect lines) |

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

### Archetype 3 — The Cornered Resource

Corpus anchors: `seven-powers.md`

Topic files (rotated daily): `seven-powers`, `product-strategy`, `evaluating-product-bets`, `distribution-as-moat`, `good-strategy-rumelt`

**Predictions (30):**
1. Someone will describe your competitive advantage in a meeting today. Listen for what they get wrong.
2. A competitor will say they have the same capability. Ask them to show you the barrier, not just the benefit.
3. The thing your team calls the moat may be living in one person's head. That's a key-person risk.
4. Leadership will ask what's defensible. Have the two-sentence answer ready before the meeting starts.
5. A new hire will ask why the competitor can't just copy this. Your answer will tell you whether the moat is real.
6. The most valuable access you have is the part nobody has documented. Fix that today.
7. Someone will conflate switching costs with genuine exclusivity. Those are different powers.
8. Today's competitive scan will show a threat to the barrier, not just the benefit. Know which one it is.
9. The process that makes you fast is the moat, not the output. Protect it accordingly.
10. A stakeholder will ask for a competitive slide. Make sure it names the structural barrier, not just the capability.
11. You'll be tempted to keep the critical context in your head. That feels like security. It's the opposite.
12. The moat narrows when the person who holds the context isn't in the room.
13. Someone will overstate the durable advantage in a pitch. Accurate is more defensible than impressive.
14. A partnership agreement is a cornered resource until the renewal date. Check when it expires.
15. The exclusive access that feels permanent has conditions attached. Find them.
16. Today someone will describe "we're the best at X" as the moat. Better is not a barrier.
17. You have the context. The question is whether the product captures it or whether it's just you.
18. A competitor will announce they've hired someone from your team. Check what that person knew.
19. Today is a good day to verify the moat still exists. Markets change. So do barriers.
20. The thing competitors can't copy is the process, not the output. Make sure the team knows which it is.
21. Someone will ask what would happen if your top person left. The honest answer is the moat test.
22. A key relationship that feels like a moat is fragile if it's relational rather than contractual.
23. Leadership will say "what's stopping them from building this?" Your answer needs to be specific.
24. Today you'll hear "we have all the advantages." Nobody has all seven. Name the one real one.
25. The competitor who is closest to matching you is two steps behind on the barrier. Widen it.
26. Someone on the team doesn't understand why what they're building is hard to replicate. Tell them.
27. The moat you have today had a build time. Protecting it means accounting for that time in every roadmap conversation.
28. Today's planning conversation will test whether the team is building toward the moat or away from it.
29. You know something the market doesn't yet. The question is how long that stays true.
30. The exclusive access is an asset. Undocumented exclusive access is a liability.

**Nudges (20):**
1. Write the moat in one sentence: benefit, barrier, and why competitors can't cross it. If you need more than one sentence, it's not clear yet.
2. Find the piece of critical context that lives only in your head. Put it in a doc before end of day.
3. Run the Helmer test: is your advantage a benefit, a barrier, or both? Name which one is weaker.
4. Pull up the last competitive review. Has the moat narrowed or widened since then?
5. Ask your team what they think your biggest competitive advantage is. Compare to what you think.
6. Name the thing that would take a competitor 18 months to replicate. That's what to protect.
7. Check whether your exclusive access is contractual, relational, or technical. Each has a different shelf life.
8. Schedule 30 minutes to map every piece of undocumented knowledge that only one person holds.
9. Ask someone new to the company: "why do customers not go with the competitor?" The answer is diagnostic.
10. Write one paragraph on why your exclusive access won't expire in 12 months. If you can't, that's the problem.
11. Find one process your team runs that competitors can't replicate just by hiring your people away.
12. If the key advantage is a person, make a plan to institutionalize it into the product or the process.
13. Verify that the thing you call your moat actually prevents customers from switching, not just slows it.
14. Before the next strategy review, name the one power you actually have. Not all seven.
15. Ask one customer why they didn't switch to a competitor. That answer is the real moat map.
16. Write the sentence that explains your competitive advantage for someone who has never heard of you.
17. Check the contract or agreement that underlies your most important exclusive relationship. Note the renewal date.
18. Find the person on the team who holds the most undocumented context. Buy them lunch.
19. Look at what the closest competitor has shipped in the last 90 days. Are they closer to your barrier?
20. Before the board meeting, confirm that the moat you're claiming matches what the data actually supports.

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender trines your moat; conviction and structural exclusivity reinforce each other today, and the combined case is stronger than either alone"
- vs #2 Theatre Director: "the Theatre Director squares your context; the ceremony runs but the constraint you hold never surfaces in the room, so say it before the meeting ends"
- vs #4 Pivot-Hanged: "the Pivot-Hanged opposes your position; indecision about direction threatens to route around the moat you've built, so name the structural advantage before the pivot conversation happens"
- vs #5 Customer-Adjacent: "the Customer-Adjacent conjuncts your access; the customer knowledge they hold and the exclusive access you have are converging today, so make sure one informs the other"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your moat; the person with the original product vision is forming opinions, and your documented advantage needs to be visible before they start redesigning around it"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser trines your position; the calm room buys space for moat-building, but make sure the calm isn't covering a competitive threat that nobody wants to name"
- vs #8 Top-1-Percent: "the Top-1-Percent conjuncts your standard; a high bar on defensibility is in play today, so welcome the scrutiny and let it sharpen the moat case rather than avoiding it"
- vs #9 Saying-No: "the Saying-No opposes your exclusivity; a firm no in the pipeline today may protect or threaten what you have, so figure out which before the decision gets made"
- vs #10 Eval-Forward: "the Eval-Forward squares your advantage; rigorous testing of moat durability is in play today, so welcome it because the moat either survives or you've found the gap"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic trines your position; non-strategy gets called out today, and your real moat benefits from the cleanup because the gaps become easier to see"
- vs #12 Empathy-Tourist: "the Empathy-Tourist squares your moat; someone mistakes a customer relationship for a structural advantage today, so verify whether it's actually exclusive or just friendly"

### Archetype 4 — The Pivot-Hanged

Corpus anchors: `pivots-art.md`

Topic files (rotated daily): `pivots-art`, `evaluating-product-bets`, `defending-big-bets`, `product-market-fit`, `decision-making-frameworks`

**Predictions (30):**
1. The signal that says pivot has been in your data for two weeks. You already know.
2. Someone will ask if you're still committed to the direction. You won't have a clean answer. That is the answer.
3. The new direction was visible in the old data three months ago. Name it.
4. A half-pivot is not a strategy. It is a slow drain.
5. The team is watching you deliberate. They've already picked a side.
6. Today's customer call will confirm what you already suspect. Let it.
7. Someone will suggest running both directions for another sprint. That's not a test. That's a delay.
8. The moment you commit, speed becomes your advantage. The moment before, it's a liability.
9. You've been holding two directions because both feel risky. That's not balance. That's a stall.
10. The team member who left last month knew. Find out what they saw.
11. A smart investor will read your deliberation as confusion. Make sure the public story is clean.
12. The adjacent opportunity you dismissed at the start is back. Treat it as data, not as a sign.
13. Someone will say you need more data before deciding. Ask what data would actually change the call.
14. A team member has been quietly building for the new direction without being asked. Notice it.
15. Pivot fatigue is real. Decide once and mean it. The team's patience is not infinite.
16. The inflection you bet on has shifted. That's a market fact, not a failure.
17. Write down the three signals that would tell you the old direction is done. At least one is already true.
18. The option you're keeping just in case is not an option. It's a hedge. Name that.
19. Waiting has a cost that compounds. The exit from the current direction won't be cheaper in three months.
20. You'll hear 'we're not ready to pivot' today. Ask whether ready is a state or a habit.
21. The thing you're calling a refinement is a pivot that hasn't been named yet. Name it.
22. Be honest with yourself first. The team needs the honest version, not the positioned version.
23. The customer who churned last quarter left a note. Read it.
24. Someone on the team is building for where you're going next. Let them.
25. A good pivot keeps something from the old direction. List what stays before you touch what changes.
26. 'Just one more quarter' has already been said once. Check whether it should be said again.
27. Today's board update will require you to say where you're going. Make sure the description is true.
28. The new direction and the old direction are not equally risky right now. Do the math.
29. A competitor shipped something today that makes the current direction harder to win. That is signal.
30. The decision you've been postponing has a cost that compounds. Do the math before tomorrow.

**Nudges (20):**
1. Write down the three signals that would tell you the old direction is done. Check whether any are already true.
2. Ask one team member: "do you think we should change direction?" Listen without defending.
3. Pull the last three churned customer notes. Read them for the pattern, not the exceptions.
4. List what the team keeps if you change direction. That's the minimum to retain. Write it down.
5. Write the one-sentence description of the new direction. If you can't do it in one sentence, you don't have one yet.
6. Set a decision date for the direction question. Not a review date. A decision date.
7. Ask your lead engineer: "what are we actually building right now?" The answer tells you if the team has already decided.
8. Pull up the last board update. Count how many times you described the direction as "evolving."
9. Find the team member who has been quietly building for the new direction. Tell them you see it.
10. Write the cost of six more months in the current direction. Compare it to the cost of cutting now.
11. Ask an investor or advisor: "does our direction story still make sense?" Listen to what they don't say.
12. Find the signal the market gave you three months ago that you put aside. Look at it again.
13. Schedule a conversation with your team lead about direction this week. Not a presentation. A real conversation.
14. Write what you'd tell a new hire on day one about where you're going. If it's not currently true, fix it.
15. Before the next all-hands, decide what's in and what's out. The team handles honesty better than ambiguity.
16. The half-pivot option on the table: write why it's easier than the full one. Then decide if easier is better.
17. Find the customer who has stayed longest. Ask what they'd need to stay through a direction change.
18. Block one hour today to think about the direction. No documents, no meetings. Just thinking.
19. Name the one outside voice whose opinion on this would carry real weight. Call them this week.
20. Before the end of the week, write the decision. Not the deliberation. The decision.

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender opposes your indecision — their conviction about a specific direction puts pressure on the decision you've been deferring"
- vs #2 Theatre Director: "the Theatre Director trines your deliberation — the ceremonies run on schedule while the pivot decision stalls; notice what the ritual is covering"
- vs #3 Cornered Resource: "the Cornered Resource opposes your thinking — their structural advantage is either the reason to stay or the thing you'd have to abandon; figure out which before the next planning meeting"
- vs #5 Customer-Adjacent: "the Customer-Adjacent conjuncts your decision — the customer signal they bring today is the cleanest read you'll get on whether the direction is right; treat it as evidence"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your timing — the person with the original vision is back in the room with opinions; know your position before they announce theirs"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser trines your stall — the room stays calm and nobody pressures you to decide today; that calm is the danger"
- vs #8 Top-1-Percent: "the Top-1-Percent opposes your hesitation — they'd have decided by now, and you know it; use that as the prompt"
- vs #9 Saying-No: "the Saying-No conjuncts your edge — their clean no is what you've been calling a maybe; watch how they do it"
- vs #10 Eval-Forward: "the Eval-Forward squares your window — one more measurement before commitment is offered today; check whether it's a real gate or a delay you agreed to"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic trines your decision point — they'll name the gap in the current direction today, and it may be the reason you've been deferring"
- vs #12 Empathy-Tourist: "the Empathy-Tourist squares your signal — a user story gets cited as evidence for or against the change; verify whether the underlying interview changed anyone's mind"

### Archetype 5 — The Customer-Adjacent

Corpus anchors: `continuous-discovery.md`, `jobs-to-be-done.md`

Topic files (rotated daily): `continuous-discovery`, `jobs-to-be-done`, `opportunity-solution-tree`, `product-sense`, `evaluating-product-bets`

**Predictions (30):**
1. The Slack quote from the sales call is not a customer interview. You know this.
2. Someone will forward you a support ticket and call it customer signal. It's one data point. Don't build on it.
3. You have three customer calls on the calendar. Two will reschedule. Run the one that doesn't.
4. Today's interview will surface a workaround you had no idea existed. That's the data.
5. A stakeholder will ask "what are customers saying?" If you haven't talked to one this week, the honest answer is embarrassing.
6. You'll be tempted to ask "would you use this?" Don't. Ask what they did last time they needed to do that thing.
7. The customer who seems happiest is the one with the lowest expectations. Check the churned account instead.
8. Someone will send you a NPS export and call it customer research. The responses are hypothetical. The interviews aren't.
9. Your product intuition is only as fresh as your last real conversation. When was the last one?
10. Today a paying customer will tell you something that makes your roadmap look wrong. Let it.
11. The job the customer is hiring your product for is probably not the job you described in the last strategy doc.
12. Someone will say "we already know what customers want." Ask when they last ran a story-based interview.
13. A customer insight that lives in someone's head is not an insight. Write it down with the name, date, and exact quote.
14. The workaround the customer built is the product you should be making. Find it before a competitor does.
15. Today's interview will be derailed by a customer who wants to tell you about a competitor. Let them. Listen.
16. The sales team's notes are not discovery. They are a starting point for discovery. Know the difference.
17. Someone will propose a feature. Ask: have we heard a specific customer describe the problem this solves? If not, it's a guess.
18. The customer's answer to "would you pay for this?" is almost always yes. Ask whether they'd switch away from what they use now.
19. Today is a good day to run a story-based interview instead of reading the analytics.
20. A customer who says they'd love something is being polite. A customer who describes a broken workaround is giving you product direction.
21. The job is not "use your product." The job is the thing they're trying to accomplish before they even thought of you.
22. You have data on what customers click. You don't have data on why. That's what the interview is for.
23. Someone will conflate customer proximity with customer knowledge. Being close to the account team is not the same thing.
24. The switch interview question that matters: what made them finally do it? The answer is the actual job.
25. Today's discovery synthesis is overdue. The interview notes in the doc are not the synthesis.
26. A customer will describe a competitor doing something you thought was a differentiator. Don't dismiss it.
27. The feature request you got three times from sales is a symptom. The job is upstream. Find it.
28. You'll feel pressure to validate the roadmap in the interview. The interview isn't for that.
29. The customer didn't hire your product because of the feature list. They hired it for one specific job in one specific moment. Do you know which one?
30. Today your customer calls are the most important meetings on your calendar. Everything else is coordination. This is the signal.

**Nudges (20):**
1. Schedule one customer interview this week. Not a check-in. A story-based interview about what they were doing before they found your product.
2. Before your next customer call, write three "tell me about the last time..." questions. Use those, not "would you use this?"
3. Send one interview recording to an engineer on your team. Ask them to listen for the workaround the customer describes.
4. Write down the job your product is hired for in one sentence. Then check whether the last three customer interviews support that sentence.
5. Dig up the notes from your last three discovery interviews. Look for the pattern you filed away and forgot about.
6. Find the support ticket that's been open the longest. Call the customer who filed it. Ask what they were actually trying to do.
7. Ask a churned customer for 15 minutes. Ask what they were doing before your product and what they're doing now. Both answers are the real story.
8. Pull up the last feature request from sales. Write the JTBD version: what job is the customer hiring this feature for?
9. Before the next sprint planning, attach at least one real customer quote (with context) to each priority item. If you can't, the priority isn't grounded.
10. Write down the last five things you heard from customers. Note whether you heard them in an interview or from a second-hand source.
11. Ask one customer: "what were you doing before you had this?" The answer is the workaround you need to beat.
12. Block 30 minutes on Friday to synthesize this week's interviews. Not just notes. Patterns, contradictions, surprises.
13. Find one thing a customer said last month that you haven't acted on. Decide whether to act or explicitly decide not to.
14. Invite an engineer to your next customer interview. The patterns they spot will inform their work longer than any PRD.
15. Before you write the next spec, write the customer quote that justifies it. If you don't have one, go get one.
16. Map the customer's old process before your product existed. That map tells you what jobs they hired you for and what jobs you haven't solved yet.
17. Ask one internal stakeholder: "what do you think the customer's biggest complaint is?" Then ask one customer the same question. Compare.
18. Find three customers who use your product in a way you didn't design for. That's a job you didn't know you'd been hired for.
19. Run a Mom Test audit on your last interview notes. Count how many questions were hypothetical. Replace them for the next interview.
20. Write the forces that pushed the customer away from their old solution and pulled them to yours. If you can't name both, the job is still unclear.

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender trines your research today; the customer signal you're sitting on is the strongest argument they have, so hand it over before the review"
- vs #2 Theatre Director: "the Theatre Director conjuncts your calendar; a ceremony will crowd out the customer interview you were going to run, so protect the slot before the day fills up"
- vs #3 Cornered Resource: "the Cornered Resource conjuncts your access; the customer data you hold and their structural advantage are aligned today, so make sure both are visible to the same room"
- vs #4 Pivot-Hanged: "the Pivot-Hanged conjuncts your signal; the customer evidence you have right now is the cleanest read on which direction to go, and they're waiting for it"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your interview notes; the person re-engaging with product has strong opinions about customers today, so ground the conversation in a real quote before it turns into intuition"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser trines your room; the meeting stays calm today, but the customer insight you're sitting on is the one thing that would make it productive"
- vs #8 Top-1-Percent: "the Top-1-Percent trines your practice; the high-bar instinct aligns with weekly discovery today, so use it to push the team toward more interviews, not fewer"
- vs #9 Saying-No: "the Saying-No squares your signal; a no that needs to be said today is justified by customer evidence you already have, so cite the interview, not the intuition"
- vs #10 Eval-Forward: "the Eval-Forward trines your data; the rigor they apply to evals maps well to interview synthesis today, so a joint working session would be unusually productive"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic squares your discovery; someone will challenge whether the customer interviews are connected to the strategy, and the honest answer is to build that connection right now"
- vs #12 Empathy-Tourist: "the Empathy-Tourist opposes your practice; both did customer research this week, but one of you changed the plan based on it, and today you'll find out which one"

### Archetype 6 — The Founder-Mode Returnee

Corpus anchors: `founder-mode.md`, `pm-influence.md`, `decision-making-frameworks.md`, `spotting-bad-pm-behaviors.md`

Topic files (rotated daily): `founder-mode`, `pm-influence`, `decision-making-frameworks`, `spotting-bad-pm-behaviors`, `defending-big-bets`

**Predictions (30):**
1. You have a strong opinion about something you haven't seen the current data on. Read the data first.
2. Someone on the team made a call last quarter you would have made differently. Ask why before you say so.
3. What you remember as the real problem is probably not the real problem anymore. Confirm before the meeting.
4. Today's retro will surface a decision that was debated and made while you were away. You weren't in the room. Own that.
5. Your week-one instinct is to fix three things. Pick one. Let the others breathe.
6. The team's roadmap has two or three things that feel off to you. Spend a week understanding why they're there before you touch them.
7. Someone will present work they're proud of. Your job today is to understand why, not to correct it.
8. A decision that looks wrong from the outside looks different once you know the full context. Get the context first.
9. You will be tempted to call the old approach 'just simpler.' It was, for a team that didn't know what they know now.
10. The engineer who says 'we tried that' is not being defensive. Ask what they tried and what broke.
11. Today your best contribution is a question, not a direction.
12. You will walk out of a meeting with a clear view of what should change. Write it down and wait 48 hours.
13. Someone has been protecting a decision since before you returned. Before you challenge it, understand what they were protecting against.
14. The team's tooling choices look unfamiliar. The switching cost is higher than it appears right now.
15. Your old customer intel is stale. Run a customer call before you act on your returning intuition.
16. A newer PM on the team is watching to see whether you override their judgment in week one. They will remember what they see.
17. Today the best signal about the team's health is whether they push back on your returning instincts with evidence. If they don't, that is the real problem.
18. The feature you would have shipped six months ago is one the team considered and held back for a reason. Find the reason.
19. You will trust your gut more than the data today. Your gut is not current. The data is.
20. Someone made a hard call under pressure while you were away. Acknowledge it before you critique the outcome.
21. The thing that felt slow from the outside looks different once you are inside the current sprint.
22. Your instinct to 'just ship a quick version' is about to collide with a technical constraint the team spent weeks working around. Ask first.
23. The sprint goal was set before you had context. Don't change it this sprint. Earn the influence to shape the next one.
24. A junior team member will push back on your returning instinct. They might be right. Check before you close it off.
25. Your strongest move today is to sit in on one full meeting without offering your opinion.
26. The org shipped things while you were away. Know what shipped and why before you recalibrate strategy.
27. Someone rebuilt a process you designed. They had a reason. Probably a good one.
28. The first week back is the worst week to make structural product decisions.
29. Your historical conviction about this product is an asset. But it is not current signal. Treat it like a hypothesis until you can verify it.
30. Today someone will quietly watch whether you're back to listen or back to lead. Make the answer obvious by listening.

**Nudges (20):**
1. Block one hour today to read the most recent discovery synthesis from start to finish before commenting on anything.
2. Write down the three biggest things that have changed since you stepped away. Then write down what you still don't know.
3. Ask one engineer: 'what's the hardest call the team made in the last six months?' Listen without correcting.
4. List your top three returning instincts. Mark each one: hypothesis (needs checking) or fact (you have current evidence for this).
5. Find the last two product decisions made without you. Read the notes. Ask one follow-up question for each, not two.
6. Before you change anything this week, ask who made that call and why. Write the answer down.
7. Find the one team member most likely to be straight with you. Ask them: 'what's the thing I need to understand before I start making calls here?'
8. Run one discovery call with a current paying customer before you act on any returning intuition.
9. Sit in on a sprint review without offering opinions. Just watch and listen.
10. Write the three things you would change immediately if you could. Put the list away for five days. Review on day six.
11. Schedule a 1:1 with whoever held the product together while you were away. Let them tell you what they learned. Don't give your verdict until the third conversation.
12. Before you move a roadmap item, ask: 'what was the reasoning that put this here?' The answer tells you what you're actually dealing with.
13. Send a short note to the team explaining how you plan to re-engage. Be specific about what you are there to do and what you are not there to do.
14. Find one thing the team did well while you were away. Say it out loud. Name the person who did it.
15. Check your first five messages back to the team. Were they questions or answers? The ratio is diagnostic.
16. Ask design: 'what customer problem guided the last two features?' If you don't know the answer before they tell you, you're not ready to change priorities.
17. Wait 30 days before changing anything structural about the team. Let the seams show before you decide what to cut.
18. When you feel the urge to say 'when I was running this,' stop. Ask instead: 'what happened after that?'
19. Write down one decision the team made while you were away that you would have made differently and that you now think they got right. That's the calibration you need.
20. At the end of the first week, ask yourself: did I add context or did I add confusion? Answer honestly.

**Aspect lines (11, one per partner archetype):**
- vs #1 Bet-Defender: "the Bet-Defender trines your return; their conviction on the current bet is grounded in evidence you don't have yet, so ask for the case before you form a view"
- vs #2 Theatre Director: "the Theatre Director squares your re-entry; the ceremony will look like overhead to you today, but resist cutting it before you understand what coordination problem it's solving"
- vs #3 Cornered Resource: "the Cornered Resource trines your instinct; the moat they've built looks intuitive, but the details are theirs; understand the moat before you start optimizing it"
- vs #4 Pivot-Hanged: "the Pivot-Hanged squares your timeline; their indecision has been building and the pressure on you to call a direction is real, but your day-three read is still incomplete"
- vs #5 Customer-Adjacent: "the Customer-Adjacent conjuncts your gap; their recent customer interviews hold context your pre-departure intuition doesn't, so ask for the synthesis before you bring your own"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser conjuncts your presence; two people in today's room are managing upward, so make sure neither of them is managing you before you've heard the team out"
- vs #8 Top-1-Percent: "the Top-1-Percent squares your authority; two high-bar instincts in the room today, and one belongs to someone who's been closer to the problem; treat it as collaboration, not competition"
- vs #9 Saying-No: "the Saying-No trines your return; the no they've been holding has history behind it, and if you override it in week one, the next no becomes more expensive for everyone"
- vs #10 Eval-Forward: "the Eval-Forward squares your pace; the rigor on the current feature looks slow from where you're standing, but ask what risk it's guarding before you set a deadline"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic trines your vantage; they spot the strategy gap from inside and you see it from outside; that alignment is rare, so use it before the room moves on"
- vs #12 Empathy-Tourist: "the Empathy-Tourist conjuncts your timing; both of you are doing user work that risks being performative; the one who changes something based on the calls wins the week"

### Archetype 7 — The Stakeholder-Pleaser

Corpus anchors: `pm-pitfalls.md` (Feature Factory pattern), `saying-no.md`

Topic files (rotated daily): `saying-no`, `pm-pitfalls`, `prioritization-frameworks`, `communicating-tradeoffs`, `getting-buy-in`

**Predictions (30):**
1. Someone will ask for something that doesn't fit the strategy. You'll say yes. Notice that.
2. The room leaves satisfied. Ask what hard thing got decided.
3. A stakeholder will frame the request as urgent. It probably isn't.
4. Today's yes is tomorrow's missed commitment.
5. Leadership will ask for a dashboard. Say yes if it's diagnostic. Not if it's decorative.
6. Every yes commits future capacity. Today's feels free. It isn't.
7. Someone will leave happy without giving anything up. That's the tell.
8. The nodding in today's meeting is relief, not consensus. Find the difference.
9. A polite yes has the same build cost as a strategic yes. The accounting is just slower.
10. Someone will invoice you for the yes you gave two sprints ago. Pay attention.
11. A stakeholder who always leaves your meetings happy has never heard the real tradeoff.
12. Two teams want the same slot. The compromise that makes both 50% happy leaves neither better off.
13. The calendar is full of syncs with people you said yes to. None of them are the strategy.
14. Someone will ask you to take something off the roadmap to add the new request. Your answer shouldn't be automatic.
15. The exec who got what they asked for last quarter is about to ask for something that conflicts with what the other exec got.
16. A feature that keeps the room happy is not automatically a feature that moves the customer.
17. Four competing priorities this quarter. They are not all getting done.
18. A stakeholder will call the ask small. Small asks share the same queue as big ones.
19. The yes you gave in planning has already been told to a customer by sales.
20. Someone will ask if you can just squeeze it in. The honest answer is no.
21. The calm room is a signal. Check whether it's the calm of alignment or the calm of everyone having given up.
22. A team that never hears no ships everything except the thing that matters.
23. Two things from last quarter's retro that you said yes to cost more than estimated. That's the pattern.
24. The product is a list of everything you agreed to. Not a strategy.
25. A stakeholder conflict landed on your desk. Your job is not to smooth it over. It's to decide.
26. Today's yes is a promise with a due date. Know what it is.
27. The most useful word in today's meeting is no. Prepare it before you walk in.
28. A stakeholder who respects you will respect a reasoned no more than a reflexive yes.
29. You have the data to say no to this request. Use it.
30. The room is calm. That's your superpower and your trap. Today, let something be uncomfortable.

**Nudges (20):**
1. Write down everything you've said yes to this quarter. Beside each item, write whose strategic priority it actually is.
2. Before you say yes today, ask: what comes off the list if this goes on?
3. Find the ask that has been in the backlog the longest without moving. Decide if it still matters.
4. Practice saying "let me think about where this fits" before answering. The pause is not a no. It's a real answer.
5. Write the one thing the product must ship this quarter. Everything else is secondary.
6. Send one stakeholder a no with a rationale this week. Note their reaction.
7. Ask your team: what should we stop building? Their answers are the roadmap cleanup you've been deferring.
8. For each request you agreed to last week, name the strategic goal it serves. If you can't name one, that's the answer.
9. Pull up the roadmap. Find one item you added to keep someone happy that has no owner now. Remove it.
10. Before the next stakeholder sync, prepare one sentence on why their top ask might not make the cut.
11. The cost of yes is not just the build time. It's the focus, the queue, and the strategy's clarity. Write those three costs down.
12. Find the one roadmap item nobody would fight for except to avoid conflict. Kill it.
13. At the end of today, count how many times you said yes. That number is diagnostic.
14. Before the next planning meeting, write down what you plan to say no to. Then say it.
15. Ask your engineering lead: what keeps getting delayed because other asks jumped the queue?
16. Find one feature that shipped because someone asked for it, not because you decided it belonged. Measure whether it moved the metric.
17. Write the sentence that describes your top priority in one clause. If you can't, you don't have one.
18. Find the request that has been under consideration for three sprints. Decide today.
19. Write the rationale for your next no before the meeting starts. Lead with the rationale, not the rejection.
20. The next time you feel the urge to smooth something over, name the tradeoff out loud first. Once is enough to start the habit.

**Aspect lines (vs each partner archetype):**
- vs #1 Bet-Defender: "the Bet-Defender opposes your table today — someone is willing to make an uncomfortable call; let them, and don't soften it before it lands"
- vs #2 Theatre Director: "the Theatre Director trines your meeting — two PMs optimizing for smooth today; ask whether smooth is the same as productive before the next one starts"
- vs #3 Cornered Resource: "the Cornered Resource squares your roadmap — they're guarding something structural, and your yes is crowding the queue; find out what's getting squeezed before the sprint locks"
- vs #4 Pivot-Hanged: "the Pivot-Hanged trines your stall — neither of you is deciding today; the question is which of you moves first"
- vs #5 Customer-Adjacent: "the Customer-Adjacent opposes your list — the customer evidence they brought doesn't support half the items you've agreed to; let it clean the roadmap"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee conjuncts your yes — a senior voice is adding weight to a request you've been soft-yes-ing; today is the day to give it a real answer"
- vs #8 Top-1-Percent: "the Top-1-Percent opposes your reflex — the high-bar instinct finds your yes-pattern today; use their pushback to say the no you've been holding"
- vs #9 Saying-No: "the Saying-No conjuncts your moment — the no you've been saving is ready to say; deliver it with the rationale, not the hedge"
- vs #10 Eval-Forward: "the Eval-Forward trines your list — their rigor clears a few easy yeses off the table today; let it"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic squares your roadmap — they'll name the items that don't connect to strategy; know which ones you're defending before they start"
- vs #12 Empathy-Tourist: "the Empathy-Tourist conjuncts your pattern — two PMs keeping the room comfortable today; the one who says no first wins the week"

### Archetype 8 — The Top-1-Percent

Corpus anchors: `top-1-percent-pm.md`, `becoming-senior-pm.md`, `pm-influence.md`, `product-sense.md`, `decision-making-frameworks.md`

Topic files (rotated daily): `top-1-percent-pm`, `becoming-senior-pm`, `pm-influence`, `product-sense`, `decision-making-frameworks`

**Predictions (30):**
1. The call you've been the only one to hold for three months is about to get company. You were right; the team needs to hear that before someone else announces it.
2. Someone on your team ships something at the standard you've been holding. Acknowledge it visibly. It's rare.
3. Today you'll do a task that belongs to someone else because you don't trust them yet. That's where the burnout math starts.
4. A peer will ask how you get things done. The real answer involves decisions you made before they were in the room.
5. The thing that feels slow is not slow. It's careful. Learn the difference before you override it.
6. You'll have the answer before the question finishes. Today, wait.
7. A customer detail you noticed last week turns into the design constraint today. That's not luck.
8. Cross-functional credibility is today's asset. One specific thing said to engineering will matter more than the spec.
9. The bias-to-action instinct will push hard this morning. Check first whether the action you're biased toward is the right one.
10. Someone will do the analysis and get 80% there. The 20% they missed is real. The question is whether you need it before shipping.
11. A framework will come up in the meeting. The answer exists without it. Use the framework to communicate, not to decide.
12. Your opinion will form faster than the room's. Slow it down enough to let someone else get there.
13. The thing that's slowing the team today is not the team. It's the decision that hasn't been made.
14. A stakeholder wants a roadmap. You want a strategy. Today you have to give them both.
15. You'll be asked to do something one level below your current scope. Do it if it unblocks the team. Don't do it twice.
16. The highest leverage thing today is not the work. It's the conversation with the engineer who's about to go down the wrong path.
17. Someone will update you on progress. The details they leave out are worth asking about.
18. Your judgment has been right more often than wrong this quarter. Don't let that calcify into certainty about a question you haven't actually examined.
19. The team ships something you'd have done differently. Before you say anything, ask whether it worked.
20. You have a clearer picture of the strategy than anyone in the room. The constraint is not your clarity; it's their access to it.
21. The long-term bet you've been holding is under review. Its strongest argument is the one you haven't said yet.
22. Today will feel like it was spent on the wrong things. That's often wrong. Check what actually moved.
23. Someone will escalate the thing you thought you'd resolved. It wasn't resolved; it was deferred. Deal with the actual disagreement.
24. A decision you thought was closed will reopen. Don't resist the reopening; check whether your original rationale still holds.
25. A junior PM is watching how you handle the hard call. You may be the mentor without knowing it yet.
26. You can write the spec faster than the team can. Don't. Ask for it, give feedback, and let the author improve.
27. The week you felt most productive was not the week you shipped most. Track what you mean by that word.
28. The room will defer to you faster than you think is useful. Redirect the deference toward whoever has the most context.
29. Operating one level above your title is a stance, not a job description. Today it shows up in how you frame the tradeoff, not in the title you hold.
30. Burnout isn't about hours. It's about working on things that don't use you well. Check which this week is.

**Nudges (20):**
1. Pick one decision this week that belongs to your team, not you. Write it down. Hand it over. Follow up only if asked.
2. After the next meeting where you had the answer early, write down what you'd have missed if you'd spoken first.
3. Find the one team member closest to the top-1-percent bar and say it to them directly. They probably don't know.
4. Name the thing you're doing because nobody else will. Ask whether that's actually true, or whether you haven't trusted the team to find out.
5. Before you jump into the analysis, ask who on the team would be better positioned to do it. If the answer is no one, that's a gap to fix, not a reason to keep doing it yourself.
6. Pull up your customer notes from the last two weeks. Find the detail you haven't told anyone yet. Put it into the next relevant conversation.
7. Write the strategic case for your top priority in four sentences. If any sentence has a framework name instead of a claim, replace it with the claim.
8. Find the cross-functional relationship that's weakest right now. One specific compliment or question this week will move it more than a sync invite.
9. Ask a junior PM what they think before you give your take. Then ask yourself whether you actually updated after hearing them.
10. Check your task list for anything that's been there more than two weeks without moving. Either decide or delete.
11. At the end of the week, write down the three decisions that mattered most. Were they made by you or by the team?
12. Find the thing you're holding as a single point of failure. Name the person you'd hand it to if you disappeared tomorrow.
13. Write down the last time you changed your mind in public. If it's been more than two weeks, you're optimizing for looking right, not being right.
14. The next time you're tempted to redo something a teammate did, ask whether the difference matters to the customer. If it doesn't, leave it.
15. Track your energy at the end of each day for a week. The pattern is telling you something about where you're spending it.
16. Tell one person on your team what you think the highest-leverage thing they could do this week is. Ask if they agree.
17. Find the decision you've been the only one capable of making for more than one sprint. Fix the knowledge gap that's causing that.
18. Before the next review, write the one sentence that explains what you're optimizing for. If it sounds like a metric, not a strategy, rewrite it.
19. Find the last piece of work your team was proud of. If you've already forgotten it, say something now.
20. Delegate one thing this week that you could do better. Do it on purpose. Notice what happens.

**Aspect lines (11, one per partner archetype):**
- vs #1 Bet-Defender: "the Bet-Defender trines your bar — their conviction and your quality instinct are aligned today; the meeting where both of you are in the room is the one that produces the real decision"
- vs #2 Theatre Director: "the Theatre Director opposes your instinct — the ceremony runs where the work needs to be; ask what would happen to the team's coordination if the meeting didn't exist"
- vs #3 Cornered Resource: "the Cornered Resource conjuncts your standard — their moat is worth scrutinizing today; the question that sharpens the moat is better than the one that protects it"
- vs #4 Pivot-Hanged: "the Pivot-Hanged opposes your timeline — the decision they're avoiding has a cost that compounded last week; name the cost before you name the direction"
- vs #5 Customer-Adjacent: "the Customer-Adjacent trines your bar — their weekly discovery practice is the work at the standard; connect the insight they brought to the decision that's stalling"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your proximity — two high-bar views in the room today, and one belongs to the person who's been closest to the current state; ask before you reassert"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser opposes your pattern — their yes-reflex and your quality bar are pulling in different directions today; name the tradeoff that's getting smoothed over"
- vs #9 Saying-No: "the Saying-No conjuncts your conviction — two instincts for holding the line today; check that the no you're both protecting isn't covering a yes that actually belongs on the list"
- vs #10 Eval-Forward: "the Eval-Forward trines your bar — their rigor on evals is the kind of deliberate quality instinct you trust; check whether the threshold is serving the user or becoming the decision itself"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic squares your bias — they'll identify what doesn't connect to strategy today with precision; ask for their alternative before you supply your own"
- vs #12 Empathy-Tourist: "the Empathy-Tourist opposes your practice — they did a customer call this week; the question is whether anything changed in the next decision they made; that's the only metric that matters"

### Archetype 9 — The Saying-No

Corpus anchors: `saying-no.md`

Topic files (rotated daily): `saying-no`, `prioritization-frameworks`, `communicating-tradeoffs`, `getting-buy-in`, `pm-influence`

**Predictions (30):**
1. Someone will ask you to add something to the list. Your no is the most honest thing you'll say today.
2. A stakeholder will call the ask small. Run the math on what small takes, anyway.
3. The yes you're tempted to give this morning has a rationale problem. Write the rationale first.
4. Someone will accept your no with more grace than you expected. This is what leading with the reason does.
5. Two competing requests arrive today. Only one aligns with the strategy; that is not a hard call.
6. The stakeholder who has never heard no from you before is about to. Have the reason ready before you send the message.
7. An ask that sounds urgent is rarely as urgent as described. Confirm the actual deadline before you decide.
8. Someone loops in your manager hoping to reverse the no. Your original rationale holds. State it again without apology.
9. Every yes today is a hidden no to something on the list. Make that explicit before you agree.
10. A request comes in from sales. The right answer is not automatic.
11. Today's soft no, "let me look into it," is a debt you'll pay in a harder conversation later.
12. The word "just" before an ask is a tell. Nothing that starts with "just" is ever just that.
13. You said yes to something last week you should have said no to. Today is a good day to correct the record.
14. Someone will say "I thought we agreed." Check whether you agreed or whether you deferred.
15. The no you're rehearsing needs the rationale in the first sentence, not the third.
16. Someone on the team is relieved when you say no. They weren't going to say it.
17. A thoughtful no earns more trust than a reflexive yes. The stakeholder already knows this.
18. The ask that sounds like a favor is a commitment. Name what it is before you respond.
19. The right no today is one sentence with a reason, not a hedge.
20. Two stakeholders are both expecting a yes on incompatible asks. Only one of those is possible.
21. Someone will push back on your no. The rationale doesn't change because they're unhappy.
22. The pattern across your last five yeses will tell you what the team thinks your strategy is.
23. An exec will ask for a quick dashboard. The right answer depends on whether it's diagnostic or decorative.
24. Today's no protects someone else from having to say it next month.
25. The request has been on the list twice before. The answer is the same as it was both times.
26. Someone frames the ask as a customer need. Ask for the specific customer and the specific interview.
27. Your no will feel uncomfortable to say and comfortable in a week. That ratio is a guide.
28. The hedge you're about to send is a no that doesn't know it's a no yet.
29. The ask you're considering is real. So is the capacity it costs. Make both visible before you decide.
30. Being known for thoughtful no's means your yes lands differently. That's the point.

**Nudges (20):**
1. Before your next response to a stakeholder ask, write the one-sentence rationale. Then lead with it.
2. Review the last five things you said yes to. Name the strategic goal each one serves.
3. Find the thing you said "let me look into it" to last week. Close it today with a real answer.
4. Write the three things the team must ship this quarter. Everything else is a candidate for no.
5. Before the next planning sync, identify the one ask you plan to decline. Prepare the rationale.
6. Find the request that's been "under consideration" for three weeks. Make the call.
7. Send one no today with a rationale. Note whether the stakeholder asks a follow-up or accepts it.
8. Count how many open maybes you're carrying. Each one is a conversation you owe.
9. Before you say "let me check on that," decide whether you already know the answer.
10. Find the stakeholder who has never heard no from you. Check whether that's by design or avoidance.
11. Write the cost of the last yes that shouldn't have been: capacity, queue, delay.
12. Practice the one-sentence no: "We're not doing this in Q3 because [reason]." No softer version.
13. Check the roadmap for items no one would fight for. Each one is a yes that should have been a no.
14. Before the next exec ask, check whether you'd say the same thing to all four execs who sent similar requests. Consistency is the test.
15. Ask your engineering lead what's been pushed back because other asks jumped the queue.
16. For each request you deferred this week, set a decision date, not a review date.
17. Find the one stakeholder who respects your no's most. Ask them what makes a no land well.
18. Write the rationale for a no you need to give this week. Share it with one colleague before you send it.
19. Before today's planning meeting, write the single thing that cannot move. Everything else is negotiable.
20. At the end of the day, note how many times you gave a real answer and how many times you deferred. The ratio is diagnostic.

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender trines your line today; their conviction on the bet and your no on everything else are pointing at the same thing, so name the shared rationale before someone else frames it as resistance"
- vs #2 Theatre Director: "the Theatre Director conjuncts your agenda; the ceremony is where your no should have landed two weeks ago, so say it in the room this time rather than after the meeting"
- vs #3 Cornered Resource: "the Cornered Resource trines your position; protecting the moat and protecting the roadmap are the same argument today, and your no has structural backing if you use it"
- vs #4 Pivot-Hanged: "the Pivot-Hanged squares your clarity; their maybe and your no are incompatible today, so your clean close is the thing that unsticks the decision"
- vs #5 Customer-Adjacent: "the Customer-Adjacent conjuncts your rationale; the interview evidence they're holding is the strongest reason for your no, so ask for it before you send the message"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your no; a senior voice is adding weight to an ask you've been ready to decline, and the rationale needs to land before the pressure builds"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser opposes your instinct; two different default responses to the same ask are in the room today, so make sure yours is the one that gets heard"
- vs #8 Top-1-Percent: "the Top-1-Percent conjuncts your conviction today; their high-bar instinct and your firm no are aligned, so check that you're not together blocking something that actually belongs on the list"
- vs #10 Eval-Forward: "the Eval-Forward squares your pace; their gate and your no are both slowing the sprint today, so align on which one matters more before the team decides for you"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic trines your case; the diagnosis they're naming today gives your no a structural rationale it didn't have before the meeting"
- vs #12 Empathy-Tourist: "the Empathy-Tourist squares your close; a customer call gets cited as the reason to keep the ask open, so verify whether the interview actually supports that before you let it change your answer"

### Archetype 10 — The Eval-Forward

Corpus anchors: `evals-for-ai-products.md`, `pm-pitfalls.md`

Topic files (rotated daily): `evals-for-ai-products`, `pm-pitfalls`, `prompt-engineering`, `ai-product-lifecycle`, `ai-pm-skills`

**Predictions (30):**
1. Someone will want to ship today because the output looks good. Ask when they last read traces.
2. The eval suite you haven't updated in six weeks is measuring the wrong thing. Check what it's missing.
3. A PM who vibe-checks three outputs and calls it quality assessment is about to make a call you'll have to undo.
4. Today's AI feature is one trace-read away from a failure mode nobody has named yet.
5. Someone will propose an LLM judge before any human has read the outputs. That's backwards.
6. The block you're holding is real. Make sure the ask is specific: which failure mode, what threshold.
7. An engineer will ask what "good" looks like. The eval criteria is where that answer lives, not in the PRD.
8. The vibe check from last week is not the signal you need today. Open the observability tool.
9. You have three failure-mode categories that need promoting to structured criteria. Do one today.
10. A stakeholder will say the output is "close enough." Ask close enough to what, exactly.
11. The eval pass-rate trend from the last 90 days tells you more about this feature than the demo did.
12. Someone will try to automate the quality check before the open-coding pass is done. Slow it down.
13. The first upstream failure in the trace is the one to fix. The others are downstream of it.
14. Today the product quality question and the eval question are the same question.
15. An exec will ask about quality. "It looks good in testing" is not an answer for a generative product.
16. The eval that runs on 20 examples is telling you something. The one that runs on 200 is telling you more.
17. You'll be asked to approve shipping before the last eval run completes. Know your minimum viable check.
18. A failure mode you saw in last week's traces is about to appear in production. You knew it was there.
19. Someone will say "we can fix it post-launch." Ask whether this is a reversible or irreversible failure mode.
20. The criteria you're holding are real. The question is whether all of them are blockers or whether some are nice-to-haves.
21. Today's trace is more useful than today's meeting. Make sure you know which one you're prioritizing.
22. An engineer needs the eval criteria before they can finalize the implementation. Write them today.
23. The LLM judge score looks good. Ask whether it has domain context or whether it's pattern-matching on plausibility.
24. Someone will propose shipping to a small percentage first. That's fine if you're watching the traces.
25. The open-coding session you've been putting off is now the blocker. Schedule it today.
26. A product that ships with no eval baseline has no way to know if it got better or worse after the next change.
27. Someone mistakes a good demo for a good eval. They're different products of different work.
28. The hardest part of building evals is the first ten traces. The system gets faster after that.
29. Your most important quality question isn't on the scorecard. It's in the free-form notes from last week's open-coding pass.
30. The feature that ships with a baseline eval is the feature you can confidently improve. The one that ships without is a guess.

**Nudges (20):**
1. Open your observability tool and read five traces today. Not to look for problems, just to read them.
2. Write free-form notes on the first wrong thing you see in each trace. One note per trace. Move on.
3. Cluster this week's trace notes into three to five failure-mode categories. Name each one.
4. Promote the top two failure-mode categories into structured eval criteria. Write the criteria, not just the category name.
5. Find the eval suite that hasn't been updated in the last four sprints. Check whether the failure modes have changed.
6. Before you propose an LLM judge for anything, verify that human-labeled examples exist for calibration.
7. Write the one-sentence version of what "good" means for the feature you're shipping next. Then make it a criterion.
8. Ask the engineer: "what would a bad output look like for this feature?" Their answer belongs in the eval spec.
9. Check the pass-rate trend from the last 90 days. If it's flat, the evals may not be measuring the right thing.
10. Run a spot-check on ten traces with a domain expert. Note the first thing they flag as wrong.
11. Before the next review, identify which eval criteria are true blockers and which are nice-to-haves. The team needs to know which is which.
12. Find the eval that's been running set-and-forget for six months. Rerun the open-coding pass.
13. Ask your team: "if this feature regresses next sprint, how would we know?" The answer is whether you have an eval.
14. Write the failure mode that scares you most for this feature. If you don't have an eval criterion for it, write one.
15. Block two hours this week for an open-coding session on last month's production traces.
16. Before you add an eval requirement to the shipping gate, check whether it's a blocker or a preference.
17. Find the one place where the LLM judge and human raters most often disagree. That's the gap in the judge's domain context.
18. Send one trace to a domain expert and ask them to annotate the first thing they'd fix. That annotation is worth five rubric lines.
19. Review the criteria you blocked a ship on last time. Check whether the threshold was right in retrospect.
20. Write a one-paragraph summary of the current eval suite for the next planning meeting. If you can't explain it in a paragraph, the team can't use it.

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender squares your gate today; their conviction says ship and your eval says not yet, so name the specific criterion that's blocking and negotiate it rather than just holding the line"
- vs #2 Theatre Director: "the Theatre Director conjuncts your process; a quality gate gets added to the workflow today, so make sure it produces a failure-mode list and not just a sign-off ceremony"
- vs #3 Cornered Resource: "the Cornered Resource trines your rigor; the moat they're protecting is durability-tested by your evals today, so share the pass-rate trend before the competitive review"
- vs #4 Pivot-Hanged: "the Pivot-Hanged conjuncts your gate; one more eval pass before commitment is on the table today, so make sure it's resolving real uncertainty and not just extending the delay"
- vs #5 Customer-Adjacent: "the Customer-Adjacent trines your evidence; interview synthesis and trace analysis are converging on the same failure mode today, so connecting them makes both stronger"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee squares your timeline; the returning instinct says ship faster and your eval work says the quality gap is real, so show the specific failure mode, not just the process"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser trines your gate; a few yeses come off the table today because the evals don't support them, so let the rigor do the closing"
- vs #8 Top-1-Percent: "the Top-1-Percent trines your standard; two high-quality instincts in the room today, so use the eval results to give their quality intuition a traceable foundation"
- vs #9 Saying-No: "the Saying-No squares your pace today; two different gates in the sprint and the team needs to know which one is the real blocker, so be specific about what you're holding and why"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic squares your scope; they'll question whether eval rigor belongs in the planning conversation today, so show the link between failure-mode categories and shipping risk, not just the methodology"
- vs #12 Empathy-Tourist: "the Empathy-Tourist squares your evidence; a user call gets cited alongside the eval results today, so check whether they're pointing at the same failure mode or different ones"

### Archetype 11 — The Strategy-Skeptic

Corpus anchors: `good-strategy-rumelt.md`, `product-strategy.md`

Topic files (rotated daily): `good-strategy-rumelt`, `product-strategy`, `evaluating-product-bets`, `assessing-product-strategy-as-board`, `seven-powers`

**Predictions (30):**
1. The strategy doc in today's review does not have a diagnosis. It starts with a goal.
2. Someone will say "our strategy is to be the best at X." That's not a strategy.
3. A roadmap item will come up that nobody can connect to a goal. The strategy review missed it.
4. A guiding policy that sounds directional but makes no trade-off is the doc's tell. Find it.
5. Someone will show a slide with four equally weighted priorities. Rumelt called this out decades ago. It still happens.
6. The "coherent action" question is the hardest one to answer in today's strategy review. Name it.
7. Someone will use the word "innovative" without a specific structural barrier in mind. Ask which power it corresponds to.
8. The diagnosis in the strategy deck is vague. That's where the rest of the strategy comes unstuck.
9. You can spot the fluff in the first two pages. Your job today is not just to name it but to replace it.
10. A strategy built on "we're better at X" needs a power behind it. Better is not a power.
11. The deck describes the market opportunity. It doesn't describe what will prevent a competitor from taking it. That's the gap.
12. Someone will say "our strategy is customer-centricity." Ask what they're not doing as a result.
13. The team is building something that made sense under the old diagnosis. The diagnosis has shifted.
14. Today's planning will produce a roadmap that doesn't connect to the strategy stack. Notice it.
15. An aspirational statement masquerading as a diagnosis will anchor the whole conversation. Push for the real causal model.
16. Someone has done the diagnosis. Nobody wrote the guiding policy. That's today's gap.
17. The most useful thing you can do today is ask "what are we saying no to?" If nobody knows, there's no strategy.
18. A competitor announcement will be framed as a threat. Ask whether it changes the diagnosis or just the anxiety level.
19. The strategy review will generate a list of things to add. Your role today is to name what stays off.
20. Someone will say "this is directional, not prescriptive." That's usually a way of deferring the real call.
21. Today's strategy conversation needs someone to say the quiet part: the current approach doesn't have a structural barrier.
22. A plan with six top priorities has zero. Name the one.
23. The "winning aspiration" in the deck is actually a goal. Ask the Martin question: where will we play?
24. The roadmap connects to goals. The goals don't connect to the strategy. That's the chain that breaks.
25. Someone will argue that faster AI iteration has made strategy irrelevant. That's wrong. Faster cycles need clearer diagnosis, not less strategy.
26. A coherent action is one that makes the others stronger. Find the roadmap item that does that. If you can't, that's the problem.
27. The strategy has existed for 18 months. The market has moved. Check whether the diagnosis still holds.
28. A startup will be cited as moving faster. Ask whether it has a structural advantage or just more urgency.
29. Today is a good day to apply the Helmer screen: which power are you building? None is also an answer, and it's the honest one right now.
30. The strategy deck is done. The diagnosis is clear. The policy is clear. The coherent actions are not. That's the last mile and the hardest one.

**Nudges (20):**
1. Read the strategy doc and underline every aspirational statement. Each one is a candidate for replacement with a specific claim.
2. Write the diagnosis in one sentence: "We are in a situation where [X] because [Y]." If you can't, the strategy is unmoored.
3. Apply the Rumelt kernel to the current strategy doc: find the diagnosis, guiding policy, and coherent actions. Name the weakest link.
4. Ask: "what are we not doing because of this strategy?" If nobody can answer, there's no real guiding policy.
5. Find the one thing in the roadmap that makes all other roadmap items more valuable. That's the coherent action to protect.
6. Run the 7 Powers screen. Which power does the current strategy build toward? "Better" is not one of them.
7. Write the competitor move that would most threaten the current strategy. Then check whether the strategy has an answer for it.
8. Identify one slide in the strategy deck that could be removed without weakening the argument. Remove it.
9. Apply Roger Martin's question two: "where will we play?" If the answer is everywhere, it's not a strategy.
10. Ask your team: "what would we stop doing if we took this strategy seriously?" The answers are the real coherent actions.
11. Find the diagnosis that was written 12 months ago. Check whether the market has moved enough to require a revision.
12. Write a one-paragraph alternative to the current guiding policy. Not to replace it, but to force yourself to think about what else it could be.
13. Ask one executive: "what would success look like in 24 months, specifically?" The answer tells you whether they and the strategy agree.
14. Find the item in the strategy that everyone agreed to without debate. That's the one most likely to be fluff.
15. Write the strategy in three sentences: diagnosis, guiding policy, three coherent actions. If it takes more, simplify first.
16. Run the Helmer screen on the competitor you're most worried about. Name which power they're building. That is your actual strategic problem.
17. Ask: "is what we're proposing a strategy or a list of goals?" If it's goals, write the strategy that connects them.
18. Find the roadmap item nobody would fight to keep if they had to defend it against the strategy. That item is the tell.
19. Write the guiding policy in terms of what you will NOT do. That version is usually more useful than the positive framing.
20. At the end of today's strategy review, write one sentence describing the gap between what was said and what a good strategy requires. Share it with one person.

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender trines your analysis today; the bet they're holding is either the coherent action the strategy needs or one that belongs under a different diagnosis, so test it before you challenge it"
- vs #2 Theatre Director: "the Theatre Director squares your review; the retrospective surfaces a gap between the sprint and the strategy today, so use the ceremony data to ground the diagnosis rather than to assign blame"
- vs #3 Cornered Resource: "the Cornered Resource trines your position; the moat they're protecting is one of seven powers, and you can name which one today, which is more useful than pointing out what it's not"
- vs #4 Pivot-Hanged: "the Pivot-Hanged conjuncts your analysis; the decision they're deferring hinges on a diagnosis you can provide today, so name the causal model before they make the wrong call"
- vs #5 Customer-Adjacent: "the Customer-Adjacent squares your analysis today; the interview synthesis they're holding is either informing the diagnosis or it's disconnected from the strategy, and that's the question worth asking in the room"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee trines your vantage; two people see the strategy from outside the current sprint today, so use that shared view to update the diagnosis before the team locks the quarter"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser squares your review; the roadmap they've assembled is about to face the Rumelt test today, so have the alternatives ready before you name the gaps"
- vs #8 Top-1-Percent: "the Top-1-Percent squares your audit; they'll spot what doesn't connect to strategy before you say it out loud, so ask for their read before you give yours"
- vs #9 Saying-No: "the Saying-No trines your case; the guiding policy you're naming today gives their no a structural rationale it didn't have before the meeting, so hand it to them"
- vs #10 Eval-Forward: "the Eval-Forward squares your scope; the eval methodology is getting pulled into the strategy conversation today, so show how the failure-mode taxonomy connects to the strategic diagnosis, not just the feature"
- vs #12 Empathy-Tourist: "the Empathy-Tourist conjuncts your analysis today; a user research session gets cited in the strategy review, and the question is whether it's updating the diagnosis or filling airtime"

### Archetype 12 — The Empathy-Tourist

Corpus anchors: `continuous-discovery.md`, `spotting-bad-pm-behaviors.md`

Topic files (rotated daily): `continuous-discovery`, `spotting-bad-pm-behaviors`, `jobs-to-be-done`, `product-sense`, `opportunity-solution-tree`

**Predictions (30):**
1. You ran three customer calls last week. Name one thing that changed because of them.
2. Someone will ask what customers think. You have notes. The question is whether the notes changed anything.
3. Today's interview is on the calendar. The question is whether you'll ask anything that could tell you you're wrong.
4. A user insight from last month is still in your notes and hasn't touched the roadmap. That's the test.
5. Someone will ask about customer evidence in the planning meeting. You have it. The question is whether you used it to decide or to justify.
6. The interview you're about to run has hypothetical questions in it. Replace them before you dial.
7. You've done more user research than anyone on the team. You've also changed the roadmap the least from it.
8. A customer told you something uncomfortable last week. It's not in any spec.
9. Today someone will quote a customer in a meeting. Ask whether that quote changed a decision or supported one already made.
10. The pattern across your last five interviews is clear. It hasn't shown up in the sprint backlog yet.
11. Research as performance has a tell: the interview notes are detailed and the product is unchanged.
12. You will hear a workaround today that tells you what your product is actually used for. File it or act on it. Not both.
13. A customer will tell you what they wish existed. The better question is what they're doing now in its absence.
14. Today's calls are on the calendar. Deciding whether to run the call was the easy part.
15. Someone will describe you as customer-obsessed. Ask them what you changed last quarter based on customer input.
16. The insight that needs to reach the roadmap is sitting in a document no one else has read.
17. A stakeholder will ask what customers want. You know. The question is whether you've told the team in a form that changes decisions.
18. Research that doesn't move anything is a cost, not a practice.
19. Today's customer call is an opportunity. Whether it counts depends on what you do with it.
20. Someone on your team is making a decision right now that a call from last month could have informed. They don't know the insight exists.
21. You have four months of interview notes. The synthesis is overdue.
22. The product doesn't reflect what customers told you in January. That's not a market problem.
23. Someone will suggest that you're more customer-connected than any PM they've worked with. The metric is not calls run; it's decisions changed.
24. A finding you classified as an edge case is about to show up as the main case. Go back and check.
25. The user story in today's planning is a real quote. It just doesn't have the context that would make it actionable.
26. Today you'll have the chance to act on something a customer told you. Notice when the chance arrives.
27. The strongest version of your customer research is the one that someone else reads and acts on. Write that version.
28. A customer churned. You have their interview notes from four months ago. Read them.
29. Your next customer call will teach you something. The question is whether you'll learn from it or file it.
30. The gap between what you know about customers and what the product reflects is the most important number you're not tracking.

**Nudges (20):**
1. Open your interview notes from last month. Find one insight that hasn't touched the roadmap. Decide today: act or explicitly decline.
2. Before your next customer call, write two questions that could tell you your current direction is wrong. Ask them.
3. After your next customer call, write one sentence on the single most important thing you heard. Share it with one other person before end of day.
4. Find the workaround a customer described in the last 60 days. Ask whether the product addresses it or whether a competitor will.
5. Write the user story that would justify the top roadmap item. If you need to paraphrase rather than quote, go back to the interview notes.
6. Count how many of your last ten customer calls led to a specific change in the spec, roadmap, or priority. That number is the practice's output.
7. Ask one engineer to sit in on your next customer call. Brief them beforehand on what you're listening for.
8. Before you report "customer feedback supports this direction," name the specific customer, what they said, and what changed as a result.
9. Find the insight that's been sitting in your notes the longest without being shared. Synthesize it into one paragraph. Send it to the team.
10. Rewrite the top three roadmap items as job-to-be-done sentences: "When [context], I want to [job], so I can [outcome]." Check whether the roadmap still makes sense.
11. Run a Mom Test audit on your last interview guide. Count the hypothetical questions. Replace each one with a "tell me about the last time..." version.
12. Find the customer quote you're most likely to use in the next planning meeting. Ask whether it's being used to decide or to illustrate a decision already made.
13. Write a one-paragraph synthesis of this month's customer calls. If you can't write it in a paragraph, the synthesis isn't done.
14. Schedule one customer call with someone who recently churned. Listen without a product pitch.
15. Before the next sprint planning, pick one customer finding and trace it forward: what would the roadmap look like if you treated this finding as the primary constraint?
16. Ask your team: "what's something we've learned from customers that surprised us?" If nobody can answer, the research isn't landing.
17. Pull up your observation notes from the last three calls. Find the contradiction. That's the real finding.
18. Write the question you're most afraid a customer will answer in a way that challenges the roadmap. Then ask it.
19. Find one PM habit you've labeled as customer-connected but that no customer has explicitly validated. Test it.
20. At the end of the week, list every customer insight that led to a change and every one that didn't. The ratio tells you whether you're doing research or performing it.

**Aspect lines (vs each partner):**
- vs #1 Bet-Defender: "the Bet-Defender squares your evidence today; the bet they're defending and the customer calls you've run are going to be compared in the same room, so check whether your interviews actually support or challenge the bet"
- vs #2 Theatre Director: "the Theatre Director squares your call; a user story gets introduced in the ceremony today, so name whether it changed the plan or filled the agenda"
- vs #3 Cornered Resource: "the Cornered Resource trines your access; the customer relationships you have are the raw material of the moat they're building, so check whether your interview notes contain any of the structural insight they need"
- vs #4 Pivot-Hanged: "the Pivot-Hanged squares your signal; a customer interview gets cited as evidence for or against the change today, so verify whether the quote was from a story-based interview or a leading question"
- vs #5 Customer-Adjacent: "the Customer-Adjacent opposes your practice; both of you ran customer calls this week, but one of you will walk into planning having changed something because of it, and that's the only distinction that counts"
- vs #6 Founder-Mode Returnee: "the Founder-Mode Returnee conjuncts your timing; both of you are doing user-facing work that could be performative, and the one who acts on what they heard first sets the standard for the week"
- vs #7 Stakeholder-Pleaser: "the Stakeholder-Pleaser conjuncts your pattern; two PMs keeping the room comfortable today, and both of you have customer evidence that could make it uncomfortable; the one who shares it first wins the week"
- vs #8 Top-1-Percent: "the Top-1-Percent opposes your practice; they'll ask what changed based on the calls this week, and 'I learned a lot' is not the answer they're looking for"
- vs #9 Saying-No: "the Saying-No squares your close; a customer call gets cited as the reason to keep the request open today, so check whether the interview actually supports that before you let it extend the decision"
- vs #10 Eval-Forward: "the Eval-Forward trines your evidence; the trace analysis and the interview notes are pointing at the same failure mode today, and connecting them is worth one hour"
- vs #11 Strategy-Skeptic: "the Strategy-Skeptic conjuncts your analysis today; the research session you ran last week is about to get tested in the strategy review, so check whether it updates the diagnosis or just illustrates what you already believed"

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
