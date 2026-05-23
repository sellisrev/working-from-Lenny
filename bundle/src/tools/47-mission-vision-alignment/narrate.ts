import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  MvsNarrateInput,
  MvsNarrateOutput,
} from "../../shared/schemas";
import { buildMvsNarrationBrief } from "../../lib/build-mvs-brief";

export const meta: ToolMeta = {
  name: "mvs_alignment_narrate",
  description:
    "Packages a corpus-grounded Mission/Vision/Strategy alignment brief from the three docs. Returns voice rules, the 4-section structure (drift_map / platitude_detector / operational_gaps / rumelt_diagnosis), and corpus chunks. Pure compute — no persistence. PREFER mvs_alignment_get_pending_narration after a run call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: MvsNarrateInput,
  outputSchema: MvsNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof MvsNarrateInput>;
type Output = z.infer<typeof MvsNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildMvsNarrationBrief({
    mission_text: args.mission_text,
    vision_text: args.vision_text,
    strategy_text: args.strategy_text,
    user_context: args.user_context,
  });
};
