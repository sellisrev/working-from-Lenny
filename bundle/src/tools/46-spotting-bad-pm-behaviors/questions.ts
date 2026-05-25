import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  SpottingGetQuestionsInput,
  SpottingGetQuestionsOutput,
} from "../../shared/schemas";
import { BEHAVIORS } from "./data";

export const meta: ToolMeta = {
  name: "spotting_get_questions",
  description:
    "Entry tool for the Spotting Bad PM Behaviors field guide. Calling this triggers the host to mount the ui://working-from-lenny/spotting-bad-pm resource (an interactive iframe with the 15 behaviors, observed-frequency rating, and submit). If your host mounts the UI, that IS the questionnaire — do NOT additionally render the 15 behaviors in chat as a duplicate surface; the user will rate them in the iframe, which calls spotting_score directly. The returned `behaviors` array is provided only as a fallback for hosts that cannot mount ui:// resources. Scoring is positional against this list — if you do render behaviors in chat (only when ui:// is unavailable), use these exact 15 verbatim; never substitute generic bad-PM behaviors.",
  inputSchema: SpottingGetQuestionsInput,
  outputSchema: SpottingGetQuestionsOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/spotting-bad-pm",
};

type Input = z.infer<typeof SpottingGetQuestionsInput>;
type Output = z.infer<typeof SpottingGetQuestionsOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    behaviors: BEHAVIORS.map((b) => ({ id: b.id, text: b.text })),
    note: "Each behavior is rated on observed frequency: often / sometimes / haven't seen it. Present in id order; answers must be returned to spotting_score as an array of 15 enums in the same order.",
  };
};
