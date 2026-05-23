import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  MvsGetPendingNarrationInput,
  MvsGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "mvs_alignment_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their Mission/Vision/Strategy alignment reading, 'render the drift map', 'find my platitudes', 'run Rumelt on my strategy', or any follow-up to a submission just made — including any phrasing like 'check my MVS', 'is my mission decoration', 'I just pasted the three docs', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by mvs_alignment_run on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent mvs_alignment_run call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/mvs-alignment resource or call mvs_alignment_run directly.",
  inputSchema: MvsGetPendingNarrationInput,
  outputSchema: MvsGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof MvsGetPendingNarrationInput>;
type Output = z.infer<typeof MvsGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No alignment brief has been computed yet. The user needs to submit mission + vision + strategy via the embedded UI (ui://working-from-lenny/mvs-alignment resource) or by calling mvs_alignment_run with all three texts (mission/vision ≥50 chars, strategy ≥200 chars).";

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") return { status: "ready", saved_at: result.saved_at, brief: result.brief };
  if (result.kind === "missing") return { status: "no_pending", note: NO_PENDING_NOTE };
  // eslint-disable-next-line no-console
  console.error(`[wfl] mvs get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`);
  const reasonHint = result.kind === "corrupted"
    ? `The pending alignment brief is corrupted (${result.reason}). Ask the user to re-submit.`
    : `The pending alignment brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
