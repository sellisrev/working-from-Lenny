import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  OkrCritiqueInput,
  OkrCritiqueOutput,
} from "../../shared/schemas";
import { parseOkrs, tooManyOverall } from "./data";
import { buildOkrNarrationBrief } from "../../lib/build-okr-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "okr_critique_run",
  description:
    "Takes a 100-3000 char OKR paste, a stance (orthodox / skeptical / hybrid, default hybrid), and a level (team / org, default team) and persists the corpus-grounded critique brief. The deterministic side parses objective/KR structure (returns parsing_confidence: low/med/high) and computes too_many_overall against the level threshold; the four-test critique + stance synthesis + cross-team coherence (when org) come from the host chat model. AFTER calling this, render the critique by calling okr_critique_get_pending_narration. Do not render objections on your own without the brief — the brief carries the closed corpus-anchor pool, the four-test structure, the stance-specific synthesis hooks, and the rewrite contract.",
  inputSchema: OkrCritiqueInput,
  outputSchema: OkrCritiqueOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof OkrCritiqueInput>;
type Output = z.infer<typeof OkrCritiqueOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { okr_text, stance, level, user_context } = args;
  const parsed = parseOkrs(okr_text);
  const tooMany = tooManyOverall(parsed, level);

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildOkrNarrationBrief({
      okr_text,
      stance,
      level,
      user_context,
    });
    await writePending(brief, {
      okr_text,
      parsed,
      stance,
      level,
      too_many_overall: tooMany,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] okr run: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via okr_critique_get_pending_narration will return no_pending. Ask the user to re-submit or call okr_critique_narrate directly.`;
  }

  return {
    parsed,
    stance,
    level,
    too_many_overall: tooMany,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
