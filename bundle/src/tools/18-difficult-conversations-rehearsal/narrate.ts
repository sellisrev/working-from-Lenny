import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DifficultConversationsNarrateInput, DifficultConversationsNarrateOutput } from "../../shared/schemas";
import { buildDifficultConvBrief } from "../../lib/build-difficult-conversations-brief";
import type { ScenarioEnum, DifficultConvModeEnum } from "./data";

export const meta: ToolMeta = {
  name: "difficult_conversations_narrate",
  description:
    "Packages the corpus-grounded rehearsal brief from the situation inputs. Returns voice rules, the rehearsal directive (conduct a role-play, not render a reading), the scenario persona and its trap, the five-dimension rubric (empathy / clarity / decisiveness / silence / dignity), the turn limits, the mode, the canonical-handling anchor with the silence beat marked, and corpus chunks. In fournier mode the brief carries the keep / cut / one-move-you're-missing comparison structure instead of the role-play directive. Pure compute — no persistence side-effect. PREFER difficult_conversations_get_pending_narration after a start call. Only call this tool directly if you need the brief without round-tripping through disk.",
  inputSchema: DifficultConversationsNarrateInput,
  outputSchema: DifficultConversationsNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DifficultConversationsNarrateInput>;
type Output = z.infer<typeof DifficultConversationsNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { situation, mode, user_context } = args;
  return buildDifficultConvBrief({
    situation: {
      scenario: situation.scenario as ScenarioEnum,
      your_relationship: situation.your_relationship ?? "",
      intended_approach: situation.intended_approach ?? "",
    },
    mode: (mode ?? "rehearse") as DifficultConvModeEnum,
    user_context: user_context ?? "",
  });
};
