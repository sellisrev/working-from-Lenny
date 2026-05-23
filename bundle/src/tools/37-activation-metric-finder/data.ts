import type { ActivationInputsT, NSMBusinessShape } from "../../shared/schemas";

/**
 * #37 Activation Metric Finder deterministic data.
 *
 * Source of truth: apps/37-activation-metric-finder/prompt.md. Pairs with
 * #9 NSM Finder via a shared input-metrics tree shape — both apps target
 * the same wizard inputs (business shape / monetization / stage etc.) so a
 * user running both can copy-paste between them.
 */

export interface FieldOption { value: string; label: string }
export interface FieldDef {
  key: keyof ActivationInputsT;
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
    placeholder: "e.g. we're an AI product with a wow-moment that's separate from the aha-moment",
    max_length: 200,
  },
  {
    key: "primary_value_action",
    label: "When a user gets value, what specific thing did they just do?",
    kind: "text",
    required: true,
    placeholder: "e.g. completed a workout, sent a payment, published a doc",
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
    key: "current_activation_rate_estimate",
    label: "Current activation rate estimate (optional)",
    kind: "text",
    required: false,
    placeholder: "e.g. ~18%",
    max_length: 20,
  },
  {
    key: "aha_moment_guess",
    label: "What do you think the 'aha moment' is for your product? (optional)",
    kind: "text",
    required: false,
    placeholder: "e.g. seeing the first edited doc come back with comments",
    max_length: 200,
  },
  {
    key: "funnel_paste",
    label: "Paste your current activation funnel (optional, one step per line, top to bottom)",
    kind: "textarea",
    required: false,
    placeholder: "Sign-up\nEmail verify\nOnboarding tour\nFirst action\n...",
    max_length: 2000,
  },
];

export const CORPUS_ANCHORS = [
  "activation-metric",
  "retention",
  "cohort-retention",
  "hierarchy-of-engagement",
  "marketplace-metrics",
  "pm-pitfalls",
];

/**
 * business-shape → typical activation-event family per apps/37-activation-
 * metric-finder/prompt.md. Marketplace branches by side.
 */
export function resolveActivationFamily(
  shape: NSMBusinessShape,
  marketplaceSide?: "supply" | "demand" | "both",
): string {
  switch (shape) {
    case "b2c-subscription":
      return "First session-of-value within 7 days";
    case "b2c-transactional":
      return "First purchase + repeat-intent signal";
    case "b2b-plg":
      return "Workspace creation + team-of-3+ engagement";
    case "b2b-sales-led":
      return "First stakeholder-value-moment + decision-maker buy-in";
    case "prosumer":
      return "Power-user depth signal (usage threshold)";
    case "marketplace":
      if (marketplaceSide === "supply")
        return "First listing posted that gets matched";
      if (marketplaceSide === "demand")
        return "First matched transaction completed";
      return "First matched transaction (both sides participate)";
  }
}

export const ACTIVATION_FAMILIES: { business_shape: NSMBusinessShape; family: string }[] = [
  { business_shape: "b2c-subscription", family: resolveActivationFamily("b2c-subscription") },
  { business_shape: "b2c-transactional", family: resolveActivationFamily("b2c-transactional") },
  { business_shape: "b2b-plg", family: resolveActivationFamily("b2b-plg") },
  { business_shape: "b2b-sales-led", family: resolveActivationFamily("b2b-sales-led") },
  { business_shape: "marketplace", family: resolveActivationFamily("marketplace", "both") },
  { business_shape: "prosumer", family: resolveActivationFamily("prosumer") },
];

export function parseFunnelLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Heuristic AI-product flag. The corpus has an AI-specific two-funnel
 * (wow-moment vs aha-moment) framing developed in activation-metric.md
 * (Cat Wu's framing). When the user's business_unusual / primary_value_action
 * / aha_moment_guess mentions an AI signal, the brief includes the
 * AI-product caveat in the per-candidate benchmark range.
 *
 * Word-boundary regex matching. 'model' alone is too generic (matches
 * 'pricing model'); we require it to appear next to an AI-context word like
 * 'language model', 'ai model', 'foundation model'.
 */
const AI_REGEX = /\b(?:ai|llm|gpt|claude|copilot|agentic|generative|language model|ml model|foundation model|fine-tun)\b/;

export function isAiProductFlagged(inputs: ActivationInputsT): boolean {
  const hay = (inputs.business_unusual + " " + inputs.primary_value_action +
    " " + inputs.aha_moment_guess).toLowerCase();
  return AI_REGEX.test(hay);
}
