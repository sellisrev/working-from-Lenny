import type { z } from "zod";
import { BurnoutNarrateOutput } from "../shared/schemas";
import { scoreInputs, CORPUS_ANCHORS, type BurnoutInputs, type ScoreResult } from "../tools/28-burnout-warning-index/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof BurnoutNarrateOutput>;

const CORPUS_CHUNK_CAP = 1500;

const VOICE_RULES = [
  "Non-clinical, non-alarmist, no medical claims. Behavioral and corpus-anchored only.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Direct but kind. Red is 'fixable, here's the order,' never 'you're broken.' Do not perform concern; prescribe.",
  "Address the user in second person.",
  "Ground each phase in the supplied corpus chunks. Do not invent corpus material.",
];

const PER_SECTION_TEMPLATE = [
  "INDEX — {index}/100 — {tier headline}",
  "DRIVERS — the two highest-risk inputs, named plainly.",
  "PHASE_1 — Stop the bleeding: the single cut this week. If recovery_capacity was supplied, reference it in Phase 1.",
  "PHASE_2 — Rebuild recovery: sleep / vacation / deep-work restoration, ordered by which scored worst.",
  "PHASE_3 — Change the system: the structural fix so it doesn't recur (meeting load, yes-by-default, or the trust gap).",
  "If override_fired, open Phase 1 with a line naming the dread + no-good-day signal pair directly.",
].join("\n");

function buildDirective(
  tier: "green" | "yellow" | "red",
  overrideFired: boolean,
  hasRecoveryCapacity: boolean,
): string {
  const parts: string[] = [
    "Render a burnout-index narration directly to the user.",
  ];
  if (tier === "green" && !overrideFired) {
    parts.push(
      "Open with the green headline: 'Sustainable for now. Keep the guardrails.' Name the two top drivers (even at zero or low values) as the things worth watching. Keep the prescription light.",
    );
  } else {
    parts.push(
      `Open with the ${tier} read and the index (e.g. '${tier === "yellow" ? "Drifting." : "This is not a busy season. It's a debt."} Your index is {index}/100.').`,
    );
    if (overrideFired) {
      parts.push(
        "The override fired (dread most-mornings AND last-good-day can't-remember): name this pair explicitly before the drivers — 'Your calendar can look manageable; that pairing matters more than the load numbers.'",
      );
    }
    parts.push(
      "Then name the two top drivers plainly.",
      "Then write three ordered phases following the per_section_template (Phase 1 / Phase 2 / Phase 3).",
    );
    if (hasRecoveryCapacity) {
      parts.push(
        "In Phase 1, reference recovery_capacity directly: 'You said {recovery_capacity} falls away first when you're underwater. Protect that this week, not last.'",
      );
    }
  }
  parts.push("Do not echo this brief back; transform it.");
  return parts.join(" ");
}

export interface BuildBurnoutBriefInput {
  scored?: ScoreResult;
  inputs: BurnoutInputs;
  user_context?: string;
}

export async function buildBurnoutBrief(args: BuildBurnoutBriefInput): Promise<Brief> {
  const { inputs, user_context } = args;
  const scored = args.scored ?? scoreInputs(inputs);

  const slugs = Array.from(new Set([...CORPUS_ANCHORS]));
  const corpusRaw = await loadCorpusChunks(slugs);
  const corpus: Record<string, string> = {};
  for (const slug of slugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  const sections =
    scored.tier === "green" && !scored.override_fired
      ? ["index", "drivers", "phase_1", "phase_2"]
      : ["index", "drivers", "phase_1", "phase_2", "phase_3"];

  return BurnoutNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(scored.tier, scored.override_fired, Boolean(inputs.recovery_capacity)),
    voice_rules: VOICE_RULES,
    structure: {
      sections,
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each phase under 80 words. Total output under 400 words.",
    },
    inputs: {
      index: scored.index,
      tier: scored.tier,
      override_fired: scored.override_fired,
      top_drivers: scored.top_drivers,
      recovery_capacity: inputs.recovery_capacity ?? "",
      user_context: user_context ?? "",
      raw_inputs: {
        meetings_per_week: inputs.meetings_per_week,
        deep_work_blocks_remaining: inputs.deep_work_blocks_remaining,
        after_hours_meeting_pct: inputs.after_hours_meeting_pct,
        weeks_since_real_vacation: inputs.weeks_since_real_vacation,
        sleep_self_report: inputs.sleep_self_report,
        last_good_day: inputs.last_good_day,
        dread_signal: inputs.dread_signal,
      },
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
