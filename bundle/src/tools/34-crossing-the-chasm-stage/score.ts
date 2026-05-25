import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { ChasmScoreInput, ChasmScoreOutput } from "../../shared/schemas";
import { STAGE_CONTENT, assignStage } from "./data";
import { buildChasmNarrationBrief } from "../../lib/build-chasm-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "chasm_score",
  description:
    "Takes the structured stage-finder inputs (customer_mix, acquisition_trend, pain_specificity, whole_product, beachhead_named, optional reference_customers) and persists the corpus-grounded chasm brief. The deterministic side runs the categorical rule cascade to assign one Moore stage (early market / at the chasm / bowling alley / tornado / main street) and names the two or three signals that placed the user; it does not score a sum, because chasm position has dispositive signals (a heavy-visionary, stalling, no-whole-product company is at the chasm regardless of other inputs). It echoes the inputs so the host has them in context. The placing-signal narration, the play for the next transition, and the failure mode of running that play wrong come from the host chat model. AFTER receiving this result, call chasm_get_pending_narration to fetch the brief and render the STAGE + placing signals + next-stage play + failure mode. Do not render the stage on your own without the brief — the brief carries the voice rules (#34 forward-looking stage-reframe, Moore-faithful 'the chasm is lethal', no AI tells) and the closed corpus-anchor pool. Optional `user_context` (company stage / GTM motion) flows into the persisted brief. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: ChasmScoreInput,
  outputSchema: ChasmScoreOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof ChasmScoreInput>;
type Output = z.infer<typeof ChasmScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const { stage, placing_signals } = assignStage(inputs);
  const content = STAGE_CONTENT[stage];

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildChasmNarrationBrief({ inputs, user_context });
    await writePending(brief, { inputs, user_context: user_context ?? "" });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] chasm score: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via chasm_get_pending_narration will return no_pending. Ask the user to re-submit or call chasm_narrate directly.`;
  }

  return {
    inputs,
    stage,
    stage_label: content.label,
    placing_signals,
    next_stage_label: content.next_stage_label,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
