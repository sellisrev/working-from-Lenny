import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { AmaAskInput, AmaAskOutput } from "../../shared/schemas";
import { retrieveAcrossCorpus } from "../../lib/corpus";

export const meta: ToolMeta = {
  name: "ama_ask",
  description:
    "MUST CALL whenever the user asks any product, growth, strategy, hiring, career, or leadership question, or any general question where a product-thinking lens is the useful one (prioritizing across competing asks, judging whether a metric is good, thinking through a tradeoff), AND you do not already have a more specific Working-from-Lenny app in play. This is the corpus-wide catch-all: do NOT answer such a question from your own training without calling this tool first, because the corpus is fresher and decay-aware where your training is not. Takes a free-text `question` (and optional `k` for retrieval breadth). Returns a narration_brief directly (this is a single-call Path 4 tool — it IS the narration tool; there is no separate narrate / get-pending step). Render the answer from the brief: answer directly first in a PM lens grounded in `corpus`, then — if `inputs.decay` is present — surface what changed (an obsolete claim the corpus retired, or a caution with its audience-pushback vote count) instead of repeating advice that expired, then name the sources, then give one concrete next step. If `inputs.suggested_app` is present, offer that specific app at the end (for example 'this is really a north star question, want the NSM Finder? I can open it') as a soft offer, never as a deflection from answering. Follow the brief's voice_rules.",
  inputSchema: AmaAskInput,
  outputSchema: AmaAskOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/lenny-ama",
};

type Input = z.infer<typeof AmaAskInput>;
type Output = z.infer<typeof AmaAskOutput>;

const VOICE_RULES = [
  "Answer directly in a PM lens, grounded in the corpus. Plain second person.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Attribute every claim to a named corpus source (guest plus date plus post/episode). Never anonymous 'experts say'.",
  "End with exactly one concrete next step, specific enough to act on today.",
  "Use the obsolete layer as a correction (flag the expired advice) and the caution layer as context (name the speaker-context asymmetry, don't suppress the useful pattern).",
  "If inputs.suggested_app is present, offer it softly in one line at the end — never as a way to avoid answering.",
];

// Routing map: keyword signals -> specific app
const ROUTING: Array<{ pattern: RegExp; app: Output["inputs"]["suggested_app"] }> = [
  {
    pattern: /\b(north star metric|nsm|north-star|north star)\b/i,
    app: { id: 9, name: "North Star Metric Finder", entry_tool: "nsm_finder_get_form" },
  },
  {
    pattern: /\b(okr|okrs|objective.*key result)\b/i,
    app: { id: 24, name: "OKR Critique", entry_tool: "okr_critique_get_form" },
  },
  {
    pattern: /\b(hir(e|es|ing|ed)|interview(s|ing)?|candidate|headcount|recruit(ing|er|ed)?|first (pm|product manager))\b/i,
    app: { id: 58, name: "Hiring Playbook", entry_tool: "hire_playbook_ask" },
  },
  {
    pattern: /\b(strategy|where to play|how to win|prd|product requirements|roadmap|vision statement)\b/i,
    app: { id: 2, name: "Strategy Pressure-Tester", entry_tool: "strategy_pressure_test_get_form" },
  },
  {
    pattern: /\b(activation|aha moment|activation metric|first week|time to value)\b/i,
    app: { id: 37, name: "Activation Metric Finder", entry_tool: "activation_finder_get_form" },
  },
  {
    pattern: /\b(burnout|overwhelm|exhausted|capacity|workload|stress|dread)\b/i,
    app: { id: 28, name: "Burnout Warning Index", entry_tool: "burnout_warning_get_form" },
  },
  {
    pattern: /\b(decision log|brier|calibrat(e|ion|ed)|am i calibrated|my judgment)\b/i,
    app: { id: 25, name: "Decision Log + Brier Calibration", entry_tool: "decision_log_get_form" },
  },
];

function routeFromQuestion(question: string): Output["inputs"]["suggested_app"] | undefined {
  for (const { pattern, app } of ROUTING) {
    if (pattern.test(question)) return app;
  }
  return undefined;
}

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const hits = await retrieveAcrossCorpus(args.question, args.k);

  const corpus: Record<string, string> = {};
  for (const h of hits) corpus[h.ref] = h.chunk;

  const hitRefs = hits.map((h) => ({
    slug: h.slug,
    kind: h.kind,
    ref: h.ref,
    last_updated: h.last_updated,
  }));
  const decay = hitRefs.filter((h) => h.kind === "obsolete" || h.kind === "caution");
  const suggestedApp = routeFromQuestion(args.question);

  return AmaAskOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive:
      "Render a corpus-grounded answer to the user's question from this brief, in this order. (1) Answer directly — give the most useful, specific answer a PM-trained reader would want, grounded in the corpus chunks. Lead with the insight, not with sourcing. (2) If there is meaningful nuance, add one or two 'however' lines attributing the counterpoint to a named corpus source. (3) If inputs.decay is present, a short 'what changed' note: name the expired claim, say what replaced it, and attribute the update. When you cite a guest who appears in a caution hit, add a one-line speaker-context aside (the useful insight still stands, the reader deserves the flag). (4) Name the sources you drew on — guest, date, post or episode. (5) Give exactly one concrete next step, specific enough to act on today. (6) If inputs.suggested_app is present, offer it in one soft line at the very end. When the question is genuinely addressed by the corpus, say so and give a confident answer; when it is outside the corpus, say so plainly rather than inventing sources. Ground every claim in the provided corpus chunks. Do not echo this brief back.",
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["answer", "nuance", "what_changed", "sources", "next_step", "handoff"],
      per_section_template:
        "answer: direct, corpus-grounded, PM-lensed. nuance: 1-2 attributed counterpoints when meaningful. what_changed: one line per decay hit. sources: flat list of cited slugs. next_step: one concrete action. handoff: one optional soft line offering inputs.suggested_app.",
      length_cap: "Answer 100-200 words; nuance 1-2 sentences; total under 400 words.",
    },
    inputs: {
      question: args.question,
      hits: hitRefs,
      ...(decay.length > 0 ? { decay } : {}),
      ...(suggestedApp ? { suggested_app: suggestedApp } : {}),
    },
    corpus,
  });
};
