import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  MvsGetFormInput,
  MvsGetFormOutput,
} from "../../shared/schemas";
import { FIELDS } from "./data";

export const meta: ToolMeta = {
  name: "mvs_alignment_get_form",
  description:
    "Entry tool for the Mission / Vision / Strategy Alignment Checker. Calling this triggers the host to mount the ui://working-from-lenny/mvs-alignment resource (an interactive iframe with three textareas: mission, vision, this quarter's strategy). If your host mounts the UI, that IS the input surface — do NOT additionally render the three textareas in chat as a duplicate surface; the user will paste in the iframe, which calls mvs_alignment_run directly. All three documents are required (each ≥50 chars; mission/vision ≤500 chars; strategy 200-3000 chars). If the user already has the three docs in hand, call mvs_alignment_run directly.",
  inputSchema: MvsGetFormInput,
  outputSchema: MvsGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/mvs-alignment",
};

type Input = z.infer<typeof MvsGetFormInput>;
type Output = z.infer<typeof MvsGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    fields: FIELDS.map((f) => ({
      key: f.key,
      label: f.label,
      placeholder: f.placeholder,
      min_length: f.min_length,
      max_length: f.max_length,
    })) as Output["fields"],
    note: "Paste all three documents. The brief produces a drift map (3 pairwise comparisons), platitude detector, operational gaps (named bets → roadmap questions), and a Rumelt diagnosis applied to the strategy.",
  };
};
