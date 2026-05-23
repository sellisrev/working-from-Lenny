import type { StrategyDocType } from "../../shared/schemas";

/**
 * #2 Strategy Pressure-Tester deterministic data + doc-type router.
 *
 * Source of truth: apps/2-strategy-pressure-test/prompt.md. The router is a
 * cheap heuristic classifier intended to set the right vocabulary for the
 * LLM critique (strategy / roadmap / prd / mixed). It is intentionally
 * crude — false positives go to the LLM, which can override via its own
 * analysis. The router's job is to add the "mixed" sixth objection when a
 * roadmap is masquerading as strategy.
 */

export interface PassDef {
  slug: "rumelt" | "tradeoffs" | "assumptions" | "stress";
  label: string;
  summary: string;
}

export const PASSES: PassDef[] = [
  {
    slug: "rumelt",
    label: "Rumelt diagnosis test",
    summary: "Does the document name a real challenge → guiding policy → coherent actions, or does it skip diagnosis and jump to action?",
  },
  {
    slug: "tradeoffs",
    label: "Missing tradeoffs",
    summary: "What is this strategy explicitly choosing NOT to do? Strategy with no tradeoffs is a wishlist.",
  },
  {
    slug: "assumptions",
    label: "Untested assumptions",
    summary: "For each bet, name the assumption that would have to be false for the bet to lose, and one cheap pre-ship test.",
  },
  {
    slug: "stress",
    label: "Six-month stress scenario",
    summary: "One specific, plausible world condition that would render this doc obsolete by Q4.",
  },
];

/**
 * Corpus anchors per the prompt.md four-pass spec, with the two substitutions
 * already logged in apps/2-strategy-pressure-test/authoring.md:
 *   - competitive-positioning → positioning (the file present in knowledge/topics)
 *   - business-model-evolution → seven-powers
 */
export const CORPUS_ANCHORS = [
  "good-strategy-rumelt",
  "product-strategy",
  "defending-big-bets",
  "saying-no",
  "pm-pitfalls",
  "positioning",
  "seven-powers",
  "pivots-art",
];

/**
 * Doc-type router. Returns a coarse classification of the input text:
 *  - "strategy" — has bet language, named challenges, multi-quarter horizon
 *  - "roadmap"  — list of features by quarter / no named challenge
 *  - "prd"      — single-feature focus, success criteria, edge cases
 *  - "mixed"    — strategy vocabulary masking a roadmap (triggers the
 *                 sixth "this is a roadmap dressed as strategy" objection)
 *
 * Heuristics are deliberately lightweight regex/keyword counts; the goal is
 * to set vocabulary, not to be authoritative. The host model can ignore the
 * label if its own read disagrees.
 */
export function classifyDocType(text: string): StrategyDocType {
  const lower = text.toLowerCase();
  const strategySignals = countMatches(lower, [
    "bet",
    "diagnosis",
    "guiding policy",
    "north star",
    "challenge",
    "tradeoff",
    "trade-off",
    "moat",
  ]);
  const roadmapSignals = countMatches(lower, [
    "q1",
    "q2",
    "q3",
    "q4",
    "h1",
    "h2",
    "milestone",
    "roadmap",
    "deliverable",
    "ship in",
  ]);
  const prdSignals = countMatches(lower, [
    "success criteria",
    "non-goal",
    "non goal",
    "user story",
    "acceptance criteria",
    "edge case",
    "out of scope",
    "requirements",
  ]);
  const heavyRoadmap = roadmapSignals >= 3;
  const someStrategy = strategySignals >= 2;

  if (prdSignals >= 2 && strategySignals < 2 && roadmapSignals < 3) return "prd";
  if (heavyRoadmap && someStrategy) return "mixed";
  if (heavyRoadmap) return "roadmap";
  if (someStrategy) return "strategy";
  // Default: if nothing matched strongly, call it a roadmap — the four-pass
  // critique still works, and the strategy-only language won't fire when it
  // shouldn't.
  return "roadmap";
}

function countMatches(text: string, needles: string[]): number {
  let n = 0;
  for (const needle of needles) {
    if (text.includes(needle)) n++;
  }
  return n;
}
