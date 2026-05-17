---
app-id: 9
app-name: North Star Metric Finder
phase: 1
type: wizard + LLM-narrated candidate critique
updated: 2026-05-17
---

# Page copy — #9 North Star Metric Finder

> Three blocks per `apps/_shared/aeo-seo-template.md`.

---

## Block 1: Value first

The working interface. On `/nsm-finder`:

Four-step wizard, single page, no nav between steps. Step indicator dots at the top (1 of 4 / 2 of 4 / ...). Each step is one set of compact form fields.

1. **Business shape.** Dropdown: B2C subscription / B2C transactional / B2B SaaS (PLG) / B2B SaaS (sales-led) / marketplace / prosumer. Plus a "what makes my business unusual" free-text (max 200 chars).
2. **Primary user action.** Radio + free-text. "When a user gets value, what specific thing did they just do?" (max 200 chars)
3. **Monetization shape.** Multi-select: pay-per-use / subscription / freemium-to-paid / seat-based / consumption-based / ad-supported / other. Plus current ARR-or-revenue band dropdown.
4. **Friction + stage.** Two fields: "biggest friction point right now" (200 chars), "company stage" (dropdown: pre-PMF / early PMF / scaling / mature).

Optional bonus mode: a textarea labelled "Paste your current dashboard (list of metrics, one per line)" — used by the "dashboard audit" output below.

Submit button: "Surface three candidates."

Output:
- **Three NSM candidates** as cards. Each card has:
  - Candidate name (e.g., "Weekly active editing sessions").
  - **Argument for** (3 sentences, anchored).
  - **Argument against** (3 sentences — vanity risk, leading-vs-lagging analysis, gameability).
  - **Input metrics** that drive this NSM (3–5).
- **Dashboard audit** (only if bonus mode used): for each pasted metric, "closest to NSM" / "useful input" / "vanity, replace."

Below the output:
- `share these three`
- `keep going in Claude`
- `start over`

---

## Block 2: Description, concrete → general

### 2a. What this app does for you

The four-step wizard walks through your business shape, your user's primary value moment, your monetization model, and your stage. The app returns three candidate North Star metrics with explicit arguments for and against each, including the vanity-metric risk, whether it's leading or lagging, and how gameable it is by the team. Each candidate comes with the 3–5 input metrics that drive it, so you have a tree to instrument. Built for founders defining for the first time and PMs inheriting a dashboard full of vanity numbers who need a defensible "this one is closest" answer for the next strategy meeting.

### 2b. How it works

Your four-step inputs route to a Gemini Flash call with a system prompt drawn from the corpus's `north-star-metric.md`, `activation-metric.md`, and `growth-loops.md` topics, weighted by Sean Ellis-era framing for PLG businesses and Hila Qu / Andrew Chen framing for marketplaces. Candidate generation is open-ended (the model proposes); critique-per-candidate is structured (the model fills the same four arguments-against slots for each). Your inputs stay in the Worker request scope and are not stored. Worker free-tier ceiling: ~30 NSM critiques per IP per day. If the bonus dashboard-audit is used, your metric names are inspected but not stored either.

### 2c. Foundation

*(Embed `apps/_shared/foundation-block.md` verbatim here.)*

---

## Block 3: Short ironic-but-humble description

> Below the output.

**Draft:**

Three candidates. One real. You'll pick the third.

**Alternate:**

The honest NSM is the one nobody on your team would brag about.

---

## Editorial notes

- Block 2a uses "founders" and "PMs" explicitly because the audience is bimodal — founders-defining-for-first-time and PMs-inheriting. The wedge is different per audience (founders need permission to commit; PMs need defensibility).
- Block 2b cites Sean Ellis, Hila Qu, Andrew Chen because the NSM space has named voices and citation gives the critique authority. If their corpus files are missing, substitute and log.
- Block 3 draft works without the alternate. The alternate has a sharper observation about social proof but is harder to fit in 8 words; keep the first.
