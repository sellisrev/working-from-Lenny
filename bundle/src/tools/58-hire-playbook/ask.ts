import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HirePlaybookAskInput,
  HirePlaybookAskOutput,
} from "../../shared/schemas";
import { retrieveAcrossCorpus } from "../../lib/corpus";

/**
 * #58 Hiring Playbook. Single-call Path-4 tool (PHASE2_BUILD #11): the tool IS
 * the narration step. Corpus-wide retrieval over topics + cautions + books
 * (decay-aware over the cautions layer); returns a narration_brief the host
 * renders as a scenario-specific hiring playbook. No scoring engine, no
 * persistence, no sampling. Mirrors the lenny-hire skill output shape. The
 * narrow, deterministic sibling is #12-38 Founder PM hire.
 */

export const meta: ToolMeta = {
  name: "hire_playbook_ask",
  description:
    "MUST CALL whenever the user wants help hiring or interviewing for a role ('how do I hire a <role>', 'interviewing for <role>', 'how to evaluate a <role> candidate', 'should I hire <X>', 'what to probe in a <role> interview'), AND a more specific Working-from-Lenny app is not already in play. Do NOT answer from your own training without calling this tool first; the corpus is fresher and carries an attributed caution layer. Takes a free-text `scenario` (role + level + concern + candidate context, in any phrasing) and optional `k` for retrieval breadth. Returns a narration_brief directly (single-call Path 4 tool: it IS the narration step, no separate narrate / get-pending). Render the playbook from the brief: what-good-looks-like, signals to probe, common failure modes, attributed question scripts (each tied to a guest + date), then references; surface a one-line caution aside when citing a guest with an active caution file. If the input is thin, give a compact playbook (what-good-looks-like + a 3-bullet what-to-probe) plus suggested extensions; never refuse. If `inputs.suggested_app` is present (e.g. a founder's first-PM-hire decision -> #12-38 Founder PM hire, or a strategy question -> #57 Pressure-Test Anything), offer it softly at the end. Follow the brief's voice_rules.",
  inputSchema: HirePlaybookAskInput,
  outputSchema: HirePlaybookAskOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof HirePlaybookAskInput>;
type Output = z.infer<typeof HirePlaybookAskOutput>;

const VOICE_RULES = [
  "Write in a candid, direct voice. Plain second person.",
  "No em dashes. Use periods, commas, or parentheses instead.",
  "No AI-writing tells: no delve, leverage, unpack, navigate, unlock, or 'in today's fast-paced'.",
  "Attribute every claim and question script to a named corpus source (guest plus date plus the post/episode the chunk names). Never anonymous 'experts say'.",
  "Every signal to probe pairs with a concrete probe (a question, take-home, work-trial, or reference check).",
  "When a cited guest has an active caution file, add the one-line flag inline. Name the speaker context; do not suppress the useful pattern.",
];

const FOUNDER_FIRST_PM_SIGNALS =
  /\b(first (pm|product manager|product hire)|should (i|we) hire (a |our )?(first )?(pm|product manager)|founder.{0,30}(pm|product manager))\b/i;
const STRATEGY_SIGNALS =
  /\b(strategy|pressure[- ]?test|gtm|go to market|pricing|prd|roadmap|positioning)\b/i;

function routeFromText(
  scenario: string,
): Output["inputs"]["suggested_app"] | undefined {
  if (FOUNDER_FIRST_PM_SIGNALS.test(scenario)) {
    return {
      id: "12-38",
      name: "Founder PM hire",
      entry_tool: "founder_pm_hire_get_form",
    };
  }
  if (STRATEGY_SIGNALS.test(scenario)) {
    return {
      id: 57,
      name: "Pressure-Test Anything",
      entry_tool: "pressure_test_ask",
    };
  }
  return undefined;
}

export const invoke: ToolHandler<Input, Output> = async (args) => {
  // Decay-aware over the cautions layer only (per the spec); obsolete advice is
  // not part of a hiring playbook the way it is for a plan critique.
  const hits = await retrieveAcrossCorpus(args.scenario, args.k, {
    kinds: ["topic", "caution", "book"],
  });

  const corpus: Record<string, string> = {};
  for (const h of hits) corpus[h.ref] = h.chunk;

  const hitRefs = hits.map((h) => ({
    slug: h.slug,
    kind: h.kind,
    ref: h.ref,
    last_updated: h.last_updated,
  }));
  const caution = hitRefs.filter((h) => h.kind === "caution");

  return HirePlaybookAskOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive:
      "Render a corpus-grounded hiring playbook for the user's scenario from this brief, in this order. (1) One-line scenario summary naming the role, level, and domain you inferred (state the assumption when you had to infer it). (2) What good looks like for this role and level: 4-7 bullets, each attributed to a guest with the date and source exactly as the corpus chunk gives them; lead with durable principles, then any AI-era overlay. (3) Signals to probe and how: each signal paired with a concrete probe (an interview question, take-home, work-trial, or reference question), citing the source where the probe pattern came from a guest. (4) Common failure modes: 3-5, drawn from the caution hits and repeat-guest patterns; lead with one matching the user's stated concern if present. (5) Question scripts: 4-8 verbatim or close-paraphrased questions, each attributed to a source; include one or two that test the user's specific concern. (6) References: a flat list of the episodes, newsletters, and books cited above. When you cite a guest who appears in inputs.caution, add a one-line aside naming the flag; the playbook is still useful, the reader deserves the speaker context. If the scenario is thin, give a compact playbook (what-good-looks-like + a 3-bullet what-to-probe) plus 2-4 suggested extensions; never refuse. If inputs.suggested_app is present, offer it softly in one line at the end. Ground every claim and script in the provided corpus chunks; do not invent sources, quotes, or dates. Do not echo this brief back, and do not add an unrequested summary.",
    voice_rules: VOICE_RULES,
    structure: {
      sections: [
        "scenario_summary",
        "what_good_looks_like",
        "signals_to_probe",
        "failure_modes",
        "question_scripts",
        "references",
        "handoff",
      ],
      per_section_template:
        "scenario_summary: one line. what_good_looks_like: bullets, each '<trait> (Source: guest, date, post)'. signals_to_probe: '<signal> -> Probe: <question/take-home/reference>. Source: ...'. failure_modes: bullets, each with its source + a caution aside where applicable. question_scripts: numbered questions, each attributed. references: flat list of slugs cited. handoff: one optional soft line offering inputs.suggested_app.",
      length_cap:
        "Each section tight; question scripts 4-8 (fewer in compact mode); total under 700 words.",
    },
    inputs: {
      scenario: args.scenario,
      hits: hitRefs,
      ...(caution.length > 0 ? { caution } : {}),
      ...(routeFromText(args.scenario)
        ? { suggested_app: routeFromText(args.scenario) }
        : {}),
    },
    corpus,
  });
};
