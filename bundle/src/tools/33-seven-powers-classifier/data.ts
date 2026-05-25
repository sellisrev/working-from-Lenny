import type {
  SevenPowersClaim,
  SevenPowersEvidence,
  SevenPowersClassificationT,
  SevenPowersFlagT,
  SevenPowersPowerSlug,
} from "../../shared/schemas";

/**
 * #33 7 Powers Self-Classifier deterministic data.
 *
 * Source of truth: apps/33-seven-powers-classifier/prompt.md +
 * apps/33-seven-powers-classifier/authoring.md. Wizard shape clones #9 NSM
 * Finder; the novel mechanic is the claim-vs-evidence matrix and the
 * delusion / overstated / blind-spot flags raised where a power's claim and
 * evidence diverge. Per Hamilton Helmer (seven-powers.md): Power = Benefit ×
 * Barrier — both halves required.
 *
 * Per-power evidence count is variable (network / scale / counter-positioning
 * / switching get 3 evidence questions; branding / cornered resource /
 * process get 2), landing the bank at 7 claims + 18 evidence = 25 questions.
 */

export interface PowerDef {
  /** Stable key — matches the SevenPowersAnswers object keys. */
  slug: SevenPowersPowerSlug;
  name: string;
  claim_question: string;
  /** 2 or 3 specific, observable evidence questions (true / partly / false). */
  evidence_questions: string[];
  /** Closed corpus-anchor subset (all from CORPUS_ANCHORS). */
  anchors: string[];
  /** Authored benefit-AND-barrier reading (PER_POWER_DETAIL grounding). */
  benefit_barrier: string;
  /** Authored "one observable signal next quarter" that confirms or kills it. */
  test_next_quarter: string;
}

export const CORPUS_ANCHORS = [
  "seven-powers",
  "good-strategy-rumelt",
  "distribution-as-moat",
  "ai-data-as-moat",
  "category-creation",
];

export const POWERS: PowerDef[] = [
  {
    slug: "scale_economies",
    name: "Scale economies",
    claim_question:
      "Our unit costs fall as we grow, in a way rivals can't match. (have / maybe / no)",
    evidence_questions: [
      "We already have lower unit costs than smaller rivals, OR a meaningfully larger competitor would have lower unit costs than us today.",
      "We can name the specific cost that falls per unit as volume rises (compute, logistics, content production, support), not just 'overhead spreads out.'",
      "A new entrant operating at our current scale would lose money serving customers at our prices.",
    ],
    anchors: ["seven-powers", "good-strategy-rumelt"],
    benefit_barrier:
      "Benefit: lower unit cost lets you price below rivals or reinvest the margin. Barrier: a smaller competitor literally cannot match your cost structure until they reach your volume, and getting there means losing money on the way. The realness test: name the cost that falls per unit. 'Our costs went down as we grew' is operating leverage, not a power, if a rival your size gets the same break.",
    test_next_quarter:
      "Gross margin per unit improves as monthly volume rises, and the improvement is not explained by a one-time price change or supplier deal. If margin is flat as you scale, the cost curve isn't bending.",
  },
  {
    slug: "network_economies",
    name: "Network economies",
    claim_question: "We have network effects. (have / maybe / no)",
    evidence_questions: [
      "A new user gets measurably more value this month than they would have a year ago, because of other users.",
      "A well-funded competitor launching today would struggle to get our users value because they'd start with an empty network.",
      "We can name the specific interaction between users that creates the value (not just 'more users = good').",
    ],
    anchors: ["seven-powers", "distribution-as-moat"],
    benefit_barrier:
      "Benefit: each user makes the product more valuable to the next, so value rises without you adding work. Barrier: a competitor starts from an empty network and can't deliver that value on day one regardless of funding. This is the reflexively over-claimed power. Helmer's bar is to name the specific interaction between users; 'more users = good' is scale ambition, not a network effect.",
    test_next_quarter:
      "Cohort N+1's week-4 value (retention or core-action depth) exceeds cohort N's, controlling for product changes. If later cohorts don't get more value than earlier ones, the network isn't compounding.",
  },
  {
    slug: "counter_positioning",
    name: "Counter-positioning",
    claim_question:
      "We do something an incumbent can't copy without hurting their own business. (have / maybe / no)",
    evidence_questions: [
      "We can name a specific incumbent whose existing revenue or model would shrink if they copied our approach.",
      "That incumbent has seen what we do and has chosen NOT to match it, rather than merely being slow to.",
      "The reason they won't copy us is structural (cannibalization, channel conflict, margin collapse), not just that they haven't gotten around to it.",
    ],
    anchors: ["seven-powers", "good-strategy-rumelt", "category-creation"],
    benefit_barrier:
      "Benefit: you run a model that serves customers better on some axis. Barrier: the incumbent can't copy it without damaging their existing, larger business (cannibalization, channel conflict, margin collapse), so they rationally decline. The barrier lives in the incumbent's P&L, not in your product. If they simply haven't gotten to it yet, you have a head start, not counter-positioning.",
    test_next_quarter:
      "A named incumbent publicly declines, or visibly hesitates, to match your model this quarter, or an analyst or competitor cites cannibalization as the reason. If they ship a copy without pain, the barrier was imaginary.",
  },
  {
    slug: "switching_costs",
    name: "Switching costs",
    claim_question:
      "Customers would find it costly to leave us. (have / maybe / no)",
    evidence_questions: [
      "Leaving means losing data, history, or config they can't easily recreate.",
      "Their team has built workflows or integrations around us.",
      "We can cite a churned customer who came back because switching hurt.",
    ],
    anchors: ["seven-powers", "distribution-as-moat"],
    benefit_barrier:
      "Benefit: once customers commit, staying is the path of least resistance. Barrier: leaving costs them real money, time, data, or risk, so they tolerate more before they churn. The honest test: would a customer who slightly prefers a rival still stay because moving hurts? If a competitor can lift them out in an afternoon, you don't have it.",
    test_next_quarter:
      "Voluntary churn among 12-month-plus customers stays below your target even after a price increase. If a price increase triggers churn from tenured customers, the switching cost was lower than you thought.",
  },
  {
    slug: "branding",
    name: "Branding",
    claim_question:
      "Customers pay us more than a functionally-equal alternative because of who we are. (have / maybe / no)",
    evidence_questions: [
      "There is a competitor whose product is roughly as good, who charges less, and we still win the customer.",
      "Customers describe choosing us in terms of trust, identity, or reputation, not just features or price.",
    ],
    anchors: ["seven-powers", "category-creation"],
    benefit_barrier:
      "Benefit: willingness to pay above functional value, from trust or identity. Barrier: a rival can match your features but can't manufacture decades of reputation or the customer's sense of who they are by using you. The trap is confusing 'people like our brand' with 'people pay more because of it.' The test is a sustained price premium over a functionally-equal alternative.",
    test_next_quarter:
      "In a head-to-head where a cheaper, functionally-equal rival is present, your win rate or price premium holds. If you only win when you're also the cheapest, the premium is price, not brand.",
  },
  {
    slug: "cornered_resource",
    name: "Cornered resource",
    claim_question:
      "We have exclusive access to something competitors want and can't get. (have / maybe / no)",
    evidence_questions: [
      "We can name the asset (talent, IP, a contract, a dataset, a supply relationship) and why a rival can't simply buy or build their own.",
      "If a competitor offered to pay for the same access, the holder is contractually or practically unable to provide it.",
    ],
    anchors: ["seven-powers", "ai-data-as-moat"],
    benefit_barrier:
      "Benefit: exclusive access to a coveted asset (talent, IP, supply, data) that produces value. Barrier: rivals can't buy or build their own version on comparable terms. The test is exclusivity, not quality. A great team is a cornered resource only if a competitor can't simply hire an equivalent one. Per ai-data-as-moat.md, a proprietary dataset qualifies only when it combines exclusive access with a scale advantage rivals can't reach.",
    test_next_quarter:
      "The exclusive access survives a quarter in which a competitor actively tries to obtain it (poaches, bids, builds). If they replicate it within the quarter, it was never cornered.",
  },
  {
    slug: "process_power",
    name: "Process power",
    claim_question:
      "We have a way of operating that rivals have tried and failed to copy. (have / maybe / no)",
    evidence_questions: [
      "A competitor who hired away our people would still take years to replicate how we work, because it's embedded across the org, not held in a few heads.",
      "The advantage compounds (each quarter the gap widens) rather than being a one-time head start.",
    ],
    anchors: ["seven-powers", "good-strategy-rumelt"],
    benefit_barrier:
      "Benefit: a way of operating that produces better output or lower cost. Barrier: it's embedded across the org and compounds, so a rival who copies the visible parts (or hires your people) still can't reproduce it quickly. The test is whether it survives losing key individuals and whether the gap widens over time. A clever process one person could write down on a page is not process power.",
    test_next_quarter:
      "A hire poached from a competitor, or a competitor's public attempt to copy your method, fails to close the output or cost gap this quarter. If the gap closes the moment someone leaves or talks, it lived in people, not process.",
  },
];

export function powerBySlug(slug: SevenPowersPowerSlug): PowerDef {
  const p = POWERS.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown power slug ${slug}`);
  return p;
}

export function evidenceValue(e: SevenPowersEvidence): number {
  if (e === "true") return 2;
  if (e === "partly") return 1;
  return 0;
}

export interface PowerResult {
  evidence_score: number;
  evidence_max: number;
  evidence_pct: number;
  classification: SevenPowersClassificationT;
  flag: SevenPowersFlagT | null;
}

/**
 * Per-power classification + divergence flag. Thresholds per prompt.md:
 *   has-evidence  pct >= 0.66
 *   plausible     0.34 <= pct < 0.66
 *   absent        pct < 0.34
 * Divergence flags fire only where the user's claim and the evidence disagree.
 */
export function classifyPower(
  def: PowerDef,
  claim: SevenPowersClaim,
  evidence: SevenPowersEvidence[],
): PowerResult {
  const evidenceScore = evidence.reduce((s, e) => s + evidenceValue(e), 0);
  const evidenceMax = 2 * def.evidence_questions.length;
  const evidencePct = evidenceMax > 0 ? evidenceScore / evidenceMax : 0;

  let classification: SevenPowersClassificationT;
  if (evidencePct >= 0.66) classification = "has-evidence";
  else if (evidencePct >= 0.34) classification = "plausible";
  else classification = "absent";

  let flag: SevenPowersFlagT | null = null;
  if (claim === "have" && classification === "absent") flag = "delusional";
  else if (claim === "have" && classification === "plausible") flag = "overstated";
  else if (claim === "no" && classification === "has-evidence") flag = "blind-spot";

  return {
    evidence_score: evidenceScore,
    evidence_max: evidenceMax,
    evidence_pct: evidencePct,
    classification,
    flag,
  };
}
