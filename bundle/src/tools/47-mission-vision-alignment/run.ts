import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  MvsAlignInput,
  MvsAlignOutput,
} from "../../shared/schemas";
import { isStrategyTooVague } from "./data";
import { buildMvsNarrationBrief } from "../../lib/build-mvs-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "mvs_alignment_run",
  description:
    "Takes mission_text (50-500 chars), vision_text (50-500 chars), and strategy_text (200-3000 chars) and persists the corpus-grounded alignment brief. The deterministic side validates length thresholds and flags strategy_too_vague when the strategy has very low concrete-bet density (no quarter markers, no decision verbs, no named bets); the four-pass critique (drift map / platitude detector / operational gaps / Rumelt diagnosis) comes from the host chat model. AFTER calling this, render the alignment reading by calling mvs_alignment_get_pending_narration. If `persistence_warning` is set, ask the user to re-submit.",
  inputSchema: MvsAlignInput,
  outputSchema: MvsAlignOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof MvsAlignInput>;
type Output = z.infer<typeof MvsAlignOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { mission_text, vision_text, strategy_text, user_context } = args;
  const tooVague = isStrategyTooVague(strategy_text);

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildMvsNarrationBrief({
      mission_text,
      vision_text,
      strategy_text,
      user_context,
    });
    await writePending(brief, {
      mission_text,
      vision_text,
      strategy_text,
      strategy_too_vague: tooVague,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] mvs run: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via mvs_alignment_get_pending_narration will return no_pending. Ask the user to re-submit or call mvs_alignment_narrate directly.`;
  }

  return {
    mission_text,
    vision_text,
    strategy_text,
    pairs_count: 3,
    strategy_too_vague: tooVague,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
