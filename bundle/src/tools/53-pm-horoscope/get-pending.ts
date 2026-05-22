import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HoroscopeGetPendingNarrationInput,
  HoroscopeGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "pm_horoscope_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their PM Horoscope 'personalized reading', 'narration', 'today's reading', or any follow-up to a quiz just taken or an archetype just picked — including any phrasing like 'narrate my horoscope', 'render my horoscope', 'show me today's reading', 'I just took the horoscope quiz', or any message coming from the embedded widget. Do NOT respond with 'you haven't taken the quiz' or 'pick an archetype first' without calling this tool first: the audit state lives on disk (persisted by pm_horoscope_score_quiz or pm_horoscope_read on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior interaction but a brief is waiting on disk. Returns the narration brief saved by the most recent pm_horoscope_score_quiz or pm_horoscope_read call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' (meaning the disk check came back empty) direct the user to render the ui://working-from-lenny/horoscope resource to take the quiz, or to pick an archetype and call pm_horoscope_read.",
  inputSchema: HoroscopeGetPendingNarrationInput,
  outputSchema: HoroscopeGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HoroscopeGetPendingNarrationInput>;
type Output = z.infer<typeof HoroscopeGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No horoscope brief has been computed yet. The user needs to either render the ui://working-from-lenny/horoscope resource to take the six-question quiz, or pick an archetype directly and call pm_horoscope_read.";

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
    `[wfl] horoscope get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`,
  );
  const reasonHint =
    result.kind === "corrupted"
      ? `The pending horoscope file is corrupted (${result.reason}). Ask the user to retake the quiz or call pm_horoscope_read again.`
      : `The pending horoscope file uses an outdated schema (${result.reason}). Ask the user to retake the quiz or call pm_horoscope_read again.`;
  return { status: "no_pending", note: reasonHint };
};
