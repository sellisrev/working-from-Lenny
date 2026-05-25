import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  SevenPowersNarrateInput,
  SevenPowersNarrateOutput,
} from "../../shared/schemas";
import { buildSevenPowersNarrationBrief } from "../../lib/build-seven-powers-brief";

export const meta: ToolMeta = {
  name: "seven_powers_narrate",
  description:
    "Packages a corpus-grounded 7 Powers brief from the structured answers. Returns voice rules, structure (POWER_MAP → PER_POWER_DETAIL → HEADLINE), the per-power classification and divergence flags, the user's claims and evidence ratings, and corpus chunks. Pure compute — no persistence side-effect. PREFER seven_powers_get_pending_narration after a score call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: SevenPowersNarrateInput,
  outputSchema: SevenPowersNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SevenPowersNarrateInput>;
type Output = z.infer<typeof SevenPowersNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildSevenPowersNarrationBrief({
    answers: args.answers,
    user_context: args.user_context,
  });
};
