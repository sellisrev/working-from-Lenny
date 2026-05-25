import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  DecisionLogGetPendingNarrationInput,
  DecisionLogGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending } from "./pending";

export const meta: ToolMeta = {
  name: "decision_log_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their calibration reading, 'what's my Brier score', 'am I calibrated', 'read my decision log', 'how's my judgment trending', or any follow-up to a calibrate run — including any phrasing like 'where am I overconfident', 'how's my calibration', or any message coming from the embedded widget. Do NOT respond with 'you haven't logged anything' without calling this tool first: the calibration brief lives on disk (persisted by decision_log_calibrate), NOT in the chat conversation context — the user may have logged and calibrated via the embedded widget, in which case the chat history shows no prior calibration but a brief is waiting on disk. Returns the brief saved by the most recent decision_log_calibrate call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' (the disk check came back empty) direct the user to render the ui://working-from-lenny/decision-log resource and call decision_log_calibrate after they have resolved at least one decision.",
  inputSchema: DecisionLogGetPendingNarrationInput,
  outputSchema: DecisionLogGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DecisionLogGetPendingNarrationInput>;
type Output = z.infer<typeof DecisionLogGetPendingNarrationOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", brief: result.brief, saved_at: result.saved_at };
  }
  return {
    status: "no_pending",
    note: "No calibration brief found on disk. Open the Decision Log (ui://working-from-lenny/decision-log), log and resolve some decisions, then call decision_log_calibrate.",
  };
};
