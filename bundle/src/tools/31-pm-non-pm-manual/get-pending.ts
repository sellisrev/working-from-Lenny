import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { PmNonPmGetPendingNarrationInput, PmNonPmGetPendingNarrationOutput } from "../../shared/schemas";
import { readPending } from "./pending";

export const meta: ToolMeta = {
  name: "pm_non_pm_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their operating manual, 'give me my operating manual', 'build my PM manual', 'render my artifacts', or any follow-up to a submission just made — including any phrasing like 'show me my three artifacts', 'translate the PM frameworks for my domain', 'I just filled in the domain form', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by pm_non_pm_generate on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent pm_non_pm_generate call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/pm-non-pm-manual resource or call pm_non_pm_generate directly.",
  inputSchema: PmNonPmGetPendingNarrationInput,
  outputSchema: PmNonPmGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PmNonPmGetPendingNarrationInput>;
type Output = z.infer<typeof PmNonPmGetPendingNarrationOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", brief: result.brief, saved_at: result.saved_at };
  }
  return {
    status: "no_pending",
    note: "No operating manual brief found on disk. Ask the user to open the PM-for-Non-PMs Operating Manual resource (ui://working-from-lenny/pm-non-pm-manual) or call pm_non_pm_generate directly with their domain.",
  };
};
