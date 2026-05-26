import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { SayingNoNarrateInput, SayingNoNarrateOutput } from "../../shared/schemas";
import { buildSayingNoBrief } from "../../lib/build-saying-no-brief";
import type { StakeholderEnum, SayingNoModeEnum } from "./data";

export const meta: ToolMeta = {
  name: "saying_no_narrate",
  description:
    "Packages the corpus-grounded rehearsal brief from the scenario inputs. Returns voice rules, the rehearsal directive (conduct a role-play, not render a reading), the stakeholder persona, the five-dimension rubric (firmness / brevity / rationale fit / door management / relationship), the turn limits, the mode, the canonical firm-no anchor, and corpus chunks. Pure compute — no persistence side-effect. PREFER saying_no_get_pending_narration after a start call. Only call this tool directly if you need the brief without round-tripping through disk.",
  inputSchema: SayingNoNarrateInput,
  outputSchema: SayingNoNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SayingNoNarrateInput>;
type Output = z.infer<typeof SayingNoNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { scenario, mode, user_context } = args;
  return buildSayingNoBrief({
    scenario: {
      stakeholder: scenario.stakeholder as StakeholderEnum,
      the_ask: scenario.the_ask,
      your_constraint: scenario.your_constraint ?? "",
    },
    mode: (mode ?? "rehearse") as SayingNoModeEnum,
    user_context: user_context ?? "",
  });
};
