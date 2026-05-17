---
app-id: 24
app-name: OKR Critique
phase: 1
type: paste + LLM critique with stance picker
updated: 2026-05-17
---

# Engine — #24 OKR Critique

> Phase 1 is the public web app on Gemini Flash. Four-test deterministic check, then LLM-narrated critique + rewrite.

## Inputs

- `okr_text` (100–3000 chars). User's draft OKRs in any format.
- `stance` (enum): orthodox / skeptical / hybrid. Default: hybrid.
- `level` (enum): team / org. Default: team.

## Pre-parsing (deterministic, before LLM)

The Worker runs a cheap parser to extract structure from the paste:

```
Detect:
- Objectives (typically: bold lines, numbered headers, or lines ending in ":")
- Key results (typically: bulleted children of an objective, lines starting with "KR:", or numbered KR1/KR2)

Parser output:
{
  "objectives": [
    {
      "text": "...",
      "key_results": ["...", "...", ...]
    }
  ]
}
```

If parsing is ambiguous (no clear objective/KR structure), the model is told the input is unstructured and asked to infer best-effort. Output includes a flag: `parsing_confidence: low/med/high`.

## The four tests (deterministic check shape, LLM-narrated verdict)

Each key result is run through four tests. The LLM applies them; the schema is fixed.

### Test 1: outcome vs activity

```
Does this KR measure what the team did, or what changed in the world
because of what the team did?

- "Ship feature X" → activity (verdict: fail)
- "Launch the redesigned onboarding by Q2" → activity (verdict: fail)
- "Y% of new users complete onboarding within 24h" → outcome (verdict: pass)
- "Reduce p50 onboarding time from 8 min to 3 min" → outcome (verdict: pass)
```

Anchor: `okrs.md` (Doerr's outcome framing), `pm-pitfalls.md` (OKRs as activity lists).

### Test 2: measurable

```
Does this KR have a number on it, and is the measurement actually possible
this quarter with the team's instrumentation?

- "Improve customer satisfaction" → unmeasurable (no number) → fail
- "Improve CSAT from 38 to 50" → measurable (verdict: pass)
- "Make engineers happier" → unmeasurable + unlikely-instrumented → fail
```

Anchor: `okrs.md`, `metrics-for-pms.md`.

### Test 3: single-team-fit

```
Could this KR move only because of work this team controls? Or does it
require another team to do something the team can't make them do?

- "Increase weekly active users 20%" → likely depends on growth team,
  marketing, and platform reliability (verdict: depends — flag for cross-team
  dependency)
- "Reduce p50 search latency from 800ms to 200ms" → if the team owns search,
  yes (verdict: pass)
```

Anchor: `okrs.md`, `cross-functional-collaboration.md`.

### Test 4: too-many (count check, applied per objective)

```
If an objective has more than 4 KRs, flag the objective as "too many."
If the user has more than 3 objectives at team level (or 5 at org level),
flag the OKR set as a whole as "too many."

"If you have nine, you have none." — Doerr, per okrs.md
```

Anchor: `okrs.md`.

## Per-KR critique output

```
{
  "kr_text": "...",
  "verdicts": {
    "outcome_vs_activity": "pass" | "fail" | "borderline",
    "measurable": "pass" | "fail",
    "single_team_fit": "pass" | "fail" | "cross-team-dependency",
    "too_many": "n/a-per-kr"  // count check is per-objective
  },
  "diagnosis": "<one paragraph naming the patterns that failed>",
  "rewrite": "<one rewritten KR that passes all four tests, or null if the underlying objective is unsalvageable>",
  "anchor_quote": "..."
}
```

## Stance-specific take (one paragraph after per-KR critique)

LLM is shown the verdicts table + the user's stance choice and writes a one-paragraph synthesis:

### Orthodox stance prompt fragment

```
Assume OKRs are a load-bearing system the user wants to do well. Treat the
failures above as repairable. Lead the synthesis paragraph with: "These are
fixable. Here's the pattern."
```

### Skeptical stance prompt fragment

```
Assume OKRs may be theatre. Treat the failures above as evidence the
ritual may be load-free for this team. Lead the synthesis paragraph with:
"Three of these wouldn't survive a real conversation about why they exist.
The question is whether you keep them at all."
```

### Hybrid stance prompt fragment

```
Apply both lenses. For each KR, note whether it would survive in the
orthodox stance (with rewrite) or only in the skeptical stance (drop).
Synthesis paragraph should end with: "If you keep OKRs, do {orthodox set}.
If you don't, kill {skeptical set} entirely and replace them with what
you'd actually measure."
```

## Cross-team coherence check (only at org level)

If `level == "org"` AND the user pasted >1 objective, run an additional pass:

```
Are these objectives mutually compatible? Are any KRs claimed by multiple
objectives? Would the team owning each KR agree they own it? List the
internal contradictions.
```

Anchor: `cross-functional-collaboration.md`, `goal-setting.md`.

## Output shape

```
[Per-objective sections]

Objective 1: {text}
  KR 1.1: {kr_text}
    [Four-test verdicts in compact table]
    Diagnosis: {one paragraph}
    Suggested rewrite: {rewrite}
    Anchor: {topic_file} — "{quote}"
  KR 1.2: ...
  
Too many? {per-objective verdict}

[Stance-specific synthesis paragraph]

[If org level: cross-team coherence section]

[Rewritten OKR set, ready to paste]

Your OKRs, rewritten
────────────────────
Objective 1: ...
  KR 1.1: ...
  KR 1.2: ...
...
```

## Phase 0 URL-trick handoff (interim)

```
I have a draft OKR set. Critique them.

Stance I want: {orthodox | skeptical | hybrid}
Level: {team | org}

OKRs:
{okr_text}

Using Lenny Rachitsky's corpus (especially okrs and goal-setting topics,
and the corpus's split opinion on OKRs as a system), please:

1. For each KR, apply the four tests: outcome-vs-activity, measurable,
   single-team-fit, too-many. Label each pass/fail with one sentence.
2. Suggest a rewrite for each failed KR that passes all four tests, or
   tell me the underlying objective is unsalvageable.
3. Apply the {stance} lens in a one-paragraph synthesis. If hybrid, tell
   me which OKRs survive orthodox-only and which would drop in skeptical.
4. {If org level:} Cross-team coherence check across the full set.
5. Give me the full rewritten set, ready to paste back into our planning
   doc.

Be direct. If half of these are activities disguised as outcomes, say so.
```

## Voice rules

Same. No em dashes. Candid. The OKR space is full of platitudes — the critique should land sharper than the corpus's most diplomatic voices.

## Autonomous-routine backlog

- [x] Author 4 worked KR-critique examples per test (16 total), spanning the pass / fail / borderline space, drawn from real OKR patterns in `okrs.md` and `pm-pitfalls.md`. → 16 examples (4 per test) in `authoring.md`.
- [x] Author 6 "before/after" rewrite exemplars — bad KR + corrected KR + anchor quote. → 6 exemplars (ba-01 through ba-06) in `authoring.md`.
- [x] Cross-check that `okrs.md`, `goal-setting.md`, `cross-functional-collaboration.md`, and `metrics-for-pms.md` exist in `knowledge/topics/`. → `okrs.md` present; 3 missing: `goal-setting.md` → `okrs.md` (covers goal-setting); `cross-functional-collaboration.md` → `getting-buy-in.md`; `metrics-for-pms.md` → `north-star-metric.md`. Logged to UNCERTAIN_DECISIONS.md.
- [x] Author 2 sample OKR sets per stance (orthodox-best, skeptical-best, hybrid-mixed) for golden-set evals. → 2 sets per stance (6 total: orthodox-good/bad, skeptical-good/bad, hybrid-mixed-01/02) in `authoring.md`.
- [x] Verify the corpus actually surfaces the skeptical-OKR view named in 2b. → Confirmed: `okrs.md` explicitly covers "OKRs as theater," "cascaded OKRs produce reactive teams," "When NOT to use OKRs." Corpus is not one-sided; skeptical-stance prompts can draw directly on it.

## Phase 2 MCP App spec

Same engine, but:
- Quarterly OKR archives per user. "Last quarter's OKR 2.3 failed the outcome-vs-activity test. This quarter's 1.1 has the same pattern."
- Multi-team mode: the MCP App can be pointed at a directory of team OKR files (`team-a-okrs.md`, `team-b-okrs.md`, ...) and run the org-level coherence check at scale.
- "OKR mortality" report: after a quarter, ingest the actual outcomes and tell the user which OKRs were rewritten mid-quarter (vs achieved as-stated). Pattern surfaces theatre.
