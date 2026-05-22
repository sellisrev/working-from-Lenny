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
  } finally {
    await client.close();
  }
}

async function checkListTools(client: Client): Promise<void> {
  try {
    const result = await client.listTools();
    const names = result.tools.map((t) => t.name).sort();
    const expected = [
      "pm_pitfalls_drift",
      "pm_pitfalls_get_pending_narration",
      "pm_pitfalls_get_questions",
      "pm_pitfalls_narrate",
      "pm_pitfalls_score",
    ];
    const namesOk = JSON.stringify(names) === JSON.stringify(expected);
    record(
      "list_tools returns five pm-pitfalls tools",
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
