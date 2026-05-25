import type { z } from "zod";
import { ChasmNarrateOutput } from "../shared/schemas";
import type { ChasmInputsT } from "../shared/schemas";
import {
  CORPUS_ANCHORS,
  STAGE_CONTENT,
  assignStage,
} from "../tools/34-crossing-the-chasm-stage/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof ChasmNarrateOutput>;

const CORPUS_CHUNK_CAP = 1400;

const VOICE_RULES = [
  "Forward-looking, not congratulatory. The diagnosis is in service of the next move, never a grade.",
  "Moore-faithful: the chasm is real and lethal. Do not soften an at-the-chasm read.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Name only the placing signals in inputs.placing_signals; do not invent inputs the user didn't give.",
  "Ground the next play and failure mode in inputs.next_play / inputs.failure_mode and the inputs.corpus chunks.",
  "Address the user in second person.",
];

const PER_SECTION_TEMPLATE = [
  "STAGE — one line: 'You're here: {inputs.stage_label}.' For at-the-chasm, do not hedge it.",
  "PLACING_SIGNALS — name the two or three signals from inputs.placing_signals that put the user in this stage, grounded in inputs.why_here. Plain, no jargon.",
  "NEXT_PLAY — the play for the next transition (inputs.next_stage_label), from inputs.next_play. If inputs.next_stage_label is null (main street), frame it as the ongoing game, not a transition.",
  "FAILURE_MODE — how that play most commonly gets run wrong, from inputs.failure_mode, with the corpus's reasoning.",
  "AT_CHASM_LINE — include this as a direct closing line ONLY when inputs.at_chasm_line is present.",
].join("\n");

const DIRECTIVE = [
  "Render a Crossing-the-Chasm stage diagnosis directly to the user.",
  "Open with STAGE, then PLACING_SIGNALS (name the actual triggering signals), then NEXT_PLAY, then FAILURE_MODE.",
  "If inputs.at_chasm_line is present, close with it verbatim in spirit: this is the highest-value finding and must not be softened.",
  "Ground every claim in inputs.user_inputs, inputs.why_here / next_play / failure_mode, and inputs.corpus. Never invent inputs.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildChasmBriefInput {
  inputs: ChasmInputsT;
  user_context?: string;
}

export async function buildChasmNarrationBrief(
  args: BuildChasmBriefInput,
): Promise<Brief> {
  const { inputs, user_context } = args;
  const { stage, placing_signals } = assignStage(inputs);
  const content = STAGE_CONTENT[stage];

  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return ChasmNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: content.at_chasm_line
        ? ["stage", "placing_signals", "next_play", "failure_mode", "at_chasm_line"]
        : ["stage", "placing_signals", "next_play", "failure_mode"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each section under 110 words. Total under 450 words.",
    },
    inputs: {
      user_inputs: inputs,
      stage,
      stage_label: content.label,
      placing_signals,
      why_here: content.why_here,
      next_stage_label: content.next_stage_label,
      next_play: content.next_play,
      failure_mode: content.failure_mode,
      ...(content.at_chasm_line ? { at_chasm_line: content.at_chasm_line } : {}),
      user_context: user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
