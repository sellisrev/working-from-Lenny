---
topic_slug: churn-and-payback
display_name: Churn rate and payback period
last_updated: 2026-05-07
last_model: claude-opus-4-7
sources_processed: 5
date_range_processed: 2020 .. 2024
---

# Churn rate and payback period

## Current consensus

Churn and payback period are the two financial-side complements to cohort retention. Corpus consensus:

### Churn benchmarks
- **Consumer subscription**: 4-7% monthly churn is solid; 8%+ is concerning; 2-3% is exceptional. (Lenny "What is good monthly churn", 2022)
- **B2B SaaS**: 5-7% annual gross churn is typical for SMB; 1-3% is typical for enterprise; >10% for SMB or >5% for enterprise is a problem.
- **NDR (net dollar retention)**: 100%+ means revenue from existing customers grows even before new acquisition. >120% is unicorn-tier (Snowflake, Datadog, etc.).
- **Different shapes signal different problems.** A spike at month-1 means activation/onboarding is broken. Even decay over time means product-fit issue. Sudden uptick means competitor or pricing change.

### Payback period
- **Payback period = CAC / monthly gross profit per customer.**
- **Healthy SaaS payback**: 12-18 months for SMB, 18-30 months for enterprise. Longer is fine for high NDR products.
- **Payback period > 24 months without high NDR or strong unit economics signal**: cash-flow danger. Investors will discount this.
- Lenny's "What is a good payback period" (2022) is the canonical corpus reference.

### What's changed in 2025-2026
- **AI products distort payback.** LLM cost per active user is non-trivial; some AI products operate at gross-loss margin while still subsidized by frontier-lab API discounting. Re-do the payback math with realistic post-subsidy unit economics.
- **NDR is increasingly the gating B2B metric for IPO and growth-equity rounds.** Pure ARR growth without NDR ≥ 105% is now harder to defend.

## What this means for non-PM consumers

- **If you're a CFO or finance lead**: track churn by cohort (cohort gross retention) AND payback period AND NDR. Each on its own can mislead.
- **If you're a founder pitching investors**: have honest churn numbers ready, broken down by segment. Investors can read between the lines on "we don't track that" answers.
- **If you're a board member**: payback period > 24 months at SMB scale is a warning. Don't accept "we're investing in growth" without seeing the unit economics improve over time.

## How thinking has evolved

- **2021-2022**: Lenny benchmarks pieces (good monthly churn, good payback period). Corpus canonical.
- **2023-2024**: Patrick Campbell (ProfitWell) recurring guest on monetization; Naomi Ionita on pricing structure.
- **2025-2026**: AI-era unit economics complicate the math; the metrics are unchanged but the inputs need careful definition.

## See also

- Related topics: `retention`, `cohort-retention`, `consumer-subscription`, `saas-pricing`, `bottom-up-saas`, `freemium-vs-trial`, `ai-pricing`.
- Books: corpus content + Patrick Campbell content (ProfitWell) are canonical.
