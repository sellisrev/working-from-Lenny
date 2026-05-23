import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  EvalGetPendingNarrationInput,
  EvalGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "ai_eval_coverage_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their AI eval coverage scorecard, 'render my score', 'show me the gaps', or any follow-up to a submission just made — including any phrasing like 'score my evals', 'where are my eval gaps', 'I just filled in the eval form', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by ai_eval_coverage_score on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent ai_eval_coverage_score call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/ai-eval-coverage resource or call ai_eval_coverage_score directly.",
  inputSchema: EvalGetPendingNarrationInput,
  outputSchema: EvalGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof EvalGetPendingNarrationInput>;
type Output = z.infer<typeof EvalGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No eval-coverage brief has been computed yet. The user needs to submit a feature description via the embedded UI (ui://working-from-lenny/ai-eval-coverage resource) or by calling ai_eval_coverage_score with feature {feature_one_liner, audience, failure_modes, optional practice {...}, optional methodology_paste}.";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  if (result.kind === "missing") return { status: "no_pending", note: NO_PENDING_NOTE };
  // eslint-disable-next-line no-console
  console.error(`[wfl] eval get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`);
  const reasonHint = result.kind === "corrupted"
    ? `The pending eval-coverage brief is corrupted (${result.reason}). Ask the user to re-submit.`
    : `The pending eval-coverage brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
