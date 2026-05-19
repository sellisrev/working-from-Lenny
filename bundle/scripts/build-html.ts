import fs from "node:fs/promises";
import path from "node:path";

/**
 * UI build step. For each HTML file under src/ui/, replaces
 *   <!-- include: <filename> -->
 * with the file's contents wrapped in <style> or <script> per extension.
 * Writes results to dist/ui/.
 *
 * No bundler, no node_modules — just string-replace. Keeps the .mcpb small
 * and makes the inlining mechanism obvious to anyone reading the source.
 */

const SRC_UI = path.resolve(__dirname, "..", "src", "ui");
const DIST_UI = path.resolve(__dirname, "..", "dist", "ui");

const INCLUDE_RE = /<!--\s*include:\s*([^\s]+)\s*-->/g;

async function buildOne(htmlPath: string): Promise<void> {
  const raw = await fs.readFile(htmlPath, "utf8");
  const includeFiles = new Set<string>();
  const out = raw.replace(INCLUDE_RE, (_, fname: string) => {
    includeFiles.add(fname);
    return `<!-- inlined: ${fname} -->\n<!-- placeholder -->`;
  });

  let result = raw;
  result = await replaceAsync(result, INCLUDE_RE, async (_, fname: string) => {
    const includedPath = path.join(SRC_UI, fname);
    const body = await fs.readFile(includedPath, "utf8");
    if (fname.endsWith(".css")) {
      return `<style>\n${body}\n</style>`;
    }
    if (fname.endsWith(".js")) {
      return `<script>\n${body}\n</script>`;
    }
    throw new Error(`Unknown include extension: ${fname}`);
  });

  const base = path.basename(htmlPath);
  const outPath = path.join(DIST_UI, base);
  await fs.mkdir(DIST_UI, { recursive: true });
  await fs.writeFile(outPath, result, "utf8");
  // eslint-disable-next-line no-console
  console.log(
    `  ui: ${base} inlined ${includeFiles.size} files -> ${path.relative(process.cwd(), outPath)}`,
  );
  // suppress unused-var warning
  void out;
}

async function replaceAsync(
  s: string,
  re: RegExp,
  replacer: (match: string, ...groups: string[]) => Promise<string>,
): Promise<string> {
  const parts: Array<string | Promise<string>> = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(s)) !== null) {
    parts.push(s.slice(lastIndex, m.index));
    parts.push(replacer(m[0], ...m.slice(1)));
    lastIndex = m.index + m[0].length;
  }
  parts.push(s.slice(lastIndex));
  const resolved = await Promise.all(parts);
  return resolved.join("");
}

async function main(): Promise<void> {
  const entries = await fs.readdir(SRC_UI, { withFileTypes: true });
  const htmls = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".html"),
  );
  if (htmls.length === 0) {
    console.warn("No HTML files in src/ui/");
    return;
  }
  for (const h of htmls) {
    await buildOne(path.join(SRC_UI, h.name));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
