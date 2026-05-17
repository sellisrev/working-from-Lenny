---
app-id: 44
app-name: PM Pitfalls Self-Audit
phase: 0
type: quiz + LLM narration (LLM optional in Phase 0)
updated: 2026-05-11
---

# Audit template — #44 PM Pitfalls Self-Audit

> Quiz logic is deterministic. LLM narration is optional in Phase 0 (URL-trick handoff) and richer in Phase 1+ (Worker inference).

## The twenty pitfalls

Drawn from the corpus topics `pm-pitfalls.md` and `spotting-bad-pm-behaviors.md`, plus the related saying-no, bet-defending, and AI-eval-coverage anchors. User rates each: **always / sometimes / never**.

Build note: anchors below are best-effort guesses against the corpus. Before locking the deployed copy, cross-check each anchor against `knowledge/topics/` and substitute the closest real file where the named one doesn't exist.

| # | Pitfall | Anchor | Leverage (1–3) |
|---|---|---|---|
| 1 | Letting AI write the spec without owning the judgment behind it | `pm-pitfalls.md`, AI-eval-coverage topic | 3 |
| 2 | Shipping AI features without an eval set | AI-eval-coverage topic | 3 |
| 3 | No paying-customer conversation in the last 30 days | `continuous-discovery.md` | 3 |
| 4 | Conflating roadmap with strategy | `product-strategy.md`, `good-strategy-rumelt.md` | 3 |
| 5 | Stakeholder-pleasing over bet-defending | `pm-pitfalls.md`, `defending-big-bets.md` | 3 |
| 6 | Not measuring shipped features after launch | `pm-pitfalls.md` | 3 |
| 7 | OKRs as activity lists ("ship X" instead of "Y users adopt X") | `okrs.md` | 3 |
| 8 | Spending time on the roadmap when the unanswered question is the bet | `defending-big-bets.md` | 3 |
| 9 | Theatre standups — status ritual, no real coordination | `pm-pitfalls.md`, `velocity-core4.md` | 2 |
| 10 | Treating internal stakeholders as customers | `continuous-discovery.md` | 2 |
| 11 | Letting "data-driven" replace a hard judgment call | `pm-pitfalls.md` | 2 |
| 12 | Confusing consensus with alignment | `spotting-bad-pm-behaviors.md` | 2 |
| 13 | Avoiding the hard "no" | `saying-no.md` | 2 |
| 14 | Over-indexing on the loudest customer complaint | `continuous-discovery.md` | 2 |
| 15 | Velocity as a goal rather than a side effect | `velocity-core4.md` | 2 |
| 16 | Skipping the "why" in every spec | `pm-pitfalls.md` | 2 |
| 17 | Not noticing when politics shift around your bet | `defending-big-bets.md` | 2 |
| 18 | Hiding from the post-mortem when something flops | `spotting-bad-pm-behaviors.md` | 2 |
| 19 | Hoarding credit from engineers and designers | `spotting-bad-pm-behaviors.md` | 2 |
| 20 | Confusing being busy with being useful | `top-1-percent-pm.md` | 1 |

## Scoring

```
score_raw = sum over pitfalls of:
  2 if answer == "always"
  1 if answer == "sometimes"
  0 if answer == "never"

score_display = round(score_raw / 2)  # "I scored 14/20"
```

`score_display` is the shareable integer, 0–20. The deterministic version of the visible score.

## Top-three picker

```
for each pitfall:
  weight = user_score(2/1/0) * leverage(3/2/1)
sort pitfalls by weight desc, break ties by leverage desc
return top 3
```

If the user picked "never" on everything (weight = 0 for all), return the three highest-leverage pitfalls unanchored, with copy that gently nudges: "Either you're in the top 1% or you're being kind to yourself. Try again being a little more honest."

## Output shape

```
Your score: {score_display}/20.

Your three highest-leverage to fix this quarter:

1. {pitfall_1}
   {exemplar_quote_1}
   Read more: {corpus_topic_link_1}

2. {pitfall_2}
   {exemplar_quote_2}
   Read more: {corpus_topic_link_2}

3. {pitfall_3}
   {exemplar_quote_3}
   Read more: {corpus_topic_link_3}
```

Exemplar quotes are pre-written per pitfall (one short corpus-anchored line each). They are deterministic. The LLM narration adds personalization on top.

## Exemplar quotes — batch 1 (pitfalls 1–10, authored 2026-05-14)

| # | Pitfall | Quote | Corpus anchor |
|---|---|---|---|
| 1 | AI writes the spec | "If you can't defend every call in that spec without reading the AI output back at people, you don't own the spec. You're a copy editor." | `pm-pitfalls.md`, `ai-pm-skills.md` |
| 2 | Shipping AI features without an eval set | '"Prompts may make headlines, but evals quietly decide whether your product thrives or dies." No eval set means you're shipping by gut feel at scale. (Aman Khan, Lenny's Newsletter)' | `evals-for-ai-products.md` |
| 3 | No paying-customer conversation | "Top 1% PMs quote specific customers in conversations. If your last paying-customer call was more than 30 days ago, you're building from memory." | `top-1-percent-pm.md` |
| 4 | Conflating roadmap with strategy | "Ravi Mehta: every roadmap item needs to connect back through goals, strategy, and vision. If yours don't, you don't have a strategy. You have a backlog." | `product-strategy.md` |
| 5 | Stakeholder-pleasing over bet-defending | "The Feature Factory: the roadmap is reactive to the loudest stakeholder, not driven by a hypothesis about user value. The team sees it, even when the PM doesn't." | `spotting-bad-pm-behaviors.md`, `defending-big-bets.md` |
| 6 | Not measuring shipped features | "Shipping without measuring is how you end up with a product full of features nobody uses. The PM who built it is the only one with the context to diagnose it." | `pm-pitfalls.md` |
| 7 | OKRs as activity lists | '"Ship the redesign" is not a key result. A key result measures an outcome users experience. "Ship X" means you've already given up on knowing whether X worked.' | `okrs.md` |
| 8 | Roadmap over unanswered bet | "If the real question is 'should we be building this at all,' a polished roadmap won't answer it. That document is covering for a decision you haven't made yet." | `defending-big-bets.md` |
| 9 | Theatre standups | "The Coordinator in real time: the standup becomes a status broadcast, not a coordination tool. Engineers answer 'what did you do yesterday,' then return to their desks unchanged." | `pm-pitfalls.md`, `spotting-bad-pm-behaviors.md` |
| 10 | Internal stakeholders as customers | "When the answer to 'why are we building this?' is a stakeholder's name, not a user problem, you've confused internal approval for product-market fit." | `spotting-bad-pm-behaviors.md` |

## Exemplar quotes — batch 2 (pitfalls 11–20, authored 2026-05-14)

| # | Pitfall | Quote | Corpus anchor |
|---|---|---|---|
| 11 | Data-driven replaces judgment | "Data can inform the call without making it. Saying 'the data says X' is often a way of avoiding the harder sentence: 'I think X is right and here's why.'" | `pm-pitfalls.md` (avoiding-decisions pattern) |
| 12 | Consensus confused with alignment | "Alignment means the team can execute the direction even if they'd have chosen differently. Consensus means they'd all have picked it. Waiting for consensus before calling something decided is the 'avoiding decisions' pattern. Everyone feels the call is theirs because the PM never made it." | `spotting-bad-pm-behaviors.md` |
| 13 | Avoiding the hard no | "Yes-by-default is the most expensive habit in tech. Every yes commits future capacity. The bill comes due in the quarter where you can't do the one thing that actually matters. (Lenny, Saying No, 2021)" | `saying-no.md` |
| 14 | Over-indexing on loudest complaint | "The loudest complaint is a signal, not a mandate. The customer who tracked you down in Slack is one data point. Weekly story-based interviews across a diverse set of users is what separates signal from noise." | `continuous-discovery.md` (anchor substitution: `customer-research.md` does not exist) |
| 15 | Velocity as goal | "Velocity is a side effect of a team that knows what to build and is empowered to build it well. When it becomes the goal itself, you get faster delivery of the wrong things. Lenny's Core 4: optimizing throughput alone produces feature factories without business value." | `velocity-core4.md` (anchor substitution: `process-vs-outcomes.md` does not exist) |
| 16 | Skipping the why in specs | "The Coordinator on paper: the spec tells everyone who does what by when. When you ask 'why are we building this?' it has no answer. That's not a spec. It's a project plan with delusions of strategy." | `pm-pitfalls.md` |
| 17 | Politics shift around bet | "The kill signal rarely arrives as a formal cancellation. It's the exec sponsor going quiet, the resource conversations getting vague, the next planning cycle starting without your bet on the agenda. If you didn't notice, that's the pitfall." | `defending-big-bets.md` (spec listed `bet-defending.md`; correct filename is `defending-big-bets.md`) |
| 18 | Hiding from the post-mortem | "Owns outcomes is the cleanest test. Running the post-mortem as a blame-diffusion exercise, or skipping it entirely, signals to everyone who wrote code that the next risky bet is on them if it fails." | `top-1-percent-pm.md`, `spotting-bad-pm-behaviors.md` |
| 19 | Hoarding credit | "Camille Fournier's first engineer-side complaint: hoarding credit. Engineers remember. Designers remember. The PM who presents the team's work as their own is borrowing against trust they'll need when something goes wrong." | `spotting-bad-pm-behaviors.md` (Fournier 2024) |
| 20 | Busy vs useful | "Top 1% PMs don't confuse activity with progress, per Ian McAllister. The full calendar isn't output. What shipped? What did you learn this week? Two questions that matter." | `top-1-percent-pm.md` (McAllister 2022) |

## Phase 0 URL-trick handoff

For users who want a fuller reading, the page offers a "fuller reading in Claude" button that opens `claude.ai/new?q=<encoded>` with:

```
I just took a PM pitfalls self-audit on Working from Lenny and scored
{score_display}/20. My three highest-leverage pitfalls to fix this quarter
are:

1. {pitfall_1}
2. {pitfall_2}
3. {pitfall_3}

For each, please pull from Lenny Rachitsky's interview corpus (especially the
pm-pitfalls and spotting-bad-pm-behaviors themes) and give me:
- a one-paragraph diagnosis of why this pitfall compounds for someone in
  my shoes,
- two concrete behaviors to start practicing this quarter, and
- one canonical example from the corpus of a PM who fell into this pitfall
  and what it cost them.

Keep it honest. Don't soften it.
```

## Phase 1 Worker inference prompt

When the public web app hits Gemini Flash for personalized narration:

```
System: You are a candid PM coach drawing from a synthesized corpus of
~700 product, founder, and operator interviews. The user has just self-
audited their PM behavior on twenty pitfalls. You will return personalized
narration for their three highest-leverage picks. Be direct. No corporate
softening. No em dashes. No "delve" or "leverage" or "in today's fast-paced".

Inputs:
- pitfall_1, pitfall_2, pitfall_3 (each from the locked twenty)
- exemplar_quote_1, exemplar_quote_2, exemplar_quote_3 (pre-written, do not rewrite)
- score_display (0–20)
- corpus_chunks (top 2-3 chunks per pitfall, retrieved server-side)

For each of the three pitfalls, output:
- a one-paragraph diagnosis ("why this is harder than it looks")
- two concrete behaviors to start this quarter
- one named example from the corpus_chunks

Order by user's leverage rank. Keep each pitfall's section to <120 words.
Total output <500 words.
```

## Phase 2 MCP App spec

Same scoring, same narration, but:
- Quiz state persists per user in the .mcpb data dir
- Re-audit annually with calibration drift report ("you were 14/20 a year ago, now 9/20 — here's what shifted")
- The exemplar quotes are pulled from local corpus, not hardcoded
