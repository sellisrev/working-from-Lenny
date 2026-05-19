import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

const bundleRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(bundleRoot, "..");
const stagingRoot = path.join(bundleRoot, "dist", ".mcpb-staging");
const outPath = path.join(bundleRoot, "dist", "working-from-lenny.mcpb");

/**
 * Builds the .mcpb from a clean staging dir to guarantee a self-contained
 * extension. The local bundle/node_modules is pnpm-symlinked into the
 * workspace store and only works in dev because Node walks up to the
 * workspace root for transitive deps (ajv, hono, express, …). Once
 * extracted by the host, the .mcpb has no parent node_modules to walk up
 * to, so the SDK explodes loading its peer deps.
 *
 * Flow:
 *   1. Stage manifest.json + dist/ (build output) + apps/ + knowledge/topics/
 *      into bundle/dist/.mcpb-staging/.
 *   2. Write a sanitized package.json: production deps only, `catalog:`
 *      versions resolved from the installed copies in bundle/node_modules/.
 *   3. Run `npm install --omit=dev --omit=optional` in the staging dir.
 *      npm produces a flat node_modules with all transitive deps present.
 *   4. mcpb pack the staging dir.
 *   5. Clean up the staging dir.
 *
 * Production builds happen in the GitHub Action — local pack is owner
 * smoke-test only.
 */

async function main(): Promise<void> {
  if (!fsSync.existsSync(path.join(bundleRoot, "dist", "server.js"))) {
    throw new Error("dist/server.js missing — run `pnpm run build` first");
  }
  await cleanupStaging();
  try {
    await stageBuildArtifacts();
    await stageRuntimeAssets();
    await writeSanitizedPackageJson();
    await npmInstallProd();
    await runMcpbPack();
  } finally {
    await cleanupStaging();
  }
}

async function stageBuildArtifacts(): Promise<void> {
  await fs.mkdir(stagingRoot, { recursive: true });
  await fs.cp(
    path.join(bundleRoot, "dist", "server.js"),
    path.join(stagingRoot, "dist", "server.js"),
  );
  // Tools live in compiled form under dist/tools/, lib under dist/lib/, shared
  // under dist/shared/. Just copy the whole dist tree minus our own staging
  // dir and any prior .mcpb file.
  const distSrc = path.join(bundleRoot, "dist");
  for (const entry of await fs.readdir(distSrc, { withFileTypes: true })) {
    if (entry.name === ".mcpb-staging") continue;
    if (entry.name.endsWith(".mcpb")) continue;
    if (entry.name === "server.js") continue; // already copied above
    const src = path.join(distSrc, entry.name);
    const dest = path.join(stagingRoot, "dist", entry.name);
    await fs.cp(src, dest, { recursive: true });
  }
  await fs.copyFile(
    path.join(bundleRoot, "manifest.json"),
    path.join(stagingRoot, "manifest.json"),
  );
}

async function stageRuntimeAssets(): Promise<void> {
  const appsSrc = path.join(repoRoot, "apps");
  const appsDest = path.join(stagingRoot, "apps");
  await fs.mkdir(appsDest, { recursive: true });
  for (const entry of await fs.readdir(appsSrc, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_archive")) continue;
    await fs.cp(
      path.join(appsSrc, entry.name),
      path.join(appsDest, entry.name),
      { recursive: true },
    );
  }

  const topicsSrc = path.join(repoRoot, "knowledge", "topics");
  const topicsDest = path.join(stagingRoot, "knowledge", "topics");
  await fs.mkdir(topicsDest, { recursive: true });
  for (const entry of await fs.readdir(topicsSrc, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name.startsWith("_")) continue;
    await fs.copyFile(
      path.join(topicsSrc, entry.name),
      path.join(topicsDest, entry.name),
    );
  }
}

async function writeSanitizedPackageJson(): Promise<void> {
  const raw = await fs.readFile(
    path.join(bundleRoot, "package.json"),
    "utf8",
  );
  const pkg = JSON.parse(raw) as Record<string, unknown>;

  const deps = (pkg.dependencies as Record<string, string> | undefined) ?? {};
  const resolved: Record<string, string> = {};
  for (const [name, spec] of Object.entries(deps)) {
    if (spec.startsWith("catalog:")) {
      const installed = await readInstalledVersion(name);
      resolved[name] = `^${installed}`;
    } else {
      resolved[name] = spec;
    }
  }

  const sanitized = {
    name: pkg.name,
    version: pkg.version,
    private: true,
    description: pkg.description,
    license: pkg.license,
    type: pkg.type,
    main: pkg.main,
    dependencies: resolved,
  };

  await fs.writeFile(
    path.join(stagingRoot, "package.json"),
    JSON.stringify(sanitized, null, 2) + "\n",
    "utf8",
  );
}

async function readInstalledVersion(name: string): Promise<string> {
  const pkgJson = path.join(bundleRoot, "node_modules", name, "package.json");
  const raw = await fs.readFile(pkgJson, "utf8");
  const parsed = JSON.parse(raw) as { version?: string };
  if (!parsed.version) {
    throw new Error(`Cannot resolve catalog: version for ${name} — ${pkgJson} has no version field`);
  }
  return parsed.version;
}

async function npmInstallProd(): Promise<void> {
  await runCmd("npm", [
    "install",
    "--omit=dev",
    "--omit=optional",
    "--no-audit",
    "--no-fund",
    "--no-package-lock",
    "--loglevel=error",
  ]);
}

async function runMcpbPack(): Promise<void> {
  await runCmd("mcpb", ["pack", stagingRoot, outPath]);
}

async function runCmd(cmd: string, args: string[]): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: stagingRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        reject(new Error(`${cmd} not found on PATH`));
        return;
      }
      reject(err);
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited with ${code}`));
    });
  });
}

async function cleanupStaging(): Promise<void> {
  await fs.rm(stagingRoot, { recursive: true, force: true });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err.message ?? err);
  process.exit(1);
});
