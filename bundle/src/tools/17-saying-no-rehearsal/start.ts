import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { SayingNoStartInput, SayingNoStartOutput } from "../../shared/schemas";
import { buildSayingNoBrief } from "../../lib/build-saying-no-brief";
import { writePending } from "./pending";
import type { StakeholderEnum, SayingNoModeEnum } from "./data";

export const meta: ToolMeta = {
  name: "saying_no_start",
  description:
    "Takes the rehearsal setup (scenario.stakeholder, scenario.the_ask, optional scenario.your_constraint, and mode of rehearse | show-me) and persists the corpus-grounded rehearsal brief. The deterministic side selects the stakeholder persona, the rationale anchor that stakeholder can hear, the five-dimension scoring rubric, and the turn limits, then writes the setup brief via the single-pending pattern. The brief is ephemeral setup, NOT durable user data, so this tool stays read-only. The rehearsal itself (the dialog, the scoring, the canonical no) is conducted by the host chat model. AFTER receiving this result, call saying_no_get_pending_narration to fetch the brief; on status='ready' the host CONDUCTS the rehearsal per the brief's directive. Do not improvise the role-play without the brief — it carries the persona, the rubric, the canonical-no anchor, and the turn limits. Optional `user_context` flows into the brief. If `persistence_warning` is set, surface it and ask the user to re-start.",
  inputSchema: SayingNoStartInput,
  outputSchema: SayingNoStartOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SayingNoStartInput>;
type Output = z.infer<typeof SayingNoStartOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { scenario, mode, user_context } = args;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildSayingNoBrief({
      scenario: {
        stakeholder: scenario.stakeholder as StakeholderEnum,
        the_ask: scenario.the_ask,
        your_constraint: scenario.your_constraint ?? "",
      },
      mode: (mode ?? "rehearse") as SayingNoModeEnum,
      user_context: user_context ?? "",
    });
    await writePending(brief);
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] saying_no_start: failed to persist: ${msg}`);
    persistenceWarning = `Rehearsal brief could not be persisted: ${msg}. Retrieving via saying_no_get_pending_narration will return no_pending. Ask the user to re-start.`;
  }

  return {
    scenario: {
      stakeholder: scenario.stakeholder as Output["scenario"]["stakeholder"],
      the_ask: scenario.the_ask,
      your_constraint: scenario.your_constraint ?? "",
    },
    mode: (mode ?? "rehearse") as Output["mode"],
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
