import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  EvalScoreInput,
  EvalScoreOutput,
} from "../../shared/schemas";
import { buildEvalNarrationBrief } from "../../lib/build-eval-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "ai_eval_coverage_score",
  description:
    "Takes the eval-coverage inputs and persists the corpus-grounded scorecard brief. Required: feature_one_liner ≤200 / audience ≤200 / failure_modes ≤300. Optional but recommended: per-category practice answers (feature.practice.{correctness, refusal_behavior, latency, hallucination_rate, jailbreak_resistance, regression_set, drift_detection}, each ≤300 chars; blank = no current practice for that category, which the brief treats as missing-by-default) and feature.methodology_paste (≤8000 chars, the user's eval doc / runbook / report). AFTER calling this, render the score + 7-category table + starter eval prompts by calling ai_eval_coverage_get_pending_narration. Do not render the scorecard on your own without the brief — the brief carries the deterministic scoring formula, the closed category list, and the corpus anchors the starter prompts depend on. If `persistence_warning` is set, ask the user to re-submit.",
  inputSchema: EvalScoreInput,
  outputSchema: EvalScoreOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof EvalScoreInput>;
type Output = z.infer<typeof EvalScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { feature, user_context } = args;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildEvalNarrationBrief({ feature, user_context });
    await writePending(brief, { feature, user_context: user_context ?? "" });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] eval score: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via ai_eval_coverage_get_pending_narration will return no_pending. Ask the user to re-submit or call ai_eval_coverage_narrate directly.`;
  }

  return {
    feature,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
