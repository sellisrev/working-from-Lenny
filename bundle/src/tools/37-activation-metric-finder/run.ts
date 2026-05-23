import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  ActivationRunInput,
  ActivationRunOutput,
} from "../../shared/schemas";
import {
  isAiProductFlagged,
  parseFunnelLines,
  resolveActivationFamily,
} from "./data";
import { buildActivationNarrationBrief } from "../../lib/build-activation-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "activation_finder_run",
  description:
    "Takes the structured Activation Metric Finder inputs (business_shape, marketplace_side when applicable, primary_value_action, monetization, stage, optional business_unusual + current_activation_rate_estimate + aha_moment_guess + funnel_paste) and persists the corpus-grounded activation brief. The deterministic side resolves the business-shape → activation-event-family mapping, normalizes funnel paste into trimmed lines, and flags AI-product context heuristically (so the brief includes the Cat Wu wow-moment-vs-aha-moment caveat in benchmarks). The three candidates + per-candidate critique + benchmark ranges + input-metrics tree + optional funnel audit come from the host chat model. AFTER receiving this result, call activation_finder_get_pending_narration to fetch the brief and render the FAMILY + three candidate sections (and the funnel audit, when has_funnel is true). The brief's per-candidate INPUT METRICS list is formatted to be paste-compatible with #9 NSM Finder. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: ActivationRunInput,
  outputSchema: ActivationRunOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof ActivationRunInput>;
type Output = z.infer<typeof ActivationRunOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const family = resolveActivationFamily(inputs.business_shape, inputs.marketplace_side);
  const hasFunnel = parseFunnelLines(inputs.funnel_paste ?? "").length > 0;
  const aiFlagged = isAiProductFlagged(inputs);

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildActivationNarrationBrief({ inputs, user_context });
    await writePending(brief, {
      user_inputs: inputs,
      activation_family: family,
      has_funnel: hasFunnel,
      ai_product_flagged: aiFlagged,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] activation run: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via activation_finder_get_pending_narration will return no_pending. Ask the user to re-submit or call activation_finder_narrate directly.`;
  }

  return {
    inputs,
    activation_family: family,
    has_funnel: hasFunnel,
    ai_product_flagged: aiFlagged,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
