import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DecisionLogGetFormInput, DecisionLogGetFormOutput } from "../../shared/schemas";
import { PRESETS } from "./data";
import { loadCollection } from "./collection";

export const meta: ToolMeta = {
  name: "decision_log_get_form",
  description:
    "Entry tool for the Decision Log. Calling this triggers the host to mount the ui://working-from-lenny/decision-log resource (a small log/resolve console: an add form with a preset + custom decision-type picker, and an open-decisions list with resolve buttons). If your host mounts the UI, that IS the input surface — do NOT additionally render the form in chat as a duplicate surface; the user will log and resolve in the iframe, which calls decision_log_add / decision_log_resolve directly. The returned `presets` array is the seven preset decision types plus 'other'; `remembered_types` is the user's prior custom types (read from the collection) offered as additional quick-picks; `fields` is the add-form field fallback for hosts that cannot mount ui:// resources. To see current entries, call decision_log_list. To read the calibration, call decision_log_calibrate.",
  inputSchema: DecisionLogGetFormInput,
  outputSchema: DecisionLogGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/decision-log",
};

type Input = z.infer<typeof DecisionLogGetFormInput>;
type Output = z.infer<typeof DecisionLogGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  let remembered_types: string[] = [];
  try {
    const col = await loadCollection();
    const customTypes = new Set<string>();
    for (const e of col.entries) {
      if (!(PRESETS as readonly string[]).includes(e.decision_type)) {
        customTypes.add(e.decision_type);
      }
    }
    remembered_types = [...customTypes];
  } catch {
    // non-fatal: just skip remembered types
  }

  return {
    presets: [...PRESETS],
    remembered_types,
    fields: [
      { key: "decision_text", label: "What are you deciding?", kind: "text" },
      { key: "decision_type", label: "Decision type (preset or custom)", kind: "enum-or-custom" },
      { key: "confidence_pct", label: "How sure are you? (1–99)", kind: "int" },
      { key: "predicted_outcome", label: "What specifically do you expect if you're right?", kind: "text" },
    ],
    note: "Log decisions with decision_log_add. Resolve them with decision_log_resolve when the outcome is known. Compute your Brier calibration with decision_log_calibrate.",
  };
};
