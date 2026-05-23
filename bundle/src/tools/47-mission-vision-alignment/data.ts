/**
 * #47 Mission / Vision / Strategy Alignment Checker deterministic data.
 *
 * Source of truth: apps/47-mission-vision-alignment/prompt.md.
 *
 * Corpus anchors per prompt.md with substitutions logged in authoring.md:
 *   - mission-vision → mission-vision-strategy (actual filename)
 *   - strategy-as-jargon → pm-pitfalls (spec already noted this)
 *   - cross-functional-collaboration → getting-buy-in
 */

export const CORPUS_ANCHORS = [
  "mission-vision-strategy",
  "good-strategy-rumelt",
  "product-strategy",
  "defending-big-bets",
  "pm-pitfalls",
  "getting-buy-in",
];

export const PAIRS = [
  "mission_vs_vision",
  "mission_vs_strategy",
  "vision_vs_strategy",
] as const;
export type AlignmentPair = (typeof PAIRS)[number];

export const FIELDS = [
  {
    key: "mission_text" as const,
    label: "Mission",
    placeholder: "Your mission statement (≤500 chars; under 50 chars is a title, not content)",
    min_length: 50,
    max_length: 500,
  },
  {
    key: "vision_text" as const,
    label: "Vision",
    placeholder: "Your vision statement (≤500 chars)",
    min_length: 50,
    max_length: 500,
  },
  {
    key: "strategy_text" as const,
    label: "This quarter's strategy",
    placeholder: "Your strategy document for the current planning period (200-3000 chars)",
    min_length: 200,
    max_length: 3000,
  },
];

/**
 * Cheap heuristic — flags a strategy as "too vague" if it has very low
 * concrete-bet density (no named launches, no quarter markers, no decision
 * verbs). The host model will do the real Rumelt diagnosis; this just lets
 * the brief surface the "too vague to test operationally" fallback.
 */
export function isStrategyTooVague(text: string): boolean {
  const lower = text.toLowerCase();
  const concreteSignals = [
    "launch",
    "ship",
    "release",
    "expand",
    "pricing",
    "tier",
    "platform",
    "moat",
    "challenge",
    "bet",
    "q1",
    "q2",
    "q3",
    "q4",
    "h1",
    "h2",
    "by ",
    "%",
    "$",
  ];
  let hits = 0;
  for (const s of concreteSignals) if (lower.includes(s)) hits++;
  return hits < 2;
}
