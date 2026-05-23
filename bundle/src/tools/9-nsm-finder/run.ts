import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  NSMRunInput,
  NSMRunOutput,
} from "../../shared/schemas";
import { parseDashboardLines, resolveNsmFamily } from "./data";
import { buildNsmNarrationBrief } from "../../lib/build-nsm-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "nsm_finder_run",
  description:
    "Takes the structured NSM-finder inputs (business_shape, marketplace_side when applicable, primary_user_action, monetization, revenue_band, stage, friction_top, optional business_unusual + dashboard_paste) and persists the corpus-grounded NSM brief. The deterministic side just resolves the business-shape → NSM-family mapping and normalizes the dashboard lines; the three candidates + critique + input-metrics tree + optional dashboard audit come from the host chat model. AFTER receiving this result, call nsm_finder_get_pending_narration to fetch the brief and render the FAMILY + three candidate sections (and the dashboard audit, when has_dashboard is true). Do not render candidates on your own without the brief — the brief carries the voice rules (#9 sigh hook, no AI tells) and the closed corpus-anchor pool. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: NSMRunInput,
  outputSchema: NSMRunOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof NSMRunInput>;
type Output = z.infer<typeof NSMRunOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const family = resolveNsmFamily(inputs.business_shape, inputs.marketplace_side);
  const hasDashboard = parseDashboardLines(inputs.dashboard_paste ?? "").length > 0;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildNsmNarrationBrief({ inputs, user_context });
    await writePending(brief, {
      user_inputs: inputs,
      nsm_family: family,
      has_dashboard: hasDashboard,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] nsm run: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via nsm_finder_get_pending_narration will return no_pending. Ask the user to re-submit or call nsm_finder_narrate directly.`;
  }

  return {
    inputs,
    nsm_family: family,
    has_dashboard: hasDashboard,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
