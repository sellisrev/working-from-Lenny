import type { HowYouBuildMode } from "../../shared/schemas";
import type { HowYouBuildTeamT } from "../../shared/schemas";

/**
 * #52 How [You] Build Product deterministic data. There's no scoring engine
 * and no corpus pool — the prompt itself is the product. The bundle's job is
 * to assemble the structured-input [INPUT] block and pick the right
 * mode-specific directive for the host chat model.
 *
 * Source of truth: `apps/52-how-you-build/prompt.md`.
 */

export interface ModeDef {
  slug: HowYouBuildMode;
  label: string;
  length_hint: string;
  summary: string;
}

export const MODES: ModeDef[] = [
  {
    slug: "reverence-profile",
    label: "Reverence profile",
    length_hint: "600–900 words",
    summary:
      "The original parody. Six-section profile written as if the team were a Series B unicorn whose secret is its Tuesday standup.",
  },
  {
    slug: "linkedin-humblebrag",
    label: "LinkedIn humblebrag",
    length_hint: "100–150 words",
    summary:
      "Founder LinkedIn post celebrating a banal artifact (a tool, a meeting, a doc) as the secret of the team's success. Ends with an engagement-bait question.",
  },
  {
    slug: "acquired-cold-open",
    label: "Acquired cold open",
    length_hint: "80–120 words",
    summary:
      "Acquired-podcast-style cold open. Narrative cadence is the joke — slow setup, mythologized small choice, hook line at the end.",
  },
];

export const MODE_SLUGS: HowYouBuildMode[] = MODES.map((m) => m.slug);

export interface FieldDef {
  key: "pm_count" | "eng_count" | "des_count" | "tools" | "rituals" | "last_shipped";
  label: string;
  kind: "int" | "text";
  placeholder: string;
}

export const FIELDS: FieldDef[] = [
  { key: "pm_count", label: "PMs", kind: "int", placeholder: "3" },
  { key: "eng_count", label: "Engineers", kind: "int", placeholder: "9" },
  { key: "des_count", label: "Designers", kind: "int", placeholder: "2" },
  {
    key: "tools",
    label: "Tools you use",
    kind: "text",
    placeholder: "Notion, Linear, Slack",
  },
  {
    key: "rituals",
    label: "Rituals you have",
    kind: "text",
    placeholder: "Mon/Wed/Fri standups, pinned roadmap, Friday demos",
  },
  {
    key: "last_shipped",
    label: "Last thing you shipped",
    kind: "text",
    placeholder: "the new onboarding flow last quarter",
  },
];

export function modeBySlug(slug: HowYouBuildMode): ModeDef {
  const m = MODES.find((x) => x.slug === slug);
  if (!m) throw new Error(`Unknown how-you-build mode: ${slug}`);
  return m;
}

/**
 * Assembles the [INPUT] block exactly as prompt.md specifies, so the host
 * model receives the same structured payload it would receive from the
 * Phase 0 URL-trick handoff.
 */
export function assembleInputBlock(team: HowYouBuildTeamT): string {
  return [
    `Team composition: ${team.pm_count} PMs, ${team.eng_count} engineers, ${team.des_count} designers`,
    `Tools used: ${team.tools}`,
    `Rituals: ${team.rituals}`,
    `Last shipped: ${team.last_shipped}`,
  ].join("\n");
}
