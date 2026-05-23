import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  FounderDecideInput,
  FounderDecideOutput,
} from "../../shared/schemas";
import { decide } from "./data";
import { buildFounderNarrationBrief } from "../../lib/build-founder-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "founder_pm_hire_decide",
  description:
    "Runs the deterministic founder-PM-hire decision tree on the eight inputs (stage, team_size, pm_today, founder_time, enjoyment, ceo_bandwidth, product_density, bottleneck) and persists the verdict + corpus-grounded brief. Returns one of five verdicts: stay-founder-mode, not-yet (+ playbook), hire-apm, hire-empowered-pm, hire-head-of-product. AFTER receiving this result, call founder_pm_hire_get_pending_narration to fetch the brief and render it. Do not summarize the verdict on its own — the narration (verdict + what-good-looks-like / interim-playbook + cost-of-getting-it-wrong) is the user's deliverable. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: FounderDecideInput,
  outputSchema: FounderDecideOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof FounderDecideInput>;
type Output = z.infer<typeof FounderDecideOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const decision = decide(inputs);

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildFounderNarrationBrief({ inputs, user_context });
    await writePending(brief, {
      verdict: decision.verdict,
      playbook: decision.playbook,
      user_inputs: inputs,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] founder decide: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via founder_pm_hire_get_pending_narration will return no_pending. Ask the user to re-submit or call founder_pm_hire_narrate directly.`;
  }

  return {
    verdict: decision.verdict,
    playbook: decision.playbook,
    inputs,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
