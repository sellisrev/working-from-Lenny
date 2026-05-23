import type { z } from "zod";
import { MvsNarrateOutput } from "../shared/schemas";
import {
  CORPUS_ANCHORS,
  PAIRS,
} from "../tools/47-mission-vision-alignment/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof MvsNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Voice catalog #47 hook: definition — 'A mission is what you'd still do if the funding stopped. The rest is decoration.' Land statements with conviction.",
  "Direct. No corporate softening. The platitude detector cannot itself be platitudinous; your rewrites should be more concrete than the originals.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Quote the platitudes verbatim from inputs.mission_text / inputs.vision_text / inputs.strategy_text — never invent a phrase to flag.",
  "If a phrase is not in the original docs, do not put it in quotes.",
];

const PER_SECTION_TEMPLATE = [
  "DRIFT MAP — render three rows, one per pair from inputs.pairs (mission_vs_vision, mission_vs_strategy, vision_vs_strategy):",
  "  '{pair}: [severity none/low/med/high] [drift_label ≤10 words]'",
  "  Then a one-paragraph diagnosis per pair.",
  "  Mission ↔ vision: does the vision describe a future state that, if reached, would make the mission complete?",
  "  Mission ↔ strategy: does this quarter's strategy spend energy on the mission, or has the mission become decorative?",
  "  Vision ↔ strategy: is the strategy's named direction a step on the path to the vision, or orthogonal?",
  "PLATITUDE DETECTOR — list every load-free phrase from any of the three docs. Format per entry: 'phrase_verbatim (from_doc) → would have to say: {operationalized rewrite}'. Common patterns: 'delight customers', 'best-in-class X', 'world-class X', 'empower X', 'reimagine X', 'transform X', 'drive growth/value/outcomes', 'be the X for Y'.",
  "OPERATIONAL GAPS — extract named bets from inputs.strategy_text and write each as a question: 'Strategy names: {bet}. Question: Whose roadmap names {bet}-specific work? {sub-questions}.' If strategy is too vague to extract bets, output: 'Your strategy is too vague to test operationally. Before doing this exercise again, rewrite the strategy to name 3-5 specific bets with a concrete first observable signal each.'",
  "RUMELT DIAGNOSIS — applied to strategy_text only. Format: 'Named challenge: {quote or absent}. Guiding policy: {quote or absent}. Coherent actions: {list or absent}. Verdict: {yes / partial / no}. {one-paragraph justification}.' If any of the three is absent → partial. If all three are absent → no.",
].join("\n");

const DIRECTIVE = [
  "Render a Mission / Vision / Strategy alignment reading directly to the user.",
  "Four sections per per_section_template: DRIFT MAP → PLATITUDE DETECTOR → OPERATIONAL GAPS → RUMELT DIAGNOSIS.",
  "Ground every claim in inputs.mission_text / inputs.vision_text / inputs.strategy_text and inputs.corpus. Never invent docs the user didn't paste.",
  "When quoting platitudes or Rumelt verbatim, use the exact phrasing from the originals.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildMvsBriefInput {
  mission_text: string;
  vision_text: string;
  strategy_text: string;
  user_context?: string;
}

export async function buildMvsNarrationBrief(args: BuildMvsBriefInput): Promise<Brief> {
  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return MvsNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["drift_map", "platitude_detector", "operational_gaps", "rumelt_diagnosis"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "DRIFT MAP ≤300 words total. PLATITUDE DETECTOR is a list (no length cap; one line + one rewrite per entry). OPERATIONAL GAPS ≤200 words. RUMELT DIAGNOSIS ≤180 words.",
    },
    inputs: {
      mission_text: args.mission_text,
      vision_text: args.vision_text,
      strategy_text: args.strategy_text,
      pairs: [...PAIRS],
      user_context: args.user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
