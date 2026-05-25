import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { OnboardingGenerateInput, OnboardingGenerateOutput } from "../../shared/schemas";
import { buildOnboardingBrief } from "../../lib/build-onboarding-brief";
import { writePending } from "./pending";
import type { RoleEnum, StageEnum, PmRatioEnum } from "./data";

export const meta: ToolMeta = {
  name: "onboarding_generate",
  description:
    "Takes the non-PM's inputs (role, company_stage, optional pm_ratio, optional biggest_confusion) and persists the corpus-grounded orientation brief. The deterministic side validates the inputs and resolves the role lens and stage-calibration for each of the five fixed lessons (artifacts / pushing back / good-vs-bad PM / cross-functional rituals / escalation), selecting the corpus anchors per lesson; the five lessons themselves come from the host chat model. AFTER receiving this result, call onboarding_get_pending_narration to fetch the brief and render the five lessons (plus the confusion coda when biggest_confusion was supplied). Do not render the lessons on your own without the brief — the brief carries the voice rules (#30 plain, useful, lightly wry, never reverent, honesty over advocacy) and the closed corpus-anchor pool. Optional `user_context` flows into the persisted brief. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: OnboardingGenerateInput,
  outputSchema: OnboardingGenerateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof OnboardingGenerateInput>;
type Output = z.infer<typeof OnboardingGenerateOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { inputs, user_context } = args;

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildOnboardingBrief({
      role: inputs.role as RoleEnum,
      company_stage: inputs.company_stage as StageEnum,
      pm_ratio: inputs.pm_ratio as PmRatioEnum | undefined,
      biggest_confusion: inputs.biggest_confusion ?? "",
      user_context: user_context ?? "",
    });
    await writePending(brief, {
      role: inputs.role,
      company_stage: inputs.company_stage,
      pm_ratio: inputs.pm_ratio,
      biggest_confusion: inputs.biggest_confusion ?? "",
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] onboarding_generate: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via onboarding_get_pending_narration will return no_pending. Ask the user to re-submit.`;
  }

  return {
    inputs: inputs as Record<string, unknown>,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
