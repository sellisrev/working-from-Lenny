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
import * as ladderGetQuestions from "../src/tools/3-pm-ladder/get-questions";
import * as ladderScore from "../src/tools/3-pm-ladder/score";
import * as ladderNarrate from "../src/tools/3-pm-ladder/narrate";
import * as ladderGetPending from "../src/tools/3-pm-ladder/get-pending";
import * as ladderCalibrate from "../src/tools/3-pm-ladder/calibrate";
import {
  DIMENSIONS as LADDER_DIMENSIONS,
  QUESTIONS as LADDER_QUESTIONS,
  scoreAssessment,
  median,
} from "../src/tools/3-pm-ladder/data";
import * as pmifyGetModes from "../src/tools/51-pmify-inbox/get-modes";
import * as pmifyTranslate from "../src/tools/51-pmify-inbox/translate";
import * as pmifyNarrate from "../src/tools/51-pmify-inbox/narrate";
import * as pmifyGetPending from "../src/tools/51-pmify-inbox/get-pending";
import {
  MODES as PMIFY_MODES,
  PATTERN_POOL as PMIFY_PATTERN_POOL,
} from "../src/tools/51-pmify-inbox/data";
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
  await checkLadderData();
  await checkPmifyData();
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
    ladderGetQuestions,
    ladderScore,
    ladderNarrate,
    ladderGetPending,
    ladderCalibrate,
    pmifyGetModes,
    pmifyTranslate,
    pmifyNarrate,
    pmifyGetPending,
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
  for (const slug of ["pitfalls", "horoscope", "ladder", "pmify"]) {
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
 * #3 PM Ladder shape + scoring engine guards. Confirms the 30 questions are
 * distributed 6-per-dimension, that scoreAssessment computes per-dimension
 * medians correctly, and that the widest-gap selection picks the lowest
 * dimension. Catches the regression class where ladder-data.json drifts
 * (renamed slug, lost a question, wrong dimension tag).
 */
async function checkLadderData(): Promise<void> {
  // 5 dimensions, 30 questions, six per dimension.
  const shape =
    LADDER_DIMENSIONS.length === 5 && LADDER_QUESTIONS.length === 30;
  record("ladder: 5 dimensions, 30 questions", shape);

  const byDim: Record<string, number> = {};
  for (const q of LADDER_QUESTIONS) {
    byDim[q.dimension] = (byDim[q.dimension] ?? 0) + 1;
  }
  const perDimOk = LADDER_DIMENSIONS.every((d) => byDim[d.slug] === 6);
  record(
    "ladder: 6 questions per dimension",
    perDimOk,
    perDimOk ? undefined : JSON.stringify(byDim),
  );

  const idsOk = LADDER_QUESTIONS.every((q, i) => q.id === i + 1);
  record(
    "ladder: question IDs are 1-30 in order",
    idsOk,
  );

  const optionsOk = LADDER_QUESTIONS.every(
    (q) => Array.isArray(q.options) && q.options.length === 5,
  );
  record("ladder: every question has 5 option choices", optionsOk);

  // median helper sanity (the prompt.md formula relies on it).
  const m1 = median([1, 2, 3, 4, 5]);
  const m2 = median([2, 2, 3, 3, 4, 4]);
  record(
    "ladder: median([1..5]) === 3 and median(six values) yields .5 midpoint",
    m1 === 3 && m2 === 3,
    `m1=${m1} m2=${m2}`,
  );

  // Scoring goldens.
  // All-1 answers → all dimensions = 1 → effective = 1, target = 2, widest gap on first dim.
  const allOnes = scoreAssessment(new Array(30).fill(1));
  const allOnesOk =
    allOnes.dimension_levels.scope === 1 &&
    allOnes.dimension_levels.craft === 1 &&
    allOnes.effective_level === 1 &&
    allOnes.target_level === 2 &&
    allOnes.widest_gap_dimension === "scope";
  record(
    "ladder: scoreAssessment([1×30]) → all-1 levels, effective=1, target=2",
    allOnesOk,
    allOnesOk ? undefined : JSON.stringify(allOnes),
  );

  // All-5 answers → all dimensions = 5 → effective = 5, target = 5, gap = 0.
  const allFives = scoreAssessment(new Array(30).fill(5));
  const allFivesOk =
    allFives.effective_level === 5 &&
    allFives.target_level === 5 &&
    allFives.widest_gap_size === 0;
  record(
    "ladder: scoreAssessment([5×30]) → effective=5, target=5, no gap",
    allFivesOk,
    allFivesOk ? undefined : JSON.stringify(allFives),
  );

  // Six 3s per dimension → each dimension = 3, effective = 3, target = 4.
  const allThrees = scoreAssessment(new Array(30).fill(3));
  const allThreesOk =
    allThrees.effective_level === 3 && allThrees.target_level === 4;
  record(
    "ladder: scoreAssessment([3×30]) → effective=3, target=4",
    allThreesOk,
    allThreesOk ? undefined : JSON.stringify(allThrees),
  );

  // Mixed: scope dimension lowest (all 1s), other dims at 4 → widest gap = scope.
  const mixed = new Array(30).fill(4);
  for (let i = 0; i < 6; i++) mixed[i] = 1; // scope is Q1-Q6
  const mixedScored = scoreAssessment(mixed);
  const mixedOk =
    mixedScored.dimension_levels.scope === 1 &&
    mixedScored.dimension_levels.ambiguity === 4 &&
    mixedScored.widest_gap_dimension === "scope";
  record(
    "ladder: widest-gap selection picks the dimension with the largest target-gap",
    mixedOk,
    mixedOk ? undefined : JSON.stringify(mixedScored),
  );

  // Invalid input: wrong length should throw.
  let threwOnShort = false;
  try {
    scoreAssessment(new Array(29).fill(3));
  } catch {
    threwOnShort = true;
  }
  record("ladder: scoreAssessment rejects wrong-length input", threwOnShort);

  // Invalid input: out-of-range level should throw.
  let threwOnOutOfRange = false;
  try {
    const bad = new Array(30).fill(3);
    bad[0] = 7;
    scoreAssessment(bad);
  } catch {
    threwOnOutOfRange = true;
  }
  record(
    "ladder: scoreAssessment rejects out-of-range level (>5)",
    threwOnOutOfRange,
  );
}

/**
 * #51 PM-ify Inbox shape guards. Confirms two modes, pattern pool size + the
 * three resolved corpus anchors, that translate validates input (text length
 * cap), and that get_modes returns the expected payload.
 */
async function checkPmifyData(): Promise<void> {
  record(
    "pmify: 2 modes defined (pm-ify, de-pm-ify)",
    PMIFY_MODES.length === 2 &&
      PMIFY_MODES[0]!.slug === "pm-ify" &&
      PMIFY_MODES[1]!.slug === "de-pm-ify",
  );
  record(
    "pmify: 3 pattern pool anchors (process-vs-outcomes deferred per anchor_substitutions)",
    PMIFY_PATTERN_POOL.length === 3 &&
      PMIFY_PATTERN_POOL.includes("pm-pitfalls") &&
      PMIFY_PATTERN_POOL.includes("spotting-bad-pm-behaviors") &&
      PMIFY_PATTERN_POOL.includes("saying-no"),
  );

  // get_modes returns modes + patterns + note. Schema parse round-trip already
  // validated in checkSchemas; this confirms the actual handler output shape.
  try {
    const result = (await pmifyGetModes.invoke({} as never)) as {
      modes: Array<{ slug: string }>;
      patterns: string[];
      note: string;
    };
    const ok =
      Array.isArray(result.modes) &&
      result.modes.length === 2 &&
      Array.isArray(result.patterns) &&
      result.patterns.length === 3;
    record(
      "pmify: get_modes returns 2 modes + 3 patterns + note",
      ok,
      ok ? undefined : JSON.stringify(result).slice(0, 200),
    );
  } catch (err) {
    record("pmify: get_modes call", false, (err as Error).message);
  }

  // translate's input schema enforces 1..2000 char text + closed mode enum.
  // Server boundary parses against the schema before invoke runs, so the
  // protection lives in zod — exercise the schema directly here.
  const tooLong = pmifyTranslate.meta.inputSchema.safeParse({
    mode: "pm-ify",
    text: "x".repeat(2001),
  });
  record(
    "pmify: translate inputSchema rejects text > 2000 chars",
    !tooLong.success,
  );

  const empty = pmifyTranslate.meta.inputSchema.safeParse({
    mode: "pm-ify",
    text: "",
  });
  record(
    "pmify: translate inputSchema rejects empty text",
    !empty.success,
  );

  const badMode = pmifyTranslate.meta.inputSchema.safeParse({
    mode: "invalid-mode",
    text: "hi",
  });
  record(
    "pmify: translate inputSchema rejects unknown mode",
    !badMode.success,
  );

  // Happy path: well-formed input parses + invoke runs end-to-end.
  try {
    const okResult = (await pmifyTranslate.invoke({
      mode: "de-pm-ify",
      text: "Per our earlier sync, I'm going to push back on this ask.",
      user_context: "",
    } as never)) as { mode: string; text: string; persistence_warning?: string };
    const okOk =
      okResult.mode === "de-pm-ify" &&
      typeof okResult.text === "string" &&
      okResult.persistence_warning === undefined;
    record(
      "pmify: translate happy path returns valid result + persists brief",
      okOk,
      okOk ? undefined : JSON.stringify(okResult).slice(0, 200),
    );
  } catch (err) {
    record("pmify: translate happy path", false, (err as Error).message);
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
