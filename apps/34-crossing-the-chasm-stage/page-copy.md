---
app-id: 34
app-name: Crossing-the-Chasm Stage Finder
phase: 3
type: wizard + deterministic stage assignment + LLM narration
updated: 2026-05-24
---

# Page copy — #34 Crossing-the-Chasm Stage Finder

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/chasm-stage`:

Single-page wizard, a few compact field groups, no nav between steps.

1. **Customer mix.** Three numbers that sum to about 100: % innovators and visionaries, % pragmatists, % don't-know. The don't-know share is itself a signal.
2. **Acquisition trend.** Accelerating / steady / stalling / lumpy-referral-only.
3. **Pain specificity.** One-sentence named pain / broad value prop / still figuring it out.
4. **Whole product.** Can a mainstream buyer adopt you without assembling missing pieces themselves? Yes-complete / partial / no.
5. **Beachhead.** Yes-one-segment / several-segments / no-we-sell-to-anyone.
6. **Reference customers** (optional). Pragmatist references exist / only-visionary references / none.

Submit button: "Find my stage."

Output:
- **You're here**, the identifier-level result: your stage on Moore's curve (early market / at the chasm / bowling alley / tornado / main street) and the two or three signals that placed you there.
- **Your next transition**: the play for getting to the next stage, corpus-grounded.
- **How it usually goes wrong**: the failure mode of running that play wrong.
- If you're at the chasm, a direct line: this is the part where most products die, and the one move that matters.

Below the output:
- `share this stage`
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Geoffrey Moore's adoption curve, turned into a locator. You answer a few questions about who's buying, how acquisition is trending, whether your product is whole, and whether you've named a beachhead. The app places you on the curve and, more usefully, tells you what the next transition demands and the most common way teams run that play wrong. The reframe is deliberate: not "are we succeeding" but "what does success look like next, and are we set up for it." Built for founders and GTM leads who suspect the play that won their early adopters is the same play now repelling the mainstream buyers they need.

### 2b. How it works

Stage assignment is deterministic and runs locally as a categorical rule cascade, not a point score, because chasm position has dispositive signals: a visionary-heavy company with stalling acquisition and an incomplete whole product is at the chasm regardless of anything else. The narration around the stage is corpus-grounded and rendered by the chat assistant, drawn from `crossing-the-chasm.md` and `category-creation.md` for the curve and the beachhead discipline, plus `b2b-pmf.md` and `gtm-motions.md` for the transition plays. The questions are fixed so the placement is honest; the assistant supplies the next play and the failure mode. Your answers stay local and are not stored remotely.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape owner-approved 2026-05-23 (DECISIONS.md): stage-reframe.

**Draft:**

You're not failing. You're between two playbooks, running the wrong one.

**Alternate:**

The early adopters loved you. That's exactly the problem.

---

## Editorial notes

- Block 2a names founders and GTM leads because the corpus framing (Moore's beachhead, whole-product investment) is aimed at the people who own the crossing decision, and the "play that won early adopters now repels pragmatists" tension is the wedge.
- Block 2b describes the locked Phase 3 delivery: deterministic local cascade plus assistant-rendered corpus-grounded narration (Path 4 per `PHASE2_BUILD.md` #2). It calls out the cascade-not-score design because that is the load-bearing engine choice (open question #1, proposed categorical).
- Block 3 is the owner-approved stage-reframe shape (a correction, then a reframe). Distinct from the 12 locked shapes. The alternate is sharper on the at-the-chasm irony but is less general across stages; keep the first.
