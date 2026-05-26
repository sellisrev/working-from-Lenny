import type { z } from "zod";
import { DailyDoseNarrateOutput, DailyDoseInvalidation } from "../shared/schemas";
import { loadCorpusChunks, listTopicMetas, listInvalidationMetas } from "./corpus";

type Brief = z.infer<typeof DailyDoseNarrateOutput>;
type Invalidation = z.infer<typeof DailyDoseInvalidation>;
type TopicMeta = { slug: string; display_name: string; last_updated: string | null };

const CORPUS_CHUNK_CAP = 1500;

const VOICE_RULES = [
  "Write in a clear, direct PM voice. No hype, no life-coaching.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', or 'unlock'.",
  "Lead with the lesson, not the source. Source at the end of the lesson section.",
  "The action should be specific enough to do today, not a general aspiration.",
  "The unlearn half is honest and specific: name the claim, name what changed, don't editorialize.",
  "Keep the streak line quiet — mention it once, at the end, in one low-key sentence.",
];

const PER_SECTION_TEMPLATE = [
  "LESSON — {topic_display_name}: The main insight in 2-3 short paragraphs.",
  "PASSAGE — A direct quote or condensed passage from the corpus chunk.",
  "ACTION — One thing to do today: specific, achievable, tied to the lesson.",
  "UNLEARN — If inputs.recent_invalidation.status is 'obsolete' or 'caution': 'The corpus has updated its view on [claim]. [what_changed]. Source: [source].' If 'none_new': 'Nothing new has been retired from this area since your last dose.'",
].join("\n");

function buildDirective(topic: TopicMeta, invalidation: Invalidation, streak: number): string {
  const parts = [
    `Render today's dose directly to the user.`,
    `LESSON: Write the main insight from the '${topic.display_name}' topic in 2-3 short paragraphs. Ground it in the corpus chunk. End with a citation line: source guest, date, and post/episode if named in the chunk.`,
    `PASSAGE: Pull one direct quote or condensed passage from the corpus chunk that crystallizes the lesson. Introduce it briefly.`,
    `ACTION: Write one concrete action the user can take today — specific, tied to the lesson, under 40 words.`,
  ];
  if (invalidation.status === "none_new") {
    parts.push(`UNLEARN: Write one sentence: 'Nothing new has been retired from this area since your last dose.'`);
  } else {
    const claimText = invalidation.claim ? `"${invalidation.claim}"` : "a claim in this area";
    const changed = invalidation.what_changed || "the corpus has updated its view";
    const src = invalidation.source || "the corpus";
    parts.push(
      `UNLEARN: Write the unlearn half: 'The corpus has retired (or flagged) the claim ${claimText}. ${changed}. Source: ${src}.' Keep it under 60 words. Don't moralize.`,
    );
  }
  if (streak > 1) {
    parts.push(`At the very end, add one low-key line: 'Dose ${streak} in a row.'`);
  }
  parts.push(`Do not echo this brief back; transform it.`);
  return parts.join(" ");
}

export interface BuildDailyDoseBriefInput {
  topic: TopicMeta;
  user_context: string;
  streak: number;
  gap_weighted: boolean;
  weighting_signal?: string;
  recent_invalidation: Invalidation;
}

export async function buildDailyDoseBrief(args: BuildDailyDoseBriefInput): Promise<Brief> {
  const { topic, user_context, streak, gap_weighted, weighting_signal, recent_invalidation } = args;

  const slugs = [topic.slug];
  if (recent_invalidation.slug && recent_invalidation.status !== "none_new") {
    const invalidSlug =
      recent_invalidation.status === "obsolete"
        ? `obsolete/${recent_invalidation.slug}`
        : `cautions/${recent_invalidation.slug}`;
    slugs.push(invalidSlug);
  }

  const corpusRaw = await loadCorpusChunks([topic.slug]);
  const corpus: Record<string, string> = {};
  const body = corpusRaw[topic.slug] ?? "";
  corpus[topic.slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";

  const sections = ["lesson", "passage", "action", "unlearn"];

  return DailyDoseNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(topic, recent_invalidation, streak),
    voice_rules: VOICE_RULES,
    structure: {
      sections,
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Lesson 120-180 words. Passage 30-60 words. Action under 40 words. Unlearn under 60 words. Total under 380 words.",
    },
    inputs: {
      topic,
      user_context: user_context ?? "",
      streak,
      gap_weighted,
      ...(weighting_signal ? { weighting_signal } : {}),
      recent_invalidation,
    },
    corpus,
  } as Brief);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}

// ---------------------------------------------------------------------------
// Topic selection helpers — used by daily_dose_pick
// ---------------------------------------------------------------------------

function seededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0x100000000;
  };
}

function todaysSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export async function selectTodaysTopic(
  shownSlugs: string[],
  forcedSlug?: string,
): Promise<{ topic: TopicMeta; gapWeighted: boolean }> {
  if (forcedSlug) {
    const all = await listTopicMetas();
    const found = all.find((t) => t.slug === forcedSlug);
    if (found) return { topic: found, gapWeighted: false };
  }

  const all = (await listTopicMetas()).filter((t) => t.slug !== "_TEMPLATE");
  if (all.length === 0) {
    return { topic: { slug: "pm-pitfalls", display_name: "PM Pitfalls", last_updated: null }, gapWeighted: false };
  }

  const shownSet = new Set(shownSlugs);
  const unseen = all.filter((t) => !shownSet.has(t.slug));
  const pool = unseen.length > 0 ? unseen : all;

  const rand = seededRandom(todaysSeed());
  const idx = Math.floor(rand() * pool.length);
  return { topic: pool[idx]!, gapWeighted: false };
}

export async function selectUnseenInvalidation(
  lastSeenSlug: string | null,
  topicSlug: string,
): Promise<Invalidation> {
  const all = await listInvalidationMetas();
  const real = all.filter((x) => x.slug !== "_TEMPLATE");

  if (real.length === 0) return { status: "none_new" };

  // Prefer an entry paired with today's topic
  const paired = real.find((x) => x.topic_slug === topicSlug && x.slug !== lastSeenSlug);
  const candidate = paired ?? real.find((x) => x.slug !== lastSeenSlug) ?? null;

  if (!candidate) return { status: "none_new" };

  return {
    status: candidate.kind as "obsolete" | "caution",
    slug: candidate.slug,
    claim: candidate.claim || undefined,
    what_changed: candidate.what_changed || undefined,
    source: candidate.source || undefined,
    ...(candidate.kind === "caution" && candidate.vote_count !== undefined
      ? { vote_count: candidate.vote_count }
      : {}),
    ...(candidate.kind === "obsolete" && candidate.confidence
      ? { confidence: candidate.confidence }
      : {}),
    paired_with_topic: candidate.topic_slug === topicSlug,
  };
}

export function buildInvalidationHeadline(inv: Invalidation): string {
  if (inv.status === "none_new") return "";
  const claim = inv.claim ? `"${inv.claim.slice(0, 60)}${inv.claim.length > 60 ? "…" : ""}"` : "a claim in this area";
  return inv.status === "obsolete"
    ? `The corpus has retired ${claim}`
    : `The corpus has flagged ${claim} (strong audience pushback)`;
}
