import type { z } from "zod";
import { SevenPowersNarrateOutput } from "../shared/schemas";
import type {
  SevenPowersAnswersT,
  SevenPowersPowerSlug,
} from "../shared/schemas";
import { CORPUS_ANCHORS, POWERS, classifyPower } from "../tools/33-seven-powers-classifier/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof SevenPowersNarrateOutput>;

const CORPUS_CHUNK_CAP = 1500;

const VOICE_RULES = [
  "Unsentimental. Name the delusion plainly. Founders claim network effects reflexively; the tool's job is to stop that.",
  "Helmer-faithful: a power is Benefit AND Barrier. Never call something a power if rivals can copy it. The barrier is the load-bearing half.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Ground each per-power reading in inputs.powers[].benefit_barrier and the inputs.corpus chunks. Do not invent corpus material.",
  "Do not soften a DELUSIONAL or ABSENT classification into a maybe. If the evidence says no, say no.",
  "Address the user in second person.",
];

const PER_SECTION_TEMPLATE = [
  "POWER MAP — group the seven powers into buckets exactly as inputs.power_map gives them: HAS EVIDENCE (real; defend and compound), PLAUSIBLE (possible; here's the test), ABSENT, DELUSIONAL (claimed have, evidence says no), OVERSTATED (claimed have, evidence only plausible), BLIND SPOT (claimed no, evidence says yes). Omit any empty bucket. Name the powers in each, no commentary yet.",
  "PER_POWER_DETAIL — one short section for each power classified HAS EVIDENCE or PLAUSIBLE, plus every power carrying a flag (DELUSIONAL / OVERSTATED / BLIND SPOT). For each: a one-paragraph why grounded in that power's benefit_barrier (state the benefit AND the barrier, and the realness test), then a line 'Test next quarter:' using inputs.powers[].test_next_quarter. For a DELUSIONAL power, lead with the gap between the claim and the evidence.",
  "HEADLINE — one line naming the single most important gap between what the user believes and what they can show. This is the artifact's punchline; make it specific to their map, not generic.",
].join("\n");

const DIRECTIVE = [
  "Render a 7 Powers reading directly to the user as a board-readable artifact.",
  "Open with the POWER MAP (buckets from inputs.power_map), then PER_POWER_DETAIL for each real, plausible, or flagged power, then the HEADLINE.",
  "Ground every per-power reading in inputs.powers[].benefit_barrier and inputs.corpus. Never invent a power the evidence doesn't support.",
  "Be unsentimental: if the user is claiming a moat they can't show, say so in the detail and again in the headline.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildSevenPowersBriefInput {
  answers: SevenPowersAnswersT;
  user_context?: string;
}

export async function buildSevenPowersNarrationBrief(
  args: BuildSevenPowersBriefInput,
): Promise<Brief> {
  const { answers, user_context } = args;

  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  const powerMap = {
    has_evidence: [] as SevenPowersPowerSlug[],
    plausible: [] as SevenPowersPowerSlug[],
    absent: [] as SevenPowersPowerSlug[],
    delusional: [] as SevenPowersPowerSlug[],
    overstated: [] as SevenPowersPowerSlug[],
    blind_spot: [] as SevenPowersPowerSlug[],
  };

  const powers = POWERS.map((def) => {
    const ans = answers[def.slug];
    const result = classifyPower(def, ans.claim, ans.evidence);

    if (result.classification === "has-evidence") powerMap.has_evidence.push(def.slug);
    else if (result.classification === "plausible") powerMap.plausible.push(def.slug);
    else powerMap.absent.push(def.slug);

    if (result.flag === "delusional") powerMap.delusional.push(def.slug);
    else if (result.flag === "overstated") powerMap.overstated.push(def.slug);
    else if (result.flag === "blind-spot") powerMap.blind_spot.push(def.slug);

    return {
      power: def.slug,
      power_name: def.name,
      claim: ans.claim,
      classification: result.classification,
      flag: result.flag,
      evidence_pct: result.evidence_pct,
      benefit_barrier: def.benefit_barrier,
      test_next_quarter: def.test_next_quarter,
      corpus_anchors: [...def.anchors],
    };
  });

  return SevenPowersNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["power_map", "per_power_detail", "headline"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each per-power detail section under 120 words. Total under 600 words.",
    },
    inputs: {
      powers,
      power_map: powerMap,
      user_context: user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
