import type { z } from "zod";
import { HoroscopeNarrateOutput } from "../shared/schemas";
import type { HoroscopeArchetypeSlug } from "../shared/schemas";
import {
  archetypeBySlug,
  composeReading,
  isoToday,
  isValidIsoDate,
  type ComposedReading,
} from "../tools/53-pm-horoscope/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof HoroscopeNarrateOutput>;

const CORPUS_CHUNK_CAP = 1500;

const VOICE_RULES = [
  "Two-beat rhythm. Confident, slightly dramatic, never actually predictive.",
  "No corporate softening. No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Use the supplied aspect, prediction, and nudge verbatim as the spine of the reading. Do not invent or substitute.",
  "Ground commentary in the supplied corpus chunks; do not invent corpus material or new framework names.",
  "Address the user in second person.",
  "Reading is in horoscope rhythm: a one-paragraph reading, not a bulleted list.",
];

const PER_SECTION_TEMPLATE = [
  "ASPECT — open by naming the aspect partner and the supplied aspect line. Keep it concrete (square / trine / opposition / conjunction).",
  "PREDICTION — render the supplied prediction. Add at most one sentence of corpus-grounded commentary tying it to the archetype's pitfall.",
  "NUDGE — render the supplied nudge. Add at most one sentence linking it to the archetype's virtue.",
  "LUCKY TOPIC — name the supplied topic file and offer one sentence on why it reinforces the virtue today.",
].join("\n");

const DIRECTIVE = [
  "Render a PM Horoscope reading directly to the user.",
  "Use the deterministic content from `inputs.reading` (aspect / prediction / nudge / topic) as the spine — do not substitute or rewrite the spine.",
  "Around that spine, weave a horoscope-rhythm paragraph (or short paragraphs) per the per_section_template.",
  "Anchor any added commentary in `corpus` and in the archetype's virtue / pitfall. Do not invent corpus material, framework names, or stakeholder roles.",
  "Open with the two-beat hook the voice catalog calls for — see the #53 entry: '<thing astrology says>. The <archetype>, however, has a <PM constraint>.'",
  "Close by naming the lucky topic file as the one corpus read to reinforce the virtue today.",
  "Do not echo this brief back; transform it. Under the length cap.",
].join(" ");

export interface BuildHoroscopeBriefInput {
  archetype: HoroscopeArchetypeSlug;
  date?: string;
  user_context?: string;
}

export interface BuildHoroscopeBriefResult {
  brief: Brief;
  reading: ComposedReading;
  resolvedDate: string;
}

export async function buildHoroscopeNarrationBrief(
  args: BuildHoroscopeBriefInput,
): Promise<BuildHoroscopeBriefResult> {
  const archetype = archetypeBySlug(args.archetype);
  const date =
    args.date && isValidIsoDate(args.date) ? args.date : isoToday();
  const reading = composeReading(archetype.id, date);
  const corpusRaw = await loadCorpusChunks(archetype.corpus_anchors);

  const corpus: Record<string, string> = {};
  for (const slug of archetype.corpus_anchors) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body
      ? truncate(body, CORPUS_CHUNK_CAP)
      : "(not found in local corpus)";
  }

  const brief = HoroscopeNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["aspect", "prediction", "nudge", "lucky_topic"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Under 200 words. One paragraph or two short paragraphs.",
    },
    inputs: {
      archetype_id: archetype.id,
      archetype_slug: archetype.slug,
      archetype_name: archetype.name,
      archetype_virtue: archetype.virtue,
      archetype_pitfall: archetype.pitfall,
      date,
      reading,
      user_context: args.user_context ?? "",
    },
    corpus,
  });

  return { brief, reading, resolvedDate: date };
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
