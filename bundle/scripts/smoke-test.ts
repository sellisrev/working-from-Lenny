import fs from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * End-to-end smoke test that exercises the bundle as a real MCP host would.
 * Stages the bundle into a fresh install-root (same layout `mcpb pack`
 * produces), spawns the server, and connects an MCP client over stdio. Runs
 * each tool through one realistic input and verifies the resource URI
 * resolves. Path 4: narrate returns a structured narration brief (corpus +
 * picks + voice rules) for the host chat model to render — no sampling call.
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

  // Stage the runtime read-only assets (same logic as scripts/pack.ts).
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

  // Sanity: confirm the staged paths the prompt/corpus loaders will reach for.
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
    await checkGetQuestions(client);
    await checkScore(client);
    await checkDriftFirstThenSecond(client);
    await checkNarrateReturnsBrief(client);
    await checkNarrateWithAnswersIncludesFullAudit(client);
    await checkResources(client);
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
      "pm_pitfalls_get_questions",
      "pm_pitfalls_narrate",
      "pm_pitfalls_score",
    ];
    const ok = JSON.stringify(names) === JSON.stringify(expected);
    record(
      "list_tools returns four pm-pitfalls tools",
      ok,
      ok ? undefined : `got ${JSON.stringify(names)}`,
    );
  } catch (err) {
    record("list_tools", false, (err as Error).message);
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
      ) &&
      typeof parsed.note === "string";
    record(
      "call get_questions returns 20 canonical questions",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record("call get_questions", false, (err as Error).message);
  }
}

async function checkScore(client: Client): Promise<void> {
  try {
    const answers = Array<"sometimes">(20).fill("sometimes");
    const result = await client.callTool({
      name: "pm_pitfalls_score",
      arguments: { answers },
    });
    if (result.isError) {
      record("call score (all sometimes)", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const ok =
      parsed.score_display === 10 &&
      Array.isArray(parsed.top_three_pitfall_ids) &&
      parsed.top_three_pitfall_ids.length === 3 &&
      Array.isArray(parsed.exemplar_quotes) &&
      parsed.exemplar_quotes.length === 3 &&
      Array.isArray(parsed.questions) &&
      parsed.questions.length === 20 &&
      parsed.questions[0]?.id === 1 &&
      typeof parsed.questions[0]?.text === "string";
    record(
      "call score (all sometimes -> 10/20, 3 picks, 20 questions)",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record("call score", false, (err as Error).message);
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
      record("call drift (first audit)", false, contentText(first));
      return;
    }
    const firstParsed = JSON.parse(contentText(first));
    const firstOk =
      firstParsed.status === "first_audit" && firstParsed.audit_count === 1;
    record(
      "call drift (first audit -> status=first_audit)",
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
      record("call drift (second audit)", false, contentText(second));
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
      "call drift (second audit -> drift_report with two shifts)",
      secondOk,
      secondOk ? undefined : JSON.stringify(secondParsed),
    );
  } catch (err) {
    record("call drift", false, (err as Error).message);
  }
}

async function checkNarrateReturnsBrief(client: Client): Promise<void> {
  try {
    const result = await client.callTool({
      name: "pm_pitfalls_narrate",
      arguments: {
        score_display: 10,
        top_three_pitfall_ids: [1, 2, 4],
        user_context: "smoke test",
      },
    });
    if (result.isError) {
      record("call narrate", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const picks = parsed?.inputs?.picks;
    const corpus = parsed?.corpus;
    const ok =
      parsed.type === "narration_brief" &&
      parsed.audience === "user" &&
      typeof parsed.directive === "string" &&
      Array.isArray(parsed.voice_rules) &&
      parsed.voice_rules.length > 0 &&
      Array.isArray(picks) &&
      picks.length === 3 &&
      picks.every(
        (p: { pitfall_id: number; pitfall_text: string; exemplar_quote: string; corpus_anchors: unknown }) =>
          typeof p.pitfall_id === "number" &&
          typeof p.pitfall_text === "string" &&
          typeof p.exemplar_quote === "string" &&
          Array.isArray(p.corpus_anchors),
      ) &&
      corpus &&
      typeof corpus === "object" &&
      Object.keys(corpus).length > 0;
    record(
      "call narrate returns structured narration brief",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record("call narrate", false, (err as Error).message);
  }
}

async function checkNarrateWithAnswersIncludesFullAudit(client: Client): Promise<void> {
  try {
    const answers = Array<"sometimes">(20).fill("sometimes");
    const result = await client.callTool({
      name: "pm_pitfalls_narrate",
      arguments: {
        score_display: 10,
        top_three_pitfall_ids: [1, 2, 4],
        user_context: "smoke test with answers",
        answers,
      },
    });
    if (result.isError) {
      record("call narrate with answers", false, contentText(result));
      return;
    }
    const parsed = JSON.parse(contentText(result));
    const full = parsed?.inputs?.full_audit;
    const picksHaveAnswers = (parsed?.inputs?.picks ?? []).every(
      (p: { user_answer?: string }) => typeof p.user_answer === "string",
    );
    const ok =
      Array.isArray(full) &&
      full.length === 20 &&
      full.every(
        (e: { pitfall_id: number; pitfall_text: string; user_answer: string }) =>
          typeof e.pitfall_id === "number" &&
          typeof e.pitfall_text === "string" &&
          ["always", "sometimes", "never"].includes(e.user_answer),
      ) &&
      picksHaveAnswers &&
      typeof parsed.directive === "string" &&
      parsed.directive.includes("full_audit");
    record(
      "call narrate with answers includes full_audit and grounded directive",
      ok,
      ok ? undefined : JSON.stringify(parsed).slice(0, 200),
    );
  } catch (err) {
    record("call narrate with answers", false, (err as Error).message);
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
    record("list_resources includes pitfalls UI", true);

    const read = await client.readResource({ uri });
    const first = read.contents[0];
    const text = first && "text" in first ? first.text : undefined;
    const ok =
      first?.mimeType === "text/html" &&
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
