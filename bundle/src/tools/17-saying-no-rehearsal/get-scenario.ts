import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { SayingNoGetScenarioInput, SayingNoGetScenarioOutput } from "../../shared/schemas";
import { STAKEHOLDER_DATA } from "./data";

export const meta: ToolMeta = {
  name: "saying_no_get_scenario",
  description:
    "Entry tool for the Saying No Rehearsal. Calling this triggers the host to mount the ui://working-from-lenny/saying-no resource (an interactive iframe: a stakeholder picker, an ask textarea, an optional constraint field, and a mode toggle of rehearse / show-me). If your host mounts the UI, that IS the input surface — do NOT additionally render the picker in chat as a duplicate surface; the user will set up the scenario in the iframe, which calls saying_no_start directly. The returned `stakeholders` array (with each one's pressure style) and `modes` array are the fallback for hosts that cannot mount ui:// resources. If the user already has stakeholder + ask in hand, call saying_no_start directly.",
  inputSchema: SayingNoGetScenarioInput,
  outputSchema: SayingNoGetScenarioOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/saying-no",
};

type Input = z.infer<typeof SayingNoGetScenarioInput>;
type Output = z.infer<typeof SayingNoGetScenarioOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    stakeholders: (Object.entries(STAKEHOLDER_DATA) as [keyof typeof STAKEHOLDER_DATA, typeof STAKEHOLDER_DATA[keyof typeof STAKEHOLDER_DATA]][]).map(
      ([slug, d]) => ({
        slug: slug as Output["stakeholders"][number]["slug"],
        label: d.label,
        pressure_style: d.pressure_style,
      }),
    ),
    modes: [
      {
        slug: "rehearse" as const,
        label: "Rehearse",
        description: "The host plays the stakeholder. You practice your no. After the exchange, you get scored on all five dimensions and the canonical version.",
      },
      {
        slug: "show-me" as const,
        label: "Show me",
        description: "Skip the back-and-forth. The host delivers the canonical polite firm no for this stakeholder directly.",
      },
    ],
    note: "Submit stakeholder + the_ask (required) to saying_no_start. Optional: your_constraint (what you can't give up), and mode (rehearse or show-me, default rehearse).",
  };
};
