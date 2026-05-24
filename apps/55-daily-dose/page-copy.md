---
app-id: 55
app-name: Daily Dose of Knowledge
phase: 3
type: selector + narration (date-seeded / gap-weighted pick, single-record state, invalidation feed)
updated: 2026-05-24
---

# Page copy — #55 Daily Dose of Knowledge

> Three blocks per `apps/_shared/aeo-seo-template.md`. This is a featured app; it sits in the "Ask & learn (always fresh)" band, second after #54 AMA, on both the launcher home and the site grid (STATUS.md "4c").

---

## Block 1: Value first

The working interface. On `/daily-dose` (and the featured card in the "Ask & learn" band of the launcher home):

A single card: "Today's dose." Open it; you get today's pick. No form, no settings.

Button: "Today's dose."

Output (renders in chat):
- **The lesson**: one thing worth learning today, in plain language, grounded in the current corpus, with a real passage and who said it.
- **Try this**: one concrete action, not a summary.
- **Unlearn**: one thing the corpus has since retired, or a popular claim that drew strong audience pushback, and what changed. This is the half that makes it a dose and not a tip.
- **Day N** (quiet): how many days you have taken your dose. A nudge, not a score.

Below the output:
- `tomorrow's is different`
- `dose me on a specific topic`
- `keep going in Claude`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

Most "tip of the day" things only add. They give you one more thing to believe. This one also subtracts: every dose pairs one lesson worth keeping with one thing the field has quietly walked back. The lesson is small and current, drawn from the live corpus, with the passage and the person behind it so you can trust it. The unlearn half is the point: the old SEO playbook, the "no days off" leadership posture, a guest declaring the PM role dead, the early vibe-coding hype. The corpus keeps a record of what it has retired and what drew heavy audience pushback, and the dose feeds you a piece of that each time, so the things you stop believing keep pace with the things you start believing. It is a daily habit, not a tool you reach for with a question. When you do have a question, that is the AMA next door.

### 2b. How it works

You open the card; the tool picks today's topic. The pick is deterministic, so a given day is stable: by default it is a date-seeded draw across the whole knowledge base, and if you have used the other tools here, it leans toward the things you are under-covered on (the pitfalls you flagged, the dimensions you scored low, the areas you do not log decisions about). It reads only this app's local data; nothing leaves your machine and there is no setup. The unlearn half reads two layers the corpus maintains: an "obsolete" layer of advice it has retired (with what replaced it and how confident the retirement is) and a "cautions" layer of popular claims that drew heavy audience pushback (with the vote counts and the rebuttals). It shows you the most recent one you have not seen yet and remembers where you are, so you move through the feed instead of repeating. Because it reads the live knowledge base at narration time, every monthly refresh makes it better with no rework.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output. Voice shape PROPOSED 2026-05-24 (DECISIONS.md): learn/unlearn pairing. Owner sign-off needed (voice shapes are owner-locked). Per PROCEDURAL_REFERENCE.md the blurb foregrounds the learn/unlearn pairing, since the subtractive half is the differentiator.

**Draft:**

One thing to learn today. And one a guest quietly took back.

**Alternate:**

Today's lesson, plus the thing everyone still repeats that stopped being true.

---

## Editorial notes

- Block 2a leads with the learn/unlearn wedge (add vs. subtract), not the daily-habit novelty, per the voice-catalog note. The subtractive half is the reason to trust it over a generic tip surface.
- Block 2b explains the deterministic pick (date-seeded, optionally gap-weighted), the local-only data, and the two-layer invalidation feed in plain terms, since the layering and the "remembers where you are" feed are the whole differentiator and a reviewer should see them spelled out.
- Block 3 foregrounds the learn/unlearn pairing. The alternate is punchier; keep the first for the cleaner two-beat (learn / took back).
- No "doses I've seen" browse surface by design (single-record state, not a collection); Block 2b says the local data is used to avoid repeats and pace the feed, so a reviewer does not expect a history list.
- Pairs with #54 AMA in the featured band: AMA answers what you ask, Daily Dose decides what is worth showing you. Block 2a names that split so the two front doors read as complementary, not redundant.
