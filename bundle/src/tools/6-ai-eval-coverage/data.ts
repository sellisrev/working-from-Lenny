import type { EvalCategory } from "../../shared/schemas";

/**
 * #6 AI Eval Coverage Scorecard deterministic data.
 *
 * Source of truth: apps/6-ai-eval-coverage/prompt.md. The seven categories
 * are fixed and locked; the per-category status (covered / partial / missing)
 * is inferred by the host chat model from the user's three free-text
 * inputs. The deterministic scoring formula lives in the brief so the host
 * model computes and renders the score consistently.
 */

export interface CategoryDef {
  slug: EvalCategory;
  label: string;
  summary: string;
  common_omission: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "correctness",
    label: "Correctness",
    summary: "Does the model produce factually accurate outputs for the stated task?",
    common_omission: "Most teams test for the happy path; tail-distribution accuracy is the gap.",
  },
  {
    slug: "refusal-behavior",
    label: "Refusal behavior",
    summary: "Does the model decline appropriately when the task is out of scope or unsafe?",
    common_omission: "Refusal-set evals are usually missing or overlap with safety filters.",
  },
  {
    slug: "latency",
    label: "Latency",
    summary: "Does p50, p95, p99 latency meet user expectations for the interaction shape?",
    common_omission: "Teams measure mean and ignore tails.",
  },
  {
    slug: "hallucination-rate",
    label: "Hallucination rate",
    summary: "When the model is uncertain, does it hallucinate or hedge?",
    common_omission: "Often tested only on closed-ended factuality, not open generation.",
  },
  {
    slug: "jailbreak-resistance",
    label: "Jailbreak resistance",
    summary: "Can adversarial prompts coax the model past intended behavior?",
    common_omission: "Most internal eval sets have <10 jailbreak attempts.",
  },
  {
    slug: "regression-set",
    label: "Regression-set coverage",
    summary: "When the model is updated (new version, new prompt), do prior wins still pass?",
    common_omission: "Many teams have no regression set at all.",
  },
  {
    slug: "drift-detection",
    label: "Drift detection",
    summary: "When the input distribution shifts in production, does the team get a signal?",
    common_omission: "Almost no PM-led team has this.",
  },
];

export const CORPUS_ANCHORS = ["evals-for-ai-products", "ai-pm-skills"];

export const SCORING_FORMULA =
  "score = (3 * count(status='covered') + 1 * count(status='partial')) / 21 * 100, rounded to integer. Range 0-100.";

export const FIELDS: { key: "feature_one_liner" | "audience" | "failure_modes"; label: string; placeholder: string; max_length: number }[] = [
  { key: "feature_one_liner", label: "Feature one-liner", placeholder: "What the AI feature does (≤200 chars)", max_length: 200 },
  { key: "audience", label: "Audience", placeholder: "Who uses it (≤200 chars)", max_length: 200 },
  { key: "failure_modes", label: "Known failure modes", placeholder: "What could go wrong, in your own framing (≤300 chars)", max_length: 300 },
];
