import type { z } from "zod";
import { DifficultConversationsNarrateOutput } from "../shared/schemas";
import {
  SCENARIO_DATA,
  DIFFICULT_CONV_RUBRIC,
  CORPUS_ANCHORS,
  TURN_LIMIT,
  type ScenarioEnum,
  type DifficultConvModeEnum,
} from "../tools/18-difficult-conversations-rehearsal/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof DifficultConversationsNarrateOutput>;
type Situation = Brief["inputs"]["situation"];

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "You are the counterparty. Stay in persona during the role-play; break character only when scoring.",
  "The counterparty is realistic, not hostile. They respond as most people actually respond — not as an easy or impossible case.",
  "Score fairly across all five dimensions. The silence dimension is what most people fail.",
  "Name Camille Fournier only where the corpus actually quotes her (giving-feedback-as-leader, performance-reviews). Otherwise frame as 'canonical leadership guidance in the corpus'.",
  "The canonical handling is direct, respectful, and specific. Not vague. Not soft-pedaled.",
  "No em dashes. No AI-writing tells.",
];

function buildDirective(
  scenario: ScenarioEnum,
  mode: DifficultConvModeEnum,
  intendedApproach: string,
): string {
  const data = SCENARIO_DATA[scenario];

  if (mode === "fournier") {
    const approach = intendedApproach || "the user's intended approach (not provided; ask them to share it before running)";
    return (
      `Fournier mode: do not run a role-play. Instead, give a keep / cut / one-move-you're-missing analysis of the user's intended approach. ` +
      `The scenario is: ${data.label}. ` +
      `The user's intended approach: '${approach}'. ` +
      `KEEP: What in the intended approach is correct and should stay. Use inputs.fournier_structure.keep as the anchor. ` +
      `CUT: What should be removed or changed. Use inputs.fournier_structure.cut as the anchor. ` +
      `ONE MOVE MISSING: The single most important thing missing from the intended approach. Use inputs.fournier_structure.one_move_missing as the anchor. ` +
      `Cite the canonical handling from inputs.scenario_persona.canonical_handling to ground the analysis. ` +
      `Keep the whole analysis under 250 words. Do not echo this brief back.`
    );
  }

  if (mode === "show-me") {
    return (
      `Skip the role-play. Deliver the canonical handling for the ${data.label} scenario directly to the user. ` +
      `Use inputs.scenario_persona.canonical_handling as the anchor and inputs.scenario_persona.silence_beat to mark the silence moment. ` +
      `Then explain briefly why each rubric dimension is satisfied. Keep it under 250 words total.`
    );
  }

  return (
    `Conduct a role-play rehearsal. ` +
    `Open IN PERSONA as the counterparty for the ${data.label} scenario: say the opening line from inputs.scenario_persona.opening_line. ` +
    `Let the user respond. After their first response, react from the counterparty persona using the counterparty_reaction guide. ` +
    `Cap the exchange at ${TURN_LIMIT} turns total (including the opening). ` +
    `Then BREAK CHARACTER: announce that the rehearsal is over. ` +
    `Score the user's handling on each of the five rubric dimensions (empathy / clarity / decisiveness / silence / dignity), one sentence per dimension. Pay special attention to whether they used the silence beat. ` +
    `Then deliver the canonical handling: 'Here is the canonical handling for the ${data.label} scenario: [canonical_handling from inputs.scenario_persona].' ` +
    `Mark the silence beat explicitly: ${data.silence_beat} ` +
    `Do not improvise the persona beyond the brief's data. Do not add dimensions to the rubric. Do not echo this brief.`
  );
}

export interface BuildDifficultConvBriefInput {
  situation: Situation;
  mode: DifficultConvModeEnum;
  user_context: string;
}

export async function buildDifficultConvBrief(args: BuildDifficultConvBriefInput): Promise<Brief> {
  const { situation, mode, user_context } = args;
  const scenario = situation.scenario as ScenarioEnum;
  const data = SCENARIO_DATA[scenario];

  const slugs = [...CORPUS_ANCHORS];
  const corpusRaw = await loadCorpusChunks(slugs);
  const corpus: Record<string, string> = {};
  for (const slug of slugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  const sections =
    mode === "fournier"
      ? ["keep", "cut", "one_move_missing"]
      : mode === "show-me"
        ? ["canonical_handling", "rubric_check"]
        : ["role_play", "break_character", "rubric_score", "canonical_handling"];

  return DifficultConversationsNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(scenario, mode, situation.intended_approach ?? ""),
    voice_rules: VOICE_RULES,
    structure: {
      sections,
      per_section_template:
        "role_play: in persona, 2-4 turns max. break_character: 'Rehearsal over.' rubric_score: one sentence per dimension, flag silence explicitly. canonical_handling: the full handling with silence beat marked.",
      length_cap:
        mode === "fournier"
          ? "Keep/cut/missing each under 60 words. Total under 250 words."
          : mode === "show-me"
            ? "Canonical handling under 150 words. Rubric check under 80 words."
            : "Role-play up to 4 turns. Rubric score under 80 words. Canonical handling under 150 words.",
    },
    inputs: {
      situation,
      mode,
      user_context: user_context ?? "",
      scenario_persona: {
        label: data.label,
        opening_line: data.opening_line,
        counterparty_reaction: data.counterparty_reaction,
        trap: data.trap,
        canonical_handling: data.canonical_handling,
        silence_beat: data.silence_beat,
      },
      rubric: DIFFICULT_CONV_RUBRIC.map((r) => ({ id: r.id, label: r.label, what_to_watch: r.what_to_watch })),
      turn_limit: TURN_LIMIT,
      ...(mode === "fournier" ? { fournier_structure: data.fournier_structure } : {}),
    },
    corpus,
  } as Brief);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
