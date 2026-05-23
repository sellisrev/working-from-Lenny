import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PmifyNarrateInput,
  PmifyNarrateOutput,
} from "../../shared/schemas";
import { buildPmifyNarrationBrief } from "../../lib/build-pmify-brief";

export const meta: ToolMeta = {
  name: "pmify_narrate",
  description:
    "Packages a corpus-grounded translation brief for the user's pasted text + chosen mode. Returns voice rules, structure, the mode + user_text + closed pattern pool, and the corpus chunks themselves. The host chat model renders the user-facing translation + footnotes from this brief. Pure compute — no persistence side-effect. PREFER pmify_get_pending_narration after a pmify_translate call (returns the brief translate already saved). Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: PmifyNarrateInput,
  outputSchema: PmifyNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PmifyNarrateInput>;
type Output = z.infer<typeof PmifyNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildPmifyNarrationBrief({
    mode: args.mode,
    user_text: args.text,
    user_context: args.user_context,
  });
};
