---
name: pm-non-pm-manual
description: Generate a PM operating manual adapted for a leader in a non-software domain (school principal, nonprofit executive director, hospital service-line lead, research-lab PI). Returns three working artifacts tailored to the domain's stakeholder reality: a JTBD interview kit, a RICE-style prioritization rubric relabeled for the domain (with the one override gate that beats the score), and a "stop doing" list with the script for stopping each given who you must tell. Reads `knowledge/topics/`. Use when a non-software leader asks "how do I apply product thinking to my work", "help me prioritize across competing asks", "what should my organization stop doing", or wants PM frameworks in their own vocabulary. The Claude Code skill version of the Working from Lenny PM-for-Non-PMs Operating Manual app.
---

# pm-non-pm-manual

The skill version of the #31 PM-for-Non-PMs Operating Manual. A generator: the user picks one of four non-parenting domains and gets three working artifacts adapted to it. Not a quiz, no score, no state. The cross-domain sibling of `onboarding-pm-101` (cross-functional) and `spotting-bad-pm-behaviors` (diagnostic). Consumes the knowledge base.

## Scope note (read first)

**Parenting is out of scope.** The parenting adaptation has an incumbent (tinyStakeholders.com). Ship the non-parenting domains only: school principals, nonprofit executive directors, hospital service-line leads, research-lab PIs. Do not draft, render, or offer a parenting domain.

## Why this exists

The user runs something, has real stakeholders, and has never been called a product manager. They are not trying to become one. The transfer is real and specific: they already do discovery (they talk to the people they serve), already prioritize (more asks than capacity), and already over-invest in things they should stop. The PM craft just names those moves and gives them a sharper edge, in their own vocabulary, without the SaaS jargon.

## When to use

Trigger on "how do I apply product thinking to my work", "help me prioritize across competing asks", "what should my org stop doing", from a non-software leader. The frameworks adapt to their world; never reverent about product management, never "here is how tech does it better."

## Inputs

`domain` (required: school-principal / nonprofit-ed / hospital-service-line / research-lab-pi), `scale` (optional: small / mid / large, default mid), `biggest_friction` (free text, optional, drives a coda).

## The three fixed artifacts (titles fixed, content tailored)

```
1. JTBD interview kit
   Who to interview (the domain's "users" vs its "buyers"/funders), the questions that surface the
   job they are actually hiring you for, what to listen for vs discount.   anchor: jobs-to-be-done, continuous-discovery
2. Prioritization rubric
   A RICE-style rubric relabeled for the domain, the scarce resource named honestly (rarely money first;
   attention, change-fatigue, clinician/teacher adoption, person-months), and the one gate that overrides
   the score.                                                              anchor: prioritization-frameworks, decision-making-frameworks
3. "Stop doing" list
   The 3-4 things this domain reliably over-invests in, why each persists, the script for stopping it
   given who you must say it to (the hardest no is to the person who funds or governs you).
                                                                           anchor: saying-no, communicating-tradeoffs
```

A shared stakeholder anchor (`getting-buy-in`, plus `okrs` for the research-lab grant-funded framing) grounds the cross-cutting "stakeholders don't report to you" reality. The per-domain stakeholder rosters, RICE-axis relabeling, override gates, and stop-doing candidates live in `apps/31-pm-non-pm-manual/prompt.md` (e.g., hospital gate = safety + regulatory, never a score input; nonprofit gate = restricted funding; school gate = district mandate; lab gate = grant-cycle timing). `scale` calibrates formality: small = "a conversation, not a process, and that is fine"; large = "the rubric is your shield in the meeting."

## Corpus anchors

`knowledge/topics/jobs-to-be-done.md`, `continuous-discovery.md`, `prioritization-frameworks.md`, `decision-making-frameworks.md`, `saying-no.md`, `communicating-tradeoffs.md`, `okrs.md`, `getting-buy-in.md`. All verified present. Check obsolete/caution layers.

## Output

```
Your PM operating manual, adapted for a {domain} ({scale}):

Artifact 1 - JTBD interview kit
{who to interview, 5-7 questions, what to listen for / discount; domain-lensed}

Artifact 2 - Prioritization rubric
{four relabeled axes with domain definitions, how to score, the one override gate; a short worked example}

Artifact 3 - "Stop doing" list
{3-4 domain over-investments, why each persists, the script for stopping each given who you must tell}

{If biggest_friction supplied: a short coda pointing to whichever artifact most directly addresses it.}
```

Short paragraphs and real artifacts (lists, scoreable axes, scripts), not essays. A reader should be able to use Artifact 2 in a meeting next week. Offer the doc/markdown export for a planning offsite or board packet.

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Plain, practical, second person. Respect the user's domain expertise; the frameworks adapt to their world. The transfer is offered, not preached.
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Get the domain (required); collect scale + friction if offered.
2. Resolve the stakeholder roster, RICE relabeling, override gate, and stop-doing candidates from the app spec.
3. Read the anchors; write the three artifacts domain-lensed + scale-calibrated.
4. If a biggest_friction was given, add the coda. Offer the doc export.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The three-artifact structure is corpus-agnostic; the per-domain relabeling re-anchors to another corpus's discovery and prioritization topics. New domains beyond the four require their own stakeholder roster and override gate.
