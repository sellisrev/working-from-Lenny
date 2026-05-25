import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { BurnoutScoreInput, BurnoutScoreOutput } from "../../shared/schemas";
import { scoreInputs, type BurnoutInputs } from "./data";
import { buildBurnoutBrief } from "../../lib/build-burnout-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "burnout_score",
  description:
    "Takes the structured burnout-check inputs (meetings_per_week, deep_work_blocks_remaining, after_hours_meeting_pct, weeks_since_real_vacation, sleep_self_report, last_good_day, dread_signal, optional recovery_capacity) and persists the corpus-grounded recovery brief. The deterministic side maps each input to 0-2 risk points (the qualitative trio counts double), normalizes to a 0-100 index, tiers it (green <= 30, yellow 31-60, red >= 61), applies the override (dread most-mornings AND last-good-day can't-remember floors the tier at yellow regardless of load), names the two highest-risk drivers, and selects the recovery phases. It echoes the inputs so the host has them in context. The two-driver narration and the ordered three-phase prescription come from the host chat model. AFTER receiving this result, call burnout_get_pending_narration to fetch the brief and render the INDEX + drivers + ordered recovery. Do not render the prescription on your own without the brief — the brief carries the voice rules (#28 non-clinical, non-alarmist, no medical claims, direct-but-kind) and the closed corpus-anchor pool. Optional `user_context` (role / season) flows into the persisted brief. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: BurnoutScoreInput,
  outputSchema: BurnoutScoreOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof BurnoutScoreInput>;
type Output = z.infer<typeof BurnoutScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const burnoutInputs = inputs as BurnoutInputs;

  const scored = scoreInputs(burnoutInputs);

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildBurnoutBrief({ scored, inputs: burnoutInputs, user_context });
    await writePending(brief, {
      index: scored.index,
      tier: scored.tier,
      override_fired: scored.override_fired,
      top_drivers: scored.top_drivers,
      inputs: inputs as Record<string, unknown>,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] burnout_score: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via burnout_get_pending_narration will return no_pending. Ask the user to re-submit.`;
  }

  return {
    index: scored.index,
    tier: scored.tier,
    override_fired: scored.override_fired,
    top_drivers: scored.top_drivers,
    inputs,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
