import type {
  FounderInputsT,
  FounderPlaybook,
  FounderVerdict,
} from "../../shared/schemas";

/**
 * #12-38 Founder PM hire deterministic decision tree.
 *
 * Source of truth: apps/12-38-founder-pm-hire/prompt.md (decision tree
 * section). Eight inputs → one of five verdicts + optional playbook.
 *
 * The tree biases:
 *  - Toward `not-yet` for early stages (founders hire too early more often
 *    than too late; wrong-fit cost is high).
 *  - Away from `hire-head-of-product` for non-heavy density.
 */

export interface FieldOption {
  value: string;
  label: string;
}
export interface FieldDef {
  key:
    | "stage"
    | "team_size"
    | "pm_today"
    | "founder_time"
    | "enjoyment"
    | "ceo_bandwidth"
    | "product_density"
    | "bottleneck";
  label: string;
  kind: "enum" | "int";
  options?: FieldOption[];
  placeholder?: string;
}

export const FIELDS: FieldDef[] = [
  {
    key: "stage",
    label: "Stage",
    kind: "enum",
    options: [
      { value: "pre-seed", label: "Pre-seed" },
      { value: "seed", label: "Seed" },
      { value: "series-a", label: "Series A" },
      { value: "series-b-plus", label: "Series B+" },
    ],
  },
  {
    key: "team_size",
    label: "Team size (engineers + designers combined)",
    kind: "int",
    placeholder: "10",
  },
  {
    key: "pm_today",
    label: "Who does the PM work today",
    kind: "enum",
    options: [
      { value: "the-founder", label: "The founder" },
      { value: "doubling-up-engineer", label: "A doubling-up engineer" },
      { value: "doubling-up-designer", label: "A doubling-up designer" },
      { value: "ceo-and-head-eng", label: "The CEO and the head of eng together" },
      { value: "nobody", label: "Nobody (work goes undone)" },
    ],
  },
  {
    key: "founder_time",
    label: "Founder's time on product",
    kind: "enum",
    options: [
      { value: "rarely", label: "Rarely (<30%)" },
      { value: "some-of-the-time", label: "Some of the time (30-50%)" },
      { value: "most-of-the-time", label: "Most of the time (50-70%)" },
      { value: "full-time", label: "Full-time (>70%)" },
    ],
  },
  {
    key: "enjoyment",
    label: "Founder's enjoyment of PM work",
    kind: "enum",
    options: [
      { value: "enjoy", label: "Enjoy" },
      { value: "tolerate", label: "Tolerate" },
      { value: "dislike", label: "Dislike" },
    ],
  },
  {
    key: "ceo_bandwidth",
    label: "CEO bandwidth across other functions",
    kind: "enum",
    options: [
      { value: "room-to-add-product", label: "Room to add product" },
      { value: "stretched-but-functioning", label: "Stretched but functioning" },
      { value: "overstretched", label: "Overstretched" },
    ],
  },
  {
    key: "product_density",
    label: "Next 6 months' product density",
    kind: "enum",
    options: [
      { value: "light", label: "Light (refinement, hardening)" },
      { value: "moderate", label: "Moderate (steady shipping)" },
      { value: "heavy", label: "Heavy (new launches, expansions, bets)" },
    ],
  },
  {
    key: "bottleneck",
    label: "Biggest bottleneck right now",
    kind: "enum",
    options: [
      { value: "we-dont-know-what-to-build", label: "We don't know what to build" },
      { value: "we-cant-keep-up-with-stakeholders", label: "We can't keep up with stakeholder asks" },
      { value: "engineering-builds-wrong-thing", label: "Engineering keeps building the wrong thing" },
      { value: "no-time-for-customer-research", label: "No time for customer research" },
      { value: "no-time-for-strategy", label: "No time for strategy" },
    ],
  },
];

export const CORPUS_ANCHORS = [
  "founder-mode",
  "when-to-hire-first-pm",
  "pm-influence",
  "decision-making-frameworks",
];

export interface DecisionResult {
  verdict: FounderVerdict;
  playbook: FounderPlaybook | null;
}

/**
 * Decision tree per apps/12-38-founder-pm-hire/prompt.md. Tree runs in
 * order; later steps may cancel an earlier verdict and re-route.
 */
export function decide(inputs: FounderInputsT): DecisionResult {
  let verdict: FounderVerdict | null = null;
  let playbook: FounderPlaybook | null = null;

  // STEP 1 — not-yet by stage and team size (timing gate)
  if (inputs.stage === "pre-seed") {
    verdict = "not-yet";
    playbook = "pre-seed-founder-owns-product";
  } else if (inputs.stage === "seed" && inputs.team_size < 5) {
    verdict = "not-yet";
    playbook = "seed-early-team";
  } else if (
    inputs.stage === "seed" &&
    inputs.team_size < 12 &&
    (inputs.founder_time === "rarely" ||
      inputs.founder_time === "some-of-the-time")
  ) {
    verdict = "not-yet";
    playbook = "seed-founder-distracted";
  }

  // STEP 2 — bottleneck-based clarity gate (overrides any earlier not-yet
  // playbook if it fires)
  if (inputs.bottleneck === "we-dont-know-what-to-build") {
    verdict = "not-yet";
    playbook = "need-product-clarity-first";
  }

  // STEP 3 — forcing functions that cancel not-yet (only when stage > pre-seed)
  if (verdict === "not-yet" && inputs.stage !== "pre-seed") {
    if (
      inputs.pm_today === "nobody" ||
      inputs.ceo_bandwidth === "overstretched" ||
      inputs.bottleneck === "no-time-for-customer-research"
    ) {
      verdict = null;
      playbook = null;
    }
  }

  // STEP 4 — stay-founder-mode detector
  if (verdict === null) {
    const stayClearSignal =
      inputs.founder_time === "full-time" &&
      inputs.enjoyment === "enjoy" &&
      inputs.product_density !== "heavy" &&
      inputs.ceo_bandwidth !== "overstretched" &&
      inputs.bottleneck !== "no-time-for-customer-research" &&
      inputs.bottleneck !== "no-time-for-strategy";
    const lightDensitySignal =
      inputs.product_density === "light" &&
      (inputs.founder_time === "rarely" ||
        inputs.founder_time === "some-of-the-time") &&
      inputs.ceo_bandwidth !== "overstretched";
    if (stayClearSignal || lightDensitySignal) {
      verdict = "stay-founder-mode";
    }
  }

  // STEP 5 — level selection if hiring
  if (verdict === null) {
    if (
      inputs.product_density === "heavy" &&
      (inputs.ceo_bandwidth === "overstretched" ||
        inputs.stage === "series-a" ||
        inputs.stage === "series-b-plus" ||
        inputs.team_size >= 20)
    ) {
      verdict = "hire-head-of-product";
    } else if (
      inputs.product_density === "heavy" ||
      (inputs.stage === "series-a" && inputs.team_size >= 12) ||
      inputs.stage === "series-b-plus" ||
      ((inputs.founder_time === "full-time" ||
        inputs.founder_time === "most-of-the-time") &&
        inputs.product_density === "moderate" &&
        (inputs.enjoyment === "tolerate" || inputs.enjoyment === "dislike"))
    ) {
      verdict = "hire-empowered-pm";
    } else {
      verdict = "hire-apm";
    }
  }

  // STEP 6 — head-of-product down-bias safety net
  if (verdict === "hire-head-of-product" && inputs.product_density !== "heavy") {
    verdict = "hire-empowered-pm";
  }

  return { verdict: verdict as FounderVerdict, playbook };
}
