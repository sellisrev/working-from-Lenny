import type { z } from "zod";
import { LadderNarrateOutput } from "../shared/schemas";
import type {
  LadderDimensionLevelsT,
  LadderDimensionSlug,
} from "../shared/schemas";
import {
  DIMENSIONS,
  DIMENSION_SLUGS,
  QUESTIONS,
  dimensionBySlug,
  levelMeta,
  median,
} from "../tools/3-pm-ladder/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof LadderNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Be direct. No corporate softening. Owner-of-the-tool voice: a candid coach who has seen this pattern before.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "No level-name worship. Use the level numbers and titles when useful; do not rhapsodize about being 'Senior PM' or 'Staff PM'.",
  "Conditional opener. Use the voice catalog's #3 pattern: 'If you scored X, Y.' — e.g., 'If you scored Principal, the rubric was easier than the job.' The summary section should land on something the score itself implies, not a generic preamble.",
  "Ground each behavior in the supplied corpus chunks. Do not invent corpus material or framework names.",
  "Address the user in second person.",
];

const PER_SECTION_TEMPLATE = [
  "SUMMARY — one paragraph. Where the user is in plain language, leading with the strongest dimension and the widest gap.",
  "BEHAVIOR 1 / 2 / 3 — three concrete behaviors that close the widest gap. Each one paragraph: what to do, why it matters at the target level, and what the dropoff looks like if skipped. Anchor each behavior in a specific corpus chunk.",
  "ALREADY-AT-OR-ABOVE — one sentence acknowledging the dimensions at or above target. Brief, no over-praise.",
].join("\n");

const DIRECTIVE_GROUNDED = [
  "Render a PM-ladder gap report directly to the user.",
  "Open with the one-paragraph summary per the per_section_template, leading with the voice catalog's conditional hook — see #3 entry: 'If you scored Principal, the rubric was easier than the job.' Build the opener off the user's actual effective_level + widest_gap_dimension; do not use the literal Principal line unless it fits.",
  "Lead the summary with the strongest dimension and the widest gap.",
  "Then write three behaviors to start practicing this quarter that close the widest gap. Each behavior is one paragraph: what to do, why it matters at the target level, what the dropoff looks like if skipped. Anchor each in a specific corpus chunk from inputs.corpus.",
  "Close with one sentence on the dimensions already at or above target.",
  "When you cite specific behavior of the user, ground it in inputs.full_assessment (their actual answer level per question). Do not invent answers the user did not give.",
  "Do not echo this brief back; transform it.",
].join(" ");

const DIRECTIVE_UNGROUNDED = [
  "Render a PM-ladder gap report directly to the user.",
  "Open with the one-paragraph summary per the per_section_template, leading with the voice catalog's conditional hook — see #3 entry: 'If you scored Principal, the rubric was easier than the job.' Build the opener off the user's actual effective_level + widest_gap_dimension; do not use the literal Principal line unless it fits.",
  "Lead the summary with the strongest dimension and the widest gap.",
  "Then write three behaviors to start practicing this quarter that close the widest gap. Each behavior is one paragraph: what to do, why it matters at the target level, what the dropoff looks like if skipped. Anchor each in a specific corpus chunk from inputs.corpus.",
  "Close with one sentence on the dimensions already at or above target.",
  "The user's per-question answers were not passed through. Do NOT claim specific user answers (no phrases like 'on Q14 you said X'). Keep behavioral diagnoses general to the dimension levels.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildLadderBriefInput {
  dimension_levels: LadderDimensionLevelsT;
  user_context?: string;
  answers?: number[];
}

export async function buildLadderNarrationBrief(
  args: BuildLadderBriefInput,
): Promise<Brief> {
  const { dimension_levels, user_context, answers } = args;

  const dimVals = DIMENSION_SLUGS.map((s) => dimension_levels[s]);
  const effectiveDisplay = median(dimVals);
  const effective = Math.min(5, Math.ceil(effectiveDisplay));
  const target = Math.min(5, effective + 1);

  let widest: LadderDimensionSlug = "scope";
  let widestGap = -Infinity;
  for (const slug of DIMENSION_SLUGS) {
    const gap = target - dimension_levels[slug];
    if (gap > widestGap) {
      widestGap = gap;
      widest = slug;
    }
  }

  const dimensions = DIMENSION_SLUGS.map((slug) => {
    const d = dimensionBySlug(slug);
    const level = dimension_levels[slug];
    return {
      dimension: slug,
      level,
      target_level: target,
      gap: Math.max(0, target - level),
      corpus_anchors: [...d.corpus_anchors],
    };
  });

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

  const fullAssessment = answers
    ? QUESTIONS.map((q, i) => ({
        question_id: q.id,
        dimension: q.dimension,
        question_text: q.text,
        user_level: answers[i]!,
      }))
    : undefined;

  return LadderNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: answers ? DIRECTIVE_GROUNDED : DIRECTIVE_UNGROUNDED,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["summary", "behavior_1", "behavior_2", "behavior_3", "closer"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "350-450 words total.",
    },
    inputs: {
      dimension_levels,
      effective_level: effective,
      target_level: target,
      widest_gap_dimension: widest,
      level_names: {
        current: levelMeta(effective).title,
        target: levelMeta(target).title,
      },
      dimensions,
      user_context: user_context ?? "",
      ...(fullAssessment ? { full_assessment: fullAssessment } : {}),
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
