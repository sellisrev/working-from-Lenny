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

import * as hybGetModes from "./tools/52-how-you-build/get-modes";
import * as hybGenerate from "./tools/52-how-you-build/generate";
import * as hybNarrate from "./tools/52-how-you-build/narrate";
import * as hybGetPending from "./tools/52-how-you-build/get-pending";
import { cleanupOrphanedTmp as cleanupHybTmp } from "./tools/52-how-you-build/pending";

import * as founderGetForm from "./tools/12-38-founder-pm-hire/get-form";
import * as founderDecide from "./tools/12-38-founder-pm-hire/decide";
import * as founderNarrate from "./tools/12-38-founder-pm-hire/narrate";
import * as founderGetPending from "./tools/12-38-founder-pm-hire/get-pending";
import { cleanupOrphanedTmp as cleanupFounderTmp } from "./tools/12-38-founder-pm-hire/pending";

import * as strategyGetForm from "./tools/2-strategy-pressure-test/get-form";
import * as strategyTest from "./tools/2-strategy-pressure-test/pressure-test";
import * as strategyNarrate from "./tools/2-strategy-pressure-test/narrate";
import * as strategyGetPending from "./tools/2-strategy-pressure-test/get-pending";
import { cleanupOrphanedTmp as cleanupStrategyTmp } from "./tools/2-strategy-pressure-test/pending";

import * as evalGetForm from "./tools/6-ai-eval-coverage/get-form";
import * as evalScore from "./tools/6-ai-eval-coverage/score-coverage";
import * as evalNarrate from "./tools/6-ai-eval-coverage/narrate";
import * as evalGetPending from "./tools/6-ai-eval-coverage/get-pending";
import { cleanupOrphanedTmp as cleanupEvalTmp } from "./tools/6-ai-eval-coverage/pending";

import * as nsmGetForm from "./tools/9-nsm-finder/get-form";
import * as nsmRun from "./tools/9-nsm-finder/run";
import * as nsmNarrate from "./tools/9-nsm-finder/narrate";
import * as nsmGetPending from "./tools/9-nsm-finder/get-pending";
import { cleanupOrphanedTmp as cleanupNsmTmp } from "./tools/9-nsm-finder/pending";

import * as okrGetForm from "./tools/24-okr-critique/get-form";
import * as okrRun from "./tools/24-okr-critique/run";
import * as okrNarrate from "./tools/24-okr-critique/narrate";
import * as okrGetPending from "./tools/24-okr-critique/get-pending";
import { cleanupOrphanedTmp as cleanupOkrTmp } from "./tools/24-okr-critique/pending";

import * as mvsGetForm from "./tools/47-mission-vision-alignment/get-form";
import * as mvsRun from "./tools/47-mission-vision-alignment/run";
import * as mvsNarrate from "./tools/47-mission-vision-alignment/narrate";
import * as mvsGetPending from "./tools/47-mission-vision-alignment/get-pending";
import { cleanupOrphanedTmp as cleanupMvsTmp } from "./tools/47-mission-vision-alignment/pending";

import * as activationGetForm from "./tools/37-activation-metric-finder/get-form";
import * as activationRun from "./tools/37-activation-metric-finder/run";
import * as activationNarrate from "./tools/37-activation-metric-finder/narrate";
import * as activationGetPending from "./tools/37-activation-metric-finder/get-pending";
import { cleanupOrphanedTmp as cleanupActivationTmp } from "./tools/37-activation-metric-finder/pending";

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
  hybGetModes as unknown as RegisteredTool,
  hybGenerate as unknown as RegisteredTool,
  hybNarrate as unknown as RegisteredTool,
  hybGetPending as unknown as RegisteredTool,
  founderGetForm as unknown as RegisteredTool,
  founderDecide as unknown as RegisteredTool,
  founderNarrate as unknown as RegisteredTool,
  founderGetPending as unknown as RegisteredTool,
  strategyGetForm as unknown as RegisteredTool,
  strategyTest as unknown as RegisteredTool,
  strategyNarrate as unknown as RegisteredTool,
  strategyGetPending as unknown as RegisteredTool,
  evalGetForm as unknown as RegisteredTool,
  evalScore as unknown as RegisteredTool,
  evalNarrate as unknown as RegisteredTool,
  evalGetPending as unknown as RegisteredTool,
  nsmGetForm as unknown as RegisteredTool,
  nsmRun as unknown as RegisteredTool,
  nsmNarrate as unknown as RegisteredTool,
  nsmGetPending as unknown as RegisteredTool,
  okrGetForm as unknown as RegisteredTool,
  okrRun as unknown as RegisteredTool,
  okrNarrate as unknown as RegisteredTool,
  okrGetPending as unknown as RegisteredTool,
  mvsGetForm as unknown as RegisteredTool,
  mvsRun as unknown as RegisteredTool,
  mvsNarrate as unknown as RegisteredTool,
  mvsGetPending as unknown as RegisteredTool,
  activationGetForm as unknown as RegisteredTool,
  activationRun as unknown as RegisteredTool,
  activationNarrate as unknown as RegisteredTool,
  activationGetPending as unknown as RegisteredTool,
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
  {
    uri: "ui://working-from-lenny/how-you-build",
    name: "How [You] Build Product",
    description:
      "Parody generator for the breathless-reverence-profile genre. Six structured-input fields (PM/eng/designer counts + tools + rituals + last_shipped) plus three modes: reverence-profile, linkedin-humblebrag, acquired-cold-open.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "how-you-build.html"),
  },
  {
    uri: "ui://working-from-lenny/founder-pm-hire",
    name: "Founder PM hire",
    description:
      "Eight-input wizard. Deterministic decision tree runs against your stage / team / founder-time / density / bottleneck / bandwidth signals and returns one of five verdicts (stay-founder-mode / not-yet / hire-apm / hire-empowered-pm / hire-head-of-product) plus an interim playbook when not-yet.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "founder-pm-hire.html"),
  },
  {
    uri: "ui://working-from-lenny/strategy-pressure-test",
    name: "Strategy Pressure-Tester",
    description:
      "Paste a strategy doc / PRD / roadmap (200-4000 chars). Deterministic doc-type router classifies the document, then a four-pass corpus-grounded critique (Rumelt diagnosis / missing tradeoffs / untested assumptions / six-month stress scenario) renders as five objection cards.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "strategy-pressure-test.html"),
  },
  {
    uri: "ui://working-from-lenny/ai-eval-coverage",
    name: "AI Eval Coverage Scorecard",
    description:
      "Three-input wizard (feature one-liner / audience / failure modes). Seven fixed eval categories (correctness / refusal / latency / hallucination / jailbreak / regression / drift), deterministic 0-100 coverage score, plus 2-3 starter eval prompts per missing or partial category.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "ai-eval-coverage.html"),
  },
  {
    uri: "ui://working-from-lenny/nsm-finder",
    name: "North Star Metric Finder",
    description:
      "Multi-field wizard (business shape / monetization / revenue band / stage / friction / primary user action, plus optional 'what makes you unusual' and a dashboard paste). Deterministic business-shape → NSM-family mapping; three candidate NSMs with per-candidate critique (vanity risk, leading-vs-lagging, gameability, break case) + 3-5 leading input metrics + optional dashboard audit.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "nsm-finder.html"),
  },
  {
    uri: "ui://working-from-lenny/okr-critique",
    name: "OKR Critique",
    description:
      "Paste 100-3000 chars of draft OKRs. Cheap parser extracts an objective/KR tree; the host model applies four tests per KR (outcome-vs-activity, measurable, single-team-fit, too-many), writes per-stance synthesis (orthodox / skeptical / hybrid), and produces a paste-ready rewritten set. Org-level mode adds a cross-team coherence pass.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "okr-critique.html"),
  },
  {
    uri: "ui://working-from-lenny/mvs-alignment",
    name: "Mission / Vision / Strategy Alignment",
    description:
      "Paste mission (≥50 chars) + vision (≥50 chars) + strategy (200-3000 chars). Four-section reading: drift map (three pairwise comparisons), platitude detector, operational gaps (named bets → roadmap questions), Rumelt diagnosis applied to the strategy.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "mvs-alignment.html"),
  },
  {
    uri: "ui://working-from-lenny/activation-finder",
    name: "Activation Metric Finder",
    description:
      "Multi-field wizard (business shape + monetization + stage + primary value action, plus optional aha-moment guess, current activation-rate estimate, and a funnel paste). Deterministic business-shape → activation-event-family mapping; three candidate activation events with per-candidate critique (vanity risk, leading-vs-retention, friction balance, customer-interview signal), benchmark range read from corpus, plus 3-5 input metrics in #9-NSM-compatible shape, plus optional funnel audit. Pairs with #9 NSM Finder.",
    mimeType: "text/html;profile=mcp-app",
    filePath: path.join(bundleRoot(), "dist", "ui", "activation-finder.html"),
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
  try {
    await cleanupHybTmp();
  } catch (err) {
    logErr("cleanup-tmp how-you-build failed (non-fatal)", err);
  }
  try {
    await cleanupFounderTmp();
  } catch (err) {
    logErr("cleanup-tmp founder failed (non-fatal)", err);
  }
  try {
    await cleanupStrategyTmp();
  } catch (err) {
    logErr("cleanup-tmp strategy failed (non-fatal)", err);
  }
  try {
    await cleanupEvalTmp();
  } catch (err) {
    logErr("cleanup-tmp eval failed (non-fatal)", err);
  }
  try {
    await cleanupNsmTmp();
  } catch (err) {
    logErr("cleanup-tmp nsm failed (non-fatal)", err);
  }
  try {
    await cleanupOkrTmp();
  } catch (err) {
    logErr("cleanup-tmp okr failed (non-fatal)", err);
  }
  try {
    await cleanupMvsTmp();
  } catch (err) {
    logErr("cleanup-tmp mvs failed (non-fatal)", err);
  }
  try {
    await cleanupActivationTmp();
  } catch (err) {
    logErr("cleanup-tmp activation failed (non-fatal)", err);
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
