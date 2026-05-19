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
