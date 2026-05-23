import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  OkrNarrateInput,
  OkrNarrateOutput,
} from "../../shared/schemas";
import { buildOkrNarrationBrief } from "../../lib/build-okr-brief";

export const meta: ToolMeta = {
  name: "okr_critique_narrate",
  description:
    "Packages a corpus-grounded OKR critique brief from okr_text + stance + level. Returns voice rules, the deterministic objective/KR parse, the four-test structure, stance-specific synthesis hooks, and corpus chunks. Pure compute — no persistence. PREFER okr_critique_get_pending_narration after a run call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: OkrNarrateInput,
  outputSchema: OkrNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof OkrNarrateInput>;
type Output = z.infer<typeof OkrNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildOkrNarrationBrief({
    okr_text: args.okr_text,
    stance: args.stance,
    level: args.level,
    user_context: args.user_context,
  });
};
