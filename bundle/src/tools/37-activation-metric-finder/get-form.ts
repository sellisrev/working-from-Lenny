import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  ActivationGetFormInput,
  ActivationGetFormOutput,
} from "../../shared/schemas";
import { ACTIVATION_FAMILIES, FIELDS } from "./data";

export const meta: ToolMeta = {
  name: "activation_finder_get_form",
  description:
    "Entry tool for the Activation Metric Finder. Calling this triggers the host to mount the ui://working-from-lenny/activation-finder resource (an interactive iframe with a multi-field wizard: business shape, primary value action, monetization, stage, plus optional current-rate / aha-moment / funnel paste). If your host mounts the UI, that IS the input surface — do NOT additionally render the inputs in chat as a duplicate surface; the user will fill them in the iframe, which calls activation_finder_run directly. The returned `fields` array is the fallback for hosts that cannot mount ui:// resources; `activation_families` is the business-shape → activation-event-family map. If the user already has all inputs in hand, call activation_finder_run directly. NOTE: this tool pairs with #9 NSM Finder via a shared input-metrics-tree shape — a user who runs both can copy-paste between them losslessly.",
  inputSchema: ActivationGetFormInput,
  outputSchema: ActivationGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/activation-finder",
};

type Input = z.infer<typeof ActivationGetFormInput>;
type Output = z.infer<typeof ActivationGetFormOutput>;

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
    activation_families: ACTIVATION_FAMILIES as Output["activation_families"],
    note: "Submit the inputs to activation_finder_run. The brief returns three candidate activation events (each critiqued across vanity / leading-vs-retention / friction-balance / customer-interview-signal + a corpus-grounded benchmark range + 3-5 input metrics) plus an optional funnel audit when you paste your current funnel. AI-product caveat triggers automatically when business_unusual or primary_value_action mentions AI/LLM/model/etc.",
  };
};
