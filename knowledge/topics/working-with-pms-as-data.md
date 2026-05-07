---
topic_slug: working-with-pms-as-data
display_name: Working with PMs as a data scientist or analyst
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 3
date_range_processed: 2020-04 .. 2025-09-25
---

# Working with PMs as a data scientist or analyst

## Current consensus

Data scientists / analysts and PMs are tightly coupled by necessity (PMs need data to make decisions; data professionals need PMs to make decisions matter). The corpus consensus on what works:

- **Data is a peer function, not a service function.** A PM who treats analytics as "a query I'm waiting for" is operating below current standards. Best teams give data scientists ownership over hypotheses, not just queries.
- **Co-author the experiment, not just the analysis.** Crystal Widjaja (Gojek/Kumu, [Lenny's Podcast](https://www.lennysnewsletter.com/p/how-to-scrappily-hire-for-measure)) and Jess Lachs (DoorDash VP Analytics): the highest-leverage move is putting data professionals upstream of the experiment design, not downstream of execution.
- **For AI products, data and PM merge further.** Cf. [evals-for-ai-products](evals-for-ai-products.md). Hamel Husain & Shreya Shankar's central insight: error analysis on traces is product work + data work + ML work simultaneously. The DS-PM pairing produces this.
- **Transitioning from DS to PM is a recognized career path.** Lenny "Transitioning from DS to PM" was an early-canon weekly Q&A. The reverse (PM with strong analytics taste) is also valid.

## Five things data professionals want from PMs

1. **Hypotheses, not metrics requests.** "I want to know X about user behavior" is more useful than "give me a query for Y."
2. **Decision discipline.** When the data comes back, the PM should actually use it. Data professionals burn out fastest when their analyses don't change product decisions.
3. **Statistical literacy at PM level.** PMs don't need to be statisticians, but they do need to understand power, MDE, p-values without overinterpreting them, sample size for cohort analyses. Cf. Lenny's 2021 [linear regression and correlation analysis](https://www.lennysnewsletter.com/p/how-to-do-linear-regression-and-correlation-analysis) primer.
4. **Co-ownership of the metric.** PMs who pick a north-star metric and then can't explain how it's calculated are a tell. Cf. [north-star-metric](north-star-metric.md).
5. **Acknowledgement of confound risk.** A/B tests can be misread (network effects, novelty, spillover). PMs who treat results as ground truth without questioning confounds invite bad decisions.

## What this means for data professionals specifically

- **If you're a senior DS pairing with a PM**: ask "what decision would change based on the answer?" before doing the analysis. If no decision would change, the analysis isn't worth doing.
- **If you're an analytics lead deciding org structure**: embedded data scientists in product teams often outperform centralized analytics teams for product-decision speed. Centralized teams outperform for cross-team consistency. Pick deliberately.
- **If you're an ML engineer pairing with PMs on AI features**: the [evals-for-ai-products](evals-for-ai-products.md) workflow — error analysis, open coding, structured criteria, calibrated LLM-as-judge — is now the canonical practice. Don't let the PM skip steps.
- **If you're a DS thinking about transitioning to PM**: your strength is in framing, hypothesis-formation, and decision rigor. Your gap is usually customer empathy and execution / cross-functional orchestration. Practice both.

## How thinking has evolved

- **2020**: Lenny — early Q&A on partnering with data scientists.
- **2021**: Lenny — Linear regression primer for PMs; "how to determine your activation metric" content.
- **2024-09**: Jess Lachs (DoorDash) — building a world-class data org.
- **2025-09-25**: Hamel Husain & Shreya Shankar — eval methodology that fundamentally pairs PM and data work for AI products.

## See also

- Related topics: `evals-for-ai-products`, `north-star-metric`, `activation-metric`, `experimentation`, `cohort-retention`, `working-with-pms-as-engineer`.
- Books: [Trustworthy Online Controlled Experiments](https://www.amazon.com/Trustworthy-Online-Controlled-Experiments-Practical/dp/1108724264) (Ronny Kohavi et al.) — corpus-canonical via the [Ronny Kohavi episode](https://www.lennysnewsletter.com/p/the-ultimate-guide-to-ab-testing).
