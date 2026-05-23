import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  OkrGetFormInput,
  OkrGetFormOutput,
  OkrLevelEnum,
  OkrStanceEnum,
} from "../../shared/schemas";
import { TOO_MANY } from "./data";

export const meta: ToolMeta = {
  name: "okr_critique_get_form",
  description:
    "Entry tool for the OKR Critique. Calling this triggers the host to mount the ui://working-from-lenny/okr-critique resource (an interactive iframe with a textarea for the OKR paste plus stance and level pickers). If your host mounts the UI, that IS the input surface — do NOT additionally render the input prompts in chat as a duplicate surface; the user will paste in the iframe, which calls okr_critique_run directly. The three stances are orthodox (treat OKRs as a load-bearing system to repair), skeptical (treat them as potential theatre), and hybrid (apply both lenses). Level is team (default) or org (triggers the cross-team coherence pass). Input length: 100-3000 chars. If the user already has a paste in hand, call okr_critique_run directly.",
  inputSchema: OkrGetFormInput,
  outputSchema: OkrGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/okr-critique",
};

type Input = z.infer<typeof OkrGetFormInput>;
type Output = z.infer<typeof OkrGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    stances: OkrStanceEnum.options as Output["stances"],
    levels: OkrLevelEnum.options as Output["levels"],
    too_many_thresholds: {
      kr_per_objective: TOO_MANY.kr_per_objective,
      objectives_team: TOO_MANY.objectives_team,
      objectives_org: TOO_MANY.objectives_org,
    },
    note: "Paste the OKRs (100-3000 chars), pick a stance and a level. The deterministic side parses objective/KR structure and counts against the too-many thresholds; the four-test critique + stance synthesis come from the host chat model.",
  };
};
