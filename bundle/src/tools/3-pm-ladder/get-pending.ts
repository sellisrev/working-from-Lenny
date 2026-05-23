import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  LadderGetPendingNarrationInput,
  LadderGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "pm_ladder_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their PM Ladder 'gap report', 'personalized read', 'narration', or any follow-up to the self-assessment just taken — including any phrasing like 'narrate my ladder', 'render my gap report', 'show me my levels', 'I just took the ladder assessment', or any message coming from the embedded widget. Do NOT respond with 'you haven't taken the assessment' without calling this tool first: the assessment state lives on disk (persisted by pm_ladder_score on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior assessment but a brief is waiting on disk. Returns the narration brief saved by the most recent pm_ladder_score call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' (meaning the disk check came back empty) direct the user to render the ui://working-from-lenny/ladder resource to take the assessment.",
  inputSchema: LadderGetPendingNarrationInput,
  outputSchema: LadderGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof LadderGetPendingNarrationInput>;
type Output = z.infer<typeof LadderGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No gap-report brief has been computed yet. The user needs to complete the PM Ladder Self-Assessment via the embedded UI (ui://working-from-lenny/ladder resource) or by answering the 30 canonical questions from pm_ladder_get_questions and submitting them to pm_ladder_score.";

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
    `[wfl] ladder get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`,
  );
  const reasonHint =
    result.kind === "corrupted"
      ? `The pending ladder brief is corrupted (${result.reason}). Ask the user to retake the assessment.`
      : `The pending ladder brief uses an outdated schema (${result.reason}). Ask the user to retake the assessment.`;
  return { status: "no_pending", note: reasonHint };
};
