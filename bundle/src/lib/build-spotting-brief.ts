import type { z } from "zod";
import { SpottingNarrateOutput } from "../shared/schemas";
import { BEHAVIORS, behaviorById } from "../tools/46-spotting-bad-pm-behaviors/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof SpottingNarrateOutput>;
type SeverityTier = "green" | "yellow" | "red";
type ActionRung =
  | "private_feedback"
  | "document_then_feedback"
  | "document_and_escalate"
  | "reframe_or_leave";

interface TopPattern {
  behavior_id: number;
  behavior_text: string;
  pattern_weight: number;
  action_rung: ActionRung;
}

const CORPUS_CHUNK_CAP = 1500;

const VOICE_RULES = [
  "Fair, not vindicating. The tool is not a weapon for office politics. Name the pattern, hand over a proportionate move, and check the user's own expectation gap.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Direct. If the answers say the PM is fine and the user is impatient, say that plainly.",
  "Address the user in second person.",
  "Ground each diagnosis in the supplied corpus chunks. Do not invent corpus material.",
];

const PER_SECTION_TEMPLATE = [
  "Behavior N — <short label>",
  "What this usually means: one-line diagnosis grounded in corpus.",
  "Your move: <action rung> — one concrete first step.",
].join("\n");

function buildDirective(grounded: boolean, tier: SeverityTier): string {
  const parts: string[] = [
    "Render a field-guide narration directly to the user.",
    tier === "green"
      ? "Open with the green headline: either they have a strong PM or the friction is somewhere they haven't looked yet. Both are worth knowing."
      : `Open with a one-sentence ${tier} read on the severity tier and the total pattern weight.`,
    "Then write one section per pattern in the order given, following the per_section_template.",
  ];
  if (grounded) {
    parts.push(
      "When citing a specific behavior, ground it in inputs.full_audit (their actual ratings). Do not invent answers the user did not give.",
    );
  } else {
    parts.push(
      "The user's per-behavior answers were not passed through. Do NOT claim specific user answers. Keep diagnoses general.",
    );
  }
  parts.push(
    "Close with a one-sentence fairness check: when the answers suggest the gap is partly the user's own expectation, say so plainly. Do not echo this brief back; transform it.",
  );
  return parts.join(" ");
}

export interface BuildSpottingBriefInput {
  severity_tier: SeverityTier;
  total: number;
  top_patterns: TopPattern[];
  user_context?: string;
  answers?: string[];
}

export async function buildSpottingBrief(args: BuildSpottingBriefInput): Promise<Brief> {
  const { severity_tier, total, top_patterns, user_context, answers } = args;

  const patternAnchors = top_patterns.flatMap((p) => behaviorById(p.behavior_id).anchors);
  const allSlugs = Array.from(
    new Set([...patternAnchors, "getting-buy-in", "communicating-bad-news", "managing-up"]),
  );

  const corpusRaw = await loadCorpusChunks(allSlugs);
  const corpus: Record<string, string> = {};
  for (const slug of allSlugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  const patterns = top_patterns.map((p) => ({
    behavior_id: p.behavior_id,
    behavior_text: p.behavior_text,
    action_rung: p.action_rung,
    corpus_anchors: behaviorById(p.behavior_id).anchors,
  }));

  const fullAudit = answers
    ? BEHAVIORS.map((b, i) => ({
        behavior_id: b.id,
        behavior_text: b.text,
        user_rating: answers[i]! as "often" | "sometimes" | "havent-seen-it",
      }))
    : undefined;

  const sections =
    severity_tier === "green"
      ? ["intro", "fairness_check"]
      : ["intro", ...top_patterns.map((_, i) => `pattern_${i + 1}`), "fairness_check"];

  return SpottingNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(Boolean(answers), severity_tier),
    voice_rules: VOICE_RULES,
    structure: {
      sections,
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each pattern section under 100 words. Total output under 450 words.",
    },
    inputs: {
      severity_tier,
      total,
      user_context: user_context ?? "",
      patterns,
      ...(fullAudit ? { full_audit: fullAudit } : {}),
    },
    corpus,
  });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
