import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PitfallGetQuestionsInput,
  PitfallGetQuestionsOutput,
} from "../../shared/schemas";
import { PITFALLS } from "./data";

export const meta: ToolMeta = {
  name: "pm_pitfalls_get_questions",
  description:
    "Entry tool for the PM Pitfalls audit. Calling this triggers the host to mount the ui://working-from-lenny/pitfalls resource (an interactive iframe with the 20 questions, auto-advance, and submit). If your host mounts the UI, that IS the questionnaire — do NOT additionally render the 20 questions in chat as a duplicate surface; the user will answer in the iframe, which calls pm_pitfalls_score directly. The returned `questions` array is provided only as a fallback for hosts that cannot mount ui:// resources. Scoring is positional against this list — if you do render questions in chat (only when ui:// is unavailable), use these exact 20 verbatim; never substitute generic PM questions.",
  inputSchema: PitfallGetQuestionsInput,
  outputSchema: PitfallGetQuestionsOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/pitfalls",
};

type Input = z.infer<typeof PitfallGetQuestionsInput>;
type Output = z.infer<typeof PitfallGetQuestionsOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    questions: PITFALLS.map((p) => ({ id: p.id, text: p.text })),
    note: "Each question is a behavior the user rates always/sometimes/never. Present in id order; answers must be returned to pm_pitfalls_score as an array of 20 enums in the same order.",
  };
};
