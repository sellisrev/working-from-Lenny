import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PmifyTranslateInput,
  PmifyTranslateOutput,
} from "../../shared/schemas";
import { buildPmifyNarrationBrief } from "../../lib/build-pmify-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "pmify_translate",
  description:
    "Takes a chunk of text and a translation mode (pm-ify or de-pm-ify) and prepares the user's translation brief. pm-ify converts plain English into the corporate-PM-speak the user would write to a sales VP (capacity language, Q2 deprioritization framing, async-by-default scheduling, at least one 'circling back'); de-pm-ify strips that voice back to how someone would say the same thing to a friend at a coffee shop. The deterministic side just validates the input and packages the pattern pool for footnoting; the translation itself comes from the host chat model. AFTER receiving this result, call pmify_get_pending_narration to fetch the corpus-grounded narration brief and render it for the user following its `directive` and `voice_rules`. Do not render a translation on your own without the brief — the brief carries the voice rules and pattern pool the output depends on. Maximum text length 2,000 characters. If the returned `persistence_warning` field is set, the brief could not be persisted — surface the warning to the user and recommend they re-submit.",
  inputSchema: PmifyTranslateInput,
  outputSchema: PmifyTranslateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PmifyTranslateInput>;
type Output = z.infer<typeof PmifyTranslateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { mode, text, user_context } = args;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildPmifyNarrationBrief({
      mode,
      user_text: text,
      user_context,
    });
    await writePending(brief, {
      mode,
      user_text: text,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] pmify translate: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via pmify_get_pending_narration will return no_pending. Ask the user to re-submit, or call pmify_narrate directly with the same mode + text.`;
  }

  return {
    mode,
    text,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
