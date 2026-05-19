import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

const bundleRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(bundleRoot, "..");

const stagedApps = path.join(bundleRoot, "apps");
const stagedTopics = path.join(bundleRoot, "knowledge", "topics");

/**
 * Wraps the `mcpb` CLI to pack the bundle into a .mcpb ZIP.
 * Run after `pnpm run build` so dist/ exists.
 *
 * Before packing, copies the runtime read-only assets into the bundle so the
 * installed .mcpb is self-contained:
 *   <repo>/apps/<id>-<slug>/           → <bundle>/apps/<id>-<slug>/
 *   <repo>/knowledge/topics/*.md       → <bundle>/knowledge/topics/
 * Skips apps/_archive (superseded specs). Cleans up the staged copies after
 * pack regardless of outcome so the working tree stays clean. Both staged
 * paths are gitignored.
 *
 * Falls back to a helpful message if `mcpb` isn't installed globally —
 * production builds happen in the GitHub Action which uses
 * NimbleBrainInc/mcpb-pack@v1, so local pack is for owner smoke-testing.
 */

async function main(): Promise<void> {
  await stageRuntimeAssets();
  try {
    await runMcpbPack();
  } finally {
    await cleanupStagedAssets();
  }
}

async function stageRuntimeAssets(): Promise<void> {
  await cleanupStagedAssets();

  const appsSrc = path.join(repoRoot, "apps");
  const appsEntries = await fs.readdir(appsSrc, { withFileTypes: true });
  await fs.mkdir(stagedApps, { recursive: true });
  for (const entry of appsEntries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("_archive")) continue;
    const src = path.join(appsSrc, entry.name);
    const dest = path.join(stagedApps, entry.name);
    await fs.cp(src, dest, { recursive: true });
  }

  const topicsSrc = path.join(repoRoot, "knowledge", "topics");
  const topicEntries = await fs.readdir(topicsSrc, { withFileTypes: true });
  await fs.mkdir(stagedTopics, { recursive: true });
  for (const entry of topicEntries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name.startsWith("_")) continue;
    await fs.copyFile(
      path.join(topicsSrc, entry.name),
      path.join(stagedTopics, entry.name),
    );
  }
}

async function cleanupStagedAssets(): Promise<void> {
  await fs.rm(stagedApps, { recursive: true, force: true });
  const knowledgeDir = path.join(bundleRoot, "knowledge");
  if (fsSync.existsSync(knowledgeDir)) {
    await fs.rm(knowledgeDir, { recursive: true, force: true });
  }
}

async function runMcpbPack(): Promise<void> {
  const args = ["pack", bundleRoot, path.join(bundleRoot, "dist", "working-from-lenny.mcpb")];

  await new Promise<void>((resolve, reject) => {
    const child = spawn("mcpb", args, {
      cwd: bundleRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(
          new Error(
            "mcpb CLI not found. Install with: npm i -g @anthropic-ai/mcpb",
          ),
        );
        return;
      }
      reject(err);
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`mcpb pack exited with code ${code}`));
    });
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.message ?? err);
  process.exit(1);
});
