import type { z } from "zod";
import { OkrNarrateOutput } from "../shared/schemas";
import type { OkrLevel, OkrStance } from "../shared/schemas";
import {
  CORPUS_ANCHORS,
  TOO_MANY,
  parseOkrs,
  tooManyOverall,
} from "../tools/24-okr-critique/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof OkrNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Voice catalog #24 hook: tripartite cadence — 'Activity disguised as outcome. Outcome disguised as platitude. The actual outcome, still unspoken.' Land the critique with conviction.",
  "Direct. No corporate softening. The OKR space is full of platitudes — your critique should land sharper than the corpus's most diplomatic voices.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Apply all four tests to each KR. Anchor each diagnosis to a slug from inputs.corpus only; never invent corpus material.",
  "When suggesting rewrites, the rewrite must pass all four tests. If the underlying objective is unsalvageable, say so and skip the rewrite.",
];

const PER_SECTION_TEMPLATE = [
  "PER-OBJECTIVE — for each objective in inputs.parsed.objectives:",
  "  Objective N: {text}",
  "    [too-many flag if key_results.length > 4]",
  "    For each KR:",
  "      KR N.M: {kr_text}",
  "      Four-test compact table: outcome-vs-activity / measurable / single-team-fit / too-many",
  "      Diagnosis: one paragraph naming the patterns that failed",
  "      Suggested rewrite: one rewritten KR that passes all four (or 'unsalvageable' if the objective is broken)",
  "      Anchor: {topic_file} — '{quote ≤30 words}'",
  "STANCE SYNTHESIS — one paragraph keyed off inputs.stance:",
  "  orthodox → lead with 'These are fixable. Here's the pattern.'",
  "  skeptical → lead with 'Three of these wouldn't survive a real conversation about why they exist. The question is whether you keep them at all.'",
  "  hybrid → end with 'If you keep OKRs, do {orthodox set}. If you don't, kill {skeptical set} entirely and replace them with what you'd actually measure.'",
  "CROSS-TEAM COHERENCE — only when inputs.level === 'org' AND inputs.parsed.objectives.length > 1: list internal contradictions across objectives (overlapping KR ownership, mutually incompatible bets).",
  "REWRITTEN SET — clean, paste-ready version of the user's OKRs with all rewrites applied.",
].join("\n");

const DIRECTIVE_BASE = [
  "Render an OKR critique directly to the user.",
  "Use inputs.parsed (deterministic objective/KR parse with parsing_confidence) as the structural starting point. When parsing_confidence='low', do your own structural inference and say so.",
  "Apply the four tests (outcome-vs-activity, measurable, single-team-fit, too-many) to every KR.",
  "Follow the per_section_template — PER-OBJECTIVE → STANCE SYNTHESIS → (CROSS-TEAM COHERENCE if org-level + >1 objective) → REWRITTEN SET.",
  "If inputs.too_many_overall is true, flag it once in the synthesis paragraph (do not repeat per objective).",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildOkrBriefInput {
  okr_text: string;
  stance: OkrStance;
  level: OkrLevel;
  user_context?: string;
}

export async function buildOkrNarrationBrief(args: BuildOkrBriefInput): Promise<Brief> {
  const { okr_text, stance, level, user_context } = args;
  const parsed = parseOkrs(okr_text);
  const tooMany = tooManyOverall(parsed, level);

  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return OkrNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE_BASE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["per_objective", "stance_synthesis", "rewritten_set"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: `Each KR diagnosis ≤120 words. Synthesis ≤180 words. Rewritten set is paste-ready. Too-many thresholds: >${TOO_MANY.kr_per_objective} KRs/obj or >${level === "org" ? TOO_MANY.objectives_org : TOO_MANY.objectives_team} objectives.`,
    },
    inputs: {
      okr_text,
      parsed,
      stance,
      level,
      too_many_overall: tooMany,
      user_context: user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
