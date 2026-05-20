import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PitfallNarrateInput,
  PitfallNarrateOutput,
} from "../../shared/schemas";
import { PITFALLS, pitfallById } from "./data";
import { loadCorpusChunks } from "../../lib/corpus";

export const meta: ToolMeta = {
  name: "pm_pitfalls_narrate",
  description:
    "Packages a corpus-grounded narration brief for the user's top three pitfalls. Returns voice rules, structure, picks (pitfall text + exemplar quote + corpus anchors), and the corpus chunks themselves. The host chat model renders the user-facing narration from this brief. Pass through the user's 20 answers (from the score call) as `answers` so the brief can map each pitfall to the user's actual rating and so the narration grounds in real answers rather than guesses.",
  inputSchema: PitfallNarrateInput,
  outputSchema: PitfallNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PitfallNarrateInput>;
type Output = z.infer<typeof PitfallNarrateOutput>;

const CORPUS_CHUNK_CAP = 1500;

const VOICE_RULES = [
  "Be direct. No corporate softening.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Use the exemplar quote as a reference; do not rewrite it verbatim back to the user.",
  "Ground each diagnosis in the supplied corpus chunks. Do not invent corpus material.",
  "Address the user in second person.",
];

const PER_SECTION_TEMPLATE = [
  "Pitfall N — <short label>",
  "One-paragraph diagnosis of why this pitfall is harder than it looks for someone scoring around the user's level.",
  "Two concrete behaviors to start this quarter (use sentence form, not bullet labels).",
  "One named example drawn from the corpus chunks.",
].join("\n");

const DIRECTIVE_GROUNDED = [
  "Render a PM-pitfalls coaching narration directly to the user.",
  "Open with a one-sentence read on their score and how the top three picks cluster.",
  "Then write one section per pitfall, in the order given, following the per_section_template.",
  "When you cite a specific behavior of the user, ground it in inputs.full_audit (their actual always/sometimes/never per pitfall). Do not invent answers the user did not give.",
  "Close with one sentence on what to track for the next audit. Do not echo this brief back; transform it.",
].join(" ");

const DIRECTIVE_UNGROUNDED = [
  "Render a PM-pitfalls coaching narration directly to the user.",
  "Open with a one-sentence read on their score and how the top three picks cluster.",
  "Then write one section per pitfall, in the order given, following the per_section_template.",
  "The user's per-question answers were not passed through. Do NOT claim specific user answers (no phrases like 'your always on X' or 'your sometimes on Y'). Keep behavioral diagnoses general to someone scoring around their level.",
  "Close with one sentence on what to track for the next audit. Do not echo this brief back; transform it.",
].join(" ");

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { score_display, top_three_pitfall_ids, user_context, answers } = args;

  const pitfalls = top_three_pitfall_ids.map(pitfallById);
  const anchorSlugs = Array.from(new Set(pitfalls.flatMap((p) => p.anchors)));
  const corpusRaw = await loadCorpusChunks(anchorSlugs);

  const corpus: Record<string, string> = {};
  for (const slug of anchorSlugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  const picks = pitfalls.map((p) => ({
    pitfall_id: p.id,
    pitfall_text: p.text,
    exemplar_quote: p.quote,
    corpus_anchors: [...p.anchors],
    user_answer: answers ? answers[p.id - 1] : undefined,
  }));

  const fullAudit = answers
    ? PITFALLS.map((p) => ({
        pitfall_id: p.id,
        pitfall_text: p.text,
        user_answer: answers[p.id - 1]!,
      }))
    : undefined;

  return PitfallNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: answers ? DIRECTIVE_GROUNDED : DIRECTIVE_UNGROUNDED,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["intro", "pitfall_1", "pitfall_2", "pitfall_3", "closer"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each pitfall section under 120 words. Total output under 500 words.",
    },
    inputs: {
      score_display,
      user_context: user_context ?? "",
      picks,
      ...(fullAudit ? { full_audit: fullAudit } : {}),
    },
    corpus,
  });
};

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
