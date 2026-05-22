import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HoroscopeReadInput,
  HoroscopeReadOutput,
} from "../../shared/schemas";
import { archetypeBySlug, isoToday, isValidIsoDate } from "./data";
import { buildHoroscopeNarrationBrief } from "../../lib/build-horoscope-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "pm_horoscope_read",
  description:
    "Fetches today's PM Horoscope reading for a chosen archetype and prepares the user's personalized narration brief. Use this when the user already knows their archetype (from a prior quiz or by direct pick); for users who don't know yet, call pm_horoscope_get_quiz to render the six-question quiz instead. Returns the archetype context (virtue / pitfall / corpus anchors) and today's deterministic reading (aspect partner / aspect line / prediction / nudge / lucky topic). AFTER receiving this result, call pm_horoscope_get_pending_narration to fetch the corpus-grounded narration brief and render it for the user following its `directive` and `voice_rules`. Do not summarize the reading on its own — the personalized narration is the user's deliverable. Optional `date` (ISO YYYY-MM-DD) overrides the default of today; useful for previewing another day. Optional `user_context` flows through to the persisted brief.",
  inputSchema: HoroscopeReadInput,
  outputSchema: HoroscopeReadOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HoroscopeReadInput>;
type Output = z.infer<typeof HoroscopeReadOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const archetype = archetypeBySlug(args.archetype);
  const date =
    args.date && isValidIsoDate(args.date) ? args.date : isoToday();

  let persistenceWarning: string | undefined;
  let reading;
  try {
    const built = await buildHoroscopeNarrationBrief({
      archetype: args.archetype,
      date,
      user_context: args.user_context,
    });
    reading = built.reading;
    await writePending(built.brief, {
      archetype_id: archetype.id,
      archetype_slug: archetype.slug,
      date: built.resolvedDate,
      source: "direct",
      user_context: args.user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] read: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via pm_horoscope_get_pending_narration will return no_pending. Ask the user to retry or call pm_horoscope_narrate directly.`;
    const { composeReading } = await import("./data");
    reading = composeReading(archetype.id, date);
  }

  return {
    archetype_id: archetype.id,
    archetype_slug: archetype.slug as Output["archetype_slug"],
    archetype_name: archetype.name,
    archetype_virtue: archetype.virtue,
    archetype_pitfall: archetype.pitfall,
    date,
    reading,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
