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
import { SamplingUnavailableError } from "./shared/types";
import { configureSampling } from "./lib/sampling";
import { bundleRoot } from "./lib/paths";

import * as questionsTool from "./tools/pm-pitfalls/questions";
import * as scoreTool from "./tools/pm-pitfalls/score";
import * as narrateTool from "./tools/pm-pitfalls/narrate";
import * as driftTool from "./tools/pm-pitfalls/drift";

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
];

const RESOURCES: ResourceEntry[] = [
  {
    uri: "ui://working-from-lenny/pitfalls",
    name: "PM Pitfalls Self-Audit",
    description:
      "Twenty corpus-derived PM pitfalls. User rates each, gets back the three highest-leverage to fix this quarter.",
    mimeType: "text/html",
    filePath: path.join(bundleRoot(), "dist", "ui", "pitfalls.html"),
  },
];

// stderr logging is what appears in Claude Desktop's extension log file.
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
    `node=${process.version} platform=${process.platform} cwd=${process.cwd()} bundleRoot=${process.env.WFL_BUNDLE_ROOT ?? "<unset>"} dataDir=${process.env.WFL_DATA_DIR ?? "<unset>"}`,
  );

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

  configureSampling(server, {
    api_key: process.env.api_key,
    api_provider:
      (process.env.api_provider as "anthropic" | "gemini" | "openai" | undefined) ??
      "anthropic",
  });

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
      if (err instanceof SamplingUnavailableError) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Inference unavailable. ${err.message}`,
            },
          ],
        };
      }
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
