import type { z } from "zod";
import { PitfallNarrateOutput } from "../shared/schemas";
import { PITFALLS, pitfallById } from "../tools/pm-pitfalls/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof PitfallNarrateOutput>;
type Answer = "always" | "sometimes" | "never";

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

export interface BuildBriefInput {
  score_display: number;
  /**
   * Exactly three pitfall IDs. Loose `number[]` was previously accepted with
   * an `as` cast at callers; that hid length mismatches. Use
   * `assertTopThree()` at call sites when starting from a `number[]`.
   */
  top_three_pitfall_ids: [number, number, number];
  user_context?: string;
  answers?: Answer[];
}

/**
 * Runtime length guard for callers that compute top_three as `number[]`
 * (e.g. score.ts via slice). Throws a descriptive error rather than coercing
 * silently.
 */
export function assertTopThree(ids: number[]): [number, number, number] {
  if (ids.length !== 3) {
    throw new Error(
      `top_three_pitfall_ids must have exactly 3 entries, got ${ids.length}`,
    );
  }
  return [ids[0]!, ids[1]!, ids[2]!];
}

/**
 * Builds the Path 4 narration brief. Shared by:
 *   - `pm_pitfalls_narrate` (returns the brief directly to the caller)
 *   - `pm_pitfalls_score` (writes the brief to the pending-narration file as
 *     a side effect so chat-side Claude can pick it up via get-pending even
 *     if it never calls narrate)
 *   - `pm_pitfalls_get_pending_narration` (rebuilds the brief from the saved
 *     score inputs if the pending file was written without a precomputed
 *     brief — older save formats; current save format is the brief itself)
 */
export async function buildPitfallNarrationBrief(
  args: BuildBriefInput,
): Promise<Brief> {
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
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
