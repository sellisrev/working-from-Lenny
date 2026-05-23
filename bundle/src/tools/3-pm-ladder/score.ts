import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { LadderScoreInput, LadderScoreOutput } from "../../shared/schemas";
import { QUESTIONS, levelMeta, scoreAssessment } from "./data";
import { buildLadderNarrationBrief } from "../../lib/build-ladder-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "pm_ladder_score",
  description:
    "Scores the user's PM Ladder Self-Assessment and prepares their personalized gap-report brief. Returns the per-dimension levels (1-5), the overall effective level, the target level (effective + 1), the widest-gap dimension, and the canonical 30 questions. Answers are interpreted positionally against the canonical questions — call pm_ladder_get_questions or render ui://working-from-lenny/ladder first; never substitute generic ladder questions. AFTER receiving this result, call pm_ladder_get_pending_narration to fetch the corpus-grounded narration brief and render it for the user following its `directive` and `voice_rules`. Do not summarize the scores on their own — the personalized gap report is the user's deliverable. Optional `user_context` (role / stage / company size) flows into the persisted brief; pass it through if you have it. If the returned `persistence_warning` field is set, the brief could not be persisted — surface the warning to the user and recommend they retake the assessment.",
  inputSchema: LadderScoreInput,
  outputSchema: LadderScoreOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof LadderScoreInput>;
type Output = z.infer<typeof LadderScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { answers, user_context } = args;

  const scored = scoreAssessment(answers);

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildLadderNarrationBrief({
      dimension_levels: scored.dimension_levels,
      user_context,
      answers,
    });
    await writePending(brief, {
      dimension_levels: scored.dimension_levels,
      effective_level: scored.effective_level,
      target_level: scored.target_level,
      widest_gap_dimension: scored.widest_gap_dimension,
      answers: [...answers],
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] ladder score: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via pm_ladder_get_pending_narration will return no_pending. Ask the user to retake the assessment or call pm_ladder_narrate with the dimension_levels above.`;
  }

  return {
    dimension_levels: scored.dimension_levels,
    effective_level: scored.effective_level,
    effective_level_display: scored.effective_level_display,
    target_level: scored.target_level,
    widest_gap_dimension: scored.widest_gap_dimension,
    widest_gap_size: scored.widest_gap_size,
    level_names: {
      current: levelMeta(scored.effective_level).title,
      target: levelMeta(scored.target_level).title,
    },
    questions: QUESTIONS.map((q) => ({
      id: q.id,
      dimension: q.dimension,
      text: q.text,
      options: [...q.options],
    })),
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
