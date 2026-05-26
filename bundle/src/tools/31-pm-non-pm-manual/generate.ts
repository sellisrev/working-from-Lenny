import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { PmNonPmGenerateInput, PmNonPmGenerateOutput } from "../../shared/schemas";
import { buildPmNonPmBrief } from "../../lib/build-pm-non-pm-brief";
import { writePending } from "./pending";
import type { DomainEnum, ScaleEnum } from "./data";

export const meta: ToolMeta = {
  name: "pm_non_pm_generate",
  description:
    "Takes the non-PM leader's inputs (domain, optional scale, optional biggest_friction) and persists the corpus-grounded manual brief. The deterministic side validates the inputs and resolves, for the chosen domain, the stakeholder roster (users vs buyers/funders), the relabeled RICE axes plus the one override gate, and the 'stop doing' candidates, selecting the corpus anchors per artifact; the three artifacts themselves come from the host chat model. AFTER receiving this result, call pm_non_pm_get_pending_narration to fetch the brief and render the three artifacts (plus the friction coda when biggest_friction was supplied). Do not render the artifacts on your own without the brief — the brief carries the voice rules (#31 plain, practical, respectful of the user's domain, never reverent about product management) and the closed corpus-anchor pool. Optional `user_context` flows into the persisted brief. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: PmNonPmGenerateInput,
  outputSchema: PmNonPmGenerateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PmNonPmGenerateInput>;
type Output = z.infer<typeof PmNonPmGenerateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildPmNonPmBrief({
      domain: inputs.domain as DomainEnum,
      scale: (inputs.scale ?? "mid") as ScaleEnum,
      biggest_friction: inputs.biggest_friction ?? "",
      user_context: user_context ?? "",
    });
    await writePending(brief, {
      domain: inputs.domain,
      scale: inputs.scale ?? "mid",
      biggest_friction: inputs.biggest_friction ?? "",
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] pm_non_pm_generate: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via pm_non_pm_get_pending_narration will return no_pending. Ask the user to re-submit.`;
  }

  return {
    inputs: inputs as Record<string, unknown>,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
