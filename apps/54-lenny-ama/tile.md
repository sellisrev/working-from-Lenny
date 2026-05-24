---
app-id: 54
app-name: Lenny AMA (always fresh)
phase: 3
type: open Q&A / router (corpus-wide retrieval, no state)
updated: 2026-05-24
---

# Tile — #54 Lenny AMA (always fresh)

> The featured tile. Sits first, above the themed grid, on both the launcher home and the site (STATUS.md "4c", "Ask & learn (always fresh)" band, AMA pinned first). Rendered as a question box, not just a tile.

## Calendar door number

**Featured, not a numbered door.** The AMA is the highest-visibility entry point and is pinned at the top of the launcher home / site as a live question box, above the themed door grid. It does not take a calendar door slot; it is the front door itself. Pairs with #55 Daily Dose in the featured "Ask & learn" band.

## 3–4 word hint

| Hint | Read |
|---|---|
| **Ask anything, stays current** | Names the catch-all + the freshness wedge in four words. **Recommended.** |
| Ask the corpus | Plain and accurate; understates the freshness angle. |
| The front door | Captures the role (entry point / router) but not what it does. |
| Always-fresh PM answers | Leads with the differentiator; slightly more abstract. |

## Link target

Featured question box → posts the question to chat, which calls `ama_ask` and renders the grounded answer. Falls back on the static web surface to a claude.ai handoff (`/lenny-ama` builds the corpus-grounded prompt and opens `claude.ai/new?q=…`).

## Tile copy (visual)

```
┌───────────────────────────────────────────┐
│  Ask Lenny's corpus anything                │  ← featured, full-width
│  ┌───────────────────────────────────────┐ │
│  │ e.g. is this a good north star metric?  │ │  ← live question box
│  └───────────────────────────────────────┘ │
│  Always fresh: it flags what's expired.     │  ← freshness caveat
│                                    [ Ask ]  │
└───────────────────────────────────────────┘
```
