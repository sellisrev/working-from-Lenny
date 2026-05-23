import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HowYouBuildGenerateInput,
  HowYouBuildGenerateOutput,
} from "../../shared/schemas";
import { buildHowYouBuildNarrationBrief } from "../../lib/build-how-you-build-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "how_you_build_generate",
  description:
    "Takes a team composition (PM/engineer/designer counts + tools + rituals + last shipped) and a mode (reverence-profile / linkedin-humblebrag / acquired-cold-open) and prepares the parody narration brief. The deterministic side validates input, assembles the [INPUT] block exactly as apps/52-how-you-build/prompt.md specifies, and packages the mode-specific directive + voice rules; the parody output itself comes from the host chat model. AFTER receiving this result, call how_you_build_get_pending_narration to fetch the brief and render it for the user following its `directive` and `voice_rules`. Do not render the parody on your own without the brief — the brief carries the genre-specific voice rules (length cap, tone constraints, no-AI-tells list) the output depends on. If the returned `persistence_warning` field is set, the brief could not be persisted — surface the warning and ask the user to re-submit.",
  inputSchema: HowYouBuildGenerateInput,
  outputSchema: HowYouBuildGenerateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HowYouBuildGenerateInput>;
type Output = z.infer<typeof HowYouBuildGenerateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { mode, team, user_context } = args;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildHowYouBuildNarrationBrief({
      mode,
      team,
      user_context,
    });
    await writePending(brief, {
      mode,
      team,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(
      `[wfl] how-you-build generate: failed to persist pending brief: ${msg}`,
    );
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via how_you_build_get_pending_narration will return no_pending. Ask the user to re-submit, or call how_you_build_narrate directly with the same mode + team.`;
  }

  return {
    mode,
    team,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
