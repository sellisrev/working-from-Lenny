import type { OkrParseResultT } from "../../shared/schemas";

/**
 * #24 OKR Critique deterministic data + cheap parser.
 *
 * Source of truth: apps/24-okr-critique/prompt.md. The parser is intentionally
 * lightweight — it extracts a best-effort objective/KR tree from common OKR
 * formats (bold headers, numbered objectives, KR1/KR2/bullets). When the input
 * is unstructured the parser returns parsing_confidence='low' and the host
 * model does its own structural inference.
 *
 * Corpus anchors per prompt.md, with substitutions logged in authoring.md:
 *   - goal-setting → okrs (covers goal-setting territory)
 *   - cross-functional-collaboration → getting-buy-in
 *   - metrics-for-pms → north-star-metric
 */

export const TOO_MANY = {
  kr_per_objective: 4,
  objectives_team: 3,
  objectives_org: 5,
} as const;

export const CORPUS_ANCHORS = [
  "okrs",
  "pm-pitfalls",
  "getting-buy-in",
  "north-star-metric",
];

const OBJECTIVE_PATTERNS = [
  /^(?:objective\s*\d*\s*[:\-]\s*)(.+)$/i, // "Objective 1: ..." / "Objective: ..."
  /^(?:o\s*\d+\s*[:\-]\s*)(.+)$/i, // "O1: ..."
  /^(?:\d+\.\s+)(.+)$/, // "1. ..."
  /^(?:#+\s+)(.+)$/, // "# ..." / "## ..."
  /^\*\*(.+)\*\*\s*[:.]?\s*$/, // "**Foo:**"
];

const KR_PATTERNS = [
  /^(?:kr\s*\d*\s*[:\-]\s*)(.+)$/i, // "KR1: ..."
  /^(?:k\s*\d+\s*[:\-]\s*)(.+)$/i,
  /^(?:[-*+•]\s+)(.+)$/, // bullet
  /^(?:\d+\.\d+\.?\s+)(.+)$/, // "1.1 ..." / "1.1. ..."
  /^(?:\s+\d+\.\s+)(.+)$/, // indented numbered (KR child of objective)
];

function matchFirst(line: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = line.match(re);
    if (m && m[1]) return m[1].trim();
  }
  return null;
}

/**
 * Parses an OKR paste into a best-effort objective/KR tree.
 *
 * Confidence buckets:
 *  - high: every objective got ≥1 KR via pattern match
 *  - med:  found ≥1 objective + ≥1 KR but some objectives lack KRs
 *  - low:  couldn't find a clear objective/KR structure (single bucket)
 */
export function parseOkrs(text: string): OkrParseResultT {
  const rawLines = text.split(/\r?\n/);
  const objectives: { text: string; key_results: string[] }[] = [];
  let current: { text: string; key_results: string[] } | null = null;

  for (const raw of rawLines) {
    const line = raw.trimEnd();
    if (line.trim().length === 0) continue;

    // Try objective first; indented bullets/KR-style lines should not match
    // as objectives.
    const isIndented = /^\s+/.test(raw);
    if (!isIndented) {
      const obj = matchFirst(line.trim(), OBJECTIVE_PATTERNS);
      if (obj !== null) {
        current = { text: obj, key_results: [] };
        objectives.push(current);
        continue;
      }
    }
    const kr = matchFirst(raw.trim(), KR_PATTERNS);
    if (kr !== null) {
      if (current === null) {
        // KR-shaped line with no preceding objective — synthesize a holding
        // bucket so we don't drop it.
        current = { text: "(no objective named)", key_results: [] };
        objectives.push(current);
      }
      current.key_results.push(kr);
      continue;
    }

    // Plain prose line — if we have a current objective and this is short
    // enough to be a KR-like sentence, fold it in. Otherwise treat as a new
    // objective candidate.
    if (current && line.trim().length < 200) {
      current.key_results.push(line.trim());
    } else {
      current = { text: line.trim(), key_results: [] };
      objectives.push(current);
    }
  }

  let confidence: "low" | "med" | "high";
  if (objectives.length === 0) {
    confidence = "low";
  } else if (objectives.every((o) => o.key_results.length >= 1)) {
    confidence = "high";
  } else if (objectives.some((o) => o.key_results.length >= 1)) {
    confidence = "med";
  } else {
    confidence = "low";
  }

  // If parsing collapsed to a single "(no objective named)" bucket with
  // everything inside, treat as low confidence even if KR count is high.
  if (
    objectives.length === 1 &&
    objectives[0]!.text === "(no objective named)" &&
    objectives[0]!.key_results.length > 0
  ) {
    confidence = "low";
  }

  return { objectives, parsing_confidence: confidence };
}

export function tooManyOverall(
  parsed: OkrParseResultT,
  level: "team" | "org",
): boolean {
  const cap = level === "org" ? TOO_MANY.objectives_org : TOO_MANY.objectives_team;
  return parsed.objectives.length > cap;
}
