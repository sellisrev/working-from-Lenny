import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  BurnoutGetPendingNarrationInput,
  BurnoutGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending } from "./pending";

export const meta: ToolMeta = {
  name: "burnout_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their burnout reading, 'read my burnout index', 'am I burning out', 'my recovery plan', or any follow-up to a submission just made — including any phrasing like 'what's driving my burnout', 'how bad is it', 'I just filled in the burnout check', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by burnout_score on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent burnout_score call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/burnout-index resource or call burnout_score directly.",
  inputSchema: BurnoutGetPendingNarrationInput,
  outputSchema: BurnoutGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof BurnoutGetPendingNarrationInput>;
type Output = z.infer<typeof BurnoutGetPendingNarrationOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", brief: result.brief, saved_at: result.saved_at };
  }
  return {
    status: "no_pending",
    note: "No burnout check result found on disk. Ask the user to open the Burnout Warning Index (ui://working-from-lenny/burnout-index) or call burnout_score directly with their inputs.",
  };
};
