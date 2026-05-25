import type { ChasmInputsT, ChasmStageT } from "../../shared/schemas";

/**
 * #34 Crossing-the-Chasm Stage Finder deterministic data.
 *
 * Source of truth: apps/34-crossing-the-chasm-stage/prompt.md +
 * authoring.md. Wizard shape clones #9 / #33; the novel mechanic is the
 * categorical rule cascade (not a score sum) — chasm position has dispositive
 * signals, so the cascade order is load-bearing and "at the chasm" surfaces as
 * its own diagnosis even though Moore treats it as a gap.
 */

export interface FieldOption { value: string; label: string }
export interface FieldDef {
  key: string;
  label: string;
  kind: "enum" | "customer-mix";
  required: boolean;
  options?: FieldOption[];
  help?: string;
}

export const FIELDS: FieldDef[] = [
  {
    key: "customer_mix",
    label: "Customer mix (three numbers, roughly summing to 100)",
    kind: "customer-mix",
    required: true,
    help: "% innovators/visionaries, % pragmatists, % you can't yet classify. The don't-know share is itself a signal.",
  },
  {
    key: "acquisition_trend",
    label: "Acquisition trend",
    kind: "enum",
    required: true,
    options: [
      { value: "accelerating", label: "Accelerating" },
      { value: "steady", label: "Steady" },
      { value: "stalling", label: "Stalling" },
      { value: "lumpy-referral-only", label: "Lumpy / referral-only" },
    ],
  },
  {
    key: "pain_specificity",
    label: "How specific is the pain you solve?",
    kind: "enum",
    required: true,
    options: [
      { value: "one-sentence-named-pain", label: "One-sentence named pain" },
      { value: "broad-value-prop", label: "Broad value prop" },
      { value: "still-figuring-it-out", label: "Still figuring it out" },
    ],
  },
  {
    key: "whole_product",
    label: "Can a mainstream buyer adopt you without assembling missing pieces themselves?",
    kind: "enum",
    required: true,
    options: [
      { value: "yes-complete", label: "Yes, complete" },
      { value: "partial", label: "Partial" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "beachhead_named",
    label: "Have you named a beachhead segment?",
    kind: "enum",
    required: true,
    options: [
      { value: "yes-one-segment", label: "Yes, one segment" },
      { value: "several-segments", label: "Several segments" },
      { value: "no-we-sell-to-anyone", label: "No, we sell to anyone" },
    ],
  },
  {
    key: "reference_customers",
    label: "Reference customers (optional)",
    kind: "enum",
    required: false,
    options: [
      { value: "pragmatist-references-exist", label: "Pragmatist references exist" },
      { value: "only-visionary-references", label: "Only visionary references" },
      { value: "none", label: "None" },
    ],
  },
];

export const CORPUS_ANCHORS = [
  "crossing-the-chasm",
  "category-creation",
  "consumer-business-stages",
  "b2b-pmf",
  "gtm-motions",
];

export interface StageContent {
  stage: ChasmStageT;
  label: string;
  why_here: string;
  next_stage_label: string | null;
  next_play: string;
  failure_mode: string;
  at_chasm_line?: string;
}

/** The five Moore stages + the per-transition play and failure mode. */
export const STAGE_CONTENT: Record<ChasmStageT, StageContent> = {
  "early-market": {
    stage: "early-market",
    label: "Early market",
    why_here:
      "You're selling to people who buy on vision and tolerate rough edges. What placed you here is that you can't yet name who you're for. That is normal this early, and it is the thing to fix before anything else: you cannot cross a chasm you haven't located.",
    next_stage_label: "the chasm",
    next_play:
      "Pick one beachhead and name it at the level of 'mid-market HR-tech for hospitality,' not 'B2B SaaS.' Aim the GTM motion at that single segment.",
    failure_mode:
      "The instinct to stay horizontal and chase every inbound segment at once. Going broad pre-crossing dilutes resources and you dominate nothing.",
  },
  "at-the-chasm": {
    stage: "at-the-chasm",
    label: "At the chasm",
    why_here:
      "You won early adopters and the engine is sputtering, because early-adopter referrals don't reach pragmatists. Per crossing-the-chasm.md, the early majority buys on proof from people like them, not on vision, and they don't share the innovator's tolerance for an incomplete product.",
    next_stage_label: "the bowling alley",
    next_play:
      "Build the whole product for ONE pragmatist segment (docs, integrations, references, support, not just code) and win it completely before adjacency.",
    failure_mode:
      "Declaring victory on visionary logos and assuming pragmatists will follow. They won't; they need proof from people like them, and an incomplete product reads as incomplete.",
    at_chasm_line:
      "This is the part where most products die. The one move that matters: stop trying to cross with the innovator pitch. Pick a single pragmatist beachhead and build the whole product for it before you spend another dollar going wide.",
  },
  "bowling-alley": {
    stage: "bowling-alley",
    label: "Bowling alley",
    why_here:
      "You've picked one segment and you're winning it with a whole product, and pragmatist references exist. Per Moore this is the springboard: dominate the niche (the corpus puts the bar at 30%+ segment share), then bridge to the adjacent segment, not to 'everyone.'",
    next_stage_label: "the tornado",
    next_play:
      "Standardize the offering, simplify install and onboarding, and prepare the GTM machine to scale when demand inflects.",
    failure_mode:
      "Over-customizing per deal so the product and the sales motion can't scale the moment the tornado hits.",
  },
  tornado: {
    stage: "tornado",
    label: "Tornado",
    why_here:
      "Mainstream pragmatist demand has inflected and acquisition is accelerating. The dynamics are land-grab: the constraint is no longer convincing buyers, it's shipping and scaling fast enough to take share before rivals do.",
    next_stage_label: "main street",
    next_play:
      "Defend share, segment the base, and keep extending the whole product into the next adjacency.",
    failure_mode:
      "Still running land-grab tactics after the grab is over, while ignoring the retention and segmentation work that actually compounds now.",
  },
  "main-street": {
    stage: "main-street",
    label: "Main street",
    why_here:
      "Pragmatists are the majority and growth has settled to steady or is starting to soften. The game is defend, segment, and extend the whole product.",
    next_stage_label: null,
    next_play:
      "Defend share, segment the base by need, and extend the whole product into adjacent jobs. Compounding now comes from retention and expansion, not new-logo land grabs.",
    failure_mode:
      "Running tornado land-grab tactics after the grab is over, while ignoring the retention and segmentation work that actually compounds now.",
  },
};

export interface StageResult {
  stage: ChasmStageT;
  placing_signals: string[];
}

function normalizeMix(mix: ChasmInputsT["customer_mix"]): {
  visionariesPct: number;
  pragmatistsPct: number;
  dontKnowPct: number;
} {
  const total =
    mix.innovators_visionaries + mix.pragmatists + mix.dont_know;
  const denom = total > 0 ? total : 1;
  return {
    visionariesPct: (mix.innovators_visionaries / denom) * 100,
    pragmatistsPct: (mix.pragmatists / denom) * 100,
    dontKnowPct: (mix.dont_know / denom) * 100,
  };
}

/**
 * Categorical rule cascade (authoring.md). Evaluated top to bottom; first
 * match wins. Returns the stage plus the two or three signals that placed it.
 */
export function assignStage(inputs: ChasmInputsT): StageResult {
  const { visionariesPct, pragmatistsPct, dontKnowPct } = normalizeMix(
    inputs.customer_mix,
  );
  const visionariesHeavy = visionariesPct >= 50;
  const pragmatistsMajority = pragmatistsPct >= 50;
  const dontKnowDominant = dontKnowPct > 50;
  const stalled =
    inputs.acquisition_trend === "stalling" ||
    inputs.acquisition_trend === "lumpy-referral-only";

  // Rule 1 — pre-chasm: you don't yet know who you're for.
  if (inputs.pain_specificity === "still-figuring-it-out" || dontKnowDominant) {
    const signals: string[] = [];
    if (inputs.pain_specificity === "still-figuring-it-out")
      signals.push("you're still figuring out the specific pain you solve");
    if (dontKnowDominant)
      signals.push("most of your customer mix is people you can't yet classify");
    return { stage: "early-market", placing_signals: signals };
  }

  // Rule 2 — at the chasm (dispositive).
  if (
    visionariesHeavy &&
    stalled &&
    inputs.whole_product !== "yes-complete"
  ) {
    return {
      stage: "at-the-chasm",
      placing_signals: [
        "a visionary-heavy customer base",
        `acquisition that has gone ${inputs.acquisition_trend === "stalling" ? "stalling" : "lumpy / referral-only"}`,
        "a whole product that isn't complete for a mainstream buyer",
      ],
    };
  }

  // Rule 3 — bowling alley.
  if (
    inputs.beachhead_named === "yes-one-segment" &&
    (inputs.whole_product === "partial" || inputs.whole_product === "yes-complete") &&
    inputs.reference_customers === "pragmatist-references-exist"
  ) {
    return {
      stage: "bowling-alley",
      placing_signals: [
        "a single named beachhead segment",
        "a whole product that mainstream buyers can adopt",
        "pragmatist reference customers who vouch for you",
      ],
    };
  }

  // Rule 4 — tornado.
  if (inputs.acquisition_trend === "accelerating" && pragmatistsMajority) {
    return {
      stage: "tornado",
      placing_signals: [
        "a pragmatist-majority customer base",
        "accelerating acquisition (mainstream demand has inflected)",
      ],
    };
  }

  // Rule 5 — main street.
  if (
    pragmatistsMajority &&
    (inputs.acquisition_trend === "steady" || inputs.acquisition_trend === "stalling")
  ) {
    return {
      stage: "main-street",
      placing_signals: [
        "a pragmatist-majority customer base",
        `acquisition that is ${inputs.acquisition_trend} (the land grab is over)`,
      ],
    };
  }

  // Rule 6 — ambiguous default.
  const signals = ["no single signal is dispositive yet"];
  if (!inputs.reference_customers || inputs.reference_customers === "none")
    signals.push("you haven't established pragmatist reference customers");
  if (inputs.beachhead_named !== "yes-one-segment")
    signals.push("your beachhead segment isn't narrowed to one");
  return { stage: "early-market", placing_signals: signals };
}
