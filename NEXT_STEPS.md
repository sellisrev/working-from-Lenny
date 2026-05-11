# Next steps — Working from Lenny

> Operational handoff doc. Where things stand, the workflow that's working, and what to do next. Pairs with `DISTRIBUTION_PLAN.md` (strategy + per-app execution-log table); this file is the procedural side.

Last updated: 2026-05-11.

---

## Where things stand

**Phase 0 fully drafted.** Seven app folders under `apps/`:

| Door | App | Folder |
|---|---|---|
| 1 | PM Pitfalls Self-Audit | `apps/44-pm-pitfalls/` |
| 2 | PM Horoscope | `apps/53-pm-horoscope/` |
| 3 | PM-ify My Inbox | `apps/51-pmify-inbox/` |
| 4 | How [You] Build Product | `apps/52-how-you-build/` |
| 5 | PM Ladder Self-Assessment | `apps/3-pm-ladder/` |
| 6 | Should I Hire a PM Yet? | `apps/12-hire-pm-yet/` |
| 7 | Founder-mode vs Hire-PM | `apps/38-founder-mode-vs-hire/` |

Each folder contains `tile.md`, `prompt.md`, `page-copy.md`, `mcp-resource.json`. All seven Block 3 ironic blurbs are owner-reviewed and locked. Tile hints, door numbers, decision-tree heuristics, and wrong-fit cost ranges are owner-approved.

Shared content at `apps/_shared/`:
- `foundation-block.md` — third-block content reused verbatim on every app page (canonical URLs filled in).
- `aeo-seo-template.md` — three-block page structure each app conforms to.

**Replit landing page** built using the inline-spec prompt approach (see "Replit workflow" below). Seven tile targets resolve to a "Coming soon" placeholder for now.

---

## The Replit workflow that's working

For each app page (one prompt = one app):

1. **Self-contained prompt.** Paste the relevant content inline — Replit cannot fetch from this private repo. The prompt should include:
   - The page spec (block 1 + block 2 from `apps/<id>-<slug>/page-copy.md`, verbatim).
   - The foundation block (paste `apps/_shared/foundation-block.md` verbatim — Replit embeds this as block 2c).
   - The deterministic logic OR the URL-trick handoff prompt from `apps/<id>-<slug>/prompt.md`.
   - Stack lock: vanilla HTML/CSS/JS, no framework, no build step, no external SDK.
   - Hard rules: use spec verbatim, no invention, no em dashes in any copy Replit writes itself, no marketing.

2. **Force preflight.** Tell Replit to read the spec back to you BEFORE writing code. Stop and wait for confirmation.

3. **Build one page per prompt.** Review before the next.

4. **No batching across apps.** Cost of one Replit turn is small; cost of fixing a misread build is large.

The landing-page Replit prompt that worked is preserved in chat history. The next-app version follows the same shape — just swap the inline spec for the next app's content.

---

## Immediate next moves (in order)

1. **Confirm the landing page on Replit** against the spec. Spot-check tile hints (exact wording), door order, footer text, and meta description.
2. **Fill in two placeholders** Replit surfaced in landing-page preflight:
   - Feedback URL (Tally form, or `mailto:` for now).
   - GitHub footer link target (private repo URL or hide-until-public).
3. **Build app page 1 = #44 PM Pitfalls Self-Audit.** Spec at `apps/44-pm-pitfalls/`. Use the Replit workflow above. The page structure can ship first; the 20 exemplar quotes (see "Content authoring backlog") can be a follow-up commit.
4. **Build subsequent app pages in Phase 0 order:** #53, #51, #52, #3, #12, #38. Each is its own Replit prompt + preflight + review.

---

## Content authoring backlog

The deterministic content that needs writing against the actual corpus topic files before each app produces useful output. Page structure can ship first; content is a follow-up commit. Can happen in parallel with Replit page building, or after.

| App | What to author | Anchor topics |
|---|---|---|
| #53 PM Horoscope | ~200 aspect lines (132 pairs × variants), 12 × 30 predictions, 12 × 20 nudges, archetype → topic-file mapping | `pm-pitfalls`, `spotting-bad-pm-behaviors`, `top-1-percent-pm`, `founder-mode`, `saying-no` |
| #44 PM Pitfalls | 20 exemplar quotes (one per pitfall); cross-check anchors against real topic files | `pm-pitfalls`, `spotting-bad-pm-behaviors`, `saying-no`, `bet-defending` |
| #51 PM-ify Inbox | Pattern names + one-sentence diagnoses to seed the LLM's footnote pool | `pm-pitfalls`, `spotting-bad-pm-behaviors`, `saying-no`, `process-vs-outcomes` |
| #52 How [You] Build | Few worked example outputs to seed prompt tone guardrails | `how-x-builds-product` or closest |
| #3 PM Ladder | 30 × 5 = 150 answer choices anchored to behaviors at each level | ladder topics (Petra Wille's PMwheel, Sean Sullivan's Scorecard, Lenny's ladder posts) |
| #12 Should I Hire | Decision tree cross-check against corpus; interim playbook narratives | `founder-mode`, `hire-pm-yet` or closest |
| #38 Founder-mode | Wrong-fit cost narratives per pair; what-good-looks-like at each level | `founder-mode`, team-composition topics |

---

## After Phase 0 ships

**Phase 1.** Five apps that need Worker inference: #2 (Strategy pressure-tester), #6 (AI eval coverage), #9 (NSM finder), #24 (OKR critique), #47 (Mission/vision alignment). Per-app `apps/<id>-<slug>/` folders not yet drafted; follow the same structure as Phase 0 (tile + prompt + page-copy + mcp-resource). Build comes after Phase 0 traffic signal per the plan's "kill the project before building inference plumbing" gate.

**Phase 2 / MCP App.** All 23 active tools shipped as a `.mcpb` bundle. Per-app `mcp-resource.json` files drafted for Phase 0 already; Phase 1 and remaining apps will need theirs. MCP `_open_questions` in each spec need resolution against the current MCP Apps spec when work begins.

**Pre-publish.** Courtesy heads-up emails to Lenny Rachitsky and Claire Vo before any heavy launch (per the *Corpus IP and extraction posture* section of `DISTRIBUTION_PLAN.md`).

---

## Pointers

- Strategy and per-app status table: `DISTRIBUTION_PLAN.md` (especially the Site shape and Execution log sections).
- Per-app full spec: `apps/<id>-<slug>/`.
- Shared content: `apps/_shared/`.
- Corpus topic files: `knowledge/topics/`.
- Current shipped skills (for the Phase 3 builder audience): `lenny-actualize/`, `lenny-hire/`, `lenny-pressure-test/`.
