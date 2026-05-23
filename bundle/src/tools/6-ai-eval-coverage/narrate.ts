import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  EvalNarrateInput,
  EvalNarrateOutput,
} from "../../shared/schemas";
import { buildEvalNarrationBrief } from "../../lib/build-eval-brief";

export const meta: ToolMeta = {
  name: "ai_eval_coverage_narrate",
  description:
    "Packages a corpus-grounded eval-coverage scorecard brief from the three feature inputs. Returns voice rules, structure (score / category_table / gaps_to_fill), the 7-category definition list, the deterministic scoring formula, and corpus chunks. Pure compute — no persistence. PREFER ai_eval_coverage_get_pending_narration after a score call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: EvalNarrateInput,
  outputSchema: EvalNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof EvalNarrateInput>;
type Output = z.infer<typeof EvalNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildEvalNarrationBrief({
    feature: args.feature,
    user_context: args.user_context,
  });
};
