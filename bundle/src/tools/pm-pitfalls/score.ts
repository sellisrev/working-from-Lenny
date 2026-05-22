import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { PitfallScoreInput, PitfallScoreOutput } from "../../shared/schemas";
import { PITFALLS, answerValue, pitfallById } from "./data";
import {
  buildPitfallNarrationBrief,
  assertTopThree,
} from "../../lib/build-narration-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "pm_pitfalls_score",
  description:
    "Scores the user's PM-pitfalls audit and prepares their personalized narration brief. Returns the score (0-20), the three highest-leverage pitfall IDs, the pre-written exemplar quote per pick, and the canonical 20 questions. Answers are interpreted positionally against the canonical pitfalls — call pm_pitfalls_get_questions or render ui://working-from-lenny/pitfalls first; never substitute generic PM questions. AFTER receiving this score result, call pm_pitfalls_get_pending_narration to fetch the corpus-grounded narration brief and render it for the user following its `directive` and `voice_rules`. Do not summarize the score on its own — the personalized narration is the user's deliverable. Optional `user_context` (role/stage/company size) flows into the persisted brief; pass it through if you have it. If the returned `persistence_warning` field is set, the brief could not be persisted — surface the warning to the user and recommend they retake the audit.",
  inputSchema: PitfallScoreInput,
  outputSchema: PitfallScoreOutput,
  // The pending-narration file is an ephemeral overwrite-on-each-audit
  // cache, not user state that needs consent UX. drift owns per-user state
  // and is correctly readOnlyHint: false.
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PitfallScoreInput>;
type Output = z.infer<typeof PitfallScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { answers, user_context } = args;

  let scoreRaw = 0;
  const weighted = PITFALLS.map((p, i) => {
    const av = answerValue(answers[i]);
    scoreRaw += av;
    return { id: p.id, leverage: p.leverage, weight: av * p.leverage };
  });

  const scoreDisplay = Math.round(scoreRaw / 2);
  const allNever = weighted.every((w) => w.weight === 0);

  let topIdsRaw: number[];
  if (allNever) {
    topIdsRaw = [1, 2, 4];
  } else {
    const sorted = weighted.slice().sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      if (b.leverage !== a.leverage) return b.leverage - a.leverage;
      return a.id - b.id;
    });
    topIdsRaw = sorted.slice(0, 3).map((s) => s.id);
  }
  const topIds = assertTopThree(topIdsRaw);

  const exemplarQuotes: [string, string, string] = [
    pitfallById(topIds[0]).quote,
    pitfallById(topIds[1]).quote,
    pitfallById(topIds[2]).quote,
  ];

  // Persistence side-effect — the brief is built and saved so chat-side
  // Claude can fetch it via pm_pitfalls_get_pending_narration. Failures are
  // surfaced via `persistence_warning` rather than thrown, so the user still
  // sees their score+picks even if the data dir is unwritable; the iframe
  // then shows a manual-fallback hint instead of a blank screen.
  let persistenceWarning: string | undefined;
  try {
    const brief = await buildPitfallNarrationBrief({
      score_display: scoreDisplay,
      top_three_pitfall_ids: topIds,
      user_context,
      answers,
    });
    await writePending(brief, {
      score_display: scoreDisplay,
      top_three_pitfall_ids: topIds,
      answers,
      user_context,
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] score: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via pm_pitfalls_get_pending_narration will return no_pending. Ask the user to retake the audit or call pm_pitfalls_narrate with the answers above.`;
  }

  return {
    score_display: scoreDisplay,
    top_three_pitfall_ids: topIds,
    exemplar_quotes: exemplarQuotes,
    all_never: allNever,
    questions: PITFALLS.map((p) => ({ id: p.id, text: p.text })),
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
