import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import { zodToJsonSchema } from "zod-to-json-schema";

import * as questionsTool from "../src/tools/pm-pitfalls/questions";
import * as scoreTool from "../src/tools/pm-pitfalls/score";
import * as narrateTool from "../src/tools/pm-pitfalls/narrate";
import * as driftTool from "../src/tools/pm-pitfalls/drift";
import * as getPendingTool from "../src/tools/pm-pitfalls/get-pending";
import * as horoscopeGetQuiz from "../src/tools/53-pm-horoscope/get-quiz";
import * as horoscopeScoreQuiz from "../src/tools/53-pm-horoscope/score-quiz";
import * as horoscopeRead from "../src/tools/53-pm-horoscope/read";
import * as horoscopeNarrate from "../src/tools/53-pm-horoscope/narrate";
import * as horoscopeGetPending from "../src/tools/53-pm-horoscope/get-pending";
import {
  ARCHETYPES,
  ARCHETYPE_CONTENT,
  QUIZ_QUESTIONS,
  composeReading,
  scoreQuiz,
} from "../src/tools/53-pm-horoscope/data";
import { loadPrompt } from "../src/lib/prompt-loader";
import { loadCorpusChunks } from "../src/lib/corpus";
import { dataDir } from "../src/lib/paths";

interface CaseResult {
  name: string;
  pass: boolean;
  detail?: string;
}

const results: CaseResult[] = [];
const bundleRoot = path.resolve(__dirname, "..");

async function main(): Promise<void> {
  // Network guard: anything that calls fetch during validate is a regression.
  const getFetchCalls = installFetchGuard();

  // Sandbox the data dir so drift cases write into a temp dir, not the
  // user's real ~/.working-from-lenny.
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), "wfl-validate-"));
  process.env.WFL_DATA_DIR = tmp;

  await checkManifest();
  await checkSchemas();
  await checkScoreGoldens();
  await checkDriftGoldens();
  await checkHoroscopeData();
  await checkUiBuild();
  await checkInstalledLayout();
  await checkDataDirResolution();

  const fetchCalls = getFetchCalls();
  record(
    "no-network",
    fetchCalls.length === 0,
    fetchCalls.length === 0 ? undefined : fetchCalls.join(", "),
  );

  await fs.rm(tmp, { recursive: true, force: true });

  const failed = results.filter((r) => !r.pass);
  // eslint-disable-next-line no-console
  console.log(`\nvalidate: ${results.length - failed.length}/${results.length} passed`);
  for (const r of results) {
    const mark = r.pass ? "PASS" : "FAIL";
    // eslint-disable-next-line no-console
    console.log(`  [${mark}] ${r.name}${r.detail ? ": " + r.detail : ""}`);
  }
  if (failed.length > 0) process.exit(1);
}

function record(name: string, pass: boolean, detail?: string): void {
  results.push({ name, pass, detail });
}

async function checkManifest(): Promise<void> {
  try {
    const raw = await fs.readFile(
      path.join(bundleRoot, "manifest.json"),
      "utf8",
    );
    const m = JSON.parse(raw) as Record<string, unknown>;
    const required = [
      "manifest_version",
      "name",
      "version",
      "description",
      "author",
      "server",
      "tools",
    ];
    const missing = required.filter((k) => !(k in m));
    if (missing.length > 0) {
      record("manifest required fields", false, `missing: ${missing.join(", ")}`);
      return;
    }
    if (m.manifest_version !== "0.2") {
      record(
        "manifest_version is 0.2",
        false,
        `got ${String(m.manifest_version)}`,
      );
      return;
    }
    record("manifest required fields", true);
  } catch (err) {
    record("manifest parses", false, (err as Error).message);
  }
}

async function checkSchemas(): Promise<void> {
  const tools = [
    questionsTool,
    scoreTool,
    narrateTool,
    driftTool,
    getPendingTool,
    horoscopeGetQuiz,
    horoscopeScoreQuiz,
    horoscopeRead,
    horoscopeNarrate,
    horoscopeGetPending,
  ];
  for (const t of tools) {
    try {
      const inJson = zodToJsonSchema(t.meta.inputSchema as never, {
        $refStrategy: "none",
      });
      if (typeof inJson !== "object" || inJson == null) {
        record(`${t.meta.name} inputSchema round-trip`, false, "non-object");
        continue;
      }
      if (t.meta.outputSchema) {
        zodToJsonSchema(t.meta.outputSchema as never, { $refStrategy: "none" });
      }
      record(`${t.meta.name} schema round-trip`, true);
    } catch (err) {
      record(
        `${t.meta.name} schema round-trip`,
        false,
        (err as Error).message,
      );
    }
  }
}

async function checkScoreGoldens(): Promise<void> {
  const raw = await fs.readFile(
    path.join(bundleRoot, "test", "golden", "pm-pitfalls.json"),
    "utf8",
  );
  const fixtures = JSON.parse(raw) as {
    score_cases: Array<{
      name: string;
      input: { answers: ("always" | "sometimes" | "never")[] };
      expect: {
        score_display: number;
        all_never: boolean;
        top_three_pitfall_ids?: number[];
        top_three_pitfall_ids_subset_of?: number[];
      };
    }>;
  };

  for (const c of fixtures.score_cases) {
    try {
      const result = await scoreTool.invoke({ ...c.input, user_context: "" });
      const parsed = scoreTool.meta.outputSchema!.parse(result) as {
        score_display: number;
        top_three_pitfall_ids: number[];
        exemplar_quotes: string[];
        all_never: boolean;
      };

      const checks: string[] = [];
      if (parsed.score_display !== c.expect.score_display) {
        checks.push(
          `score_display: got ${parsed.score_display}, want ${c.expect.score_display}`,
        );
      }
      if (parsed.all_never !== c.expect.all_never) {
        checks.push(
          `all_never: got ${parsed.all_never}, want ${c.expect.all_never}`,
        );
      }
      if (c.expect.top_three_pitfall_ids) {
        const got = JSON.stringify(parsed.top_three_pitfall_ids);
        const want = JSON.stringify(c.expect.top_three_pitfall_ids);
        if (got !== want) checks.push(`top_three: got ${got}, want ${want}`);
      }
      if (c.expect.top_three_pitfall_ids_subset_of) {
        const allowed = new Set(c.expect.top_three_pitfall_ids_subset_of);
        const offending = parsed.top_three_pitfall_ids.filter(
          (id) => !allowed.has(id),
        );
        if (offending.length > 0) {
          checks.push(`top_three out of allowed set: ${offending.join(",")}`);
        }
      }
      if (parsed.exemplar_quotes.length !== 3) {
        checks.push(`exemplar_quotes length: ${parsed.exemplar_quotes.length}`);
      }

      record(
        `score:${c.name}`,
        checks.length === 0,
        checks.join(" | ") || undefined,
      );
    } catch (err) {
      record(`score:${c.name}`, false, (err as Error).message);
    }
  }
}

async function checkDriftGoldens(): Promise<void> {
  const raw = await fs.readFile(
    path.join(bundleRoot, "test", "golden", "pm-pitfalls.json"),
    "utf8",
  );
  const fixtures = JSON.parse(raw) as {
    drift_cases: Array<{
      name: string;
      user_id: string;
      current_audit: {
        answers: ("always" | "sometimes" | "never")[];
        score_display: number;
      };
      expect: Record<string, unknown>;
    }>;
  };

  for (const c of fixtures.drift_cases) {
    try {
      const result = (await driftTool.invoke({
        user_id: c.user_id,
        current_audit: c.current_audit,
      } as never)) as Record<string, unknown>;
      driftTool.meta.outputSchema!.parse(result);

      const checks: string[] = [];
      for (const [k, want] of Object.entries(c.expect)) {
        if (result[k] !== want) {
          checks.push(`${k}: got ${JSON.stringify(result[k])}, want ${JSON.stringify(want)}`);
        }
      }
      record(
        `drift:${c.name}`,
        checks.length === 0,
        checks.join(" | ") || undefined,
      );
    } catch (err) {
      record(`drift:${c.name}`, false, (err as Error).message);
    }
  }
}

async function checkUiBuild(): Promise<void> {
  for (const slug of ["pitfalls", "horoscope"]) {
    const distHtml = path.join(bundleRoot, "dist", "ui", `${slug}.html`);
    if (!fsSync.existsSync(distHtml)) {
      record(
        `ui built: ${slug}`,
        false,
        `dist/ui/${slug}.html missing - run pnpm run build first`,
      );
      continue;
    }
    const body = await fs.readFile(distHtml, "utf8");
    if (body.includes("<!-- include:")) {
      record(
        `ui includes inlined: ${slug}`,
        false,
        "raw include directive still present",
      );
      continue;
    }
    if (!body.includes("window.mcp")) {
      record(
        `ui mcp helper present: ${slug}`,
        false,
        "mcp-rpc.js was not inlined",
      );
      continue;
    }
    record(`ui inlined: ${slug}`, true);
  }
}

/**
 * Confirms the deterministic engine + quiz data load correctly and that
 * `composeReading()` produces stable output across all 12 archetypes for a
 * fixed date. Catches the regression class where the bundled JSON drifts
 * from horoscope-data.json (typo'd slug, lost an aspect entry, etc).
 */
async function checkHoroscopeData(): Promise<void> {
  // Shape: 12 archetypes, each with 30 predictions, 20 nudges, 11 aspects, 5 topics.
  let shapeOk = ARCHETYPES.length === 12;
  for (const a of ARCHETYPES) {
    const c = ARCHETYPE_CONTENT[a.id];
    if (
      !c ||
      c.predictions.length !== 30 ||
      c.nudges.length !== 20 ||
      Object.keys(c.aspects).length !== 11 ||
      c.topics.length !== 5
    ) {
      shapeOk = false;
      break;
    }
  }
  record(
    "horoscope: 12 archetypes × {30 preds, 20 nudges, 11 aspects, 5 topics}",
    shapeOk,
  );

  // Each archetype's aspects keys cover every other archetype id (i.e. 11 of
  // the 12 ids, excluding self).
  let aspectsCoverageOk = true;
  for (const a of ARCHETYPES) {
    const c = ARCHETYPE_CONTENT[a.id]!;
    const keys = Object.keys(c.aspects)
      .map(Number)
      .sort((x, y) => x - y);
    const expected = ARCHETYPES.map((x) => x.id)
      .filter((id) => id !== a.id)
      .sort((x, y) => x - y);
    if (JSON.stringify(keys) !== JSON.stringify(expected)) {
      aspectsCoverageOk = false;
      break;
    }
  }
  record(
    "horoscope: each archetype's aspects cover all other 11 archetypes",
    aspectsCoverageOk,
  );

  // composeReading: deterministic for a fixed (archetype, date) pair.
  const r1 = composeReading(1, "2026-05-22");
  const r2 = composeReading(1, "2026-05-22");
  record(
    "horoscope: composeReading is deterministic",
    JSON.stringify(r1) === JSON.stringify(r2),
  );
  record(
    "horoscope: composeReading(1, 2026-05-22) has all four slots populated",
    typeof r1.aspect === "string" &&
      typeof r1.prediction === "string" &&
      typeof r1.nudge === "string" &&
      typeof r1.topic === "string" &&
      r1.aspect.length > 0 &&
      r1.prediction.length > 0 &&
      r1.nudge.length > 0 &&
      r1.topic.length > 0,
  );

  // composeReading: across a full year the engine should cycle through most
  // of the 11 possible aspect partners. djb2 is not a uniform hash, so we
  // don't demand perfect coverage — at least 9/11 over 365 days proves the
  // engine varies rather than locking to a single partner.
  const aspects = new Set<number>();
  const start = new Date("2026-01-01T00:00:00Z");
  for (let i = 0; i < 365; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    aspects.add(composeReading(1, iso).aspect_partner_id);
  }
  record(
    "horoscope: composeReading covers ≥9 of 11 aspect partners over a year",
    aspects.size >= 9,
    `distinct partners across 2026: ${aspects.size}`,
  );

  // Quiz shape.
  record(
    "horoscope: quiz has 6 questions",
    QUIZ_QUESTIONS.length === 6,
  );

  // Quiz scoring: every uniform-pick produces *some* archetype (not a crash).
  for (let optIdx = 0; optIdx < 4; optIdx++) {
    try {
      const result = scoreQuiz([optIdx, optIdx, optIdx, optIdx, optIdx, optIdx]);
      const ok = result.archetype_id >= 1 && result.archetype_id <= 12;
      record(
        `horoscope: scoreQuiz uniform-pick option ${optIdx} produces valid archetype`,
        ok,
        ok ? undefined : JSON.stringify(result),
      );
    } catch (err) {
      record(
        `horoscope: scoreQuiz uniform-pick option ${optIdx}`,
        false,
        (err as Error).message,
      );
    }
  }
}

/**
 * Simulates an installed-.mcpb layout: a fresh root containing only the
 * bundled apps/ and knowledge/topics/ slices. Confirms loadPrompt and
 * loadCorpusChunks resolve against the bundled copies (NOT the repo-root
 * fallback) and return non-empty content. Catches the regression class where
 * pack.ts stages nothing and the installed bundle throws ENOENT on first
 * narrate call.
 */
async function checkInstalledLayout(): Promise<void> {
  const installRoot = await fs.mkdtemp(
    path.join(os.tmpdir(), "wfl-installed-"),
  );
  const repoRoot = path.resolve(bundleRoot, "..");
  const originalBundleRoot = process.env.WFL_BUNDLE_ROOT;

  try {
    const appsDest = path.join(installRoot, "apps", "44-pm-pitfalls");
    await fs.mkdir(appsDest, { recursive: true });
    await fs.copyFile(
      path.join(repoRoot, "apps", "44-pm-pitfalls", "prompt.md"),
      path.join(appsDest, "prompt.md"),
    );

    const topicsDest = path.join(installRoot, "knowledge", "topics");
    await fs.mkdir(topicsDest, { recursive: true });
    for (const slug of ["pm-pitfalls", "ai-pm-skills"]) {
      await fs.copyFile(
        path.join(repoRoot, "knowledge", "topics", `${slug}.md`),
        path.join(topicsDest, `${slug}.md`),
      );
    }

    process.env.WFL_BUNDLE_ROOT = installRoot;

    const prompt = await loadPrompt("44");
    if (!prompt || prompt.length < 100) {
      record(
        "installed layout: loadPrompt(44)",
        false,
        `got ${prompt?.length ?? 0} chars`,
      );
    } else {
      record("installed layout: loadPrompt(44)", true);
    }

    const corpus = await loadCorpusChunks(["pm-pitfalls", "ai-pm-skills"]);
    const missing = Object.entries(corpus)
      .filter(([, body]) => !body || body.length === 0)
      .map(([slug]) => slug);
    if (missing.length > 0) {
      record(
        "installed layout: loadCorpusChunks",
        false,
        `empty: ${missing.join(", ")}`,
      );
    } else {
      record("installed layout: loadCorpusChunks", true);
    }
  } catch (err) {
    record("installed layout", false, (err as Error).message);
  } finally {
    if (originalBundleRoot === undefined) {
      delete process.env.WFL_BUNDLE_ROOT;
    } else {
      process.env.WFL_BUNDLE_ROOT = originalBundleRoot;
    }
    await fs.rm(installRoot, { recursive: true, force: true });
  }
}

/**
 * Regression guard for the 0.1.6/0.1.7 ship-bug where manifest.json referenced
 * the non-existent `${user_config_dir}` template variable. Desktop passed the
 * literal string through, the server tried to mkdir
 * `C:\WINDOWS\System32\${user_config_dir}` and failed with EPERM. Three
 * properties must hold:
 *   1. With WFL_DATA_DIR unset, dataDir() returns a platform-conventional path
 *      (under APPDATA on Windows, ~/Library/Application Support on macOS,
 *      XDG_DATA_HOME on Linux) — NOT a literal-string-with-`${...}` and NOT
 *      relative.
 *   2. With WFL_DATA_DIR containing an unexpanded `${...}`, dataDir() falls
 *      back to the platform default rather than honoring the bad value.
 *   3. With WFL_DATA_DIR set to a real absolute path, dataDir() honors it.
 */
async function checkDataDirResolution(): Promise<void> {
  const original = process.env.WFL_DATA_DIR;
  try {
    delete process.env.WFL_DATA_DIR;
    const unsetPath = dataDir();
    const unsetOk =
      typeof unsetPath === "string" &&
      unsetPath.length > 0 &&
      !unsetPath.includes("${") &&
      path.isAbsolute(unsetPath) &&
      unsetPath.endsWith("working-from-lenny");
    record(
      "dataDir(): unset env → platform-conventional absolute path",
      unsetOk,
      unsetOk ? undefined : `got ${unsetPath}`,
    );

    process.env.WFL_DATA_DIR = "${user_config_dir}/working-from-lenny";
    const templatePath = dataDir();
    const templateOk =
      !templatePath.includes("${") && path.isAbsolute(templatePath);
    record(
      "dataDir(): literal ${...} env ignored, falls back to platform default",
      templateOk,
      templateOk ? undefined : `got ${templatePath}`,
    );

    const realPath = path.join(os.tmpdir(), "wfl-validate-override");
    process.env.WFL_DATA_DIR = realPath;
    const honoredPath = dataDir();
    record(
      "dataDir(): real WFL_DATA_DIR override is honored",
      honoredPath === realPath,
      honoredPath === realPath ? undefined : `got ${honoredPath}`,
    );
  } finally {
    if (original === undefined) {
      delete process.env.WFL_DATA_DIR;
    } else {
      process.env.WFL_DATA_DIR = original;
    }
  }
}

function installFetchGuard(): () => string[] {
  const original = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = ((...args: Parameters<typeof fetch>) => {
    calls.push(`unexpected fetch: ${String(args[0])}`);
    return original(...args);
  }) as typeof fetch;
  return () => calls;
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
