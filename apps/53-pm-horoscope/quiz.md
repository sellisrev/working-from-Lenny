---
app-id: 53
app-name: PM Horoscope
component: Six-question archetype quiz
authored: 2026-05-17
---

# Six-question archetype quiz — #53 PM Horoscope

## Purpose

Alternative to the picker grid. User answers 6 questions; scoring maps to one of 12 archetypes. Wired into `artifacts/api-server/public/horoscope.html` via `QUIZ_QUESTIONS` + `scoreQuiz()`.

## Scoring

Each question has 4 answer choices. Each choice awards +1 point to a specific archetype. After 6 questions, the archetype with the highest total wins (ties: first highest wins, iterating in archetype-id order).

Each archetype appears in exactly 2 questions, so max score is 2 out of 6.

## Question-to-archetype assignment

| Question | Archetype options (A/B/C/D) |
|---|---|
| Q1 (exec challenge) | 1 Bet-Defender, 7 Stakeholder-Pleaser, 9 Saying-No, 8 Top-1-Percent |
| Q2 (sprint fixation) | 2 Theatre Director, 5 Customer-Adjacent, 11 Strategy-Skeptic, 10 Eval-Forward |
| Q3 (competitive position) | 3 Cornered Resource, 6 Founder-Mode Returnee, 12 Empathy-Tourist, 4 Pivot-Hanged |
| Q4 (strategy moment) | 1 Bet-Defender, 7 Stakeholder-Pleaser, 3 Cornered Resource, 11 Strategy-Skeptic |
| Q5 (customer research) | 12 Empathy-Tourist, 5 Customer-Adjacent, 2 Theatre Director, 6 Founder-Mode Returnee |
| Q6 (ship decision) | 10 Eval-Forward, 8 Top-1-Percent, 9 Saying-No, 4 Pivot-Hanged |

Each archetype appears in exactly 2 questions:
- 1 Bet-Defender: Q1, Q4
- 2 Theatre Director: Q2, Q5
- 3 Cornered Resource: Q3, Q4
- 4 Pivot-Hanged: Q3, Q6
- 5 Customer-Adjacent: Q2, Q5
- 6 Founder-Mode Returnee: Q3, Q5
- 7 Stakeholder-Pleaser: Q1, Q4
- 8 Top-1-Percent: Q1, Q6
- 9 Saying-No: Q1, Q6
- 10 Eval-Forward: Q2, Q6
- 11 Strategy-Skeptic: Q2, Q4
- 12 Empathy-Tourist: Q3, Q5

## Questions and answer choices

**Q1. When a senior stakeholder challenges your top roadmap priority, your first move is:**
- A: "Restate the rationale calmly — the kill criteria haven't been hit and the bet still holds." → Bet-Defender (#1)
- B: "Ask what they'd need to see to feel better about it, then make sure they leave satisfied." → Stakeholder-Pleaser (#7)
- C: "Say you'll look into it and come back with a more complete answer." → Saying-No (#9)
- D: "Make the call in the room — you've done the analysis and you know the answer." → Top-1-Percent (#8)

**Q2. When a sprint ends, the thing you fixate on is:**
- A: Whether the ceremonies ran on time and the team stayed coordinated. → Theatre Director (#2)
- B: Whether you ran at least one real customer interview this week. → Customer-Adjacent (#5)
- C: Whether the work shipped connects to anything you could call a structural strategy. → Strategy-Skeptic (#11)
- D: Whether the AI feature you shipped has a quality baseline anyone could actually measure. → Eval-Forward (#10)

**Q3. When someone asks about your team's competitive position, you answer with:**
- A: The specific thing competitors would need 18 months to replicate — access, data, or process. → Cornered Resource (#3)
- B: What the original product vision intended and whether the team has drifted from it. → Founder-Mode Returnee (#6)
- C: The customer relationships you've built and what you've heard in recent calls. → Empathy-Tourist (#12)
- D: An honest read on where the current direction is strong and where you're still figuring it out. → Pivot-Hanged (#4)

**Q4. In a strategy review, the moment that most energizes you is:**
- A: When someone makes a crisp argument for why a bet is still worth defending. → Bet-Defender (#1)
- B: When the room reaches consensus and people leave aligned. → Stakeholder-Pleaser (#7)
- C: When someone names the specific barrier that makes the position hard to replicate. → Cornered Resource (#3)
- D: When someone finally says what the strategy is actually saying no to. → Strategy-Skeptic (#11)

**Q5. Your relationship with customer research is best described as:**
- A: You run the calls, take notes, file the findings — but most of it stays in the doc. → Empathy-Tourist (#12)
- B: You talk to paying customers every week and the roadmap shows it. → Customer-Adjacent (#5)
- C: You structure the process well and the team knows the ritual, but insights move slowly into the work. → Theatre Director (#2)
- D: You've been away from it for a stretch and you're re-engaging now with strong intuitions. → Founder-Mode Returnee (#6)

**Q6. When a ship decision is in front of you and you're not sure, you:**
- A: Ask for one more validation round — you need to know the failure modes before it's live. → Eval-Forward (#10)
- B: Make the call, note the uncertainty, and plan to measure it after launch. → Top-1-Percent (#8)
- C: Hold the ship until the case for going is clearly stronger than the case for waiting. → Saying-No (#9)
- D: Table it and see if a week of data changes the picture. → Pivot-Hanged (#4)
