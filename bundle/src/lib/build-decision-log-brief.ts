import type { z } from "zod";
import { DecisionLogCalibrateOutput } from "../shared/schemas";
import { loadCollection } from "../tools/25-decision-log-calibration/collection";
import { computeBrier, brierBand, CORPUS_ANCHORS } from "../tools/25-decision-log-calibration/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof DecisionLogCalibrateOutput>;

const CORPUS_CHUNK_CAP = 1500;

const VOICE_RULES = [
  "Coach with a spreadsheet, not a fortune teller. The numbers are honest because outcomes, not vibes, resolve them.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Calibration is a skill, not a verdict. Overconfidence is a correctable bias, not a character flaw.",
  "Address the user in second person.",
  "Ground pattern and PATTERN lines in the supplied corpus chunks (decision-making-frameworks, evaluating-product-bets, defending-big-bets). Do not invent corpus material.",
  "When n_resolved is small (under 10), name the count — 'across 3 resolved decisions' — so the band's precision is calibrated by the reader.",
];

const PER_SECTION_TEMPLATE = [
  "OVERALL — overall_brier / brier_band + n_resolved count.",
  "MISCALIBRATION — list only types with verdict=overconfident or underconfident; for each: felt X%, right Y%, gap Z points. Skip types with verdict=well-calibrated or insufficient-data; mention insufficient-data only if ALL types are below threshold.",
  "OPEN — count of open decisions; name the oldest if present (decision_text + how long ago).",
  "PATTERN — one corpus-grounded observation about what the data says about judgment quality (not a repetition of the numbers). Tie to a corpus anchor.",
].join("\n");

function buildDirective(n_resolved: number, band: string): string {
  const parts: string[] = ["Render a calibration read directly to the user."];
  if (n_resolved === 0) {
    parts.push(
      "No resolved decisions yet. Open with: 'Your log is empty on the resolved side — the score shows once your first decision resolves.' Suggest they open the Decision Log, log a decision, then resolve it when the outcome is known.",
    );
  } else {
    parts.push(
      `Open with the OVERALL section: Brier ${band} (explain what the band means in one plain sentence). State the count.`,
      "Then the MISCALIBRATION section.",
      "Then the OPEN section.",
      "Then the PATTERN section.",
    );
  }
  parts.push("Do not echo this brief back; transform it.");
  return parts.join(" ");
}

export interface BuildDecisionLogBriefInput {
  user_context?: string;
}

export async function buildDecisionLogBrief(args: BuildDecisionLogBriefInput): Promise<Brief> {
  const { user_context = "" } = args;

  const col = await loadCollection();
  const { overall_brier, n_resolved, per_type } = computeBrier(col.entries);
  const band = brierBand(overall_brier);

  const openEntries = col.entries.filter((e) => e.status === "open");
  const open_count = openEntries.length;

  let oldest_open: { decision_text: string; created_at: string } | undefined;
  if (openEntries.length > 0) {
    const sorted = [...openEntries].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    const oldest = sorted[0]!;
    oldest_open = { decision_text: oldest.decision_text, created_at: oldest.created_at };
  }

  const slugs = Array.from(new Set([...CORPUS_ANCHORS]));
  const corpusRaw = await loadCorpusChunks(slugs);
  const corpus: Record<string, string> = {};
  for (const slug of slugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  return DecisionLogCalibrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(n_resolved, band),
    voice_rules: VOICE_RULES,
    structure: {
      sections: ["overall", "miscalibration", "open", "pattern"],
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each section under 60 words. Total output under 350 words.",
    },
    inputs: {
      overall_brier,
      brier_band: band,
      n_resolved,
      per_type,
      open_count,
      ...(oldest_open ? { oldest_open } : {}),
      user_context,
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
