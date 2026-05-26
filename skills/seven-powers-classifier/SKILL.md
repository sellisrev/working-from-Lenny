---
name: seven-powers-classifier
description: Test which of Hamilton Helmer's seven powers a business actually has evidence for by probing each power with a claim question (do you believe you have it) plus two or three specific evidence questions, then flag the gap (DELUSIONAL when claimed with no evidence, OVERSTATED, BLIND SPOT), and name one observable next-quarter signal that would confirm or kill each real power. Reads `knowledge/topics/`. Use when the user asks "what's my moat", "do I really have network effects", "which of the 7 powers do we have", "am I deluded about our competitive advantage", or wants a board-ready power map. The Claude Code skill version of the Working from Lenny 7 Powers Self-Classifier app.
---

# seven-powers-classifier

The skill version of the #33 7 Powers Self-Classifier. Probe each of Helmer's seven powers with a claim question and specific evidence questions, then flag where the claim outruns the evidence. The output is a board-meeting artifact. Companion to `lenny-actualize` and `lenny-pressure-test`; consumes the knowledge base.

## Why this exists

Nearly every founder claims network effects. Almost none can show them. The novel mechanic is claim-vs-evidence: ask whether they believe they have a power, then ask whether specific observable things are true, and flag the gap. A high claim with thin evidence is the headline finding, not a footnote. Per `seven-powers.md`, a power is a benefit competitors *can't* replicate; the barrier is the load-bearing half most people skip.

## When to use

Trigger on "what's my moat", "do I really have network effects", "which of the 7 powers do we have", "am I deluded about our competitive advantage". Unsentimental by design. Never refuse on thin input.

## The seven powers (Helmer)

```
1. Scale economies     -- unit costs fall as volume rises; rivals can't match cost
2. Network economies   -- value rises with users; late entrants face a cold-start wall
3. Counter-positioning -- a model incumbents can't copy without harming their own business
4. Switching costs     -- customers face real cost/risk/hassle to leave
5. Branding            -- willingness to pay from trust/identity, not function
6. Cornered resource   -- exclusive access to a coveted asset (talent, IP, supply)
7. Process power       -- embedded org/process advantage rivals can't reverse-engineer fast
```

## The claim-vs-evidence probe (~25 questions)

For each power: **1 claim question** (have / maybe / no) + **2-3 evidence questions** (true / partly / false), specific and observable. Counter-positioning is framed around the incumbent's inability to respond ("would copying us hurt an incumbent's existing business?") rather than asking the user to self-assess their own model. The full question bank lives in `apps/33-seven-powers-classifier/prompt.md` and `apps/33-seven-powers-classifier/authoring.md`. Administer it from there; never invent generic moat questions.

## Scoring (deterministic, per power)

```
evidence_score = sum over evidence questions (true=2, partly=1, false=0)
evidence_pct   = evidence_score / max_for_that_power

HAS EVIDENCE   evidence_pct >= 0.66
PLAUSIBLE      0.34 <= evidence_pct < 0.66
ABSENT         evidence_pct < 0.34

delusion flags:
  claim "have" + ABSENT     -> DELUSIONAL: claiming {power} with no evidence behind it
  claim "have" + PLAUSIBLE  -> OVERSTATED: real possibility, more sure than the evidence warrants
  claim "no"   + HAS EVIDENCE -> BLIND SPOT: may have {power} and not be leaning on it
```

## Testable-signal generator

For each power classified HAS EVIDENCE or PLAUSIBLE, name one observable signal in the next quarter that confirms or kills it, anchored in `seven-powers.md` (e.g., network economies: "cohort N+1's week-4 value exceeds cohort N's, controlling for product changes"; switching costs: "voluntary churn among 12-month+ customers stays below X% even after a price increase").

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/seven-powers.md (primary, benefit+barrier framing)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/good-strategy-rumelt.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/distribution-as-moat.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/ai-data-as-moat.md
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/category-creation.md

All verified present. Check obsolete/caution layers.

## Output

```
Your power map:
  HAS EVIDENCE: {powers}   - real. Defend and compound.
  PLAUSIBLE:    {powers}   - possible; here's the test.
  ABSENT:       {powers}
  DELUSIONAL:   {powers}   - you claimed these; the evidence says no.

For each real or plausible power:
  {power}: {one paragraph, benefit+barrier framing from seven-powers.md}
  Test next quarter: {one observable signal}

The honest headline: {the single biggest gap between belief and evidence}
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Unsentimental. Name the delusion plainly; founders claim network effects reflexively and the job is to stop that.
- Helmer-faithful: a power is benefit AND barrier. Never call something a power if rivals can copy it.

## Workflow

1. Administer the claim+evidence bank verbatim from the app spec (or infer from a described company, naming the assumption).
2. Score each power; apply the delusion/overstated/blind-spot flags.
3. Read `seven-powers.md` for the powers in play; write the per-power why + testable signal.
4. Render the power map and the honest headline.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The claim-vs-evidence matrix and scoring are corpus-agnostic; the per-power narration re-anchors to another corpus's competitive-advantage topics.
