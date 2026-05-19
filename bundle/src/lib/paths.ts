import os from "node:os";
import path from "node:path";

/**
 * Bundle root. In production (.mcpb): host substitutes ${__dirname} and we
 * read $WFL_BUNDLE_ROOT. In local dev (pnpm dev / tsx): defaults to two
 * levels up from this file (bundle/).
 */
export function bundleRoot(): string {
  if (process.env.WFL_BUNDLE_ROOT) return process.env.WFL_BUNDLE_ROOT;
  return path.resolve(__dirname, "..", "..");
}

/**
 * Data dir for per-user state files. Host sets $WFL_DATA_DIR via
 * manifest.json -> mcp_config.env. Local fallback: ~/.working-from-lenny.
 */
export function dataDir(): string {
  if (process.env.WFL_DATA_DIR) return process.env.WFL_DATA_DIR;
  return path.join(os.homedir(), ".working-from-lenny");
}

/** Returns repo-root paths for shared corpus + per-app prompts (NOT bundle/-rooted). */
export function corpusRoot(): string {
  return path.join(bundleRoot(), "..", "knowledge", "topics");
}

export function appsRoot(): string {
  return path.join(bundleRoot(), "..", "apps");
}

/**
 * At release time, mcpb-pack copies knowledge/ and apps/ INTO the bundle.
 * If those copies exist, prefer them so the .mcpb is self-contained. The
 * release script copies to bundle/knowledge/ and bundle/apps/.
 */
export function resolveCorpusRoot(): string {
  const bundled = path.join(bundleRoot(), "knowledge", "topics");
  return tryExistsSync(bundled) ? bundled : corpusRoot();
}

export function resolveAppsRoot(): string {
  const bundled = path.join(bundleRoot(), "apps");
  return tryExistsSync(bundled) ? bundled : appsRoot();
}

function tryExistsSync(p: string): boolean {
  try {
    const fs = require("node:fs") as typeof import("node:fs");
    return fs.existsSync(p);
  } catch {
    return false;
  }
}
