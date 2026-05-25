import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { SpottingScoreInput, SpottingScoreOutput } from "../../shared/schemas";
import {
  BEHAVIORS,
  observedScore,
  computeSeverityTier,
  computeActionRung,
  type ObservedFrequency,
} from "./data";
import { buildSpottingBrief } from "../../lib/build-spotting-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "spotting_score",
  description:
    "Scores the user's field-guide ratings and prepares their narration brief. Returns the composite severity tier (green / yellow / red), the running total, the top three patterns (behavior + pattern weight + the deterministically-chosen action rung), and the canonical 15 behaviors. Ratings are interpreted positionally against the canonical behaviors — call spotting_get_questions or render ui://working-from-lenny/spotting-bad-pm first; never substitute generic behaviors. The green 'haven't seen it on everything' case returns no patterns and a fairness-check headline. AFTER receiving this score result, call spotting_get_pending_narration to fetch the corpus-grounded narration brief, then render it for the user following its `directive` and `voice_rules`. Do not summarize the tier on its own — the diagnosis + proportionate move + fairness check are the deliverable. Optional `user_context` (the user's role, how long they've worked with this PM) flows into the persisted brief. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: SpottingScoreInput,
  outputSchema: SpottingScoreOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SpottingScoreInput>;
type Output = z.infer<typeof SpottingScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { answers, user_context } = args;

  const weighted = BEHAVIORS.map((b, i) => {
    const os = observedScore(answers[i] as ObservedFrequency);
    return {
      id: b.id,
      severity_weight: b.severity_weight,
      observed: answers[i] as ObservedFrequency,
      pattern_weight: os * b.severity_weight,
    };
  });

  const total = weighted.reduce((sum, w) => sum + w.pattern_weight, 0);
  const severity_tier = computeSeverityTier(total);

  const countSev3Active = weighted.filter(
    (w) => w.severity_weight === 3 && w.pattern_weight > 0,
  ).length;

  const topPatterns = weighted
    .filter((w) => w.pattern_weight > 0)
    .sort((a, b) => {
      if (b.pattern_weight !== a.pattern_weight) return b.pattern_weight - a.pattern_weight;
      if (b.severity_weight !== a.severity_weight) return b.severity_weight - a.severity_weight;
      return a.id - b.id;
    })
    .slice(0, 3)
    .map((w) => ({
      behavior_id: w.id,
      behavior_text: BEHAVIORS[w.id - 1]!.text,
      pattern_weight: w.pattern_weight,
      action_rung: computeActionRung(w.observed, w.severity_weight, countSev3Active),
    }));

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildSpottingBrief({
      severity_tier,
      total,
      top_patterns: topPatterns,
      user_context,
      answers,
    });
    await writePending(brief, {
      severity_tier,
      total,
      top_patterns: topPatterns,
      answers,
      user_context,
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] spotting_score: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via spotting_get_pending_narration will return no_pending. Ask the user to re-submit.`;
  }

  return {
    severity_tier,
    total,
    top_patterns: topPatterns,
    behaviors: BEHAVIORS.map((b) => ({ id: b.id, text: b.text })),
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
