import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  StrategyNarrateInput,
  StrategyNarrateOutput,
} from "../../shared/schemas";
import { buildStrategyNarrationBrief } from "../../lib/build-strategy-brief";

export const meta: ToolMeta = {
  name: "strategy_pressure_test_narrate",
  description:
    "Packages a corpus-grounded pressure-test critique brief from strategy_text (+ optional doc_type override). Returns voice rules, structure, the deterministic doc_type, and corpus chunks for the closed anchor pool. The host chat model renders the user-facing five-card critique. Pure compute — no persistence side-effect. PREFER strategy_pressure_test_get_pending_narration after a run call. Only call this tool directly if you need a brief without round-tripping through disk, or to preview a different doc_type classification.",
  inputSchema: StrategyNarrateInput,
  outputSchema: StrategyNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof StrategyNarrateInput>;
type Output = z.infer<typeof StrategyNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  return buildStrategyNarrationBrief({
    strategy_text: args.strategy_text,
    user_context: args.user_context,
    doc_type: args.doc_type,
  });
};
