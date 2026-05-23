import type { z } from "zod";
import { LadderCalibrateOutput } from "../shared/schemas";
import type { LadderDimensionLevelsT } from "../shared/schemas";
import { DIMENSIONS } from "../tools/3-pm-ladder/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof LadderCalibrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Be direct. No corporate softening. No hedging.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Quote the manager review where the disagreement is sharpest. Short quotes only, never invented; if a phrase is not in the supplied review text, do not put it in quotes.",
  "Address the user in second person.",
  "Do not over-rate either side. If the manager's view is likely sharper, say so. If the user's is, say so.",
];

const PER_SECTION_TEMPLATE = [
  "DIMENSION X (out of 1-3) — name the dimension and the spread (your level vs implied manager level).",
  "WHAT YOU SAID — one sentence summarizing the user's self-rating on this dimension.",
  "WHAT THE MANAGER SAID — one sentence summarizing the manager's read, with a short verbatim quote if the language is sharp enough to quote.",
  "WHICH VIEW IS LIKELY MORE ACCURATE — one sentence on which read is closer to the truth and why.",
  "DISCUSSION QUESTION — one specific question to bring to the next 1:1.",
].join("\n");

const DIRECTIVE = [
  "Render a manager-calibration delta directly to the user.",
  "Read inputs.dimension_levels alongside inputs.manager_review_text. Identify the 1-3 dimensions where the user's self-rating diverges most from the manager's implied rating.",
  "For each divergent dimension, follow the per_section_template.",
  "Ground commentary in inputs.corpus when relevant; never invent corpus material or quote a phrase the manager did not actually write.",
  "If the manager review does not address one of the five dimensions, do not invent disagreement; say it was not addressed.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildLadderCalibrateBriefInput {
  dimension_levels: LadderDimensionLevelsT;
  manager_review_text: string;
  user_context?: string;
}

export async function buildLadderCalibrateBrief(
  args: BuildLadderCalibrateBriefInput,
): Promise<Brief> {
  const anchorSlugs = Array.from(
    new Set(DIMENSIONS.flatMap((d) => d.corpus_anchors)),
  );
  const corpusRaw = await loadCorpusChunks(anchorSlugs);
  const corpus: Record<string, string> = {};
  for (const slug of anchorSlugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body
      ? truncate(body, CORPUS_CHUNK_CAP)
      : "(not found in local corpus)";
  }

  return LadderCalibrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["divergence_1", "divergence_2", "divergence_3"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Under 400 words.",
    },
    inputs: {
      dimension_levels: args.dimension_levels,
      manager_review_text: args.manager_review_text,
      user_context: args.user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
