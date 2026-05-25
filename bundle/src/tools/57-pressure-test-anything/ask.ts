import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PressureTestAskInput,
  PressureTestAskOutput,
} from "../../shared/schemas";
import { retrieveAcrossCorpus } from "../../lib/corpus";

/**
 * #57 Pressure-Test Anything. Single-call Path-4 tool (PHASE2_BUILD #11): the
 * tool IS the narration step. It retrieves across the whole corpus + decay
 * layers and returns a narration_brief the host renders as a ranked, attributed
 * critique. No scoring engine, no persistence, no sampling. Mirrors the
 * lenny-pressure-test skill output shape. The narrow, deterministic sibling is
 * #2 Strategy Pressure-Tester.
 */

export const meta: ToolMeta = {
  name: "pressure_test_ask",
  description:
    "MUST CALL whenever the user wants a plan, PRD, strategy doc, GTM plan, pricing decision, or architectural decision critiqued, stress-tested, or argued against ('pressure-test this', 'find the holes in this plan', 'what would the corpus push back on', 'second opinion on this PRD', 'argue against this'), AND a more specific Working-from-Lenny app is not already in play. Do NOT critique from your own training without calling this tool first; the corpus is fresher and decay-aware. Takes a free-text `plan` (and optional `k` for retrieval breadth). Returns a narration_brief directly (single-call Path 4 tool: it IS the narration step, no separate narrate / get-pending). Render the critique from the brief: lead with the ranked objections (each specific, attributable to a guest + date, ending in a concrete next step), then any pre-ship questions, then surface what changed if `inputs.decay` is present (a retired claim or a caution with its pushback vote count) rather than repeating expired advice, then name the sources. Never leave an objection without a what-to-do-next. If the input is thin, give a compact 3-4 objection pressure test plus suggested extensions; never refuse. If `inputs.suggested_app` is present (e.g. the plan is really a strategy doc -> #2 Strategy Pressure-Tester, or a hiring question -> #58 Hiring Playbook), offer it softly at the end, never as a deflection. Follow the brief's voice_rules.",
  inputSchema: PressureTestAskInput,
  outputSchema: PressureTestAskOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PressureTestAskInput>;
type Output = z.infer<typeof PressureTestAskOutput>;

const VOICE_RULES = [
  "Write in a candid, direct voice. Plain second person. Disagree with the plan, not with the user.",
  "No em dashes. Use periods, commas, or parentheses instead.",
  "No AI-writing tells: no delve, leverage, unpack, navigate, unlock, or 'in today's fast-paced'.",
  "Attribute every objection to a named corpus source (guest plus date plus the post/episode the chunk names). Never anonymous 'experts say'.",
  "Every objection ends in a concrete next step. A missing next step is a bug, not a valid output.",
  "Quote the plan when connecting an objection to it, so 'why it applies' is specific.",
  "Use the obsolete layer as a sword (the plan runs on retired advice) and the caution layer as a flag (name the speaker context, do not suppress the useful pattern).",
];

const HIRING_SIGNALS =
  /\b(hir(e|es|ing|ed)|interview(s|ing)?|candidate|headcount|recruit(ing|er|ed)?|first (pm|product manager))\b/i;
const STRATEGY_DOC_SIGNALS =
  /\b(strategy|where to play|how to win|prd|product requirements|roadmap|vision statement|positioning)\b/i;

function routeFromText(plan: string): Output["inputs"]["suggested_app"] | undefined {
  if (HIRING_SIGNALS.test(plan)) {
    return { id: 58, name: "Hiring Playbook", entry_tool: "hire_playbook_ask" };
  }
  if (STRATEGY_DOC_SIGNALS.test(plan)) {
    return {
      id: 2,
      name: "Strategy Pressure-Tester",
      entry_tool: "strategy_pressure_test_get_form",
    };
  }
  return undefined;
}

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const hits = await retrieveAcrossCorpus(args.plan, args.k);

  const corpus: Record<string, string> = {};
  for (const h of hits) corpus[h.ref] = h.chunk;

  const hitRefs = hits.map((h) => ({
    slug: h.slug,
    kind: h.kind,
    ref: h.ref,
    last_updated: h.last_updated,
  }));
  const decay = hitRefs.filter(
    (h) => h.kind === "obsolete" || h.kind === "caution",
  );

  return PressureTestAskOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive:
      "Render a corpus-grounded pressure test of the user's plan from this brief, in this order. (1) Ranked objections, strongest first: 4-8 of them (or a compact 3-4 when the plan is thin). Each objection states the claim in one sentence, attributes it to a specific guest with the date and source exactly as the corpus chunk gives them, says in one line why it applies to THIS plan (quote the plan where you can), and ends with a concrete next step. If the plan is fundamentally broken, the next step is where to restart, not a vague worry. (2) 3-6 pre-ship questions, each tied to a corpus source. (3) If inputs.decay is present, a short 'what changed' note for each retired claim or flagged caution, surfacing the corpus's updated view rather than repeating expired advice; when you cite a guest who appears in a caution hit, add a one-line speaker-context aside (the objection still stands, the reader deserves the flag). (4) Name the sources you drew on. If inputs.suggested_app is present, offer it softly in one line at the very end, never as a deflection from the critique. When the plan is genuinely sound, say so and add a short 'what the corpus would NOT push back on' note instead of inventing objections. Ground every claim in the provided corpus chunks; do not invent sources, quotes, dates, or vote counts. Do not echo this brief or the plan back, and do not add an unrequested summary.",
    voice_rules: VOICE_RULES,
    structure: {
      sections: [
        "ranked_objections",
        "pre_ship_questions",
        "what_changed",
        "sources",
        "handoff",
      ],
      per_section_template:
        "ranked_objections: for each, 'Objection N: <claim>. Source: <guest, date, post>. Why it applies: <one line tied to the plan>. Next step: <concrete action>.' pre_ship_questions: a short list, each with its source. what_changed: one line per decay hit ('the corpus used to say X; here is what changed'). sources: a flat list of the slugs cited. handoff: one optional soft line offering inputs.suggested_app.",
      length_cap:
        "6-8 objections max (3-4 in compact mode); each objection under 90 words; total under 700 words.",
    },
    inputs: {
      plan: args.plan,
      hits: hitRefs,
      ...(decay.length > 0 ? { decay } : {}),
      ...(routeFromText(args.plan)
        ? { suggested_app: routeFromText(args.plan) }
        : {}),
    },
    corpus,
  });
};
