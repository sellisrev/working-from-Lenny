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

export type EvalFieldKey =
  | "feature_one_liner"
  | "audience"
  | "failure_modes"
  | "practice.correctness"
  | "practice.refusal_behavior"
  | "practice.latency"
  | "practice.hallucination_rate"
  | "practice.jailbreak_resistance"
  | "practice.regression_set"
  | "practice.drift_detection"
  | "methodology_paste";

export interface EvalFieldDef {
  key: EvalFieldKey;
  label: string;
  placeholder: string;
  max_length: number;
  kind: "text" | "textarea";
  section: "feature" | "practice" | "methodology";
  required: boolean;
  accepts_file?: boolean;
}

/**
 * Field metadata. The form is grouped into three sections:
 *   - feature: who/what/known-failures (required)
 *   - practice: per-category current-state answers (all optional; blank →
 *     missing-by-default)
 *   - methodology: optional paste + file upload of the full eval doc
 */
export const FIELDS: EvalFieldDef[] = [
  { key: "feature_one_liner", label: "Feature one-liner", placeholder: "What the AI feature does", max_length: 200, kind: "text", section: "feature", required: true },
  { key: "audience", label: "Audience", placeholder: "Who uses it", max_length: 200, kind: "text", section: "feature", required: true },
  { key: "failure_modes", label: "Known failure modes", placeholder: "What could go wrong, in your own framing", max_length: 300, kind: "textarea", section: "feature", required: true },

  { key: "practice.correctness", label: "Correctness — what do you currently do?", placeholder: "e.g. 200-example golden set, weekly run, 95% pass threshold (or 'nothing yet')", max_length: 300, kind: "textarea", section: "practice", required: false },
  { key: "practice.refusal_behavior", label: "Refusal behavior — what do you currently do?", placeholder: "e.g. 50-prompt out-of-scope set, manual review (or 'nothing yet')", max_length: 300, kind: "textarea", section: "practice", required: false },
  { key: "practice.latency", label: "Latency — what do you currently track?", placeholder: "e.g. p50 / p95 / p99 in prod dashboards, alert at p95 > 2s", max_length: 300, kind: "textarea", section: "practice", required: false },
  { key: "practice.hallucination_rate", label: "Hallucination rate — how do you measure it?", placeholder: "e.g. citation-verifiability eval on 100 outputs / week", max_length: 300, kind: "textarea", section: "practice", required: false },
  { key: "practice.jailbreak_resistance", label: "Jailbreak resistance — what's in your eval set?", placeholder: "e.g. ~10 adversarial prompts borrowed from OWASP LLM list", max_length: 300, kind: "textarea", section: "practice", required: false },
  { key: "practice.regression_set", label: "Regression set — what changes when you swap model/prompt?", placeholder: "e.g. 80-case regression suite, re-run on every prompt rev", max_length: 300, kind: "textarea", section: "practice", required: false },
  { key: "practice.drift_detection", label: "Drift detection — what do you watch in production?", placeholder: "e.g. weekly input-length histogram, alert on category-share shift", max_length: 300, kind: "textarea", section: "practice", required: false },

  { key: "methodology_paste", label: "Eval methodology / report (optional)", placeholder: "Paste your eval doc, runbook, or report here. Use the file picker to load a .md / .txt / .json from disk.", max_length: 8000, kind: "textarea", section: "methodology", required: false, accepts_file: true },
];
