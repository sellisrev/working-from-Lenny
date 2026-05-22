import fs from "node:fs/promises";
import path from "node:path";

/**
 * UI build step. For each HTML file under src/ui/, replaces
 *   <!-- include: <filename> -->
 * with the file's contents wrapped in <style> or <script> per extension.
 * Writes results to dist/ui/.
 *
 * Also substitutes `__WFL_BUNDLE_VERSION__` with the version from
 * manifest.json so the iframe's `ui/initialize` handshake announces the
 * shipping version (caught a v0.1.7 ship-bug where APP_INFO.version was
 * hardcoded "0.1.0" and drifted from the manifest on every release).
 *
 * No bundler, no node_modules — just string-replace. Keeps the .mcpb small
 * and makes the inlining mechanism obvious to anyone reading the source.
 */

const BUNDLE_ROOT = path.resolve(__dirname, "..");
const SRC_UI = path.resolve(BUNDLE_ROOT, "src", "ui");
const DIST_UI = path.resolve(BUNDLE_ROOT, "dist", "ui");
const MANIFEST_PATH = path.resolve(BUNDLE_ROOT, "manifest.json");

const INCLUDE_RE = /<!--\s*include:\s*([^\s]+)\s*-->/g;
const VERSION_PLACEHOLDER = "__WFL_BUNDLE_VERSION__";

async function buildOne(htmlPath: string, version: string): Promise<void> {
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

  // Substitute the version placeholder everywhere (covers the inlined
  // mcp-rpc.js's APP_INFO.version and any HTML-level marker that opts in).
  const before = result;
  result = result.split(VERSION_PLACEHOLDER).join(version);
  const substitutions = before === result ? 0 : before.split(VERSION_PLACEHOLDER).length - 1;

  const base = path.basename(htmlPath);
  const outPath = path.join(DIST_UI, base);
  await fs.mkdir(DIST_UI, { recursive: true });
  await fs.writeFile(outPath, result, "utf8");
  // eslint-disable-next-line no-console
  console.log(
    `  ui: ${base} inlined ${includeFiles.size} files, substituted version=${version} (${substitutions}x) -> ${path.relative(process.cwd(), outPath)}`,
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

async function readManifestVersion(): Promise<string> {
  const raw = await fs.readFile(MANIFEST_PATH, "utf8");
  const parsed = JSON.parse(raw) as { version?: unknown };
  if (typeof parsed.version !== "string" || parsed.version.length === 0) {
    throw new Error(`manifest.json is missing a string "version" field`);
  }
  return parsed.version;
}

async function main(): Promise<void> {
  const version = await readManifestVersion();
  const entries = await fs.readdir(SRC_UI, { withFileTypes: true });
  const htmls = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".html"),
  );
  if (htmls.length === 0) {
    console.warn("No HTML files in src/ui/");
    return;
  }
  for (const h of htmls) {
    await buildOne(path.join(SRC_UI, h.name), version);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
