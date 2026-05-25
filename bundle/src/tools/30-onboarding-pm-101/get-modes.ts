import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  OnboardingGetModesInput,
  OnboardingGetModesOutput,
} from "../../shared/schemas";
import { LESSONS } from "./data";

export const meta: ToolMeta = {
  name: "onboarding_get_modes",
  description:
    "Entry tool for Onboarding to PM 101. Calling this triggers the host to mount the ui://working-from-lenny/onboarding-pm-101 resource (an interactive iframe with a role picker, a company-stage picker, an optional PM-ratio picker, and an optional one-line 'biggest confusion' field). If your host mounts the UI, that IS the input surface — do NOT additionally render the form in chat as a duplicate surface; the user will fill it in the iframe, which calls onboarding_generate directly. The returned `lessons` array is the five fixed lesson titles (the orientation always produces all five, tailored to the inputs; there is no mode to pick). The returned `fields` array is the input fallback for hosts that cannot mount ui:// resources. If the user already has role + stage in hand, call onboarding_generate directly.",
  inputSchema: OnboardingGetModesInput,
  outputSchema: OnboardingGetModesOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/onboarding-pm-101",
};

type Input = z.infer<typeof OnboardingGetModesInput>;
type Output = z.infer<typeof OnboardingGetModesOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    lessons: LESSONS.map((l) => ({ id: l.id, title: l.title })),
    fields: [
      {
        key: "role",
        label: "Your role",
        kind: "enum",
        options: ["engineer", "designer", "sales", "customer-success", "other-cross-functional"],
      },
      {
        key: "company_stage",
        label: "Company stage",
        kind: "enum",
        options: ["seed", "series-a-b", "growth", "enterprise"],
      },
      {
        key: "pm_ratio",
        label: "PM density (optional)",
        kind: "enum",
        options: ["solo-pm", "pm-per-squad", "heavy-pm-org"],
        optional: true,
      },
      {
        key: "biggest_confusion",
        label: "The one thing about working with the PM you most want decoded (optional)",
        kind: "text",
        optional: true,
      },
    ],
    note: "Submit role + company_stage (required) to onboarding_generate. The orientation always produces all five lessons, tailored to your role and stage. No stateful follow-up is needed — this is a one-time orientation.",
  };
};
