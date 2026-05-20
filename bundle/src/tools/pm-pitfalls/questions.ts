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
    "Returns the canonical 20 PM-pitfall questions (id + text) so the host can render them faithfully before collecting answers. Host MUST use these exact 20 questions or render the ui://working-from-lenny/pitfalls resource; never substitute generic PM questions, since the scoring is positional against this list.",
  inputSchema: PitfallGetQuestionsInput,
  outputSchema: PitfallGetQuestionsOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PitfallGetQuestionsInput>;
type Output = z.infer<typeof PitfallGetQuestionsOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    questions: PITFALLS.map((p) => ({ id: p.id, text: p.text })),
    note: "Each question is a behavior the user rates always/sometimes/never. Present in id order; answers must be returned to pm_pitfalls_score as an array of 20 enums in the same order.",
  };
};
