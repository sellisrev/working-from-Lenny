---
app-id: 30
app-name: Onboarding to PM 101 for Non-PMs
phase: 3
type: generator (tailored lesson set, no scoring state)
updated: 2026-05-24
---

# Page copy — #30 Onboarding to PM 101 for Non-PMs

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/onboarding-pm-101`:

A short form, single page.

1. **Your role.** Engineer / designer / sales / customer-success / other cross-functional.
2. **Company stage.** Seed / Series A-B / growth / enterprise. This sets how formal the rituals are.
3. **PM ratio** (optional). Solo PM / a PM per squad / heavy PM org. Sets how much PM you'll actually encounter.
4. **Biggest confusion** (optional, one line). The one thing about working with the PM you most want decoded.

Submit button: "Build my orientation."

Output (renders in chat, not in the iframe, since there's no score):
- **Your five-lesson orientation**, tailored to your role and stage:
  1. What artifacts you'll see, and what they actually mean.
  2. When and how to push back.
  3. What a good PM looks like vs a bad one (the honest version).
  4. How to be useful in cross-functional rituals.
  5. When to escalate.
- If you named a confusion, a short coda that answers it directly.

The iframe's job after submit is small: confirm your role and stage and tell you the five lessons are rendering in chat. You can ask the assistant to format the orientation as a doc to drop into an onboarding packet.

Below the output:
- `format as a doc`
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

You just joined a company where product managers run the show, and nobody handed you the manual for working with them. This builds you a five-lesson orientation, tailored to your role and your company's stage, that makes you effective and unsurprised by your second week. It is not a sales pitch for product management. It tells you what the artifacts actually mean, when and how to push back, what a good PM does for you and what a bad one looks like by name, how to be the person the PM wants in the room, and when to escalate. Plain, useful, a little wry. Built for engineers, designers, sales, and CS, and it pairs with the bad-PM field guide (#46) if your orientation turns into a diagnosis.

### 2b. How it works

There's no quiz and no score. A deterministic step validates your role and stage, picks the role lens and stage calibration for each of the five fixed lessons, and selects the corpus anchors; the lessons themselves are rendered by the chat assistant from a corpus-grounded brief. The content draws on `how-x-builds-product.md`, `product-strategy.md`, and `okrs.md` for the artifacts lesson, `getting-buy-in.md`, `communicating-tradeoffs.md`, and `saying-no.md` for pushing back, `top-1-percent-pm.md` and `spotting-bad-pm-behaviors.md` for the good-vs-bad lesson, and `communicating-bad-news.md` and `managing-up.md` for escalation. It runs once, as orientation; there's no history to keep. Your inputs stay local and are not stored remotely.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape owner-approved 2026-05-23 (DECISIONS.md): reassurance-by-correction.

**Draft:**

You don't need to become a PM. You need to stop being surprised by one.

**Alternate:**

No, the PM is not your boss. Yes, they can move your ticket. Here's the rest.

---

## Editorial notes

- Block 2a holds the "not propaganda" line hard: the value is honesty (a bad PM is described by name), which is what makes a skeptical non-PM trust it.
- Block 2b is explicit that there is no stateful follow-up, matching the spec's note so a reviewer doesn't expect a history tool.
- Block 3 is the owner-approved reassurance-by-correction shape (it fixes a misconception in two beats). The alternate is funnier and more concrete about the boss/ticket confusion; keep the first for the cleaner reassurance, but the alternate is strong if review prefers specificity.
