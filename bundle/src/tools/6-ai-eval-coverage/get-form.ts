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
    "Entry tool for the AI Eval Coverage Scorecard. Calling this triggers the host to mount the ui://working-from-lenny/ai-eval-coverage resource (an interactive iframe with three grouped sections: feature context — required; current eval practice per category — optional; eval methodology paste with file-picker — optional). If your host mounts the UI, that IS the input surface — do NOT additionally render the prompts in chat as a duplicate surface; the user will fill them in the iframe, which calls ai_eval_coverage_score directly. Returns the seven fixed eval categories (correctness, refusal behavior, latency, hallucination rate, jailbreak resistance, regression-set coverage, drift detection) plus the field definitions grouped by section. If the user already has the inputs in hand, call ai_eval_coverage_score directly.",
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
      kind: f.kind,
      section: f.section,
      required: f.required,
      ...(f.accepts_file ? { accepts_file: true } : {}),
    })) as Output["fields"],
    categories: CATEGORIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      summary: c.summary,
      common_omission: c.common_omission,
    })) as Output["categories"],
    note: "Three sections: required feature context (one-liner / audience / failure modes), optional per-category current practice (7 fields — blank = missing-by-default), optional eval methodology paste with file picker (.md / .txt / .json / .csv / .log, ≤8000 chars). The deterministic scoring formula (3*covered + 1*partial) / 21 * 100 lives in the brief so the host model renders the score consistently.",
  };
};
