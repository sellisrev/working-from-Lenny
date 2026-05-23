import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HowYouBuildGetModesInput,
  HowYouBuildGetModesOutput,
} from "../../shared/schemas";
import { FIELDS, MODES } from "./data";

export const meta: ToolMeta = {
  name: "how_you_build_get_modes",
  description:
    "Entry tool for How [You] Build Product. Calling this triggers the host to mount the ui://working-from-lenny/how-you-build resource (an interactive iframe with three number inputs, three text inputs, and a 3-mode picker). If your host mounts the UI, that IS the input surface — do NOT additionally render the input form in chat as a duplicate surface; the user will fill in the team-composition fields and pick a mode in the iframe, which calls how_you_build_generate directly. The returned `modes` array is provided only as a fallback for hosts that cannot mount ui:// resources. There are three modes: 'reverence-profile' (600-900 word breathless-reverence parody of the team), 'linkedin-humblebrag' (100-150 word founder post celebrating a banal artifact), 'acquired-cold-open' (80-120 word podcast-style narrative cold open). If the user already has team composition in hand and tells you which mode to use, call how_you_build_generate directly.",
  inputSchema: HowYouBuildGetModesInput,
  outputSchema: HowYouBuildGetModesOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/how-you-build",
};

type Input = z.infer<typeof HowYouBuildGetModesInput>;
type Output = z.infer<typeof HowYouBuildGetModesOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    modes: MODES.map((m) => ({
      slug: m.slug,
      label: m.label,
      length_hint: m.length_hint,
      summary: m.summary,
    })) as Output["modes"],
    fields: FIELDS.map((f) => ({
      key: f.key,
      label: f.label,
      kind: f.kind,
      placeholder: f.placeholder,
    })) as Output["fields"],
    note: "Collect the six fields (PM/eng/designer counts + tools + rituals + last_shipped) and pick a mode. Submit to how_you_build_generate. The host chat model will render the parody output following the mode-specific directive and voice rules.",
  };
};
