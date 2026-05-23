import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  StrategyPressureTestInput,
  StrategyPressureTestOutput,
} from "../../shared/schemas";
import { classifyDocType } from "./data";
import { buildStrategyNarrationBrief } from "../../lib/build-strategy-brief";
import { writePending } from "./pending";

export const meta: ToolMeta = {
  name: "strategy_pressure_test_run",
  description:
    "Takes a strategy / roadmap / PRD text (200-4000 chars), classifies it deterministically via a cheap doc-type router, and persists the corpus-grounded critique brief. AFTER calling this, render the five (or six, when mixed) objection cards by calling strategy_pressure_test_get_pending_narration. Do not render objections on your own without the brief — the brief carries the closed corpus-anchor pool, the four-pass structure, and the voice rules the output depends on. If `persistence_warning` is set, ask the user to re-submit.",
  inputSchema: StrategyPressureTestInput,
  outputSchema: StrategyPressureTestOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof StrategyPressureTestInput>;
type Output = z.infer<typeof StrategyPressureTestOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { strategy_text, user_context } = args;
  const docType = classifyDocType(strategy_text);

  let persistenceWarning: string | undefined;
  try {
    const brief = await buildStrategyNarrationBrief({
      strategy_text,
      user_context,
      doc_type: docType,
    });
    await writePending(brief, {
      doc_type: docType,
      strategy_text,
      user_context: user_context ?? "",
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] strategy run: failed to persist pending brief: ${msg}`);
    persistenceWarning = `Narration brief could not be persisted: ${msg}. Retrieving via strategy_pressure_test_get_pending_narration will return no_pending. Ask the user to re-submit or call strategy_pressure_test_narrate directly.`;
  }

  return {
    doc_type: docType,
    strategy_text,
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
