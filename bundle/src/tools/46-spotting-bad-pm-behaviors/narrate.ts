import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  SpottingNarrateInput,
  SpottingNarrateOutput,
} from "../../shared/schemas";
import { buildSpottingBrief } from "../../lib/build-spotting-brief";

export const meta: ToolMeta = {
  name: "spotting_narrate",
  description:
    "Packages a corpus-grounded narration brief for the user's field-guide result. Returns voice rules, structure (READ → PATTERN_1..3 → FAIRNESS_CHECK), the picked patterns (behavior text + action rung + corpus anchors), the fairness-check applicability, and the corpus chunks themselves. Pure compute — no persistence side-effect. The host chat model renders the user-facing narration from this brief. To pick up the brief that score saved for the chat-side handoff, call spotting_get_pending_narration instead.",
  inputSchema: SpottingNarrateInput,
  outputSchema: SpottingNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SpottingNarrateInput>;
type Output = z.infer<typeof SpottingNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildSpottingBrief({
    severity_tier: args.severity_tier,
    total: args.total,
    top_patterns: args.top_patterns,
    user_context: args.user_context,
    answers: args.answers,
  });
};
