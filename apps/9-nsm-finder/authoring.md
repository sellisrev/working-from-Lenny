---
app-id: 9
app-name: North Star Metric Finder
content-type: authored-content
updated: 2026-05-17
authored-by: autonomous-routine
---

# Authored content — #9 North Star Metric Finder

Items from the `## Autonomous-routine backlog` in `prompt.md`.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `north-star-metric.md` | YES | No change |
| `activation-metric.md` | YES | No change |
| `growth-loops.md` | YES | No change |
| `pm-pitfalls.md` | YES | No change |

Named-author cross-check:
| Author | Corpus presence | Action |
|---|---|---|
| Sean Ellis | Present (growth-loops.md, product-market-fit.md, product-led-growth.md, hiring-for-growth.md) | No change |
| Hila Qu | Present (product-led-marketing.md, gtm-motions.md, product-led-growth.md, bottom-up-saas.md) | No change |
| Andrew Chen | Present (growth-loops.md: Atomic Network / The Cold Start Problem) | No change |

No substitutions needed.

---

## Worked candidate examples — all 6 business shapes

Three candidates per shape with full Pass 1 + Pass 2 content. Used as few-shot examples for the LLM.

### Shape: B2C-subscription

**candidate-b2cs-01**
Name: `weekly active minutes in core experience`
Rationale: For a subscription product where value is recurring engagement, the metric must capture whether users are actually using what they pay for. Active time in the core experience (not loading screens or settings) is specific to the product's value promise. It leads churn by 4-6 weeks — a drop in engagement minutes is visible well before a cancellation event.
vanity_risk: Time-in-product can be inflated by bugs, slow performance, or confusing UX that keeps users stuck. Verify that active minutes correlate positively with renewal, not just with use.
leading_or_lagging: Leading by 4-6 weeks on churn. The risk is that it lags new-value-discovery — a user who has learned everything and isn't growing will plateau before leaving.
gameability: Push teams to ship more content or features without improving the core loop, simply to give users more to do. Engagement minutes go up; product quality does not.
what_could_break_this: A competitor ships a feature that collapses the "core experience" into half the time. Engagement minutes drop even as user satisfaction rises.
Input metrics: first-week active minutes → week-2 return rate; features-used in first session; median session length; D7 → D30 engagement retention curve.

---

**candidate-b2cs-02**
Name: `weekly retained subscribers completing habitual action`
Rationale: Subscriptions live or die on habit. This metric counts subscribers who took the product's core recurring action (listening, reading, working out, journaling) in a given week. It is upstream of churn — users who skip the habit for 2+ weeks rarely renew. It filters out "I paid but forgot" subscribers who distort simpler DAU counts.
vanity_risk: Low risk if the action is meaningful; high risk if the action threshold is set too low (e.g., any tap counts as "habitual action").
leading_or_lagging: Leading on renewal by 3-4 weeks. Lags on satisfaction — a user can complete the habitual action unhappily.
gameability: Notification campaigns that drive users to tap the app without delivering value. Metric rises; renewal does not.
what_could_break_this: A seasonal product sees natural habit-drop in off-seasons (fitness apps in December). The metric falls even when users are satisfied and will return.
Input metrics: new subscriber → first habitual action in week 1; D7 retained rate for habitual-action completers vs. non-completers; weekly habit completion streak distribution.

---

**candidate-b2cs-03**
Name: `D30 active subscribers on paid plan`
Rationale: For freemium-to-paid subscriptions, the real north star is whether users convert and stay. D30 active paid is the combination of conversion and 30-day retention, catching both acquisition quality and early-churn risk in a single number. It avoids the trap of optimizing free-tier engagement that never converts.
vanity_risk: Medium — doesn't capture whether paying users are getting value beyond the first month. NDR or D90 would capture more of the value story.
leading_or_lagging: Lagging on the conversion decision (users decide in week 1-2 whether they'll pay); leading on long-term churn signals.
gameability: Aggressive trial-end prompts (e.g., free-tier feature removal) that force conversions without creating genuine value attachment. D30 paid rises; D90 paid collapses.
what_could_break_this: A billing change that delays or obscures the first charge. Apparent improvement in D30 active paid is actually measurement lag, not a real signal.
Input metrics: trial-to-paid conversion rate; D1 / D7 activity for new paid subscribers; feature depth at D14 (breadth of core features used); early cancellation rate (D1-D7 after first charge).

---

### Shape: B2C-transactional

**candidate-b2ct-01**
Name: `repeat buyers in 90-day window`
Rationale: For transactional B2C (e-commerce, food delivery, travel), one-time purchase is not a business; repeat is. This counts buyers who returned within 90 days, making it specific to the repeat-purchase behavior that drives LTV. It distinguishes the customers worth acquiring from one-time opportunists.
vanity_risk: Low. Repeat purchase is hard to inflate without genuine value delivery. A coupon campaign that drives repeat buying is acceptable — you've still retained the buyer.
leading_or_lagging: Coincident with LTV; slightly leading on churn for subscription-free transactional products.
gameability: Promotional campaigns (heavy discounting) that drive repeat purchases artificially. 90-day repeat rate rises; unit economics deteriorate.
what_could_break_this: A category with natural 6-month purchase cycles (furniture, major appliances). The 90-day window is wrong for the product; the metric systematically underreports the actual repeat rate.
Input metrics: first-purchase → second-purchase interval distribution; D30 / D60 / D90 repeat rates by acquisition cohort; order frequency for repeat buyers; coupon dependency rate.

---

**candidate-b2ct-02**
Name: `weekly order frequency per active buyer`
Rationale: For high-frequency transactional products (food delivery, rideshare, grocery), the NSM is not whether users come back but how often. Order frequency per active buyer reflects habit formation and wallet share capture. Users who order twice a week are worth 4× those who order twice a month; this metric captures that difference.
vanity_risk: Can be inflated by one-time events (large group orders, holiday spikes). Measure as a cohort rolling average, not a point-in-time snapshot.
leading_or_lagging: Leading on LTV by 4-8 weeks; coincident with churn risk.
gameability: Promotional pressure (push notifications, flash discounts) that drives orders without building genuine habit. Frequency rises; promotional dependency rises with it.
what_could_break_this: A supply disruption (restaurant closures, driver shortage) that artificially suppresses frequency. The metric drops even as demand is unaffected, misleading the team into corrective product actions that aren't needed.
Input metrics: weekly orders per active buyer (median and distribution); gap between order 1 and order 2; promo-attributed vs. organic order share; session-to-order conversion rate.

---

**candidate-b2ct-03**
Name: `monthly revenue per returning customer cohort`
Rationale: For transactional B2C with significant acquisition costs, cohort revenue is the cleanest view of whether the retained base is generating enough to justify the acquisition spend. It is the leading indicator of payback period and the clearest signal that transactional frequency and average order value are both moving in the right direction.
vanity_risk: Higher risk if product is seasonal — cohort revenue can look healthy in-season and collapse out-of-season without signaling a problem. Normalize for seasonal patterns.
leading_or_lagging: Lagging by 30-60 days on user behavior changes; leading on profitability by 90+ days.
gameability: Upsell campaigns that inflate average order value once without recurring. Revenue looks good for one cohort month; the next month reveals the pull-forward.
what_could_break_this: A pricing change or competitor promotion that shifts price sensitivity. Cohort revenue drops in the short term even as the product's value hasn't changed.
Input metrics: monthly cohort revenue by acquisition channel; average order value trend; order frequency trend; gross margin per cohort.

---

### Shape: B2B-PLG

**candidate-b2bplg-01**
Name: `weekly active teams using three or more core features`
Rationale: B2B-PLG succeeds when teams, not individuals, adopt the product as a workflow dependency. This metric counts teams (not just users) who are using multiple core features — depth matters more than breadth. It predicts net dollar retention and is the primary leading indicator for expansion revenue.
vanity_risk: Low if "core features" is defined tightly. High if the definition is expanded to include setup or admin actions that aren't real product use.
leading_or_lagging: Leading on NDR by 6-12 weeks. Lagging on deal risk — a team that's already using three features and is still not renewing is a late signal.
gameability: Engineering incentivized to ship more "core features" to game the 3+ threshold. Volume of features rises; product coherence falls.
what_could_break_this: A competitor ships a competing integration that replaces one of the core features. Teams drop to 2-feature usage; the NSM falls even though product value for the remaining features hasn't changed.
Input metrics: team-level feature adoption depth (1 / 2 / 3+); weekly active users per team (expansion proxy); team retention at 3-feature vs. 1-2-feature users; time-to-3rd-feature-adoption for new teams.

---

**candidate-b2bplg-02**
Name: `product-qualified teams reaching activation milestone`
Rationale: In a PLG motion, the critical inflection is when a free or trial team hits the specific configuration milestone that predicts conversion. Counting PQTs (product-qualified teams) per week is the most actionable NSM for a PLG company because it directly measures the pipeline-creation rate without requiring sales touch. Andrew Chen's Atomic Network framing applies: measure from the point where the network is self-sustaining.
vanity_risk: Moderate. PQL/PQT definitions are often set too loosely at first, capturing teams that don't actually convert at the predicted rate. Requires periodic re-calibration against conversion data.
leading_or_lagging: Leading on pipeline by 3-6 weeks; leading on ARR by 6-12 weeks.
gameability: Lowering the activation-milestone definition to inflate PQT count. Conversion rates drop; the team doesn't realize the metric has been degraded.
what_could_break_this: A change in the free-tier limits (e.g., adding a seat ceiling) that suppresses team exploration before the activation milestone. PQT count falls; the business fundamentals are unchanged.
Input metrics: new teams reaching activation milestone per week; activation milestone rate (teams activated / teams signed up); days to activation; conversion rate from PQT → paid; PQT by acquisition channel.

---

**candidate-b2bplg-03**
Name: `weekly active seats in paying accounts`
Rationale: For seat-based PLG businesses, the NSM captures whether paying accounts are actually expanding usage. An account can be "retained" while shrinking; weekly active seats tracks both retention and expansion simultaneously. It predicts net dollar retention more directly than account count alone.
vanity_risk: Medium. Counting any active seat (including admin-only users) inflates the metric. Define "active" as taking at least one core-action per week.
leading_or_lagging: Coincident with NDR; leading on expansion ARR by 4-8 weeks.
gameability: Seat-license sales team pressures accounts to add seats without enabling them. Active-seat count remains low; seat count rises. Track active seat rate, not just seat count.
what_could_break_this: A customer decides to restructure their team and reduces seat count even while increasing usage intensity per user. The metric falls; the customer relationship is actually healthy.
Input metrics: active seats per account (median); active-seat growth rate in accounts > 6 months old; expansion seat adds per cohort; churn rate by initial active-seat level.

---

### Shape: B2B-sales-led

**candidate-b2bsl-01**
Name: `product-touched accounts in pipeline with usage signal`
Rationale: In a sales-led motion, the biggest risk is a stalled pipeline that lacks usage evidence. This metric counts accounts in the sales pipeline where at least N users have active product usage — the number that makes a "land and expand" motion credible. It predicts close rate more reliably than pipeline value alone.
vanity_risk: Medium. Can be gamed by sales reps who give out extra trial seats to inflate usage numbers before a deal review. Track usage per paying seat, not per gifted seat.
leading_or_lagging: Leading on close rate by 2-4 weeks. Lagging on deal quality — usage doesn't tell you whether the account values the product at the contracted price.
gameability: Sales team pushes prospects to sign up for trial seats without genuine use, to hit the "usage signal" threshold before board reviews.
what_could_break_this: A procurement freeze at enterprise accounts means even genuinely interested buyers pause usage. Product-touched accounts with usage drops; the business development pipeline is actually healthy.
Input metrics: pipeline accounts with active usage per week; active users per pipeline account; usage-signal accounts → closed rate; average usage depth at close (features used, sessions per user).

---

**candidate-b2bsl-02**
Name: `net dollar retention in accounts over 12 months`
Rationale: For scaling B2B-sales-led businesses, NDR is the corpus-canonical north star for the growth stage. It captures retention, expansion, and contraction in one number. A B2B-sales-led company with NDR > 110% grows from its existing customer base alone; below 90%, no amount of new sales compensates.
vanity_risk: Low. NDR is hard to inflate without genuine value delivery and real expansion revenue.
leading_or_lagging: Lagging by 12 months on the root-cause behaviors (product adoption, stakeholder change, competitive pressure). Leading on the revenue model by 12-24 months.
gameability: Expanding accounts with discounted additional seats that don't get used. NDR rises for one cohort; churn risk in the expansion cohort rises for the next.
what_could_break_this: A macro economic downturn that triggers budget freezes industry-wide. NDR drops even as product value and competitive position are unchanged. Misleads the team into product-side responses to an economic problem.
Input metrics: gross dollar retention; expansion revenue per cohort; contraction rate by account tier; upsell motion conversion rate; executive-sponsor stability (change in primary contact).

---

**candidate-b2bsl-03**
Name: `multi-team accounts with product-embedded workflows`
Rationale: Enterprise expansion follows team-by-team adoption. Counting accounts where the product is embedded in workflows across multiple teams (not just one pilot team) is the leading indicator of contract expansion and churn resistance. A single-team account churns easily; a cross-functional account does not.
vanity_risk: Medium. "Embedded in workflows" needs a precise definition — at least N recurring automated actions per week per team, not just logins.
leading_or_lagging: Leading on expansion ARR by 2-3 quarters; leading on churn risk by 6-9 months.
gameability: Customer success teams count tool configurations as "embedded workflows" even if actual usage is minimal. Define with usage thresholds, not configuration states.
what_could_break_this: An org restructuring at a key customer collapses multi-team usage into a single team without a business-value change. The NSM falls; the account relationship is not at risk.
Input metrics: accounts with 2+ active teams using product; workflow embedding rate (automated actions per team per week); expansion ARR in multi-team vs. single-team accounts; churn rate by team-count tier.

---

### Shape: marketplace

**candidate-mp-01**
Name: `matched transactions per week (both sides completing)`
Rationale: Marketplace north stars must be bilateral — a successful transaction requires both supply and demand to show up. Counting matched transactions captures both. Airbnb's "nights booked" is the canonical example: it requires supply (listed property), demand (booked guest), and successful exchange. Unmatched listings or unbooked guests are waste.
vanity_risk: Low. Matched transactions are hard to inflate; they require both sides. A fake transaction is fraud, not a metric problem.
leading_or_lagging: Coincident with GMV; slightly leading on liquidity health.
gameability: Teams optimize for transaction volume without quality. Matched transactions rise; review scores fall; eventual trust collapse. Add a quality floor alongside.
what_could_break_this: A supply constraint (e.g., regulations limiting new listings, driver supply dropping) reduces matches even as demand is strong. The NSM falls; the problem is supply-side, not product-side.
Input metrics: supply utilization rate (available supply that transacts in a given period); demand-side conversion (search/browse → transaction); bilateral satisfaction rate (both sides complete without dispute); repeat-transaction rate.

---

**candidate-mp-02**
Name: `gross transaction value from repeat buyers in 30 days`
Rationale: For marketplaces where trust and quality drive repeat behavior, GTV from returning buyers is a stronger NSM than total GTV (which is dominated by one-time buyers who may never return). It measures whether the marketplace has delivered enough value to earn a second transaction. At scale, repeat GTV predicts margin expansion because CAC is zero for returning buyers.
vanity_risk: Medium. GTV can be inflated by a small number of high-value repeat buyers. Track buyer count alongside GTV to catch concentration risk.
leading_or_lagging: Leading on long-term revenue by 2-3 quarters; lagging on satisfaction (satisfied buyers return; you only know after the fact).
gameability: Loyalty programs that force repeat transactions (points expiration, required minimum spend). GTV from repeat buyers rises; the loyalty is to the program, not the marketplace.
what_could_break_this: A macro shift (e.g., a recession) that compresses buyer discretionary spend. Repeat GTV falls across all marketplace categories regardless of product quality.
Input metrics: repeat-buyer rate (D30, D90); average order value for repeat vs. new buyers; supply quality score for repeat-buyer orders; buyer NPS by transaction number.

---

**candidate-mp-03**
Name: `weekly supply utilization rate`
Rationale: For marketplaces constrained by supply (short-term rental, gig labor, specialty services), the north star is supply efficiency. A supply side that is fully utilized week-over-week signals that demand is strong and the marketplace is clearing efficiently. A supply side with 40% idle capacity signals a matching or demand problem regardless of total GMV.
vanity_risk: Low. Utilization is structural — you can't inflate it without real transactions.
leading_or_lagging: Coincident with GMV; leading on supply attrition (underutilized supply leaves the platform).
gameability: Narrowing the definition of "available supply" to exclude offline or inactive supply, making utilization look higher than it is. Track against the full supply pool, not just "active" listings.
what_could_break_this: New supply influx (e.g., an incentive campaign bringing in many new listings) that temporarily drops utilization without a demand problem.
Input metrics: available supply units vs. transacted supply units; idle supply by cohort (days since last transaction); supply-side churn at different utilization rates; demand conversion rate to supply contact.

---

### Shape: prosumer

**candidate-pro-01**
Name: `weekly deep-work sessions by power users`
Rationale: Prosumer products create value when expert users do serious, sustained work in them. Counting sessions that exceed a depth threshold (N minutes + core feature usage) for users in the top-quartile cohort tells you whether the product is genuinely serving its most valuable segment. Casual usage from non-power users is noise in this metric.
vanity_risk: Low if "deep-work session" is defined by action depth, not just time. High if any long session counts regardless of what the user did.
leading_or_lagging: Leading on expansion and word-of-mouth from power users. Lagging on satisfaction.
gameability: Product ships features that extend session length without adding expert value (e.g., additional loading states, mandatory tutorials). Session time rises; task completion quality does not.
what_could_break_this: Power users move to a faster, AI-assisted workflow that shortens session length while increasing productivity. Deep-work sessions fall; the product is actually more valuable.
Input metrics: top-quartile user session depth (actions per session); power-user weekly retention; feature depth used by power users vs. casual users; power-user → paid conversion rate.

---

**candidate-pro-02**
Name: `creations published or exported per power user per month`
Rationale: Prosumer products deliver value through output — designs, documents, analyses, code. Counting published or exported artifacts per power user per month is the clearest proxy for value delivered. It answers: are experts using this tool to produce real work? Exports also carry distribution value (each exported file is a potential word-of-mouth touchpoint).
vanity_risk: Medium. Low-quality or template-cloned exports inflate the metric. Consider filtering for original creations vs. template copies, or tracking downloads/uses of the exported artifact.
leading_or_lagging: Coincident with user satisfaction; leading on word-of-mouth (exported artifacts reach non-users).
gameability: Surface templates prominently to drive exports without requiring real creative work.
what_could_break_this: A new version of the product makes creation faster but reduces export frequency (e.g., more work stays in-app, less needs to be exported). Metric falls; value is actually higher.
Input metrics: exports per power user (monthly); original-creation share of exports; export-to-downstream-use rate; new user creation rate (are new users becoming power users?).

---

**candidate-pro-03**
Name: `power-user share of weekly active users`
Rationale: For prosumer products, the ratio of power users to all active users tells you whether the product is staying focused on its high-value segment or diluting toward casual use. A healthy prosumer product should maintain or grow its power-user share — dilution toward casual users signals category-creep. This is a composition metric rather than a volume metric.
vanity_risk: Low as a ratio. Can look stable while the total base shrinks. Track alongside absolute power-user count.
leading_or_lagging: Leading on premium ARPU and word-of-mouth; lagging on the decisions (pricing, features) that attracted casual vs. power users.
gameability: Define power-user threshold loosely to inflate the share. Requires periodic re-calibration against actual product-value-delivery metrics.
what_could_break_this: A viral campaign that brings in large numbers of casual users. Power-user share drops mathematically even as the power-user base stays healthy.
Input metrics: power-user definition threshold (recalibrated quarterly); power-user weekly count; casual-to-power conversion rate (D30, D90); power-user churn rate.

---

## Dashboard-audit exemplars

Ten labeled examples of the metric_name → verdict mapping for Pass 4.

| metric_name | verdict | one_line_why |
|---|---|---|
| Total page views | vanity-replace | Aggregate views with no behavioral signal; inflated by bots and misclicks; says nothing about whether users got value. |
| Total signups (all-time) | vanity-replace | Cumulative, not active; includes users who signed up and never returned; provides no actionable signal. |
| Free trial starts this week | vanity-replace | Demand for free trials is an acquisition metric, not a value-delivery metric; doesn't distinguish users who activate from those who immediately churn. |
| D30 active users (core action) | closest-to-NSM | Time-based retained activity on the core action is the standard NSM shape — if the core action is defined tightly, this is a strong candidate. |
| Cohort net dollar retention (12-month) | closest-to-NSM | For B2B-sales-led or subscription, NDR is corpus-canonical as a north star candidate; leads revenue by 12 months. |
| Trial-to-paid conversion rate | useful-input | A key funnel metric and activation proxy, but not a north star — it doesn't capture what happens after conversion. |
| D7 retention by activation cohort | useful-input | Leading indicator for long-term retention; strong input metric for diagnosing the activation-to-habit path, but not the NSM itself. |
| Weekly active paying users | closest-to-NSM | Paid + active = genuine value delivery; for subscription businesses this is the canonical NSM shape (revenue filtered through engagement). |
| Total features enabled | vanity-replace | Configuration state, not usage; a user can enable 12 features and use none of them; says nothing about value delivery. |
| Net Promoter Score (quarterly) | useful-input | Satisfaction proxy; lagging by 30-90 days; useful as a quality check on the NSM but too infrequent and too late to serve as the primary star. |

---

## Synthetic business descriptions (golden-set evals)

Six descriptions — one per business shape — with expected NSM candidates and likely gaps.

**golden-nsm-01** — B2C-subscription
> A personal finance education app. Users subscribe monthly to access video courses, budgeting templates, and an AI-powered "money coach" chat feature. Paying subscribers access all content; free users see the first lesson only. Primary user action: completing a module and getting a coaching check-in within the same week. Most users churn in month 3 if they haven't completed their first financial goal (debt payoff plan or savings milestone).

Expected NSM candidates: weekly modules completed by paying subscribers; D30 coaching-check-in rate for active subscribers; paying subscribers with a completed financial goal.
Likely weak NSM: "monthly active subscribers" (doesn't capture whether they're using the product meaningfully before churn).

---

**golden-nsm-02** — B2C-transactional
> An on-demand laundry pickup service in three cities. Users schedule a pickup via app; a driver collects, a facility cleans, a driver returns within 48 hours. Revenue per order is fixed. Users who order more than once in 90 days have 3× the LTV of one-time users. Most first-time users try the service for a special occasion (moving, event) rather than routine need.

Expected NSM candidates: repeat orders within 90 days per active user; orders per active buyer per month; monthly GMV from returning customers.
Likely weak NSM: "total orders" (dominated by one-time users who never return).

---

**golden-nsm-03** — B2B-PLG
> A collaborative data analysis tool. Teams sign up for free; any user can invite colleagues. Activation milestone: a team with 3+ members sharing a dataset and running a query together within the first week. Paid plans unlock higher row limits and SSO. Most expansion comes from teams that hit the activation milestone and add seats organically without sales.

Expected NSM candidates: weekly active teams at or past activation milestone; product-qualified teams (3+ members with shared dataset + query) per week; weekly active seats in paying accounts.
Likely weak NSM: "total registered users" (includes inactive individuals who signed up and never added teammates).

---

**golden-nsm-04** — B2B-sales-led
> An enterprise compliance management platform. Deals are mid-market to enterprise ($30K-$500K ACV). Sales-led motion with 90-day average sales cycle. Average customer has 3-5 departments using the platform after 12 months. Biggest risk is single-department usage that stalls before cross-functional expansion.

Expected NSM candidates: multi-department accounts (2+ active departments); NDR at 12 months; pipeline accounts with active usage signal across 2+ departments.
Likely weak NSM: "number of active users" without departmental segmentation (a single-department account with 50 users looks healthy but is churning).

---

**golden-nsm-05** — marketplace
> A freelance design marketplace. Clients post briefs; designers submit proposals; clients hire. A successful match is a brief with at least one completed deliverable and a 4+ star rating from the client. Designers who complete 3+ projects in the first 90 days have high retention; most churn happens after 1 project. Clients who hire twice in 90 days have 5× the LTV of one-time hirers.

Expected NSM candidates: completed projects with 4+ star rating per week; bilateral retention rate (designers with 3+ projects in 90 days; clients with 2+ hires in 90 days); matched transactions per week.
Likely weak NSM: "total proposals submitted" (supply-side vanity; lots of proposals without matches means the marketplace isn't clearing).

---

**golden-nsm-06** — prosumer
> A video editing tool for professional YouTubers and independent filmmakers. Free tier allows 720p export; paid ($25/mo) unlocks 4K export and advanced color grading. Power users (200+ hours edited per month) drive 80% of word-of-mouth. Casual users rarely convert to paid. Primary value moment: exporting a final cut.

Expected NSM candidates: 4K exports per paying user per month; deep-editing sessions per power user per week; power-user share of weekly active editors.
Likely weak NSM: "total exports" (dominated by casual 720p exports that don't predict paid conversion or LTV).
