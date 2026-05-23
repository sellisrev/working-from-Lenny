import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  StrategyGetPendingNarrationInput,
  StrategyGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "strategy_pressure_test_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their strategy pressure-test critique, 'render the objections', 'show me the five cards', or any follow-up to a submission just made — including any phrasing like 'pressure-test it', 'critique my strategy', 'I just pasted my doc', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by strategy_pressure_test_run on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent strategy_pressure_test_run call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/strategy-pressure-test resource or call strategy_pressure_test_run directly.",
  inputSchema: StrategyGetPendingNarrationInput,
  outputSchema: StrategyGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof StrategyGetPendingNarrationInput>;
type Output = z.infer<typeof StrategyGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No pressure-test brief has been computed yet. The user needs to submit a strategy doc via the embedded UI (ui://working-from-lenny/strategy-pressure-test resource) or by calling strategy_pressure_test_run with strategy_text (200-4000 chars).";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  if (result.kind === "missing") return { status: "no_pending", note: NO_PENDING_NOTE };
  // eslint-disable-next-line no-console
  console.error(`[wfl] strategy get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`);
  const reasonHint = result.kind === "corrupted"
    ? `The pending pressure-test brief is corrupted (${result.reason}). Ask the user to re-submit.`
    : `The pending pressure-test brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
