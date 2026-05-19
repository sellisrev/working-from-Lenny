import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import os from "node:os";
import { zodToJsonSchema } from "zod-to-json-schema";

import * as scoreTool from "../src/tools/pm-pitfalls/score";
import * as narrateTool from "../src/tools/pm-pitfalls/narrate";
import * as driftTool from "../src/tools/pm-pitfalls/drift";

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
  await checkUiBuild();

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
  const tools = [scoreTool, narrateTool, driftTool];
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
      const result = await scoreTool.invoke(c.input, undefined as never);
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
      const result = (await driftTool.invoke(
        { user_id: c.user_id, current_audit: c.current_audit } as never,
        undefined as never,
      )) as Record<string, unknown>;
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
  const distHtml = path.join(bundleRoot, "dist", "ui", "pitfalls.html");
  if (!fsSync.existsSync(distHtml)) {
    record(
      "ui built",
      false,
      "dist/ui/pitfalls.html missing - run pnpm run build first",
    );
    return;
  }
  const body = await fs.readFile(distHtml, "utf8");
  if (body.includes("<!-- include:")) {
    record("ui includes inlined", false, "raw include directive still present");
    return;
  }
  if (!body.includes("window.mcp")) {
    record("ui mcp helper present", false, "mcp-rpc.js was not inlined");
    return;
  }
  record("ui inlined", true);
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
