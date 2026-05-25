import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  SevenPowersScoreInput,
  SevenPowersScoreOutput,
} from "../../shared/schemas";
import { POWERS, classifyPower } from "./data";
import { buildSevenPowersNarrationBrief } from "../../lib/build-seven-powers-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "seven_powers_score",
  description:
    "Takes the structured 7 Powers answers (per power: a claim of have / maybe / no, plus 2-3 evidence ratings of true / partly / false) and persists the corpus-grounded power-map brief. The deterministic side classifies each power as has-evidence / plausible / absent from its evidence ratings, then raises the #33-specific flags where claim and evidence diverge: DELUSIONAL (claimed have, evidence absent), OVERSTATED (claimed have, evidence only plausible), BLIND SPOT (claimed no, evidence says has-evidence). It echoes the canonical questions and the user's answers so the host has them in context. The per-power benefit-and-barrier reading, the one observable test next quarter per real or plausible power, and the honest headline come from the host chat model. AFTER receiving this result, call seven_powers_get_pending_narration to fetch the brief and render the POWER MAP + per-power detail + headline. Do not render the power map on your own without the brief — the brief carries the voice rules (#33 unsentimental delusion-puncture, Helmer benefit-and-barrier discipline, no AI tells) and the closed corpus-anchor pool. Optional `user_context` (company stage / who is being assessed) flows into the persisted brief. If `persistence_warning` is set, surface it and ask the user to re-submit.",
  inputSchema: SevenPowersScoreInput,
  outputSchema: SevenPowersScoreOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof SevenPowersScoreInput>;
type Output = z.infer<typeof SevenPowersScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { answers, user_context } = args;

  const classifications = POWERS.map((def) => {
    const ans = answers[def.slug];
    const result = classifyPower(def, ans.claim, ans.evidence);
    return {
      power: def.slug,
      power_name: def.name,
      claim: ans.claim,
      evidence_score: result.evidence_score,
      evidence_max: result.evidence_max,
      evidence_pct: result.evidence_pct,
      classification: result.classification,
      flag: result.flag,
    };
  });

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildSevenPowersNarrationBrief({ answers, user_context });
    await writePending(brief, { answers, user_context: user_context ?? "" });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] seven-powers score: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via seven_powers_get_pending_narration will return no_pending. Ask the user to re-submit or call seven_powers_narrate directly.`;
  }

  return {
    classifications,
    powers: POWERS.map((p) => ({
      power: p.slug,
      power_name: p.name,
      claim_question: p.claim_question,
      evidence_questions: [...p.evidence_questions],
    })),
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
