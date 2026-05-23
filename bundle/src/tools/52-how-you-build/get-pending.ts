import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HowYouBuildGetPendingNarrationInput,
  HowYouBuildGetPendingNarrationOutput,
} from "../../shared/schemas";
import { readPending, pendingFilePath } from "./pending";

export const meta: ToolMeta = {
  name: "how_you_build_get_pending_narration",
  description:
    "MUST CALL whenever the user asks for their How [You] Build Product output, 'render my profile', 'show me the reverence profile', 'show me the LinkedIn post', 'show me the cold open', or any follow-up to a submission just made — including any phrasing like 'generate it', 'write the parody', 'I just filled in the team form', or any message coming from the embedded widget. Do NOT respond with 'you haven't submitted anything' or 'fill in the form first' without calling this tool first: the submission state lives on disk (persisted by how_you_build_generate on submission), NOT in the chat conversation context — the user may have submitted via the embedded widget, in which case the chat history shows no prior submission but a brief is waiting on disk. Returns the narration brief saved by the most recent how_you_build_generate call. On status='ready', render the brief following its directive and voice_rules. ONLY on status='no_pending' (meaning the disk check came back empty) direct the user to render the ui://working-from-lenny/how-you-build resource to fill in the team form, or to call how_you_build_generate directly with team + mode in hand.",
  inputSchema: HowYouBuildGetPendingNarrationInput,
  outputSchema: HowYouBuildGetPendingNarrationOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HowYouBuildGetPendingNarrationInput>;
type Output = z.infer<typeof HowYouBuildGetPendingNarrationOutput>;

const NO_PENDING_NOTE =
  "No parody brief has been computed yet. The user needs to submit team composition + a mode via the embedded UI (ui://working-from-lenny/how-you-build resource) or by calling how_you_build_generate with the team object and a mode ('reverence-profile', 'linkedin-humblebrag', or 'acquired-cold-open').";

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
    `[wfl] how-you-build get-pending: ${result.kind} at ${pendingFilePath()}: ${result.reason}`,
  );
  const reasonHint =
    result.kind === "corrupted"
      ? `The pending how-you-build brief is corrupted (${result.reason}). Ask the user to re-submit.`
      : `The pending how-you-build brief uses an outdated schema (${result.reason}). Ask the user to re-submit.`;
  return { status: "no_pending", note: reasonHint };
};
