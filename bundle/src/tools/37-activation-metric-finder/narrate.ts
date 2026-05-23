import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  ActivationNarrateInput,
  ActivationNarrateOutput,
} from "../../shared/schemas";
import { buildActivationNarrationBrief } from "../../lib/build-activation-brief";

export const meta: ToolMeta = {
  name: "activation_finder_narrate",
  description:
    "Packages a corpus-grounded Activation Metric brief from the structured inputs. Returns voice rules, structure (FAMILY → CANDIDATE_1/2/3 → optional FUNNEL_AUDIT), the resolved activation-event family, normalized funnel lines, the AI-product-flagged indicator, and corpus chunks. Pure compute — no persistence. PREFER activation_finder_get_pending_narration after a run call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: ActivationNarrateInput,
  outputSchema: ActivationNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof ActivationNarrateInput>;
type Output = z.infer<typeof ActivationNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildActivationNarrationBrief({
    inputs: args.inputs,
    user_context: args.user_context,
  });
};
