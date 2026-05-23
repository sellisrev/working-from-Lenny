import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PmifyGetPendingNarrationInput,
  PmifyGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "pmify_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their PM-ify translation, 'render my translation', 'show me the PM version', 'show me the plain English version', or any follow-up to a translation just submitted — including any phrasing like 'translate it', 'pm-ify it', 'de-pm-ify it', 'I just pasted my email', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' or 'paste your text first' without calling this tool first: the submission state lives on disk (persisted by pmify_translate on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent pmify_translate call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' (meaning the disk check came back empty) direct the user to render the ui://working-from-lenny/pmify resource to paste their text, or to call pmify_translate directly with their text and mode in hand.",
  inputSchema: PmifyGetPendingNarrationInput,
  outputSchema: PmifyGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PmifyGetPendingNarrationInput>;
type Output = z.infer<typeof PmifyGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No translation brief has been computed yet. The user needs to submit a text via the embedded UI (ui://working-from-lenny/pmify resource) or by calling pmify_translate with their text and a mode ('pm-ify' or 'de-pm-ify').";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return {
      status: "ready",
      saved_at: result.saved_at,
      brief: result.brief,
    };
  }
  if (result.kind === "missing") {
    return { status: "no_pending", note: NO_PENDING_NOTE };
  }
  // eslint-disable-next-line no-console
  console.error(
    `[wfl] pmify get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`,
  );
  const reasonHint =
    result.kind === "corrupted"
      ? `The pending pmify brief is corrupted (${result.reason}). Ask the user to re-submit.`
      : `The pending pmify brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
