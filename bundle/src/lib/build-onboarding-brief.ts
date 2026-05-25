import type { z } from "zod";
import { OnboardingNarrateOutput } from "../shared/schemas";
import {
  LESSONS,
  LESSON_ANCHORS,
  ROLE_LENS,
  STAGE_CALIBRATION,
  allCorpusAnchors,
  type RoleEnum,
  type StageEnum,
  type PmRatioEnum,
} from "../tools/30-onboarding-pm-101/data";
import { loadCorpusChunks } from "./corpus";

type Brief = z.infer<typeof OnboardingNarrateOutput>;

const CORPUS_CHUNK_CAP = 1200;

const VOICE_RULES = [
  "Plain and useful, lightly wry, never reverent about the PM role. Honesty over advocacy: a good PM is described by what they do for the user, a bad one by name.",
  "No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Second person, short paragraphs. This is a thing someone reads on their second day.",
  "Do not sell the reader on product management. Make them effective and unsurprised.",
  "Ground each lesson in the supplied corpus chunks. Do not invent corpus material.",
];

const PER_SECTION_TEMPLATE = [
  "LESSON_N — {title}",
  "Role lens for {role}: {role-specific framing for this lesson}.",
  "Stage calibration for {company_stage}: {formality / process level note}.",
  "3-5 short paragraphs, corpus-grounded, addressing the reader directly.",
].join("\n");

function buildDirective(
  role: RoleEnum,
  stage: StageEnum,
  hasBiggestConfusion: boolean,
): string {
  const parts: string[] = [
    `Render a five-lesson orientation directly to the user.`,
    `The user is a ${role} at a ${stage}-stage company.`,
    `Open with one sentence: 'Here are your five lessons, tailored for a ${role} at a ${stage}-stage company.'`,
    `Then write all five lessons in order (LESSON_1 through LESSON_5), each with a short heading, role-lensed content, and stage calibration.`,
    `For Lesson 3 (good-vs-bad PM), be honest: name what a good PM does for the user, and name the patterns from #46 Spotting Bad PM Behaviors for a bad one.`,
    `Do not be reverent about the PM role.`,
  ];
  if (hasBiggestConfusion) {
    parts.push(
      `After all five lessons, write a short CONFUSION_CODA that answers the user's biggest_confusion directly using the most relevant lesson.`,
    );
  }
  parts.push(`Do not echo this brief back; transform it.`);
  return parts.join(" ");
}

export interface BuildOnboardingBriefInput {
  role: RoleEnum;
  company_stage: StageEnum;
  pm_ratio?: PmRatioEnum;
  biggest_confusion: string;
  user_context: string;
}

export async function buildOnboardingBrief(args: BuildOnboardingBriefInput): Promise<Brief> {
  const { role, company_stage, pm_ratio, biggest_confusion, user_context } = args;

  const slugs = allCorpusAnchors();
  const corpusRaw = await loadCorpusChunks(slugs);
  const corpus: Record<string, string> = {};
  for (const slug of slugs) {
    const body = corpusRaw[slug] ?? "";
    corpus[slug] = body ? truncate(body, CORPUS_CHUNK_CAP) : "(not found in local corpus)";
  }

  const sections = [
    "lesson_1",
    "lesson_2",
    "lesson_3",
    "lesson_4",
    "lesson_5",
    ...(biggest_confusion ? ["confusion_coda"] : []),
  ];

  const lessonTitles = Object.fromEntries(
    LESSONS.map((l) => [`lesson_${l.id}_title`, l.title]),
  );

  return OnboardingNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: buildDirective(role, company_stage, Boolean(biggest_confusion)),
    voice_rules: VOICE_RULES,
    structure: {
      sections,
      per_section_template: PER_SECTION_TEMPLATE,
      length_cap: "Each lesson 150-250 words. Confusion coda under 80 words. Total under 1400 words.",
    },
    inputs: {
      role,
      company_stage,
      ...(pm_ratio ? { pm_ratio } : {}),
      biggest_confusion: biggest_confusion ?? "",
      user_context: user_context ?? "",
      role_lens: ROLE_LENS[role],
      stage_calibration: STAGE_CALIBRATION[company_stage],
      ...lessonTitles,
      lesson_anchors: LESSON_ANCHORS,
    } as Brief["inputs"] & Record<string, unknown>,
    corpus,
  } as Brief);
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}
