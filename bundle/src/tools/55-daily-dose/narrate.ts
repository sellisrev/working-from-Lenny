import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DailyDoseNarrateInput, DailyDoseNarrateOutput } from "../../shared/schemas";
import { buildDailyDoseBrief, selectUnseenInvalidation } from "../../lib/build-daily-dose-brief";
import { listTopicMetas } from "../../lib/corpus";

export const meta: ToolMeta = {
  name: "daily_dose_narrate",
  description:
    "Packages a corpus-grounded narration brief for a Daily Dose: the lesson half (the topic chunk + one passage + one concrete action) and the unlearn half (the recent_invalidation block). Pure compute: no persistence side-effect, no state read. Takes a `topic_slug` (required) and optional `user_context`. When called directly (not via the pick handoff) the unlearn half defaults to the single most-recent obsolete/caution entry, since this tool does not read the user's feed position. The host chat model renders the user-facing dose from this brief. To pick up the brief that daily_dose_pick saved for the chat-side handoff (which respects the user's feed position and gap-weighting), call daily_dose_get_pending_narration instead.",
  inputSchema: DailyDoseNarrateInput,
  outputSchema: DailyDoseNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DailyDoseNarrateInput>;
type Output = z.infer<typeof DailyDoseNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { topic_slug, user_context, recent_invalidation, streak, gap_weighted, weighting_signal } = args;

  const allTopics = await listTopicMetas();
  const topicMeta = allTopics.find((t) => t.slug === topic_slug);
  const topic = topicMeta ?? {
    slug: topic_slug,
    display_name: topic_slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    last_updated: null,
  };

  const invalidation = recent_invalidation
    ?? await selectUnseenInvalidation(null, topic_slug);

  return buildDailyDoseBrief({
    topic,
    user_context: user_context ?? "",
    streak: streak ?? 1,
    gap_weighted: gap_weighted ?? false,
    weighting_signal,
    recent_invalidation: invalidation,
  });
};
