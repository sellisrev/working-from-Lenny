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
 * Data dir for per-user state files. Computed platform-conventionally so the
 * server doesn't depend on .mcpb manifest template variables for this — the
 * MCPB spec only exposes `${HOME}`, `${__dirname}`, `${DESKTOP}`,
 * `${DOCUMENTS}`, `${DOWNLOADS}`, `${pathSeparator}`, and `${user_config.KEY}`,
 * none of which match the OS app-data convention on Windows (`%APPDATA%`) or
 * macOS (`~/Library/Application Support`). Using `${HOME}/.working-from-lenny`
 * pollutes the user's home dir on Windows where dotfiles aren't conventional.
 *
 * Conventions per platform:
 *   Windows: %APPDATA%\working-from-lenny           (e.g. C:\Users\<u>\AppData\Roaming\working-from-lenny)
 *   macOS:   ~/Library/Application Support/working-from-lenny
 *   Linux:   $XDG_DATA_HOME/working-from-lenny      (defaults to ~/.local/share/working-from-lenny)
 *
 * `WFL_DATA_DIR` env var still wins for tests and explicit user overrides,
 * but only if it's been actually expanded (no leftover `${...}` literal).
 */
const APP_DIR_NAME = "working-from-lenny";

export function dataDir(): string {
  const override = process.env.WFL_DATA_DIR;
  if (override && !override.includes("${")) return override;

  switch (process.platform) {
    case "win32":
      return path.join(
        process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
        APP_DIR_NAME,
      );
    case "darwin":
      return path.join(os.homedir(), "Library", "Application Support", APP_DIR_NAME);
    default:
      return path.join(
        process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share"),
        APP_DIR_NAME,
      );
  }
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
