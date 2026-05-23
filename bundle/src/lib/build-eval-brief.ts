import type { z } from "zod";
import { EvalNarrateOutput } from "../shared/schemas";
import type { EvalFeatureInputsT } from "../shared/schemas";
import {
  CATEGORIES,
  CORPUS_ANCHORS,
  SCORING_FORMULA,
} from "../tools/6-ai-eval-coverage/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof EvalNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Voice catalog #6 hook: confession — 'Yes, you shipped it. No, you didn't measure it.' The scorecard names what's missing without scolding.",
  "Direct. If they're shipping without coverage, say so plainly.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Ground category status calls in the user's actual three inputs (feature_one_liner, audience, failure_modes). Do not invent specifics they didn't name.",
  "Starter eval prompts cite anchors from inputs.corpus only.",
  "Address the user in second person.",
];

const PER_SECTION_TEMPLATE = [
  "SCORE — 'Coverage: {N}/100.' Compute deterministically from per-category statuses using inputs.scoring_formula.",
  "CATEGORY TABLE — render all 7 categories with status (covered / partial / missing) and one-line reasoning each. Status calls are grounded in inputs.feature.practice.<category>: substantive specifics (golden set size, pass threshold, alert wired up, named tool) → covered; risk acknowledged but no concrete practice → partial; blank/'nothing yet' / not mentioned → missing UNLESS the feature type makes it irrelevant (batch feature → latency partial-default; internal-only tool → jailbreak partial-default). If inputs.feature.methodology_paste is non-empty, treat anything documented there as evidence too — explicit eval-set sizes, cadences, and named metrics in the methodology bump categories to covered.",
  "GAPS TO FILL — for each missing or partial category, 2-3 starter eval prompts in the format: prompt_template / expected_signal / failure_mode / corpus_anchor. Pull anchors from inputs.corpus only.",
].join("\n");

const DIRECTIVE = [
  "Render an AI Eval Coverage Scorecard directly to the user.",
  "Read inputs.feature: feature_one_liner + audience + failure_modes set the context; inputs.feature.practice carries the user's per-category answers (each ≤300 chars, blank = no current practice for that category); inputs.feature.methodology_paste is the optional long-form eval doc / runbook (may be empty).",
  "Classify each of the 7 categories in inputs.categories as covered / partial / missing using both the per-category practice strings AND the methodology paste as evidence — never invent practices the user didn't describe.",
  "Then compute the score deterministically per inputs.scoring_formula and render the score, the category table, and starter prompts for missing/partial categories.",
  "Three sections per per_section_template: SCORE → CATEGORY TABLE → GAPS TO FILL.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildEvalBriefInput {
  feature: EvalFeatureInputsT;
  user_context?: string;
}

export async function buildEvalNarrationBrief(
  args: BuildEvalBriefInput,
): Promise<Brief> {
  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return EvalNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["score", "category_table", "gaps_to_fill"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Under 700 words total. Starter prompts are concrete, not vague.",
    },
    inputs: {
      feature: args.feature,
      categories: CATEGORIES.map((c) => ({
        slug: c.slug,
        label: c.label,
        summary: c.summary,
        common_omission: c.common_omission,
      })),
      scoring_formula: SCORING_FORMULA,
      user_context: args.user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
