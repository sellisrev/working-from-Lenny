import type { NSMBusinessShape, NSMInputsT } from "../../shared/schemas";

/**
 * #9 North Star Metric Finder deterministic data.
 *
 * Source of truth: apps/9-nsm-finder/prompt.md. The deterministic side
 * collects nine structured inputs and resolves a business-shape → NSM-family
 * mapping (per the table in prompt.md). The host chat model handles the
 * generative work: candidate creation, per-candidate critique, input-metrics
 * tree, and the optional dashboard audit.
 */

export interface FieldOption { value: string; label: string }
export interface FieldDef {
  key: keyof NSMInputsT;
  label: string;
  kind: "enum" | "multi-enum" | "text" | "textarea";
  required: boolean;
  options?: FieldOption[];
  placeholder?: string;
  max_length?: number;
  only_when?: { key: string; equals: string };
}

export const FIELDS: FieldDef[] = [
  {
    key: "business_shape",
    label: "Business shape",
    kind: "enum",
    required: true,
    options: [
      { value: "b2c-subscription", label: "B2C subscription" },
      { value: "b2c-transactional", label: "B2C transactional" },
      { value: "b2b-plg", label: "B2B PLG" },
      { value: "b2b-sales-led", label: "B2B sales-led" },
      { value: "marketplace", label: "Marketplace" },
      { value: "prosumer", label: "Prosumer" },
    ],
  },
  {
    key: "marketplace_side",
    label: "Marketplace side",
    kind: "enum",
    required: false,
    only_when: { key: "business_shape", equals: "marketplace" },
    options: [
      { value: "supply", label: "Supply" },
      { value: "demand", label: "Demand" },
      { value: "both", label: "Both" },
    ],
  },
  {
    key: "business_unusual",
    label: "What makes you unusual (optional)",
    kind: "text",
    required: false,
    placeholder: "e.g. our buyers are also our sellers",
    max_length: 200,
  },
  {
    key: "primary_user_action",
    label: "Primary user value moment",
    kind: "text",
    required: true,
    placeholder: "e.g. completing a workout, sending a payment, publishing a doc",
    max_length: 200,
  },
  {
    key: "monetization",
    label: "Monetization (pick one or more)",
    kind: "multi-enum",
    required: true,
    options: [
      { value: "pay-per-use", label: "Pay-per-use" },
      { value: "subscription", label: "Subscription" },
      { value: "freemium-to-paid", label: "Freemium → paid" },
      { value: "seat-based", label: "Seat-based" },
      { value: "consumption-based", label: "Consumption-based" },
      { value: "ad-supported", label: "Ad-supported" },
      { value: "other", label: "Other" },
    ],
  },
  {
    key: "revenue_band",
    label: "Revenue band",
    kind: "enum",
    required: true,
    options: [
      { value: "pre-revenue", label: "Pre-revenue" },
      { value: "0-100k", label: "$0 - $100k" },
      { value: "100k-1m", label: "$100k - $1M" },
      { value: "1m-10m", label: "$1M - $10M" },
      { value: "10m-100m", label: "$10M - $100M" },
      { value: "100m-plus", label: "$100M+" },
    ],
  },
  {
    key: "stage",
    label: "Stage",
    kind: "enum",
    required: true,
    options: [
      { value: "pre-pmf", label: "Pre-PMF" },
      { value: "early-pmf", label: "Early PMF" },
      { value: "scaling", label: "Scaling" },
      { value: "mature", label: "Mature" },
    ],
  },
  {
    key: "friction_top",
    label: "Biggest friction right now",
    kind: "text",
    required: true,
    placeholder: "e.g. activation drops between sign-up and first value",
    max_length: 200,
  },
  {
    key: "dashboard_paste",
    label: "Paste your current dashboard (optional, one metric per line)",
    kind: "textarea",
    required: false,
    placeholder: "Weekly active users\nSign-ups\nRevenue\n...",
    max_length: 2000,
  },
];

export const CORPUS_ANCHORS = [
  "north-star-metric",
  "activation-metric",
  "growth-loops",
  "pm-pitfalls",
];

/**
 * business-shape → typical NSM family mapping per apps/9-nsm-finder/prompt.md.
 * The marketplace shape branches by side; everything else is direct.
 */
export function resolveNsmFamily(
  shape: NSMBusinessShape,
  marketplaceSide?: "supply" | "demand" | "both",
): string {
  switch (shape) {
    case "b2c-subscription":
      return "Weekly/monthly retained value-moments";
    case "b2c-transactional":
      return "Repeat purchase rate × order frequency";
    case "b2b-plg":
      return "Weekly active teams × retention shape";
    case "b2b-sales-led":
      return "Product-qualified accounts that convert";
    case "prosumer":
      return "Power-user engagement depth";
    case "marketplace":
      if (marketplaceSide === "supply")
        return "Active suppliers × listings per supplier";
      if (marketplaceSide === "demand")
        return "Matched-transaction rate per buyer cohort";
      // both (or unspecified) defaults to the two-sided liquidity NSM
      return "Liquidity rate (matched / posted) × repeat frequency";
  }
}

export const NSM_FAMILIES: { business_shape: NSMBusinessShape; family: string }[] = [
  { business_shape: "b2c-subscription", family: resolveNsmFamily("b2c-subscription") },
  { business_shape: "b2c-transactional", family: resolveNsmFamily("b2c-transactional") },
  { business_shape: "b2b-plg", family: resolveNsmFamily("b2b-plg") },
  { business_shape: "b2b-sales-led", family: resolveNsmFamily("b2b-sales-led") },
  { business_shape: "marketplace", family: resolveNsmFamily("marketplace", "both") },
  { business_shape: "prosumer", family: resolveNsmFamily("prosumer") },
];

/**
 * Splits a dashboard_paste string into trimmed non-empty lines. Used by both
 * the run handler (for has_dashboard / counts) and the brief (so the host
 * model sees a normalized list).
 */
export function parseDashboardLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
