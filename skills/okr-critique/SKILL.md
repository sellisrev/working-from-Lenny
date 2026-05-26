---
name: okr-critique
description: Critique a draft OKR set by running every key result through four tests (outcome-vs-activity, measurable, single-team-fit, too-many), suggest a rewrite for each failed KR, apply an orthodox / skeptical / hybrid stance in a synthesis paragraph, optionally run an org-level cross-team coherence check, and hand back the full rewritten set ready to paste. Reads `knowledge/topics/`. Use when the user asks "critique my OKRs", "are these good OKRs", "rewrite my key results", "is this an outcome or an activity", or pastes a goal set and wants it pressure-tested. The Claude Code skill version of the Working from Lenny OKR Critique app.
---

# okr-critique

The skill version of the #24 OKR Critique. Run each key result through four deterministic tests, rewrite the failures, and apply the stance the user wants. Companion to `lenny-actualize` and `lenny-pressure-test`; consumes the knowledge base.

## Why this exists

Most OKR feedback is diplomatic to the point of uselessness. The value here is sharper than the corpus's gentlest voices: name the activities disguised as outcomes, the unmeasurable aspirations, the KRs that depend on a team you don't control, and give a rewrite that passes all four tests. The stance picker lets the user choose whether OKRs are a system to repair or a ritual to question.

## When to use

Trigger on "critique my OKRs", "are these good OKRs", "rewrite my key results", "is this an outcome or an activity". Never refuse on thin input: if the paste is unstructured, infer best-effort and flag `parsing_confidence: low`.

## Inputs

`okr_text` (the draft, any format), `stance` (orthodox / skeptical / hybrid, default hybrid), `level` (team / org, default team).

## Pre-parse (before critique)

Extract structure: objectives (bold lines, numbered headers, lines ending in ":") and their key results (bulleted children, "KR:" prefixes, KR1/KR2 numbering). If structure is ambiguous, infer and flag low parsing confidence.

## The four tests (run on every KR)

```
1. outcome vs activity  -- does it measure what the team DID, or what CHANGED because of it?
                           "Ship X" / "Launch Y by Q2" = activity (fail).
                           "Z% complete onboarding in 24h" = outcome (pass).
2. measurable           -- has a number AND is instrumentable this quarter?
3. single-team-fit      -- can it move from work this team controls, or does it need
                           another team you can't compel? (flag cross-team-dependency)
4. too-many             -- >4 KRs per objective, or >3 objectives at team level
                           (>5 at org). "If you have nine, you have none." (Doerr)
```

The full pass/fail/borderline exemplars and before/after rewrites live in `apps/24-okr-critique/prompt.md` and `apps/24-okr-critique/authoring.md`.

## Stance synthesis (one paragraph after the per-KR critique)

```
orthodox  -- OKRs are load-bearing; failures are repairable. Lead: "These are fixable. Here's the pattern."
skeptical -- OKRs may be theatre; failures are evidence the ritual is load-free. Lead: "Three of these
             wouldn't survive a real conversation about why they exist."
hybrid    -- both lenses; per KR note whether it survives orthodox (with rewrite) or only drops in
             skeptical. End: "If you keep OKRs, do {orthodox set}. If you don't, kill {skeptical set}."
```

## Org-level coherence (only if level=org and >1 objective)

Are the objectives mutually compatible? Any KR claimed by two objectives? Would the owning team agree they own it? List the contradictions.

## Corpus anchors

- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/okrs.md (primary, Doerr's outcome framing + the corpus's split opinion on OKRs as theatre + when-not-to-use)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/pm-pitfalls.md (OKRs as activity lists)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/getting-buy-in.md (cross-team dependency framing)
- https://github.com/sellisrev/working-from-Lenny/blob/main/knowledge/topics/north-star-metric.md (measurability)

All verified present. Check obsolete/caution layers.

## Output

```
Objective 1: {text}
  KR 1.1: {text}
    [four-test verdicts, compact]
    Diagnosis: {one paragraph}
    Suggested rewrite: {passes all four, or "objective unsalvageable"}
    Anchor: {topic} - "{quote}"
  Too many? {per-objective verdict}

[stance synthesis paragraph]
[if org: cross-team coherence section]

Your OKRs, rewritten
  Objective 1: ...  KR 1.1: ...
```

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Sharper than the platitudes the OKR space is full of. Disagree with the KR, not the person.
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Pre-parse the paste into objectives + KRs; flag parsing confidence.
2. Run the four tests per KR; write the diagnosis + rewrite for each failure.
3. Apply the chosen stance in a synthesis paragraph.
4. If org level, run the coherence check. Emit the full rewritten set.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. The four tests and the count rules are corpus-agnostic; the anchor quotes re-anchor to another corpus's goal-setting topics.
