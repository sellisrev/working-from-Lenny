---
app-id: 47
app-name: Mission / Vision / Strategy Alignment Checker
content-type: authored-content
updated: 2026-05-17
authored-by: autonomous-routine
---

# Authored content — #47 Mission / Vision / Strategy Alignment Checker

Items from the `## Autonomous-routine backlog` in `prompt.md`.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `mission-vision.md` | NO | Substitute: `mission-vision-strategy.md` (the actual filename; covers mission, vision, strategy, goals chain comprehensively) |
| `good-strategy-rumelt.md` | YES | No change |
| `product-strategy.md` | YES | No change |
| `strategy-as-jargon.md` | NO | Substitute: `pm-pitfalls.md` (covers corporate-jargon and platitude patterns; spec anticipated this substitution) |
| `cross-functional-collaboration.md` | NO (referenced in Pass 3) | Substitute: `getting-buy-in.md` |
| `pm-pitfalls.md` | YES | No change |

Three substitutions logged to `UNCERTAIN_DECISIONS.md`.

---

## Platitude → Rewrite pairs

Ten labeled examples across mission, vision, and strategy doc types. Each: verbatim platitude + what it would have to say to be load-bearing + corpus anchor.

### Mission platitudes

**plat-m-01**
Verbatim: "Delight our customers at every touchpoint."
What it would have to say: "Reduce friction in the two highest-complaint steps of our customer journey — account setup and first renewal — so that customers reach their first value moment in under 10 minutes and renew without calling support."
Corpus anchor: mission-vision-strategy.md — "Mission: why does the company exist? (1-sentence aspirational; rarely changes.)" — the platitude answers "how" poorly without naming what "delight" means.

---

**plat-m-02**
Verbatim: "Empower small businesses to thrive."
What it would have to say: "Give founders running businesses under $1M in revenue access to the financial tools and insights that enterprise companies pay CFOs to provide, so they can make the same decisions with a 2-person team."
Corpus anchor: mission-vision-strategy.md — "Mission: why does the company exist?" — "empower" is an action without an object; the rewrite names who, what they can now do, and what they were previously unable to do.

---

**plat-m-03**
Verbatim: "Be the most trusted brand in healthcare."
What it would have to say: "Earn the trust of patients and clinicians by being the company that surfaces the relevant clinical evidence at the moment of decision, without overriding clinical judgment."
Corpus anchor: pm-pitfalls.md — "The Dreamer — vision without execution; perpetual 6-month roadmaps with little shipped." The platitude is a vision masquerading as a mission and describes a position, not a purpose.

---

**plat-m-04**
Verbatim: "Transform the way people work."
What it would have to say: "Remove the coordination overhead from cross-functional work so that product, engineering, and design teams spend more time on the work itself than on aligning around it."
Corpus anchor: mission-vision-strategy.md — "Each task should trace back through the chain. A task that doesn't trace back is reactive, not strategic." — "transform" provides no chain for tasks to trace back through.

---

### Vision platitudes

**plat-v-01**
Verbatim: "A world where every team reaches its full potential."
What it would have to say: "In 2030, every product team we work with ships at least one initiative per quarter where they could articulate the specific user behavior they were changing and measure whether it changed."
Corpus anchor: mission-vision-strategy.md — "Vision: what does the future look like if we succeed? (5-10 year picture; concrete enough to be motivating.)" — the platitude is a statement about all teams generically; the rewrite is concrete enough to answer "are we there yet?"

---

**plat-v-02**
Verbatim: "The leading platform for digital transformation."
What it would have to say: "The platform that mid-market companies use when they need to connect data from their existing tools into a single view — without a six-month implementation project."
Corpus anchor: product-strategy.md — "Diagnosis + guiding policy + coherent action. The most useful diagnostic for separating real strategy from aspirational language." — "digital transformation" is a category description, not a vision; the rewrite names the specific customer problem and the specific relief.

---

**plat-v-03**
Verbatim: "Reimagining the future of financial services."
What it would have to say: "By 2028, any individual with a smartphone can open a full-service financial account and manage savings, investments, and insurance without dealing with a branch, a broker, or a paper form."
Corpus anchor: mission-vision-strategy.md — "Vision: concrete enough to be motivating." — "reimagining" is process-framing (we are thinking about a different future), not a description of the future itself.

---

### Strategy platitudes

**plat-s-01**
Verbatim: "We will win by building a world-class product."
What it would have to say: "Our product advantage will come from faster time-to-first-value: we will reduce the gap between signup and first meaningful output from 4 hours to 15 minutes, which closes the primary objection in 60% of our lost deals."
Corpus anchor: good-strategy-rumelt.md — "'Better product' is not a power. The power has to be the structural barrier." (via seven-powers.md); from good-strategy-rumelt.md: "Bad strategy is 'fluff' — empty slogans."

---

**plat-s-02**
Verbatim: "Drive growth across all segments."
What it would have to say: "Concentrate growth investment in mid-market (50-500 employees) for the next 12 months and treat enterprise and SMB as inbound-only. Mid-market is our highest-NRR segment; investing elsewhere dilutes sales capacity before we have proof of cross-segment success."
Corpus anchor: good-strategy-rumelt.md — "Good strategy is fundamentally about saying no. Choosing what NOT to do." — "all segments" is the opposite of a strategic choice.

---

**plat-s-03**
Verbatim: "We will invest in AI to stay competitive."
What it would have to say: "We will replace our manual document review workflow with an AI-powered classification system by Q3, reducing analyst review time by 70% and allowing us to process 5× the volume without adding headcount. This is the specific capability that lets us price lower than incumbents while maintaining margin."
Corpus anchor: product-strategy.md — "The AI-readiness gap between current strategy and the AI-native answer is your strategic AI debt." (Howie Liu framing) — "invest in AI to stay competitive" is the corporate equivalent of "do something with AI" — no bet, no mechanism, no measure.

---

**plat-s-04**
Verbatim: "Our strategy is to be customer-centric."
What it would have to say: "Every roadmap decision goes through a filter: 'does this remove a step from the path between the customer's intent and the outcome they hired us for?' If we can't answer yes, the item is deprioritized regardless of its source."
Corpus anchor: mission-vision-strategy.md — "Mission → Vision → Strategy → Goals → Roadmap → Task. Each level constrains the next." — "customer-centric" is a value, not a strategy; a strategy constrains what the team builds.

---

## Worked drift-map examples

Four labeled examples across the severity spectrum.

### Severity: none

**drift-none-01**
Mission: "Help small business owners grow their revenue by making financial data as readable as a text message."
Vision: "In 2030, the owner of a 10-person bakery has the same real-time financial clarity as the CFO of a Fortune 500 — without a finance team or a consultancy."
Strategy: "Q3-Q4: Replace our 14-report PDF dashboard with a single mobile-first view showing cash position, top 5 expenses, and next-30-day cash forecast. Cut time from 'logged in' to 'knows the key number' from 8 minutes to under 60 seconds."

Drift map:
- mission ↔ vision: none. The vision is a concrete picture of the mission achieved: the specific user (bakery owner), the comparison point (Fortune 500 CFO clarity), and the constraint (no finance team).
- mission ↔ strategy: none. The strategy directly attacks the "readable as a text message" mission promise — the 60-second target is a specific operationalization.
- vision ↔ strategy: none. The strategy's mobile-first, single-view approach is a direct step on the path to the 2030 vision.
Diagnosis: This triple is well-aligned. The strategy names a specific problem (14 reports → 1 view), a specific user behavior (time-to-key-number), and a specific target. All three documents are in the same conceptual space.

---

### Severity: low

**drift-low-01**
Mission: "Eliminate admin work so teachers can focus on teaching."
Vision: "By 2028, a teacher in any public school spends fewer than 30 minutes per week on reporting, compliance, and scheduling — down from the current 8+ hours."
Strategy: "H1: Launch an AI-powered lesson plan generator. H2: Partner with three curriculum providers to offer templated content. 2026: Build a reporting automation layer."

Drift map:
- mission ↔ vision: none. Vision is a precise, measurable picture of the mission achieved.
- mission ↔ strategy: low drift. The H1 lesson plan generator is adjacent to admin work but is primarily a content-creation feature, not an admin-reduction feature. It may free up planning time but doesn't directly attack scheduling, compliance, or reporting — the three named categories in the vision.
- vision ↔ strategy: low drift. The H2 "reporting automation layer" (2026) is the most on-vision item in the strategy, but it's third priority and two years out. The vision emphasizes admin reduction; the strategy emphasizes content creation first.
Diagnosis: The vision is clear and the mission is clear. The strategy is doing adjacent work — curriculum content tools — that may be commercially sensible but is not the most direct path to the stated vision. Low-severity drift: the team is on a parallel track, not an opposite track.

---

### Severity: med

**drift-med-01**
Mission: "Make healthcare navigation simple enough that no one loses care because they couldn't figure out the system."
Vision: "A patient who needs specialist care can find, book, and receive a covered appointment in less time than it takes to get a haircut."
Strategy: "Q3: Launch B2B SaaS contracts with two large health systems to replace their internal scheduling software. Q4: Build an enterprise analytics dashboard for health system admins to track utilization. 2026: Add an AI-assisted billing code lookup for clinical staff."

Drift map:
- mission ↔ vision: none. The vision is a patient-centric picture of the mission achieved.
- mission ↔ strategy: med drift. The strategy is building B2B tools for health system administrators — not for patients navigating care. The mission is about patients; the strategy is now about operators. These aren't incompatible, but the strategy doesn't name how the B2B tools deliver the patient-side outcome.
- vision ↔ strategy: med drift. The vision describes a patient experience (find, book, receive a covered appointment). The strategy's named deliverables are for clinical staff and admins. The patient-facing outcome is implied but not named in any of the three strategy items.
Diagnosis: The mission and vision describe a patient-facing product. The strategy describes an enterprise software business. The team may have pivoted to a B2B model that has a plausible path to the patient outcome (health systems using better software means patients get better navigation), but the logic chain from H2 and H3 strategy items to the mission is not stated. Medium-severity drift: the direction is not wrong, but the connection is missing.

---

### Severity: high

**drift-high-01**
Mission: "Connect local artists directly with collectors who love their work."
Vision: "By 2027, an emerging artist in any city can replace their day job income through direct art sales on our platform."
Strategy: "H1: Launch a corporate art procurement program for office spaces. H2: Partner with interior design firms for commission-based procurement deals. H3: Build an NFT marketplace for digital art editions. 2026: Explore gallery licensing model."

Drift map:
- mission ↔ vision: none. The vision is a concrete, measurable version of the mission (day-job replacement = specific income threshold).
- mission ↔ strategy: high drift. The strategy's named bets are B2B procurement (corporate offices, interior designers), not direct artist-to-collector connections. The B2B model is the opposite of "direct" — it inserts procurement buyers between artists and end buyers.
- vision ↔ strategy: high drift. The 2027 vision is about emerging artists replacing income from direct sales. The strategy's revenue comes from corporate procurement and licensing fees — a different customer, a different transaction, and a different economic model for the artist.
Diagnosis: This triple has a well-crafted mission and vision that are internally consistent, and a strategy that has moved toward enterprise procurement for commercial reasons. The drift is strategic: the team is serving a different customer (corporate art buyers) through a different mechanism (B2B procurement) than the mission and vision describe. The question for leadership is whether the strategy change reflects a conscious mission update (the company is now a B2B art procurement company) or whether the strategy needs to be reconciled with the original mission.

---

## Synthetic mission/vision/strategy triples (golden-set evals)

Three complete triples: one that passes Rumelt cleanly, one borderline, one failing.

### golden-mvs-01 — Passes Rumelt

Mission: "Give every independent professional the same financial tools as a corporate finance department."

Vision: "By 2028, a freelance designer, therapist, or consultant can manage their entire financial life — invoicing, tax estimation, expense categorization, retirement planning — in one mobile-first tool, without an accountant."

Strategy: "Our challenge: independent professionals overwhelmingly use consumer finance apps (Mint, Personal Capital) that don't understand variable income, project-based billing, or quarterly tax obligations. The result: 60% of the self-employed we surveyed miss tax payments or overpay. Our response: build the first finance tool purpose-built for variable-income professionals. We will win by going deeper on the tax-and-invoice layer than any consumer app has, making the initial tax-estimation setup so fast and accurate that the customer stays. Actions H1-H2: launch quarterly estimated tax calculator (the highest-pain unsolved problem), add project-based invoicing with tax withholding built in, integrate directly with three popular freelancer platforms (Upwork, Fiverr, Toptal) for auto-import of income."

Rumelt verdict: yes.
Named challenge: "independent professionals overwhelmingly use consumer finance apps that don't understand variable income" — diagnoses a real structural gap.
Guiding policy: "build the first finance tool purpose-built for variable-income professionals" — direction, not a list of features.
Coherent actions: quarterly tax calculator, project-based invoicing with withholding, three platform integrations — all follow directly from the policy; they're the specific wedge into the problem named in the diagnosis.

---

### golden-mvs-02 — Borderline

Mission: "Help growing companies hire better."

Vision: "Every company with 10-200 employees has access to a hiring process that finds the right people as reliably as a Fortune 500 talent operation."

Strategy: "We're investing in three areas this year: (1) expand our job posting distribution to 40 more job boards, (2) build an AI-powered resume screening tool, (3) launch a structured interview kit generator. The goal is to be the all-in-one platform for mid-market recruiting."

Rumelt verdict: partial.
Named challenge: absent. The strategy opens with "investing in three areas" without naming what's broken about hiring for growing companies today or why current solutions fail them.
Guiding policy: "be the all-in-one platform for mid-market recruiting" — this is positioning, not a guiding policy. It names a destination, not a response to a challenge.
Coherent actions: three actions are present (job board expansion, AI screening, interview kit). They're plausibly related to the vision but they don't follow from a named challenge — they could be the right actions for any recruiting platform, not specifically for the problem stated in the mission.
Notes: The triple is internally consistent (all three layers are about hiring for growing companies) but the strategy lacks a diagnosis. Borderline Rumelt score: the vision is concrete, the strategy's actions are specific, but the link between the two is missing. Why these three actions? What about the current hiring experience is broken?

---

### golden-mvs-03 — Fails Rumelt

Mission: "Build the world's best creative collaboration platform."

Vision: "Creatives and their stakeholders work together seamlessly, wherever they are."

Strategy: "Our 2025 strategy is to be the market leader in creative collaboration. We will achieve this through product excellence, customer success investment, world-class partnerships, and innovative AI features. We are committed to delighting our customers at every stage of their journey."

Rumelt verdict: no.
Named challenge: absent. No diagnosis, no named obstacle, no causal framing.
Guiding policy: absent. "Product excellence, customer success, partnerships, AI" is not a guiding policy — it's a list of functional areas.
Coherent actions: absent. No specific action is named; none of the "four areas" has a concrete next step.
Platitudes identified: "market leader in creative collaboration" (positioning, not strategy); "product excellence" (agentless quality claim); "world-class partnerships" (no partner named); "innovative AI features" (no feature named); "delighting our customers at every stage" (three platitudes in one sentence).
Notes: This is textbook bad strategy — aspirational language in all three documents, zero diagnosis, zero guiding policy, zero coherent action. The strategy section would fail Rumelt's test even if the mission and vision were excellent. The platitude detector fires on every sentence of the strategy doc.

---

## Vague strategy fallback copy

Used when Pass 3 (operational gaps) cannot extract any named bets. Three suggestions for rewriting a vague strategy.

---

Your strategy is too vague to test operationally. We couldn't find a single named bet — a specific commitment the company is making that would be obviously false or obviously true by a specific date.

Before running this tool again, try rewriting your strategy with these three constraints:

**1. Name the challenge in one sentence.**
The challenge is the obstacle that makes success non-obvious. It's not your goal; it's the thing standing between you and your goal. A good challenge sentence starts with "Our challenge is that..." and names a specific gap, loss of position, or structural constraint. Example: "Our challenge is that enterprise buyers can't evaluate our product without a 60-day trial, which we can't sustain at our current sales capacity."

**2. Name three bets.**
A bet is a specific investment the company is making that other companies aren't making, with a mechanism that explains how it leads to the desired outcome. Each bet should have an owner (a team, not a concept) and a first observable signal within the quarter. Example bet: "We are betting that removing the minimum seat count will unlock mid-market expansion that more than compensates for lost per-seat revenue; first signal: 10 self-serve accounts expanding past 20 seats without sales touch in Q3."

**3. Name one signal per bet that tells you the bet is working within 60 days.**
If the bet is correct, what would you expect to see in the first 60 days that you don't see today? If you can't name one, the bet isn't specific enough to test. This is Rumelt's coherent-action check: if you can't connect the action to a near-term observable outcome, the action is aspirational, not strategic.
