import type { z } from "zod";
import { FounderNarrateOutput } from "../shared/schemas";
import type { FounderInputsT } from "../shared/schemas";
import { CORPUS_ANCHORS, decide } from "../tools/12-38-founder-pm-hire/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof FounderNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Voice catalog #12-38 hook: fragments + parenthetical — 'Maybe. Not yet. Yes (and at which level).' The verdict is a clean call, not a hedge.",
  "Owner voice. Direct. No corporate softening.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Ground claims in the user's actual eight inputs. Do not invent stage, team size, density, or bottleneck.",
  "Address the founder in second person.",
];

const PER_SECTION_TEMPLATE = [
  "VERDICT — one paragraph. Lead with the verdict word in plain language ('Stay founder-mode for now', 'Not yet', 'Hire an APM', 'Hire an empowered PM', 'Hire a head of product'). Two sentences explaining why, anchored in user_inputs (stage, density, bandwidth, bottleneck).",
  "WHAT GOOD LOOKS LIKE — if verdict is 'not-yet': render the interim playbook (2-3 sentences of concrete action) + the date/signal that should prompt re-running this diagnostic. Otherwise: one paragraph on what good looks like at that level. Reference one specific behavior pattern from the corpus chunks. If verdict is 'stay-founder-mode', describe what good founder-mode looks like at this density and bandwidth (not 'you don't need to do anything').",
  "COST OF GETTING IT WRONG — the 2-3 most relevant wrong calls for this verdict from the wrong-fit cost table in prompt.md. Each wrong call gets one sentence on what it looks like in practice. Include the head-of-product mis-hire on every reading except when the verdict already IS hire-head-of-product (then include the 'too late' version: how a mis-timed hire wastes the first 6 months).",
].join("\n");

const DIRECTIVE = [
  "Render a founder-PM-hire verdict directly to the user.",
  "Open with the verdict word, not a preamble.",
  "Follow the per_section_template — three sections, owner voice, no hedging.",
  "Ground all claims in inputs.user_inputs (eight raw inputs the founder provided) and the corpus chunks. Do not invent inputs.",
  "If the verdict is 'not-yet', the second section IS the interim playbook — do not write a generic 'what good looks like'.",
  "Do not echo this brief back; transform it.",
].join(" ");

export interface BuildFounderBriefInput {
  inputs: FounderInputsT;
  user_context?: string;
}

export async function buildFounderNarrationBrief(
  args: BuildFounderBriefInput,
): Promise<Brief> {
  const { inputs, user_context } = args;
  const decision = decide(inputs);

  const corpusRaw = await loadCorpusChunks(CORPUS_ANCHORS);
  const corpus: Record<string, string> = {};
  for (const slug of CORPUS_ANCHORS) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return FounderNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: DIRECTIVE,
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["verdict", "what_good_looks_like", "cost_of_getting_it_wrong"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "400-500 words total.",
    },
    inputs: {
      verdict: decision.verdict,
      playbook: decision.playbook,
      user_inputs: inputs,
      user_context: user_context ?? "",
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
