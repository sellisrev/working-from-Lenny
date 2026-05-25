import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  SpottingGetPendingNarrationInput,
  SpottingGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "spotting_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their field-guide 'read', 'narration', 'what should I do about my PM', or any follow-up to a field guide just filled in — including any phrasing like 'is my PM bad', 'read my field guide', 'give me my results', 'I just filled in the field guide', or any message coming from the embedded widget. Do NOT respond with 'you haven't filled anything in' without calling this tool first: the field-guide state lives on disk (persisted by spotting_score on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent spotting_score call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' (meaning the disk check came back empty) direct the user to render the ui://working-from-lenny/spotting-bad-pm resource to fill in the field guide.",
  inputSchema: SpottingGetPendingNarrationInput,
  outputSchema: SpottingGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SpottingGetPendingNarrationInput>;
type Output = z.infer<typeof SpottingGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No narration brief has been computed yet. The user needs to complete the Spotting Bad PM Behaviors field guide via the embedded UI (ui://working-from-lenny/spotting-bad-pm resource) or by rating the 15 canonical behaviors from spotting_get_questions and submitting them to spotting_score.";

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
    `[wfl] spotting: get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`,
  );
  const reasonHint =
    result.kind === "corrupted"
      ? `The pending narration file is corrupted (${result.reason}). Ask the user to re-submit the field guide.`
      : `The pending narration file uses an outdated schema (${result.reason}). Ask the user to re-submit the field guide.`;
  return { status: "no_pending", note: reasonHint };
};
