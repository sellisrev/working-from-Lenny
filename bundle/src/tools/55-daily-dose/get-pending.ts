import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DailyDoseGetPendingNarrationInput, DailyDoseGetPendingNarrationOutput } from "../../shared/schemas";
import { readPending } from "./pending";

export const meta: ToolMeta = {
  name: "daily_dose_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for 'today's dose', 'my daily dose', 'what should I learn today', the 'lesson and unlearn', or any follow-up to a dose just opened, including any phrasing like 'give me my dose', 'show me today's', 'I just opened the daily dose', or any message coming from the embedded widget. Do NOT respond with 'there's nothing waiting' or 'you haven't opened a dose' without calling this tool first: the dose state lives on disk (persisted by daily_dose_pick when the dose is selected), NOT in the chat conversation context. The user may have opened the dose via the embedded widget, in which case the chat history shows no prior dose-opening but a brief is waiting on disk. Returns the narration brief saved by the most recent daily_dose_pick call. On status='ready', render the dose following its directive and voice_rules (lead with the lesson, then the passage, then one action, then the unlearn half; keep the streak line quiet). ONLY on status='no_pending' (meaning the disk check came back empty) direct the user to render the ui://working-from-lenny/daily-dose resource or call daily_dose_pick to get today's dose.",
  inputSchema: DailyDoseGetPendingNarrationInput,
  outputSchema: DailyDoseGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DailyDoseGetPendingNarrationInput>;
type Output = z.infer<typeof DailyDoseGetPendingNarrationOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", brief: result.brief, saved_at: result.saved_at };
  }
  return {
    status: "no_pending",
    note: "No daily dose brief found on disk. Ask the user to open the Daily Dose resource (ui://working-from-lenny/daily-dose) or call daily_dose_pick to get today's dose.",
  };
};
