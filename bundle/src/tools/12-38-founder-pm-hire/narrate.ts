import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  FounderNarrateInput,
  FounderNarrateOutput,
} from "../../shared/schemas";
import { buildFounderNarrationBrief } from "../../lib/build-founder-brief";

export const meta: ToolMeta = {
  name: "founder_pm_hire_narrate",
  description:
    "Packages a corpus-grounded founder-PM-hire brief from the eight inputs. Returns voice rules, structure (verdict / what-good-looks-like / cost-of-getting-it-wrong), the deterministic verdict + playbook, and corpus chunks. The host chat model renders the user-facing narration. Pure compute — no persistence side-effect. PREFER founder_pm_hire_get_pending_narration after a decide call (returns the brief decide already saved). Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: FounderNarrateInput,
  outputSchema: FounderNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof FounderNarrateInput>;
type Output = z.infer<typeof FounderNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildFounderNarrationBrief({
    inputs: args.inputs,
    user_context: args.user_context,
  });
};
