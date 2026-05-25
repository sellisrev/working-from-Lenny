import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  SevenPowersGetPendingNarrationInput,
  SevenPowersGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "seven_powers_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their 7 Powers reading, 'read my power map', 'which moats do I actually have', 'am I deluded about network effects', or any follow-up to a submission just made — including any phrasing like 'classify my powers', 'do I have a moat', 'I just took the 7 powers diagnostic', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by seven_powers_score on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent seven_powers_score call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/seven-powers resource or call seven_powers_score directly.",
  inputSchema: SevenPowersGetPendingNarrationInput,
  outputSchema: SevenPowersGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SevenPowersGetPendingNarrationInput>;
type Output = z.infer<typeof SevenPowersGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No 7 Powers brief has been computed yet. The user needs to submit the diagnostic via the embedded UI (ui://working-from-lenny/seven-powers resource) or call seven_powers_score with the structured answers.";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  if (result.kind === "missing") return { status: "no_pending", note: NO_PENDING_NOTE };
  // eslint-disable-next-line no-console
  console.error(`[wfl] seven-powers get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`);
  const reasonHint = result.kind === "corrupted"
    ? `The pending 7 Powers brief is corrupted (${result.reason}). Ask the user to re-submit.`
    : `The pending 7 Powers brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
