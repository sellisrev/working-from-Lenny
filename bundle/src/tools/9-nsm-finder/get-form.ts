import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  NSMGetFormInput,
  NSMGetFormOutput,
} from "../../shared/schemas";
import { FIELDS, NSM_FAMILIES } from "./data";

export const meta: ToolMeta = {
  name: "nsm_finder_get_form",
  description:
    "Entry tool for the North Star Metric Finder. Calling this triggers the host to mount the ui://working-from-lenny/nsm-finder resource (an interactive iframe with a multi-field wizard: business shape, primary user action, monetization, revenue band, stage, biggest friction, plus optional 'what makes you unusual' and a dashboard paste). If your host mounts the UI, that IS the input surface — do NOT additionally render the inputs in chat as a duplicate surface; the user will fill them in the iframe, which calls nsm_finder_run directly. The returned `fields` array is the fallback for hosts that cannot mount ui:// resources; `nsm_families` is the business-shape → NSM-family map. If the user already has all inputs in hand, call nsm_finder_run directly.",
  inputSchema: NSMGetFormInput,
  outputSchema: NSMGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/nsm-finder",
};

type Input = z.infer<typeof NSMGetFormInput>;
type Output = z.infer<typeof NSMGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    fields: FIELDS.map((f) => ({
      key: f.key,
      label: f.label,
      kind: f.kind,
      required: f.required,
      options: f.options,
      placeholder: f.placeholder,
      max_length: f.max_length,
      only_when: f.only_when,
    })),
    nsm_families: NSM_FAMILIES as Output["nsm_families"],
    note: "Submit the inputs to nsm_finder_run. The brief returns three candidate NSMs (each critiqued across vanity risk / leading-vs-lagging / gameability / break case + 3-5 input metrics) plus an optional dashboard audit when you paste your current metrics.",
  };
};
