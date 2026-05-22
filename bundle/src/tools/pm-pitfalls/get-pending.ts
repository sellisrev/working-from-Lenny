import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PitfallGetPendingNarrationInput,
  PitfallGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "pm_pitfalls_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their PM Pitfalls 'personalized read', 'narration', 'audit results writeup', or any follow-up to an audit just taken — including any phrasing like 'narrate my pitfalls', 'give me my personalized read', 'show me my results', 'I completed the audit', or any message coming from the embedded widget. Do NOT respond with 'you haven't taken the audit' without calling this tool first: the audit state lives on disk (persisted by pm_pitfalls_score on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior audit-taking but a brief is waiting on disk. Returns the narration brief saved by the most recent pm_pitfalls_score call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' (meaning the disk check came back empty) direct the user to render the ui://working-from-lenny/pitfalls resource to take the audit.",
  inputSchema: PitfallGetPendingNarrationInput,
  outputSchema: PitfallGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PitfallGetPendingNarrationInput>;
type Output = z.infer<typeof PitfallGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No narration brief has been computed yet. The user needs to complete the PM Pitfalls audit via the embedded UI (ui://working-from-lenny/pitfalls resource) or by answering the 20 canonical questions from pm_pitfalls_get_questions and submitting them to pm_pitfalls_score.";

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
  // Corrupted and schema-mismatch cases: log to stderr (smoke tests + manual
  // runs catch this; Desktop swallows server stderr so the user-facing path
  // is the note text) and return no_pending so the host directs the user to
  // retake the audit rather than rendering a malformed brief.
  // eslint-disable-next-line no-console
  console.error(
    `[wfl] get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`,
  );
  const reasonHint =
    result.kind === "corrupted"
      ? `The pending narration file is corrupted (${result.reason}). Ask the user to retake the audit.`
      : `The pending narration file uses an outdated schema (${result.reason}). Ask the user to retake the audit.`;
  return { status: "no_pending", note: reasonHint };
};
