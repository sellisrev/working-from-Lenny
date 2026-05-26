import type { z } from "zod";
import { PmNonPmNarrateOutput } from "../shared/schemas";
import {
  ARTIFACTS,
  CORPUS_ANCHORS,
  DOMAIN_DATA,
  SCALE_CALIBRATION,
  type DomainEnum,
  type ScaleEnum,
} from "../tools/31-pm-non-pm-manual/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof PmNonPmNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Plain and practical, respectful of the user's domain expertise. Never reverent about product management — the framework serves the domain, not the other way around.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Second person, short paragraphs. The reader knows their domain better than you do.",
  "Translate PM concepts into the user's vocabulary. Don't say 'ship an MVP' to a principal; say 'pilot with one classroom'.",
  "Do not sell the reader on PM methods. Make the frameworks useful without the buzzwords.",
  "Ground each artifact in the supplied corpus chunks. Do not invent corpus material.",
  "Parenting domains are intentionally out of scope. If the user is a parent asking about raising kids, redirect to the manual's four domains.",
];

const PER_SECTION_TEMPLATE = [
  "ARTIFACT_N — {title}",
  "Domain lens for {domain}: {domain-specific framing for this artifact}.",
  "Scale calibration for {scale}: {length and formality note}.",
  "The artifact itself: structured, specific to the domain, ready to use.",
].join("\n");

function buildDirective(
  domain: DomainEnum,
  scale: ScaleEnum,
  hasFriction: boolean,
): string {
  const d = DOMAIN_DATA[domain];
  const parts: string[] = [
    `Render three working artifacts directly to the user, tailored for a ${d.label} at ${scale} scale.`,
    `Open with one sentence: 'Here are your three artifacts, adapted for a ${d.label}.'`,
    `Then write all three artifacts in order (ARTIFACT_1 through ARTIFACT_3):`,
    `ARTIFACT_1 — Jobs-to-be-done interview kit: 6-8 interview questions adapted for the ${d.label}'s users (${d.stakeholders.users.join(", ")}). Each question should surface the job they're trying to do, not just a preference. Frame in the domain's language.`,
    `ARTIFACT_2 — Prioritization rubric: A table with four columns using the relabeled RICE axes (${d.rice_labels.reach} / ${d.rice_labels.impact} / ${d.rice_labels.confidence} / ${d.rice_labels.effort}). Include the override gate: '${d.override_gate}'. Provide 3-4 example items scored for the ${d.label}'s context to show how it works.`,
    `ARTIFACT_3 — 'Stop doing' list: Three things a ${d.label} should stop doing, drawn from inputs.stop_doing_candidates. Each item gets one sentence on what to stop, one sentence on why, and one sentence on what to do instead.`,
    `Do not be reverent about PM methods. Translate every framework into the ${d.label}'s vocabulary.`,
  ];
  if (hasFriction) {
    parts.push(
      `After all three artifacts, write a short FRICTION_CODA that addresses the user's biggest_friction directly using the most relevant artifact or concept.`,
    );
  }
  parts.push(`Do not echo this brief back; transform it.`);
  return parts.join(" ");
}

export interface BuildPmNonPmBriefInput {
  domain: DomainEnum;
  scale: ScaleEnum;
  biggest_friction: string;
  user_context: string;
}

export async function buildPmNonPmBrief(args: BuildPmNonPmBriefInput): Promise<Brief> {
  const { domain, scale, biggest_friction, user_context } = args;
  const domainData = DOMAIN_DATA[domain];

  const slugs = [...CORPUS_ANCHORS];
  const corpusRaw = await loadCorpusChunks(slugs);
  const corpus: Record<string, string> = {};
  for (const slug of slugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  // Build artifact_anchors as string keys
  const artifactAnchors: Record<string, string[]> = {};
  for (const [id, anchors] of Object.entries(domainData.artifact_anchors)) {
    artifactAnchors[`artifact_${id}`] = anchors;
  }

  const sections = [
    "artifact_1",
    "artifact_2",
    "artifact_3",
    ...(biggest_friction ? ["friction_coda"] : []),
  ];

  return PmNonPmNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(domain, scale, Boolean(biggest_friction)),
    voice_rules: VOICE_RULES,
    structure: {
      sections,
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each artifact 150-250 words. Friction coda under 80 words. Total under 900 words.",
    },
    inputs: {
      domain,
      scale,
      biggest_friction: biggest_friction ?? "",
      user_context: user_context ?? "",
      stakeholders: domainData.stakeholders,
      rice_labels: domainData.rice_labels,
      override_gate: domainData.override_gate,
      stop_doing_candidates: domainData.stop_doing_candidates,
      artifact_anchors: artifactAnchors,
      scale_calibration: SCALE_CALIBRATION[scale],
    },
    corpus,
  } as Brief);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
