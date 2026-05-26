import type { z } from "zod";
import { SayingNoNarrateOutput } from "../shared/schemas";
import {
  STAKEHOLDER_DATA,
  SAYING_NO_RUBRIC,
  CORPUS_ANCHORS,
  TURN_LIMIT,
  type StakeholderEnum,
  type SayingNoModeEnum,
} from "../tools/17-saying-no-rehearsal/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof SayingNoNarrateOutput>;
type Scenario = Brief["inputs"]["scenario"];

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "You are the stakeholder. Stay in persona during the role-play; break character only when scoring.",
  "Do not soften the stakeholder's pressure. They are realistic, not hostile — but they do push.",
  "Score fairly across all five dimensions. A good no scores well on all five; most real nos fail at least one.",
  "The canonical no is direct, kind, and firm. Not apologetic. Not vague. Name the trade-off.",
  "No em dashes. No AI-writing tells.",
];

function buildDirective(
  stakeholder: StakeholderEnum,
  mode: SayingNoModeEnum,
  the_ask: string,
): string {
  const data = STAKEHOLDER_DATA[stakeholder];
  if (mode === "show-me") {
    return (
      `Skip the role-play. Deliver the canonical polite firm no for the ${data.label} stakeholder directly to the user. ` +
      `The ask was: '${the_ask}'. ` +
      `Use the canonical_no from inputs.stakeholder_persona as the anchor, adapted to this specific ask. ` +
      `Then explain briefly why each dimension of the rubric is satisfied. Keep it under 200 words total.`
    );
  }
  return (
    `Conduct a role-play rehearsal. ` +
    `Open IN PERSONA as the ${data.label}: say the opening line from inputs.stakeholder_persona.opening_line, adapted to the specific ask '${the_ask}'. ` +
    `Let the user respond. After their first response, push back once from the stakeholder persona (using the pressure style from inputs.stakeholder_persona.pressure_style). ` +
    `Cap the exchange at ${TURN_LIMIT} turns total (including the opening). ` +
    `Then BREAK CHARACTER: announce that the rehearsal is over. ` +
    `Score the user's no on each of the five rubric dimensions (firmness / brevity / rationale-fit / door-management / relationship), one sentence per dimension. ` +
    `Then deliver the canonical no: 'Here is how a ${data.label} can hear a polite firm no on this ask: [canonical_no adapted to this specific situation].' ` +
    `Do not improvise the persona beyond the brief's data. Do not add dimensions to the rubric. Do not echo this brief.`
  );
}

export interface BuildSayingNoBriefInput {
  scenario: Scenario;
  mode: SayingNoModeEnum;
  user_context: string;
}

export async function buildSayingNoBrief(args: BuildSayingNoBriefInput): Promise<Brief> {
  const { scenario, mode, user_context } = args;
  const stakeholder = scenario.stakeholder as StakeholderEnum;
  const data = STAKEHOLDER_DATA[stakeholder];

  const slugs = [...CORPUS_ANCHORS];
  const corpusRaw = await loadCorpusChunks(slugs);
  const corpus: Record<string, string> = {};
  for (const slug of slugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return SayingNoNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(stakeholder, mode, scenario.the_ask),
    voice_rules: VOICE_RULES,
    structure: {
      sections:
        mode === "show-me"
          ? ["canonical_no", "rubric_check"]
          : ["role_play", "break_character", "rubric_score", "canonical_no"],
      per_section_template:
        "role_play: in persona, 2-3 turns max. break_character: 'Rehearsal over.' rubric_score: one sentence per dimension. canonical_no: the adapted canonical version.",
      length_cap:
        mode === "show-me"
          ? "Canonical no under 100 words. Rubric check under 80 words."
          : "Role-play up to 3 turns. Rubric score under 80 words. Canonical no under 100 words.",
    },
    inputs: {
      scenario,
      mode,
      user_context: user_context ?? "",
      stakeholder_persona: {
        label: data.label,
        opening_line: data.opening_line,
        pressure_style: data.pressure_style,
        what_they_can_hear: data.what_they_can_hear,
      },
      rubric: SAYING_NO_RUBRIC.map((r) => ({ id: r.id, label: r.label, what_to_watch: r.what_to_watch })),
      turn_limit: TURN_LIMIT,
      canonical_no: data.canonical_no,
    },
    corpus,
  } as Brief);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
