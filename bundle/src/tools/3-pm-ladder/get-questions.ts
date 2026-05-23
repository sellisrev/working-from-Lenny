import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  LadderGetQuestionsInput,
  LadderGetQuestionsOutput,
} from "../../shared/schemas";
import { QUESTIONS, DIMENSION_SLUGS } from "./data";

export const meta: ToolMeta = {
  name: "pm_ladder_get_questions",
  description:
    "Entry tool for the PM Ladder Self-Assessment. Calling this triggers the host to mount the ui://working-from-lenny/ladder resource (an interactive iframe with the 30 questions across five dimensions, paginated, with submit). If your host mounts the UI, that IS the questionnaire — do NOT additionally render the 30 questions in chat as a duplicate surface; the user will answer in the iframe, which calls pm_ladder_score directly. The returned `questions` array is provided only as a fallback for hosts that cannot mount ui:// resources. Scoring is positional against this list — if you do render questions in chat (only when ui:// is unavailable), use these exact 30 verbatim; never substitute generic PM-ladder questions. Each question maps to one of five dimensions (scope / ambiguity / influence / judgment / craft); each answer is a level 1-5 picked from a five-option bank.",
  inputSchema: LadderGetQuestionsInput,
  outputSchema: LadderGetQuestionsOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/ladder",
};

type Input = z.infer<typeof LadderGetQuestionsInput>;
type Output = z.infer<typeof LadderGetQuestionsOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    questions: QUESTIONS.map((q) => ({
      id: q.id,
      dimension: q.dimension,
      text: q.text,
      options: [...q.options],
    })),
    dimensions: DIMENSION_SLUGS as Output["dimensions"],
    note: "Thirty questions, six per dimension. Each answer is a level (1-5) chosen from a five-option bank; option index + 1 = level. Submit the 30 levels in question-ID order as `answers` to pm_ladder_score.",
  };
};
