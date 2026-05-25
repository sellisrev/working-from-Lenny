import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DecisionLogCalibrateInput, DecisionLogCalibrateOutput } from "../../shared/schemas";
import { buildDecisionLogBrief } from "../../lib/build-decision-log-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "decision_log_calibrate",
  description:
    "Computes the deterministic Brier score and per-type calibration over the user's resolved decisions, and packages the corpus-grounded calibration brief. Returns a narration_brief (Path 4): voice rules, structure (OVERALL → MISCALIBRATION → OPEN → PATTERN), and inputs carrying the overall Brier and its plain-language band, the per-type verdicts (overconfident / underconfident / well-calibrated, or insufficient-data below 3 resolved of that type), the open-decision count and oldest open decision, and corpus chunks. Per-decision Brier = (confidence_pct/100 - outcome)^2 with outcome 1 if right else 0; overall Brier = mean over resolved. Calibration verdicts require at least 3 resolved decisions of a type; below that the tool says so rather than inventing a pattern. This is the narration entry point; it persists the brief via the single-pending pattern (an ephemeral write, so it stays read-only with respect to durable user data). AFTER calling, prefer decision_log_get_pending_narration to render, or render this returned brief directly following its directive and voice_rules. Do not invent calibration numbers — use only what this tool computes.",
  inputSchema: DecisionLogCalibrateInput,
  outputSchema: DecisionLogCalibrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DecisionLogCalibrateInput>;
type Output = z.infer<typeof DecisionLogCalibrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { user_context = "" } = args;

  const brief = await buildDecisionLogBrief({ user_context });

  let persistenceWarning: string | undefined;
  try {
    await writePending(brief);
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] decision_log_calibrate: failed to persist brief: ${msg}`);
    persistenceWarning = `Calibration brief could not be persisted: ${msg}. decision_log_get_pending_narration will return no_pending.`;
  }

  if (persistenceWarning) {
    return {
      ...brief,
      inputs: { ...brief.inputs, persistence_warning: persistenceWarning },
    };
  }

  return brief;
};
