import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { OnboardingNarrateInput, OnboardingNarrateOutput } from "../../shared/schemas";
import { buildOnboardingBrief } from "../../lib/build-onboarding-brief";
import type { RoleEnum, StageEnum, PmRatioEnum } from "./data";

export const meta: ToolMeta = {
  name: "onboarding_narrate",
  description:
    "Packages a corpus-grounded orientation brief from the structured inputs. Returns voice rules, structure (LESSON_1..5 plus an optional CONFUSION_CODA), the resolved role lens and stage calibration, and corpus chunks. Pure compute — no persistence side-effect. PREFER onboarding_get_pending_narration after a generate call. Only call this tool directly if you need a brief without round-tripping through disk.",
  inputSchema: OnboardingNarrateInput,
  outputSchema: OnboardingNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof OnboardingNarrateInput>;
type Output = z.infer<typeof OnboardingNarrateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;
  const typed = inputs as {
    role: RoleEnum;
    company_stage: StageEnum;
    pm_ratio?: PmRatioEnum;
    biggest_confusion?: string;
  };
  return buildOnboardingBrief({
    role: typed.role,
    company_stage: typed.company_stage,
    pm_ratio: typed.pm_ratio,
    biggest_confusion: typed.biggest_confusion ?? "",
    user_context: user_context ?? "",
  });
};
