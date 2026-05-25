---
name: pm-ladder
description: Self-assess PM level across five dimensions (scope, ambiguity tolerance, influence, judgment, craft) via thirty calibrated questions, compute an effective level 1-5 (APM to Principal), and return a gap report naming the widest gap plus three behaviors to close it. Optional calibration-delta mode contrasts the self-rating against a pasted manager review. Reads `knowledge/topics/`. Use when the user asks "what PM level am I", "am I a senior PM", "assess my PM seniority", "what's between me and the next level", "PM ladder self-assessment", or pastes a performance review and wants a calibration check. The Claude Code skill version of the Working from Lenny PM Ladder app.
---

# pm-ladder

The skill version of the #3 PM Ladder Self-Assessment. Thirty deterministic questions across five dimensions produce an honest level read and a gap report. Companion to `lenny-actualize`, `lenny-hire`, and `lenny-pressure-test`. Consumes the knowledge base; does not add to it.

## Why this exists

Static ladder rubrics tell you the titles; they don't tell you your widest gap or what to do about it. This skill scores the user's actual behavior (not aspirations), names the dimension holding them back, and prescribes three behaviors anchored in the corpus's ladder topics. The differentiator is the optional calibration-delta: paste your manager's review and the skill surfaces where your self-rating and their implied rating diverge.

## When to use

Trigger on "what PM level am I", "am I a senior PM", "assess my seniority", "what's between me and the next level", "PM ladder". If the user pastes a manager review, run calibration-delta mode. Never refuse on thin input.

## The five dimensions and levels

| Dimension | Measures |
|---|---|
| Scope | Size + time-horizon of work owned end-to-end |
| Ambiguity tolerance | Competence when the goal isn't pre-defined |
| Influence | Moving people who don't report to you |
| Judgment | Decision quality under incomplete information |
| Craft | Depth in the trade (writing, research, data, AI literacy) |

Levels 1-5: APM · PM · Senior PM · Staff PM · Principal PM. Each of the thirty questions (six per dimension) offers five answer choices mapping to levels 1-5; the user picks the choice describing current behavior. The full question bank lives in `apps/3-pm-ladder/prompt.md` — read it to administer the assessment verbatim; never invent generic ladder questions.

## The engine (deterministic)

```
for each dimension:  dimension_level = median(its six answer levels)
effective_level = median(the five dimension_levels)
target_level = effective_level + 1  (or 5 if already 5)
widest_gap = the dimension furthest below effective/target level
```

Median (not average) so a single outlier doesn't distort. Report both numbers per dimension so the gap is visible.

## Corpus anchors

- Scope/influence: `knowledge/topics/pm-career-ladders.md`, `becoming-senior-pm.md`, `pm-promotion.md`, `pm-influence.md`, `managing-up.md`
- Ambiguity/judgment: `decision-making-frameworks.md`, `evaluating-product-bets.md`, `pivots-art.md`, `prioritization-frameworks.md`, `top-1-percent-pm.md`
- Craft: `prds-and-1-pagers.md`, `continuous-discovery.md`, `working-with-pms-as-data.md`, `working-with-pms-as-designer.md`, `working-with-pms-as-engineer.md`, `evals-for-ai-products.md`, `ai-pm-skills.md`

Read only the anchors for the dimensions in the gap report. Check obsolete/caution layers.

## Output

```
Scope: {n}  Ambiguity: {n}  Influence: {n}  Judgment: {n}  Craft: {n}
Effective level: {n} ({title}).  Widest gap: {dimension} ({n} -> {target}).

1. Where you are: one paragraph, plain language, no title worship. Lead with
   the strongest dimension and the widest gap.
2. Three behaviors to close the widest gap this quarter: each is what to do,
   why it matters at the target level, what the dropoff looks like if skipped.
   Anchored in the corpus.
3. One sentence on the dimensions already at/above target. Brief, no over-praise.
```

350-450 words. Calibration-delta mode: name the 1-3 dimensions where self-rating and the manager review diverge most, summarize each side, say which view is likely more accurate and why, and give one discussion question for the next 1:1. Do not log the pasted review anywhere.

## Voice rules

- No em dashes. No "delve", "leverage", "unpack", "navigate", "unlock", "in today's fast-paced".
- Candid coach who has seen the pattern. Direct, no corporate softening.
- Cite the corpus by guest + date + post URL where the file has it.

## Workflow

1. Administer the thirty questions verbatim from `apps/3-pm-ladder/prompt.md` (or infer from a described role and name the assumption).
2. Compute dimension medians, effective level, target, widest gap.
3. Read the corpus anchors for the gap dimensions.
4. Render the gap report. If a manager review was pasted, run calibration-delta as a second pass.

## Portability

Reuses the `knowledge/topics/` shape lenny-actualize produces. Re-anchor the question bank to another corpus's ladder topics; the median scoring is corpus-agnostic.
