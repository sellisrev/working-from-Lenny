import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PitfallNarrateInput,
  PitfallNarrateOutput,
} from "../../shared/schemas";
import {
  buildPitfallNarrationBrief,
  assertTopThree,
} from "../../lib/build-narration-brief";

export const meta: ToolMeta = {
  name: "pm_pitfalls_narrate",
  description:
    "Packages a corpus-grounded narration brief for the user's top three pitfalls. Returns voice rules, structure, picks (pitfall text + exemplar quote + corpus anchors), and the corpus chunks themselves. The host chat model renders the user-facing narration from this brief. Pure compute — no persistence side-effect. PREFER pm_pitfalls_get_pending_narration after a score call (returns the brief score already saved, always grounded in the user's actual answers). Only call this tool directly if you need a brief without round-tripping through disk, or when answers are unavailable (returns a generic ungrounded brief in that case). Pass the user's 20 answers as `answers` to make the brief grounded (full_audit per pitfall, directive references their actual answers); omitting `answers` produces an ungrounded brief.",
  inputSchema: PitfallNarrateInput,
  outputSchema: PitfallNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PitfallNarrateInput>;
type Output = z.infer<typeof PitfallNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildPitfallNarrationBrief({
    score_display: args.score_display,
    top_three_pitfall_ids: assertTopThree(args.top_three_pitfall_ids),
    user_context: args.user_context,
    answers: args.answers,
  });
};
