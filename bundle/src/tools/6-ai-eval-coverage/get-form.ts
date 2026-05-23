import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  EvalGetFormInput,
  EvalGetFormOutput,
} from "../../shared/schemas";
import { CATEGORIES, FIELDS } from "./data";

export const meta: ToolMeta = {
  name: "ai_eval_coverage_get_form",
  description:
    "Entry tool for the AI Eval Coverage Scorecard. Calling this triggers the host to mount the ui://working-from-lenny/ai-eval-coverage resource (an interactive iframe with three text inputs: feature one-liner / audience / failure modes). If your host mounts the UI, that IS the input surface — do NOT additionally render the three prompts in chat as a duplicate surface; the user will fill them in the iframe, which calls ai_eval_coverage_score directly. Returns the seven fixed eval categories (correctness, refusal behavior, latency, hallucination rate, jailbreak resistance, regression-set coverage, drift detection) plus the field definitions. If the user already has the three inputs in hand, call ai_eval_coverage_score directly.",
  inputSchema: EvalGetFormInput,
  outputSchema: EvalGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/ai-eval-coverage",
};

type Input = z.infer<typeof EvalGetFormInput>;
type Output = z.infer<typeof EvalGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    fields: FIELDS.map((f) => ({
      key: f.key,
      label: f.label,
      placeholder: f.placeholder,
      max_length: f.max_length,
    })) as Output["fields"],
    categories: CATEGORIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      summary: c.summary,
      common_omission: c.common_omission,
    })) as Output["categories"],
    note: "Three text inputs feed a 7-category coverage scorecard. The deterministic scoring formula (3*covered + 1*partial) / 21 * 100 lives in the brief so the host model renders the score consistently.",
  };
};
