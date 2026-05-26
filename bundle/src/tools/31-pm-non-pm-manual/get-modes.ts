import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { PmNonPmGetModesInput, PmNonPmGetModesOutput } from "../../shared/schemas";
import { ARTIFACTS } from "./data";

export const meta: ToolMeta = {
  name: "pm_non_pm_get_modes",
  description:
    "Entry tool for the PM-for-Non-PMs Operating Manual. Calling this triggers the host to mount the ui://working-from-lenny/pm-non-pm-manual resource (an interactive iframe with a domain picker, an optional scale picker, and an optional one-line 'biggest friction' field). If your host mounts the UI, that IS the input surface — do NOT additionally render the form in chat as a duplicate surface; the user will fill it in the iframe, which calls pm_non_pm_generate directly. The returned `artifacts` array is the three fixed artifact titles (the manual always produces all three, tailored to the domain; there is no mode to pick). The returned `fields` array is the input fallback for hosts that cannot mount ui:// resources. If the user already has their domain in hand, call pm_non_pm_generate directly.",
  inputSchema: PmNonPmGetModesInput,
  outputSchema: PmNonPmGetModesOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/pm-non-pm-manual",
};

type Input = z.infer<typeof PmNonPmGetModesInput>;
type Output = z.infer<typeof PmNonPmGetModesOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    artifacts: ARTIFACTS.map((a) => ({ id: a.id, title: a.title })),
    fields: [
      {
        key: "domain",
        label: "Your domain",
        kind: "enum",
        options: ["school-principal", "nonprofit-ed", "hospital-service-line", "research-lab-pi"],
      },
      {
        key: "scale",
        label: "Scale",
        kind: "enum",
        options: ["small", "mid", "large"],
        optional: true,
      },
      {
        key: "biggest_friction",
        label: "The one PM-adjacent thing causing the most friction in your work (optional)",
        kind: "text",
        optional: true,
      },
    ],
    note: "Submit domain (required) to pm_non_pm_generate. The manual always produces all three artifacts — JTBD interview kit, prioritization rubric, and stop-doing list — tailored to your domain and scale.",
  };
};
