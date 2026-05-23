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
import * as hybGetModes from "../src/tools/52-how-you-build/get-modes";
import * as hybGenerate from "../src/tools/52-how-you-build/generate";
import * as hybNarrate from "../src/tools/52-how-you-build/narrate";
import * as hybGetPending from "../src/tools/52-how-you-build/get-pending";
import {
  MODES as HYB_MODES,
  FIELDS as HYB_FIELDS,
  assembleInputBlock as hybAssembleInputBlock,
} from "../src/tools/52-how-you-build/data";
import * as founderGetForm from "../src/tools/12-38-founder-pm-hire/get-form";
import * as founderDecide from "../src/tools/12-38-founder-pm-hire/decide";
import * as founderNarrate from "../src/tools/12-38-founder-pm-hire/narrate";
import * as founderGetPending from "../src/tools/12-38-founder-pm-hire/get-pending";
import { decide as founderDecideFn } from "../src/tools/12-38-founder-pm-hire/data";
import * as strategyGetForm from "../src/tools/2-strategy-pressure-test/get-form";
import * as strategyTest from "../src/tools/2-strategy-pressure-test/pressure-test";
import * as strategyNarrate from "../src/tools/2-strategy-pressure-test/narrate";
import * as strategyGetPending from "../src/tools/2-strategy-pressure-test/get-pending";
import { classifyDocType as strategyClassify } from "../src/tools/2-strategy-pressure-test/data";
import * as evalGetForm from "../src/tools/6-ai-eval-coverage/get-form";
import * as evalScore from "../src/tools/6-ai-eval-coverage/score-coverage";
import * as evalNarrate from "../src/tools/6-ai-eval-coverage/narrate";
import * as evalGetPending from "../src/tools/6-ai-eval-coverage/get-pending";
import { CATEGORIES as EVAL_CATEGORIES } from "../src/tools/6-ai-eval-coverage/data";
import * as nsmGetForm from "../src/tools/9-nsm-finder/get-form";
import * as nsmRun from "../src/tools/9-nsm-finder/run";
import * as nsmNarrate from "../src/tools/9-nsm-finder/narrate";
import * as nsmGetPending from "../src/tools/9-nsm-finder/get-pending";
import {
  FIELDS as NSM_FIELDS,
  NSM_FAMILIES,
  resolveNsmFamily,
  parseDashboardLines,
} from "../src/tools/9-nsm-finder/data";
import * as okrGetForm from "../src/tools/24-okr-critique/get-form";
import * as okrRun from "../src/tools/24-okr-critique/run";
import * as okrNarrate from "../src/tools/24-okr-critique/narrate";
import * as okrGetPending from "../src/tools/24-okr-critique/get-pending";
import { parseOkrs, tooManyOverall, TOO_MANY } from "../src/tools/24-okr-critique/data";
import * as mvsGetForm from "../src/tools/47-mission-vision-alignment/get-form";
import * as mvsRun from "../src/tools/47-mission-vision-alignment/run";
import * as mvsNarrate from "../src/tools/47-mission-vision-alignment/narrate";
import * as mvsGetPending from "../src/tools/47-mission-vision-alignment/get-pending";
import { isStrategyTooVague } from "../src/tools/47-mission-vision-alignment/data";
import * as activationGetForm from "../src/tools/37-activation-metric-finder/get-form";
import * as activationRun from "../src/tools/37-activation-metric-finder/run";
import * as activationNarrate from "../src/tools/37-activation-metric-finder/narrate";
import * as activationGetPending from "../src/tools/37-activation-metric-finder/get-pending";
import {
  ACTIVATION_FAMILIES,
  FIELDS as ACTIVATION_FIELDS,
  isAiProductFlagged,
  resolveActivationFamily,
} from "../src/tools/37-activation-metric-finder/data";
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
  await checkHowYouBuildData();
  await checkFounderData();
  await checkStrategyData();
  await checkEvalData();
  await checkNsmData();
  await checkOkrData();
  await checkMvsData();
  await checkActivationData();
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
    hybGetModes,
    hybGenerate,
    hybNarrate,
    hybGetPending,
    founderGetForm,
    founderDecide,
    founderNarrate,
    founderGetPending,
    strategyGetForm,
    strategyTest,
    strategyNarrate,
    strategyGetPending,
    evalGetForm,
    evalScore,
    evalNarrate,
    evalGetPending,
    nsmGetForm,
    nsmRun,
    nsmNarrate,
    nsmGetPending,
    okrGetForm,
    okrRun,
    okrNarrate,
    okrGetPending,
    mvsGetForm,
    mvsRun,
    mvsNarrate,
    mvsGetPending,
    activationGetForm,
    activationRun,
    activationNarrate,
    activationGetPending,
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
  for (const slug of [
    "pitfalls",
    "horoscope",
    "ladder",
    "pmify",
    "how-you-build",
    "founder-pm-hire",
    "strategy-pressure-test",
    "ai-eval-coverage",
    "nsm-finder",
    "okr-critique",
    "mvs-alignment",
    "activation-finder",
  ]) {
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
 * #52 How [You] Build Product shape guards. Three modes, six structured input
 * fields (3 int + 3 text), schema-level input validation, [INPUT] block
 * assembly matches the prompt.md format, and the happy-path generate runs
 * end-to-end.
 */
async function checkHowYouBuildData(): Promise<void> {
  const shapeOk =
    HYB_MODES.length === 3 &&
    HYB_MODES.map((m) => m.slug).join(",") ===
      "reverence-profile,linkedin-humblebrag,acquired-cold-open";
  record("how-you-build: 3 modes (reverence-profile, linkedin-humblebrag, acquired-cold-open)", shapeOk);

  const fieldsOk =
    HYB_FIELDS.length === 6 &&
    HYB_FIELDS.filter((f) => f.kind === "int").length === 3 &&
    HYB_FIELDS.filter((f) => f.kind === "text").length === 3;
  record("how-you-build: 6 structured input fields (3 int + 3 text)", fieldsOk);

  // [INPUT] block assembly must match the prompt.md template line-for-line.
  const expectedBlock = [
    "Team composition: 3 PMs, 9 engineers, 2 designers",
    "Tools used: Notion, Linear, Slack",
    "Rituals: Mon/Wed/Fri standups, pinned roadmap, Friday demos",
    "Last shipped: the new onboarding flow last quarter",
  ].join("\n");
  const actualBlock = hybAssembleInputBlock({
    pm_count: 3,
    eng_count: 9,
    des_count: 2,
    tools: "Notion, Linear, Slack",
    rituals: "Mon/Wed/Fri standups, pinned roadmap, Friday demos",
    last_shipped: "the new onboarding flow last quarter",
  });
  record(
    "how-you-build: assembleInputBlock matches prompt.md template line-for-line",
    actualBlock === expectedBlock,
    actualBlock === expectedBlock
      ? undefined
      : `got:\n${actualBlock}\nwant:\n${expectedBlock}`,
  );

  // Schema rejects missing fields.
  const missingField = hybGenerate.meta.inputSchema.safeParse({
    mode: "reverence-profile",
    team: {
      pm_count: 3,
      eng_count: 9,
      des_count: 2,
      tools: "Notion, Linear, Slack",
      rituals: "Mon/Wed/Fri standups, pinned roadmap, Friday demos",
      // last_shipped missing
    },
  });
  record(
    "how-you-build: generate inputSchema rejects missing required team field",
    !missingField.success,
  );

  const badMode = hybGenerate.meta.inputSchema.safeParse({
    mode: "invalid-mode",
    team: {
      pm_count: 3,
      eng_count: 9,
      des_count: 2,
      tools: "Notion",
      rituals: "standups",
      last_shipped: "the onboarding flow",
    },
  });
  record(
    "how-you-build: generate inputSchema rejects unknown mode",
    !badMode.success,
  );

  const negativeCount = hybGenerate.meta.inputSchema.safeParse({
    mode: "reverence-profile",
    team: {
      pm_count: -1,
      eng_count: 9,
      des_count: 2,
      tools: "Notion",
      rituals: "standups",
      last_shipped: "the onboarding flow",
    },
  });
  record(
    "how-you-build: generate inputSchema rejects negative count",
    !negativeCount.success,
  );

  // Happy path: well-formed input runs through generate end-to-end.
  try {
    const okResult = (await hybGenerate.invoke({
      mode: "acquired-cold-open",
      team: {
        pm_count: 3,
        eng_count: 9,
        des_count: 2,
        tools: "Notion, Linear, Slack",
        rituals: "Mon/Wed/Fri standups, pinned roadmap, Friday demos",
        last_shipped: "the new onboarding flow last quarter",
      },
      user_context: "",
    } as never)) as {
      mode: string;
      team: { pm_count: number };
      persistence_warning?: string;
    };
    const okOk =
      okResult.mode === "acquired-cold-open" &&
      okResult.team.pm_count === 3 &&
      okResult.persistence_warning === undefined;
    record(
      "how-you-build: generate happy path returns valid result + persists brief",
      okOk,
      okOk ? undefined : JSON.stringify(okResult).slice(0, 200),
    );
  } catch (err) {
    record("how-you-build: generate happy path", false, (err as Error).message);
  }
}

/**
 * #12-38 Founder PM hire decision-tree goldens.
 */
async function checkFounderData(): Promise<void> {
  // Pre-seed always → not-yet, pre-seed-founder-owns-product playbook.
  const preSeed = founderDecideFn({
    stage: "pre-seed",
    team_size: 4,
    pm_today: "the-founder",
    founder_time: "full-time",
    enjoyment: "enjoy",
    ceo_bandwidth: "room-to-add-product",
    product_density: "moderate",
    bottleneck: "no-time-for-strategy",
  });
  record(
    "founder: pre-seed → not-yet + pre-seed-founder-owns-product",
    preSeed.verdict === "not-yet" && preSeed.playbook === "pre-seed-founder-owns-product",
    JSON.stringify(preSeed),
  );

  // Seed + tiny team → not-yet seed-early-team.
  const seedSmall = founderDecideFn({
    stage: "seed",
    team_size: 3,
    pm_today: "the-founder",
    founder_time: "full-time",
    enjoyment: "enjoy",
    ceo_bandwidth: "room-to-add-product",
    product_density: "moderate",
    bottleneck: "no-time-for-strategy",
  });
  record(
    "founder: seed + team<5 → not-yet + seed-early-team",
    seedSmall.verdict === "not-yet" && seedSmall.playbook === "seed-early-team",
    JSON.stringify(seedSmall),
  );

  // Stay-founder-mode trigger: full-time + enjoy + non-heavy + bandwidth ok.
  const stay = founderDecideFn({
    stage: "seed",
    team_size: 15,
    pm_today: "the-founder",
    founder_time: "full-time",
    enjoyment: "enjoy",
    ceo_bandwidth: "room-to-add-product",
    product_density: "moderate",
    bottleneck: "engineering-builds-wrong-thing",
  });
  record(
    "founder: full-time+enjoy+moderate-density → stay-founder-mode",
    stay.verdict === "stay-founder-mode",
    JSON.stringify(stay),
  );

  // Head of product: heavy density + series-a + overstretched CEO.
  const hop = founderDecideFn({
    stage: "series-a",
    team_size: 25,
    pm_today: "ceo-and-head-eng",
    founder_time: "most-of-the-time",
    enjoyment: "tolerate",
    ceo_bandwidth: "overstretched",
    product_density: "heavy",
    bottleneck: "no-time-for-strategy",
  });
  record(
    "founder: heavy density + series-a + overstretched → hire-head-of-product",
    hop.verdict === "hire-head-of-product",
    JSON.stringify(hop),
  );

  // Empowered PM: moderate density + tolerate.
  const empowered = founderDecideFn({
    stage: "seed",
    team_size: 10,
    pm_today: "doubling-up-engineer",
    founder_time: "full-time",
    enjoyment: "tolerate",
    ceo_bandwidth: "stretched-but-functioning",
    product_density: "moderate",
    bottleneck: "engineering-builds-wrong-thing",
  });
  record(
    "founder: moderate density + full-time + tolerate → hire-empowered-pm",
    empowered.verdict === "hire-empowered-pm",
    JSON.stringify(empowered),
  );

  // Bottleneck override: 'we-dont-know-what-to-build' → not-yet need-product-clarity-first.
  const clarity = founderDecideFn({
    stage: "series-a",
    team_size: 30,
    pm_today: "the-founder",
    founder_time: "most-of-the-time",
    enjoyment: "tolerate",
    ceo_bandwidth: "stretched-but-functioning",
    product_density: "moderate",
    bottleneck: "we-dont-know-what-to-build",
  });
  record(
    "founder: bottleneck=we-dont-know-what-to-build overrides to not-yet+need-product-clarity-first",
    clarity.verdict === "not-yet" && clarity.playbook === "need-product-clarity-first",
    JSON.stringify(clarity),
  );

  // Head-of-product down-bias: should never appear when density is non-heavy.
  const noHopWithoutHeavy = founderDecideFn({
    stage: "series-b-plus",
    team_size: 50,
    pm_today: "ceo-and-head-eng",
    founder_time: "rarely",
    enjoyment: "dislike",
    ceo_bandwidth: "overstretched",
    product_density: "moderate",
    bottleneck: "no-time-for-strategy",
  });
  record(
    "founder: non-heavy density never returns hire-head-of-product",
    noHopWithoutHeavy.verdict !== "hire-head-of-product",
    JSON.stringify(noHopWithoutHeavy),
  );
}

/**
 * #2 Strategy Pressure-Tester router goldens + schema validation.
 */
async function checkStrategyData(): Promise<void> {
  // Heavy roadmap signals → roadmap.
  const roadmap = strategyClassify(
    "Q1 deliverables: feature A, feature B. Q2 milestones: feature C. Q3 ship: feature D, feature E.",
  );
  record(
    "strategy: heavy roadmap signals → roadmap",
    roadmap === "roadmap",
    `got ${roadmap}`,
  );

  // Strategy vocab → strategy.
  const strategy = strategyClassify(
    "Our diagnosis: the challenge is distribution. Our guiding policy is to win on developer experience. The bet we are making is on community-led growth.",
  );
  record(
    "strategy: bet+diagnosis+challenge+guiding-policy → strategy",
    strategy === "strategy",
    `got ${strategy}`,
  );

  // Mixed: strategy vocab + heavy roadmap signals.
  const mixed = strategyClassify(
    "Our challenge is distribution. The bet is community-led growth. Q1 ship: onboarding. Q2 ship: dashboard. Q3 milestones: enterprise tier. Roadmap.",
  );
  record(
    "strategy: strategy vocab + heavy roadmap → mixed",
    mixed === "mixed",
    `got ${mixed}`,
  );

  // PRD: success criteria + edge case + non-goal.
  const prd = strategyClassify(
    "Feature: improved search. Success criteria: 95% click-through. Non-goal: redesign. Edge case: empty state.",
  );
  record(
    "strategy: success-criteria+non-goal+edge-case → prd",
    prd === "prd",
    `got ${prd}`,
  );

  // Schema: min 200 chars enforced.
  const tooShort = strategyTest.meta.inputSchema.safeParse({
    strategy_text: "short",
  });
  record("strategy: run inputSchema rejects <200 chars", !tooShort.success);

  const tooLong = strategyTest.meta.inputSchema.safeParse({
    strategy_text: "x".repeat(4001),
  });
  record("strategy: run inputSchema rejects >4000 chars", !tooLong.success);
}

/**
 * #6 AI Eval Coverage Scorecard shape + schema validation.
 */
async function checkEvalData(): Promise<void> {
  record(
    "eval: 7 categories defined",
    EVAL_CATEGORIES.length === 7 &&
      EVAL_CATEGORIES.map((c) => c.slug).join(",") ===
        "correctness,refusal-behavior,latency,hallucination-rate,jailbreak-resistance,regression-set,drift-detection",
  );

  // Schema: feature_one_liner ≤200, audience ≤200, failure_modes ≤300.
  const longLiner = evalScore.meta.inputSchema.safeParse({
    feature: { feature_one_liner: "x".repeat(201), audience: "users", failure_modes: "stuff" },
  });
  record(
    "eval: score inputSchema rejects feature_one_liner > 200 chars",
    !longLiner.success,
  );

  const longFailures = evalScore.meta.inputSchema.safeParse({
    feature: { feature_one_liner: "x", audience: "y", failure_modes: "z".repeat(301) },
  });
  record(
    "eval: score inputSchema rejects failure_modes > 300 chars",
    !longFailures.success,
  );

  // Happy path runs through. v0.8.0 added optional practice + methodology fields
  // — submitting without them still validates (defaults).
  try {
    const ok = (await evalScore.invoke({
      feature: {
        feature_one_liner: "AI summarization of customer support tickets",
        audience: "Support agents and team leads",
        failure_modes: "occasional hallucinated names; struggles with long threads",
      },
      user_context: "",
    } as never)) as { feature: { feature_one_liner: string }; persistence_warning?: string };
    record(
      "eval: score happy path (legacy 3-field shape) returns valid result + persists brief",
      ok.feature.feature_one_liner === "AI summarization of customer support tickets" &&
        ok.persistence_warning === undefined,
      JSON.stringify(ok).slice(0, 200),
    );
  } catch (err) {
    record("eval: score happy path", false, (err as Error).message);
  }

  // v0.8.0 expanded shape: per-category practice + methodology_paste flow
  // through to the brief inputs.
  try {
    const built = (await evalScore.invoke({
      feature: {
        feature_one_liner: "AI summarization of support tickets",
        audience: "Support agents",
        failure_modes: "hallucinated names",
        practice: {
          correctness: "200-example golden set, weekly run",
          refusal_behavior: "",
          latency: "p95 alert at 2s",
          hallucination_rate: "",
          jailbreak_resistance: "",
          regression_set: "80-case regression suite",
          drift_detection: "",
        },
        methodology_paste: "## Eval methodology\nWe maintain a 200-example golden set...",
      },
      user_context: "",
    } as never)) as { feature: { practice?: { correctness?: string }; methodology_paste?: string } };
    record(
      "eval: score expanded shape carries practice + methodology_paste through to result",
      built.feature?.practice?.correctness === "200-example golden set, weekly run" &&
        typeof built.feature?.methodology_paste === "string" &&
        built.feature.methodology_paste.startsWith("## Eval methodology"),
      JSON.stringify(built.feature).slice(0, 300),
    );
  } catch (err) {
    record("eval: score expanded shape happy path", false, (err as Error).message);
  }

  // Schema rejects oversized methodology_paste (>8000 chars).
  const oversizeMethod = evalScore.meta.inputSchema.safeParse({
    feature: {
      feature_one_liner: "x",
      audience: "y",
      failure_modes: "z",
      methodology_paste: "a".repeat(8001),
    },
  });
  record(
    "eval: score inputSchema rejects methodology_paste > 8000 chars",
    !oversizeMethod.success,
  );

  // Schema rejects oversized practice entry (>300 chars).
  const oversizePractice = evalScore.meta.inputSchema.safeParse({
    feature: {
      feature_one_liner: "x",
      audience: "y",
      failure_modes: "z",
      practice: {
        correctness: "a".repeat(301),
        refusal_behavior: "",
        latency: "",
        hallucination_rate: "",
        jailbreak_resistance: "",
        regression_set: "",
        drift_detection: "",
      },
    },
  });
  record(
    "eval: score inputSchema rejects practice.<cat> > 300 chars",
    !oversizePractice.success,
  );
}

/**
 * #9 NSM Finder shape + family-resolution goldens + schema validation.
 */
async function checkNsmData(): Promise<void> {
  record(
    "nsm: 9 fields defined (incl. conditional marketplace_side + optional business_unusual + dashboard)",
    NSM_FIELDS.length === 9,
    `got ${NSM_FIELDS.length}`,
  );

  record(
    "nsm: 6 business shapes in family map",
    NSM_FAMILIES.length === 6,
  );

  // Family-resolution goldens
  record(
    "nsm: b2c-subscription → retained value-moments",
    resolveNsmFamily("b2c-subscription") === "Weekly/monthly retained value-moments",
  );
  record(
    "nsm: marketplace(supply) → suppliers × listings",
    resolveNsmFamily("marketplace", "supply") === "Active suppliers × listings per supplier",
  );
  record(
    "nsm: marketplace(demand) → matched-transaction per buyer cohort",
    resolveNsmFamily("marketplace", "demand") === "Matched-transaction rate per buyer cohort",
  );
  record(
    "nsm: marketplace(both) → liquidity rate × repeat",
    resolveNsmFamily("marketplace", "both") === "Liquidity rate (matched / posted) × repeat frequency",
  );
  record(
    "nsm: marketplace unspecified side defaults to liquidity (both)",
    resolveNsmFamily("marketplace") === "Liquidity rate (matched / posted) × repeat frequency",
  );

  // dashboard-line parsing
  record(
    "nsm: parseDashboardLines splits + trims + drops empties",
    JSON.stringify(parseDashboardLines("  WAU  \n\nRevenue\n  Sign-ups  \n")) ===
      JSON.stringify(["WAU", "Revenue", "Sign-ups"]),
  );
  record(
    "nsm: parseDashboardLines on empty/whitespace-only → []",
    parseDashboardLines("").length === 0 && parseDashboardLines("   \n\n  ").length === 0,
  );

  // Schema: missing required field rejects.
  const missingShape = nsmRun.meta.inputSchema.safeParse({
    inputs: {
      primary_user_action: "x",
      monetization: ["subscription"],
      revenue_band: "100k-1m",
      friction_top: "y",
      stage: "scaling",
    },
  });
  record("nsm: run inputSchema rejects missing business_shape", !missingShape.success);

  // Schema: empty monetization rejects.
  const emptyMon = nsmRun.meta.inputSchema.safeParse({
    inputs: {
      business_shape: "b2b-plg",
      primary_user_action: "x",
      monetization: [],
      revenue_band: "100k-1m",
      friction_top: "y",
      stage: "scaling",
    },
  });
  record("nsm: run inputSchema rejects empty monetization", !emptyMon.success);

  // Schema: oversized friction_top rejects.
  const longFriction = nsmRun.meta.inputSchema.safeParse({
    inputs: {
      business_shape: "b2b-plg",
      primary_user_action: "x",
      monetization: ["subscription"],
      revenue_band: "100k-1m",
      friction_top: "y".repeat(201),
      stage: "scaling",
    },
  });
  record("nsm: run inputSchema rejects friction_top > 200 chars", !longFriction.success);

  // Happy path: full inputs + a dashboard paste.
  try {
    const ok = (await nsmRun.invoke({
      inputs: {
        business_shape: "b2b-plg",
        business_unusual: "",
        primary_user_action: "publishing a doc",
        monetization: ["freemium-to-paid", "seat-based"],
        revenue_band: "1m-10m",
        friction_top: "activation drops between sign-up and first publish",
        stage: "scaling",
        dashboard_paste: "WAU\nDocuments published per week\nSign-ups\n",
      },
      user_context: "",
    } as never)) as {
      nsm_family: string;
      has_dashboard: boolean;
      persistence_warning?: string;
    };
    const okOk =
      ok.nsm_family === "Weekly active teams × retention shape" &&
      ok.has_dashboard === true &&
      ok.persistence_warning === undefined;
    record(
      "nsm: run happy path returns valid result + persists brief",
      okOk,
      okOk ? undefined : JSON.stringify(ok).slice(0, 200),
    );
  } catch (err) {
    record("nsm: run happy path", false, (err as Error).message);
  }
}

/**
 * #24 OKR Critique parser + threshold goldens.
 */
async function checkOkrData(): Promise<void> {
  // Numbered objectives + bulleted KRs
  const numbered = parseOkrs(
    "1. Grow weekly active users\n  - Increase WAU from 10k to 15k by Q2\n  - Increase D7 retention from 25% to 30%\n2. Launch enterprise tier\n  - Sign 5 enterprise contracts\n  - Average ACV ≥ $50k",
  );
  record(
    "okr: numbered objectives + bulleted KRs parsed with high confidence",
    numbered.objectives.length === 2 &&
      numbered.objectives[0]!.key_results.length === 2 &&
      numbered.objectives[1]!.key_results.length === 2 &&
      numbered.parsing_confidence === "high",
    JSON.stringify(numbered).slice(0, 200),
  );

  // KR-prefixed format
  const krFormat = parseOkrs(
    "**Objective: Improve performance**\nKR1: Reduce p95 latency from 800ms to 300ms\nKR2: Reduce error rate from 2% to 0.5%",
  );
  record(
    "okr: bold-objective + KRn format parsed with high confidence",
    krFormat.objectives.length === 1 &&
      krFormat.objectives[0]!.key_results.length === 2 &&
      krFormat.parsing_confidence === "high",
    JSON.stringify(krFormat).slice(0, 200),
  );

  // Unstructured prose → low confidence
  const unstructured = parseOkrs(
    "We want to grow this quarter and improve the team and ship things and make customers happy and get to product market fit.",
  );
  record(
    "okr: unstructured prose returns parsing_confidence=low",
    unstructured.parsing_confidence === "low",
    JSON.stringify(unstructured).slice(0, 200),
  );

  // Too-many threshold checks
  const fiveObjs = parseOkrs(
    "1. A\n  - kr1\n2. B\n  - kr1\n3. C\n  - kr1\n4. D\n  - kr1\n5. E\n  - kr1",
  );
  record(
    "okr: 5 objectives at team level triggers too-many",
    tooManyOverall(fiveObjs, "team") === true,
  );
  record(
    "okr: 5 objectives at org level does NOT trigger too-many (cap is 5)",
    tooManyOverall(fiveObjs, "org") === false,
  );

  record(
    "okr: too-many thresholds match prompt.md",
    TOO_MANY.kr_per_objective === 4 &&
      TOO_MANY.objectives_team === 3 &&
      TOO_MANY.objectives_org === 5,
  );

  // Schema rejects too-short input
  const tooShort = okrRun.meta.inputSchema.safeParse({ okr_text: "short" });
  record("okr: run inputSchema rejects okr_text < 100 chars", !tooShort.success);

  const tooLong = okrRun.meta.inputSchema.safeParse({
    okr_text: "x".repeat(3001),
  });
  record("okr: run inputSchema rejects okr_text > 3000 chars", !tooLong.success);

  // Schema rejects unknown stance
  const badStance = okrRun.meta.inputSchema.safeParse({
    okr_text: "1. A\n  - kr1\n2. B\n  - kr1\n3. C\n  - kr1".padEnd(120, " "),
    stance: "harsh",
  });
  record("okr: run inputSchema rejects unknown stance", !badStance.success);

  // Happy path
  try {
    const ok = (await okrRun.invoke({
      okr_text:
        "Objective 1: Improve onboarding\n  KR 1.1: Increase D1 activation from 40% to 60%\n  KR 1.2: Reduce time-to-first-value from 8min to 3min\nObjective 2: Launch admin dashboard\n  KR 2.1: Ship the redesign by Q2\n  KR 2.2: 80% of admins use it weekly",
      stance: "hybrid",
      level: "team",
    } as never)) as { stance: string; level: string; parsed: { objectives: unknown[] }; persistence_warning?: string };
    record(
      "okr: run happy path returns parse + stance + level + persists brief",
      ok.stance === "hybrid" &&
        ok.level === "team" &&
        ok.parsed.objectives.length === 2 &&
        ok.persistence_warning === undefined,
      JSON.stringify(ok).slice(0, 300),
    );
  } catch (err) {
    record("okr: run happy path", false, (err as Error).message);
  }
}

/**
 * #47 MVS Alignment heuristic + schema goldens.
 */
async function checkMvsData(): Promise<void> {
  // Concrete bets → not vague
  const concrete =
    "Our challenge this year is winning the developer-tools market. The bet is community-led growth: we ship a freemium tier in Q1, expand into EMEA in Q2 with localized docs, and launch a $99/mo seat tier in Q3. 50% of new sign-ups should come from community channels by Q4.";
  record(
    "mvs: concrete strategy is NOT flagged as too vague",
    isStrategyTooVague(concrete) === false,
  );

  // Vague → flagged
  const vague =
    "We aspire to be the best in our category. We will delight customers and empower our team. Our north star is excellence.";
  record(
    "mvs: vague strategy IS flagged as too vague",
    isStrategyTooVague(vague) === true,
  );

  // Schema rejects too-short docs
  const shortMission = mvsRun.meta.inputSchema.safeParse({
    mission_text: "too short",
    vision_text: "a".repeat(60),
    strategy_text: "b".repeat(220),
  });
  record(
    "mvs: run inputSchema rejects mission_text < 50 chars",
    !shortMission.success,
  );

  const shortStrategy = mvsRun.meta.inputSchema.safeParse({
    mission_text: "a".repeat(60),
    vision_text: "b".repeat(60),
    strategy_text: "c".repeat(199),
  });
  record(
    "mvs: run inputSchema rejects strategy_text < 200 chars",
    !shortStrategy.success,
  );

  // Schema rejects too-long mission
  const longMission = mvsRun.meta.inputSchema.safeParse({
    mission_text: "a".repeat(501),
    vision_text: "b".repeat(60),
    strategy_text: "c".repeat(220),
  });
  record(
    "mvs: run inputSchema rejects mission_text > 500 chars",
    !longMission.success,
  );

  // Happy path
  try {
    const ok = (await mvsRun.invoke({
      mission_text:
        "To help product builders ship faster by removing friction from research, design, and engineering coordination.",
      vision_text:
        "Every product team operates with the speed and clarity of a top-tier startup, regardless of company size or industry.",
      strategy_text: concrete,
      user_context: "",
    } as never)) as {
      mission_text: string;
      strategy_too_vague: boolean;
      pairs_count: number;
      persistence_warning?: string;
    };
    record(
      "mvs: run happy path returns three pairs + not-vague + persists brief",
      ok.pairs_count === 3 &&
        ok.strategy_too_vague === false &&
        ok.persistence_warning === undefined,
      JSON.stringify(ok).slice(0, 300),
    );
  } catch (err) {
    record("mvs: run happy path", false, (err as Error).message);
  }
}

/**
 * #37 Activation Metric Finder shape + family-resolution + AI-flag goldens.
 */
async function checkActivationData(): Promise<void> {
  record(
    "activation: 9 fields defined (incl. conditional marketplace_side + optional aha-guess + funnel paste)",
    ACTIVATION_FIELDS.length === 9,
    `got ${ACTIVATION_FIELDS.length}`,
  );

  record(
    "activation: 6 business shapes in family map",
    ACTIVATION_FAMILIES.length === 6,
  );

  record(
    "activation: b2b-plg → workspace+team-of-3",
    resolveActivationFamily("b2b-plg") === "Workspace creation + team-of-3+ engagement",
  );
  record(
    "activation: marketplace(supply) → first listing posted that gets matched",
    resolveActivationFamily("marketplace", "supply") === "First listing posted that gets matched",
  );
  record(
    "activation: marketplace(demand) → first matched transaction completed",
    resolveActivationFamily("marketplace", "demand") === "First matched transaction completed",
  );
  record(
    "activation: marketplace unspecified side defaults to two-sided",
    resolveActivationFamily("marketplace") === "First matched transaction (both sides participate)",
  );

  // AI-product heuristic flag
  record(
    "activation: AI-product flag fires on 'LLM' in business_unusual",
    isAiProductFlagged({
      business_shape: "b2b-plg",
      business_unusual: "we wrap an LLM for support automation",
      primary_value_action: "draft a reply",
      monetization: ["subscription"],
      stage: "early-pmf",
      current_activation_rate_estimate: "",
      aha_moment_guess: "",
      funnel_paste: "",
    }) === true,
  );
  record(
    "activation: AI-product flag does NOT fire on plain SaaS",
    isAiProductFlagged({
      business_shape: "b2b-plg",
      business_unusual: "we have a unique pricing model",
      primary_value_action: "publish a doc",
      monetization: ["subscription"],
      stage: "early-pmf",
      current_activation_rate_estimate: "",
      aha_moment_guess: "",
      funnel_paste: "",
    }) === false,
  );

  // Schema: missing required field rejects.
  const missingShape = activationRun.meta.inputSchema.safeParse({
    inputs: {
      primary_value_action: "x",
      monetization: ["subscription"],
      stage: "scaling",
    },
  });
  record("activation: run inputSchema rejects missing business_shape", !missingShape.success);

  // Schema: empty monetization rejects.
  const emptyMon = activationRun.meta.inputSchema.safeParse({
    inputs: {
      business_shape: "b2b-plg",
      primary_value_action: "x",
      monetization: [],
      stage: "scaling",
    },
  });
  record("activation: run inputSchema rejects empty monetization", !emptyMon.success);

  // Happy path with funnel paste.
  try {
    const ok = (await activationRun.invoke({
      inputs: {
        business_shape: "b2b-plg",
        business_unusual: "",
        primary_value_action: "publishing a shared doc",
        monetization: ["freemium-to-paid", "seat-based"],
        stage: "early-pmf",
        current_activation_rate_estimate: "~22%",
        aha_moment_guess: "seeing a teammate comment on your doc",
        funnel_paste: "Sign-up\nEmail verify\nOnboarding tour\nFirst doc created\nFirst teammate invited\nFirst comment received",
      },
      user_context: "",
    } as never)) as {
      activation_family: string;
      has_funnel: boolean;
      ai_product_flagged: boolean;
      persistence_warning?: string;
    };
    const okOk =
      ok.activation_family === "Workspace creation + team-of-3+ engagement" &&
      ok.has_funnel === true &&
      ok.ai_product_flagged === false &&
      ok.persistence_warning === undefined;
    record(
      "activation: run happy path returns valid result + persists brief",
      okOk,
      okOk ? undefined : JSON.stringify(ok).slice(0, 200),
    );
  } catch (err) {
    record("activation: run happy path", false, (err as Error).message);
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
