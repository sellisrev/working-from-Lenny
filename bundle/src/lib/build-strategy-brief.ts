import type { z } from "zod";
import { StrategyNarrateOutput } from "../shared/schemas";
import type { StrategyDocType } from "../shared/schemas";
import {
  CORPUS_ANCHORS,
  classifyDocType,
} from "../tools/2-strategy-pressure-test/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof StrategyNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Voice catalog #2 hook: imperative + reversal — 'Pressure-test it now. The board has fewer hobbies than you do.' Land the critique with conviction; don't soften.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Direct, candid. If the doc is bad, say it is. If it's good, say that too.",
  "Curly quotes are fine when quoting from inputs.strategy_text.",
  "Address the user in second person. Don't refer to 'the author' — refer to 'you'.",
];

const PER_SECTION_TEMPLATE = [
  "Format each objection as a card:",
  "Objection N: {short label, 5-10 words}",
  "{2-4 sentence diagnosis. Direct. No corporate softening.}",
  "Anchor: {corpus topic file from inputs.corpus} — {one canonical quote, ≤30 words}",
  "",
  "For doc_type='mixed', PREPEND a sixth card BEFORE the five regular objections:",
  "'Before the five: this document is shaped like a roadmap. It uses strategy vocabulary but the operative content is a feature list by quarter. The critique below assumes you wanted strategy. If you wanted a roadmap, ignore all five and ask instead: are these features the right ones?'",
].join("\n");

function modeDirective(docType: StrategyDocType): string {
  if (docType === "mixed") {
    return "MIXED detected. Lead with the sixth card per the per_section_template, then render the five objections.";
  }
  if (docType === "prd") {
    return "PRD detected. Run the four passes adapted to single-feature scope: Rumelt becomes 'does the PRD name a problem worth solving?'; tradeoffs become 'what scope are you explicitly cutting?'; assumptions stay; stress scenario becomes 'what shipping risk are you under-counting?'.";
  }
  if (docType === "roadmap") {
    return "ROADMAP detected. The critique will be cleanly applicable to a roadmap; do not pretend it's strategy. Frame Rumelt as 'this is a roadmap not a strategy — here are the questions you'd need a strategy to answer'.";
  }
  return "STRATEGY detected. Apply the four passes as specified.";
}

const DIRECTIVE_BASE = [
  "Render a pressure-test critique of inputs.strategy_text directly to the user.",
  "Five objection cards (or six if doc_type='mixed'), each ≤4 sentences of diagnosis + one corpus anchor with a ≤30-word quote.",
  "Apply the four passes from PASSES: Rumelt diagnosis → missing tradeoffs → untested assumptions → six-month stress scenario, with the fifth card pulled from whichever pass had the strongest signal.",
  "Anchor each card to a slug from inputs.corpus; do not cite anchors that aren't in the pool.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildStrategyBriefInput {
  strategy_text: string;
  user_context?: string;
  doc_type?: StrategyDocType;
}

export async function buildStrategyNarrationBrief(
  args: BuildStrategyBriefInput,
): Promise<Brief> {
  const docType = args.doc_type ?? classifyDocType(args.strategy_text);

  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return StrategyNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: `${DIRECTIVE_BASE} ${modeDirective(docType)}`,
    voice_rules: VOICE_RULES,
    structure: {
      sections: docType === "mixed"
        ? ["mixed_preamble", "objection_1", "objection_2", "objection_3", "objection_4", "objection_5"]
        : ["objection_1", "objection_2", "objection_3", "objection_4", "objection_5"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each objection ≤4 sentences of diagnosis. Total under 600 words.",
    },
    inputs: {
      doc_type: docType,
      strategy_text: args.strategy_text,
      user_context: args.user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
