import fs from "node:fs/promises";
import path from "node:path";
import { resolveCorpusRoot } from "./paths";

const cache = new Map<string, string>();

/**
 * Reads `knowledge/topics/<slug>.md` and returns the body (frontmatter
 * stripped). Memoized per process. Missing files return an empty string so
 * the caller can decide whether absence is fatal.
 */
export async function loadCorpusChunks(
  slugs: string[],
): Promise<Record<string, string>> {
  const root = resolveCorpusRoot();
  const out: Record<string, string> = {};
  for (const slug of slugs) {
    if (cache.has(slug)) {
      out[slug] = cache.get(slug)!;
      continue;
    }
    const file = path.join(root, `${slug}.md`);
    try {
      const raw = await fs.readFile(file, "utf8");
      const body = stripFrontmatter(raw);
      cache.set(slug, body);
      out[slug] = body;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        cache.set(slug, "");
        out[slug] = "";
      } else {
        throw err;
      }
    }
  }
  return out;
}

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return raw;
  return raw.slice(end + 4).replace(/^\s+/, "");
}

// ---------------------------------------------------------------------------
// Corpus-wide retrieval (PHASE2_BUILD decision #11). Used by the single-call
// Path-4 apps (#54 AMA, #57 Pressure-Test Anything, #58 Hiring Playbook): no
// pinned anchors, instead a keyword sweep across the whole synthesis plus the
// decay layers, so an objection / answer can flag when older advice expired or
// drew audience pushback.
//
// Degrades gracefully per layer: in the shipped .mcpb only knowledge/topics is
// bundled (pack.ts stages topics only), so the obsolete / cautions / books
// dirs are absent at runtime and simply contribute no hits. In dev / validate
// the full repo knowledge/ tree is present, so the decay sweep runs.
// ---------------------------------------------------------------------------

export type CorpusKind = "topic" | "obsolete" | "caution" | "book";

export interface CorpusHit {
  slug: string;
  kind: CorpusKind;
  /** Citation key the host renders: bare slug for topics, kind-prefixed for the rest (matches the skill citation format). */
  ref: string;
  last_updated: string | null;
  score: number;
  chunk: string;
}

const KIND_DIRS: Record<CorpusKind, string> = {
  topic: "topics",
  obsolete: "obsolete",
  caution: "cautions",
  book: "books",
};

const ALL_KINDS: CorpusKind[] = ["topic", "obsolete", "caution", "book"];

const CHUNK_CHARS = 1500;

// Common English + corpus-boilerplate words that carry no retrieval signal.
const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "your", "you", "are",
  "was", "were", "will", "would", "should", "could", "can", "our", "out",
  "about", "into", "than", "then", "them", "they", "their", "what", "when",
  "which", "while", "have", "has", "had", "not", "but", "all", "any", "how",
  "why", "who", "its", "it's", "we're", "i'm", "get", "got", "use", "using",
  "want", "need", "make", "made", "also", "more", "most", "some", "such",
  "very", "just", "like", "one", "two", "plan", "doc", "thing", "things",
]);

interface IndexedDoc {
  slug: string;
  kind: CorpusKind;
  last_updated: string | null;
  body: string;
  haystack: string;
  slugHaystack: string;
}

// Per-directory index, memoized for the process lifetime. Keyed by absolute dir.
const indexCache = new Map<string, IndexedDoc[]>();

function knowledgeRoot(): string {
  // resolveCorpusRoot() points at <knowledge>/topics; its parent is <knowledge>.
  return path.dirname(resolveCorpusRoot());
}

function parseLastUpdated(raw: string): string | null {
  if (!raw.startsWith("---")) return null;
  const end = raw.indexOf("\n---", 3);
  const fm = end < 0 ? raw : raw.slice(0, end);
  const m = fm.match(/^last_updated:\s*(.+)$/m);
  return m ? m[1]!.trim() : null;
}

async function indexKind(kind: CorpusKind): Promise<IndexedDoc[]> {
  const dir = path.join(knowledgeRoot(), KIND_DIRS[kind]);
  const cached = indexCache.get(dir);
  if (cached) return cached;

  const docs: IndexedDoc[] = [];
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    indexCache.set(dir, docs); // dir absent (e.g. topics-only .mcpb) — no hits
    return docs;
  }
  for (const name of entries) {
    if (!name.endsWith(".md") || name.startsWith("_")) continue;
    const slug = name.slice(0, -3);
    try {
      const raw = await fs.readFile(path.join(dir, name), "utf8");
      const body = stripFrontmatter(raw);
      docs.push({
        slug,
        kind,
        last_updated: parseLastUpdated(raw),
        body,
        haystack: body.toLowerCase(),
        slugHaystack: slug.replace(/-/g, " "),
      });
    } catch {
      // unreadable file — skip
    }
  }
  indexCache.set(dir, docs);
  return docs;
}

function tokenize(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tok of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (tok.length < 3 || STOPWORDS.has(tok) || seen.has(tok)) continue;
    seen.add(tok);
    out.push(tok);
  }
  return out;
}

function countOccurrences(haystack: string, token: string): number {
  if (!token) return 0;
  return haystack.split(token).length - 1;
}

function scoreDoc(doc: IndexedDoc, tokens: string[]): number {
  let score = 0;
  let matched = 0;
  for (const tok of tokens) {
    const occ = countOccurrences(doc.haystack, tok);
    if (occ > 0) {
      matched++;
      score += Math.min(occ, 8);
    }
    if (doc.slugHaystack.includes(tok)) score += 5;
  }
  // Coverage (how many distinct query terms hit) matters more than raw
  // frequency, so a doc touching many query terms ranks above one that just
  // repeats a single common word.
  score += matched * 3;
  return score;
}

/**
 * Keyword-match `text` across the requested corpus layers and return the top-k
 * hits, each tagged with kind + last_updated + a truncated chunk. v1 is
 * keyword scoring (decision #11). Returns hits sorted by descending score;
 * never throws on a missing layer.
 */
export async function retrieveAcrossCorpus(
  text: string,
  k: number,
  opts?: { kinds?: CorpusKind[] },
): Promise<CorpusHit[]> {
  const kinds = opts?.kinds ?? ALL_KINDS;
  const tokens = tokenize(text);
  if (tokens.length === 0) return [];

  const indexed = (await Promise.all(kinds.map(indexKind))).flat();
  const scored: CorpusHit[] = [];
  for (const doc of indexed) {
    const score = scoreDoc(doc, tokens);
    if (score <= 0) continue;
    scored.push({
      slug: doc.slug,
      kind: doc.kind,
      ref: doc.kind === "topic" ? doc.slug : `${KIND_DIRS[doc.kind]}/${doc.slug}`,
      last_updated: doc.last_updated,
      score,
      chunk: doc.body.length > CHUNK_CHARS ? doc.body.slice(0, CHUNK_CHARS) : doc.body,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, Math.max(1, k));
}
