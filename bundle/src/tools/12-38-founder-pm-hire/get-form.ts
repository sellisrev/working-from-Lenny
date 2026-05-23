import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  FounderGetFormInput,
  FounderGetFormOutput,
  FounderVerdictEnum,
} from "../../shared/schemas";
import { FIELDS } from "./data";

export const meta: ToolMeta = {
  name: "founder_pm_hire_get_form",
  description:
    "Entry tool for the Founder PM hire diagnostic. Calling this triggers the host to mount the ui://working-from-lenny/founder-pm-hire resource (an interactive iframe with the 8-input wizard). If your host mounts the UI, that IS the questionnaire — do NOT additionally render the 8 inputs in chat as a duplicate surface; the user will fill them in the iframe, which calls founder_pm_hire_decide directly. The returned `fields` array is provided only as a fallback for hosts that cannot mount ui:// resources. The five possible verdicts are: stay-founder-mode, not-yet, hire-apm, hire-empowered-pm, hire-head-of-product. If the user already has the 8 inputs in hand, call founder_pm_hire_decide directly.",
  inputSchema: FounderGetFormInput,
  outputSchema: FounderGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/founder-pm-hire",
};

type Input = z.infer<typeof FounderGetFormInput>;
type Output = z.infer<typeof FounderGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    fields: FIELDS.map((f) => ({
      key: f.key,
      label: f.label,
      kind: f.kind,
      options: f.options,
      placeholder: f.placeholder,
    })),
    verdicts: FounderVerdictEnum.options as Output["verdicts"],
    note: "Eight inputs (one int + seven enums) drive a deterministic decision tree biased toward 'not-yet' for early stages and away from 'hire-head-of-product' for non-heavy density. Submit the inputs to founder_pm_hire_decide.",
  };
};
