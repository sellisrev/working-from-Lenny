# Workflow — Working from Lenny

> Procedural doc: dev setup, stack lock, deploy procedure. Last updated 2026-05-17.
>
> For per-app status and the content authoring backlog, see [`STATUS.md`](STATUS.md). For strategy and design decisions, see [`DISTRIBUTION_PLAN.md`](DISTRIBUTION_PLAN.md). For the autonomous routine config + run log, see [`ROUTINE.md`](ROUTINE.md).

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

---

## Stack lock (do not change without explicit decision)

- Vanilla HTML / CSS / JS — no framework, no build step, no external SDK.
- One HTML file per app page, behavior in a single inline `<script>` at the bottom.
- Shared styles in `artifacts/api-server/public/styles.css`, namespaced per app (`.pitfalls-*`, `.fph-*`, `.pmify-*`, `.hyb-*`, `.ladder-*`, `.horoscope-*`).
- Site header + footer pattern identical across pages.
- The Express server in `artifacts/api-server/src/` becomes the Phase 1 inference proxy — leave it alone for Phase 0.
- Replit Express config detail: `app.use(express.static('../public', { extensions: ["html"] }))` — both `/pitfalls` and `/pitfalls.html` work. Landing uses `.html` for consistency.

---

## Repo-Replit auth

GitHub PAT stored in Replit's `.git/config` was scrubbed after the import push. For future pushes from Replit, a fresh PAT would need to be supplied. Local pushes from `D:\Claude\lenny-actualize` work via the normal git credential helper.

---

## Voice rules (applied across all authored content)

- No em dashes in Claude-authored text (em dashes are allowed only in spec-verbatim content where they were already present, e.g. pitfall #9 has a locked em dash).
- No AI-writing tells: avoid `delve`, `leverage`, `unpack`, `navigate`, `unlock`, `in today's fast-paced`.
- Owner's voice: candid, direct, no corporate softening, no marketing hype.
- Curly quotes are fine.

---

## Block-3 voice catalog (each app has a unique ironic-blurb shape)

- **#53 PM Horoscope** — two-beat: "Mercury can do whatever Mercury wants. The Theatre Director, however, has a 9am."
- **#44 PM Pitfalls** — tripartite: "Twenty pitfalls. Most PMs are guilty of seven. The honest ones admit nine."
- **#51 PM-ify Inbox** — single-line: "There is no Q3 in human relationships."
- **#52 How [You] Build** — Q-and-A: "How did your team make a Notion doc this important? Mostly by accident."
- **#3 PM Ladder** — conditional: "If you scored Principal, the rubric was easier than the job."
- **#12-38 Founder PM hire** — fragments + parenthetical: "Maybe. Not yet. Yes (and at which level)."
- **#2 Strategy Pressure-Tester** (Phase 1, draft) — imperative + reversal: "Pressure-test it now. The board has fewer hobbies than you do."
- **#6 AI Eval Coverage** (Phase 1, draft) — confession: "Yes, you shipped it. No, you didn't measure it."
- **#9 NSM Finder** (Phase 1, draft) — sigh: "Three candidates. One real. You'll pick the third."
- **#24 OKR Critique** (Phase 1, draft) — tripartite cadence: "Activity disguised as outcome. Outcome disguised as platitude. The actual outcome, still unspoken."
- **#47 Mission/Vision Alignment** (Phase 1, draft) — definition: "A mission is what you'd still do if the funding stopped. The rest is decoration."

Each is drafted alongside its page-copy, then reviewed and locked one at a time so the corrections inform the next draft.

---

## Pointers

- Where are we right now: [`STATUS.md`](STATUS.md)
- Strategy and design decisions: [`DISTRIBUTION_PLAN.md`](DISTRIBUTION_PLAN.md)
- Autonomous routine: [`ROUTINE.md`](ROUTINE.md)
- Owner-review decisions: [`DECISIONS.md`](DECISIONS.md)
- App catalog: [`APP_IDEAS.md`](APP_IDEAS.md)
- Per-app full spec: `apps/<id>-<slug>/`
- Shared content: `apps/_shared/`
- Replit project root (deployed instance): `artifacts/api-server/` (Express server + `public/` static dir)
