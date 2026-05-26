---
name: spotting-bad-pm-behaviors
description: Help a non-PM (engineer, designer, sales, customer-success) tell whether their PM is having a bad week or a bad pattern by rating fifteen observable behaviors, computing a green/yellow/red severity read plus the three patterns showing up most, and handing back a proportionate next move (private feedback, document, escalate, or decide it's not fixable from where you sit) with a fairness check. Reads `knowledge/topics/`. Use when the user asks "is my PM bad", "is this normal PM behavior", "my PM never talks to customers / takes all the credit / can't make a decision", or wants to tell a grievance from a pattern. The Claude Code skill version of the Working from Lenny Spotting Bad PM Behaviors field guide.
---

# spotting-bad-pm-behaviors

The skill version of the #46 Spotting Bad PM Behaviors field guide. The non-PM companion to `pm-pitfalls` (which is the PM's own self-audit): same deterministic scoring, but the audience works *alongside* a PM and each pattern carries a what-to-do path instead of a self-improvement exemplar. Consumes the knowledge base.

## Why this exists

Someone works with a PM and has a nagging suspicion. The job is to (a) name the pattern so it stops feeling like a personal grievance, (b) calibrate severity (bad day or bad pattern?), and (c) hand over a proportionate next move. The framing is deliberately fair: sometimes the friction is the user's own expectation gap, and the tool says so when the answers point that way. This is not ammunition for office politics; it is the accurate version of the suspicion.

## When to use

Trigger on "is my PM bad", "is this normal PM behavior", "my PM never talks to customers / takes the credit / can't decide", "is the friction them or me". If the user describes a couple of behaviors loosely, infer the ratings, name the assumption, and produce a compact read.

## The fifteen behaviors (rated often / sometimes / haven't-seen-it)

Severity weight in brackets (3 = highest). Full diagnosis lines + the non-PM register live in `apps/46-spotting-bad-pm-behaviors/prompt.md`.

```
1  Never talks to paying customers but speaks for them constantly        [3]
2  Dismisses details as "small" without understanding why they aren't    [3]
3  Presents the team's work as their own; eng/design go uncredited       [3]
4  Can't say why you're building something beyond a stakeholder's name   [3]
5  Avoids the decision; calls waiting for consensus "alignment"          [3]
6  Roadmap whiplash; priorities reorder weekly with no new information   [3]
7  Says yes to everyone; never defends a tradeoff                        [2]
8  Specs give the what and when, never the why                           [2]
9  Runs standup as a status broadcast, not coordination                  [2]
10 Ships and moves on; never asks whether the last thing worked          [2]
11 Hides from the post-mortem, or runs it as blame-diffusion             [2]
12 "Data-driven" is a way to avoid owning a judgment call                [2]
13 Treats internal stakeholders as if they were the customer             [2]
14 Over-rotates on the loudest complaint                                 [1]
15 Confuses being busy with being useful                                 [1]
```

## Scoring (deterministic)

```
observed_score: often=2, sometimes=1, haven't-seen-it=0
pattern_weight = observed_score * severity_weight
total = sum over all 15

green   total <= 6     "Probably normal friction."
yellow  7..16          "A few real patterns. Worth naming."
red     total >= 17    "This is a pattern, not a bad week."

top-pattern picker: sort by pattern_weight desc, tie-break severity desc, take top 3 with weight > 0.
```

The all-haven't-seen-it case returns green with a gentle expectation-gap check: "Either you have a genuinely strong PM or the friction is somewhere you haven't looked."

## What-to-do path (replaces #44's exemplar quote)

```
action_ladder = [private_feedback, document, escalate, leave]
  sometimes + severity<=2        -> private_feedback
  often + severity 2             -> document, then private_feedback
  often + severity 3             -> document + escalate (with a script)
  3+ severity-3 behaviors        -> "is this fixable from where you sit?" reframe, leave is a legitimate option
```

Anchor the scripts in `getting-buy-in.md` (how to raise it), `communicating-bad-news.md` (escalate without burning the relationship), `managing-up.md` (PM is more senior).

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/spotting-bad-pm-behaviors.md (primary, Camille Fournier's engineer-side complaints as the spine)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/pm-pitfalls.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/continuous-discovery.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/saying-no.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/defending-big-bets.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/decision-making-frameworks.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/top-1-percent-pm.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/getting-buy-in.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/communicating-bad-news.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/managing-up.md

All verified present. Check obsolete/caution layers.

## Scope guardrail

Single-user, local, advisory. No anonymous-team-reporting or multi-user data collection: it implies a data model the local-file approach does not support and can be weaponized. Do not add a reporting feature.

## Output

```
Read: {green | yellow | red headline}

The three patterns you're seeing most:
1. {behavior}
   What this usually means: {corpus-grounded diagnosis}
   Your move: {action rung} - {one concrete first step}
2. ...  3. ...

A fairness check: {one line - if the answers suggest the gap is partly expectation, say so}
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Fair, not vindicating. Name the pattern, hand over a proportionate move, check the user's own expectation gap. If the PM is fine and the user is impatient, say so plainly.
- Cite the corpus by guest + date + post URL where the file has it (name Fournier where the corpus attributes the claim to her).

## Workflow

1. Collect or infer the fifteen ratings (name the assumption).
2. Compute the green/yellow/red total and the top-3 patterns + action rung.
3. Read the anchors; write the diagnosis + script per pattern + the fairness check.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The fifteen behaviors and the scoring are corpus-agnostic; the diagnosis lines and scripts re-anchor to another corpus's failure-mode topics.
