import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { PmNonPmNarrateInput, PmNonPmNarrateOutput } from "../../shared/schemas";
import { buildPmNonPmBrief } from "../../lib/build-pm-non-pm-brief";
import type { DomainEnum, ScaleEnum } from "./data";

export const meta: ToolMeta = {
  name: "pm_non_pm_narrate",
  description:
    "Packages a corpus-grounded operating-manual brief from the structured inputs. Returns voice rules, structure (ARTIFACT_1..3 plus an optional FRICTION_CODA), the resolved stakeholder roster, relabeled rubric axes, override gate, stop-doing candidates, and corpus chunks. Pure compute — no persistence side-effect. PREFER pm_non_pm_get_pending_narration after a generate call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: PmNonPmNarrateInput,
  outputSchema: PmNonPmNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PmNonPmNarrateInput>;
type Output = z.infer<typeof PmNonPmNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const typed = inputs as {
    domain: DomainEnum;
    scale?: ScaleEnum;
    biggest_friction?: string;
  };
  return buildPmNonPmBrief({
    domain: typed.domain,
    scale: typed.scale ?? "mid",
    biggest_friction: typed.biggest_friction ?? "",
    user_context: user_context ?? "",
  });
};
