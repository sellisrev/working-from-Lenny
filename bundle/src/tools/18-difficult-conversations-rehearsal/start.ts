import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DifficultConversationsStartInput, DifficultConversationsStartOutput } from "../../shared/schemas";
import { buildDifficultConvBrief } from "../../lib/build-difficult-conversations-brief";
import { writePending } from "./pending";
import type { ScenarioEnum, DifficultConvModeEnum } from "./data";

export const meta: ToolMeta = {
  name: "difficult_conversations_start",
  description:
    "Takes the rehearsal setup (situation.scenario, optional situation.your_relationship, optional situation.intended_approach for fournier mode, and mode of rehearse | show-me | fournier) and persists the corpus-grounded rehearsal brief. The deterministic side selects the scenario persona and the trap it sets, the five-dimension scoring rubric (empathy / clarity / decisiveness / silence / dignity), the canonical-handling anchor with the silence beat, and the turn limits, then writes the setup brief via the single-pending pattern. The brief is ephemeral setup, NOT durable user data, so this tool stays read-only. The rehearsal itself (the dialog, the scoring, the canonical version, or the fournier comparison) is conducted by the host chat model. AFTER receiving this result, call difficult_conversations_get_pending_narration to fetch the brief; on status='ready' the host CONDUCTS the rehearsal per the brief's directive. Do not improvise the role-play without the brief — it carries the persona, the rubric, the canonical-handling anchor, and the turn limits. Optional `user_context` flows into the brief. If `persistence_warning` is set, surface it and ask the user to re-start.",
  inputSchema: DifficultConversationsStartInput,
  outputSchema: DifficultConversationsStartOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DifficultConversationsStartInput>;
type Output = z.infer<typeof DifficultConversationsStartOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { situation, mode, user_context } = args;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildDifficultConvBrief({
      situation: {
        scenario: situation.scenario as ScenarioEnum,
        your_relationship: situation.your_relationship ?? "",
        intended_approach: situation.intended_approach ?? "",
      },
      mode: (mode ?? "rehearse") as DifficultConvModeEnum,
      user_context: user_context ?? "",
    });
    await writePending(brief);
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] difficult_conversations_start: failed to persist: ${msg}`);
    persistenceWarning = `Rehearsal brief could not be persisted: ${msg}. Retrieving via difficult_conversations_get_pending_narration will return no_pending. Ask the user to re-start.`;
  }

  return {
    situation: {
      scenario: situation.scenario as Output["situation"]["scenario"],
      your_relationship: situation.your_relationship ?? "",
      intended_approach: situation.intended_approach ?? "",
    },
    mode: (mode ?? "rehearse") as Output["mode"],
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
