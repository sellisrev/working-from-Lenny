import fs from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * End-to-end smoke test that exercises the bundle as a real MCP host would.
 * Stages the bundle into a fresh install-root (same layout `mcpb pack`
 * produces), spawns the server, and connects an MCP client over stdio.
 *
 * Persistence model (v0.1.10):
 *   - pm_pitfalls_score persists the brief to <dataDir>/_pending/
 *     pm-pitfalls-pending.json as a side effect.
 *   - On persistence failure score returns the score result with a
 *     `persistence_warning` field set; it does NOT throw, so the iframe
 *     still renders the score+picks.
 *   - pm_pitfalls_get_pending_narration reads the brief that score wrote.
 *   - pm_pitfalls_narrate is pure compute (no side effects).
 *   - Optional user_context flows score → persisted brief → get-pending.
 *
 * Run after `pnpm run build`. Independent of `pnpm run validate`.
 */

const bundleRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(bundleRoot, "..");

interface Outcome {
  name: string;
  pass: boolean;
  detail?: string;
}

const outcomes: Outcome[] = [];
function record(name: string, pass: boolean, detail?: string): void {
  outcomes.push({ name, pass, detail });
}

async function main(): Promise<void> {
  const installRoot = await fs.mkdtemp(path.join(os.tmpdir(), "wfl-smoke-"));
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "wfl-smoke-data-"));

  try {
    await stageInstallRoot(installRoot);
    await runSmoke(installRoot, dataDir);
  } finally {
    await fs.rm(installRoot, { recursive: true, force: true });
    await fs.rm(dataDir, { recursive: true, force: true });
  }

  const failed = outcomes.filter((o) => !o.pass);
  // eslint-disable-next-line no-console
  console.log(`\nsmoke: ${outcomes.length - failed.length}/${outcomes.length} passed`);
  for (const o of outcomes) {
    const mark = o.pass ? "PASS" : "FAIL";
    // eslint-disable-next-line no-console
    console.log(`  [${mark}] ${o.name}${o.detail ? ": " + o.detail : ""}`);
  }
  if (failed.length > 0) process.exit(1);
}

async function stageInstallRoot(installRoot: string): Promise<void> {
  const distSrc = path.join(bundleRoot, "dist");
  if (!fsSync.existsSync(distSrc)) {
    throw new Error("dist/ missing — run `pnpm run build` first");
  }
  await fs.cp(distSrc, path.join(installRoot, "dist"), { recursive: true });
  await fs.copyFile(
    path.join(bundleRoot, "manifest.json"),
    path.join(installRoot, "manifest.json"),
  );

  const appsSrc = path.join(repoRoot, "apps");
  const appsDest = path.join(installRoot, "apps");
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
  const topicsDest = path.join(installRoot, "knowledge", "topics");
  await fs.mkdir(topicsDest, { recursive: true });
  for (const entry of await fs.readdir(topicsSrc, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (entry.name.startsWith("_")) continue;
    await fs.copyFile(
      path.join(topicsSrc, entry.name),
      path.join(topicsDest, entry.name),
    );
  }

  const checks = [
    path.join(installRoot, "dist", "server.js"),
    path.join(installRoot, "dist", "ui", "pitfalls.html"),
    path.join(installRoot, "dist", "ui", "horoscope.html"),
    path.join(installRoot, "dist", "ui", "ladder.html"),
    path.join(installRoot, "dist", "ui", "pmify.html"),
    path.join(installRoot, "dist", "ui", "how-you-build.html"),
    path.join(installRoot, "dist", "ui", "founder-pm-hire.html"),
    path.join(installRoot, "dist", "ui", "strategy-pressure-test.html"),
    path.join(installRoot, "dist", "ui", "ai-eval-coverage.html"),
    path.join(installRoot, "dist", "ui", "nsm-finder.html"),
    path.join(installRoot, "dist", "ui", "okr-critique.html"),
    path.join(installRoot, "dist", "ui", "mvs-alignment.html"),
    path.join(installRoot, "dist", "ui", "activation-finder.html"),
    path.join(installRoot, "dist", "ui", "seven-powers.html"),
    path.join(installRoot, "dist", "ui", "chasm-stage.html"),
    path.join(installRoot, "dist", "ui", "spotting-bad-pm.html"),
    path.join(installRoot, "dist", "ui", "burnout-index.html"),
    path.join(installRoot, "dist", "ui", "onboarding-pm-101.html"),
    path.join(installRoot, "dist", "ui", "decision-log.html"),
    path.join(installRoot, "dist", "ui", "pm-non-pm-manual.html"),
    path.join(installRoot, "dist", "ui", "lenny-ama.html"),
    path.join(installRoot, "dist", "ui", "daily-dose.html"),
    path.join(installRoot, "dist", "ui", "saying-no.html"),
    path.join(installRoot, "dist", "ui", "difficult-conversations.html"),
    path.join(
      installRoot,
      "dist",
      "tools",
      "53-pm-horoscope",
      "horoscope-data.json",
    ),
    path.join(
      installRoot,
      "dist",
      "tools",
      "3-pm-ladder",
      "ladder-data.json",
    ),
    path.join(installRoot, "apps", "44-pm-pitfalls", "prompt.md"),
    path.join(installRoot, "knowledge", "topics", "pm-pitfalls.md"),
  ];
  for (const p of checks) {
    if (!fsSync.existsSync(p)) {
      throw new Error(`Staging missing ${p}`);
    }
  }
}

async function runSmoke(installRoot: string, dataDir: string): Promise<void> {
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(installRoot, "dist", "server.js")],
    env: {
      ...process.env,
      WFL_BUNDLE_ROOT: installRoot,
      WFL_DATA_DIR: dataDir,
    },
  });
  const client = new Client(
    { name: "wfl-smoke", version: "0.1.0" },
    { capabilities: {} },
  );

  await client.connect(transport);
  try {
    await checkListTools(client);
    await checkHome(client, installRoot);
    await checkGetPendingDescriptionForcesTheCall(client);
    await checkIframeStagedMessageNamesTheTool(installRoot);
    await checkResources(client);
    await checkBuildHtmlSubstitutesVersion(installRoot);
    await checkGetQuestions(client);
    await checkChatSidePathPersists(client, dataDir);
    await checkPendingAfterScoreReturnsBrief(client);
    await checkUserContextFlowsThroughPersistedBrief(client, dataDir);
    await checkSecondScoreOverwritesPending(client);
    await checkNarrateIsPureCompute(client, dataDir);
    await checkCorruptedPendingFileSurfacesAsNoPendingWithReason(client, dataDir);
    await checkDriftFirstThenSecond(client);
    await checkHoroscopeListsTools(client);
    await checkHoroscopeGetPendingDescription(client);
    await checkHoroscopeIframeStagedMessage(installRoot);
    await checkHoroscopeResource(client);
    await checkHoroscopeGetQuiz(client);
    await checkHoroscopeChatSidePathPersists(client, dataDir);
    await checkHoroscopePendingAfterScoreReturnsBrief(client);
    await checkHoroscopeReadPersists(client, dataDir);
    await checkHoroscopeNarrateIsPureCompute(client, dataDir);
    await checkLadderListsTools(client);
    await checkLadderGetPendingDescription(client);
    await checkLadderIframeStagedMessage(installRoot);
    await checkLadderResource(client);
    await checkLadderGetQuestions(client);
    await checkLadderChatSidePathPersists(client, dataDir);
    await checkLadderPendingAfterScoreReturnsBrief(client);
    await checkLadderNarrateIsPureCompute(client, dataDir);
    await checkLadderCalibrateReturnsBrief(client);
    await checkPmifyListsTools(client);
    await checkPmifyGetPendingDescription(client);
    await checkPmifyIframeStagedMessage(installRoot);
    await checkPmifyResource(client);
    await checkPmifyGetModes(client);
    await checkPmifyChatSidePathPersists(client, dataDir);
    await checkPmifyPendingAfterTranslateReturnsBrief(client);
    await checkPmifyNarrateIsPureCompute(client, dataDir);
    await checkHybListsTools(client);
    await checkHybGetPendingDescription(client);
    await checkHybIframeStagedMessage(installRoot);
    await checkHybResource(client);
    await checkHybGetModes(client);
    await checkHybChatSidePathPersists(client, dataDir);
    await checkHybPendingAfterGenerateReturnsBrief(client);
    await checkHybNarrateIsPureCompute(client, dataDir);
    await checkFounderChain(client, dataDir);
    await checkStrategyChain(client, dataDir);
    await checkEvalChain(client, dataDir);
    await checkNsmChain(client, dataDir);
    await checkOkrChain(client, dataDir);
    await checkMvsChain(client, dataDir);
    await checkActivationChain(client, dataDir);
    await checkSevenPowersChain(client, dataDir);
    await checkChasmChain(client, dataDir);
    await checkSpottingChain(client, dataDir);
    await checkBurnoutChain(client, dataDir);
    await checkOnboardingChain(client, dataDir);
    await checkDecisionLogChain(client, dataDir);
    await checkGeneralAppsChain(client);
    await checkPmNonPmChain(client, dataDir);
    await checkAmaChain(client);
    await checkDailyDoseChain(client, dataDir);
    await checkSayingNoChain(client, dataDir);
    await checkDifficultConvChain(client, dataDir);
  } finally {
    await client.close();
  }
}

async function checkSpottingChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "spotting: get_questions binds ui:// via _meta.ui.resourceUri",
    entries["spotting_get_questions"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/spotting-bad-pm",
  );

  // MUST CALL framing in get_pending description
  const desc = list.tools.find((t) => t.name === "spotting_get_pending_narration")?.description ?? "";
  const must = ["MUST CALL", "spotting-bad-pm", "on disk", "embedded widget"].filter((kw) => !desc.includes(kw));
  record("spotting: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/spotting-bad-pm" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "spotting: iframe staged ui/message names submission + tool",
    text.includes("I just filled in the Spotting Bad PM Behaviors field guide") &&
      text.includes("spotting_get_pending_narration"),
  );

  // get_questions returns 15 behaviors
  const qs = JSON.parse(contentText(await client.callTool({ name: "spotting_get_questions", arguments: {} })));
  record(
    "spotting: get_questions returns 15 behaviors",
    Array.isArray(qs.behaviors) && qs.behaviors.length === 15,
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "spotting_get_pending_narration", arguments: {} })));
  record("spotting: get_pending pre-score → no_pending", before.status === "no_pending");

  // Score: behaviors 1-3 often (sev3), rest havent-seen-it → red, total=18, reframe_or_leave
  const answers = new Array(15).fill("havent-seen-it");
  answers[0] = "often";
  answers[1] = "often";
  answers[2] = "often";
  const scored = JSON.parse(contentText(await client.callTool({
    name: "spotting_score",
    arguments: { answers },
  })));
  record(
    "spotting: score → red tier, total=18, top patterns carry reframe_or_leave, no persistence_warning",
    scored.severity_tier === "red" &&
      scored.total === 18 &&
      Array.isArray(scored.top_patterns) &&
      scored.top_patterns.length === 3 &&
      scored.top_patterns.every((p: { action_rung: string }) => p.action_rung === "reframe_or_leave") &&
      scored.persistence_warning === undefined,
    JSON.stringify(scored).slice(0, 300),
  );

  const file = path.join(dataDir, "_pending", "spotting-bad-pm-pending.json");
  record("spotting: score wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "spotting_get_pending_narration", arguments: {} })));
  record(
    "spotting: get_pending after score returns brief with severity_tier + patterns",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.severity_tier === "red" &&
      Array.isArray(after.brief?.inputs?.patterns) &&
      after.brief?.inputs?.patterns.length === 3,
  );

  // narrate is pure compute — pending file must be untouched
  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "spotting_narrate",
    arguments: {
      severity_tier: "green",
      total: 0,
      top_patterns: [],
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "spotting: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #28 Burnout Warning Index smoke checks
// ───────────────────────────────────────────────────────────

async function checkBurnoutChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "burnout: get_form binds ui:// via _meta.ui.resourceUri",
    entries["burnout_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/burnout-index",
  );

  const desc = list.tools.find((t) => t.name === "burnout_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "burnout reading", "you haven't submitted anything", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("burnout: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/burnout-index" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "burnout: iframe staged ui/message names submission + tool",
    text.includes("I just filled in the Burnout Warning Index in the embedded widget") &&
      text.includes("burnout_get_pending_narration"),
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "burnout_get_pending_narration", arguments: {} })));
  record("burnout: get_pending pre-score → no_pending", before.status === "no_pending");

  // Override-firing inputs: meetings=18(+1), last_good_day=cant-remember(+2), dread=most-mornings(+4)
  // rawSum=7 → index=44, tier=yellow, override_fired=true
  const scoreResult = JSON.parse(contentText(await client.callTool({
    name: "burnout_score",
    arguments: {
      inputs: {
        meetings_per_week: 18,
        deep_work_blocks_remaining: 5,
        after_hours_meeting_pct: 0,
        weeks_since_real_vacation: 4,
        sleep_self_report: "solid",
        last_good_day: "cant-remember",
        dread_signal: "most-mornings",
      },
    },
  })));
  record(
    "burnout: score → index=44, yellow, override_fired=true, no persistence_warning",
    scoreResult.index === 44 &&
      scoreResult.tier === "yellow" &&
      scoreResult.override_fired === true &&
      scoreResult.persistence_warning === undefined,
    JSON.stringify(scoreResult).slice(0, 300),
  );

  const file = path.join(dataDir, "_pending", "burnout-index-pending.json");
  record("burnout: score wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "burnout_get_pending_narration", arguments: {} })));
  record(
    "burnout: get_pending after score returns brief with tier + top_drivers",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.tier === "yellow" &&
      Array.isArray(after.brief?.inputs?.top_drivers) &&
      after.brief.inputs.top_drivers.length === 2,
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "burnout_narrate",
    arguments: {
      inputs: {
        meetings_per_week: 10,
        deep_work_blocks_remaining: 5,
        after_hours_meeting_pct: 5,
        weeks_since_real_vacation: 2,
        sleep_self_report: "solid",
        last_good_day: "this-week",
        dread_signal: "rarely",
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "burnout: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #30 Onboarding to PM 101 for Non-PMs smoke checks
// ───────────────────────────────────────────────────────────

async function checkOnboardingChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "onboarding: get_modes binds ui:// via _meta.ui.resourceUri",
    entries["onboarding_get_modes"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/onboarding-pm-101",
  );

  const desc = list.tools.find((t) => t.name === "onboarding_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "onboarding lessons", "you haven't submitted anything", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("onboarding: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/onboarding-pm-101" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "onboarding: iframe staged ui/message names submission + tool",
    text.includes("I just filled in the Onboarding to PM 101 form in the embedded widget") &&
      text.includes("onboarding_get_pending_narration"),
  );

  const modes = JSON.parse(contentText(await client.callTool({ name: "onboarding_get_modes", arguments: {} })));
  record(
    "onboarding: get_modes returns 5 lessons + 4 fields",
    Array.isArray(modes.lessons) && modes.lessons.length === 5 &&
      Array.isArray(modes.fields) && modes.fields.length === 4,
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "onboarding_get_pending_narration", arguments: {} })));
  record("onboarding: get_pending pre-generate → no_pending", before.status === "no_pending");

  // generate with all optional fields including biggest_confusion (triggers confusion_coda section)
  const generateResult = JSON.parse(contentText(await client.callTool({
    name: "onboarding_generate",
    arguments: {
      inputs: {
        role: "engineer",
        company_stage: "series-a-b",
        pm_ratio: "pm-per-squad",
        biggest_confusion: "Why does the PM keep changing priorities?",
      },
    },
  })));
  record(
    "onboarding: generate returns inputs echoed, no persistence_warning",
    generateResult.inputs?.role === "engineer" &&
      generateResult.inputs?.company_stage === "series-a-b" &&
      generateResult.persistence_warning === undefined,
    JSON.stringify(generateResult).slice(0, 200),
  );

  const file = path.join(dataDir, "_pending", "onboarding-pm101-pending.json");
  record("onboarding: generate wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "onboarding_get_pending_narration", arguments: {} })));
  record(
    "onboarding: get_pending after generate returns brief with 6 sections (5 lessons + confusion_coda)",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      Array.isArray(after.brief?.structure?.sections) &&
      after.brief.structure.sections.length === 6 &&
      after.brief.structure.sections.includes("confusion_coda"),
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "onboarding_narrate",
    arguments: {
      inputs: {
        role: "designer",
        company_stage: "growth",
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "onboarding: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// #25 Decision Log + Brier Calibration smoke checks
// ───────────────────────────────────────────────────────────

async function checkDecisionLogChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } }; annotations?: { readOnlyHint?: boolean } }]),
  );
  record(
    "decision-log: get_form binds ui:// via _meta.ui.resourceUri",
    entries["decision_log_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/decision-log",
  );
  record(
    "decision-log: add + resolve have readOnlyHint=false",
    entries["decision_log_add"]?.annotations?.readOnlyHint === false &&
      entries["decision_log_resolve"]?.annotations?.readOnlyHint === false,
  );
  record(
    "decision-log: calibrate + list + get_pending + get_form are readOnlyHint=true",
    entries["decision_log_calibrate"]?.annotations?.readOnlyHint === true &&
      entries["decision_log_list"]?.annotations?.readOnlyHint === true &&
      entries["decision_log_get_pending_narration"]?.annotations?.readOnlyHint === true &&
      entries["decision_log_get_form"]?.annotations?.readOnlyHint === true,
  );

  const desc = list.tools.find((t) => t.name === "decision_log_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "what's my brier score", "am i calibrated", "read my decision log", "embedded widget"].filter((s) => !desc.includes(s));
  record("decision-log: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/decision-log" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "decision-log: iframe staged ui/message names calibration + tool",
    text.includes("Brier") || text.includes("decision") || text.includes("calibration"),
  );

  // Pre-calibrate get_pending → no_pending
  const before = JSON.parse(contentText(await client.callTool({ name: "decision_log_get_pending_narration", arguments: {} })));
  record("decision-log: get_pending pre-calibrate → no_pending", before.status === "no_pending");

  // get_form returns presets + fields
  const formResult = JSON.parse(contentText(await client.callTool({ name: "decision_log_get_form", arguments: {} })));
  record(
    "decision-log: get_form returns presets (8) and fields (4)",
    Array.isArray(formResult.presets) && formResult.presets.length === 8 &&
      Array.isArray(formResult.fields) && formResult.fields.length === 4,
    JSON.stringify(formResult.presets),
  );

  // Add a decision
  const addResult = JSON.parse(contentText(await client.callTool({
    name: "decision_log_add",
    arguments: {
      entry: {
        decision_text: "Hire a senior PM now rather than waiting",
        decision_type: "hire",
        confidence_pct: 80,
        predicted_outcome: "The hire works out and we ship 3 major features in 6 months",
      },
      user_context: "",
    },
  })));
  record(
    "decision-log: add returns open entry with id + no persistence_warning",
    addResult.saved_entry?.status === "open" &&
      addResult.saved_entry?.confidence_pct === 80 &&
      !!addResult.saved_entry?.id &&
      addResult.persistence_warning === undefined,
    JSON.stringify(addResult).slice(0, 200),
  );

  const entryId = addResult.saved_entry?.id as string;

  // list shows 1 open
  const listAfterAdd = JSON.parse(contentText(await client.callTool({ name: "decision_log_list", arguments: {} })));
  record(
    "decision-log: list after add shows 1 open entry",
    listAfterAdd.open_count >= 1 && listAfterAdd.open.some((e: { id: string }) => e.id === entryId),
    `open=${listAfterAdd.open_count} resolved=${listAfterAdd.resolved_count}`,
  );

  // resolve
  const resolveResult = JSON.parse(contentText(await client.callTool({
    name: "decision_log_resolve",
    arguments: { id: entryId, was_right: true, resolution_note: "Great hire, shipped on time" },
  })));
  record(
    "decision-log: resolve returns resolved entry, was_right=true",
    resolveResult.updated_entry?.status === "resolved" &&
      resolveResult.updated_entry?.was_right === true &&
      resolveResult.persistence_warning === undefined,
    JSON.stringify(resolveResult).slice(0, 200),
  );

  // calibrate
  const calResult = JSON.parse(contentText(await client.callTool({
    name: "decision_log_calibrate",
    arguments: { user_context: "" },
  })));
  record(
    "decision-log: calibrate returns narration_brief with brier_band + sections",
    calResult.type === "narration_brief" &&
      calResult.inputs?.n_resolved >= 1 &&
      ["sharp","decent","coin-flip","confidently-wrong"].includes(calResult.inputs?.brier_band) &&
      Array.isArray(calResult.structure?.sections) &&
      calResult.structure.sections.includes("overall"),
    JSON.stringify(calResult.inputs).slice(0, 200),
  );

  const pendingFile = path.join(dataDir, "_pending", "decision-log-calibration-pending.json");
  record("decision-log: calibrate wrote pending file", fsSync.existsSync(pendingFile));

  const after = JSON.parse(contentText(await client.callTool({ name: "decision_log_get_pending_narration", arguments: {} })));
  record(
    "decision-log: get_pending after calibrate returns ready brief",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.n_resolved >= 1 &&
      Array.isArray(after.brief?.structure?.sections) &&
      after.brief.structure.sections.includes("overall"),
    JSON.stringify(after.status),
  );
}

/**
 * #57 Pressure-Test Anything + #58 Hiring Playbook (PHASE2_BUILD #11). Single-
 * call Path-4 tools: *_ask is plan/scenario-in, narration_brief-out, no spine,
 * no persistence, readOnlyHint: true. The staged install root is topics-only
 * (same as the shipped .mcpb — pack.ts stages knowledge/topics only), so this
 * exercises the degraded topics-grounded path; validate covers the full decay
 * sweep against the repo knowledge/ tree.
 */
async function checkGeneralAppsChain(client: Client): Promise<void> {
  try {
    const listed = await client.listTools();
    const entries = Object.fromEntries(
      listed.tools.map((t) => [
        t.name,
        t as { _meta?: { ui?: { resourceUri?: string } }; annotations?: { readOnlyHint?: boolean } },
      ]),
    );
    record(
      "general: ask tools are read-only and chat-native (no ui binding)",
      entries["pressure_test_ask"]?.annotations?.readOnlyHint === true &&
        entries["hire_playbook_ask"]?.annotations?.readOnlyHint === true &&
        entries["pressure_test_ask"]?._meta?.ui?.resourceUri === undefined &&
        entries["hire_playbook_ask"]?._meta?.ui?.resourceUri === undefined,
    );

    const pt = await client.callTool({
      name: "pressure_test_ask",
      arguments: {
        plan: "We will grow through invitations and a freemium tier; no retention metric defined.",
      },
    });
    if (pt.isError) {
      record("general: pressure_test_ask call", false, contentText(pt));
    } else {
      const brief = JSON.parse(contentText(pt)) as {
        type: string;
        structure: { sections: string[] };
        inputs: { hits: unknown[] };
        corpus: Record<string, string>;
      };
      record(
        "general: pressure_test_ask returns a grounded narration_brief",
        brief.type === "narration_brief" &&
          brief.inputs.hits.length > 0 &&
          Object.keys(brief.corpus).length > 0 &&
          brief.structure.sections.includes("ranked_objections"),
        `hits ${brief.inputs?.hits?.length}, corpus ${Object.keys(brief.corpus ?? {}).length}`,
      );
    }

    const hp = await client.callTool({
      name: "hire_playbook_ask",
      arguments: {
        scenario: "Hiring a senior growth PM for a Series B consumer subscription app.",
      },
    });
    if (hp.isError) {
      record("general: hire_playbook_ask call", false, contentText(hp));
    } else {
      const brief = JSON.parse(contentText(hp)) as {
        type: string;
        structure: { sections: string[] };
        inputs: { hits: unknown[] };
        corpus: Record<string, string>;
      };
      record(
        "general: hire_playbook_ask returns a grounded narration_brief",
        brief.type === "narration_brief" &&
          brief.inputs.hits.length > 0 &&
          Object.keys(brief.corpus).length > 0 &&
          brief.structure.sections.includes("question_scripts"),
        `hits ${brief.inputs?.hits?.length}, corpus ${Object.keys(brief.corpus ?? {}).length}`,
      );
    }
  } catch (err) {
    record("general: ask-tools smoke", false, (err as Error).message);
  }
}

// ───────────────────────────────────────────────────────────
// #31 PM-for-Non-PMs Operating Manual smoke checks
// ───────────────────────────────────────────────────────────

async function checkPmNonPmChain(client: Client, dataDir: string): Promise<void> {
  try {
    const list = await client.listTools();
    const entries = Object.fromEntries(
      list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } }; annotations?: { readOnlyHint?: boolean } }]),
    );
    record(
      "pm-non-pm: get_modes binds ui:// via _meta.ui.resourceUri",
      entries["pm_non_pm_get_modes"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/pm-non-pm-manual",
    );

    const modesResult = JSON.parse(contentText(await client.callTool({ name: "pm_non_pm_get_modes", arguments: {} })));
    record(
      "pm-non-pm: get_modes returns 4 domains + 3 artifacts",
      Array.isArray(modesResult.artifacts) && modesResult.artifacts.length === 3 &&
        Array.isArray(modesResult.fields) && modesResult.fields.length === 3,
    );

    const before = JSON.parse(contentText(await client.callTool({ name: "pm_non_pm_get_pending_narration", arguments: {} })));
    record("pm-non-pm: get_pending pre-generate → no_pending", before.status === "no_pending");

    const genResult = JSON.parse(contentText(await client.callTool({
      name: "pm_non_pm_generate",
      arguments: { inputs: { domain: "nonprofit-ed", scale: "mid" } },
    })));
    record(
      "pm-non-pm: generate returns domain + no persistence_warning",
      genResult.inputs?.domain === "nonprofit-ed" && genResult.persistence_warning === undefined,
      JSON.stringify(genResult).slice(0, 200),
    );

    const file = path.join(dataDir, "_pending", "pm-non-pm-manual-pending.json");
    record("pm-non-pm: generate wrote pending file", fsSync.existsSync(file));

    const after = JSON.parse(contentText(await client.callTool({ name: "pm_non_pm_get_pending_narration", arguments: {} })));
    record(
      "pm-non-pm: get_pending after generate returns ready brief",
      after.status === "ready" && after.brief?.type === "narration_brief",
      JSON.stringify(after.status),
    );

    const read = await client.readResource({ uri: "ui://working-from-lenny/pm-non-pm-manual" });
    const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
    record(
      "pm-non-pm: read_resource returns inlined HTML with window.mcp",
      text.includes("window.mcp") && !text.includes("<!-- include:"),
    );
  } catch (err) {
    record("pm-non-pm: chain smoke", false, (err as Error).message);
  }
}

// ───────────────────────────────────────────────────────────
// #54 Lenny AMA smoke checks
// ───────────────────────────────────────────────────────────

async function checkAmaChain(client: Client): Promise<void> {
  try {
    const list = await client.listTools();
    const entries = Object.fromEntries(
      list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } }; annotations?: { readOnlyHint?: boolean } }]),
    );
    record(
      "ama: ama_ask is read-only and binds ui://",
      entries["ama_ask"]?.annotations?.readOnlyHint === true &&
        entries["ama_ask"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/lenny-ama",
    );

    const result = await client.callTool({
      name: "ama_ask",
      arguments: { question: "How do I prioritize when everything seems urgent?" },
    });
    if (result.isError) {
      record("ama: ama_ask call", false, contentText(result));
      return;
    }
    const brief = JSON.parse(contentText(result)) as {
      type: string;
      structure: { sections: string[] };
      inputs: { hits: unknown[] };
    };
    record(
      "ama: ama_ask returns narration_brief with hits",
      brief.type === "narration_brief" &&
        brief.inputs.hits.length > 0 &&
        brief.structure.sections.length > 0,
      `hits ${brief.inputs.hits.length}, sections ${brief.structure.sections.join(",")}`,
    );
  } catch (err) {
    record("ama: chain smoke", false, (err as Error).message);
  }
}

// ───────────────────────────────────────────────────────────
// #55 Daily Dose of Knowledge smoke checks
// ───────────────────────────────────────────────────────────

async function checkDailyDoseChain(client: Client, dataDir: string): Promise<void> {
  try {
    const list = await client.listTools();
    const entries = Object.fromEntries(
      list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } }; annotations?: { readOnlyHint?: boolean } }]),
    );
    record(
      "daily-dose: daily_dose_pick binds ui:// via _meta.ui.resourceUri",
      entries["daily_dose_pick"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/daily-dose",
    );
    record(
      "daily-dose: daily_dose_pick has readOnlyHint=false (writes state)",
      entries["daily_dose_pick"]?.annotations?.readOnlyHint === false,
    );
    record(
      "daily-dose: narrate + get_pending are read-only",
      entries["daily_dose_narrate"]?.annotations?.readOnlyHint === true &&
        entries["daily_dose_get_pending_narration"]?.annotations?.readOnlyHint === true,
    );

    const before = JSON.parse(contentText(await client.callTool({ name: "daily_dose_get_pending_narration", arguments: {} })));
    record("daily-dose: get_pending pre-pick → no_pending", before.status === "no_pending");

    const pickResult = JSON.parse(contentText(await client.callTool({
      name: "daily_dose_pick",
      arguments: {},
    })));
    record(
      "daily-dose: pick returns topic + streak + no persistence_warning",
      typeof pickResult.topic?.slug === "string" &&
        pickResult.streak >= 1 &&
        pickResult.persistence_warning === undefined,
      JSON.stringify(pickResult).slice(0, 200),
    );

    const file = path.join(dataDir, "_pending", "daily-dose-pending.json");
    record("daily-dose: pick wrote pending file", fsSync.existsSync(file));

    const after = JSON.parse(contentText(await client.callTool({ name: "daily_dose_get_pending_narration", arguments: {} })));
    record(
      "daily-dose: get_pending after pick returns ready brief",
      after.status === "ready" && after.brief?.type === "narration_brief",
      JSON.stringify(after.status),
    );

    const read = await client.readResource({ uri: "ui://working-from-lenny/daily-dose" });
    const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
    record(
      "daily-dose: read_resource returns inlined HTML with window.mcp",
      text.includes("window.mcp") && !text.includes("<!-- include:"),
    );
  } catch (err) {
    record("daily-dose: chain smoke", false, (err as Error).message);
  }
}

// ───────────────────────────────────────────────────────────
// #17 Saying No Rehearsal smoke checks
// ───────────────────────────────────────────────────────────

async function checkSayingNoChain(client: Client, dataDir: string): Promise<void> {
  try {
    const list = await client.listTools();
    const entries = Object.fromEntries(
      list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } }; annotations?: { readOnlyHint?: boolean } }]),
    );
    record(
      "saying-no: saying_no_get_scenario binds ui:// via _meta.ui.resourceUri",
      entries["saying_no_get_scenario"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/saying-no",
    );
    record(
      "saying-no: all tools are read-only (ephemeral brief only, no durable writes)",
      entries["saying_no_start"]?.annotations?.readOnlyHint === true &&
        entries["saying_no_narrate"]?.annotations?.readOnlyHint === true &&
        entries["saying_no_get_pending_narration"]?.annotations?.readOnlyHint === true,
    );

    const scenarios = JSON.parse(contentText(await client.callTool({ name: "saying_no_get_scenario", arguments: {} })));
    record(
      "saying-no: get_scenario returns 5 stakeholders + 2 modes",
      Array.isArray(scenarios.stakeholders) && scenarios.stakeholders.length === 5 &&
        Array.isArray(scenarios.modes) && scenarios.modes.length === 2,
    );

    const before = JSON.parse(contentText(await client.callTool({ name: "saying_no_get_pending_narration", arguments: {} })));
    record("saying-no: get_pending pre-start → no_pending", before.status === "no_pending");

    const startResult = JSON.parse(contentText(await client.callTool({
      name: "saying_no_start",
      arguments: {
        scenario: { stakeholder: "ceo", the_ask: "Add this to next quarter" },
        mode: "show-me",
      },
    })));
    record(
      "saying-no: start returns scenario + mode + no persistence_warning",
      startResult.scenario?.stakeholder === "ceo" &&
        startResult.mode === "show-me" &&
        startResult.persistence_warning === undefined,
      JSON.stringify(startResult).slice(0, 200),
    );

    const file = path.join(dataDir, "_pending", "saying-no-rehearsal-pending.json");
    record("saying-no: start wrote pending file", fsSync.existsSync(file));

    const after = JSON.parse(contentText(await client.callTool({ name: "saying_no_get_pending_narration", arguments: {} })));
    record(
      "saying-no: get_pending after start returns ready brief",
      after.status === "ready" && after.brief?.type === "narration_brief",
      JSON.stringify(after.status),
    );

    const read = await client.readResource({ uri: "ui://working-from-lenny/saying-no" });
    const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
    record(
      "saying-no: read_resource returns inlined HTML with window.mcp",
      text.includes("window.mcp") && !text.includes("<!-- include:"),
    );
  } catch (err) {
    record("saying-no: chain smoke", false, (err as Error).message);
  }
}

// ───────────────────────────────────────────────────────────
// #18 Difficult Conversations Rehearsal smoke checks
// ───────────────────────────────────────────────────────────

async function checkDifficultConvChain(client: Client, dataDir: string): Promise<void> {
  try {
    const list = await client.listTools();
    const entries = Object.fromEntries(
      list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } }; annotations?: { readOnlyHint?: boolean } }]),
    );
    record(
      "difficult-conv: difficult_conversations_get_scenario binds ui:// via _meta.ui.resourceUri",
      entries["difficult_conversations_get_scenario"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/difficult-conversations",
    );
    record(
      "difficult-conv: all tools are read-only (ephemeral brief only, no durable writes)",
      entries["difficult_conversations_start"]?.annotations?.readOnlyHint === true &&
        entries["difficult_conversations_narrate"]?.annotations?.readOnlyHint === true &&
        entries["difficult_conversations_get_pending_narration"]?.annotations?.readOnlyHint === true,
    );

    const scenarios = JSON.parse(contentText(await client.callTool({ name: "difficult_conversations_get_scenario", arguments: {} })));
    record(
      "difficult-conv: get_scenario returns 6 scenarios + 3 modes",
      Array.isArray(scenarios.scenarios) && scenarios.scenarios.length === 6 &&
        Array.isArray(scenarios.modes) && scenarios.modes.length === 3,
    );

    const before = JSON.parse(contentText(await client.callTool({ name: "difficult_conversations_get_pending_narration", arguments: {} })));
    record("difficult-conv: get_pending pre-start → no_pending", before.status === "no_pending");

    const startResult = JSON.parse(contentText(await client.callTool({
      name: "difficult_conversations_start",
      arguments: {
        situation: { scenario: "poor-performance" },
        mode: "fournier",
      },
    })));
    record(
      "difficult-conv: start returns situation + mode + no persistence_warning",
      startResult.situation?.scenario === "poor-performance" &&
        startResult.mode === "fournier" &&
        startResult.persistence_warning === undefined,
      JSON.stringify(startResult).slice(0, 200),
    );

    const file = path.join(dataDir, "_pending", "difficult-conversations-rehearsal-pending.json");
    record("difficult-conv: start wrote pending file", fsSync.existsSync(file));

    const after = JSON.parse(contentText(await client.callTool({ name: "difficult_conversations_get_pending_narration", arguments: {} })));
    record(
      "difficult-conv: get_pending after start returns ready brief",
      after.status === "ready" && after.brief?.type === "narration_brief",
      JSON.stringify(after.status),
    );

    const read = await client.readResource({ uri: "ui://working-from-lenny/difficult-conversations" });
    const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
    record(
      "difficult-conv: read_resource returns inlined HTML with window.mcp",
      text.includes("window.mcp") && !text.includes("<!-- include:"),
    );
  } catch (err) {
    record("difficult-conv: chain smoke", false, (err as Error).message);
  }
}

async function checkListTools(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const names = result.tools.map((t) => t.name).sort();
    const expected = [
      "wfl_home",
      "pm_horoscope_get_pending_narration",
      "pm_horoscope_get_quiz",
      "pm_horoscope_narrate",
      "pm_horoscope_read",
      "pm_horoscope_score_quiz",
      "pm_ladder_calibrate",
      "pm_ladder_get_pending_narration",
      "pm_ladder_get_questions",
      "pm_ladder_narrate",
      "pm_ladder_score",
      "pm_pitfalls_drift",
      "pm_pitfalls_get_pending_narration",
      "pm_pitfalls_get_questions",
      "pm_pitfalls_narrate",
      "pm_pitfalls_score",
      "pmify_get_modes",
      "pmify_get_pending_narration",
      "pmify_narrate",
      "pmify_translate",
      "how_you_build_generate",
      "how_you_build_get_modes",
      "how_you_build_get_pending_narration",
      "how_you_build_narrate",
      "founder_pm_hire_get_form",
      "founder_pm_hire_decide",
      "founder_pm_hire_narrate",
      "founder_pm_hire_get_pending_narration",
      "strategy_pressure_test_get_form",
      "strategy_pressure_test_run",
      "strategy_pressure_test_narrate",
      "strategy_pressure_test_get_pending_narration",
      "ai_eval_coverage_get_form",
      "ai_eval_coverage_score",
      "ai_eval_coverage_narrate",
      "ai_eval_coverage_get_pending_narration",
      "nsm_finder_get_form",
      "nsm_finder_run",
      "nsm_finder_narrate",
      "nsm_finder_get_pending_narration",
      "okr_critique_get_form",
      "okr_critique_run",
      "okr_critique_narrate",
      "okr_critique_get_pending_narration",
      "mvs_alignment_get_form",
      "mvs_alignment_run",
      "mvs_alignment_narrate",
      "mvs_alignment_get_pending_narration",
      "activation_finder_get_form",
      "activation_finder_run",
      "activation_finder_narrate",
      "activation_finder_get_pending_narration",
      "seven_powers_get_questions",
      "seven_powers_score",
      "seven_powers_narrate",
      "seven_powers_get_pending_narration",
      "chasm_get_form",
      "chasm_score",
      "chasm_narrate",
      "chasm_get_pending_narration",
      "spotting_get_questions",
      "spotting_score",
      "spotting_narrate",
      "spotting_get_pending_narration",
      "burnout_get_form",
      "burnout_score",
      "burnout_narrate",
      "burnout_get_pending_narration",
      "onboarding_get_modes",
      "onboarding_generate",
      "onboarding_narrate",
      "onboarding_get_pending_narration",
      "decision_log_get_form",
      "decision_log_add",
      "decision_log_resolve",
      "decision_log_list",
      "decision_log_calibrate",
      "decision_log_get_pending_narration",
      "pressure_test_ask",
      "hire_playbook_ask",
      "pm_non_pm_get_modes",
      "pm_non_pm_generate",
      "pm_non_pm_narrate",
      "pm_non_pm_get_pending_narration",
      "ama_ask",
      "daily_dose_pick",
      "daily_dose_narrate",
      "daily_dose_get_pending_narration",
      "saying_no_get_scenario",
      "saying_no_start",
      "saying_no_narrate",
      "saying_no_get_pending_narration",
      "difficult_conversations_get_scenario",
      "difficult_conversations_start",
      "difficult_conversations_narrate",
      "difficult_conversations_get_pending_narration",
    ].sort();
    const namesOk = JSON.stringify(names) === JSON.stringify(expected);
    record(
      "list_tools returns pm-pitfalls + pm-horoscope tools",
      namesOk,
      namesOk ? undefined : `got ${JSON.stringify(names)}`,
    );

    const entries = Object.fromEntries(
      result.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
    );
    const entryUri = entries["pm_pitfalls_get_questions"]?._meta?.ui?.resourceUri;
    const expectedUri = "ui://working-from-lenny/pitfalls";
    record(
      "list_tools: get_questions binds ui:// via _meta.ui.resourceUri",
      entryUri === expectedUri,
      entryUri === expectedUri ? undefined : `got ${String(entryUri)}`,
    );
    const internalToolsClean = [
      "pm_pitfalls_score",
      "pm_pitfalls_narrate",
      "pm_pitfalls_drift",
      "pm_pitfalls_get_pending_narration",
    ].filter((n) => entries[n]?._meta?.ui?.resourceUri !== undefined);
    record(
      "list_tools: internal tools do NOT declare ui binding",
      internalToolsClean.length === 0,
      internalToolsClean.length === 0
        ? undefined
        : `unexpected binding on: ${internalToolsClean.join(", ")}`,
    );
  } catch (err) {
    record("list_tools", false, (err as Error).message);
  }
}

/**
 * Regression guard for the v0.1.10 ship-bug where Claude in Desktop
 * responded "you haven't taken the audit yet" to the iframe's staged
 * "Give me my personalized PM Pitfalls read" message — without ever
 * calling pm_pitfalls_get_pending_narration. The fix lives in the tool
 * description: it must forbid the failure mode explicitly (do NOT short-
 * circuit from chat history; the audit state is on disk). If a future
 * edit weakens those instructions, this test catches it.
 */
/**
 * Launcher home (PHASE2_BUILD #10). wfl_home reads the build-time catalog.json
 * and returns the menu grouped by theme, featured apps first. Guards: the tool
 * binds the home ui:// resource, the menu has the two featured always-fresh
 * apps pinned, every catalog app surfaces (featured + sections == catalog
 * count), and the home resource is mountable.
 */
async function checkHome(client: Client, installRoot: string): Promise<void> {
  try {
    const listed = await client.listTools();
    const homeEntry = listed.tools.find((t) => t.name === "wfl_home") as
      | { _meta?: { ui?: { resourceUri?: string } } }
      | undefined;
    record(
      "home: wfl_home binds ui://working-from-lenny/home",
      homeEntry?._meta?.ui?.resourceUri === "ui://working-from-lenny/home",
      homeEntry?._meta?.ui?.resourceUri ?? "<no binding>",
    );

    const result = await client.callTool({ name: "wfl_home", arguments: {} });
    if (result.isError) {
      record("home: wfl_home call", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result)) as {
      type: string;
      featured: Array<{ name: string; entry_tool: string; skill_url: string }>;
      sections: Array<{ theme: string; label: string; apps: unknown[] }>;
      total_apps: number;
    };
    record(
      "home: wfl_home returns a home_menu",
      parsed.type === "home_menu",
      parsed.type,
    );
    record(
      "home: two always-fresh apps featured (AMA first)",
      parsed.featured.length === 2 &&
        parsed.featured[0]!.entry_tool === "ama_ask",
      JSON.stringify(parsed.featured.map((a) => a.entry_tool)),
    );
    const inSections = parsed.sections.reduce((n, s) => n + s.apps.length, 0);
    record(
      "home: featured + sections cover every catalog app",
      parsed.featured.length + inSections === parsed.total_apps,
      `featured ${parsed.featured.length} + sections ${inSections} vs total ${parsed.total_apps}`,
    );
    record(
      "home: sections render in the canonical 4c theme order",
      JSON.stringify(parsed.sections.map((s) => s.theme)) ===
        JSON.stringify([
          "self-reflective",
          "business",
          "for-non-pms",
          "just-for-fun",
        ]),
      JSON.stringify(parsed.sections.map((s) => s.theme)),
    );
    record(
      "home: every app carries a skill link",
      parsed.featured.every((a) => a.skill_url.startsWith("https://")) &&
        parsed.sections.every((s) =>
          (s.apps as Array<{ skill_url: string }>).every((a) =>
            a.skill_url.startsWith("https://"),
          ),
        ),
    );

    const homeHtml = path.join(installRoot, "dist", "ui", "home.html");
    const body = await fs.readFile(homeHtml, "utf8");
    record(
      "home: built home.html inlines the mcp bridge + calls wfl_home",
      body.includes("window.mcp") &&
        body.includes('callTool("wfl_home"') &&
        !body.includes("<!-- include:"),
    );
  } catch (err) {
    record("home: wfl_home smoke", false, (err as Error).message);
  }
}

async function checkGetPendingDescriptionForcesTheCall(
  client: Client,
): Promise<void> {
  try {
    const result = await client.listTools();
    const tool = result.tools.find(
      (t) => t.name === "pm_pitfalls_get_pending_narration",
    );
    if (!tool) {
      record("get_pending description: tool exists", false, "tool missing");
      return;
    }
    const desc = tool.description ?? "";
    const lower = desc.toLowerCase();
    const checks: { name: string; pass: boolean }[] = [
      { name: "must-call directive", pass: lower.includes("must call") },
      { name: "covers 'personalized read'", pass: lower.includes("personalized read") },
      { name: "forbids 'you haven't taken'", pass: lower.includes("haven't taken the audit") },
      { name: "states audit lives on disk", pass: lower.includes("on disk") },
      { name: "mentions embedded widget", pass: lower.includes("embedded widget") },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "get_pending description forbids short-circuit failure mode",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "get_pending description guard",
      false,
      (err as Error).message,
    );
  }
}

/**
 * Regression guard for the v0.1.10 ship-bug second half: the iframe's
 * staged ui/message read "Give me my personalized PM Pitfalls read."
 * — ambiguous from a chat-only perspective, since Claude couldn't tell
 * the audit had just completed inside the iframe. The fix names the
 * tool and the completion explicitly. Test reads the built HTML to
 * confirm the message text is still strong.
 */
async function checkIframeStagedMessageNamesTheTool(
  installRoot: string,
): Promise<void> {
  try {
    const distHtml = path.join(installRoot, "dist", "ui", "pitfalls.html");
    const body = await fs.readFile(distHtml, "utf8");
    const checks: { name: string; pass: boolean }[] = [
      {
        name: "message states completion",
        pass: body.includes("I just completed the PM Pitfalls audit"),
      },
      {
        name: "message names the tool explicitly",
        pass: body.includes("pm_pitfalls_get_pending_narration"),
      },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "iframe staged message names completion + tool explicitly",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "iframe staged message guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkResources(client: Client): Promise<void> {
  try {
    const list = await client.listResources();
    const uri = "ui://working-from-lenny/pitfalls";
    const found = list.resources.find((r) => r.uri === uri);
    if (!found) {
      record(
        "list_resources includes pitfalls UI",
        false,
        `uris: ${list.resources.map((r) => r.uri).join(", ")}`,
      );
      return;
    }
    const listMimeOk = found.mimeType === "text/html;profile=mcp-app";
    record(
      "list_resources advertises text/html;profile=mcp-app",
      listMimeOk,
      listMimeOk ? undefined : `got mime=${String(found.mimeType)}`,
    );

    const read = await client.readResource({ uri });
    const first = read.contents[0];
    const text = first && "text" in first ? first.text : undefined;
    const ok =
      first?.mimeType === "text/html;profile=mcp-app" &&
      typeof text === "string" &&
      text.includes("window.mcp") &&
      !text.includes("<!-- include:");
    record(
      "read_resource(pitfalls UI) returns inlined HTML with window.mcp",
      ok,
      ok ? undefined : `mime=${first?.mimeType} len=${text?.length ?? 0}`,
    );
  } catch (err) {
    record("read_resource", false, (err as Error).message);
  }
}

/**
 * Regression guard for the v0.1.7 ship-bug where mcp-rpc.js APP_INFO.version
 * was hardcoded "0.1.0" and silently drifted from the manifest. build-html.ts
 * now substitutes __WFL_BUNDLE_VERSION__ at inline time using manifest.version.
 * Two properties:
 *   - The placeholder MUST NOT appear in the built dist/ui/pitfalls.html.
 *   - The manifest version SHOULD appear (both in the iframe build marker
 *     and in the inlined APP_INFO.version literal).
 */
async function checkBuildHtmlSubstitutesVersion(installRoot: string): Promise<void> {
  try {
    const distHtml = path.join(installRoot, "dist", "ui", "pitfalls.html");
    const body = await fs.readFile(distHtml, "utf8");
    const placeholderAbsent = !body.includes("__WFL_BUNDLE_VERSION__");
    record(
      "build-html: __WFL_BUNDLE_VERSION__ placeholder is substituted out",
      placeholderAbsent,
      placeholderAbsent ? undefined : "literal placeholder still in dist",
    );

    const manifestRaw = await fs.readFile(
      path.join(installRoot, "manifest.json"),
      "utf8",
    );
    const version = (JSON.parse(manifestRaw) as { version: string }).version;
    const versionInBody = body.includes(version);
    record(
      `build-html: dist HTML contains manifest version (${version})`,
      versionInBody,
      versionInBody ? undefined : "manifest version missing from built HTML",
    );
  } catch (err) {
    record("build-html: version substitution", false, (err as Error).message);
  }
}

async function checkGetQuestions(client: Client): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_pitfalls_get_questions",
      arguments: {},
    });
    if (result.isError) {
      record("call get_questions", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      Array.isArray(parsed.questions) &&
      parsed.questions.length === 20 &&
      parsed.questions.every(
        (q: { id: number; text: string }, i: number) =>
          q.id === i + 1 && typeof q.text === "string" && q.text.length > 0,
      );
    record(
      "call get_questions returns 20 canonical questions",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record("call get_questions", false, (err as Error).message);
  }
}

async function checkChatSidePathPersists(
  client: Client,
  dataDir: string,
): Promise<void> {
  // Step 1: get_pending BEFORE any audit. Expect no_pending.
  try {
    const result = await client.callTool({
      name: "pm_pitfalls_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "chat-side: get_pending before audit returns no error",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    record(
      "chat-side: get_pending before audit returns status=no_pending",
      parsed.status === "no_pending" && typeof parsed.note === "string",
      JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record(
      "chat-side: get_pending before audit",
      false,
      (err as Error).message,
    );
    return;
  }

  // Step 2: call score with realistic answers. No narrate call.
  const answers: ("always" | "sometimes" | "never")[] = [
    "always", "always", "sometimes", "always", "never",
    "sometimes", "sometimes", "always", "never", "sometimes",
    "always", "sometimes", "never", "always", "sometimes",
    "always", "never", "sometimes", "always", "sometimes",
  ];
  try {
    const result = await client.callTool({
      name: "pm_pitfalls_score",
      arguments: { answers },
    });
    if (result.isError) {
      record(
        "chat-side: score persists pending brief (no narrate)",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      typeof parsed.score_display === "number" &&
      Array.isArray(parsed.top_three_pitfall_ids) &&
      parsed.top_three_pitfall_ids.length === 3 &&
      parsed.persistence_warning === undefined;
    record(
      "chat-side: score returns valid result with NO persistence_warning",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record(
      "chat-side: score call",
      false,
      (err as Error).message,
    );
    return;
  }

  // Step 3: verify the pending file landed on disk at the expected path.
  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-pitfalls-pending.json",
  );
  const exists = fsSync.existsSync(expectedFile);
  record(
    "chat-side: score wrote pending file to expected path",
    exists,
    exists ? expectedFile : `missing: ${expectedFile}`,
  );

  if (exists) {
    try {
      const raw = await fs.readFile(expectedFile, "utf8");
      const file = JSON.parse(raw);
      const briefOk =
        file?.data?.brief?.type === "narration_brief" &&
        Array.isArray(file?.data?.brief?.inputs?.picks) &&
        file.data.brief.inputs.picks.length === 3 &&
        Array.isArray(file?.data?.brief?.inputs?.full_audit) &&
        file.data.brief.inputs.full_audit.length === 20;
      record(
        "chat-side: pending file contains a valid grounded brief",
        briefOk,
        briefOk ? undefined : JSON.stringify(file).slice(0, 200),
      );
    } catch (err) {
      record(
        "chat-side: pending file parses",
        false,
        (err as Error).message,
      );
    }
  }
}

async function checkPendingAfterScoreReturnsBrief(
  client: Client,
): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_pitfalls_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "user-types-narrate: get_pending returns ready after score",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.status === "ready" &&
      typeof parsed.saved_at === "string" &&
      parsed.brief?.type === "narration_brief" &&
      Array.isArray(parsed.brief?.inputs?.picks) &&
      parsed.brief.inputs.picks.length === 3 &&
      Array.isArray(parsed.brief?.inputs?.full_audit) &&
      parsed.brief.inputs.full_audit.length === 20 &&
      typeof parsed.brief.directive === "string" &&
      parsed.brief.directive.includes("full_audit");
    record(
      "user-types-narrate: get_pending returns grounded brief after score",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record(
      "user-types-narrate: get_pending after score",
      false,
      (err as Error).message,
    );
  }
}

/**
 * Regression guard: user_context provided to score should flow into the
 * persisted brief's inputs.user_context. Previously persistPendingBrief
 * silently dropped this field.
 */
async function checkUserContextFlowsThroughPersistedBrief(
  client: Client,
  dataDir: string,
): Promise<void> {
  const ctx = "Series A PM at fintech, 4 reports, B2B SaaS";
  const answers: ("sometimes")[] = new Array(20).fill("sometimes");
  try {
    const scoreResult = await client.callTool({
      name: "pm_pitfalls_score",
      arguments: { answers, user_context: ctx },
    });
    if (scoreResult.isError) {
      record(
        "user_context: score accepts user_context input",
        false,
        contentText(scoreResult),
      );
      return;
    }

    const file = path.join(dataDir, "_pending", "pm-pitfalls-pending.json");
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    const briefCtx = parsed?.data?.brief?.inputs?.user_context;
    const inputsCtx = parsed?.data?.inputs?.user_context;
    const ok = briefCtx === ctx && inputsCtx === ctx;
    record(
      "user_context: flows from score input → persisted brief inputs.user_context",
      ok,
      ok ? undefined : `brief.inputs.user_context=${JSON.stringify(briefCtx)}, inputs.user_context=${JSON.stringify(inputsCtx)}`,
    );

    // Then verify get-pending returns the same user_context (round-trip).
    const pendingResult = await client.callTool({
      name: "pm_pitfalls_get_pending_narration",
      arguments: {},
    });
    const pendingParsed = JSON.parse(contentText(pendingResult));
    const roundTripOk =
      pendingParsed?.status === "ready" &&
      pendingParsed?.brief?.inputs?.user_context === ctx;
    record(
      "user_context: round-trips through get-pending",
      roundTripOk,
      roundTripOk ? undefined : JSON.stringify(pendingParsed).slice(0, 300),
    );
  } catch (err) {
    record("user_context: flow", false, (err as Error).message);
  }
}

async function checkSecondScoreOverwritesPending(client: Client): Promise<void> {
  const allNeverAnswers: ("never")[] = new Array(20).fill("never");
  try {
    const scoreResult = await client.callTool({
      name: "pm_pitfalls_score",
      arguments: { answers: allNeverAnswers },
    });
    if (scoreResult.isError) {
      record("retake: second score call", false, contentText(scoreResult));
      return;
    }

    const pendingResult = await client.callTool({
      name: "pm_pitfalls_get_pending_narration",
      arguments: {},
    });
    if (pendingResult.isError) {
      record(
        "retake: get_pending after second score",
        false,
        contentText(pendingResult),
      );
      return;
    }
    const parsed = JSON.parse(contentText(pendingResult));
    // All-never answer set → score_display 0, top_three is the fixed [1,2,4].
    const ok =
      parsed.status === "ready" &&
      parsed.brief?.inputs?.score_display === 0 &&
      Array.isArray(parsed.brief?.inputs?.full_audit) &&
      parsed.brief.inputs.full_audit.every(
        (e: { user_answer: string }) => e.user_answer === "never",
      );
    record(
      "retake: get_pending reflects the LATEST score (last-write-wins)",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record(
      "retake: second score → get_pending",
      false,
      (err as Error).message,
    );
  }
}

async function checkNarrateIsPureCompute(
  client: Client,
  dataDir: string,
): Promise<void> {
  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-pitfalls-pending.json",
  );
  let beforeContent: string;
  try {
    beforeContent = await fs.readFile(expectedFile, "utf8");
  } catch (err) {
    record(
      "narrate-pure-compute: pre-read pending file",
      false,
      (err as Error).message,
    );
    return;
  }
  const beforeMtime = (await fs.stat(expectedFile)).mtimeMs;

  try {
    const result = await client.callTool({
      name: "pm_pitfalls_narrate",
      arguments: {
        score_display: 15,
        top_three_pitfall_ids: [5, 6, 7],
        user_context: "pure compute smoke",
      },
    });
    if (result.isError) {
      record("narrate-pure-compute: returns brief", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const briefOk =
      parsed.type === "narration_brief" &&
      Array.isArray(parsed.inputs?.picks) &&
      parsed.inputs.picks.length === 3 &&
      parsed.inputs.picks[0].pitfall_id === 5;
    record(
      "narrate-pure-compute: returns brief for arbitrary top_three",
      briefOk,
      briefOk ? undefined : JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record(
      "narrate-pure-compute: invocation",
      false,
      (err as Error).message,
    );
    return;
  }

  const afterContent = await fs.readFile(expectedFile, "utf8");
  const afterMtime = (await fs.stat(expectedFile)).mtimeMs;
  const untouched =
    beforeContent === afterContent && beforeMtime === afterMtime;
  record(
    "narrate-pure-compute: pending file untouched by narrate",
    untouched,
    untouched
      ? undefined
      : `mtime ${beforeMtime} → ${afterMtime}; content equal=${beforeContent === afterContent}`,
  );
}

/**
 * Regression guard for the v0.1.9 silent-no_pending behavior. When the
 * pending file is malformed (truncated write, manual edit gone wrong, etc),
 * get-pending now returns no_pending with a `note` that names the corruption
 * so the host can surface it to the user instead of silently telling them to
 * retake the audit with no diagnostic.
 */
async function checkCorruptedPendingFileSurfacesAsNoPendingWithReason(
  client: Client,
  dataDir: string,
): Promise<void> {
  const file = path.join(dataDir, "_pending", "pm-pitfalls-pending.json");
  try {
    // Truncate to simulate an interrupted write.
    await fs.writeFile(file, '{"schema_version":1,"data":{', "utf8");
    const result = await client.callTool({
      name: "pm_pitfalls_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "corrupted-pending: get_pending returns no_pending (not error)",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.status === "no_pending" &&
      typeof parsed.note === "string" &&
      parsed.note.toLowerCase().includes("corrupt");
    record(
      "corrupted-pending: get_pending returns no_pending with 'corrupt' in note",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );

    // Cleanup: rewrite a valid file by re-scoring so subsequent tests see a
    // healthy state. (The next test, drift, doesn't depend on pending, so
    // this is defensive — keeps the directory tidy.)
    await fs.rm(file, { force: true });
  } catch (err) {
    record(
      "corrupted-pending: corruption test",
      false,
      (err as Error).message,
    );
  }
}

async function checkDriftFirstThenSecond(client: Client): Promise<void> {
  const userId = "smoke-test-user";
  const answers1 = Array<"sometimes">(20).fill("sometimes");
  const answers2: ("sometimes" | "always")[] = answers1.slice();
  answers2[0] = "always";
  answers2[1] = "always";

  try {
    const first = await client.callTool({
      name: "pm_pitfalls_drift",
      arguments: {
        user_id: userId,
        current_audit: { answers: answers1, score_display: 10 },
      },
    });
    if (first.isError) {
      record("drift (first audit)", false, contentText(first));
      return;
    }
    const firstParsed = JSON.parse(contentText(first));
    const firstOk =
      firstParsed.status === "first_audit" && firstParsed.audit_count === 1;
    record(
      "drift (first audit -> status=first_audit)",
      firstOk,
      firstOk ? undefined : JSON.stringify(firstParsed),
    );

    const second = await client.callTool({
      name: "pm_pitfalls_drift",
      arguments: {
        user_id: userId,
        current_audit: { answers: answers2, score_display: 11 },
      },
    });
    if (second.isError) {
      record("drift (second audit)", false, contentText(second));
      return;
    }
    const secondParsed = JSON.parse(contentText(second));
    const secondOk =
      secondParsed.status === "drift_report" &&
      secondParsed.previous_score === 10 &&
      secondParsed.current_score === 11 &&
      Array.isArray(secondParsed.shifted_pitfalls) &&
      secondParsed.shifted_pitfalls.length === 2;
    record(
      "drift (second audit -> drift_report with two shifts)",
      secondOk,
      secondOk ? undefined : JSON.stringify(secondParsed),
    );
  } catch (err) {
    record("drift", false, (err as Error).message);
  }
}

// ───────────────────────────────────────────────────────────
// #53 PM Horoscope smoke checks
// ───────────────────────────────────────────────────────────

async function checkHoroscopeListsTools(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const entries = Object.fromEntries(
      result.tools.map((t) => [
        t.name,
        t as { _meta?: { ui?: { resourceUri?: string } } },
      ]),
    );
    const entryUri = entries["pm_horoscope_get_quiz"]?._meta?.ui?.resourceUri;
    const expectedUri = "ui://working-from-lenny/horoscope";
    record(
      "horoscope: get_quiz binds ui:// via _meta.ui.resourceUri",
      entryUri === expectedUri,
      entryUri === expectedUri ? undefined : `got ${String(entryUri)}`,
    );
    const internalToolsClean = [
      "pm_horoscope_score_quiz",
      "pm_horoscope_read",
      "pm_horoscope_narrate",
      "pm_horoscope_get_pending_narration",
    ].filter((n) => entries[n]?._meta?.ui?.resourceUri !== undefined);
    record(
      "horoscope: internal tools do NOT declare ui binding",
      internalToolsClean.length === 0,
      internalToolsClean.length === 0
        ? undefined
        : `unexpected binding on: ${internalToolsClean.join(", ")}`,
    );
  } catch (err) {
    record("horoscope: list_tools binding", false, (err as Error).message);
  }
}

async function checkHoroscopeGetPendingDescription(
  client: Client,
): Promise<void> {
  try {
    const result = await client.listTools();
    const tool = result.tools.find(
      (t) => t.name === "pm_horoscope_get_pending_narration",
    );
    if (!tool) {
      record(
        "horoscope: get_pending description tool exists",
        false,
        "tool missing",
      );
      return;
    }
    const desc = tool.description ?? "";
    const lower = desc.toLowerCase();
    const checks: { name: string; pass: boolean }[] = [
      { name: "must-call directive", pass: lower.includes("must call") },
      {
        name: "covers 'personalized reading'",
        pass: lower.includes("personalized reading"),
      },
      {
        name: "forbids 'you haven't taken the quiz'",
        pass: lower.includes("haven't taken the quiz"),
      },
      { name: "states audit lives on disk", pass: lower.includes("on disk") },
      { name: "mentions embedded widget", pass: lower.includes("embedded widget") },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "horoscope: get_pending description forbids short-circuit failure mode",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "horoscope: get_pending description guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkHoroscopeIframeStagedMessage(
  installRoot: string,
): Promise<void> {
  try {
    const distHtml = path.join(installRoot, "dist", "ui", "horoscope.html");
    const body = await fs.readFile(distHtml, "utf8");
    const checks: { name: string; pass: boolean }[] = [
      {
        name: "message states completion",
        pass: body.includes("I just completed the PM Horoscope quiz"),
      },
      {
        name: "message names the tool explicitly",
        pass: body.includes("pm_horoscope_get_pending_narration"),
      },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "horoscope: iframe staged message names completion + tool explicitly",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "horoscope: iframe staged message guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkHoroscopeResource(client: Client): Promise<void> {
  try {
    const list = await client.listResources();
    const uri = "ui://working-from-lenny/horoscope";
    const found = list.resources.find((r) => r.uri === uri);
    if (!found) {
      record(
        "horoscope: list_resources includes horoscope UI",
        false,
        `uris: ${list.resources.map((r) => r.uri).join(", ")}`,
      );
      return;
    }
    const read = await client.readResource({ uri });
    const first = read.contents[0];
    const text = first && "text" in first ? first.text : undefined;
    const ok =
      first?.mimeType === "text/html;profile=mcp-app" &&
      typeof text === "string" &&
      text.includes("window.mcp") &&
      !text.includes("<!-- include:");
    record(
      "horoscope: read_resource(horoscope UI) returns inlined HTML with window.mcp",
      ok,
      ok ? undefined : `mime=${first?.mimeType} len=${text?.length ?? 0}`,
    );
  } catch (err) {
    record("horoscope: read_resource", false, (err as Error).message);
  }
}

async function checkHoroscopeGetQuiz(client: Client): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_horoscope_get_quiz",
      arguments: {},
    });
    if (result.isError) {
      record("horoscope: call get_quiz", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      Array.isArray(parsed.questions) &&
      parsed.questions.length === 6 &&
      Array.isArray(parsed.archetype_slugs) &&
      parsed.archetype_slugs.length === 12 &&
      parsed.questions.every(
        (q: { id: number; text: string; options: { id: number; text: string }[] }) =>
          typeof q.id === "number" &&
          typeof q.text === "string" &&
          Array.isArray(q.options) &&
          q.options.length >= 2,
      );
    record(
      "horoscope: get_quiz returns 6 questions + 12 archetype slugs",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record("horoscope: call get_quiz", false, (err as Error).message);
  }
}

async function checkHoroscopeChatSidePathPersists(
  client: Client,
  dataDir: string,
): Promise<void> {
  try {
    const before = await client.callTool({
      name: "pm_horoscope_get_pending_narration",
      arguments: {},
    });
    if (before.isError) {
      record(
        "horoscope: get_pending before quiz returns no error",
        false,
        contentText(before),
      );
      return;
    }
    const parsedBefore = JSON.parse(contentText(before));
    record(
      "horoscope: get_pending before quiz returns status=no_pending",
      parsedBefore.status === "no_pending" &&
        typeof parsedBefore.note === "string",
      JSON.stringify(parsedBefore).slice(0, 200),
    );
  } catch (err) {
    record(
      "horoscope: get_pending before quiz",
      false,
      (err as Error).message,
    );
    return;
  }

  // Use realistic mixed answers so we don't accidentally exercise an edge
  // case (all-same picks → all-same archetype).
  const answers = [0, 1, 2, 3, 0, 1];
  try {
    const result = await client.callTool({
      name: "pm_horoscope_score_quiz",
      arguments: { answers, date: "2026-05-22" },
    });
    if (result.isError) {
      record(
        "horoscope: score_quiz call",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      typeof parsed.archetype_id === "number" &&
      typeof parsed.archetype_slug === "string" &&
      typeof parsed.archetype_name === "string" &&
      typeof parsed.next_archetype_id === "number" &&
      parsed.next_archetype_id !== parsed.archetype_id &&
      typeof parsed.date === "string" &&
      parsed.reading &&
      typeof parsed.reading.aspect === "string" &&
      typeof parsed.reading.prediction === "string" &&
      typeof parsed.reading.nudge === "string" &&
      typeof parsed.reading.topic === "string" &&
      parsed.persistence_warning === undefined;
    record(
      "horoscope: score_quiz returns valid archetype + reading, no persistence_warning",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
  } catch (err) {
    record("horoscope: score_quiz invocation", false, (err as Error).message);
    return;
  }

  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-horoscope-pending.json",
  );
  const exists = fsSync.existsSync(expectedFile);
  record(
    "horoscope: score_quiz wrote pending file to expected path",
    exists,
    exists ? expectedFile : `missing: ${expectedFile}`,
  );
  if (exists) {
    try {
      const raw = await fs.readFile(expectedFile, "utf8");
      const file = JSON.parse(raw);
      const briefOk =
        file?.data?.brief?.type === "narration_brief" &&
        file?.data?.brief?.inputs?.archetype_id >= 1 &&
        file?.data?.brief?.inputs?.archetype_id <= 12 &&
        typeof file?.data?.brief?.inputs?.reading?.aspect === "string" &&
        typeof file?.data?.brief?.inputs?.reading?.prediction === "string";
      record(
        "horoscope: pending file contains a valid grounded brief",
        briefOk,
        briefOk ? undefined : JSON.stringify(file).slice(0, 300),
      );
    } catch (err) {
      record(
        "horoscope: pending file parses",
        false,
        (err as Error).message,
      );
    }
  }
}

async function checkHoroscopePendingAfterScoreReturnsBrief(
  client: Client,
): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_horoscope_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "horoscope: user-types-narrate get_pending returns ready",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.status === "ready" &&
      typeof parsed.saved_at === "string" &&
      parsed.brief?.type === "narration_brief" &&
      parsed.brief?.audience === "user" &&
      typeof parsed.brief?.directive === "string" &&
      Array.isArray(parsed.brief?.voice_rules) &&
      parsed.brief?.inputs?.reading?.aspect &&
      typeof parsed.brief?.corpus === "object";
    record(
      "horoscope: user-types-narrate get_pending returns grounded brief after score",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
  } catch (err) {
    record(
      "horoscope: user-types-narrate get_pending after score",
      false,
      (err as Error).message,
    );
  }
}

async function checkHoroscopeReadPersists(
  client: Client,
  dataDir: string,
): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_horoscope_read",
      arguments: {
        archetype: "saying-no",
        date: "2026-05-22",
      },
    });
    if (result.isError) {
      record("horoscope: read call", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const readOk =
      parsed.archetype_slug === "saying-no" &&
      parsed.archetype_id === 9 &&
      parsed.date === "2026-05-22" &&
      typeof parsed.reading?.aspect === "string" &&
      parsed.persistence_warning === undefined;
    record(
      "horoscope: read returns archetype + reading for direct pick (no persistence_warning)",
      readOk,
      readOk ? undefined : JSON.stringify(parsed).slice(0, 300),
    );

    // The read should have overwritten the pending file with the
    // direct-pick brief.
    const pendingResult = await client.callTool({
      name: "pm_horoscope_get_pending_narration",
      arguments: {},
    });
    const pendingParsed = JSON.parse(contentText(pendingResult));
    const overwriteOk =
      pendingParsed.status === "ready" &&
      pendingParsed.brief?.inputs?.archetype_slug === "saying-no" &&
      pendingParsed.brief?.inputs?.date === "2026-05-22";
    record(
      "horoscope: read overwrites pending (last-write-wins, archetype + date match the read)",
      overwriteOk,
      overwriteOk ? undefined : JSON.stringify(pendingParsed).slice(0, 300),
    );

    // Defensive: confirm the file actually exists at the expected path.
    const expectedFile = path.join(
      dataDir,
      "_pending",
      "pm-horoscope-pending.json",
    );
    record(
      "horoscope: read wrote pending file to expected path",
      fsSync.existsSync(expectedFile),
      fsSync.existsSync(expectedFile) ? expectedFile : `missing: ${expectedFile}`,
    );
  } catch (err) {
    record("horoscope: read path", false, (err as Error).message);
  }
}

async function checkHoroscopeNarrateIsPureCompute(
  client: Client,
  dataDir: string,
): Promise<void> {
  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-horoscope-pending.json",
  );
  let beforeContent: string;
  try {
    beforeContent = await fs.readFile(expectedFile, "utf8");
  } catch (err) {
    record(
      "horoscope: narrate-pure-compute pre-read pending file",
      false,
      (err as Error).message,
    );
    return;
  }
  const beforeMtime = (await fs.stat(expectedFile)).mtimeMs;

  try {
    const result = await client.callTool({
      name: "pm_horoscope_narrate",
      arguments: {
        archetype: "top-1-percent",
        date: "2026-12-01",
      },
    });
    if (result.isError) {
      record(
        "horoscope: narrate-pure-compute returns brief",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const briefOk =
      parsed.type === "narration_brief" &&
      parsed.inputs?.archetype_slug === "top-1-percent" &&
      parsed.inputs?.date === "2026-12-01";
    record(
      "horoscope: narrate-pure-compute returns brief for arbitrary archetype + date",
      briefOk,
      briefOk ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record(
      "horoscope: narrate-pure-compute invocation",
      false,
      (err as Error).message,
    );
    return;
  }

  const afterContent = await fs.readFile(expectedFile, "utf8");
  const afterMtime = (await fs.stat(expectedFile)).mtimeMs;
  const untouched =
    beforeContent === afterContent && beforeMtime === afterMtime;
  record(
    "horoscope: narrate-pure-compute pending file untouched by narrate",
    untouched,
    untouched
      ? undefined
      : `mtime ${beforeMtime} → ${afterMtime}; content equal=${beforeContent === afterContent}`,
  );
}

// ───────────────────────────────────────────────────────────
// #3 PM Ladder smoke checks
// ───────────────────────────────────────────────────────────

async function checkLadderListsTools(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const entries = Object.fromEntries(
      result.tools.map((t) => [
        t.name,
        t as { _meta?: { ui?: { resourceUri?: string } } },
      ]),
    );
    const entryUri =
      entries["pm_ladder_get_questions"]?._meta?.ui?.resourceUri;
    const expectedUri = "ui://working-from-lenny/ladder";
    record(
      "ladder: get_questions binds ui:// via _meta.ui.resourceUri",
      entryUri === expectedUri,
      entryUri === expectedUri ? undefined : `got ${String(entryUri)}`,
    );
    const internalToolsClean = [
      "pm_ladder_score",
      "pm_ladder_narrate",
      "pm_ladder_get_pending_narration",
      "pm_ladder_calibrate",
    ].filter((n) => entries[n]?._meta?.ui?.resourceUri !== undefined);
    record(
      "ladder: internal tools do NOT declare ui binding",
      internalToolsClean.length === 0,
      internalToolsClean.length === 0
        ? undefined
        : `unexpected binding on: ${internalToolsClean.join(", ")}`,
    );
  } catch (err) {
    record("ladder: list_tools binding", false, (err as Error).message);
  }
}

async function checkLadderGetPendingDescription(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const tool = result.tools.find(
      (t) => t.name === "pm_ladder_get_pending_narration",
    );
    if (!tool) {
      record(
        "ladder: get_pending description tool exists",
        false,
        "tool missing",
      );
      return;
    }
    const desc = tool.description ?? "";
    const lower = desc.toLowerCase();
    const checks: { name: string; pass: boolean }[] = [
      { name: "must-call directive", pass: lower.includes("must call") },
      { name: "covers 'gap report'", pass: lower.includes("gap report") },
      {
        name: "forbids 'you haven't taken the assessment'",
        pass: lower.includes("haven't taken the assessment"),
      },
      { name: "states audit lives on disk", pass: lower.includes("on disk") },
      { name: "mentions embedded widget", pass: lower.includes("embedded widget") },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "ladder: get_pending description forbids short-circuit failure mode",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "ladder: get_pending description guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkLadderIframeStagedMessage(
  installRoot: string,
): Promise<void> {
  try {
    const distHtml = path.join(installRoot, "dist", "ui", "ladder.html");
    const body = await fs.readFile(distHtml, "utf8");
    const checks: { name: string; pass: boolean }[] = [
      {
        name: "message states completion",
        pass: body.includes("I just completed the PM Ladder Self-Assessment"),
      },
      {
        name: "message names the tool explicitly",
        pass: body.includes("pm_ladder_get_pending_narration"),
      },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "ladder: iframe staged message names completion + tool explicitly",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "ladder: iframe staged message guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkLadderResource(client: Client): Promise<void> {
  try {
    const list = await client.listResources();
    const uri = "ui://working-from-lenny/ladder";
    const found = list.resources.find((r) => r.uri === uri);
    if (!found) {
      record(
        "ladder: list_resources includes ladder UI",
        false,
        `uris: ${list.resources.map((r) => r.uri).join(", ")}`,
      );
      return;
    }
    const read = await client.readResource({ uri });
    const first = read.contents[0];
    const text = first && "text" in first ? first.text : undefined;
    const ok =
      first?.mimeType === "text/html;profile=mcp-app" &&
      typeof text === "string" &&
      text.includes("window.mcp") &&
      !text.includes("<!-- include:");
    record(
      "ladder: read_resource(ladder UI) returns inlined HTML with window.mcp",
      ok,
      ok ? undefined : `mime=${first?.mimeType} len=${text?.length ?? 0}`,
    );
  } catch (err) {
    record("ladder: read_resource", false, (err as Error).message);
  }
}

async function checkLadderGetQuestions(client: Client): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_ladder_get_questions",
      arguments: {},
    });
    if (result.isError) {
      record("ladder: call get_questions", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      Array.isArray(parsed.questions) &&
      parsed.questions.length === 30 &&
      Array.isArray(parsed.dimensions) &&
      parsed.dimensions.length === 5 &&
      parsed.questions.every(
        (q: {
          id: number;
          dimension: string;
          text: string;
          options: string[];
        }, i: number) =>
          q.id === i + 1 &&
          typeof q.text === "string" &&
          q.text.length > 0 &&
          Array.isArray(q.options) &&
          q.options.length === 5,
      );
    record(
      "ladder: get_questions returns 30 canonical questions + 5 dimensions",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record("ladder: call get_questions", false, (err as Error).message);
  }
}

async function checkLadderChatSidePathPersists(
  client: Client,
  dataDir: string,
): Promise<void> {
  // Step 1: get_pending BEFORE any assessment. Expect no_pending.
  try {
    const result = await client.callTool({
      name: "pm_ladder_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "ladder: get_pending before assessment returns no error",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    record(
      "ladder: get_pending before assessment returns status=no_pending",
      parsed.status === "no_pending" && typeof parsed.note === "string",
      JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record(
      "ladder: get_pending before assessment",
      false,
      (err as Error).message,
    );
    return;
  }

  // Step 2: call score with mixed realistic answers. Effective ~3.
  const answers = [
    3, 3, 2, 3, 3, 4,    // scope: median 3
    3, 4, 3, 3, 2, 3,    // ambiguity: median 3
    2, 2, 3, 2, 2, 3,    // influence: median 2
    3, 4, 4, 3, 3, 4,    // judgment: median 3
    3, 3, 4, 3, 3, 4,    // craft: median 3
  ];
  try {
    const result = await client.callTool({
      name: "pm_ladder_score",
      arguments: { answers },
    });
    if (result.isError) {
      record(
        "ladder: score call",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      typeof parsed.effective_level === "number" &&
      typeof parsed.target_level === "number" &&
      typeof parsed.widest_gap_dimension === "string" &&
      parsed.dimension_levels &&
      typeof parsed.dimension_levels.influence === "number" &&
      parsed.persistence_warning === undefined;
    record(
      "ladder: score returns valid result with NO persistence_warning",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
    // Influence dim is lowest (medians: 2) so widest gap should be influence.
    const widestOk = parsed.widest_gap_dimension === "influence";
    record(
      "ladder: widest_gap_dimension is the lowest-level dim (influence in this fixture)",
      widestOk,
      widestOk ? undefined : `got ${parsed.widest_gap_dimension}`,
    );
  } catch (err) {
    record("ladder: score invocation", false, (err as Error).message);
    return;
  }

  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-ladder-pending.json",
  );
  const exists = fsSync.existsSync(expectedFile);
  record(
    "ladder: score wrote pending file to expected path",
    exists,
    exists ? expectedFile : `missing: ${expectedFile}`,
  );

  if (exists) {
    try {
      const raw = await fs.readFile(expectedFile, "utf8");
      const file = JSON.parse(raw);
      const briefOk =
        file?.data?.brief?.type === "narration_brief" &&
        Array.isArray(file?.data?.brief?.inputs?.dimensions) &&
        file.data.brief.inputs.dimensions.length === 5 &&
        Array.isArray(file?.data?.brief?.inputs?.full_assessment) &&
        file.data.brief.inputs.full_assessment.length === 30;
      record(
        "ladder: pending file contains a valid grounded brief",
        briefOk,
        briefOk ? undefined : JSON.stringify(file).slice(0, 300),
      );
    } catch (err) {
      record(
        "ladder: pending file parses",
        false,
        (err as Error).message,
      );
    }
  }
}

async function checkLadderPendingAfterScoreReturnsBrief(
  client: Client,
): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_ladder_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "ladder: user-types-narrate get_pending returns ready",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.status === "ready" &&
      typeof parsed.saved_at === "string" &&
      parsed.brief?.type === "narration_brief" &&
      parsed.brief?.audience === "user" &&
      typeof parsed.brief?.directive === "string" &&
      Array.isArray(parsed.brief?.voice_rules) &&
      Array.isArray(parsed.brief?.inputs?.dimensions) &&
      parsed.brief.inputs.dimensions.length === 5 &&
      Array.isArray(parsed.brief?.inputs?.full_assessment) &&
      parsed.brief.inputs.full_assessment.length === 30 &&
      typeof parsed.brief?.corpus === "object";
    record(
      "ladder: user-types-narrate get_pending returns grounded brief after score",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
  } catch (err) {
    record(
      "ladder: user-types-narrate get_pending after score",
      false,
      (err as Error).message,
    );
  }
}

async function checkLadderNarrateIsPureCompute(
  client: Client,
  dataDir: string,
): Promise<void> {
  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-ladder-pending.json",
  );
  let beforeContent: string;
  try {
    beforeContent = await fs.readFile(expectedFile, "utf8");
  } catch (err) {
    record(
      "ladder: narrate-pure-compute pre-read pending file",
      false,
      (err as Error).message,
    );
    return;
  }
  const beforeMtime = (await fs.stat(expectedFile)).mtimeMs;

  try {
    const result = await client.callTool({
      name: "pm_ladder_narrate",
      arguments: {
        dimension_levels: {
          scope: 2,
          ambiguity: 2,
          influence: 2,
          judgment: 2,
          craft: 2,
        },
        user_context: "ladder narrate pure compute smoke",
      },
    });
    if (result.isError) {
      record(
        "ladder: narrate-pure-compute returns brief",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const briefOk =
      parsed.type === "narration_brief" &&
      Array.isArray(parsed.inputs?.dimensions) &&
      parsed.inputs.dimensions.length === 5 &&
      parsed.inputs?.user_context === "ladder narrate pure compute smoke";
    record(
      "ladder: narrate-pure-compute returns brief for arbitrary dimension_levels",
      briefOk,
      briefOk ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record(
      "ladder: narrate-pure-compute invocation",
      false,
      (err as Error).message,
    );
    return;
  }

  const afterContent = await fs.readFile(expectedFile, "utf8");
  const afterMtime = (await fs.stat(expectedFile)).mtimeMs;
  const untouched =
    beforeContent === afterContent && beforeMtime === afterMtime;
  record(
    "ladder: narrate-pure-compute pending file untouched by narrate",
    untouched,
    untouched
      ? undefined
      : `mtime ${beforeMtime} → ${afterMtime}; content equal=${beforeContent === afterContent}`,
  );
}

async function checkLadderCalibrateReturnsBrief(client: Client): Promise<void> {
  const managerReview =
    "Strong on craft and execution. Ships consistently, runs good design reviews. " +
    "Needs to grow on influence — peers feel you escalate too fast rather than mediating. " +
    "Strategy work has been thinner this cycle; would like to see a longer-horizon roadmap " +
    "and more explicit kill-criteria on the bets you're carrying.";
  try {
    const result = await client.callTool({
      name: "pm_ladder_calibrate",
      arguments: {
        dimension_levels: {
          scope: 3,
          ambiguity: 3,
          influence: 4,
          judgment: 3,
          craft: 4,
        },
        manager_review_text: managerReview,
        user_context: "calibrate smoke fixture",
      },
    });
    if (result.isError) {
      record("ladder: calibrate returns brief", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.type === "narration_brief" &&
      parsed.audience === "user" &&
      typeof parsed.directive === "string" &&
      Array.isArray(parsed.voice_rules) &&
      parsed.inputs?.manager_review_text === managerReview &&
      typeof parsed.inputs?.dimension_levels?.influence === "number" &&
      typeof parsed.corpus === "object";
    record(
      "ladder: calibrate returns Path 4 brief carrying manager review + levels",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
  } catch (err) {
    record(
      "ladder: calibrate invocation",
      false,
      (err as Error).message,
    );
  }
}

// ───────────────────────────────────────────────────────────
// #51 PM-ify My Inbox smoke checks
// ───────────────────────────────────────────────────────────

async function checkPmifyListsTools(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const entries = Object.fromEntries(
      result.tools.map((t) => [
        t.name,
        t as { _meta?: { ui?: { resourceUri?: string } } },
      ]),
    );
    const entryUri = entries["pmify_get_modes"]?._meta?.ui?.resourceUri;
    const expectedUri = "ui://working-from-lenny/pmify";
    record(
      "pmify: get_modes binds ui:// via _meta.ui.resourceUri",
      entryUri === expectedUri,
      entryUri === expectedUri ? undefined : `got ${String(entryUri)}`,
    );
    const internalToolsClean = [
      "pmify_translate",
      "pmify_narrate",
      "pmify_get_pending_narration",
    ].filter((n) => entries[n]?._meta?.ui?.resourceUri !== undefined);
    record(
      "pmify: internal tools do NOT declare ui binding",
      internalToolsClean.length === 0,
      internalToolsClean.length === 0
        ? undefined
        : `unexpected binding on: ${internalToolsClean.join(", ")}`,
    );
  } catch (err) {
    record("pmify: list_tools binding", false, (err as Error).message);
  }
}

async function checkPmifyGetPendingDescription(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const tool = result.tools.find(
      (t) => t.name === "pmify_get_pending_narration",
    );
    if (!tool) {
      record(
        "pmify: get_pending description tool exists",
        false,
        "tool missing",
      );
      return;
    }
    const desc = tool.description ?? "";
    const lower = desc.toLowerCase();
    const checks: { name: string; pass: boolean }[] = [
      { name: "must-call directive", pass: lower.includes("must call") },
      { name: "covers 'translation'", pass: lower.includes("translation") },
      {
        name: "forbids 'you haven't submitted'",
        pass: lower.includes("haven't submitted"),
      },
      { name: "states submission lives on disk", pass: lower.includes("on disk") },
      { name: "mentions embedded widget", pass: lower.includes("embedded widget") },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "pmify: get_pending description forbids short-circuit failure mode",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "pmify: get_pending description guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkPmifyIframeStagedMessage(
  installRoot: string,
): Promise<void> {
  try {
    const distHtml = path.join(installRoot, "dist", "ui", "pmify.html");
    const body = await fs.readFile(distHtml, "utf8");
    const checks: { name: string; pass: boolean }[] = [
      {
        name: "message states submission",
        pass: body.includes("I just submitted a message to PM-ify My Inbox"),
      },
      {
        name: "message names the tool explicitly",
        pass: body.includes("pmify_get_pending_narration"),
      },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "pmify: iframe staged message names submission + tool explicitly",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "pmify: iframe staged message guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkPmifyResource(client: Client): Promise<void> {
  try {
    const list = await client.listResources();
    const uri = "ui://working-from-lenny/pmify";
    const found = list.resources.find((r) => r.uri === uri);
    if (!found) {
      record(
        "pmify: list_resources includes pmify UI",
        false,
        `uris: ${list.resources.map((r) => r.uri).join(", ")}`,
      );
      return;
    }
    const read = await client.readResource({ uri });
    const first = read.contents[0];
    const text = first && "text" in first ? first.text : undefined;
    const ok =
      first?.mimeType === "text/html;profile=mcp-app" &&
      typeof text === "string" &&
      text.includes("window.mcp") &&
      !text.includes("<!-- include:");
    record(
      "pmify: read_resource(pmify UI) returns inlined HTML with window.mcp",
      ok,
      ok ? undefined : `mime=${first?.mimeType} len=${text?.length ?? 0}`,
    );
  } catch (err) {
    record("pmify: read_resource", false, (err as Error).message);
  }
}

async function checkPmifyGetModes(client: Client): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pmify_get_modes",
      arguments: {},
    });
    if (result.isError) {
      record("pmify: call get_modes", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      Array.isArray(parsed.modes) &&
      parsed.modes.length === 2 &&
      parsed.modes[0].slug === "pm-ify" &&
      parsed.modes[1].slug === "de-pm-ify" &&
      Array.isArray(parsed.patterns) &&
      parsed.patterns.length === 3 &&
      typeof parsed.note === "string";
    record(
      "pmify: get_modes returns 2 modes + 3 patterns + note",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record("pmify: call get_modes", false, (err as Error).message);
  }
}

async function checkPmifyChatSidePathPersists(
  client: Client,
  dataDir: string,
): Promise<void> {
  // Step 1: get_pending BEFORE any submission. Expect no_pending.
  try {
    const result = await client.callTool({
      name: "pmify_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "pmify: get_pending before submission returns no error",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    record(
      "pmify: get_pending before submission returns status=no_pending",
      parsed.status === "no_pending" && typeof parsed.note === "string",
      JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record(
      "pmify: get_pending before submission",
      false,
      (err as Error).message,
    );
    return;
  }

  // Step 2: call translate. Persist brief.
  try {
    const result = await client.callTool({
      name: "pmify_translate",
      arguments: {
        mode: "pm-ify",
        text: "Hey honey, can you call your mother on Sunday? She's been worried.",
      },
    });
    if (result.isError) {
      record("pmify: translate call", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.mode === "pm-ify" &&
      typeof parsed.text === "string" &&
      parsed.persistence_warning === undefined;
    record(
      "pmify: translate returns valid result with NO persistence_warning",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record("pmify: translate invocation", false, (err as Error).message);
    return;
  }

  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-ify-inbox-pending.json",
  );
  const exists = fsSync.existsSync(expectedFile);
  record(
    "pmify: translate wrote pending file to expected path",
    exists,
    exists ? expectedFile : `missing: ${expectedFile}`,
  );

  if (exists) {
    try {
      const raw = await fs.readFile(expectedFile, "utf8");
      const file = JSON.parse(raw);
      const briefOk =
        file?.data?.brief?.type === "narration_brief" &&
        file?.data?.brief?.inputs?.mode === "pm-ify" &&
        Array.isArray(file?.data?.brief?.inputs?.pattern_pool) &&
        file.data.brief.inputs.pattern_pool.length === 3 &&
        typeof file?.data?.brief?.inputs?.user_text === "string";
      record(
        "pmify: pending file contains a valid translation brief",
        briefOk,
        briefOk ? undefined : JSON.stringify(file).slice(0, 300),
      );
    } catch (err) {
      record(
        "pmify: pending file parses",
        false,
        (err as Error).message,
      );
    }
  }
}

async function checkPmifyPendingAfterTranslateReturnsBrief(
  client: Client,
): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pmify_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "pmify: user-types-narrate get_pending returns ready",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.status === "ready" &&
      typeof parsed.saved_at === "string" &&
      parsed.brief?.type === "narration_brief" &&
      parsed.brief?.audience === "user" &&
      typeof parsed.brief?.directive === "string" &&
      Array.isArray(parsed.brief?.voice_rules) &&
      parsed.brief?.inputs?.mode === "pm-ify" &&
      typeof parsed.brief?.inputs?.user_text === "string" &&
      typeof parsed.brief?.corpus === "object";
    record(
      "pmify: user-types-narrate get_pending returns grounded brief after translate",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
  } catch (err) {
    record(
      "pmify: user-types-narrate get_pending after translate",
      false,
      (err as Error).message,
    );
  }
}

async function checkPmifyNarrateIsPureCompute(
  client: Client,
  dataDir: string,
): Promise<void> {
  const expectedFile = path.join(
    dataDir,
    "_pending",
    "pm-ify-inbox-pending.json",
  );
  let beforeContent: string;
  try {
    beforeContent = await fs.readFile(expectedFile, "utf8");
  } catch (err) {
    record(
      "pmify: narrate-pure-compute pre-read pending file",
      false,
      (err as Error).message,
    );
    return;
  }
  const beforeMtime = (await fs.stat(expectedFile)).mtimeMs;

  try {
    const result = await client.callTool({
      name: "pmify_narrate",
      arguments: {
        mode: "de-pm-ify",
        text: "Per our earlier sync, I'm circling back to deprioritize this to Q3.",
      },
    });
    if (result.isError) {
      record(
        "pmify: narrate-pure-compute returns brief",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const briefOk =
      parsed.type === "narration_brief" &&
      parsed.inputs?.mode === "de-pm-ify" &&
      Array.isArray(parsed.inputs?.pattern_pool) &&
      parsed.inputs.pattern_pool.length === 3;
    record(
      "pmify: narrate-pure-compute returns brief for arbitrary mode + text",
      briefOk,
      briefOk ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record(
      "pmify: narrate-pure-compute invocation",
      false,
      (err as Error).message,
    );
    return;
  }

  const afterContent = await fs.readFile(expectedFile, "utf8");
  const afterMtime = (await fs.stat(expectedFile)).mtimeMs;
  const untouched =
    beforeContent === afterContent && beforeMtime === afterMtime;
  record(
    "pmify: narrate-pure-compute pending file untouched by narrate",
    untouched,
    untouched
      ? undefined
      : `mtime ${beforeMtime} → ${afterMtime}; content equal=${beforeContent === afterContent}`,
  );
}

// ───────────────────────────────────────────────────────────
// #52 How [You] Build Product smoke checks
// ───────────────────────────────────────────────────────────

async function checkHybListsTools(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const entries = Object.fromEntries(
      result.tools.map((t) => [
        t.name,
        t as { _meta?: { ui?: { resourceUri?: string } } },
      ]),
    );
    const entryUri =
      entries["how_you_build_get_modes"]?._meta?.ui?.resourceUri;
    const expectedUri = "ui://working-from-lenny/how-you-build";
    record(
      "how-you-build: get_modes binds ui:// via _meta.ui.resourceUri",
      entryUri === expectedUri,
      entryUri === expectedUri ? undefined : `got ${String(entryUri)}`,
    );
    const internalToolsClean = [
      "how_you_build_generate",
      "how_you_build_narrate",
      "how_you_build_get_pending_narration",
    ].filter((n) => entries[n]?._meta?.ui?.resourceUri !== undefined);
    record(
      "how-you-build: internal tools do NOT declare ui binding",
      internalToolsClean.length === 0,
      internalToolsClean.length === 0
        ? undefined
        : `unexpected binding on: ${internalToolsClean.join(", ")}`,
    );
  } catch (err) {
    record("how-you-build: list_tools binding", false, (err as Error).message);
  }
}

async function checkHybGetPendingDescription(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const tool = result.tools.find(
      (t) => t.name === "how_you_build_get_pending_narration",
    );
    if (!tool) {
      record(
        "how-you-build: get_pending description tool exists",
        false,
        "tool missing",
      );
      return;
    }
    const desc = tool.description ?? "";
    const lower = desc.toLowerCase();
    const checks: { name: string; pass: boolean }[] = [
      { name: "must-call directive", pass: lower.includes("must call") },
      { name: "covers 'render my profile'", pass: lower.includes("render my profile") },
      {
        name: "forbids 'you haven't submitted'",
        pass: lower.includes("haven't submitted"),
      },
      { name: "states submission lives on disk", pass: lower.includes("on disk") },
      { name: "mentions embedded widget", pass: lower.includes("embedded widget") },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "how-you-build: get_pending description forbids short-circuit failure mode",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "how-you-build: get_pending description guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkHybIframeStagedMessage(installRoot: string): Promise<void> {
  try {
    const distHtml = path.join(installRoot, "dist", "ui", "how-you-build.html");
    const body = await fs.readFile(distHtml, "utf8");
    const checks: { name: string; pass: boolean }[] = [
      {
        name: "message states submission",
        pass: body.includes("I just submitted team composition to How [You] Build Product"),
      },
      {
        name: "message names the tool explicitly",
        pass: body.includes("how_you_build_get_pending_narration"),
      },
    ];
    const failures = checks.filter((c) => !c.pass).map((c) => c.name);
    record(
      "how-you-build: iframe staged message names submission + tool explicitly",
      failures.length === 0,
      failures.length === 0 ? undefined : `missing: ${failures.join(", ")}`,
    );
  } catch (err) {
    record(
      "how-you-build: iframe staged message guard",
      false,
      (err as Error).message,
    );
  }
}

async function checkHybResource(client: Client): Promise<void> {
  try {
    const list = await client.listResources();
    const uri = "ui://working-from-lenny/how-you-build";
    const found = list.resources.find((r) => r.uri === uri);
    if (!found) {
      record(
        "how-you-build: list_resources includes how-you-build UI",
        false,
        `uris: ${list.resources.map((r) => r.uri).join(", ")}`,
      );
      return;
    }
    const read = await client.readResource({ uri });
    const first = read.contents[0];
    const text = first && "text" in first ? first.text : undefined;
    const ok =
      first?.mimeType === "text/html;profile=mcp-app" &&
      typeof text === "string" &&
      text.includes("window.mcp") &&
      !text.includes("<!-- include:");
    record(
      "how-you-build: read_resource returns inlined HTML with window.mcp",
      ok,
      ok ? undefined : `mime=${first?.mimeType} len=${text?.length ?? 0}`,
    );
  } catch (err) {
    record("how-you-build: read_resource", false, (err as Error).message);
  }
}

async function checkHybGetModes(client: Client): Promise<void> {
  try {
    const result = await client.callTool({
      name: "how_you_build_get_modes",
      arguments: {},
    });
    if (result.isError) {
      record("how-you-build: call get_modes", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const expectedSlugs = "reverence-profile,linkedin-humblebrag,acquired-cold-open";
    const ok =
      Array.isArray(parsed.modes) &&
      parsed.modes.length === 3 &&
      parsed.modes.map((m: { slug: string }) => m.slug).join(",") === expectedSlugs &&
      Array.isArray(parsed.fields) &&
      parsed.fields.length === 6;
    record(
      "how-you-build: get_modes returns 3 modes + 6 fields",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
  } catch (err) {
    record("how-you-build: call get_modes", false, (err as Error).message);
  }
}

async function checkHybChatSidePathPersists(
  client: Client,
  dataDir: string,
): Promise<void> {
  // Step 1: get_pending BEFORE any submission.
  try {
    const result = await client.callTool({
      name: "how_you_build_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "how-you-build: get_pending before submission returns no error",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    record(
      "how-you-build: get_pending before submission returns status=no_pending",
      parsed.status === "no_pending" && typeof parsed.note === "string",
      JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record(
      "how-you-build: get_pending before submission",
      false,
      (err as Error).message,
    );
    return;
  }

  // Step 2: generate persists brief.
  try {
    const result = await client.callTool({
      name: "how_you_build_generate",
      arguments: {
        mode: "reverence-profile",
        team: {
          pm_count: 3,
          eng_count: 9,
          des_count: 2,
          tools: "Notion, Linear, Slack",
          rituals: "Mon/Wed/Fri standups, pinned roadmap, Friday demos",
          last_shipped: "the new onboarding flow last quarter",
        },
      },
    });
    if (result.isError) {
      record("how-you-build: generate call", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.mode === "reverence-profile" &&
      parsed.team?.pm_count === 3 &&
      parsed.persistence_warning === undefined;
    record(
      "how-you-build: generate returns valid result with NO persistence_warning",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record("how-you-build: generate invocation", false, (err as Error).message);
    return;
  }

  const expectedFile = path.join(
    dataDir,
    "_pending",
    "how-you-build-pending.json",
  );
  const exists = fsSync.existsSync(expectedFile);
  record(
    "how-you-build: generate wrote pending file to expected path",
    exists,
    exists ? expectedFile : `missing: ${expectedFile}`,
  );

  if (exists) {
    try {
      const raw = await fs.readFile(expectedFile, "utf8");
      const file = JSON.parse(raw);
      const briefOk =
        file?.data?.brief?.type === "narration_brief" &&
        file?.data?.brief?.inputs?.mode === "reverence-profile" &&
        typeof file?.data?.brief?.inputs?.input_block === "string" &&
        file.data.brief.inputs.input_block.includes("Team composition: 3 PMs, 9 engineers, 2 designers");
      record(
        "how-you-build: pending file contains a valid brief with assembled [INPUT] block",
        briefOk,
        briefOk ? undefined : JSON.stringify(file).slice(0, 300),
      );
    } catch (err) {
      record(
        "how-you-build: pending file parses",
        false,
        (err as Error).message,
      );
    }
  }
}

async function checkHybPendingAfterGenerateReturnsBrief(
  client: Client,
): Promise<void> {
  try {
    const result = await client.callTool({
      name: "how_you_build_get_pending_narration",
      arguments: {},
    });
    if (result.isError) {
      record(
        "how-you-build: user-types-narrate get_pending returns ready",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.status === "ready" &&
      typeof parsed.saved_at === "string" &&
      parsed.brief?.type === "narration_brief" &&
      parsed.brief?.inputs?.mode === "reverence-profile" &&
      typeof parsed.brief?.inputs?.input_block === "string" &&
      typeof parsed.brief?.corpus === "object";
    record(
      "how-you-build: user-types-narrate get_pending returns brief after generate",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 400),
    );
  } catch (err) {
    record(
      "how-you-build: user-types-narrate get_pending after generate",
      false,
      (err as Error).message,
    );
  }
}

async function checkHybNarrateIsPureCompute(
  client: Client,
  dataDir: string,
): Promise<void> {
  const expectedFile = path.join(
    dataDir,
    "_pending",
    "how-you-build-pending.json",
  );
  let beforeContent: string;
  try {
    beforeContent = await fs.readFile(expectedFile, "utf8");
  } catch (err) {
    record(
      "how-you-build: narrate-pure-compute pre-read pending file",
      false,
      (err as Error).message,
    );
    return;
  }
  const beforeMtime = (await fs.stat(expectedFile)).mtimeMs;

  try {
    const result = await client.callTool({
      name: "how_you_build_narrate",
      arguments: {
        mode: "linkedin-humblebrag",
        team: {
          pm_count: 1,
          eng_count: 4,
          des_count: 1,
          tools: "Linear, GitHub, Figma",
          rituals: "Tuesday demos, async standups",
          last_shipped: "the v2 dashboard redesign",
        },
      },
    });
    if (result.isError) {
      record(
        "how-you-build: narrate-pure-compute returns brief",
        false,
        contentText(result),
      );
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const briefOk =
      parsed.type === "narration_brief" &&
      parsed.inputs?.mode === "linkedin-humblebrag" &&
      parsed.inputs?.team?.pm_count === 1 &&
      typeof parsed.inputs?.input_block === "string";
    record(
      "how-you-build: narrate-pure-compute returns brief for arbitrary mode + team",
      briefOk,
      briefOk ? undefined : JSON.stringify(parsed).slice(0, 300),
    );
  } catch (err) {
    record(
      "how-you-build: narrate-pure-compute invocation",
      false,
      (err as Error).message,
    );
    return;
  }

  const afterContent = await fs.readFile(expectedFile, "utf8");
  const afterMtime = (await fs.stat(expectedFile)).mtimeMs;
  const untouched =
    beforeContent === afterContent && beforeMtime === afterMtime;
  record(
    "how-you-build: narrate-pure-compute pending file untouched by narrate",
    untouched,
    untouched
      ? undefined
      : `mtime ${beforeMtime} → ${afterMtime}; content equal=${beforeContent === afterContent}`,
  );
}

// ───────────────────────────────────────────────────────────
// #12-38 Founder PM hire smoke checks
// ───────────────────────────────────────────────────────────

async function checkFounderChain(client: Client, dataDir: string): Promise<void> {
  // ui binding
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "founder: get_form binds ui:// via _meta.ui.resourceUri",
    entries["founder_pm_hire_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/founder-pm-hire",
  );
  const desc = list.tools.find((t) => t.name === "founder_pm_hire_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "verdict", "haven't filled in the form", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("founder: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  // iframe staged message
  const html = await fs.readFile(path.join(dataDir, "..", "..", "Temp").startsWith("/")
    ? path.join("/", "tmp", "noop") : path.join(dataDir, "..").replace(/wfl-smoke-data-[A-Za-z0-9]+$/, ""), "utf8").catch(() => "");
  // Read the built file from the staged installRoot via the readResource shape instead:
  const read = await client.readResource({ uri: "ui://working-from-lenny/founder-pm-hire" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  void html;
  record(
    "founder: iframe staged ui/message names diagnostic + tool",
    text.includes("I just ran the Founder PM hire diagnostic in the embedded widget") &&
      text.includes("founder_pm_hire_get_pending_narration"),
  );

  // before/decide/after persistence chain
  const before = JSON.parse(contentText(await client.callTool({ name: "founder_pm_hire_get_pending_narration", arguments: {} })));
  record("founder: get_pending pre-decide → no_pending", before.status === "no_pending");

  const decideResult = JSON.parse(contentText(await client.callTool({
    name: "founder_pm_hire_decide",
    arguments: {
      inputs: {
        stage: "series-a",
        team_size: 14,
        pm_today: "the-founder",
        founder_time: "most-of-the-time",
        enjoyment: "tolerate",
        ceo_bandwidth: "stretched-but-functioning",
        product_density: "moderate",
        bottleneck: "engineering-builds-wrong-thing",
      },
    },
  })));
  record(
    "founder: decide returns verdict + null/playbook + inputs",
    typeof decideResult.verdict === "string" && decideResult.persistence_warning === undefined,
    JSON.stringify(decideResult).slice(0, 200),
  );

  const file = path.join(dataDir, "_pending", "founder-pm-hire-pending.json");
  record("founder: decide wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "founder_pm_hire_get_pending_narration", arguments: {} })));
  record(
    "founder: get_pending after decide returns ready brief",
    after.status === "ready" && after.brief?.type === "narration_brief" && typeof after.brief?.inputs?.verdict === "string",
  );

  // narrate is pure compute
  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "founder_pm_hire_narrate",
    arguments: {
      inputs: {
        stage: "pre-seed",
        team_size: 2,
        pm_today: "the-founder",
        founder_time: "full-time",
        enjoyment: "enjoy",
        ceo_bandwidth: "room-to-add-product",
        product_density: "light",
        bottleneck: "no-time-for-strategy",
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "founder: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #2 Strategy Pressure-Tester smoke checks
// ───────────────────────────────────────────────────────────

async function checkStrategyChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "strategy: get_form binds ui:// via _meta.ui.resourceUri",
    entries["strategy_pressure_test_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/strategy-pressure-test",
  );
  const desc = list.tools.find((t) => t.name === "strategy_pressure_test_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "objections", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("strategy: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/strategy-pressure-test" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "strategy: iframe staged ui/message names submission + tool",
    text.includes("I just submitted a strategy doc to Strategy Pressure-Tester") &&
      text.includes("strategy_pressure_test_get_pending_narration"),
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "strategy_pressure_test_get_pending_narration", arguments: {} })));
  record("strategy: get_pending pre-run → no_pending", before.status === "no_pending");

  const mixedText =
    "Our challenge is winning in a crowded developer-tools market. The bet is community-led growth and developer experience. " +
    "Q1 ship: onboarding revamp. Q2 ship: pricing tier and new admin dashboard. Q3 milestones: enterprise tier, SSO. " +
    "Q4: we keep building features. Roadmap: more integrations every quarter.";
  const runResult = JSON.parse(contentText(await client.callTool({
    name: "strategy_pressure_test_run",
    arguments: { strategy_text: mixedText },
  })));
  record(
    "strategy: run returns doc_type + persists brief",
    typeof runResult.doc_type === "string" && runResult.persistence_warning === undefined,
    JSON.stringify(runResult).slice(0, 200),
  );
  record(
    "strategy: router classifies mixed text as 'mixed'",
    runResult.doc_type === "mixed",
    `got ${runResult.doc_type}`,
  );

  const file = path.join(dataDir, "_pending", "strategy-pressure-test-pending.json");
  record("strategy: run wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "strategy_pressure_test_get_pending_narration", arguments: {} })));
  record(
    "strategy: get_pending after run returns ready brief",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.doc_type === "mixed",
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "strategy_pressure_test_narrate",
    arguments: { strategy_text: mixedText, doc_type: "strategy" },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "strategy: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #6 AI Eval Coverage Scorecard smoke checks
// ───────────────────────────────────────────────────────────

async function checkEvalChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "eval: get_form binds ui:// via _meta.ui.resourceUri",
    entries["ai_eval_coverage_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/ai-eval-coverage",
  );
  const desc = list.tools.find((t) => t.name === "ai_eval_coverage_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "scorecard", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("eval: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/ai-eval-coverage" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "eval: iframe staged ui/message names submission + tool",
    text.includes("I just submitted a feature to the AI Eval Coverage Scorecard") &&
      text.includes("ai_eval_coverage_get_pending_narration"),
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "ai_eval_coverage_get_pending_narration", arguments: {} })));
  record("eval: get_pending pre-score → no_pending", before.status === "no_pending");

  const scoreResult = JSON.parse(contentText(await client.callTool({
    name: "ai_eval_coverage_score",
    arguments: {
      feature: {
        feature_one_liner: "AI-drafted reply suggestions in the inbox",
        audience: "Sales reps responding to inbound leads",
        failure_modes: "off-tone replies for technical buyers; occasional confident wrong facts about pricing",
      },
    },
  })));
  record(
    "eval: score returns feature + persists brief (no persistence_warning)",
    scoreResult.feature?.feature_one_liner === "AI-drafted reply suggestions in the inbox" &&
      scoreResult.persistence_warning === undefined,
    JSON.stringify(scoreResult).slice(0, 200),
  );

  const file = path.join(dataDir, "_pending", "ai-eval-coverage-pending.json");
  record("eval: score wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "ai_eval_coverage_get_pending_narration", arguments: {} })));
  record(
    "eval: get_pending after score returns brief carrying 7 categories + scoring formula",
    after.status === "ready" &&
      Array.isArray(after.brief?.inputs?.categories) &&
      after.brief.inputs.categories.length === 7 &&
      typeof after.brief?.inputs?.scoring_formula === "string",
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "ai_eval_coverage_narrate",
    arguments: {
      feature: {
        feature_one_liner: "smoke fixture",
        audience: "smoke fixture",
        failure_modes: "smoke fixture",
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "eval: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #9 North Star Metric Finder smoke checks
// ───────────────────────────────────────────────────────────

async function checkNsmChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "nsm: get_form binds ui:// via _meta.ui.resourceUri",
    entries["nsm_finder_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/nsm-finder",
  );
  const desc = list.tools.find((t) => t.name === "nsm_finder_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "north star metric", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("nsm: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/nsm-finder" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "nsm: iframe staged ui/message names submission + tool",
    text.includes("I just submitted the NSM Finder wizard in the embedded widget") &&
      text.includes("nsm_finder_get_pending_narration"),
  );

  // get_form smoke: returns 9 fields + 6 nsm_families
  const form = JSON.parse(contentText(await client.callTool({ name: "nsm_finder_get_form", arguments: {} })));
  record(
    "nsm: get_form returns 9 fields + 6 nsm_families",
    Array.isArray(form.fields) && form.fields.length === 9 && Array.isArray(form.nsm_families) && form.nsm_families.length === 6,
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "nsm_finder_get_pending_narration", arguments: {} })));
  record("nsm: get_pending pre-run → no_pending", before.status === "no_pending");

  const runResult = JSON.parse(contentText(await client.callTool({
    name: "nsm_finder_run",
    arguments: {
      inputs: {
        business_shape: "marketplace",
        marketplace_side: "both",
        primary_user_action: "completing a posted-and-matched transaction",
        monetization: ["consumption-based"],
        revenue_band: "1m-10m",
        friction_top: "supply side dormant for new categories",
        stage: "scaling",
        dashboard_paste: "Posted listings per week\nMatched transactions per week\nSign-ups",
      },
    },
  })));
  record(
    "nsm: run returns liquidity NSM family + has_dashboard=true for marketplace(both)",
    runResult.nsm_family === "Liquidity rate (matched / posted) × repeat frequency" &&
      runResult.has_dashboard === true &&
      runResult.persistence_warning === undefined,
    JSON.stringify(runResult).slice(0, 300),
  );

  const file = path.join(dataDir, "_pending", "nsm-finder-pending.json");
  record("nsm: run wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "nsm_finder_get_pending_narration", arguments: {} })));
  record(
    "nsm: get_pending after run returns brief with normalized dashboard_lines",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.nsm_family === "Liquidity rate (matched / posted) × repeat frequency" &&
      Array.isArray(after.brief?.inputs?.dashboard_lines) &&
      after.brief.inputs.dashboard_lines.length === 3,
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "nsm_finder_narrate",
    arguments: {
      inputs: {
        business_shape: "prosumer",
        primary_user_action: "running a saved workout",
        monetization: ["subscription"],
        revenue_band: "100k-1m",
        friction_top: "first-week drop-off",
        stage: "early-pmf",
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "nsm: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #24 OKR Critique smoke checks
// ───────────────────────────────────────────────────────────

async function checkOkrChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "okr: get_form binds ui:// via _meta.ui.resourceUri",
    entries["okr_critique_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/okr-critique",
  );
  const desc = list.tools.find((t) => t.name === "okr_critique_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "rewrite my krs", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("okr: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/okr-critique" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "okr: iframe staged ui/message names submission + tool",
    text.includes("I just submitted an OKR set to the OKR Critique in the embedded widget") &&
      text.includes("okr_critique_get_pending_narration"),
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "okr_critique_get_pending_narration", arguments: {} })));
  record("okr: get_pending pre-run → no_pending", before.status === "no_pending");

  const okrText =
    "Objective 1: Improve onboarding activation\n  KR 1.1: Increase D1 activation from 40% to 60% by Q2\n  KR 1.2: Reduce time-to-first-value from 8 min to 3 min\nObjective 2: Launch enterprise tier\n  KR 2.1: Sign 5 enterprise contracts by Q3\n  KR 2.2: Ship the admin dashboard by Q2";
  const runResult = JSON.parse(contentText(await client.callTool({
    name: "okr_critique_run",
    arguments: { okr_text: okrText, stance: "hybrid", level: "team" },
  })));
  record(
    "okr: run returns parsed structure + stance/level + no persistence_warning",
    runResult.stance === "hybrid" &&
      runResult.level === "team" &&
      runResult.parsed?.objectives?.length === 2 &&
      runResult.persistence_warning === undefined,
    JSON.stringify(runResult).slice(0, 400),
  );

  const file = path.join(dataDir, "_pending", "okr-critique-pending.json");
  record("okr: run wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "okr_critique_get_pending_narration", arguments: {} })));
  record(
    "okr: get_pending after run returns brief carrying parsed tree",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.parsed?.objectives?.length === 2,
  );

  // Test too-many flag at team level by submitting 4 objectives
  const fourObjs =
    "1. Goal A\n  - kr a\n2. Goal B\n  - kr b\n3. Goal C\n  - kr c\n4. Goal D\n  - kr d";
  const fourResult = JSON.parse(contentText(await client.callTool({
    name: "okr_critique_run",
    arguments: { okr_text: fourObjs.padEnd(120, " "), stance: "hybrid", level: "team" },
  })));
  record(
    "okr: 4 objectives at team level triggers too_many_overall",
    fourResult.too_many_overall === true,
    JSON.stringify(fourResult).slice(0, 300),
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "okr_critique_narrate",
    arguments: { okr_text: okrText, stance: "orthodox", level: "team" },
  });
  // Re-read after narrate. We already overwrote the pending via the
  // too-many run above; check that narrate itself didn't write again.
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "okr: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #47 MVS Alignment smoke checks
// ───────────────────────────────────────────────────────────

async function checkMvsChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "mvs: get_form binds ui:// via _meta.ui.resourceUri",
    entries["mvs_alignment_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/mvs-alignment",
  );
  const desc = list.tools.find((t) => t.name === "mvs_alignment_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "drift map", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("mvs: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/mvs-alignment" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "mvs: iframe staged ui/message names submission + tool",
    text.includes("I just submitted mission/vision/strategy to the alignment checker") &&
      text.includes("mvs_alignment_get_pending_narration"),
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "mvs_alignment_get_pending_narration", arguments: {} })));
  record("mvs: get_pending pre-run → no_pending", before.status === "no_pending");

  const mission =
    "To help product builders ship faster by removing friction from research, design, and engineering coordination.";
  const vision =
    "Every product team operates with the speed and clarity of a top-tier startup, regardless of company size or industry.";
  const strategy =
    "Our challenge this year is winning the developer-tools market against three well-funded competitors. The bet is community-led growth: ship a freemium tier in Q1, expand into EMEA in Q2 with localized docs, launch a $99/mo seat tier in Q3. 50% of new sign-ups from community channels by Q4.";

  const runResult = JSON.parse(contentText(await client.callTool({
    name: "mvs_alignment_run",
    arguments: { mission_text: mission, vision_text: vision, strategy_text: strategy },
  })));
  record(
    "mvs: run returns 3 pairs + concrete-strategy flag false + no persistence_warning",
    runResult.pairs_count === 3 &&
      runResult.strategy_too_vague === false &&
      runResult.persistence_warning === undefined,
    JSON.stringify(runResult).slice(0, 300),
  );

  const file = path.join(dataDir, "_pending", "mission-vision-alignment-pending.json");
  record("mvs: run wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "mvs_alignment_get_pending_narration", arguments: {} })));
  record(
    "mvs: get_pending after run returns brief carrying the three pair labels",
    after.status === "ready" &&
      Array.isArray(after.brief?.inputs?.pairs) &&
      after.brief.inputs.pairs.length === 3,
  );

  // Vague-strategy path flips the flag
  const vagueStrategy =
    "We aspire to be the best in our category and deliver excellence. We will delight customers and empower our team. Our north star is excellence and our differentiator is the team and our values are vision and execution.";
  const vagueResult = JSON.parse(contentText(await client.callTool({
    name: "mvs_alignment_run",
    arguments: { mission_text: mission, vision_text: vision, strategy_text: vagueStrategy },
  })));
  record(
    "mvs: vague strategy flips strategy_too_vague to true",
    vagueResult.strategy_too_vague === true,
    JSON.stringify(vagueResult).slice(0, 300),
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "mvs_alignment_narrate",
    arguments: { mission_text: mission, vision_text: vision, strategy_text: strategy },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "mvs: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #37 Activation Metric Finder smoke checks
// ───────────────────────────────────────────────────────────

async function checkActivationChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "activation: get_form binds ui:// via _meta.ui.resourceUri",
    entries["activation_finder_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/activation-finder",
  );
  const desc = list.tools.find((t) => t.name === "activation_finder_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "activation", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("activation: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/activation-finder" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "activation: iframe staged ui/message names submission + tool",
    text.includes("I just submitted the Activation Metric Finder wizard in the embedded widget") &&
      text.includes("activation_finder_get_pending_narration"),
  );

  // get_form smoke: 9 fields + 6 families
  const form = JSON.parse(contentText(await client.callTool({ name: "activation_finder_get_form", arguments: {} })));
  record(
    "activation: get_form returns 9 fields + 6 activation_families",
    Array.isArray(form.fields) && form.fields.length === 9 && Array.isArray(form.activation_families) && form.activation_families.length === 6,
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "activation_finder_get_pending_narration", arguments: {} })));
  record("activation: get_pending pre-run → no_pending", before.status === "no_pending");

  const runResult = JSON.parse(contentText(await client.callTool({
    name: "activation_finder_run",
    arguments: {
      inputs: {
        business_shape: "marketplace",
        marketplace_side: "supply",
        primary_value_action: "posting a listing that gets matched",
        monetization: ["consumption-based"],
        stage: "scaling",
        aha_moment_guess: "first listing matched within 48 hours",
        funnel_paste: "Sign-up\nProfile complete\nFirst listing posted\nFirst match\nFirst payout",
      },
    },
  })));
  record(
    "activation: run returns supply-side family + has_funnel=true + ai_product_flagged=false",
    runResult.activation_family === "First listing posted that gets matched" &&
      runResult.has_funnel === true &&
      runResult.ai_product_flagged === false &&
      runResult.persistence_warning === undefined,
    JSON.stringify(runResult).slice(0, 300),
  );

  const file = path.join(dataDir, "_pending", "activation-metric-finder-pending.json");
  record("activation: run wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "activation_finder_get_pending_narration", arguments: {} })));
  record(
    "activation: get_pending after run returns brief with normalized funnel_lines",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.activation_family === "First listing posted that gets matched" &&
      Array.isArray(after.brief?.inputs?.funnel_lines) &&
      after.brief.inputs.funnel_lines.length === 5,
  );

  // AI-product flag fires on second run
  const aiRun = JSON.parse(contentText(await client.callTool({
    name: "activation_finder_run",
    arguments: {
      inputs: {
        business_shape: "b2b-plg",
        business_unusual: "we wrap an LLM that drafts responses for support agents",
        primary_value_action: "draft a reply that goes out unedited",
        monetization: ["subscription"],
        stage: "early-pmf",
      },
    },
  })));
  record(
    "activation: AI-product heuristic flips ai_product_flagged to true when business_unusual mentions LLM",
    aiRun.ai_product_flagged === true,
    JSON.stringify(aiRun).slice(0, 200),
  );

  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "activation_finder_narrate",
    arguments: {
      inputs: {
        business_shape: "prosumer",
        primary_value_action: "running 3 saved queries in a week",
        monetization: ["subscription"],
        stage: "scaling",
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "activation: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #33 7 Powers Self-Classifier smoke checks (quiz spine clones #44)
// ───────────────────────────────────────────────────────────

async function checkSevenPowersChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "seven-powers: get_questions binds ui:// via _meta.ui.resourceUri",
    entries["seven_powers_get_questions"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/seven-powers",
  );
  const internalClean = [
    "seven_powers_score",
    "seven_powers_narrate",
    "seven_powers_get_pending_narration",
  ].filter((n) => entries[n]?._meta?.ui?.resourceUri !== undefined);
  record(
    "seven-powers: internal tools do NOT declare ui binding",
    internalClean.length === 0,
    internalClean.join(", "),
  );

  const desc = list.tools.find((t) => t.name === "seven_powers_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "power map", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("seven-powers: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/seven-powers" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "seven-powers: iframe staged ui/message names completion + tool",
    text.includes("I just completed the 7 Powers diagnostic in the embedded widget") &&
      text.includes("seven_powers_get_pending_narration"),
  );

  // get_questions smoke: 7 powers, evidence counts present
  const questions = JSON.parse(contentText(await client.callTool({ name: "seven_powers_get_questions", arguments: {} })));
  record(
    "seven-powers: get_questions returns 7 powers with claim + evidence questions",
    Array.isArray(questions.powers) &&
      questions.powers.length === 7 &&
      questions.powers.every((p: { claim_question: string; evidence_questions: string[] }) =>
        typeof p.claim_question === "string" && Array.isArray(p.evidence_questions) && p.evidence_questions.length >= 2),
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "seven_powers_get_pending_narration", arguments: {} })));
  record("seven-powers: get_pending pre-score → no_pending", before.status === "no_pending");

  // The classic delusion case: claim network effects, no evidence.
  const answers = {
    scale_economies: { claim: "no", evidence: ["false", "false", "false"] },
    network_economies: { claim: "have", evidence: ["false", "false", "false"] },
    counter_positioning: { claim: "no", evidence: ["false", "false", "false"] },
    switching_costs: { claim: "maybe", evidence: ["true", "true", "partly"] },
    branding: { claim: "no", evidence: ["false", "false"] },
    cornered_resource: { claim: "no", evidence: ["false", "false"] },
    process_power: { claim: "no", evidence: ["false", "false"] },
  };
  const scoreResult = JSON.parse(contentText(await client.callTool({
    name: "seven_powers_score",
    arguments: { answers },
  })));
  const net = (scoreResult.classifications ?? []).find((c: { power: string }) => c.power === "network_economies");
  const sw = (scoreResult.classifications ?? []).find((c: { power: string }) => c.power === "switching_costs");
  record(
    "seven-powers: score flags network=DELUSIONAL, switching=has-evidence, no persistence_warning",
    net?.flag === "delusional" &&
      sw?.classification === "has-evidence" &&
      scoreResult.persistence_warning === undefined,
    JSON.stringify({ net, sw }).slice(0, 300),
  );

  const file = path.join(dataDir, "_pending", "seven-powers-classifier-pending.json");
  record("seven-powers: score wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "seven_powers_get_pending_narration", arguments: {} })));
  record(
    "seven-powers: get_pending after score returns brief with power_map + 7 powers",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      Array.isArray(after.brief?.inputs?.powers) &&
      after.brief.inputs.powers.length === 7 &&
      Array.isArray(after.brief?.inputs?.power_map?.delusional) &&
      after.brief.inputs.power_map.delusional.includes("network_economies"),
  );

  // narrate is pure compute
  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "seven_powers_narrate",
    arguments: {
      answers: {
        scale_economies: { claim: "have", evidence: ["true", "true", "true"] },
        network_economies: { claim: "no", evidence: ["false", "false", "false"] },
        counter_positioning: { claim: "maybe", evidence: ["partly", "false", "false"] },
        switching_costs: { claim: "no", evidence: ["false", "false", "false"] },
        branding: { claim: "no", evidence: ["false", "false"] },
        cornered_resource: { claim: "have", evidence: ["true", "true"] },
        process_power: { claim: "no", evidence: ["false", "false"] },
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "seven-powers: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

// ───────────────────────────────────────────────────────────
// #34 Crossing-the-Chasm Stage Finder smoke checks (wizard clones #9/#33)
// ───────────────────────────────────────────────────────────

async function checkChasmChain(client: Client, dataDir: string): Promise<void> {
  const list = await client.listTools();
  const entries = Object.fromEntries(
    list.tools.map((t) => [t.name, t as { _meta?: { ui?: { resourceUri?: string } } }]),
  );
  record(
    "chasm: get_form binds ui:// via _meta.ui.resourceUri",
    entries["chasm_get_form"]?._meta?.ui?.resourceUri === "ui://working-from-lenny/chasm-stage",
  );
  const desc = list.tools.find((t) => t.name === "chasm_get_pending_narration")?.description?.toLowerCase() ?? "";
  const must = ["must call", "where am i on the chasm", "haven't submitted", "on disk", "embedded widget"].filter((s) => !desc.includes(s));
  record("chasm: get_pending description carries MUST CALL + key triggers", must.length === 0, must.join(", "));

  const read = await client.readResource({ uri: "ui://working-from-lenny/chasm-stage" });
  const text = read.contents[0] && "text" in read.contents[0] ? (read.contents[0] as { text: string }).text : "";
  record(
    "chasm: iframe staged ui/message names submission + tool",
    text.includes("I just filled in the Crossing-the-Chasm stage finder in the embedded widget") &&
      text.includes("chasm_get_pending_narration"),
  );

  // get_form smoke: 6 fields + 5 stages
  const form = JSON.parse(contentText(await client.callTool({ name: "chasm_get_form", arguments: {} })));
  record(
    "chasm: get_form returns 6 fields + 5 Moore stages",
    Array.isArray(form.fields) && form.fields.length === 6 && Array.isArray(form.stages) && form.stages.length === 5,
  );

  const before = JSON.parse(contentText(await client.callTool({ name: "chasm_get_pending_narration", arguments: {} })));
  record("chasm: get_pending pre-score → no_pending", before.status === "no_pending");

  // The clean at-the-chasm headline case (golden-chasm-02).
  const runResult = JSON.parse(contentText(await client.callTool({
    name: "chasm_score",
    arguments: {
      inputs: {
        customer_mix: { innovators_visionaries: 65, pragmatists: 20, dont_know: 15 },
        acquisition_trend: "stalling",
        pain_specificity: "broad-value-prop",
        whole_product: "partial",
        beachhead_named: "several-segments",
        reference_customers: "only-visionary-references",
      },
    },
  })));
  record(
    "chasm: score assigns at-the-chasm + names ≥2 placing signals, no persistence_warning",
    runResult.stage === "at-the-chasm" &&
      Array.isArray(runResult.placing_signals) &&
      runResult.placing_signals.length >= 2 &&
      runResult.persistence_warning === undefined,
    JSON.stringify(runResult).slice(0, 300),
  );

  const file = path.join(dataDir, "_pending", "crossing-the-chasm-stage-pending.json");
  record("chasm: score wrote pending file", fsSync.existsSync(file));

  const after = JSON.parse(contentText(await client.callTool({ name: "chasm_get_pending_narration", arguments: {} })));
  record(
    "chasm: get_pending after score returns brief carrying stage + at_chasm_line",
    after.status === "ready" &&
      after.brief?.type === "narration_brief" &&
      after.brief?.inputs?.stage === "at-the-chasm" &&
      typeof after.brief?.inputs?.at_chasm_line === "string" &&
      typeof after.brief?.inputs?.next_play === "string",
  );

  // narrate is pure compute
  const beforeContent = await fs.readFile(file, "utf8");
  const beforeMtime = (await fs.stat(file)).mtimeMs;
  await client.callTool({
    name: "chasm_narrate",
    arguments: {
      inputs: {
        customer_mix: { innovators_visionaries: 20, pragmatists: 70, dont_know: 10 },
        acquisition_trend: "accelerating",
        pain_specificity: "one-sentence-named-pain",
        whole_product: "yes-complete",
        beachhead_named: "several-segments",
        reference_customers: "pragmatist-references-exist",
      },
    },
  });
  const afterContent = await fs.readFile(file, "utf8");
  const afterMtime = (await fs.stat(file)).mtimeMs;
  record(
    "chasm: narrate is pure compute (pending file untouched)",
    beforeContent === afterContent && beforeMtime === afterMtime,
  );
}

function contentText(result: unknown): string {
  if (typeof result !== "object" || result === null) return "";
  const content = (result as { content?: unknown[] }).content;
  if (!Array.isArray(content) || content.length === 0) return "";
  const first = content[0];
  if (typeof first === "object" && first !== null && "text" in first) {
    const text = (first as { text: unknown }).text;
    return typeof text === "string" ? text : "";
  }
  return "";
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
