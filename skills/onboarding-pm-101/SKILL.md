---
name: onboarding-pm-101
description: Generate five short, role-tailored orientation lessons for a non-PM (engineer, designer, sales, customer-success) who just joined a PM-led company: what the artifacts mean, when and how to push back, what a good PM looks like vs a bad one, how to be useful in cross-functional rituals, and when to escalate. Reads `knowledge/topics/`. Use when the user says "I just joined a PM-led company", "what do PMs actually do", "how do I work with my PM", "explain PRDs and roadmaps to me", or wants an orientation to product management without becoming a PM. The Claude Code skill version of the Working from Lenny Onboarding to PM 101 app.
---

# onboarding-pm-101

The skill version of the #30 Onboarding to PM 101 for Non-PMs. A generator: it tailors five fixed lessons to the user's role and company stage. Not a quiz, no score, no state. Pairs with the `spotting-bad-pm-behaviors` skill (this is the orientation, that is the diagnostic). Consumes the knowledge base.

## Why this exists

A non-PM just joined a PM-led company and is quietly confused or skeptical about the product function. The goal is to make them effective and unsurprised, not to sell them on PM. The honesty is the point: it includes how to push back and what a bad PM looks like, so it reads as candid rather than as propaganda.

## When to use

Trigger on "I just joined a PM-led company", "what do PMs actually do", "how do I work with my PM", "explain PRDs and roadmaps". Plain and useful, lightly wry, never reverent about the role.

## Inputs (collect or infer)

`role` (engineer / designer / sales / customer-success / other-cross-functional), `company_stage` (seed / series-a-b / growth / enterprise), `pm_ratio` (solo-pm / pm-per-squad / heavy-pm-org, optional), `biggest_confusion` (free text, optional, drives a coda).

## The five fixed lessons (titles fixed, content tailored)

```
1. What artifacts you'll see, and what they actually mean
   (PRD, roadmap, spec, OKRs; roadmap vs strategy)        anchor: how-x-builds-product, product-strategy, okrs
2. When and how to push back
   (disagreement is the job; "I'd build it differently" vs "this is the wrong thing")
                                                           anchor: getting-buy-in, communicating-tradeoffs, saying-no
3. What a good PM looks like vs a bad one
   (good clears your path and owns the why; bad is a ticket-mover with a Gantt chart)
                                                           anchor: top-1-percent-pm, spotting-bad-pm-behaviors, pm-pitfalls
4. How to be useful in cross-functional rituals
   (standup, planning, retro, discovery: what each is for from your seat)
                                                           anchor: continuous-discovery, getting-buy-in
5. When to escalate
   (friction you absorb vs friction you flag; who to, and how without torching the relationship)
                                                           anchor: communicating-bad-news, managing-up, decision-making-frameworks
```

Role tailoring and the full per-lesson content live in `apps/30-onboarding-pm-101/prompt.md`. Each lesson carries a role lens (engineer: "the spec is a hypothesis, not a contract"; designer: "where your craft judgment outranks the PM's and where it doesn't"; sales: "the roadmap is not a promise you can sell"; CS: "your churn signal is discovery data"). `company_stage` calibrates formality: seed = "most of this is a Slack thread and that's fine"; enterprise = "the ritual is real, here's how to survive it."

## Corpus anchors

`knowledge/topics/how-x-builds-product.md`, `product-strategy.md`, `okrs.md`, `getting-buy-in.md`, `communicating-tradeoffs.md`, `saying-no.md`, `top-1-percent-pm.md`, `spotting-bad-pm-behaviors.md`, `pm-pitfalls.md`, `continuous-discovery.md`, `communicating-bad-news.md`, `managing-up.md`, `decision-making-frameworks.md`. All verified present. Check obsolete/caution layers.

## Output

```
Your 5-lesson orientation, tailored for a {role} at a {company_stage} company:

Lesson 1 - {title}
{3-5 short paragraphs, role-lensed, corpus-grounded}
... (lessons 2-5)

{If biggest_confusion supplied: a short coda answering it directly via the most relevant lesson.}
```

Second person, short paragraphs. This is something someone reads on their second day. Offer to format it as a doc for an onboarding packet.

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Plain and useful, lightly wry, never reverent about the PM role. Honesty over advocacy: describe a good PM by what they do for the user, a bad one by name.
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Collect or infer role + company_stage (name the assumption).
2. Resolve the role lens and stage calibration for each lesson from the app spec.
3. Read the anchors for the lessons; write all five role-lensed.
4. If a biggest_confusion was given, add the coda. Offer the doc export.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The five lesson titles are corpus-agnostic; the content re-anchors to another corpus's cross-functional topics.
