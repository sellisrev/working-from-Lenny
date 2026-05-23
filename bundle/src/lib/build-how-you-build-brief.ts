import type { z } from "zod";
import { HowYouBuildNarrateOutput } from "../shared/schemas";
import type {
  HowYouBuildMode,
  HowYouBuildTeamT,
} from "../shared/schemas";
import {
  MODES,
  assembleInputBlock,
  modeBySlug,
} from "../tools/52-how-you-build/data";

type Brief = z.infer<typeof HowYouBuildNarrateOutput>;

const SHARED_VOICE_RULES = [
  "Q-and-A pattern from the voice catalog's #52 entry: 'How did your team make a Notion doc this important? Mostly by accident.' The genre stays earnest; the punchline is always the gap between the artifact and the reverence.",
  "No AI tells. No 'delve', 'leverage', 'unlock', 'unpack', 'navigate', 'in today's fast-paced'.",
  "Never break the fourth wall. Never acknowledge the parody. The reverence is total.",
  "Reference the team's actual fields from inputs.team — invent two plausible names only if needed, never reuse 'the team' as a placeholder.",
  "Em dashes are fine; they are authentic to the genre.",
];

interface ModeRender {
  directive: string;
  sections: string[];
  per_section_template: string;
  length_cap: string;
}

const MODE_RENDERS: Record<HowYouBuildMode, ModeRender> = {
  "reverence-profile": {
    directive: [
      "Render a six-section reverence profile of the team. Tone is earnest; vocabulary is mythological; evidence is whatever is in inputs.team.",
      "Use the section headers exactly: '## Pull quote', '## How [Team] builds product', '## Architecture diagram', '## Origin story', '## Rituals', '## What every Series B can learn from [Team]'.",
      "Replace [Team] with a plausible team name (invent one if useful).",
      "Architecture diagram is ASCII/Unicode-line, re-labelling each tool from inputs.team.tools as if it were a proprietary system (Notion → 'the Atlas knowledge graph', Slack → 'the Signal mesh', Linear → 'the Throughput engine'). At least three tools, boxes + arrows only, no prose inside the diagram.",
      "Rituals is a bulleted list of 4-6, each starting with a day/cadence ('Every Monday morning'), naming the ritual, explaining why this team does it differently. Reference at least one tool by its proprietary-system name from the diagram.",
      "Closing paragraph distills the team's approach into a transferable lesson small enough that the lesson is just 'they have a Slack thread' or 'they meet on Tuesdays' — the joke is that this is being held up as a method.",
      "The reader should be 30% in before realizing the team has three ICs and one Notion page.",
    ].join(" "),
    sections: [
      "pull_quote",
      "profile_narrative",
      "architecture_diagram",
      "origin_story",
      "rituals",
      "closing_lesson",
    ],
    per_section_template: [
      "PULL QUOTE — One line, sentence-case, no quotation marks. Treats a banal artifact (the standup, the Notion doc, a recurring 1:1) as load-bearing infrastructure.",
      "PROFILE NARRATIVE — Three paragraphs. (1) company-stage framing, lean small and underdogged (make up plausible Series A / employee count details if missing); (2) zoom in on one ritual; (3) name a person and credit them with the system.",
      "ARCHITECTURE DIAGRAM — ASCII/Unicode diagram re-labelling tools as proprietary systems. ≥3 tools. Boxes, arrows, labels only.",
      "ORIGIN STORY — Two paragraphs, creation-story cadence. At least one decision was made over coffee or on a walk. Reference specific people from the profile narrative.",
      "RITUALS — 4-6 bullets. Each starts with a day/cadence; references at least one tool by its proprietary-system name.",
      "CLOSING LESSON — One paragraph. Distill the team's approach into a transferable lesson small enough to be silly held up as a method.",
    ].join("\n"),
    length_cap: "Total 600-900 words.",
  },
  "linkedin-humblebrag": {
    directive: [
      "Render a LinkedIn humblebrag post the founder would write about their own team.",
      "Earnest tone with one slight tell that the author is overstating things — a hedge, a contradictory aside, or a suspiciously specific detail.",
      "Reference at least one specific tool or ritual from inputs.team by name.",
      "Format: one short opening line (confession / 'real talk'), one paragraph (3-5 sentences) elevating a banal artifact into methodology, one closing line that asks the comment section a rhetorical question (engagement bait).",
      "No hashtags. No emojis except optionally one at the very start.",
      "The 'tell' is subtle — not a wink at the reader, just a word or phrase a real over-poster would write without realizing.",
    ].join(" "),
    sections: ["opening_confession", "elevation_paragraph", "engagement_bait"],
    per_section_template: [
      "OPENING CONFESSION — One short opening line. 'Most founders...' / 'Real talk:' / 'Quietly proud of...'. Sets the humblebrag posture.",
      "ELEVATION PARAGRAPH — 3-5 sentences. Elevates one specific tool or ritual into a methodology. Plant one subtle tell.",
      "ENGAGEMENT BAIT — One closing rhetorical question to the comment section. Often 'Curious: where does YOUR team's X live? Be honest.'",
    ].join("\n"),
    length_cap: "100-150 words total.",
  },
  "acquired-cold-open": {
    directive: [
      "Render an Acquired-podcast-style cold open about the team.",
      "Establishes the team's mythology through one specific story — a meeting, a tool adoption, a hallway conversation drawn from inputs.team.",
      "Cadence is the joke: confident, slightly slowed-down, every line earns the next one, never deliver the punchline directly.",
      "4-6 short sentences, each its own beat. The narrator never acknowledges the smallness of the team; the reverence is total.",
      "End with a hook line promising the rest of the episode (e.g., 'This is the story of how that one pinned Slack thread became the reason they shipped on time.' or 'In this episode, we go inside the room where that decision was made.').",
      "Reference at least one specific tool or ritual from inputs.team by name (not paraphrased).",
      "No music cues, no episode numbers, no production notes — only the narrator's words.",
    ].join(" "),
    sections: ["setup_beats", "hook_line"],
    per_section_template: [
      "SETUP BEATS — 3-5 short sentences, each its own beat. Slow setup. Mythologize one small detail. Name a tool or ritual from the input.",
      "HOOK LINE — One sentence promising the rest of the episode. 'This is the story of...' or 'In this episode, we go inside...'.",
    ].join("\n"),
    length_cap: "80-120 words total.",
  },
};

export interface BuildHowYouBuildBriefInput {
  mode: HowYouBuildMode;
  team: HowYouBuildTeamT;
  user_context?: string;
}

export async function buildHowYouBuildNarrationBrief(
  args: BuildHowYouBuildBriefInput,
): Promise<Brief> {
  const { mode, team, user_context } = args;
  modeBySlug(mode); // runtime validation; throws on unknown mode
  const render = MODE_RENDERS[mode];
  const inputBlock = assembleInputBlock(team);

  return HowYouBuildNarrateOutput.parse({
    type: "narration_brief",
    audience: "user",
    directive: render.directive,
    voice_rules: SHARED_VOICE_RULES,
    structure: {
      sections: render.sections,
      per_section_template: render.per_section_template,
      length_cap: render.length_cap,
    },
    inputs: {
      mode,
      team,
      input_block: inputBlock,
      user_context: user_context ?? "",
    },
    // Intentionally empty: this app is voice/structure work, not corpus
    // citation. The brief schema requires a corpus field, but the host model
    // shouldn't try to cite anything — the prompt itself is the product.
    corpus: {},
  });
}

/**
 * Re-exported so future callers can introspect the registered modes without
 * importing data.ts directly. Lives next to MODE_RENDERS to make it harder
 * to add a render without also adding the mode metadata.
 */
export const SUPPORTED_MODES: HowYouBuildMode[] = MODES.map((m) => m.slug);
