import fs from "node:fs/promises";
import path from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ToolMeta } from "./shared/types";
import { bundleRoot, dataDir } from "./lib/paths";

import * as questionsTool from "./tools/pm-pitfalls/questions";
import * as scoreTool from "./tools/pm-pitfalls/score";
import * as narrateTool from "./tools/pm-pitfalls/narrate";
import * as driftTool from "./tools/pm-pitfalls/drift";
import * as getPendingTool from "./tools/pm-pitfalls/get-pending";
import { cleanupOrphanedTmp } from "./tools/pm-pitfalls/pending";

import * as horoscopeGetQuiz from "./tools/53-pm-horoscope/get-quiz";
import * as horoscopeScoreQuiz from "./tools/53-pm-horoscope/score-quiz";
import * as horoscopeRead from "./tools/53-pm-horoscope/read";
import * as horoscopeNarrate from "./tools/53-pm-horoscope/narrate";
import * as horoscopeGetPending from "./tools/53-pm-horoscope/get-pending";
import { cleanupOrphanedTmp as cleanupHoroscopeTmp } from "./tools/53-pm-horoscope/pending";

import * as ladderGetQuestions from "./tools/3-pm-ladder/get-questions";
import * as ladderScore from "./tools/3-pm-ladder/score";
import * as ladderNarrate from "./tools/3-pm-ladder/narrate";
import * as ladderGetPending from "./tools/3-pm-ladder/get-pending";
import * as ladderCalibrate from "./tools/3-pm-ladder/calibrate";
import { cleanupOrphanedTmp as cleanupLadderTmp } from "./tools/3-pm-ladder/pending";

import * as pmifyGetModes from "./tools/51-pmify-inbox/get-modes";
import * as pmifyTranslate from "./tools/51-pmify-inbox/translate";
import * as pmifyNarrate from "./tools/51-pmify-inbox/narrate";
import * as pmifyGetPending from "./tools/51-pmify-inbox/get-pending";
import { cleanupOrphanedTmp as cleanupPmifyTmp } from "./tools/51-pmify-inbox/pending";

interface RegisteredTool {
  meta: ToolMeta;
  invoke: (args: unknown) => Promise<unknown>;
}

interface ResourceEntry {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  filePath: string;
}

const TOOLS: RegisteredTool[] = [
  questionsTool as unknown as RegisteredTool,
  scoreTool as unknown as RegisteredTool,
  narrateTool as unknown as RegisteredTool,
  driftTool as unknown as RegisteredTool,
  getPendingTool as unknown as RegisteredTool,
  horoscopeGetQuiz as unknown as RegisteredTool,
  horoscopeScoreQuiz as unknown as RegisteredTool,
  horoscopeRead as unknown as RegisteredTool,
  horoscopeNarrate as unknown as RegisteredTool,
  horoscopeGetPending as unknown as RegisteredTool,
  ladderGetQuestions as unknown as RegisteredTool,
  ladderScore as unknown as RegisteredTool,
  ladderNarrate as unknown as RegisteredTool,
  ladderGetPending as unknown as RegisteredTool,
  ladderCalibrate as unknown as RegisteredTool,
  pmifyGetModes as unknown as RegisteredTool,
  pmifyTranslate as unknown as RegisteredTool,
  pmifyNarrate as unknown as RegisteredTool,
  pmifyGetPending as unknown as RegisteredTool,
];

const RESOURCES: ResourceEntry[] = [
  {
    uri: "ui://working-from-lenny/pitfalls",
    name: "PM Pitfalls Self-Audit",
    description:
      "Twenty corpus-derived PM pitfalls. User rates each, gets back the three highest-leverage to fix this quarter.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "pitfalls.html"),
  },
  {
    uri: "ui://working-from-lenny/horoscope",
    name: "PM Horoscope",
    description:
      "Six-question quiz maps the user to one of twelve corpus-derived PM archetypes and renders today's deterministic horoscope reading.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "horoscope.html"),
  },
  {
    uri: "ui://working-from-lenny/ladder",
    name: "PM Ladder Self-Assessment",
    description:
      "Thirty questions across five PM career dimensions (Scope / Ambiguity / Influence / Judgment / Craft). Returns the effective level, the per-dimension levels, the widest gap, and a corpus-grounded gap report.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "ladder.html"),
  },
  {
    uri: "ui://working-from-lenny/pmify",
    name: "PM-ify My Inbox",
    description:
      "Translates messages between plain English and corporate-PM-speak. Mode picker (pm-ify vs de-pm-ify) + textarea; the host chat model renders the translation + 2-4 deadpan footnotes citing the bad-PM patterns each translation triggers.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "pmify.html"),
  },
];

// stderr logging is what appears in interactive runs / smoke. Desktop pipes
// only its own host-side `[Working from Lenny]` lines, not server stderr —
// see STATUS.md "Note on Claude Desktop server-stderr logging".
function logErr(label: string, detail: unknown): void {
  try {
    const body =
      detail instanceof Error
        ? `${detail.message}\n${detail.stack ?? ""}`
        : typeof detail === "string"
          ? detail
          : JSON.stringify(detail, null, 2);
    // eslint-disable-next-line no-console
    console.error(`[wfl] ${label}: ${body}`);
  } catch {
    // eslint-disable-next-line no-console
    console.error(`[wfl] ${label}: <unserializable>`);
  }
}

process.on("uncaughtException", (err) => {
  logErr("uncaughtException", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  logErr("unhandledRejection", reason);
  process.exit(1);
});
process.on("exit", (code) => {
  // eslint-disable-next-line no-console
  console.error(`[wfl] process.exit code=${code}`);
});

async function main(): Promise<void> {
  logErr(
    "boot",
    `node=${process.version} platform=${process.platform} cwd=${process.cwd()} bundleRoot=${bundleRoot()} dataDir=${dataDir()} WFL_DATA_DIR_env=${process.env.WFL_DATA_DIR ?? "<unset>"}`,
  );

  // Hygiene: drop any orphaned .tmp left behind by an interrupted prior write
  // (process kill between writeFile and rename). Best-effort, non-fatal.
  try {
    await cleanupOrphanedTmp();
  } catch (err) {
    logErr("cleanup-tmp failed (non-fatal)", err);
  }
  try {
    await cleanupHoroscopeTmp();
  } catch (err) {
    logErr("cleanup-tmp horoscope failed (non-fatal)", err);
  }
  try {
    await cleanupLadderTmp();
  } catch (err) {
    logErr("cleanup-tmp ladder failed (non-fatal)", err);
  }
  try {
    await cleanupPmifyTmp();
  } catch (err) {
    logErr("cleanup-tmp pmify failed (non-fatal)", err);
  }

  const server = new Server(
    {
      name: "working-from-lenny",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = TOOLS.map((t) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schema: any = zodToJsonSchema(t.meta.inputSchema as never, {
        $refStrategy: "none",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entry: any = {
        name: t.meta.name,
        description: t.meta.description,
        inputSchema: schema,
      };
      if (t.meta.annotations) {
        entry.annotations = t.meta.annotations;
      }
      if (t.meta.uiResourceUri) {
        entry._meta = { ui: { resourceUri: t.meta.uiResourceUri } };
      }
      return entry;
    });
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const tool = TOOLS.find((t) => t.meta.name === req.params.name);
    if (!tool) {
      return {
        isError: true,
        content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }],
      };
    }
    const parsed = tool.meta.inputSchema.safeParse(req.params.arguments ?? {});
    if (!parsed.success) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Invalid arguments for ${req.params.name}: ${parsed.error.message}`,
          },
        ],
      };
    }
    try {
      const result = await tool.invoke(parsed.data);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Tool ${req.params.name} failed: ${(err as Error).message}`,
          },
        ],
      };
    }
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: RESOURCES.map((r) => ({
      uri: r.uri,
      name: r.name,
      description: r.description,
      mimeType: r.mimeType,
    })),
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    const r = RESOURCES.find((x) => x.uri === req.params.uri);
    if (!r) {
      throw new Error(`Unknown resource: ${req.params.uri}`);
    }
    const text = await fs.readFile(r.filePath, "utf8");
    return {
      contents: [
        {
          uri: r.uri,
          mimeType: r.mimeType,
          text,
        },
      ],
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  logErr("ready", "stdio transport connected, handlers registered");
}

main().catch((err) => {
  logErr("main crashed", err);
  process.exit(1);
});
