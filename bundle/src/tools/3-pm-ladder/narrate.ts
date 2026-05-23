import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  LadderNarrateInput,
  LadderNarrateOutput,
} from "../../shared/schemas";
import { buildLadderNarrationBrief } from "../../lib/build-ladder-brief";

export const meta: ToolMeta = {
  name: "pm_ladder_narrate",
  description:
    "Packages a corpus-grounded gap-report brief from the user's per-dimension levels. Returns voice rules, structure, the dimensions + widest gap + level names, and the corpus chunks themselves. The host chat model renders the user-facing gap report from this brief. Pure compute — no persistence side-effect. PREFER pm_ladder_get_pending_narration after a pm_ladder_score call (returns the brief score already saved, always grounded in the user's actual answers). Only call this tool directly if you need a brief without round-tripping through disk, or when only the per-dimension levels are available (returns an ungrounded brief in that case). Pass `answers` (the 30 levels in question order) to make the brief grounded; omitting `answers` produces a general-to-the-levels brief.",
  inputSchema: LadderNarrateInput,
  outputSchema: LadderNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof LadderNarrateInput>;
type Output = z.infer<typeof LadderNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildLadderNarrationBrief({
    dimension_levels: args.dimension_levels,
    user_context: args.user_context,
    answers: args.answers,
  });
};
