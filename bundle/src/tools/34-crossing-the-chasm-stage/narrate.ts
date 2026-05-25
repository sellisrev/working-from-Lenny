import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { ChasmNarrateInput, ChasmNarrateOutput } from "../../shared/schemas";
import { buildChasmNarrationBrief } from "../../lib/build-chasm-brief";

export const meta: ToolMeta = {
  name: "chasm_narrate",
  description:
    "Packages a corpus-grounded Crossing-the-Chasm brief from the structured inputs. Returns voice rules, structure (STAGE → PLACING_SIGNALS → NEXT_PLAY → FAILURE_MODE), the assigned stage, the placing signals, and corpus chunks. Pure compute — no persistence side-effect. PREFER chasm_get_pending_narration after a score call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: ChasmNarrateInput,
  outputSchema: ChasmNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof ChasmNarrateInput>;
type Output = z.infer<typeof ChasmNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildChasmNarrationBrief({
    inputs: args.inputs,
    user_context: args.user_context,
  });
};
