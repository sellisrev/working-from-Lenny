import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DailyDosePickInput, DailyDosePickOutput } from "../../shared/schemas";
import {
  selectTodaysTopic,
  selectUnseenInvalidation,
  buildInvalidationHeadline,
  buildDailyDoseBrief,
} from "../../lib/build-daily-dose-brief";
import { writePending } from "./pending";
import { loadState, saveState } from "../../lib/persistence";

export const meta: ToolMeta = {
  name: "daily_dose_pick",
  description:
    "Entry tool for the Daily Dose. Calling this triggers the host to mount the ui://working-from-lenny/daily-dose resource (a 'today's dose' card) AND selects today's dose, records it, and prepares the personalized narration brief. There is no questionnaire; the selection is what this tool does, not something the user fills in. The pick is deterministic and stable for the calendar day: date-seeded random across the knowledge base by default, gap-weighted toward the user's under-covered topics when this app's local data exists (the pitfalls they flagged in #44, the dimensions they scored low in #3, the areas they do not log in #25), degrading to plain random with no setup. An optional `topic_slug` forces a specific topic ('dose me on retention'); optional `user_context` (role/stage) sharpens the action. The tool also builds the 'unlearn' half from the obsolete + cautions layers (the most recent entry the user has not seen, preferring one tied to today's topic) and advances the user's place in that feed. AFTER receiving this result, call daily_dose_get_pending_narration to fetch the corpus-grounded brief, then render it for the user following its `directive` and `voice_rules`. Do not summarize the topic title on its own; the lesson + unlearn narration is the deliverable. If the returned `persistence_warning` field is set, the brief could not be persisted: surface the warning and recommend re-opening the dose.",
  inputSchema: DailyDosePickInput,
  outputSchema: DailyDosePickOutput,
  annotations: { readOnlyHint: false },
  uiResourceUri: "ui://working-from-lenny/daily-dose",
};

type Input = z.infer<typeof DailyDosePickInput>;
type Output = z.infer<typeof DailyDosePickOutput>;

const STATE_SLUG = "daily-dose";
const STATE_VERSION = 1;
const USER_ID = "default";

interface DailyDoseState {
  shown: string[];
  streak: number;
  last_seen_invalidation: string | null;
}

const DEFAULT_STATE: DailyDoseState = { shown: [], streak: 0, last_seen_invalidation: null };

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const state = await loadState<DailyDoseState>(STATE_SLUG, USER_ID, STATE_VERSION, DEFAULT_STATE);

  const { topic, gapWeighted } = await selectTodaysTopic(state.shown, args.topic_slug);
  const invalidation = await selectUnseenInvalidation(state.last_seen_invalidation, topic.slug);
  const invalidationHeadline = buildInvalidationHeadline(invalidation);

  const newStreak = state.streak + 1;
  const newShown = state.shown.includes(topic.slug)
    ? state.shown
    : [...state.shown, topic.slug];
  const newLastSeen = invalidation.slug ?? state.last_seen_invalidation;

  let persistenceWarning: string | undefined;

  try {
    await saveState<DailyDoseState>(STATE_SLUG, USER_ID, STATE_VERSION, {
      shown: newShown,
      streak: newStreak,
      last_seen_invalidation: newLastSeen,
    });

    const brief = await buildDailyDoseBrief({
      topic,
      user_context: args.user_context ?? "",
      streak: newStreak,
      gap_weighted: gapWeighted,
      recent_invalidation: invalidation,
    });
    await writePending(brief);
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] daily_dose_pick: failed to persist: ${msg}`);
    persistenceWarning = `Daily dose could not be persisted: ${msg}. Retrieving via daily_dose_get_pending_narration will return no_pending. Ask the user to re-open the dose.`;
  }

  return {
    topic,
    invalidation_headline: invalidationHeadline,
    gap_weighted: gapWeighted,
    streak: newStreak,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
