---
app-id: 53
app-name: PM Horoscope
phase: 0
type: deterministic
updated: 2026-05-11
---

# Tile — #53 PM Horoscope

> Lives on the landing page (advent-calendar / soundboard grid). One tile per app.

## Calendar door number

Provisional: **Door 1** (first in Phase 0 build order). Owner can reassign once all tiles are drafted and the visual layout is fixed.

## 3–4 word hint

Candidates (pick one for the tile, or use door number alone):

| Hint | Read |
|---|---|
| **Mercury is in retrospective** | Funniest; horoscope cue + agile pun. Slight risk that non-PMs miss "retrospective" but the "Mercury" framing carries the intrigue. **Recommended.** |
| Today's PM aspect | Cleaner; the word "aspect" is horoscope vocabulary and signals divination without saying "horoscope". Lower risk, less punch. |
| Twelve archetypes, one reading | Most literal; loses the genre wink. |
| The stars say back | Saying-no pun; might land too obliquely. |

## Link target

Tile click → `/horoscope`.

- If user has set archetype (cookie or query param): goes straight to today's reading.
- If not: lands on the six-question quiz, then the reading.

## Tile copy (visual)

```
┌─────────────────────┐
│        1            │   ← door number
│                     │
│  Mercury is in      │   ← 3-4 word hint
│  retrospective      │
│                     │
└─────────────────────┘
```

Click target covers the whole tile. No CTA button; the tile is the CTA.
