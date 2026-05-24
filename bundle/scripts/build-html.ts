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

interface CatalogApp {
  app_id: string;
  name: string;
  theme: string;
  featured: boolean;
  order_hint: number;
  one_liner: string;
  entry_tool: string;
  ui_resource: string;
  skill_slug: string;
}

/**
 * Launcher-home catalog assembly (PHASE2_BUILD decision #10). Concatenates
 * each app's `_meta.dev.workingfromlenny.catalog` block (single source — same
 * discipline as the manifest tools array) into one catalog.json that the
 * `wfl_home` tool reads at runtime. Written into src/tools/home/ so dev (tsx)
 * reads it directly and copyToolDataFiles() mirrors it to dist/ for the packed
 * server. Deterministic (no timestamp) so a rebuild is a no-op diff.
 */
async function buildCatalog(): Promise<void> {
  const appsRoot = path.resolve(BUNDLE_ROOT, "..", "apps");
  const homeToolDir = path.resolve(BUNDLE_ROOT, "src", "tools", "home");
  const outPath = path.join(homeToolDir, "catalog.json");

  const entries = await fs.readdir(appsRoot, { withFileTypes: true });
  const apps: CatalogApp[] = [];
  for (const e of entries) {
    if (!e.isDirectory() || e.name.startsWith("_")) continue;
    const resPath = path.join(appsRoot, e.name, "mcp-resource.json");
    let raw: string;
    try {
      raw = await fs.readFile(resPath, "utf8");
    } catch {
      continue; // app dir without a resource manifest — skip
    }
    const parsed = JSON.parse(raw) as {
      resource?: { name?: string };
      _meta?: Record<string, unknown>;
    };
    const cat = parsed._meta?.["dev.workingfromlenny.catalog"] as
      | Partial<CatalogApp>
      | undefined;
    if (!cat) continue;
    apps.push({
      app_id: e.name,
      name: parsed.resource?.name ?? e.name,
      theme: String(cat.theme ?? "uncategorized"),
      featured: Boolean(cat.featured),
      order_hint: typeof cat.order_hint === "number" ? cat.order_hint : 999,
      one_liner: String(cat.one_liner ?? ""),
      entry_tool: String(cat.entry_tool ?? ""),
      ui_resource: String(cat.ui_resource ?? ""),
      skill_slug: String(cat.skill_slug ?? ""),
    });
  }
  // Stable sort: app_id then order_hint, so the file is deterministic. The
  // home tool applies the theme-section + featured-first ordering at runtime.
  apps.sort((a, b) =>
    a.app_id === b.app_id ? a.order_hint - b.order_hint : a.app_id < b.app_id ? -1 : 1,
  );

  await fs.mkdir(homeToolDir, { recursive: true });
  await fs.writeFile(outPath, JSON.stringify({ app_count: apps.length, apps }, null, 2) + "\n", "utf8");
  // eslint-disable-next-line no-console
  console.log(`  catalog: assembled ${apps.length} apps -> ${path.relative(BUNDLE_ROOT, outPath)}`);
}

async function copyToolDataFiles(): Promise<void> {
  // Per-tool data lives as .json files alongside the .ts under src/tools/.
  // tsc does not copy non-TS files to outDir, so mirror them by hand. Keeps
  // the runtime require('./horoscope-data.json') working in dist/.
  const srcTools = path.resolve(BUNDLE_ROOT, "src", "tools");
  const distTools = path.resolve(BUNDLE_ROOT, "dist", "tools");
  await mirrorJsonFiles(srcTools, distTools);
}

async function mirrorJsonFiles(srcDir: string, distDir: string): Promise<void> {
  let entries;
  try {
    entries = await fs.readdir(srcDir, { withFileTypes: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const distPath = path.join(distDir, entry.name);
    if (entry.isDirectory()) {
      await mirrorJsonFiles(srcPath, distPath);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".json")) {
      await fs.mkdir(distDir, { recursive: true });
      await fs.copyFile(srcPath, distPath);
      // eslint-disable-next-line no-console
      console.log(
        `  data: copied ${path.relative(BUNDLE_ROOT, srcPath)} -> ${path.relative(BUNDLE_ROOT, distPath)}`,
      );
    }
  }
}

async function main(): Promise<void> {
  const version = await readManifestVersion();
  const entries = await fs.readdir(SRC_UI, { withFileTypes: true });
  const htmls = entries.filter(
    (e) => e.isFile() && e.name.endsWith(".html"),
  );
  if (htmls.length === 0) {
    console.warn("No HTML files in src/ui/");
  }
  for (const h of htmls) {
    await buildOne(path.join(SRC_UI, h.name), version);
  }
  await buildCatalog();
  await copyToolDataFiles();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
