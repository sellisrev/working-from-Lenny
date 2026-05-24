---
app-id: 55
app-name: Daily Dose of Knowledge
phase: 3
type: selector + narration (date-seeded / gap-weighted pick, single-record state, invalidation feed)
updated: 2026-05-24
---

# Tile — #55 Daily Dose of Knowledge

> A featured tile. Sits in the "Ask & learn (always fresh)" band, second after #54 AMA, on both the launcher home and the site (STATUS.md "4c"). Rendered as a "today's dose" card, not a numbered door.

## Calendar door number

**Featured, not a numbered door.** Daily Dose is the other always-fresh front door and sits in the featured "Ask & learn" band, just below #54 AMA. It does not take a calendar door slot; it is a live card that changes daily. Pairs with #54 AMA: AMA answers what you ask, Daily Dose decides what is worth showing you.

## 3–4 word hint

| Hint | Read |
|---|---|
| **Learn one, unlearn one** | Names the pairing: the add/subtract beat that is the whole point. **Recommended.** |
| One thing, daily | Plain and accurate; understates the unlearn half. |
| Today's lesson | Captures the habit but not the differentiator. |
| Learn and unlearn daily | Slightly longer variant of the recommended. |

## Link target

Featured "today's dose" card → calls `daily_dose_pick`, which selects + records and renders the dose (lesson + unlearn). Falls back on the static web surface to a claude.ai handoff (`/daily-dose` builds the corpus-grounded learn/unlearn prompt and opens `claude.ai/new?q=…`).

## Tile copy (visual)

```
┌───────────────────────────────────────────┐
│  Daily Dose                                 │  ← featured, in the Ask & learn band
│  One thing to learn. One thing to unlearn.  │  ← the pairing
│                                             │
│  Changes every day. Reads the live corpus.  │  ← freshness
│                          [ Today's dose ]   │
└───────────────────────────────────────────┘
```
