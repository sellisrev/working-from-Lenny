import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HowYouBuildNarrateInput,
  HowYouBuildNarrateOutput,
} from "../../shared/schemas";
import { buildHowYouBuildNarrationBrief } from "../../lib/build-how-you-build-brief";

export const meta: ToolMeta = {
  name: "how_you_build_narrate",
  description:
    "Packages a corpus-free parody narration brief for the supplied team composition + mode. Returns voice rules, structure, the team inputs + pre-assembled [INPUT] block, and an empty corpus map (the parody is voice/structure work, not corpus-grounded). The host chat model renders the user-facing parody from this brief. Pure compute — no persistence side-effect. PREFER how_you_build_get_pending_narration after a how_you_build_generate call (returns the brief generate already saved). Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: HowYouBuildNarrateInput,
  outputSchema: HowYouBuildNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HowYouBuildNarrateInput>;
type Output = z.infer<typeof HowYouBuildNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildHowYouBuildNarrationBrief({
    mode: args.mode,
    team: args.team,
    user_context: args.user_context,
  });
};
