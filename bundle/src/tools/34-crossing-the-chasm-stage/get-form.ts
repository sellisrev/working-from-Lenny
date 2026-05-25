import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  ChasmGetFormInput,
  ChasmGetFormOutput,
} from "../../shared/schemas";
import { FIELDS, STAGE_CONTENT } from "./data";

export const meta: ToolMeta = {
  name: "chasm_get_form",
  description:
    "Entry tool for the Crossing-the-Chasm Stage Finder. Calling this triggers the host to mount the ui://working-from-lenny/chasm-stage resource (an interactive iframe with a multi-field wizard: customer mix as three numbers, acquisition trend, pain specificity, whole-product completeness, beachhead naming, plus optional reference-customer mix). If your host mounts the UI, that IS the input surface — do NOT additionally render the inputs in chat as a duplicate surface; the user will fill them in the iframe, which calls chasm_score directly. The returned `fields` array is the fallback for hosts that cannot mount ui:// resources; `stages` is the Moore adoption-curve reference. If the user already has all inputs in hand, call chasm_score directly.",
  inputSchema: ChasmGetFormInput,
  outputSchema: ChasmGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/chasm-stage",
};

type Input = z.infer<typeof ChasmGetFormInput>;
type Output = z.infer<typeof ChasmGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    fields: FIELDS.map((f) => ({
      key: f.key,
      label: f.label,
      kind: f.kind,
      required: f.required,
      options: f.options,
      help: f.help,
    })),
    stages: [
      { stage: "early-market", label: STAGE_CONTENT["early-market"].label },
      { stage: "at-the-chasm", label: STAGE_CONTENT["at-the-chasm"].label },
      { stage: "bowling-alley", label: STAGE_CONTENT["bowling-alley"].label },
      { stage: "tornado", label: STAGE_CONTENT["tornado"].label },
      { stage: "main-street", label: STAGE_CONTENT["main-street"].label },
    ],
    note: "Submit the inputs to chasm_score. The brief returns the assigned Moore stage, the placing signals, the play for the next transition, and the most common way that play gets run wrong. customer_mix is three integers roughly summing to 100; the engine normalizes.",
  };
};
