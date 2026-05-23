import rawData from "./ladder-data.json";
import type { LadderDimensionSlug } from "../../shared/schemas";

/**
 * #3 PM Ladder Self-Assessment deterministic data + scoring engine.
 *
 * Source of truth: `apps/3-pm-ladder/prompt.md` (30 questions across 5
 * dimensions, each with a 5-option answer bank that maps directly to a
 * level 1-5). `ladder-data.json` is the canonical machine-readable copy.
 */

export interface LadderDimension {
  slug: LadderDimensionSlug;
  name: string;
  summary: string;
  corpus_anchors: string[];
}

export interface LadderLevelMeta {
  level: number;
  title: string;
  anchor: string;
}

export interface LadderQuestionData {
  id: number;
  dimension: LadderDimensionSlug;
  text: string;
  options: string[];
}

interface RawData {
  dimensions: LadderDimension[];
  levels: LadderLevelMeta[];
  questions: LadderQuestionData[];
}

const data = rawData as RawData;

export const DIMENSIONS: LadderDimension[] = data.dimensions;
export const LEVEL_META: LadderLevelMeta[] = data.levels;
export const QUESTIONS: LadderQuestionData[] = data.questions;

export const DIMENSION_SLUGS: LadderDimensionSlug[] = DIMENSIONS.map(
  (d) => d.slug,
);

export function dimensionBySlug(slug: LadderDimensionSlug): LadderDimension {
  const d = DIMENSIONS.find((x) => x.slug === slug);
  if (!d) throw new Error(`Unknown dimension slug: ${slug}`);
  return d;
}

export function levelMeta(level: number): LadderLevelMeta {
  const m = LEVEL_META.find((x) => x.level === level);
  if (!m) throw new Error(`Unknown level: ${level}`);
  return m;
}

/**
 * Median of an array of numbers. With six values, the median is the average
 * of the two middle picks — i.e. (sorted[2] + sorted[3]) / 2, which can be
 * a .5. Matches the formula in apps/3-pm-ladder/prompt.md.
 */
export function median(values: number[]): number {
  if (values.length === 0) throw new Error("median: empty array");
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2;
  }
  return sorted[mid]!;
}

export interface ScoredAssessment {
  dimension_levels: Record<LadderDimensionSlug, number>;
  effective_level: number; // integer 1-5, ceil of cross-dimension median for target picking
  effective_level_display: number; // raw median (may be fractional)
  target_level: number; // effective_level + 1, capped at 5
  widest_gap_dimension: LadderDimensionSlug;
  widest_gap_size: number;
}

/**
 * Scoring engine. answers[i] is the level (1-5) for question i+1, in
 * canonical question-ID order. Per-dimension level is the median of the six
 * answers in that dimension. Effective level is the median across the five
 * dimensions. Target level is effective + 1, capped at 5. Widest gap is the
 * dimension with the largest (target - level) spread; ties broken by
 * dimension order (scope first).
 */
export function scoreAssessment(answers: number[]): ScoredAssessment {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(
      `Expected ${QUESTIONS.length} answers, got ${answers.length}`,
    );
  }
  for (let i = 0; i < answers.length; i++) {
    const a = answers[i]!;
    if (!Number.isInteger(a) || a < 1 || a > 5) {
      throw new Error(
        `Answer at position ${i} must be an integer 1-5; got ${a}`,
      );
    }
  }
  const byDim: Record<LadderDimensionSlug, number[]> = {
    scope: [],
    ambiguity: [],
    influence: [],
    judgment: [],
    craft: [],
  };
  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i]!;
    byDim[q.dimension].push(answers[i]!);
  }
  const dimensionLevels: Record<LadderDimensionSlug, number> = {
    scope: median(byDim.scope),
    ambiguity: median(byDim.ambiguity),
    influence: median(byDim.influence),
    judgment: median(byDim.judgment),
    craft: median(byDim.craft),
  };
  const dimVals = DIMENSION_SLUGS.map((s) => dimensionLevels[s]);
  const effectiveDisplay = median(dimVals);
  // For target picking, use the ceil so a user at "median 3.5" targets 5,
  // not stays at 4. Then cap at 5.
  const effective = Math.min(5, Math.ceil(effectiveDisplay));
  const target = Math.min(5, effective + 1);
  let widest: LadderDimensionSlug = "scope";
  let widestGap = -Infinity;
  for (const slug of DIMENSION_SLUGS) {
    const gap = target - dimensionLevels[slug];
    if (gap > widestGap) {
      widestGap = gap;
      widest = slug;
    }
  }
  return {
    dimension_levels: dimensionLevels,
    effective_level: effective,
    effective_level_display: effectiveDisplay,
    target_level: target,
    widest_gap_dimension: widest,
    widest_gap_size: Math.max(0, widestGap),
  };
}
