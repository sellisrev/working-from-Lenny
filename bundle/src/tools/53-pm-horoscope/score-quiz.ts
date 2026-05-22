import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HoroscopeScoreQuizInput,
  HoroscopeScoreQuizOutput,
} from "../../shared/schemas";
import { archetypeById, isoToday, isValidIsoDate, scoreQuiz } from "./data";
import { buildHoroscopeNarrationBrief } from "../../lib/build-horoscope-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "pm_horoscope_score_quiz",
  description:
    "Scores the six-question archetype quiz and prepares the user's personalized horoscope brief. Returns the primary archetype, the runner-up (in case the primary doesn't fit), and today's deterministic reading (aspect / prediction / nudge / lucky topic). Answers are interpreted positionally against the six canonical questions — call pm_horoscope_get_quiz or render ui://working-from-lenny/horoscope first; never substitute generic personality questions. AFTER receiving this result, call pm_horoscope_get_pending_narration to fetch the corpus-grounded narration brief and render it for the user following its `directive` and `voice_rules`. Do not summarize the reading on its own — the personalized narration is the user's deliverable. Optional `user_context` (role / stage / company size) flows into the persisted brief; pass it through if you have it. Optional `date` (ISO YYYY-MM-DD) overrides the default of today; useful for previewing another day. If the returned `persistence_warning` field is set, the brief could not be persisted — surface the warning to the user and recommend they retake the quiz.",
  inputSchema: HoroscopeScoreQuizInput,
  outputSchema: HoroscopeScoreQuizOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HoroscopeScoreQuizInput>;
type Output = z.infer<typeof HoroscopeScoreQuizOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { answers, user_context } = args;
  const date =
    args.date && isValidIsoDate(args.date) ? args.date : isoToday();

  const scored = scoreQuiz(answers);
  const archetype = archetypeById(scored.archetype_id);
  const nextArchetype = archetypeById(scored.next_archetype_id);

  let persistenceWarning: string | undefined;
  let reading;
  try {
    const built = await buildHoroscopeNarrationBrief({
      archetype: archetype.slug as Output["archetype_slug"],
      date,
      user_context,
    });
    reading = built.reading;
    await writePending(built.brief, {
      archetype_id: archetype.id,
      archetype_slug: archetype.slug,
      date: built.resolvedDate,
      source: "quiz",
      user_context: user_context ?? "",
      quiz_answers: [...answers],
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(
      `[wfl] score-quiz: failed to persist pending brief: ${msg}`,
    );
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via pm_horoscope_get_pending_narration will return no_pending. Ask the user to retake the quiz or call pm_horoscope_narrate with the archetype above.`;
    // Reading is still computable even if persistence failed; compose it
    // directly so the iframe can render the picks even on a write failure.
    const { composeReading } = await import("./data");
    reading = composeReading(archetype.id, date);
  }

  return {
    archetype_id: archetype.id,
    archetype_slug: archetype.slug as Output["archetype_slug"],
    archetype_name: archetype.name,
    archetype_virtue: archetype.virtue,
    archetype_pitfall: archetype.pitfall,
    next_archetype_id: nextArchetype.id,
    next_archetype_slug: nextArchetype.slug as Output["next_archetype_slug"],
    next_archetype_name: nextArchetype.name,
    date,
    reading,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
