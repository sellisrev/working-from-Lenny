import type { z } from "zod";
import { NSMNarrateOutput } from "../shared/schemas";
import type { NSMInputsT } from "../shared/schemas";
import {
  CORPUS_ANCHORS,
  parseDashboardLines,
  resolveNsmFamily,
} from "../tools/9-nsm-finder/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof NSMNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Voice catalog #9 hook: sigh — 'Three candidates. One real. You'll pick the third.' Land the third candidate as the strongest, but never tell the user which to pick.",
  "Direct. If two of the three candidates are obvious vanity bait, say so plainly.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Ground every claim in inputs.user_inputs (business_shape, stage, monetization, friction_top, etc.). Do not invent revenue band or stage.",
  "Anchor each critique slot to a knowledge/topics file from inputs.corpus only.",
  "Address the user in second person.",
];

const PER_SECTION_TEMPLATE = [
  "FAMILY — one short paragraph naming inputs.nsm_family and grounding it in the user's business_shape + stage + monetization. If business_shape is marketplace, name the side explicitly (or call out the two-sided liquidity shape).",
  "CANDIDATE_1 / CANDIDATE_2 / CANDIDATE_3 — each candidate is one section with five labelled slots: NAME (verb-noun, e.g. 'weekly active editing sessions'); ARGUMENT FOR (≤3 sentences, why-this-fits-your-shape); VANITY RISK; LEADING vs LAGGING; GAMEABILITY; WHAT COULD BREAK THIS; INPUT METRICS (3-5 leading inputs the team can move week-over-week).",
  "DASHBOARD AUDIT — only when inputs.has_dashboard is true. For each line in inputs.dashboard_lines, render 'metric_name: verdict — one-line-why'. Verdict ∈ {closest-to-NSM, useful-input, vanity-replace}. Heuristics: time-based aggregates of value-moments → closest-to-NSM; funnel-step conversions / retention curves → useful-input; page views / sessions / downloads / sign-ups without retention → vanity-replace. Revenue is a candidate only for transactional B2C and B2B-sales-led (repeat-revenue per cohort).",
].join("\n");

const DIRECTIVE = [
  "Render a North Star Metric reading directly to the user.",
  "Open with the FAMILY section, then three candidates following the per_section_template, then the dashboard audit IF inputs.has_dashboard is true (skip otherwise).",
  "Generate three distinct candidates from the supplied nsm_family — vary along vanity-vs-real, leading-vs-lagging, and gameability so the user sees a meaningful spread. Land the third as the strongest without saying 'pick this one'.",
  "Ground all claims in inputs.user_inputs and inputs.corpus. Never invent inputs.",
  "For each candidate, fill every slot in the per_section_template (NAME / ARGUMENT FOR / VANITY RISK / LEADING vs LAGGING / GAMEABILITY / WHAT COULD BREAK / INPUT METRICS).",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildNsmBriefInput {
  inputs: NSMInputsT;
  user_context?: string;
}

export async function buildNsmNarrationBrief(
  args: BuildNsmBriefInput,
): Promise<Brief> {
  const { inputs, user_context } = args;
  const family = resolveNsmFamily(inputs.business_shape, inputs.marketplace_side);
  const dashboardLines = parseDashboardLines(inputs.dashboard_paste ?? "");
  const hasDashboard = dashboardLines.length > 0;

  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return NSMNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: hasDashboard
        ? ["family", "candidate_1", "candidate_2", "candidate_3", "dashboard_audit"]
        : ["family", "candidate_1", "candidate_2", "candidate_3"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each candidate ≤180 words including input-metrics list. Dashboard audit ≤8 lines.",
    },
    inputs: {
      user_inputs: inputs,
      nsm_family: family,
      has_dashboard: hasDashboard,
      dashboard_lines: dashboardLines,
      user_context: user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
