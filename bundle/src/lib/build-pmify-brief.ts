import type { z } from "zod";
import { PmifyNarrateOutput } from "../shared/schemas";
import type { PmifyMode } from "../shared/schemas";
import { PATTERN_POOL, modeBySlug } from "../tools/51-pmify-inbox/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof PmifyNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Single-line. Use the voice catalog's #51 entry as the anchor: 'There is no Q3 in human relationships.' The humor lands because the patterns are real, not because you're trying to be funny.",
  "Never explain the joke. The translation is the joke.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Footnotes are deadpan, single-line. One pattern + one diagnosis, no commentary.",
  "Do not output 'Translation:' or 'Footnotes:' headers. Translation first, blank line, then numbered footnotes.",
  "Translation + footnotes under 300 words total. Translation itself 4-6 sentences.",
];

const PER_SECTION_TEMPLATE = [
  "TRANSLATION — 4-6 sentences. Match the supplied mode's direction. No headers.",
  "BLANK LINE.",
  "FOOTNOTES — 2-4 numbered single-line footnotes. Format: '1. {pattern_name} — {one-sentence diagnosis}.' Pull pattern_name from inputs.pattern_pool only; never invent. Each footnote names a pattern the translation triggers (pm-ify mode) or the original demonstrates (de-pm-ify mode).",
].join("\n");

function modeDirective(mode: PmifyMode): string {
  if (mode === "pm-ify") {
    return [
      "MODE: pm-ify. The user's text is a message from outside the office (family, friend, dentist, contractor).",
      "Translate it as a PM would send the same message to a sales VP.",
      "Use capacity language, Q2 deprioritization framing, async-by-default scheduling, and at least one 'circling back'.",
      "The result should be recognizably PM-voiced and quietly absurd — never explain why.",
    ].join(" ");
  }
  return [
    "MODE: de-pm-ify. The user's text is a real work message they wrote.",
    "Translate it back to plain English, as if speaking to a friend at a coffee shop.",
    "Strip the hedges, the buried no, the ROI framing, the 1:1-deferral. Say what the person actually meant.",
    "Don't apologize for the original; just translate it.",
  ].join(" ");
}

const DIRECTIVE_BASE = [
  "Render a PM-ify translation directly to the user.",
  "Follow the mode-specific instruction in the next sentence, then the per_section_template.",
  "Ground each footnote in inputs.pattern_pool and the corresponding corpus chunk; never cite a pattern not in the pool.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildPmifyBriefInput {
  mode: PmifyMode;
  user_text: string;
  user_context?: string;
}

export async function buildPmifyNarrationBrief(
  args: BuildPmifyBriefInput,
): Promise<Brief> {
  const { mode, user_text, user_context } = args;

  // Touch modeBySlug for runtime validation — throws on unknown mode,
  // matching the prompt.md "closed enum" contract.
  modeBySlug(mode);

  const corpusRaw = await loadCorpusChunks(PATTERN_POOL);
  const corpus: Record<string, string> = {};
  for (const slug of PATTERN_POOL) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body
      ? truncate(body, CORPUS_CHUNK_CAP)
      : "(not found in local corpus)";
  }

  return PmifyNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: `${DIRECTIVE_BASE} ${modeDirective(mode)}`,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["translation", "footnotes"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Translation + footnotes under 300 words total. Translation 4-6 sentences. 2-4 footnotes.",
    },
    inputs: {
      mode,
      user_text,
      pattern_pool: [...PATTERN_POOL],
      user_context: user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
