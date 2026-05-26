import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DifficultConversationsGetPendingNarrationInput, DifficultConversationsGetPendingNarrationOutput } from "../../shared/schemas";
import { readPending } from "./pending";

export const meta: ToolMeta = {
  name: "difficult_conversations_get_pending_narration",
  description:
    "MUST CALL whenever the user asks to run their rehearsal, 'rehearse this conversation', 'practice the layoff talk', 'help me tell them', or any follow-up to a setup just made — including any phrasing like 'let's run it', 'play the report', 'what would Camille Fournier do', 'I just set up a difficult-conversations rehearsal', or any message coming from the embedded widget. Do NOT respond with 'you haven't set anything up' without calling this tool first: the rehearsal setup lives on disk (persisted by difficult_conversations_start on submission), NOT in the chat conversation context — the user may have set it up via the embedded widget, in which case the chat history shows no prior setup but a brief is waiting on disk. Returns the rehearsal brief saved by the most recent difficult_conversations_start call. On status='ready', CONDUCT the rehearsal following the brief's directive and voice_rules: open in the counterparty's persona, let the user respond, push back once fairly, cap at the brief's turn limit, then break character, score against the rubric, and deliver the canonical handling with the silence beat marked (in show-me mode, skip to the canonical handling; in fournier mode, skip the role-play and give keep / cut / the one move the user is missing). This family's directive runs a dialog rather than rendering a one-shot reading. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/difficult-conversations resource or call difficult_conversations_start directly.",
  inputSchema: DifficultConversationsGetPendingNarrationInput,
  outputSchema: DifficultConversationsGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DifficultConversationsGetPendingNarrationInput>;
type Output = z.infer<typeof DifficultConversationsGetPendingNarrationOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", brief: result.brief, saved_at: result.saved_at };
  }
  return {
    status: "no_pending",
    note: "No rehearsal brief found on disk. Ask the user to open the Difficult-Conversations Rehearsal resource (ui://working-from-lenny/difficult-conversations) or call difficult_conversations_start directly with their scenario.",
  };
};
