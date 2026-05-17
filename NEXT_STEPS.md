# Next steps — Working from Lenny

> Operational handoff doc. Where things stand, the workflow that's working, and what to do next. Pairs with `DISTRIBUTION_PLAN.md` (strategy + per-app execution-log table); this file is the procedural side.

Last updated: 2026-05-13.

---

## Where things stand

**Phase 0 built.** Six app pages live at `artifacts/api-server/public/`:

| Door | App | HTML | Spec folder |
|---|---|---|---|
| 1 | PM Pitfalls Self-Audit | `public/pitfalls.html` | `apps/44-pm-pitfalls/` |
| 2 | PM Horoscope | `public/horoscope.html` | `apps/53-pm-horoscope/` |
| 3 | PM-ify My Inbox | `public/pmify.html` | `apps/51-pmify-inbox/` |
| 4 | How [You] Build Product | `public/how-you-build.html` | `apps/52-how-you-build/` |
| 5 | PM Ladder Self-Assessment | `public/pm-ladder.html` | `apps/3-pm-ladder/` |
| 6 | Founder PM hire (merged #12 + #38) | `public/founder-pm-hire.html` | `apps/12-38-founder-pm-hire/` |

Tile count dropped from 7 to 6 on 2026-05-13: #12 and #38 fused into a single founder-PM-hire diagnostic. Old specs moved to `apps/_archive/` for traceability.

**Landing page** at `public/index.html` updated: six tiles, all with real hrefs (no more `/coming-soon.html` placeholders).

**Shared content** at `apps/_shared/`:
- `foundation-block.md` — third-block content reused verbatim on every app page.
- `aeo-seo-template.md` — three-block page structure each app conforms to.

---

## Workflow (local-first as of 2026-05-13)

The earlier inline-spec-prompt Replit loop was retired in favor of local development + git deploy.

**Develop:**
1. Edit `artifacts/api-server/public/<page>.html` and `styles.css` directly using specs in `apps/<id>-<slug>/`.
2. Commit on `main`.

**Deploy to Replit:**
1. Push `main` to GitHub.
2. In Replit Shell: `git pull origin main`.
3. Replit's Express server (already serving from `artifacts/api-server/public/`) picks up the new files. No restart needed for static assets.

**Stack lock (do not change without explicit decision):**
- Vanilla HTML / CSS / JS — no framework, no build step, no external SDK.
- One HTML file per app page, behavior in a single inline `<script>` at the bottom.
- Shared styles in `artifacts/api-server/public/styles.css`, namespaced per app (`.pitfalls-*`, `.fph-*`, `.pmify-*`, `.hyb-*`, `.ladder-*`, `.horoscope-*`).
- Site header + footer pattern identical across pages.
- The Express server in `artifacts/api-server/src/` becomes the Phase 1 inference proxy — leave it alone for Phase 0.

---

## Immediate next moves (in order)

1. **Deploy to Replit.** In Replit Shell: `git pull origin main`. Then visit each of the six app pages and the landing to spot-check rendering, tile clicks, and the Claude-handoff buttons.
2. **Fill the two footer TODOs** in every page (`index.html`, `pitfalls.html`, `horoscope.html`, `pmify.html`, `how-you-build.html`, `pm-ladder.html`, `founder-pm-hire.html`, `about.html`):
   - `<a href="#">Feedback</a>` → Tally form URL or `mailto:sversille@gmail.com`.
   - `<a href="#">GitHub</a>` → either the repo URL (private — will 404 for visitors) or hide the link until repo is public.
3. **Clean up the `replit-import` branch on GitHub.** Once the deploy in step 1 is verified working, `git push origin --delete replit-import`. Branch served its purpose; main has everything now.
4. **Content authoring backlog.** See section below; can happen in parallel with anything else. Each is a follow-up commit per app.

---

## Content authoring backlog

The deterministic content that needs writing against the actual corpus topic files before each app produces useful output without a Claude handoff. Page structures are shipped; this is the follow-up work.

| App | What to author | Anchor topics |
|---|---|---|
| #53 PM Horoscope | ~200 aspect lines (132 pairs × variants), 12 × 30 predictions, 12 × 20 nudges, archetype → topic-file mapping, **plus the 6-question archetype quiz** (currently the page uses a picker only) | `pm-pitfalls`, `spotting-bad-pm-behaviors`, `top-1-percent-pm`, `founder-mode`, `saying-no` |
| #44 PM Pitfalls | 20 exemplar quotes (one per pitfall); cross-check anchors against real topic files; the HTML already has extension points | `pm-pitfalls`, `spotting-bad-pm-behaviors`, `saying-no`, `bet-defending` |
| #51 PM-ify Inbox | Pattern names + one-sentence diagnoses to seed the LLM's footnote pool (Phase 1+; Phase 0 hands off to Claude) | `pm-pitfalls`, `spotting-bad-pm-behaviors`, `saying-no`, `process-vs-outcomes` |
| #52 How [You] Build | Few worked example outputs to seed prompt tone guardrails (Phase 1+) | `how-x-builds-product` or closest |
| #3 PM Ladder | 30 × 5 = 150 answer choices anchored to behaviors at each level — replaces the generic 1-5 level labels currently on the page | ladder topics (Petra Wille's PMwheel, Sean Sullivan's Scorecard, Lenny's ladder posts, `pm-career-ladders.md`) |
| #12-38 Founder PM hire | Cross-check the merged decision tree against corpus; refine the pre-canned "what good looks like" and wrong-fit cost narrations baked into the HTML | `founder-mode`, team-composition topics |

### Phase 1 content authoring (after Phase 0 horoscope completes)

Each Phase 1 app's `prompt.md` includes an `## Autonomous-routine backlog` section with the specific items below. The routine picks these up in priority order (e → f → g → h → i) once Phase 0 horoscope is complete.

| App | What to author |
|---|---|
| #2 Strategy Pressure-Tester (`apps/2-strategy-pressure-test/`) | 8-12 doc-type classifier exemplars (strategy/roadmap/PRD/mixed), ~30 anchor-quote candidates across the four passes, 5-10 synthetic strategy paragraphs for golden-set evals |
| #6 AI Eval Coverage (`apps/6-ai-eval-coverage/`) | 3 worked few-shot classification examples per category (21 total), 5-7 starter eval-prompt exemplars per category (~40 total), 8-10 synthetic feature descriptions for golden-set |
| #9 NSM Finder (`apps/9-nsm-finder/`) | 3 worked candidate examples per business shape (18 total), 5-10 dashboard-audit exemplars, 6-8 synthetic business descriptions for golden-set |
| #24 OKR Critique (`apps/24-okr-critique/`) | 4 worked KR-critique examples per test (16 total), 6 before/after rewrite exemplars, 2 sample OKR sets per stance for golden-set |
| #47 Mission/Vision Alignment (`apps/47-mission-vision-alignment/`) | 8-10 platitude→rewrite pairs, 4 worked drift-map examples across severity, 3 synthetic mission/vision/strategy triples for golden-set |

Anchors and corpus cross-checks per app: see each app's `prompt.md` Autonomous-routine backlog section for specifics.

### Phase 2 MCP work (after Phase 1 content authoring)

The routine can take a first pass at the `_open_questions` arrays in each `mcp-resource.json` once Phase 1 content authoring is done. Source-of-truth: the published MCP Apps spec (Jan 2026). For each open question, propose an answer in a same-file `_proposed_answers` array, then log to UNCERTAIN_DECISIONS.md for owner review.

---

## After Phase 0 ships

**Phase 1 — specs drafted 2026-05-17.** Five apps that need Worker inference:

| Door | App | Spec folder |
|---|---|---|
| 7 | Strategy Pressure-Tester | `apps/2-strategy-pressure-test/` |
| 8 | AI Eval Coverage Scorecard | `apps/6-ai-eval-coverage/` |
| 9 | North Star Metric Finder | `apps/9-nsm-finder/` |
| 10 | OKR Critique | `apps/24-okr-critique/` |
| 11 | Mission/Vision/Strategy Alignment | `apps/47-mission-vision-alignment/` |

Each folder follows the Phase 0 four-file pattern (tile + prompt + page-copy + mcp-resource). Each `prompt.md` includes an `## Autonomous-routine backlog` section listing the deterministic content (few-shot examples, exemplar anchors, golden-set eval inputs) the every-2h routine can author against `knowledge/topics/`. **Door styling: glass / transparent doors proposed for the Phase 1 row** to visually distinguish from the Phase 0 six materials — owner sign-off needed before locking CSS.

Build gates: HTML pages, Express Worker proxy, and landing-tile additions (going from 6 to 11 tiles, layout shift) come *after* Phase 0 traffic signal. The "kill the project before building inference plumbing" gate from the plan still applies — autonomous content authoring can proceed independent of that gate.

When Phase 1 starts, the Express server at `artifacts/api-server/src/` is where the Gemini Flash proxy goes. The free-tier ceiling story already in every Phase 0 app's Block 2b is a promise that needs delivery; same story now repeats in each Phase 1 page-copy.

**Phase 2 / MCP App.** All 23 active tools shipped as a `.mcpb` bundle. Per-app `mcp-resource.json` files drafted for Phase 0 and now Phase 1; remaining apps from APP_IDEAS.md will need theirs. Each spec's `_open_questions` list needs resolution against the current MCP Apps spec when work begins — the routine can take a first pass at these by checking the published MCP-Apps spec (Jan 2026) against each open question and proposing answers.

**Pre-publish checklist — surface this when Serge says he's getting ready to launch:**
- Draft courtesy heads-up emails to Lenny Rachitsky AND Claire Vo before any heavy launch (both, not just Lenny — Claire's *How I AI* is part of the corpus framing). Same template can serve both with a tailored opening line each. The note explains the project is supportive of, not affiliated with, their original work, and points to the attribution on /about.

---

## Pointers

- Strategy and per-app status table: `DISTRIBUTION_PLAN.md` (especially the Site shape and Execution log sections).
- Per-app full spec: `apps/<id>-<slug>/`.
- Archived superseded specs: `apps/_archive/`.
- Shared content: `apps/_shared/`.
- Corpus topic files: `knowledge/topics/`.
- Current shipped skills (for the Phase 3 builder audience): `lenny-actualize/`, `lenny-hire/`, `lenny-pressure-test/`.
- Replit project root (deployed instance): `artifacts/api-server/` (Express server + `public/` static dir).
