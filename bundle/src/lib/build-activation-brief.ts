import type { z } from "zod";
import { ActivationNarrateOutput } from "../shared/schemas";
import type { ActivationInputsT } from "../shared/schemas";
import {
  CORPUS_ANCHORS,
  isAiProductFlagged,
  parseFunnelLines,
  resolveActivationFamily,
} from "../tools/37-activation-metric-finder/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof ActivationNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Voice catalog #37 hook: pattern-reveal — 'Activation looks like retention. Until it doesn't. Then it looks like everyone leaves Tuesday.' Use this shape (looks-like / until-it-doesn't / then-it-looks-like) at least once in the per-candidate sections; do not echo the literal Tuesday line.",
  "Direct. If the user's aha-moment guess is the wrong primitive, say so plainly.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Ground every claim in inputs.user_inputs and inputs.corpus. Do not invent business shape, stage, or funnel steps.",
  "Cite Cat Wu wow-moment-vs-aha-moment ONLY when inputs.ai_product_flagged is true; the framing lives in activation-metric.md and applies to AI products specifically.",
  "Cite Lauryn Isford onboarding-mastery framing where activation-metric.md anchors it.",
];

const PER_SECTION_TEMPLATE = [
  "FAMILY — one short paragraph naming inputs.activation_family and grounding it in business_shape + stage + monetization. For marketplace, name the side explicitly.",
  "CANDIDATE_1 / CANDIDATE_2 / CANDIDATE_3 — each candidate is one section with seven labelled slots: NAME (verb-noun); ARGUMENT FOR (≤3 sentences); VANITY RISK; LEADING vs RETENTION (is this leading 30/90-day retention, coincident, or lagging?); FRICTION BALANCE (filter-vs-drop); CUSTOMER INTERVIEW SIGNAL (the specific story a confirming user would tell); BENCHMARK ('Typical range for {business_shape}: X-Y%. {category_caveat}'); INPUT METRICS (3-5 leading inputs, formatted to be paste-compatible with #9 NSM Finder's input-metrics tree).",
  "FUNNEL AUDIT — only when inputs.has_funnel is true. For each line in inputs.funnel_lines, render 'step_name: verdict — one-line-why'. Verdict ∈ {value-moment, friction-filter, friction-drop, bypass, drop-off}. Heuristics: value-moment = the step where the user does what the product promises; friction-filter = high drop-off where survivors retain better; friction-drop = high drop-off with no retention upside; bypass = users skip it; drop-off = high drop with unclear cause.",
].join("\n");

const DIRECTIVE = [
  "Render an Activation Metric reading directly to the user.",
  "Open with the FAMILY section, then three candidates following the per_section_template, then the FUNNEL AUDIT IF inputs.has_funnel is true (skip otherwise).",
  "Generate three distinct candidates from the supplied activation_family — vary along vanity-vs-real, time-to-event, and team-vs-individual depth so the user sees a meaningful spread. Each candidate carries a benchmark range read from inputs.corpus; do not make up numbers, cite the source line if you can paraphrase it.",
  "Ground all claims in inputs.user_inputs and inputs.corpus. Never invent inputs.",
  "Each candidate's INPUT METRICS list is formatted to be paste-compatible with #9 NSM Finder's tree (one metric per line, verb-noun shape).",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildActivationBriefInput {
  inputs: ActivationInputsT;
  user_context?: string;
}

export async function buildActivationNarrationBrief(
  args: BuildActivationBriefInput,
): Promise<Brief> {
  const { inputs, user_context } = args;
  const family = resolveActivationFamily(inputs.business_shape, inputs.marketplace_side);
  const funnelLines = parseFunnelLines(inputs.funnel_paste ?? "");
  const hasFunnel = funnelLines.length > 0;
  const aiFlagged = isAiProductFlagged(inputs);

  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return ActivationNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: hasFunnel
        ? ["family", "candidate_1", "candidate_2", "candidate_3", "funnel_audit"]
        : ["family", "candidate_1", "candidate_2", "candidate_3"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each candidate ≤220 words including benchmark + input-metrics list. Funnel audit ≤10 lines.",
    },
    inputs: {
      user_inputs: inputs,
      activation_family: family,
      has_funnel: hasFunnel,
      funnel_lines: funnelLines,
      ai_product_flagged: aiFlagged,
      user_context: user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
