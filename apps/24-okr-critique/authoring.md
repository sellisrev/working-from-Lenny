---
app-id: 24
app-name: OKR Critique
content-type: authored-content
updated: 2026-05-17
authored-by: autonomous-routine
---

# Authored content — #24 OKR Critique

Items from the `## Autonomous-routine backlog` in `prompt.md`.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `okrs.md` | YES | No change |
| `goal-setting.md` | NO | Substitute: `okrs.md` (topic slug is "OKRs and goal-setting"; covers goal-setting comprehensively) |
| `cross-functional-collaboration.md` | NO | Substitute: `getting-buy-in.md` (closest real file covering cross-functional alignment and shared ownership) |
| `metrics-for-pms.md` | NO | Substitute: `north-star-metric.md` (covers measurable metrics definitions and measurability criteria) |
| `pm-pitfalls.md` | YES | No change |

Three substitutions logged to `UNCERTAIN_DECISIONS.md`.

### Skeptical-OKR view — corpus check

`okrs.md` surfaces the skeptical view explicitly:
- "OKRs as theater. Performative OKR cycles without real review produce no value."
- "When NOT to use OKRs: Pre-PMF, Very small teams, Highly reactive contexts."
- "Cascaded OKRs produce reactive teams, not strategic ones."
- "Tying personal comp to OKR completion produces sandbagging."

The corpus is not one-sided. The skeptical-stance prompt fragment can draw on `okrs.md` directly. No gap to document.

---

## Worked KR-critique examples (16 total, 4 per test)

### Test 1 — Outcome vs. Activity

**t1-ex-01** — FAIL (obvious activity)
KR: "Ship the redesigned onboarding flow by March 31."
Verdict: fail — outcome_vs_activity
Diagnosis: This KR measures a delivery event, not a change in user behavior. Shipping the redesign is an activity the team controls entirely; whether the redesign changes the user experience is not measured at all. A team can pass this KR by shipping a bad redesign on time.
Anchor: okrs.md — "Objective: qualitative, ambitious goal. Key Results: 3-5 measurable outcomes that, if achieved, mean the Objective is met."

---

**t1-ex-02** — PASS (clean outcome)
KR: "Reduce new user drop-off at step 3 of onboarding from 62% to 40% by end of Q2."
Verdict: pass — outcome_vs_activity
Diagnosis: Measures a change in the world (drop-off rate) caused by the team's work. The metric is specific (step 3), directional (reduce), quantified (62% → 40%), and time-boxed (Q2). The team can ship the redesign and still fail this KR if the redesign doesn't work.

---

**t1-ex-03** — BORDERLINE (delivery + outcome mixed)
KR: "Launch the redesigned onboarding flow with a 90-day activation rate of 55%."
Verdict: borderline — outcome_vs_activity
Diagnosis: The launch component is an activity; the 55% activation rate is an outcome. The KR is structured as a conditional outcome: if the launch happens and users activate at 55%, the KR passes. This is acceptable but the launch milestone creates a false gate — the team could hit 55% activation without launching the redesign (e.g., by improving another onboarding step). Consider splitting into a shipping milestone and a standalone outcome KR.

---

**t1-ex-04** — FAIL (activity with time pressure)
KR: "Complete 20 customer discovery interviews by end of Q1."
Verdict: fail — outcome_vs_activity
Diagnosis: Completing interviews is an activity. The KR measures the team's effort, not what they learned or what changed. A better KR: "Identify 3 repeating pain patterns across 15+ discovery interviews, validated in writing by Q1." That measures what discovery produced, not that discovery happened.

---

### Test 2 — Measurable

**t2-ex-01** — FAIL (no number, no instrument)
KR: "Improve customer satisfaction."
Verdict: fail — measurable
Diagnosis: No number, no baseline, no instrument. "Customer satisfaction" is a direction, not a metric. Even if the team has CSAT, this KR doesn't specify what the baseline is, what the target is, or which satisfaction instrument to use (CSAT, NPS, 5-star reviews).

---

**t2-ex-02** — PASS (number + instrument named)
KR: "Increase in-app CSAT from 3.8 to 4.3 (5-point scale) by end of Q3."
Verdict: pass — measurable
Diagnosis: Baseline (3.8), target (4.3), instrument (in-app CSAT, 5-point scale), and timeframe (Q3) are all specified. The team has one unambiguous question to answer at Q3 end: what does the in-app CSAT read?

---

**t2-ex-03** — FAIL (number present, instrument not instrumented)
KR: "Achieve an AI feature satisfaction score of 8/10 from users."
Verdict: fail — measurable
Diagnosis: A number is present (8/10) but the measurement instrument doesn't exist. The team has no in-product satisfaction survey for the AI feature. This KR can't be measured this quarter; it's a placeholder for a measurement system the team hasn't built yet. Either build the instrument in Q1 and make the measurement itself the Q1 KR, or drop this KR.

---

**t2-ex-04** — BORDERLINE (measurable but lagging)
KR: "Achieve a Q3 NPS of 55+."
Verdict: borderline — measurable (pass) but note
Diagnosis: NPS is measurable (55 is a clear target, standard instrument). Flag: NPS surveys are typically collected quarterly; if the team measures NPS at Q3 end, the result reflects behavior from Q2. The metric will pass the measurability test but is a lagging indicator — it cannot provide weekly feedback during Q3. Consider adding a leading input metric alongside.

---

### Test 3 — Single-Team-Fit

**t3-ex-01** — PASS (team owns the lever)
KR: "Reduce p50 search latency from 800ms to 200ms by Q2 end."
Verdict: pass — single_team_fit
Diagnosis: If the team owns search infrastructure, this KR depends only on work they can do. The metric is technical (latency), the instrument is clear (p50), and no cross-team dependency is required to move it.

---

**t3-ex-02** — FAIL (cross-team dependency)
KR: "Increase weekly active users by 25%."
Verdict: cross-team-dependency — single_team_fit
Diagnosis: WAU growth depends on acquisition (marketing), activation (product), and retention (product + customer success). A single team cannot own this KR without cooperation from multiple other functions. The team might own the activation component; splitting into "increase D1 activation rate from 28% to 40%" puts the KR back in one team's hands.

---

**t3-ex-03** — BORDERLINE (mostly owned, partial dependency)
KR: "Achieve 80% of enterprise accounts successfully completing the SSO setup flow by Q3."
Verdict: cross-team-dependency (flag) — single_team_fit
Diagnosis: The engineering team owns the SSO flow implementation. But "successfully completing" depends on customer success guiding accounts through setup, IT admins at customer companies making configuration changes, and the implementation timing being managed by a deployment team. The team influences the outcome; they don't own it. Consider: "Reduce SSO setup median time from 4 hours to 45 minutes" — a metric the engineering team can move directly.

---

**t3-ex-04** — FAIL (depends on a team that can say no)
KR: "Ship three integrations (Slack, Salesforce, HubSpot) certified and in production by Q4."
Verdict: cross-team-dependency — single_team_fit
Diagnosis: Third-party certification timelines (Salesforce's partner review, Slack's app review) are not controlled by the team. Even if the team builds the integrations, certification may take 6-12 weeks beyond the team's delivery. The team can commit to "three integrations submitted for certification by Q3" but cannot commit to "in production by Q4" without owning the partner relationship timeline.

---

### Test 4 — Too Many

**t4-ex-01** — PASS (tight set)
Objective: "Make our checkout experience the fastest in the category."
KRs: 1) Reduce checkout p50 from 45s to 20s. 2) Increase checkout completion rate from 72% to 85%. 3) Reduce cart abandonment at payment step from 28% to 15%.
Verdict: pass — too_many (3 KRs; within limit)
Diagnosis: Three KRs, all outcome-oriented, all tied to the same objective. The team has one clear job; three metrics give them three ways to know if they're winning.

---

**t4-ex-02** — FAIL (too many KRs per objective)
Objective: "Improve the new user experience."
KRs: 1) Reduce onboarding drop-off. 2) Increase D7 retention. 3) Improve help center satisfaction. 4) Reduce support tickets from new users. 5) Ship the onboarding redesign. 6) Increase feature discovery in first session. 7) Get NPS of 55+.
Verdict: fail — too_many (7 KRs; objective has too many)
Diagnosis: Seven KRs on one objective means the team is measuring everything related to new users, not the one or two things that matter most. Doerr's rule: "If you have nine, you have none." Pick the two or three KRs that best prove the objective was achieved; cut the rest.

---

**t4-ex-03** — FAIL (too many objectives at team level)
Objectives: 1) Improve new user activation. 2) Reduce churn. 3) Grow power-user base. 4) Ship AI feature. 5) Improve platform reliability.
Verdict: fail — too_many (5 objectives at team level; limit is 3)
Diagnosis: A team with five objectives this quarter is not focused. Which one do they work on when three have important work due the same week? Reduce to two or three objectives that form a coherent story: e.g., "1) Activate new users faster, 2) Retain them longer." Everything else is a backlog item.

---

**t4-ex-04** — PASS (org level, acceptable count)
Level: org
Objectives: 1) Win enterprise in the U.S. 2) Build the platform for third-party developers. 3) Hit $10M ARR.
Verdict: pass — too_many (3 objectives at org level; limit is 5)
Diagnosis: Three objectives at org level is tight and coherent. The three objectives are distinct (customer segment, platform, revenue), not overlapping. An org-level OKR set this focused is unusual and positive.

---

## Before/After rewrite exemplars

Six examples of bad KR → corrected KR + anchor quote.

**ba-01** — Activity → Outcome
Before: "Launch the mobile app by Q2."
After: "Achieve 10,000 monthly active users on the mobile app within 60 days of launch (by end of Q2)."
Anchor: okrs.md — "Key Results: 3-5 measurable outcomes that, if achieved, mean the Objective is met."
Note: The before-KR is a shipping milestone; it tells you nothing about whether the mobile app is delivering value. The after-KR retains a time component but measures user behavior.

---

**ba-02** — Unmeasurable → Measurable
Before: "Make the product more reliable."
After: "Reduce p99 error rate on the core API from 3.2% to below 0.5% by Q3 end."
Anchor: north-star-metric.md — "Active not aggregate. Specific to the product."
Note: "Reliability" is a direction, not a metric. The rewrite names the instrument (p99 error rate), the baseline (3.2%), the target (0.5%), the scope (core API), and the timeframe.

---

**ba-03** — Cross-team dependency → Owned outcome
Before: "Grow revenue by 20% this quarter."
After: "Expand 12 existing enterprise accounts to multi-department usage, from single-team to two or more active departments."
Anchor: okrs.md — "Why OKRs fail: Cascaded OKRs produce reactive teams, not strategic ones."
Note: Revenue is owned by the whole company, not a single team. The rewrite gives ownership to the team (account expansion via product breadth) while connecting to the revenue goal through an explicit mechanism.

---

**ba-04** — Too many KRs → Ruthless cut
Before: Objective "Improve platform reliability" with 6 KRs: (1) Reduce error rate. (2) Improve uptime. (3) Cut MTTR. (4) Reduce P1 incidents. (5) Improve monitoring coverage. (6) Ship incident retrospective process.
After: Same objective, 2 KRs: (1) Reduce p99 API error rate from 3.2% to 0.5%. (2) Reduce mean time to resolution for P1 incidents from 4h to 45min.
Anchor: okrs.md — "Too many KRs per Objective: 3-5 is the limit; 10 means the team isn't actually focused."
Note: KRs 5 and 6 are activities (monitoring coverage, retrospective process). KRs 3 and 4 overlap with the selected KRs. Cutting to the two highest-leverage outcomes creates focus.

---

**ba-05** — Vanity metric → Leading metric
Before: "Achieve 1 million total registered users."
After: "Increase weekly active users (core action completed) from 40,000 to 90,000 by Q4."
Anchor: north-star-metric.md — "Examples that fail: 'Total signups' or 'DAU' are weak NSMs. 'Weekly active users completing the core action' is stronger."
Note: Total registered users is a cumulative, backward-looking number that every team can hit by never cleaning the user database. WAU with a core-action qualifier measures genuine engagement.

---

**ba-06** — Aspirational → Grounded
Before: "Make [Product] the industry leader in AI-powered analytics."
After: "Have 3 or more independent analysts or industry reports cite [Product] in the AI-powered analytics category by Q4."
Anchor: okrs.md — "Bad strategy is 'fluff' — aspirational statements masquerading as analysis." (via good-strategy-rumelt.md overlap)
Note: "Industry leader" is unmeasurable and aspirational. The rewrite grounds it in a specific, verifiable outcome (analyst citation) that the team can influence directly through product, PR, and content.

---

## Sample OKR sets (golden-set evals)

Two sets per stance label — one that performs well under the stance, one that performs poorly.

### Orthodox stance

**orthodox-good** — passes the four tests, deserves the orthodox "repairable" read

> Objective: Accelerate new user time-to-value in the core product.
> KR 1: Reduce median time from signup to first "aha moment" action from 9 minutes to 4 minutes by end of Q3.
> KR 2: Increase D7 retention for users who complete the onboarding checklist from 42% to 60% by end of Q3.
> KR 3: Reduce new-user support tickets in the first 14 days from 1,200/week to 700/week by end of Q3.

Expected orthodox critique: All three KRs are outcome-based, measurable, and plausibly owned by a product team. KR 3 has a mild cross-team dependency (support volume is influenced by product quality but also support team capacity). The set is tight at 3 KRs; the objective is focused. Orthodox synthesis: "These are solid. KR 3 has a cross-team note; agree on the ownership split with support before locking it."

---

**orthodox-bad** — fails several tests; orthodox stance will still try to salvage

> Objective: Transform the user experience to be world-class.
> KR 1: Launch the new design system across all pages by Q2.
> KR 2: Improve user satisfaction (target: users should feel great about the product).
> KR 3: Reduce churn by making users happier.
> KR 4: Get design recognized externally (awards, mentions).
> KR 5: Increase NPS from 28 to 60.

Expected orthodox critique: KR 1 is an activity (launch = ship). KR 2 is unmeasurable (no number, no instrument). KR 3 is unmeasurable and an activity masquerading as an outcome. KR 4 is an activity (awards, mentions). KR 5 is measurable but is 32 NPS points in one quarter — a stretch that implies the team doesn't actually know what drives NPS. Orthodox synthesis: "These are fixable. Cut KRs 2 and 3 entirely (they're aspiration, not criteria). Rewrite KR 1 as an outcome (e.g., 'All 12 core pages migrated to the new design system with zero regression in task-completion rate'). Scale back NPS from 60 to 38 — a realistic stretch."

---

### Skeptical stance

**skeptical-good** — the skeptical lens praises this set for avoiding theater

> Objective: Find the one thing killing retention in month 2 and fix it.
> KR 1: Identify the single highest-impact cohort drop-off point in D30-D60 through analysis and 20 user interviews; documented with root cause by week 6.
> KR 2: Ship one focused fix for the identified drop-off; measure effect on D60 retention by end of Q3.

Expected skeptical critique: Two KRs, focused on one real problem, with a built-in diagnostic step before the intervention. The skeptical lens says: this is what OKRs are for — forcing a team to commit to finding and fixing one real thing, not a list of vague improvements. The set would survive even if Q3 finds that the root cause is in a partner system the team can't fix — the discovery itself passes KR 1.

---

**skeptical-bad** — the skeptical lens flags this as theater

> Objective: Drive excellence across all product dimensions.
> KR 1: Complete 3 cross-functional strategy workshops on product direction.
> KR 2: Achieve alignment on 2025 roadmap priorities with all stakeholders.
> KR 3: Present a product vision document to leadership and get sign-off.
> KR 4: Establish a quarterly OKR review cadence.

Expected skeptical critique: Every KR is an activity. Nothing will be different in the world because this team hit these KRs — no user will behave differently, no metric will move. KR 4 is recursive (using OKRs to set an OKR about OKRs). Skeptical synthesis: "Three of these wouldn't survive a real conversation about why they exist. The question is whether you keep them at all. Drop KRs 1, 3, and 4. Rewrite KR 2 into a specific decision: 'By Q2 end, the team has locked the two bet-level priorities for 2025, communicated to engineering, and agreed on owner per priority.' That's a commitment; your current KR 2 is a meeting."

---

### Hybrid stance

**hybrid-mixed-01** — a realistic messy team OKR set; hybrid analysis separates what to keep vs. drop

> Objective: Make [Product] the obvious choice for mid-market buyers.
> KR 1: Close 15 net-new mid-market deals (ACV $20K-$100K) in Q3.
> KR 2: Reduce sales cycle for mid-market from 90 days to 60 days.
> KR 3: Publish 3 mid-market case studies and get 500 LinkedIn impressions per post.
> KR 4: Ship 2 mid-market-specific features (SSO, custom roles) by Q3 end.
> KR 5: Achieve a win rate of 40%+ on competitive mid-market deals.

Expected hybrid analysis:
- KR 1: Mostly owned by sales, not product. Orthodox says flag the dependency; skeptical says this isn't a product KR at all.
- KR 2: Owned jointly by sales and product (product can reduce time-to-value in trial; sales controls their process). Orthodox: split ownership; skeptical: ambiguous KRs die in org politics.
- KR 3: LinkedIn impressions are a vanity metric. Orthodox: replace impressions with "3 case studies live and referenced in at least 2 active deals." Skeptical: drop.
- KR 4: Activities (ship features) not outcomes. Orthodox: rewrite as "SSO and custom roles adopted by 80% of new mid-market accounts within 30 days of launch." Skeptical: cut both; they're a roadmap, not an OKR.
- KR 5: 40% win rate is an outcome. Orthodox: keep. Skeptical: keep — this is the only real KR in the set.

Hybrid synthesis: "If you keep OKRs, keep KR 5 (win rate) and KR 2 (sales cycle, with joint ownership written into the KR). Rewrite KR 4 as adoption outcomes. Drop KRs 1 and 3. If you don't, kill KRs 1, 3, and 4 entirely — they're either someone else's metric or vanity."

---

**hybrid-mixed-02** — org-level OKR set with cross-team coherence issues

> Objective 1 (Growth team): Grow monthly active users by 30%.
> KR 1.1: Increase new user signups from 8,000 to 12,000/month by Q4.
> KR 1.2: Improve D30 retention from 35% to 50% by Q4.

> Objective 2 (Product team): Deepen engagement for power users.
> KR 2.1: Increase weekly active users in the top decile from 4,000 to 7,000 by Q4.
> KR 2.2: Launch advanced analytics feature; achieve 40% adoption among power users by Q4.

> Objective 3 (Platform team): Make the product reliable at scale.
> KR 3.1: Reduce p99 API latency from 1.2s to 400ms by Q4.
> KR 3.2: Achieve 99.9% uptime for the quarter.

Expected hybrid analysis: 
- Coherence issue: Objective 1 KR 1.2 (D30 retention) depends on product work that Objective 2 is doing (deeper engagement, new features). Neither team is explicitly coordinating on the D30 retention KR. The growth team is claiming a KR that product work heavily influences.
- Potential conflict: Growth team (Obj 1) wants more new users (KR 1.1); platform team (Obj 3) is building for scale (KR 3.1/3.2) but hasn't scoped how much scale. If the growth team succeeds (50% more signups), does the platform team's latency target still hold?
- Hybrid synthesis: The orthodox lens says these are fine per-team; the skeptical lens says KR 1.2 (retention) should be jointly owned by growth + product, written into the KR explicitly. The platform team should have a KR tied to supporting Objective 1's growth target, not a standalone reliability KR that might be decoupled from actual load.
