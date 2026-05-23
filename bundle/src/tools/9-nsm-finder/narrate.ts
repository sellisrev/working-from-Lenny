import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  NSMNarrateInput,
  NSMNarrateOutput,
} from "../../shared/schemas";
import { buildNsmNarrationBrief } from "../../lib/build-nsm-brief";

export const meta: ToolMeta = {
  name: "nsm_finder_narrate",
  description:
    "Packages a corpus-grounded North Star Metric brief from the structured inputs. Returns voice rules, structure (FAMILY → CANDIDATE_1/2/3 → optional DASHBOARD_AUDIT), the resolved NSM family, normalized dashboard lines, and corpus chunks. Pure compute — no persistence side-effect. PREFER nsm_finder_get_pending_narration after a run call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: NSMNarrateInput,
  outputSchema: NSMNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof NSMNarrateInput>;
type Output = z.infer<typeof NSMNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildNsmNarrationBrief({ inputs: args.inputs, user_context: args.user_context });
};
