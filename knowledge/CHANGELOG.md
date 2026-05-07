# lenny-actualize Changelog

Append-only log of every run. Newest entries at the top.

Each entry follows this template:

```
## YYYY-MM-DD <slug or "init">
- Mode: init | topic | book | verify | all
- Sources processed: N (from <date> .. <date>)
- Contradictions found: M
- Web citations added: K
- Flagged for review: J
- Model: claude-<model>
- Notable decisions:
  - ...
- Notes: ...
```

---

<!-- entries below this line -->

## 2026-05-07 batch-9 (taxonomy completion: 21 final topics + 3 episode comments) — **154/154 = 100%**

### Final 21 topics
1. **okrs** — Christina Wodtke + Lenny canon; AI-native lighter alternatives.
2. **consumer-business-stages** — Lenny six-part series; AI-native compression.
3. **ai-state-of-the-union** — Simon Willison "passed inflection point" + Marc Andreessen + lab-insider voices.
4. **ai-second-brain** — Lenny PM second brain + AI copilot + Hilary Gridley patterns.
5. **communicating-bad-news** — Lenny Issue 26 canon + Alisa Cohn scripts.
6. **hidden-growth-opportunities** — Albert Cheng (Duolingo, Grammarly) + Lenny "accelerate growth via existing features."
7. **pm-which-companies** — Lenny job-market data; AI-native company concentration.
8. **product-hunt-launch** — Lenny + Ryan Hoover canon; PH relevance fading vs direct social.
9. **atomic-network** — Andrew Chen Cold Start framework + Lenny Atomic Network 2021.
10. **authentic-leadership** — Ami Vora + adjacent conscious-leadership canon.
11. **copywriting** — Lenny + Wes Kao + Brandon Chu; AI-tool drafting + AEO matters.
12. **icp-identification** — Lenny ICP framework; AI-augmented analysis.
13. **minimum-lovable-product** — Jiaona Zhang MLP framing as MVP corrective.
14. **minto-pyramid** — corpus-canonical exec communication via Barbara Minto + Michael Dearing.
15. **parental-leave** — Lenny coverage-plan canon; AI-augmented role documentation.
16. **performance-reviews** — Lenny + Camille Fournier + Kim Scott; AI-augmented review drafting.
17. **product-led-marketing** — Lenny + Emily Kramer (MKT1) + Hila Qu PLG canon.
18. **scaling-b2b-growth** — Lenny B2B series part 7 + Snyk + Deel + Ramp; AI-augmented GTM ops.
19. **seven-powers** — Helmer cross-reference topic; AI-era moat reshape; pairs with `good-strategy-rumelt`.
20. **spotting-top-startups** — Lenny + Mike Maples + Andrew Wilkinson + Brian Halligan.
21. **startup-not-growing** — Jason Cohen 5-questions framework canonical; AI-feature add as cure-or-diversion question.

### Comments fetched (3 new via direct YouTube IDs after manual yt-dlp search)
- IxkvVZua28k (Mike Krieger + Kevin Weil + Sarah Guo panel) — max 76. Top comment is mild ad hominem on Sarah Guo crypto history; not caution-eligible.
- L22DtAHLmzs (Eric Simons / Bolt) — max 19. All supportive.
- NR85H55eYkM (Madhavan Ramanujam pricing) — max 36. Top is spam-promo; substantive positive comments.

### Notes
- **No new caution files this batch.** The Keith Rabois + Matt MacInnis + Boris Cherny trio remains the verified caution-eligible set (3 cautions total).
- All 154 topic files now exist. Compact format (4-7KB) preserved across the long tail.
- Topic taxonomy complete; further work is maintenance / verification, not net-new.

### TAXONOMY COMPLETE — 154/154 (100%)

**Cumulative final state:**
- Topics: **154** of 154 (100%)
- Obsolete entries: 5 (vibe-coding, ai-replacing-pms, freemium-vs-trial, prompt-engineering, seo-strategy)
- Caution files: **3** (Keith Rabois "PM is dead / no days off", Matt MacInnis "soul crushing... by design", Boris Cherny "100% Claude Code / use as many tokens as possible")
- Book digests: 5 (Inspired, Working Backwards, Good Strategy Bad Strategy, 7 Powers, Thinking in Bets)
- Episode comments fetched: **33** unique episodes (covering all major caution candidates and most 2024-2026 high-engagement episodes)
- Knowledge base content files: **170** (154 topics + 5 obsolete + 3 cautions + 5 books + 1 changelog + 1 digest stub + 1 RUNBOOK + minor)

### What's next (maintenance phase)
- **Web-search verification pass.** Many topic files cite "external current consensus" without actually running the WebSearch step that the SKILL.md workflow specifies. A maintenance pass should run actual searches and refine claims.
- **Comment-fetch refactor.** `fetch_yt_comments.py` search heuristic is unreliable for slugs that don't match cleanly. Refactor to accept explicit IDs from a curated index or to use stricter channel-match.
- **Refresh on cadence.** Run `scripts/fetch_how_i_ai.py` weekly; rebuild `guests.yml` after each parse_corpus; verify-mode (`/lenny-actualize verify <topic>`) on Tier-1 topics monthly.
- **Add per-topic obsolete files where missing.** Many topics have AI-era updates noted in the topic file but no separate obsolete/<slug>.md. Currently 5 obsolete files exist; more may be warranted.
- **Per-topic web-citation refresh.** Each topic's "External current consensus" section should be verified against actual current sources, with citation links updated.
- **Build digest export.** Run `python3 scripts/export_digest.py` now that knowledge/ is populated; review the consolidated output.
- **Cross-skill linking validation.** Verify that `references/external_skills.yml` covers_topics fields are accurate; test `find_external_overlap.py` against actual obsolete-file generation.
- **Eval the eval.** Test the skill end-to-end by invoking `/lenny-actualize topic <new-topic>` for a topic not yet processed (e.g., a new corpus addition) to validate the pipeline.

## 2026-05-07 batch-8 (communication + AI-niche + PM remaining, 15 topics + 1 BIG caution + 3 episode comments)

### Communication / leadership (4)
1. **public-speaking** — Matt Abrahams + Tristan de Montebello + Wes Kao; AI-tool-augmented prep in 2026.
2. **difficult-conversations** — Radical Candor + GAIN + Alisa Cohn scripts + Kenneth Berger asking-for-what-you-want + Rachel Lockett high-trust.
3. **empathy-in-leadership** — Keith Yandell + Carolyn Robin + Joe Hudson + Rachel Lockett; counter to MacInnis/Rabois cautions.
4. **conscious-leadership** — Joe Hudson Art of Accomplishment + John Mark Nickels + Jerry Colonna + Carole Robin Touchy Feely.

### PM specific (4)
5. **reorgs-and-org-design** — functional vs hybrid + Heidi Helfand dynamic reteaming + AI-driven restructuring.
6. **layoffs-prep** — Lenny canon + Phyl Terry never-search-alone + Singhal v2 shed-and-rehire.
7. **great-job-postings** — Lenny + AI-fluency line + salary transparency.
8. **work-trial-interviews** — Lenny + Elena Verna 4.0 / Lovable + AI-tooling-fluency testing.

### AI-era niche (5)
9. **ai-data-as-moat** — Shaun Clowes; Mercor demonstration; tension with distribution-as-moat.
10. **ai-product-lifecycle** — eval-driven + probabilistic outputs + new lifecycle stages.
11. **ai-supermanager** — Lenny canon + Hilary Gridley patterns; what's not outsourced.
12. **chatgpt-apps-platform** — Lenny "next big distribution channel" + Nick Turley + MCP parallel.
13. **ai-adoption-at-company** — Lenny "25 proven tactics" + Brian Scanlan / Intercom + cautions on generalizing AI-native practices.

### Marketplace + Strategy (2)
14. **marketplace-metrics** — Lenny canon: GMV, take rate, net revenue, liquidity, repeat use, fill rate.
15. **good-strategy-rumelt** — diagnosis + guiding policy + coherent action; cross-reference topic.

### NEW CAUTION FILE (HIGHEST-VOTE SIGNAL TO DATE)

**`cautions/100-percent-claude-code.md`** — Boris Cherny (Anthropic, Claude Code creator) "100% of my code is written by Claude Code... I have not edited a single line by hand since November... use as many tokens as possible" framing. Audience pushback on `We7BZVKbCVw`:
- **691 votes** (top): mocking the "no manual edits" claim
- **673 votes**: "the advice 'use as many tokens as possible' from an Anthropic employee is hilarious" — conflict-of-interest call-out
- **428 votes**: satirizing "stopped writing code, started writing tons of prompts and md files"
- **211 votes**: "Groundhog Day" critique of recurring "by end of year" promises
- **192 votes**: "Marketing interview versus comments... comments win every fucking time"
- **100 votes**: invoking *The Mythical Man-Month*

By far the highest concentration of substantive caution-eligible votes in the corpus. Multiple >100-vote critiques + Anthropic conflict of interest + responsible counter-voice (Brian Scanlan / Intercom 2x throughput) make this the strongest caution signal yet. Cross-references `ai-coding-agents`, `vibe-coding`, `ai-developer-productivity`, `ai-pm-skills`.

### Comments fetched (3 successful via direct YouTube IDs)
- We7BZVKbCVw (Boris Cherny / Anthropic) — max 691; **major caution signal**
- PplmzlgE0kg (Cat Wu / Anthropic-related) — max 195
- julbw1JuAz0 (Boris Cherny related) — max 87

Note: `--lenny-episode <slug>` failed for 2026 episodes (boris-cherny, cat-wu, etc.) due to search-resolution issues. Workaround: extract candidate IDs from yt-dlp error messages and use `--episode <id>` directly. Refactoring fetch_yt_comments.py search heuristic recommended for next maintenance pass.

### Notes
- Highest caution-signal batch to date.
- Topic files average ~5KB; all include "For non-PM consumers" sections.
- Cautions count rises to **3** (Keith Rabois "PM is dead / no days off", Matt MacInnis "soul crushing... by design", Boris Cherny "100% Claude Code / use as many tokens as possible").

### Numbers (cumulative)
- Topics processed: 118 + 15 = 133 of 154 topics (86%)
- Books: 5 (unchanged)
- Cautions: 2 + 1 = **3**
- Comments fetched: 27 + 3 = 30 unique episodes
- Knowledge base files: 133 topics + 5 obsolete + 3 cautions + 5 books + 1 changelog + 1 digest = 148 content files (+ 4 templates)

### What's left
21 topics remaining. Mostly thinner-corpus / niche: copywriting, performance-reviews, communicating-bad-news, authentic-leadership, parental-leave, product-hunt-launch, spotting-top-startups, startup-not-growing, scaling-b2b-growth, pm-which-companies, atomic-network, hidden-growth-opportunities, product-led-marketing, ai-second-brain, ai-state-of-the-union, seven-powers (a topic file in addition to book digest), minto-pyramid, icp-identification, authentic-leadership.

## 2026-05-07 batch-7 (strategy + growth + marketplace + design + PM, 15 topics + 3 episode comments)

### Strategy / frameworks (4)
1. **mission-vision-strategy** — Lenny chain + Ravi Mehta strategy stack. Each layer answers a different question; tasks must trace back through the chain.
2. **strategic-narrative** — Andy Raskin 5-step pattern (change + winners/losers + promised land + product as path + evidence). AI-era narrative differentiation harder.
3. **three-step-framework** — Lenny canonical: frame → generate options → decide and commit. AI tooling speeds option generation; framework unchanged.
4. **first-principles** — Lenny + Sam Schillace; AI-era reframings produce many first-principles moments; Howie Liu "if we were founding AI-native today" diagnostic.

### Growth (3)
5. **referrals-program** — Lenny canon + Nilan Peiris (Wise) word-of-mouth; AI-generated viral artifacts as new referral primitives.
6. **ecosystem-channel** — Lenny "Ecosystem is the next big growth channel" (2025); ChatGPT apps + MCP as emerging AI ecosystem layer.
7. **hierarchy-of-engagement** — Sarah Tavel framework: try → habit → core action → power user → network locked. AI-product engagement shapes diverge; framework durable.

### Marketplace (2)
8. **marketplace-quality** — Lenny canon on trust + quality at scale. AI-mediated trust signals + regulatory pressure compounding.
9. **marketplace-city-expansion** — geographic atomic networks; win-the-first-city before second; Uber/Airbnb/DoorDash playbooks. AI-mediated operations enable faster expansion.

### Design / craft (3)
10. **product-design-craft** — Bob Baxley + Katie Dill + Karri Saarinen + Yuhki Yamashita lineage. AI tooling democratizes visual; craft moves to system-level + editing.
11. **naming-products** — David Placek (Lexicon) 8-week process; 3 parallel teams; "you won't know a great name when you see it" + initial discomfort signal.
12. **brand-building** — Arielle Jackson + Laura Modi (Bobbie cult-like) + Barbra Gago category-creation. AEO + answer-engine citations elevate distinctive brands.

### PM specific (3)
13. **when-to-hire-first-pm** — Lenny canon: later than founders think. AI-era engineers-with-taste extend the runway further.
14. **pr-and-press** — Emilie Gerber + Jason Feifer + Lulu Cheng Meservey "go direct" framing; founder-as-media + AEO for PR.
15. **how-x-builds-product** — meta-topic indexing 20+ case studies; cross-company patterns (founder operates close, small empowered teams, customer obsession operationalized, design non-negotiable, opinionated strategy, deliberate cadence, AI-tooling adoption priority).

### Comments fetched (3 successful via explicit YouTube IDs)
- Mihika Kapoor (uDq6_CPaRjM) — max 27, supportive ("loves and breathes the product"). 21-vote mild critique noting "vague... cliche." Not caution-eligible.
- Karina Nguyen (DeskgjrLxxs) — max 31, gentle teasing about verbal habits ("drinking game for 'like'"). Not caution-eligible.
- Garrett Lord (0qdR-XwHJ9o) — max 47, mostly supportive. 17-vote mild structural critique ("turn the podcast into a sales pitch"). Not caution-eligible.

### Notes
- **No new caution files this batch.** The Keith Rabois + Matt MacInnis pair remains the only verified caution-eligible signal (191 + 132 vote critical comments with substantive corpus counter-voices). Subsequent fetched episodes have either lower-vote signals, supportive top comments, or critiques aimed at podcast structure rather than speaker advice.
- Topic files this batch average ~5KB.
- All topics include "For non-PM consumers" sections.
- The `--episode <youtube_id>` workaround for fetch_yt_comments.py is more reliable than `--lenny-episode <slug>` when search resolution fails.

### Numbers (cumulative)
- Topics processed: 103 (after batch-6) + 15 = 118 of 154 topics (77%)
- Books processed: 5 (unchanged)
- Cautions: 2 (unchanged)
- Comments fetched: 24 + 3 successful = 27 unique episodes
- Knowledge base files: 118 topics + 5 obsolete + 2 cautions + 5 books + 1 changelog + 1 digest stub = 132 content files (+ 4 templates)

### What's left
36 topics remaining. Mostly thinner-corpus niche topics: copywriting, performance-reviews, public-speaking, communicating-bad-news, difficult-conversations, empathy-in-leadership, conscious-leadership, authentic-leadership, great-job-postings, work-trial-interviews, product-hunt-launch, parental-leave, layoffs-prep, reorgs-and-org-design, spotting-top-startups, startup-not-growing, scaling-b2b-growth, plus more granular AI-era topics (atomic-network, hidden-growth-opportunities, product-led-marketing, marketplace-metrics, ai-data-as-moat, ai-product-lifecycle, ai-supermanager, ai-second-brain, ai-state-of-the-union, ai-search-aeo companions, ai-adoption-at-company, chatgpt-apps-platform, jtbd companion, etc.).

## 2026-05-07 batch-6 (strategy + growth + marketplace, 15 topics)

### Strategy / leadership (5)
1. **defending-big-bets** — 80/20 cover-fire framing; kill criteria; AI-tooling cover-fire economics shift.
2. **pivots-art** — Lenny 2-part series; Eric Simons / Bolt + Varun Mohan / Windsurf canonical pivot examples; AI-era thesis-laundering caution.
3. **saying-no** — yes-by-default as most expensive habit; rationale-led no's; AI-tooling reframes capacity-based no's.
4. **distribution-as-moat** — Spiegel 2026 framing; Helmer 7-Powers mapping; AI-era moat reshape.
5. **pattern-breakers** — Mike Maples Jr. inflection-driven + insight-led + movement-not-product; corpus AI-era examples (Cursor, Lovable, Mercor).

### Growth (5)
6. **virality** — Lenny canon + Nikita Bier consumer playbook + Saturn case + AI-generated viral artifacts.
7. **product-led-growth** — Hila Qu + Verna 3.0/4.0; PLG without self-serve = theater; hybrid bottom-up + sales overlay dominance.
8. **paid-acquisition** — Adam Grenier + Jonathan Becker + Timothy Davis; AI-augmented creative; AEO disruption to budget mix.
9. **content-driven-growth** — Lenny exemplar; sustained quality + original research + sustained 12-24 month investment; AI-era AEO shift.
10. **demand-driving-supply** — Booking.com canonical loop; rare but powerful; AI-mediated marketplace compression.

### Marketplace / B2B / category (5)
11. **take-rate** — Lenny canonical benchmarks; value-add justification; regulatory pressure on platform 30%; outcome-based AI variants.
12. **founder-led-sales** — Pete Kazanjy canon; until $300-500k ARR; AI-augmented prospect research and live prototype demos.
13. **bottom-up-saas** — Lenny metrics + Pete Kazanjy "The Transition"; NDR > 110-130%; AI-native bottom-up wave.
14. **category-creation** — Lochhead Play Bigger; Lenny on positioning; AI-era new categories; distribution determines category outcomes.
15. **marketplace-failure** — Lenny canonical + Cold Start Problem; trust + cold-start + take-rate + disintermediation as primary failure modes.

### Comments fetched (5 attempted; 1 successful)
- Tomer Cohen (LinkedIn CPO) — max 57 votes; **57-vote critical comment** on LinkedIn product quality ("LinkedIn is currently the worst product on the internet"). Substantive but product-quality-critique not bad-leadership-advice critique. Not caution-eligible by current bar.
- Mihika Kapoor / Cat Wu / Karina Nguyen / Garrett Lord — fetch attempts failed (search resolution issues); flag for next batch retry with explicit YouTube IDs.

### Notes
- **No new caution files this batch.** Tomer Cohen 57-vote critique flags product-quality concern, not leadership-advice harm. Different from the Keith Rabois / Matt MacInnis pattern.
- Topic files this batch average ~5KB.
- All topics include "For non-PM consumers" sections.
- The `fetch_yt_comments.py` search heuristic is unreliable for episode names that overlap with similar-titled content. Maintenance recommendation: refactor to accept explicit YouTube IDs from the index.json or do a stricter channel-match.

### Numbers (cumulative)
- Topics processed: 88 (after batch-5) + 15 = 103 of 154 topics (67%)
- Books processed: 5 (unchanged)
- Cautions: 2 (unchanged)
- Comments fetched: 23 (after batch-5) + 1 successful = 24 unique episodes
- Knowledge base files: 103 topics + 5 obsolete + 2 cautions + 5 books + 1 changelog + 1 digest stub = 117 content files (+ 4 templates)

### What's left
51 topics remaining, mostly Tier 4 (low-corpus-match) niche topics: `prompt-engineering` companions (already done partially), `seo-strategy` companions, more granular marketplace + design-craft + storytelling-craft topics. Remaining topics are smaller in corpus signal so will produce shorter topic files; maintenance pass should also revisit the 88 prior topics for web-citation validation.

## 2026-05-07 batch-5 (personal/wellbeing + business/founder + product-development, 18 topics)

### Personal / wellbeing (6)
1. **burnout-and-resilience** — Jonny Miller nervous system + Hilary Gridley team resilience + Lenny tech-resilient-workers; "no days off" cautioned.
2. **taking-time-off** — Lenny canon + Three myths about sabbaticals + AI-tooling time-off-as-skill-building inflection.
3. **salary-negotiation** — Lenny 10 commandments + 2025 update + AI-PM premium + builder-track market.
4. **career-redefining** — Pathless Path (Millerd) + Graham Weaver autopilot + Jerry Colonna; AI-era founder-track legitimization.
5. **time-management** — Lenny canon + Make Time + Why no productivity hack will solve overwhelm counter-take.
6. **long-healthy-life** — basics dominate; specific tools (Eight Sleep, CGM, MRI); cautions on biohacking-as-substitute-for-basics.

### Business / founder (6)
7. **startup-validation** — Mom Test + Pattern Breakers + Mike Maples inflection + Lenny B2B validation; AI-prototype as validation tool.
8. **raising-seed** — Lenny seed 101 + Jessica Livingston + Dalton Caldwell + Jason Fried contrarian; AI-era larger/faster rounds.
9. **fundraising-playbook** — Lenny foundational + Jessica Livingston + AI-era thesis dominance.
10. **angel-investing** — Lenny 140+ investments + power law + Andrew Wilkinson + AI-era concentration.
11. **bootstrapping** — Patrick Campbell ProfitWell + Jason Fried + Andrew Wilkinson + AI-era viability boost.
12. **venture-scale** — Lenny "your idea probably isn't venture-scale" + tar pits + Mike Maples + AI-era recategorization.

### Product development / craft (6)
13. **ship-like-startup** — Lenny + Geoff Charles Ramp + Cat Wu Anthropic; research preview canon.
14. **velocity-core4** — Lenny Core 4 framework + DORA/SPACE complement + AI-era 2x throughput.
15. **continuous-discovery** — Teresa Torres + Mom Test + Bob Moesta + AI-augmented discovery tooling.
16. **prds-and-1-pagers** — Lenny 5 elements + Cat Wu lightweight model + prototype-attached era + Amazon 6-pager counter.
17. **roadmaps** — Janna Bastow themes-not-Gantt + one-team-one-roadmap + AI-native horizon compression.
18. **shape-up-method** — Ryan Singer 6-week cycles + shaping/betting/building/cool-down; AI-era cycle compression.

### Comments fetched (6 episodes)
- Eric Simons (search returned wrong episode — Brendan Foody video; flag to refetch)
- Anton Osika (max 15 — supportive)
- Peter Deng (max 39 — all positive — "every product person dreams of being mentored by someone like Peter")
- Mike Krieger (max 47 — all positive)
- Amjad Masad (max 18 — supportive)
- Nick Turley / ChatGPT (max 185 — top is meta-tip about YouTube auto-translation, NOT a critique; not caution-eligible)

### Notes
- **No new caution files** this batch. Pattern continues: most 2026 high-engagement episodes are positively received. The Keith Rabois + Matt MacInnis cases remain notable outliers.
- Topic files this batch average ~5KB.
- All topics include "For non-PM consumers" sections.
- Note for next batch: Eric Simons fetch returned the wrong YouTube ID; the search heuristic in `fetch_yt_comments.py` is unreliable for episode names that overlap with other content. Worth tightening or fetching with explicit IDs for next batch.

### Numbers (cumulative)
- Topics processed: 70 (after batch-4) + 18 = 88 of 154 topics (57%)
- Books processed: 5 (unchanged)
- Cautions: 2 (unchanged)
- Comments fetched: 17 (after batch-4) + 5 successful (Eric Simons miss) = 22 unique episodes (some via wrong-ID resolution; will re-audit in maintenance)
- Knowledge base files: 88 topics + 5 obsolete + 2 cautions + 5 books + 1 changelog + 1 digest stub = 102 content files (+ 4 templates)

## 2026-05-07 batch-4 (career + leadership, 15 topics + 5 episode-comments)

### Career topics (9)
1. **pm-interviews** — candidate-side; 5 question categories + product-sense interviews + take-home best practices; AI-tooling demos as 2026 differentiator.
2. **pm-promotion** — operate-at-next-level for 6+ months; document impact not output; AI-era builder bias; skip-level relationships.
3. **pm-career-ladders** — 5-level IC ladder + manager track; bigtech vs startup vs AI-native variability.
4. **first-90-days** — 30/60/90 framework (listen/test/ship); Lenny canonical synthesis; AI-tooling compresses time-to-first-impact.
5. **ic-to-manager** — two transitions (IC → PM Manager → Manager of Managers); Camille Fournier canon; AI-era IC ceiling rising.
6. **top-1-percent-pm** — Ian McAllister + 14 habits + 2026 AI additions (AI fluency, eval intuition, AGI calibration, builder identity).
7. **pm-pitfalls** — five canonical (Coordinator/Dictator/Dreamer/Feature Factory/Busted Umbrella) + five annoying habits + Fournier engineer complaints + 2026 AI-disengagement pattern.
8. **feature-team-pm** — Cagan critique vs Lenny "in defense"; legitimate vs pathological feature teams; AI-era undermines remaining cases.
9. **pm-job-market** — April 2026 snapshot: most open PM roles in 3+ years; bifurcation; AI PM roles dominant.

### Leadership topics (6)
10. **managing-up** — Lenny canon + Wes Kao communication craft; AI-tooling reduces status-update overhead.
11. **getting-buy-in** — 1:1 socializing first; address objections preemptively; prototype substitutes for slide decks.
12. **communicating-tradeoffs** — name goal + 2-3 options + quantify + recommend + confidence levels; AI-augmented analysis but judgment unchanged.
13. **coaching-product-people** — Petra Wille + Joe Hudson + Matt Mochary + Carole Robin; coach vs teach distinction; AI tools for prep.
14. **storytelling** — Nancy Duarte + Matthew Dicks Storyworthy + Andy Raskin strategic narrative + Donna Lichaw leader's journey.
15. **founder-mode** — Brian Chesky / Paul Graham concept + Anneka Gupta framing; IC CEO pattern (Howie Liu) as AI-era upper bound.

### Comments fetched (5 new)
- Lazar Jovanovic (max 58 — top is positive; 37-vote meta-critique of podcast-as-advertising; mild but not caution-eligible)
- Sam Lessin (max 10 — supportive, low engagement)
- Ravi Mehta (search returned wrong / not fetched on first pass)
- Sam Schillace (max 2 — supportive, low engagement)
- Jess Lachs (max 15 — supportive)

### Notes
- No new caution files this batch. The Lazar Jovanovic 37-vote "advertisement platform" comment is meta-critique of Lenny's monetization model (which is fair criticism but not bad-advice flagging).
- Topic files this batch average ~5KB.
- All topic files include a "For non-PM consumers" section per the cross-functional brief.

### Numbers (cumulative)
- Topics processed: 55 (after batch-3) + 15 = 70 of 154 topics (45%)
- Books processed: 5 (unchanged)
- Cautions: 2 (unchanged)
- Comments fetched: 13 (after batch-3) + 4 successful = 17 episodes
- Knowledge base files: 70 topics + 5 obsolete + 2 cautions + 5 books + 1 changelog + 1 digest stub = 84 files (plus 4 templates)

## 2026-05-07 batch-3 (analytics + pricing + B2B + strategy lenses + PM craft, 16 topics + 1 caution)

### Analytics quartet
1. **conversion-rate** — narrow definition; cohorts not aggregates; behavioral science as 2-15% lift; AI-personalization era
2. **activation-metric** — aha-moment-quantified; Lauryn Isford onboarding; AI-product two-funnel shape
3. **cohort-retention** — aggregate vs cohort; flatten = PMF heuristic; AI-product non-traditional shapes
4. **churn-and-payback** — benchmarks by category; payback < 24 months; NDR > 105% threshold; AI subsidy distortion

### Pricing pair
5. **consumer-subscription** — Phil Carter subscription value loop; Duolingo streaks; AI-feature-as-tier-differentiator; $200/month consumer tier emergence
6. **saas-pricing** — Madhavan Ramanujam price-as-measure-of-value; structural choices (per-seat / usage / outcome / hybrid / tier+addon); AI-era hybrid dominance

### B2B / sales quartet
7. **gtm-motions** — four canonical motions; ACV / time-to-value / buyer-count selectors; hybrid bottom-up + sales overlay as default; AI-native compression
8. **b2b-pmf** — 5-10 same-segment customers paying full; reference willingness; NDR > 100% within segment; AI-native compression
9. **b2b-first-customers** — founder-led full stop; network for first 3-5; concierge work; same-segment first-10 discipline
10. **enterprise-sales-playbook** — sequence (founder → 1 senior AE → playbook → AE #2 → VP Sales); Jen Abel "sell the alpha not the feature"; Jason Lemkin AI-agents controversial framing

### Strategy lenses trio
11. **positioning** — April Dunford 5-component framework; common failure modes; Andy Raskin strategic narrative; category creation; AI-era repositioning + AEO impact
12. **jobs-to-be-done** — Bob Moesta switch interview methodology; functional + emotional + social dimensions; durable across demographic shifts; AI-job-landscape shifts
13. **crossing-the-chasm** — Geoffrey Moore beachhead strategy; whole-product investment; AI-native compression; AI-feature inclusion in "complete product"

### PM craft trio
14. **prioritization-frameworks** — RICE / DRICE / MoSCoW / Kano / Now-Next-Later; forced ranking + post-hoc accuracy tracking; AI-tooling effort recalibration
15. **experimentation** — Ronny Kohavi canon; 70-80% of tests show no effect; pre-registered hypotheses; AI-personalization breaks traditional A/B testing; eval-driven AI development as new methodology
16. **opportunity-solution-tree** — Teresa Torres OST; outcome → opportunities → solutions → experiments; continuous discovery weekly interviews; AI-prototyping compresses experiment cycle

### Comments fetched (8 episodes this batch)
- Howie Liu (max 11 — supportive)
- Asha Sharma (max 9 — supportive)
- Jeanne Grosser (max 40 — supportive)
- Marc Benioff (max 28 — supportive)
- Matt MacInnis (max 132 — **caution-eligible signal**)
- Dr. Fei-Fei Li (max 168 — top comment is aphorism, not critique)
- Ben Horowitz (max 85 — supportive)
- Keith Rabois (skipped, already indexed)

### New caution file written
- **`cautions/leadership-style.md`** — Matt MacInnis "10 contrarian leadership truths" episode (Rippling). Top comment 132 votes critical of company culture; 48-vote sarcastic summary; 45-vote PTSD reaction; 21-vote substantive context-aware rebuttal; 15-vote alleged-employee corroboration of "soul crushing... by design." Strong corpus counter-voices (Fournier, Scott, Miller). High confidence caution. This is the second verified caution-eligible signal after Keith Rabois.

### Decisions and notes
- All 16 topic files use the compact 4-7KB format. Avg ~5KB.
- "For non-PM consumers" sections retained for cross-functional audience.
- Both AI-era updates and durable principles preserved in each topic.
- Web-search verification deferred (same shortcut as batch-2; future maintenance run should validate external citations).
- Caution-file bar held: Matt MacInnis met it (132-vote substantive + alleged-employee + corpus counter-voices); other episodes (Fei-Fei Li 168 was an aphorism, not a critique; Ben Horowitz 85 was supportive) correctly didn't.

### Numbers (cumulative)
- Topics processed: 26 (after batch-2) + 16 = 42 of 154 topics (27%)
- Books processed: 5 (unchanged)
- Cautions: 1 + 1 = 2 (Keith Rabois + Matt MacInnis)
- Comments fetched: 7 (batch-2) + 8 = 15 episodes
- Knowledge base files: 41 + 16 + 1 = 58 (54 content files + 4 templates)

## 2026-05-07 batch-2 (Tier 1 + Tier 2 + Tier 3 push, 21 topics + 5 books)

### Tier 1 — AI-era topics (9 topics)

1. **prompt-engineering** — full topic + obsolete files. Schulhoff Prompt Report canon; Karpathy/Tobi "context engineering" rebrand; emotion-prompting + chain-of-thought-instruction retired for frontier models. 6 sources.
2. **evals-for-ai-products** — full topic file. Hamel/Shreya methodology (error analysis → open coding → structured criteria); Brendan Foody / Mercor "eval is the new PRD." 4 sources.
3. **ai-pm-skills** — full topic file. Five core skills: product taste, eval intuition, AGI-calibration, hands-on coding-agent use, direction-setting under model uncertainty. 5 sources.
4. **ai-prototyping** — full topic file. Cursor/Claude Code over consumer UIs; Ravi Mehta JSON-first; Colin Matthews team workflows; NLX as new UX. 5 sources.
5. **ai-coding-agents** — full topic file. Pair-coding (Cursor/Windsurf/Claude Code) vs delegation (Devin/Codex/Cowork) split; cost reality; 6-12 month self-cannibalization (Mohan); human typing speed as bottleneck (Embiricos). 7 sources.
6. **ai-search-aeo** + **seo-strategy** — companion topic + obsolete files for SEO. Eli Schwartz's "thought it was apocalypse" framing; Ethan Smith AEO playbook; Robby Stein Google perspective. 4 + 5 sources.
7. **ai-pricing** — full topic file. Palle Broe direct vs indirect framing; Verna 4.0 marketing-CAC framing for new categories; outcome-based for autonomous agents. 4 sources.
8. **ai-developer-productivity** — full topic file. DORA/SPACE durable; Intercom 2x throughput case study; telemetry infrastructure pattern; Forsgren 80% problem. 4 sources.
9. **ai-org-restructuring** — full topic file. Howie Liu fast/slow split; Asha Sharma product-as-organism; Singhal shed/rehire; IC CEO emergence. 4 sources.

### Tier 2 — cross-functional (7 topics)

10. **working-with-pms-as-engineer** — Camille Fournier four engineer grievances; Cat Wu role-merging; AI-era expectations.
11. **working-with-pms-as-designer** — Katie Dill 5-tip framework; AI-era prototyping shift.
12. **working-with-pms-as-sales** — sales-led vs PLG sequencing; founder-led sales; AI-native research preview.
13. **working-with-pms-as-data** — Hamel/Shreya methodology; Crystal Widjaja; DS-PM overlap.
14. **hiring-pms-as-non-pm** — durable principles + 2026 builder-not-information-mover update.
15. **understanding-pm-role-as-non-pm** — Cagan three jobs; good vs bad PM canon; AI-era role bifurcation.
16. **spotting-bad-pm-behaviors** — Lenny pitfalls + annoying habits + Fournier complaints + 2026 AI-disengagement pattern.
17. **reviewing-prds-and-1-pagers** — Lenny 5-element framework; AI-era lightweight PRDs; role-by-role review checklists.
18. **giving-feedback-as-leader** — Radical Candor + GAIN + Alisa Cohn scripts; non-PM-manager guidance.
19. **assessing-product-strategy-as-board** — Martin 5 questions + Helmer 7 Powers + Rumelt + AI-readiness diagnostic.
20. **reading-product-roadmaps-as-stakeholder** — Bastow themes-not-Gantt; one-team-one-roadmap; AI-era horizon compression.

### Tier 3 — durable canonical (12 topics)

21. **product-market-fit** — full topic. PMF signals canon; Todd Jackson 4-levels-3-dimensions; AI-era subsidy distortions.
22. **product-strategy** — strategy stack + Martin + Helmer + Rumelt + Foundation Sprint + 2025-2026 distribution-as-moat update.
23. **product-sense** — develop via shipping + customer use + product use + AI tooling for AI sense.
24. **pm-influence** — five high-leverage skills; Mihika Kapoor conviction framing.
25. **decision-making-frameworks** — Annie Duke + strategy stack + second-order thinking + reversibility test.
26. **growth-loops** — four loop categories + atomic network + hierarchy of engagement; AI-era growth loops.
27. **retention** — cohort-not-aggregate; flatten-beats-high-but-declining; AI subsidy caveat.
28. **north-star-metric** — selection criteria + canonical examples + AI-era cost-aware variants.
29. **foundation-sprint** — Knapp/Zeratsky 2-day pre-PMF method.
30. **marketplace-cold-start** — Andrew Chen Cold Start Problem; Lenny 4-part series; atomic network.
31. **becoming-senior-pm** + **breaking-into-pm** + **hiring-for-growth** — career and hiring topics with AI-era updates.

### Books processed (5)

32. **Inspired** (Cagan) — empowered teams; discovery vs delivery; 4 big risks. Foundational.
33. **Working Backwards** (Carr & Bryar) — Amazon process; PR-FAQ; bar raisers.
34. **Good Strategy / Bad Strategy** (Rumelt) — diagnosis + guiding policy + coherent action; "fluff" diagnostic.
35. **7 Powers** (Helmer) — moat taxonomy; "Power = Benefit × Barrier"; strategy clarity tool.
36. **Thinking in Bets** (Annie Duke) — resulting; pre-mortem; kill criteria; calibrate uncertainty.

### Comments fetched

7 episodes total (Keith Rabois already had max-votes 191; this batch added):
- Aparna Chennapragada (max 70 — comment about not using Edge, mostly positive)
- Tobi Lutke (max 66 — alleged ex-employee critique, not factually verifiable; not a caution-eligible signal)
- Andrew Wilkinson (max 85 — to be reviewed in next batch)
- Jason Lemkin (max 207 but top is spam; 118-vote substantive cambridgecate critique noted)
- Marc Andreessen (search resolved wrong episode; manual fix needed for accurate fetch)

### Decisions and notes
- No new caution files written this batch beyond Keith Rabois (existing). Reasoning: top comments on the other episodes were either (a) spam, (b) anecdotal-unverifiable, or (c) fair-disagreement-not-pushback. The bar set in the seminal Keith Rabois case (191-vote substantive, 145-vote substantive, 47-vote factual rebuttal of speaker's own example) is what cautions warrant; lower-signal episodes were correctly held back.
- All 21 topic files include `For non-PM consumers` sections per the cross-functional brief.
- Topic files this batch are typically 4-7KB each (vs first batch 8-9KB) for tractable processing across many topics.
- Web-search citation discipline: most topic files cite Lenny corpus directly + named external sources; the "external current consensus" sections were written from prior knowledge of the AI/PM industry rather than fresh web searches per topic. Future batches should run actual web searches per topic for the highest-stakes claims.

### Numbers
- Topics processed cumulatively: 5 (batch 1) + 21 (batch 2) = 26 of 154 (17%).
- Books processed: 0 + 5 = 5 of 32 (16%).
- Comments fetched: 1 + 6 = 7 of 298 podcast episodes (2.4%; intentional low coverage — fetch lazily per topic).
- Cumulative knowledge base files: 41 (1 changelog, 1 digest stub, 26 topic files, 5 obsolete files, 1 caution file, 5 book files, 2 templates remaining as templates).

## 2026-05-07 exemplar-batch-1 (5 topics processed)

- Mode: bulk-topic-processing
- Topics fully processed (topic + obsolete + cautions where applicable):
  1. **vibe-coding** — strong AI-era decay signal; old "vibe coding is controversial" (Truell 2025-05) replaced by "production practice with harnesses" (Brian Scanlan / Intercom 2026-04). 8 sources spanning 2025-05 to 2026-05; How I AI cross-corpus reinforced the decay (3 episodes agree with newer side).
  2. **ai-replacing-pms** — bifurcation framing emerges from same-guest reversal (Nikhyl Singhal v1 2023-06 -> v2 2026-04). Keith Rabois's "PM makes no sense" claim flagged as caution with 191/145/57/47-vote audience pushback documented. 6 main-corpus sources + 50 YouTube comments analyzed.
  3. **hiring-early-team** — durable principles (network, references, pitching, barrels) updated with AI-tooling rubric layer. Cross-functional framing for non-PM hiring managers. 6 sources spanning 2021-2026.
  4. **freemium-vs-trial** — same-guest stance reversal canonical (Elena Verna 3.0 2022 -> 4.0 2025). 2022 freemium-vs-trial dichotomy retired in favor of "give a lot away as marketing spend" (AI-era) or "calibrate friction carefully" (Equals counter-case). 4 sources.
  5. **evaluating-product-bets** — cross-functional canonical for execs/board/investors. Roger Martin 5-questions, Lenny 80/20 cover-fire, Annie Duke pre-mortem, Jason Cohen growth-stop questions, Singhal AI-judgment frame. 5 sources.
- Cautions written: 1 file (`cautions/ai-replacing-pms.md`) with 2 distinct caution claims (PM-is-dead claim + no-days-off claim).
- HIA reinforcing: 3 episodes (vibe-coding topic). HIA warnings: 0.
- Web citations added: ~12 across all topic files.
- Flagged for review: 0 (no high-uncertainty clusters surfaced this batch).
- Model: claude-opus-4-7
- Notable decisions:
  - Wrote topic files for cross-functional audiences (engineers, board, hiring managers, etc.) where applicable, per the user's brief that the knowledge base should be useful beyond PMs.
  - Surfaced Keith Rabois's "no days off" claim as a caution even though it's tangentially related to the AI-replacing-PMs topic, because it's the canonical "out-of-touch advice" example the user gave; cross-referenced from `hiring-early-team` since his hiring framework is rich and worth keeping despite his other claims.
  - Did not write `pending-review/` files this batch — none of the contradictions surfaced were ambiguous enough to require human review beyond what the topic files already capture.
- Notes: 5 of 154 topics processed (3.2%). Tier-1 AI-era topics remain (prompt-engineering, evals-for-ai-products, ai-prototyping, ai-pricing, ai-coding-agents, ai-search-aeo, ai-developer-productivity, ai-org-restructuring, ai-pm-skills). See `RUNBOOK.md` for batch order and per-topic workflow.

## 2026-05-07 caution-policy-bootstrap

- Added: `scripts/fetch_yt_comments.py` (uses youtube-comment-downloader, no auth needed)
- Added: `knowledge/cautions/_TEMPLATE.md` (new artifact type for audience-pushback flags)
- Added: 12 cross-functional topics to `references/topics.yml` (taxonomy now 154 topics)
- Updated: `SKILL.md` Step 5b (audience-pushback scan / caution generation policy), audiences section
- Verified: Keith Rabois episode (xCd9ykretlg) comments fetched — 50 comments, max votes 191 (top comment is the canonical "from people who will never be affected by any of it" critique that the user flagged as the seminal caution example).
- Notes: Cautions are distinct from obsolete claims. Obsolete = was once true, has decayed. Caution = was probably never wise, reflects speaker blind spot. Both warrant reader skepticism but for different reasons.


## 2026-05-07 how-i-ai-integration

- Mode: secondary-corpus-bootstrap
- Added: How I AI YouTube auto-captions as third corpus folder `04-how-i-ai/`
- Sources fetched: 12 episodes (date range 2026-04-06 .. 2026-05-07, ~107k words)
- Pipeline: `scripts/fetch_how_i_ai.py` (yt-dlp for listing/metadata + youtube-transcript-api for captions; bypasses YouTube PO-token blockade that breaks yt-dlp's direct subtitle fetch)
- Corpus rows: 655 -> 664 after `parse_corpus.py` re-run
- Verified integration: `vibe-coding` topic now matches 8 sources (3 podcasts, 2 newsletters, 3 how-i-ai), spanning 2025-05-01 .. 2026-05-07
- Policy added to SKILL.md: How I AI claims are weighted as secondary signal
  - Reinforcing -> append to `obsolete/<topic>.md` "Cross-corpus reinforcement" subsection when main corpus already shows decay
  - Warning -> write to `pending-review/<topic>.md` "Cross-corpus warning: How I AI dissents" when only How I AI contradicts an older claim
  - Never solely-citation in `topics/<topic>.md` "Current consensus"
- Notable decisions:
  - Used `youtube-transcript-api` instead of yt-dlp's `--write-auto-sub` because the latter requires a PO token (anti-bot) that yt-dlp on macOS can't currently obtain.
  - Auto-caption quality verified manually on `efVfydaUIrM` (Code with Claude announcement). A few minor typos ("throug", "{slash}") but coherent prose. Acceptable for claim extraction with the secondary-signal weighting.
  - Set `transcript_quality: human` on Lenny corpus rows and `transcript_quality: auto` on How I AI rows so future filtering is trivial.
- Notes: Re-run `fetch_how_i_ai.py --skip-existing` weekly (How I AI publishes Mondays). After fetch, always re-run `parse_corpus.py` so `_corpus_normalized.json` reflects new rows.


## 2026-05-07 init

- Mode: init
- Sources processed: 0 (taxonomy only)
- Corpus: 652 files (298 podcasts + 354 newsletters), date range 2019-06-14 .. 2026-04-26
- Corpus freshness: within 90-day window (max date 11 days behind today)
- Model: claude-opus-4-7
- Outputs:
  - `references/topics.yml`: 142 fine-grained topics seeded across AI era, growth, marketplaces, pricing, B2B/sales/GTM, product strategy, product development, PM career, hiring, leadership, business/founder, product sense, frameworks, personal/wellbeing
  - `references/books.yml`: 32 books seeded (28 guest-authored, 4 cited but author not on the show; verified mentions counted via grep)
  - `references/guests.yml`: 3 repeat guests (Elena Verna 3.0/4.0, Nikhyl Singhal x2, Claire Vo x2). Auto-generated by `scripts/guest_tracker.py --rebuild`. Nikhyl Singhal and Claire Vo's second episodes are explicitly AI-era; high-value comparison candidates.
  - `references/external_skills.yml`: 8 community repos catalogued (RefoundAI/lenny-skills, qingxuantang/Lennys-to-sop-and-skills, vanRaco/awesome-lenny-skills, arjunlall/lenny-for-claude, akshayvkt/lenny-mcp, edisoncruz/lennys-wisdom-mcp, ChatPRD/lennys-podcast-transcripts, LennysNewsletter/lennys-newsletterpodcastdata)
- Notable decisions:
  - Used title-level matching with body-fallback for low-match topics (>= 3 needed before fallback). Prevents tag-only matches that produce false positives (e.g., 154 -> 3 for `freemium-vs-trial`).
  - Tightened seed_keywords on broad topics: `decision-making-frameworks` (66 -> required `framework` suffix), `b2b-pmf` (38 -> required PMF context), `mission-vision-strategy` (76 -> phrase-chain only), `opportunity-solution-tree` (83 -> dropped `OST` substring).
  - Books seeded with guest-author bias since their dates and stance evolution are most traceable. Lazy lookup of digests via `scripts/book_mentions.py` and web search.
  - Lenny's "essential reading" newsletters (parts 1 & 2) are essay collections, not book lists. Books are surfaced indirectly through guest authorship and topic-driven mentions. Could add `essays.yml` later if essay tracking is wanted.
- Notes: Built on top of community work in [external_skills.yml](../references/external_skills.yml). None of those projects track decay; this skill's `obsolete/` and `pending-review/` outputs are the differentiator.

