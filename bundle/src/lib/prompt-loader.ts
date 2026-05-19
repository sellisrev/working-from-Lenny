import fs from "node:fs/promises";
import path from "node:path";
import { resolveAppsRoot } from "./paths";

const cache = new Map<string, string>();

/**
 * Reads `apps/<appId>/prompt.md` and extracts the LLM-relevant block. If a
 * file has explicit `<!-- llm-prompt-start -->` / `<!-- llm-prompt-end -->`
 * markers, only the content between them is returned. Otherwise the full
 * body (frontmatter stripped) is returned.
 */
export async function loadPrompt(appId: string): Promise<string> {
  if (cache.has(appId)) return cache.get(appId)!;

  const root = resolveAppsRoot();
  // Each app dir is `<id>-<slug>` — match by leading id.
  const dirs = await fs.readdir(root, { withFileTypes: true });
  const match = dirs.find(
    (d) => d.isDirectory() && new RegExp(`^${appId}(-|$)`).test(d.name),
  );
  if (!match) {
    throw new Error(`Could not locate apps/${appId}* under ${root}`);
  }
  const file = path.join(root, match.name, "prompt.md");
  const raw = await fs.readFile(file, "utf8");
  const body = stripFrontmatter(raw);

  const start = body.indexOf("<!-- llm-prompt-start -->");
  const end = body.indexOf("<!-- llm-prompt-end -->");
  const extracted =
    start >= 0 && end > start
      ? body.slice(start + "<!-- llm-prompt-start -->".length, end).trim()
      : body;

  cache.set(appId, extracted);
  return extracted;
}

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  if (end < 0) return raw;
  return raw.slice(end + 4).replace(/^\s+/, "");
}
