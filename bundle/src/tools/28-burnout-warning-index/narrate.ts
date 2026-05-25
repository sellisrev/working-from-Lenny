import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { BurnoutNarrateInput, BurnoutNarrateOutput } from "../../shared/schemas";
import { scoreInputs, type BurnoutInputs } from "./data";
import { buildBurnoutBrief } from "../../lib/build-burnout-brief";

export const meta: ToolMeta = {
  name: "burnout_narrate",
  description:
    "Packages a corpus-grounded Burnout Warning brief from the structured inputs. Returns voice rules, structure (INDEX → DRIVERS → PHASE_1 → PHASE_2 → PHASE_3), the computed index and tier, the override flag, the two top drivers, and corpus chunks. Pure compute — no persistence side-effect. PREFER burnout_get_pending_narration after a score call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: BurnoutNarrateInput,
  outputSchema: BurnoutNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof BurnoutNarrateInput>;
type Output = z.infer<typeof BurnoutNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const burnoutInputs = inputs as BurnoutInputs;
  const scored = scoreInputs(burnoutInputs);
  return buildBurnoutBrief({ scored, inputs: burnoutInputs, user_context });
};
