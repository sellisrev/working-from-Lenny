---
app-id: 53
app-name: PM Horoscope
phase: 0
type: deterministic
updated: 2026-05-11
---

# Page copy — #53 PM Horoscope

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/horoscope`:

- If archetype cookie set → today's reading renders immediately.
- If not → the six-question quiz renders first. Once submitted, the reading.

No "welcome" copy above the reading. No "what is this" text. The reading itself is the landing.

Below the reading, a small bar:
- `← change archetype`
- `share this reading` (copies URL with archetype + date encoded)
- `want a longer reading?` (URL-trick handoff to claude.ai)

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

A daily horoscope where the twelve signs are real product-management archetypes drawn from the corpus's bad-PM and pitfall topics. Pick one, or take a six-question quiz to find yours, and you get a one-paragraph reading in horoscope rhythm anchored in actual PM behaviors. Made for the kind of PM who has caught themselves doing all twelve.

### 2b. How it works

Twelve archetypes, written once from the corpus's topics on PM pitfalls, bad-PM behaviors, saying no, and the top-1-percent PM profile. Each day's reading is composed deterministically from your archetype and today's date, picking from a pre-written set of aspects, predictions, and nudges. No LLM, no API call, no rate limit. The "lucky topic file" link sends you to the matching corpus page if you want to read the source.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Editorial policy: ironic but humbly so, no em dashes, no AI-writing tells, written in the owner's voice. One paragraph.

> Reviewed and corrected by owner before #44's equivalent block is drafted.

**Draft v1:**

A horoscope of PM archetypes. If yours stings a little, that's the point. The astrology is fake; the patterns are not.

**Alternates for owner to consider:**

- *v2 (slightly longer, names the source):* Twelve archetypes drawn from the bad-PM-behaviors and pitfalls topics, dressed as horoscope signs. The aspects are fake. The pitfalls are not. Refresh tomorrow for a new reading.
- *v3 (more self-aware):* A horoscope only as accurate as the PM pitfalls it's named after. Regrettably, accurate enough.
- *v4 (closing wink):* Mercury can do whatever Mercury wants. The Theatre Director, however, has a 9am.
