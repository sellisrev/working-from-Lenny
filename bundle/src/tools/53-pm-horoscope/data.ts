import rawData from "./horoscope-data.json";

/**
 * #53 PM Horoscope deterministic data + composition engine.
 *
 * Source of truth: `apps/53-pm-horoscope/prompt.md` (12 archetypes × 30
 * predictions + 20 nudges + 11 aspect lines + 5 topic files) and the
 * six-question quiz at `apps/53-pm-horoscope/quiz.md`. The Phase 0 web
 * version inlines the same data in `artifacts/api-server/public/horoscope.html`;
 * `horoscope-data.json` is the canonical machine-readable copy extracted from
 * that source. Keep both in sync when the corpus is refreshed.
 *
 * The composition engine mirrors the Phase 0 djb2-style hash + modulo pick
 * verbatim so a given (archetype, date) produces the same reading whether the
 * user is on the web or in the MCP bundle.
 */

export interface Archetype {
  id: number;
  slug: string;
  name: string;
  virtue: string;
  pitfall: string;
  corpus_anchors: string[];
}

export interface ArchetypeContent {
  predictions: string[];
  nudges: string[];
  aspects: Record<string, string>;
  topics: string[];
}

export interface QuizOption {
  id: number;
  text: string;
  archetype_id: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

interface RawData {
  archetypes: Archetype[];
  content: Record<string, ArchetypeContent>;
  quiz: QuizQuestion[];
}

const data = rawData as RawData;

export const ARCHETYPES: Archetype[] = data.archetypes;
export const ARCHETYPE_CONTENT: Record<number, ArchetypeContent> =
  Object.fromEntries(
    Object.entries(data.content).map(([k, v]) => [Number(k), v]),
  );
export const QUIZ_QUESTIONS: QuizQuestion[] = data.quiz;

export const ARCHETYPE_SLUGS = ARCHETYPES.map((a) => a.slug) as [
  string,
  ...string[],
];

export function archetypeBySlug(slug: string): Archetype {
  const a = ARCHETYPES.find((x) => x.slug === slug);
  if (!a) throw new Error(`Unknown archetype slug: ${slug}`);
  return a;
}

export function archetypeById(id: number): Archetype {
  const a = ARCHETYPES.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown archetype id: ${id}`);
  return a;
}

/**
 * djb2-style hash, ported verbatim from horoscope.html so (archetype, date)
 * picks the same reading slot on the web and in the bundle. Do not change.
 */
export function wflHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export interface ComposedReading {
  aspect_partner_id: number;
  aspect_partner_name: string;
  aspect: string;
  prediction: string;
  nudge: string;
  topic: string;
}

export function composeReading(
  archetypeId: number,
  dateStr: string,
): ComposedReading {
  const content = ARCHETYPE_CONTENT[archetypeId];
  if (!content) throw new Error(`No content for archetype ${archetypeId}`);
  const aspectKeys = Object.keys(content.aspects)
    .map((k) => Number(k))
    .sort((a, b) => a - b);
  const partnerIdx = wflHash(`${dateStr}::${archetypeId}`) % aspectKeys.length;
  const partnerId = aspectKeys[partnerIdx]!;
  const aspect = content.aspects[String(partnerId)]!;
  const predIdx =
    wflHash(`${dateStr}::${archetypeId}::p`) % content.predictions.length;
  const nudgeIdx =
    wflHash(`${dateStr}::${archetypeId}::n`) % content.nudges.length;
  const topicIdx =
    wflHash(`${dateStr}::${archetypeId}::t`) % content.topics.length;
  return {
    aspect_partner_id: partnerId,
    aspect_partner_name: archetypeById(partnerId).name,
    aspect,
    prediction: content.predictions[predIdx]!,
    nudge: content.nudges[nudgeIdx]!,
    topic: content.topics[topicIdx]!,
  };
}

export interface QuizScore {
  archetype_id: number;
  next_archetype_id: number;
}

/**
 * Six-question quiz scoring. `answers[i]` is the 0-indexed option chosen for
 * question i. Each option maps to one archetype; the archetype with the most
 * picks wins. Ties broken by lowest archetype id. Returns the runner-up too
 * (next_archetype_id) so the user has an alternative if the primary doesn't
 * fit.
 */
export function scoreQuiz(answers: number[]): QuizScore {
  if (answers.length !== QUIZ_QUESTIONS.length) {
    throw new Error(
      `Expected ${QUIZ_QUESTIONS.length} answers, got ${answers.length}`,
    );
  }
  const scores = new Map<number, number>();
  for (const a of ARCHETYPES) scores.set(a.id, 0);
  for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
    const q = QUIZ_QUESTIONS[i]!;
    const optIdx = answers[i]!;
    if (optIdx < 0 || optIdx >= q.options.length) {
      throw new Error(
        `Answer ${optIdx} out of range for question ${i + 1} (0..${q.options.length - 1})`,
      );
    }
    const archetypeId = q.options[optIdx]!.archetype_id;
    scores.set(archetypeId, (scores.get(archetypeId) ?? 0) + 1);
  }
  const ranked = Array.from(scores.entries())
    .filter(([, v]) => v > 0)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0] - b[0];
    });
  if (ranked.length === 0) {
    // Defensive: every option maps to an archetype, so this is unreachable
    // unless answers is somehow empty/malformed. Fall back to id 1.
    return { archetype_id: 1, next_archetype_id: 2 };
  }
  const archetypeId = ranked[0]![0];
  const nextArchetypeId =
    ranked.length > 1 ? ranked[1]![0] : archetypeId === 1 ? 2 : 1;
  return { archetype_id: archetypeId, next_archetype_id: nextArchetypeId };
}

/**
 * Returns YYYY-MM-DD for the current UTC date. Used as the default `date`
 * argument so a tool call without `date` produces today's reading.
 */
export function isoToday(): string {
  const d = new Date();
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(s: string): boolean {
  if (!ISO_DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime());
}
