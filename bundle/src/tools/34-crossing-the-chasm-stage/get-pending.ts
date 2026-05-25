import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  ChasmGetPendingNarrationInput,
  ChasmGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "chasm_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their Crossing-the-Chasm reading, 'where am I on the chasm', 'what stage are we in', 'read my chasm diagnosis', or any follow-up to a submission just made — including any phrasing like 'am I at the chasm', 'what's my next play', 'I just filled in the stage finder', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by chasm_score on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent chasm_score call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/chasm-stage resource or call chasm_score directly.",
  inputSchema: ChasmGetPendingNarrationInput,
  outputSchema: ChasmGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof ChasmGetPendingNarrationInput>;
type Output = z.infer<typeof ChasmGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No Crossing-the-Chasm brief has been computed yet. The user needs to submit the stage finder via the embedded UI (ui://working-from-lenny/chasm-stage resource) or call chasm_score with the structured inputs.";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  if (result.kind === "missing") return { status: "no_pending", note: NO_PENDING_NOTE };
  // eslint-disable-next-line no-console
  console.error(`[wfl] chasm get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`);
  const reasonHint = result.kind === "corrupted"
    ? `The pending chasm brief is corrupted (${result.reason}). Ask the user to re-submit.`
    : `The pending chasm brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
