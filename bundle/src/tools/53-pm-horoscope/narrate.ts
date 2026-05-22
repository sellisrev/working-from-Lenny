import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HoroscopeNarrateInput,
  HoroscopeNarrateOutput,
} from "../../shared/schemas";
import { buildHoroscopeNarrationBrief } from "../../lib/build-horoscope-brief";

export const meta: ToolMeta = {
  name: "pm_horoscope_narrate",
  description:
    "Packages a corpus-grounded narration brief for today's PM Horoscope reading. Returns voice rules, structure, the deterministic reading (aspect / prediction / nudge / topic), and the corpus chunks themselves. The host chat model renders the user-facing horoscope from this brief. Pure compute — no persistence side-effect. PREFER pm_horoscope_get_pending_narration after a pm_horoscope_score_quiz or pm_horoscope_read call (returns the brief that was already saved). Only call this tool directly if you need a brief without round-tripping through disk, or if you want to preview another day's reading without persisting it.",
  inputSchema: HoroscopeNarrateInput,
  outputSchema: HoroscopeNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HoroscopeNarrateInput>;
type Output = z.infer<typeof HoroscopeNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { brief } = await buildHoroscopeNarrationBrief({
    archetype: args.archetype,
    date: args.date,
    user_context: args.user_context,
  });
  return brief;
};
