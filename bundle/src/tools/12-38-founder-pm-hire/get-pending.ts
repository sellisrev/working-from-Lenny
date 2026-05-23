import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  FounderGetPendingNarrationInput,
  FounderGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "founder_pm_hire_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their founder-PM-hire verdict, 'render my verdict', 'show me the founder PM read', or any follow-up to the diagnostic just taken — including any phrasing like 'should I hire a PM', 'tell me which level', 'I just filled in the founder form', or any message coming from the embedded widget. Do NOT respond with 'you haven't filled in the form' without calling this tool first: the diagnostic state lives on disk (persisted by founder_pm_hire_decide on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent founder_pm_hire_decide call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/founder-pm-hire resource or call founder_pm_hire_decide directly.",
  inputSchema: FounderGetPendingNarrationInput,
  outputSchema: FounderGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof FounderGetPendingNarrationInput>;
type Output = z.infer<typeof FounderGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No founder-PM-hire brief has been computed yet. The user needs to run the diagnostic via the embedded UI (ui://working-from-lenny/founder-pm-hire resource) or by calling founder_pm_hire_decide with the eight inputs.";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  }
  if (result.kind === "missing") {
    return { status: "no_pending", note: NO_PENDING_NOTE };
  }
  // eslint-disable-next-line no-console
  console.error(
    `[wfl] founder get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`,
  );
  const reasonHint =
    result.kind === "corrupted"
      ? `The pending founder-PM-hire brief is corrupted (${result.reason}). Ask the user to re-run the diagnostic.`
      : `The pending founder-PM-hire brief uses an outdated schema (${result.reason}). Ask the user to re-run.`;
  return { status: "no_pending", note: reasonHint };
};
