import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  StrategyGetFormInput,
  StrategyGetFormOutput,
  StrategyDocTypeEnum,
} from "../../shared/schemas";
import { CORPUS_ANCHORS, PASSES } from "./data";

export const meta: ToolMeta = {
  name: "strategy_pressure_test_get_form",
  description:
    "Entry tool for the Strategy Pressure-Tester. Calling this triggers the host to mount the ui://working-from-lenny/strategy-pressure-test resource (an interactive iframe with a paste box for the strategy doc). If your host mounts the UI, that IS the input surface — do NOT additionally render a paste prompt in chat as a duplicate surface; the user will paste in the iframe, which calls strategy_pressure_test_run directly. Returns the four-pass critique structure (Rumelt diagnosis / missing tradeoffs / untested assumptions / six-month stress scenario) plus the closed corpus-anchor pool. Input length: 200-4000 chars. If the user already has a doc in hand, call strategy_pressure_test_run directly.",
  inputSchema: StrategyGetFormInput,
  outputSchema: StrategyGetFormOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/strategy-pressure-test",
};

type Input = z.infer<typeof StrategyGetFormInput>;
type Output = z.infer<typeof StrategyGetFormOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    doc_types: StrategyDocTypeEnum.options as Output["doc_types"],
    corpus_anchors: [...CORPUS_ANCHORS],
    passes: PASSES.map((p) => ({ slug: p.slug, label: p.label, summary: p.summary })) as Output["passes"],
    note: "Paste the strategy doc (200-4000 chars). A deterministic router classifies it (strategy/roadmap/prd/mixed) so the critique uses the right vocabulary; the four-pass corpus-grounded critique renders as five objection cards (or six when mixed).",
  };
};
