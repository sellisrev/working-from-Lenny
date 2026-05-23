import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PmifyGetModesInput,
  PmifyGetModesOutput,
} from "../../shared/schemas";
import { MODES, PATTERN_POOL } from "./data";

export const meta: ToolMeta = {
  name: "pmify_get_modes",
  description:
    "Entry tool for PM-ify My Inbox. Calling this triggers the host to mount the ui://working-from-lenny/pmify resource (an interactive iframe with a mode picker — pm-ify vs de-pm-ify — and a textarea). If your host mounts the UI, that IS the input surface — do NOT additionally render the mode picker in chat as a duplicate surface; the user will paste their text and pick a mode in the iframe, which calls pmify_translate directly. The returned `modes` array is provided only as a fallback for hosts that cannot mount ui:// resources. There are two modes: 'pm-ify' (plain English → corporate-PM-speak, e.g. translating a message from a family member into how a PM would write it to a sales VP) and 'de-pm-ify' (corporate-PM-speak → plain English, stripping the buried no out of a real work decline). If the user already has text in hand and tells you which way to translate, call pmify_translate directly.",
  inputSchema: PmifyGetModesInput,
  outputSchema: PmifyGetModesOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/pmify",
};

type Input = z.infer<typeof PmifyGetModesInput>;
type Output = z.infer<typeof PmifyGetModesOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    modes: MODES.map((m) => ({
      slug: m.slug,
      label: m.label,
      direction: m.direction,
      example: m.example,
    })) as Output["modes"],
    patterns: PATTERN_POOL as Output["patterns"],
    note: "Pick a mode and paste the user's text. Submit to pmify_translate. The host chat model will render the translation + 2-4 deadpan footnotes citing the bad-PM patterns the translation triggers (pm-ify mode) or the ones the original demonstrated (de-pm-ify mode).",
  };
};
