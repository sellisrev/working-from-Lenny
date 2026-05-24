---
app-id: 33
app-name: 7 Powers Self-Classifier
content-type: authored-content
updated: 2026-05-24
authored-by: autonomous-routine
---

# Authored content — #33 7 Powers Self-Classifier

Items from the `## Autonomous-routine backlog` in `prompt.md`.

---

## Anchor cross-check

| Referenced file | Exists? | Action |
|---|---|---|
| `seven-powers.md` | YES | No change |
| `good-strategy-rumelt.md` | YES | No change |
| `distribution-as-moat.md` | YES | No change |
| `ai-data-as-moat.md` | YES | No change |
| `category-creation.md` | YES | No change |

Named-author cross-check:
| Author | Corpus presence | Action |
|---|---|---|
| Hamilton Helmer | Present (seven-powers.md; books/seven-powers.md digest) | No change |
| Richard Rumelt | Present (good-strategy-rumelt.md) | No change |
| Shaun Clowes | Present (ai-data-as-moat.md: data-as-moat = cornered resource + scale economies) | No change |

No substitutions needed. All five anchors verified present 2026-05-24.

---

## The question bank (25 questions)

Per `prompt.md`: 1 claim question + 2-3 evidence questions per power. Variable evidence count lands the bank at 25 (network / scale / counter-positioning / switching get 3 evidence questions; branding / cornered resource / process get 2). Claim scale: **have / maybe / no.** Evidence scale: **true / partly / false.** Evidence questions are specific and observable, never "do you believe."

Per-power evidence max for scoring = 2 × (number of evidence questions). `evidence_score` sums true=2, partly=1, false=0; `evidence_pct = evidence_score / max`.

### 1. Scale economies (3 evidence; max 6)

```
CLAIM: "Our unit costs fall as we grow, in a way rivals can't match."  (have / maybe / no)
EVIDENCE:
  E1: "We already have lower unit costs than smaller rivals, OR a meaningfully
       larger competitor would have lower unit costs than us today."  (true/partly/false)
  E2: "We can name the specific cost that falls per unit as volume rises (compute,
       logistics, content production, support), not just 'overhead spreads out.'"  (t/p/f)
  E3: "A new entrant operating at our current scale would lose money serving
       customers at our prices."  (t/p/f)
```

### 2. Network economies (3 evidence; max 6)

```
CLAIM: "We have network effects."  (have / maybe / no)
EVIDENCE:
  E1: "A new user gets measurably more value this month than they would have a year
       ago, because of other users."  (true/partly/false)
  E2: "A well-funded competitor launching today would struggle to get our users value
       because they'd start with an empty network."  (t/p/f)
  E3: "We can name the specific interaction between users that creates the value (not
       just 'more users = good')."  (t/p/f)
```

### 3. Counter-positioning (3 evidence; max 6)

Framed around the *incumbent's* inability to respond (per open question #2), not the user's own model.

```
CLAIM: "We do something an incumbent can't copy without hurting their own business."  (have / maybe / no)
EVIDENCE:
  E1: "We can name a specific incumbent whose existing revenue or model would shrink
       if they copied our approach."  (true/partly/false)
  E2: "That incumbent has seen what we do and has chosen NOT to match it, rather than
       merely being slow to."  (t/p/f)
  E3: "The reason they won't copy us is structural (cannibalization, channel conflict,
       margin collapse), not just that they haven't gotten around to it."  (t/p/f)
```

### 4. Switching costs (3 evidence; max 6)

```
CLAIM: "Customers would find it costly to leave us."  (have / maybe / no)
EVIDENCE:
  E1: "Leaving means losing data, history, or config they can't easily recreate."  (true/partly/false)
  E2: "Their team has built workflows or integrations around us."  (t/p/f)
  E3: "We can cite a churned customer who came back because switching hurt."  (t/p/f)
```

### 5. Branding (2 evidence; max 4)

```
CLAIM: "Customers pay us more than a functionally-equal alternative because of who we are."  (have / maybe / no)
EVIDENCE:
  E1: "There is a competitor whose product is roughly as good, who charges less, and we
       still win the customer."  (true/partly/false)
  E2: "Customers describe choosing us in terms of trust, identity, or reputation, not
       just features or price."  (t/p/f)
```

### 6. Cornered resource (2 evidence; max 4)

```
CLAIM: "We have exclusive access to something competitors want and can't get."  (have / maybe / no)
EVIDENCE:
  E1: "We can name the asset (talent, IP, a contract, a dataset, a supply relationship)
       and why a rival can't simply buy or build their own."  (true/partly/false)
  E2: "If a competitor offered to pay for the same access, the holder is contractually
       or practically unable to provide it."  (t/p/f)
```

### 7. Process power (2 evidence; max 4)

```
CLAIM: "We have a way of operating that rivals have tried and failed to copy."  (have / maybe / no)
EVIDENCE:
  E1: "A competitor who hired away our people would still take years to replicate how we
       work, because it's embedded across the org, not held in a few heads."  (true/partly/false)
  E2: "The advantage compounds (each quarter the gap widens) rather than being a one-time
       head start."  (t/p/f)
```

**Count:** 7 claims + 18 evidence = 25 questions.

---

## Per-power narration line — benefit AND barrier

One paragraph per power the host model uses for the `PER_POWER_DETAIL` section. Each names the **benefit** (the advantage delivered) and the **barrier** (why rivals can't replicate), per `seven-powers.md`: Power = Benefit × Barrier, both required. Each ends with the realness test that separates the power from its lookalike.

**Scale economies.** Benefit: lower unit cost lets you price below rivals or reinvest the margin. Barrier: a smaller competitor literally cannot match your cost structure until they reach your volume, and getting there means losing money on the way. The realness test: name the cost that falls per unit. "Our costs went down as we grew" is operating leverage, not a power, if a rival your size gets the same break.

**Network economies.** Benefit: each user makes the product more valuable to the next, so value rises without you adding work. Barrier: a competitor starts from an empty network and can't deliver that value on day one regardless of funding. This is the reflexively over-claimed power. Helmer's bar is to name the specific interaction between users; "more users = good" is scale ambition, not a network effect.

**Counter-positioning.** Benefit: you run a model that serves customers better on some axis. Barrier: the incumbent can't copy it without damaging their existing, larger business (cannibalization, channel conflict, margin collapse), so they rationally decline. The barrier lives in the incumbent's P&L, not in your product. If they simply haven't gotten to it yet, you have a head start, not counter-positioning.

**Switching costs.** Benefit: once customers commit, staying is the path of least resistance. Barrier: leaving costs them real money, time, data, or risk, so they tolerate more before they churn. The honest test: would a customer who slightly prefers a rival still stay because moving hurts? If a competitor can lift them out in an afternoon, you don't have it.

**Branding.** Benefit: willingness to pay above functional value, from trust or identity. Barrier: a rival can match your features but can't manufacture decades of reputation or the customer's sense of who they are by using you. The trap is confusing "people like our brand" with "people pay more because of it." The test is a sustained price premium over a functionally-equal alternative.

**Cornered resource.** Benefit: exclusive access to a coveted asset (talent, IP, supply, data) that produces value. Barrier: rivals can't buy or build their own version on comparable terms. The test is exclusivity, not quality. A great team is a cornered resource only if a competitor can't simply hire an equivalent one. Per `ai-data-as-moat.md`, a proprietary dataset qualifies only when it combines exclusive access with a scale advantage rivals can't reach.

**Process power.** Benefit: a way of operating that produces better output or lower cost. Barrier: it's embedded across the org and compounds, so a rival who copies the visible parts (or hires your people) still can't reproduce it quickly. The test is whether it survives losing key individuals and whether the gap widens over time. A clever process one person could write down on a page is not process power.

---

## Testable-signal template per power (7 signals)

For each power classified HAS EVIDENCE or PLAUSIBLE, the narration names **one observable signal in the next quarter** that would confirm or kill it, anchored in `seven-powers.md`.

| Power | Test next quarter |
|---|---|
| **Scale economies** | Gross margin per unit improves as monthly volume rises, and the improvement is not explained by a one-time price change or supplier deal. If margin is flat as you scale, the cost curve isn't bending. |
| **Network economies** | Cohort N+1's week-4 value (retention or core-action depth) exceeds cohort N's, controlling for product changes. If later cohorts don't get more value than earlier ones, the network isn't compounding. |
| **Counter-positioning** | A named incumbent publicly declines, or visibly hesitates, to match your model this quarter, or an analyst or competitor cites cannibalization as the reason. If they ship a copy without pain, the barrier was imaginary. |
| **Switching costs** | Voluntary churn among 12-month-plus customers stays below your target even after a price increase. If a price increase triggers churn from tenured customers, the switching cost was lower than you thought. |
| **Branding** | In a head-to-head where a cheaper, functionally-equal rival is present, your win rate or price premium holds. If you only win when you're also the cheapest, the premium is price, not brand. |
| **Cornered resource** | The exclusive access survives a quarter in which a competitor actively tries to obtain it (poaches, bids, builds). If they replicate it within the quarter, it was never cornered. |
| **Process power** | A hire poached from a competitor, or a competitor's public attempt to copy your method, fails to close the output or cost gap this quarter. If the gap closes the moment someone leaves or talks, it lived in people, not process. |

---

## Synthetic company profiles (golden-set evals)

Five profiles with expected classifications and headlines, including the classic "claims network effects, has none" case. Used to validate the deterministic engine and the narration's faithfulness.

**golden-7p-01 — the reflexive network-effects claim (the classic delusion case)**
> A vertical SaaS for dental practices. The founder pitches "network effects" because more practices on the platform means more aggregate data. In reality each practice uses the product in isolation; one practice's usage does not make the product more valuable to another. Switching costs are real: patient records, scheduling, and billing all live in the system, and staff have built their day around it.
>
> Claim answers: network = have, switching = maybe, all others = no.

Expected: **Network economies DELUSIONAL** (claim have, evidence absent — no user-to-user interaction). **Switching costs HAS EVIDENCE or PLAUSIBLE** (records + workflows). Honest headline: "You're claiming network effects you don't have and underselling the switching costs you do."

**golden-7p-02 — genuine marketplace network effect**
> A two-sided freelance marketplace. More clients attract more freelancers and vice versa; a new client this year gets more and better proposals than a new client would have a year ago. A well-funded clone would launch into empty supply. The team can name the interaction: a client's brief draws competing proposals, and proposal quality rises with freelancer density.
>
> Claim answers: network = have, switching = maybe, branding = maybe, others = no.

Expected: **Network economies HAS EVIDENCE.** Test next quarter: cohort N+1 week-4 proposal quality or match rate exceeds cohort N. Headline: "The network effect is real; liquidity is the whole moat, so defend density before features."

**golden-7p-03 — scale economy mistaken for operating leverage**
> A DTC subscription box. The founder claims scale economies because cost per box dropped as the company grew. But the drop is fixed overhead spreading across more boxes; a rival at the same scale gets the same supplier terms and the same fulfillment rates. No structural per-unit cost barrier.
>
> Claim answers: scale = have, branding = maybe, others = no.

Expected: **Scale economies ABSENT or OVERSTATED** (claim have, evidence absent/plausible). Honest headline: "Lower cost per box is operating leverage, not a power; a competitor your size pays exactly what you pay."

**golden-7p-04 — counter-positioning blind spot**
> A low-cost fintech whose flat-subscription model (no percentage-of-assets fee) the incumbent wealth managers structurally can't match without gutting their fee revenue. The founder answers counter-positioning = no because they have never heard the term, but the evidence questions all rate true: a named incumbent's fee base shrinks if they copy, and they have publicly declined to.
>
> Claim answers: counter-positioning = no, switching = maybe, others = no.

Expected: **Counter-positioning BLIND SPOT** (claim no, evidence has-evidence). Headline: "You may have counter-positioning and you're not leaning on it; the incumbents' fee base is your moat, so name it."

**golden-7p-05 — branding overstated**
> A premium coffee subscription that claims a brand power. Customers say they like the brand, but in blind head-to-heads they pick on price, and the company only retains promo-driven cohorts. Evidence is thin: there is no functionally-equal cheaper rival they beat without discounting.
>
> Claim answers: branding = have, switching = maybe, cornered resource = maybe, others = no.

Expected: **Branding OVERSTATED or DELUSIONAL** (claim have, evidence plausible/absent). Headline: "People like your brand; they don't yet pay more for it. That gap is the whole finding."
