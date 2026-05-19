import { spawn } from "node:child_process";
import path from "node:path";

const bundleRoot = path.resolve(__dirname, "..");

/**
 * Wraps the `mcpb` CLI to pack the bundle into a .mcpb ZIP.
 * Run after `pnpm run build` so dist/ exists.
 *
 * Falls back to a helpful message if `mcpb` isn't installed globally —
 * production builds happen in the GitHub Action which uses
 * NimbleBrainInc/mcpb-pack@v1, so local pack is for owner smoke-testing.
 */

async function main(): Promise<void> {
  const args = ["pack", bundleRoot, path.join(bundleRoot, "dist", "working-from-lenny.mcpb")];

  const child = spawn("mcpb", args, {
    cwd: bundleRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("error", (err) => {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.error(
        "mcpb CLI not found. Install with: npm i -g @anthropic-ai/mcpb",
      );
      process.exit(2);
    }
    console.error(err);
    process.exit(1);
  });

  child.on("close", (code) => {
    if (code !== 0) process.exit(code ?? 1);
  });
}

main();
