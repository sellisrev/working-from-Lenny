---
app-id: 2
app-name: Strategy Pressure-Tester
content-type: authored-content
updated: 2026-05-17
authored-by: autonomous-routine
---

# Authored content — #2 Strategy Pressure-Tester

Items from the `## Autonomous-routine backlog` in `prompt.md`.

---

## Anchor cross-check

Files referenced in `prompt.md` four-pass anchors — verified against `knowledge/topics/`:

| Referenced file | Exists? | Action |
|---|---|---|
| `good-strategy-rumelt.md` | YES | No change |
| `product-strategy.md` | YES | No change |
| `defending-big-bets.md` | YES | No change |
| `saying-no.md` | YES | No change |
| `pm-pitfalls.md` | YES | No change |
| `pivots-art.md` | YES | No change |
| `competitive-positioning.md` | NO | Substitute: `positioning.md` (April Dunford framing) |
| `business-model-evolution.md` | NO | Substitute: `seven-powers.md` (moat/barrier framing for stress scenarios) |

Both missing files logged to `UNCERTAIN_DECISIONS.md`.

---

## Doc-type classifier exemplars

Ten labeled examples for the deterministic router. Two to three per category.
Drawn from corpus vocabulary (Rumelt, Mehta strategy stack, Bastow roadmap framing).

### strategy (2 exemplars)

**s-01**
> Our core challenge: PLG-driven acquisition has stalled at mid-market and enterprise deals close but require a sales-touch we cannot sustain at scale. Our response: shift go-to-market to product-qualified leads with a clear self-serve path to $20K ACV. Actions over three quarters — Q2: launch PQL scoring; Q3: dedicated PLG-to-enterprise motion pilot with five named accounts; Q4: remove the high-touch trial track for sub-$5K deals.

Label: `strategy`
Signals: named challenge ("PLG-driven acquisition has stalled"), guiding policy ("shift go-to-market"), coherent actions that follow from the policy, multi-quarter horizon.

---

**s-02**
> We have a two-sided problem: our API is the default entry point for developers but the consumer product is losing ground to specialists who cloned our core feature at a lower price. The bet: go deep on enterprise, cede the consumer surface, and build switching costs through proprietary workflow data. Eighteen-month plan — wind down consumer marketing now; convert top-50 consumer accounts to enterprise tier by Q2; launch SOC 2 Type II and SSO by Q3; introduce workflow-lock integrations in Q4.

Label: `strategy`
Signals: named challenge ("two-sided problem"), explicit choice of what to cede ("cede the consumer surface"), coherent actions derived from the policy, data-moat framing.

---

### roadmap (2 exemplars)

**r-01**
> Q1: dark mode, onboarding redesign, bulk CSV export. Q2: API v2, SSO, new analytics dashboard. Q3: iOS mobile app, analytics add-on, Salesforce and HubSpot integrations. Q4: enterprise tier, audit logs, custom roles.

Label: `roadmap`
Signals: features organized by quarter, no diagnosis, no named challenge, no explanation of why these features follow from any policy.

---

**r-02**
> Next quarter we're shipping the redesigned settings page, the new report builder, and the billing portal revamp. Engineering has flagged the notification system for a refactor — we'll slot that in after. After Q2: authentication refactor, then internationalization for EU. Mobile app beta mid-year, GA by Q4.

Label: `roadmap`
Signals: sequenced feature list, past-tense "engineering has flagged" framing, no strategic reasoning, quarter-by-quarter structure without challenge or tradeoff statements.

---

### prd (2 exemplars)

**p-01**
> Feature: bulk invite. Problem: teams with more than 20 members spend 20-plus minutes inviting individually; support tickets confirm this is the top onboarding friction. Goal: let admins upload a CSV of email addresses and send invites in batch. Success: 80% of enterprise accounts with more than 20 members use bulk invite within 30 days of GA. Scope: upload → validate → preview → confirm → send. Edge cases: invalid emails (reject with error row), duplicate accounts (skip with warning), rate-limit behavior (queue + retry). Non-goals: bulk removal, CSV template customization.

Label: `prd`
Signals: single feature, problem statement with evidence, defined success metric, explicit scope, edge case enumeration, non-goals.

---

**p-02**
> Feature: notification preferences. Problem: power users report email overload; unsubscribe rate is 18% and climbing, pointing to frequency mismatch not disinterest. Feature scope: per-event-type toggle (on/off) plus digest mode (immediate / daily / weekly summary). Success: unsubscribe rate drops below 10% within 60 days post-launch. Non-goals: push notifications (Phase 2), SMS (not planned). Estimated effort: one engineer, two weeks.

Label: `prd`
Signals: single feature, data-backed problem, concrete success criterion, explicit effort estimate, non-goals.

---

### mixed (3 exemplars)

**m-01**
> Our strategic priority for the year is winning enterprise. To accomplish this, we will ship SSO in Q1, launch a dedicated enterprise tier in Q2, and add audit logs and custom roles by Q3. We also need to close the security certification gap and deliver the HubSpot integration for three named accounts by Q2.

Label: `mixed`
Signals: strategy vocabulary ("strategic priority", "winning enterprise") but operative content is a feature list by quarter. No diagnosis, no guiding policy that explains why these features equal "winning enterprise." Would critique as: this document is shaped like a roadmap.

---

**m-02**
> To become the category leader in mid-market HR software, we are organized around four strategic pillars: (1) best-in-class onboarding (redesign shipped Q1), (2) enterprise integrations with Workday and BambooHR (Q2), (3) AI-powered people insights module (Q3), (4) mobile parity (Q4). Each pillar has an owner and a quarterly shipped milestone.

Label: `mixed`
Signals: "category leader" aspiration, "strategic pillars" framing — but each pillar is a feature with a quarter. No challenge named, no tradeoffs, no explanation of why these four pillars produce category leadership. Classic fluff-wrap over a roadmap.

---

**m-03**
> We have to fix retention or the business doesn't work. This year, we're investing in three areas: reducing time-to-value in onboarding (new guided setup flow, Q1), deepening engagement for power users (advanced filter and custom views, Q2), and making the product stickier by adding team collaboration features (Q3-Q4). These are the bets that get us to 85% annual retention by year-end.

Label: `mixed`
Signals: hints at a real challenge ("retention or the business doesn't work") but the response is a feature list without a guiding policy. The "85% retention" goal is present but the logic chain from the features to that goal is not articulated. Closer to roadmap-with-goal than true strategy.

---

## Anchor quote pool

Vetted quotes for LLM prompts across the four passes. Pulls directly from corpus topic files.

### Pass 1 — Rumelt diagnosis test

Sources: `good-strategy-rumelt.md`, `product-strategy.md`

> "A good strategy identifies the obstacle (diagnosis), proposes a coherent response (guiding policy), and lists the actions that follow (coherent actions). A non-strategy is a list of aspirations." — good-strategy-rumelt.md

> "Bad strategy is 'fluff' — empty slogans, motherhood goals, aspirational statements masquerading as analysis, multiple-priority lists where everything is priority." — good-strategy-rumelt.md

> "A strategy that doesn't survive removing every aspirational sentence is mostly fluff." — good-strategy-rumelt.md

> "Good strategy is fundamentally about saying no. Choosing what NOT to do." — good-strategy-rumelt.md

> "Mission → Vision → Strategy → Goals → Roadmap → Task. PMs who can't connect a roadmap item back through goals → strategy → vision → mission are operating on incomplete strategy." — product-strategy.md (Ravi Mehta framing)

> "Diagnosis + guiding policy + coherent action. The most useful diagnostic for separating real strategy from aspirational language." — product-strategy.md

> "Write the diagnosis first. If it is vague or aspirational, fix that before moving to policy and actions." — good-strategy-rumelt.md

> "For very early-stage startups, pre-PMF strategy is closer to 'validate this hypothesis' than 'diagnose + policy + action.'" — good-strategy-rumelt.md

### Pass 2 — Missing tradeoffs

Sources: `product-strategy.md`, `defending-big-bets.md`, `saying-no.md`

> "Yes-by-default is the most expensive habit in tech. Every yes commits future capacity." — saying-no.md

> "A team that says yes to everything has no strategy; saying no is how you operate one." — saying-no.md

> "Strong 'no's' enable strong 'yes's'. Teams known for saying no are trusted when they say yes." — saying-no.md

> "Strategic clarity is still the scarce resource; saying no protects it." — saying-no.md

> "Stack-rank the big bet against alternatives. Make leadership acknowledge what they'd be giving up to kill it." — defending-big-bets.md

> "Pre-define what would cause you to stop; if those conditions don't hit, you have a defensible case to continue." — defending-big-bets.md (Annie Duke kill-criteria framing)

> "Distribution has become the most important moat." — product-strategy.md (Evan Spiegel, 2026-04-26)

> "The AI-readiness gap between current strategy and the AI-native answer is your strategic AI debt." — product-strategy.md (Howie Liu framing)

### Pass 3 — Untested assumptions

Sources: `defending-big-bets.md`, `pm-pitfalls.md`

> "Conviction without signal is fragile." — defending-big-bets.md

> "Vague success is unfundable." — defending-big-bets.md

> "'We've been working on this for 6 months and have nothing to show' is the kill signal." — defending-big-bets.md

> "Three customers told us they'd pay $X for this is hard to dismiss." — defending-big-bets.md

> "80% of the team's time on short-term low-risk incremental wins. 20% on the high-risk, long-term big bet. Without cover fire, big bets are easy targets when priorities shift." — defending-big-bets.md

> "The Dreamer — vision without execution; perpetual six-month-plus roadmaps with little shipped." — pm-pitfalls.md (canonical pitfall #3)

> "Prioritizing impulsively — anecdotal data drives roadmap." — pm-pitfalls.md (canonical pitfall #7)

> "How load-bearing the assumption is: does the whole bet collapse if wrong, or just degrade?" — prompt.md Pass 3 router logic (internal)

### Pass 4 — Six-month stress scenario

Sources: `positioning.md` (substituting `competitive-positioning.md`), `pivots-art.md`, `seven-powers.md` (substituting `business-model-evolution.md`)

> "Pivots happen on observed signal. Not panic; not exhaustion. Specific signals from the market." — pivots-art.md

> "The new direction often was visible in the old data. Pivot decisions look obvious in retrospect because the seed was there." — pivots-art.md

> "Market signal that the inflection you bet on isn't materializing." — pivots-art.md (when-to-pivot list)

> "Half-pivots fail." — pivots-art.md

> "'Better product' is not a power. The power has to be a structural barrier." — seven-powers.md

> "A benefit without a barrier erodes; a barrier with no benefit is worthless." — seven-powers.md (Power = Benefit × Barrier)

> "Foundation-model access is not a durable power for most application-layer products." — seven-powers.md (2025-2026 update)

> "Many B2B SaaS companies have rewritten positioning to lead with AI. This is sometimes correct (when AI delivers real differentiation) and sometimes lazy (when AI is bolted on)." — positioning.md

> "Positioning is a set of context-setting decisions, not a tagline." — positioning.md (April Dunford framing)

> "Vague positioning gets summarized away by answer engines; sharp positioning gets cited." — positioning.md (AEO update)

---

## Synthetic strategy paragraphs (golden-set evals)

Eight labeled examples, two per `doc_type`, for testing the four-pass critique engine once inference is wired. Anonymized and realistic. No real company names.

### doc_type: strategy

**golden-s-01** — clear strategy with named challenge and tradeoffs
> The core challenge: we have been building for B2B mid-market but our highest-retention segment is SMB teams under 20 people who found us through word of mouth. Mid-market sales cycles are 90 days; SMB converts in five. Our guiding policy: concentrate resources on the SMB motion for the next 12 months and treat mid-market as inbound-only. Actions — cut the sales-touch trial track; invest in self-serve onboarding; ship a freemium tier with a hard-seat ceiling; run content marketing to the SMB-founder persona. What we are not doing: any new enterprise features, any reseller channel, any paid acquisition above $40 CPL.

Expected critique profile: Pass 1 should find a real diagnosis; Pass 2 should find explicit tradeoffs; Pass 3 should surface the assumption that SMB CAC doesn't balloon once word-of-mouth saturates; Pass 4 scenario might be "if a well-funded competitor matches your freemium seat ceiling in Q3."

---

**golden-s-02** — strategy with a clear bet but weak tradeoff articulation
> We are betting on AI-native onboarding as our primary growth lever. New users who complete the AI-guided setup flow show 40% better 30-day retention than those who skip it. Our policy: make AI-guided onboarding the default, non-skippable path for all new accounts. Actions Q1-Q2: redesign the onboarding modal to require at least two AI-driven setup steps; remove the "skip" option; add a completion indicator on the dashboard to reinforce progress. Goal: lift 30-day retention from 61% to 72% by Q3.

Expected critique profile: Pass 1 finds a diagnosis (retention gap, 40% retention delta); Pass 2 should push on what they are NOT doing (users who hate forced onboarding? alternative growth levers?); Pass 3 should surface the assumption that removing "skip" does not spike churn for power users who know what they want; Pass 4 scenario might be "if a competitor ships one-click import that makes your onboarding feel slow."

---

### doc_type: roadmap

**golden-r-01** — pure roadmap, no strategy wrapper
> H1 priorities: migrate to the new infrastructure stack (Q1), launch the redesigned search experience (Q1-Q2), ship the collaboration beta (Q2). H2 priorities: native mobile app (Q3), enterprise SSO and audit logs (Q3), analytics v2 dashboard (Q4). Carry-over: accessibility audit and remediation planned for Q2 but may slip to Q3 depending on migration complexity.

Expected classifier output: `roadmap`. No challenge named, no guiding policy, no tradeoff statements. Critique should note this is a delivery schedule, not a strategy.

---

**golden-r-02** — roadmap with light goal decoration
> This quarter, the team is focused on three things: shipping the new billing system (goal: reduce billing-related support tickets by 30%), finishing the API v3 migration (goal: unblock the integration partners waiting on us), and getting the onboarding revamp to beta (goal: improve trial-to-paid conversion). Next quarter we move to the mobile app and start scoping AI features.

Expected classifier output: `roadmap`. Goals are present but they attach to individual features rather than to a diagnosis of the overall challenge. No named challenge, no guiding policy.

---

### doc_type: prd

**golden-p-01** — tight PRD with good scope definition
> Feature: one-click template import. Problem: 60% of new accounts tell us in onboarding surveys that they would start faster if they had a pre-built template. Currently, the only path is building from scratch. Success: template import used by at least 40% of new accounts in their first session. Scope: a library of 12 templates organized by use case; one-click import that populates the user's first workspace; ability to edit after import. Edge cases: import fails if workspace already has data (prompt to merge or replace); template library unavailable offline (show cached list). Non-goals: user-generated template sharing (Phase 2), template versioning.

Expected classifier output: `prd`. Single feature, success metric, explicit scope, edge cases, non-goals.

---

**golden-p-02** — PRD with clear problem but scope drift risk
> Feature: smart tagging. Problem: power users manage hundreds of items and report that search is not enough — they need to organize by custom attributes. Goal: let users create custom tags, apply them to any item, and filter by tag. Success: power users (users with 50+ items) use tagging at least twice per week within 30 days of launch. Questions to resolve: should tags be workspace-global or user-private? Should we allow tag hierarchies (Phase 1 or Phase 2)? Estimated effort: 2-3 engineers, 6 weeks.

Expected classifier output: `prd`. Open questions visible (which is good PRD craft); the scope is still single-feature even with the open questions.

---

### doc_type: mixed

**golden-m-01** — classic mixed: strategy vocabulary, roadmap content
> Our 2025 strategy is to be the best AI-powered workspace for creative teams. We will achieve this through five strategic initiatives: (1) AI writing assistant launch (Q1), (2) real-time co-editing (Q2), (3) AI image generation integration (Q2), (4) template marketplace (Q3), and (5) mobile offline mode (Q4). Each initiative has a cross-functional owner and a shipped milestone.

Expected classifier output: `mixed`. "Best AI-powered workspace" is an aspiration, not a diagnosis. "Five strategic initiatives" maps exactly to five features with quarters. The mixed card should prepend: "this document is shaped like a roadmap."

---

**golden-m-02** — mixed with a real insight buried under feature lists
> The insight driving this plan: our highest-value customers all started with a specific use case (campaign planning) and only expanded when they discovered the broader surface. The problem is that most new users land on our general home screen and never find campaign planning. Plan: redesign the onboarding modal (Q1), add a "start with campaign" shortcut to the home screen (Q1), build a campaign-specific dashboard view (Q2), and create five campaign-template packs (Q2-Q3).

Expected classifier output: `mixed`. There IS a real diagnosis here (high-value users come through campaign planning; new users don't find it). But the response is a feature list without naming the guiding policy (e.g., "make campaign planning the entry point for all new accounts") as a standalone statement. Borderline between mixed and strategy — on the mixed side because the policy is implicit.
