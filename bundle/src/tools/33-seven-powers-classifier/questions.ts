import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  SevenPowersGetQuestionsInput,
  SevenPowersGetQuestionsOutput,
} from "../../shared/schemas";
import { POWERS } from "./data";

export const meta: ToolMeta = {
  name: "seven_powers_get_questions",
  description:
    "Entry tool for the 7 Powers Self-Classifier. Calling this triggers the host to mount the ui://working-from-lenny/seven-powers resource (an interactive iframe with the claim + evidence questions grouped by power, and submit). If your host mounts the UI, that IS the questionnaire — do NOT additionally render the questions in chat as a duplicate surface; the user will answer in the iframe, which calls seven_powers_score directly. The returned `powers` array is the fallback for hosts that cannot mount ui:// resources; each power carries its one claim question (have / maybe / no) and its 2-3 evidence questions (true / partly / false). Classification is positional against this canonical bank — if you do render questions in chat (only when ui:// is unavailable), use these exact questions verbatim; never substitute generic strategy questions. If the user already has all answers in hand, call seven_powers_score directly.",
  inputSchema: SevenPowersGetQuestionsInput,
  outputSchema: SevenPowersGetQuestionsOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/seven-powers",
};

type Input = z.infer<typeof SevenPowersGetQuestionsInput>;
type Output = z.infer<typeof SevenPowersGetQuestionsOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    powers: POWERS.map((p) => ({
      power: p.slug,
      power_name: p.name,
      claim_question: p.claim_question,
      evidence_questions: [...p.evidence_questions],
    })),
    claim_options: ["have", "maybe", "no"],
    evidence_options: ["true", "partly", "false"],
    note: "For each power, collect one claim (have/maybe/no) plus its 2-3 evidence ratings (true/partly/false), in this order. Submit to seven_powers_score as an answers object keyed by power slug.",
  };
};
