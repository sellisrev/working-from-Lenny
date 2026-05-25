import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  OnboardingGetPendingNarrationInput,
  OnboardingGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending } from "./pending";

export const meta: ToolMeta = {
  name: "onboarding_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their onboarding lessons, 'give me my onboarding lessons', 'explain what PMs do', 'render my orientation', or any follow-up to a submission just made — including any phrasing like 'what should I know about working with PMs', 'show me my five lessons', 'I just filled in the onboarding form', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' without calling this tool first: the submission state lives on disk (persisted by onboarding_generate on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent onboarding_generate call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' direct the user to render the ui://working-from-lenny/onboarding-pm-101 resource or call onboarding_generate directly.",
  inputSchema: OnboardingGetPendingNarrationInput,
  outputSchema: OnboardingGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof OnboardingGetPendingNarrationInput>;
type Output = z.infer<typeof OnboardingGetPendingNarrationOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  const result = await readPending();
  if (result.kind === "ready") {
    return { status: "ready", brief: result.brief, saved_at: result.saved_at };
  }
  return {
    status: "no_pending",
    note: "No orientation brief found on disk. Ask the user to open the Onboarding to PM 101 resource (ui://working-from-lenny/onboarding-pm-101) or call onboarding_generate directly with their role and company stage.",
  };
};
