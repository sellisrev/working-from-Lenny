import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { SayingNoGetPendingNarrationInput, SayingNoGetPendingNarrationOutput } from "../../shared/schemas";
import { readPending } from "./pending";

export const meta: ToolMeta = {
  name: "saying_no_get_pending_narration",
  description:
    "MUST CALL whenever the user asks to run their rehearsal, 'rehearse my no', 'practice saying no', 'help me decline this', or any follow-up to a setup just made — including any phrasing like 'let's run it', 'play the stakeholder', 'I just set up a saying-no rehearsal', or any message coming from the embedded widget. Do NOT respond with 'you haven't set anything up' without calling this tool first: the rehearsal setup lives on disk (persisted by saying_no_start on submission), NOT in the chat conversation context — the user may have set it up via the embedded widget, in which case the chat history shows no prior setup but a brief is waiting on disk. Returns the rehearsal brief saved by the most recent saying_no_start call. On status='ready', CONDUCT the rehearsal following the brief's directive and voice_rules: open in the stakeholder's persona with the ask, let the user respond, push back once fairly, cap at the brief's turn limit, then break character, score against the rubric, and deliver the canonical firm no (in show-me mode, skip straight to the canonical no). This is the one app whose directive runs a dialog rather than rendering a one-shot reading. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/saying-no resource or call saying_no_start directly.",
  inputSchema: SayingNoGetPendingNarrationInput,
  outputSchema: SayingNoGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SayingNoGetPendingNarrationInput>;
type Output = z.infer<typeof SayingNoGetPendingNarrationOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", brief: result.brief, saved_at: result.saved_at };
  }
  return {
    status: "no_pending",
    note: "No rehearsal brief found on disk. Ask the user to open the Saying No Rehearsal resource (ui://working-from-lenny/saying-no) or call saying_no_start directly with their stakeholder and the ask.",
  };
};
