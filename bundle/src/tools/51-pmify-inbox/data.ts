import type { PmifyMode, PmifyPattern } from "../../shared/schemas";

/**
 * #51 PM-ify My Inbox deterministic data. There's no scoring engine —
 * the bundle's job is to validate input, pick the right pattern pool, and
 * package the translation directive for the host chat model.
 *
 * Source of truth: `apps/51-pmify-inbox/prompt.md`.
 */

export interface PmifyModeDef {
  slug: PmifyMode;
  label: string;
  direction: string;
  example: string;
}

export const MODES: PmifyModeDef[] = [
  {
    slug: "pm-ify",
    label: "PM-ify my inbox",
    direction: "Plain English → corporate-PM-speak",
    example:
      "Hey honey, can you call your mother on Sunday? She's been worried.",
  },
  {
    slug: "de-pm-ify",
    label: "De-PM-ify a work message",
    direction: "Corporate-PM-speak → plain English",
    example:
      "Per our earlier sync, I'm going to push back on this ask. I don't have the bandwidth this sprint, and the ROI isn't clear. Let's revisit in our 1:1 next week.",
  },
];

export const MODE_SLUGS: PmifyMode[] = MODES.map((m) => m.slug);

/**
 * The closed footnote pattern pool. Each name maps directly to a
 * `knowledge/topics/<slug>.md` file the host model uses for grounding.
 *
 * NOTE on anchor substitution (2026-05-23): apps/51-pmify-inbox/prompt.md
 * lists a fourth pattern, `process-vs-outcomes`, but no corpus file exists
 * for that slug. Dropping it for now and shipping with the 3 anchors that
 * do exist; the Feature-Factory / busy-as-progress theme is already covered
 * inside pm-pitfalls.md and spotting-bad-pm-behaviors.md. Logged as a
 * substitution in DECISIONS.md.
 */
export const PATTERN_POOL: PmifyPattern[] = [
  "pm-pitfalls",
  "spotting-bad-pm-behaviors",
  "saying-no",
];

export function modeBySlug(slug: PmifyMode): PmifyModeDef {
  const m = MODES.find((x) => x.slug === slug);
  if (!m) throw new Error(`Unknown pmify mode: ${slug}`);
  return m;
}
