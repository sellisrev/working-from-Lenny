import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  NSMGetPendingNarrationInput,
  NSMGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "nsm_finder_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their North Star Metric reading, 'render my NSM candidates', 'show me the three NSMs', or any follow-up to a submission just made — including any phrasing like 'pick my NSM', 'find my north star', 'audit my dashboard', 'I just filled in the NSM form', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by nsm_finder_run on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent nsm_finder_run call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/nsm-finder resource or call nsm_finder_run directly.",
  inputSchema: NSMGetPendingNarrationInput,
  outputSchema: NSMGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof NSMGetPendingNarrationInput>;
type Output = z.infer<typeof NSMGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No NSM brief has been computed yet. The user needs to submit the wizard via the embedded UI (ui://working-from-lenny/nsm-finder resource) or call nsm_finder_run with the structured inputs.";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  if (result.kind === "missing") return { status: "no_pending", note: NO_PENDING_NOTE };
  // eslint-disable-next-line no-console
  console.error(`[wfl] nsm get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`);
  const reasonHint = result.kind === "corrupted"
    ? `The pending NSM brief is corrupted (${result.reason}). Ask the user to re-submit.`
    : `The pending NSM brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
