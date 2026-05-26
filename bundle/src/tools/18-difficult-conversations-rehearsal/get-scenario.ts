import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DifficultConversationsGetScenarioInput, DifficultConversationsGetScenarioOutput } from "../../shared/schemas";
import { SCENARIO_DATA } from "./data";

export const meta: ToolMeta = {
  name: "difficult_conversations_get_scenario",
  description:
    "Entry tool for the Difficult-Conversations Rehearsal. Calling this triggers the host to mount the ui://working-from-lenny/difficult-conversations resource (an interactive iframe: a scenario picker, an optional relationship field, an optional intended-approach field for fournier mode, and a mode toggle of rehearse / show-me / fournier). If your host mounts the UI, that IS the input surface — do NOT additionally render the picker in chat as a duplicate surface; the user will set up the scenario in the iframe, which calls difficult_conversations_start directly. The returned `scenarios` array (with each one's realistic counterparty reaction) and `modes` array are the fallback for hosts that cannot mount ui:// resources. If the user already knows the scenario, call difficult_conversations_start directly.",
  inputSchema: DifficultConversationsGetScenarioInput,
  outputSchema: DifficultConversationsGetScenarioOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/difficult-conversations",
};

type Input = z.infer<typeof DifficultConversationsGetScenarioInput>;
type Output = z.infer<typeof DifficultConversationsGetScenarioOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    scenarios: (Object.entries(SCENARIO_DATA) as [keyof typeof SCENARIO_DATA, typeof SCENARIO_DATA[keyof typeof SCENARIO_DATA]][]).map(
      ([slug, d]) => ({
        slug: slug as Output["scenarios"][number]["slug"],
        label: d.label,
        counterparty_reaction: d.counterparty_reaction,
      }),
    ),
    modes: [
      {
        slug: "rehearse" as const,
        label: "Rehearse",
        description: "The host plays the counterparty. You practice the conversation. After the exchange, you get scored on all five dimensions and the canonical handling with the silence beat.",
      },
      {
        slug: "show-me" as const,
        label: "Show me",
        description: "Skip the back-and-forth. The host delivers the canonical handling for this scenario directly, with the silence beat marked.",
      },
      {
        slug: "fournier" as const,
        label: "Fournier",
        description: "Share your intended opening. The host gives a keep / cut / one-move-you're-missing analysis against canonical leadership guidance. Best for: you know what you want to say but want a second opinion before you say it.",
      },
    ],
    note: "Submit situation.scenario (required) to difficult_conversations_start. Optional: your_relationship (context), intended_approach (for fournier mode), and mode (rehearse / show-me / fournier, default rehearse).",
  };
};
