import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  OkrGetPendingNarrationInput,
  OkrGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "okr_critique_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their OKR critique, 'render the per-KR table', 'critique my OKRs', 'rewrite my KRs', or any follow-up to a submission just made — including any phrasing like 'are my OKRs activities or outcomes', 'pressure-test my OKRs', 'I just pasted my OKR set', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by okr_critique_run on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent okr_critique_run call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/okr-critique resource or call okr_critique_run directly.",
  inputSchema: OkrGetPendingNarrationInput,
  outputSchema: OkrGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof OkrGetPendingNarrationInput>;
type Output = z.infer<typeof OkrGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No OKR critique brief has been computed yet. The user needs to submit a paste via the embedded UI (ui://working-from-lenny/okr-critique resource) or by calling okr_critique_run with okr_text + optional stance/level.";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  if (result.kind === "missing") return { status: "no_pending", note: NO_PENDING_NOTE };
  // eslint-disable-next-line no-console
  console.error(`[wfl] okr get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`);
  const reasonHint = result.kind === "corrupted"
    ? `The pending OKR critique brief is corrupted (${result.reason}). Ask the user to re-submit.`
    : `The pending OKR critique brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
