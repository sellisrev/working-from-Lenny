import { z } from "zod";

export const AnswerEnum = z.enum(["always", "sometimes", "never"]);
export type Answer = z.infer<typeof AnswerEnum>;

export const PitfallQuestion = z.object({
  id: z.number().int().min(1).max(20),
  text: z.string(),
});

export const PitfallGetQuestionsInput = z.object({}).strict();

export const PitfallGetQuestionsOutput = z.object({
  questions: z.array(PitfallQuestion).length(20),
  note: z.string(),
});

export const PitfallScoreInput = z.object({
  answers: z.array(AnswerEnum).length(20),
  /**
   * Optional. Forwarded into the persisted narration brief's
   * `inputs.user_context` so downstream rendering can match the user's
   * role/stage. Empty by default; iframe never passes one, chat-side
   * Claude may.
   */
  user_context: z.string().default(""),
});

export const PitfallScoreOutput = z.object({
  score_display: z.number().int().min(0).max(20),
  top_three_pitfall_ids: z.array(z.number().int().min(1).max(20)).length(3),
  exemplar_quotes: z.array(z.string()).length(3),
  all_never: z.boolean(),
  questions: z.array(PitfallQuestion).length(20),
  /**
   * Set only when score's persistence side-effect failed. Presence indicates
   * `pm_pitfalls_get_pending_narration` will return `no_pending` for this
   * audit and the user should be directed to retake or to ask the host chat
   * to render via `pm_pitfalls_narrate` directly. Absence = handoff is ready.
   */
  persistence_warning: z.string().optional(),
});

export const PitfallNarrateInput = z.object({
  score_display: z.number().int().min(0).max(20),
  top_three_pitfall_ids: z.array(z.number().int().min(1).max(20)).length(3),
  user_context: z.string().default(""),
  /**
   * Optional. The user's 20 answers in pitfall-ID order, passed through from
   * the score call so the narration brief can ground specific behavioral
   * claims in actual answers rather than guesses.
   */
  answers: z.array(AnswerEnum).length(20).optional(),
});

export const PitfallNarrationPick = z.object({
  pitfall_id: z.number().int().min(1).max(20),
  pitfall_text: z.string(),
  exemplar_quote: z.string(),
  corpus_anchors: z.array(z.string()),
  user_answer: AnswerEnum.optional(),
});

export const PitfallFullAuditEntry = z.object({
  pitfall_id: z.number().int().min(1).max(20),
  pitfall_text: z.string(),
  user_answer: AnswerEnum,
});

/**
 * Path 4 narration-brief contract. The bundle packages corpus chunks + picks
 * + voice rules; the host chat model renders the user-facing narration.
 */
export const PitfallNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    score_display: z.number().int().min(0).max(20),
    user_context: z.string(),
    picks: z.array(PitfallNarrationPick).length(3),
    /**
     * Optional. Per-pitfall answer mapping (20 entries). Present only when
     * the caller passed `answers` to narrate. When present, the directive
     * instructs the host model to ground specific behavioral claims in
     * `user_answer`; when absent, the directive forbids inventing them.
     */
    full_audit: z.array(PitfallFullAuditEntry).length(20).optional(),
  }),
  corpus: z.record(z.string()),
});

export const PitfallDriftInput = z.object({
  user_id: z.string().min(1),
  /** When present, records this audit before computing drift. */
  current_audit: z
    .object({
      answers: z.array(AnswerEnum).length(20),
      score_display: z.number().int().min(0).max(20),
    })
    .optional(),
});

export const PitfallDriftOutput = z.object({
  status: z.enum(["first_audit", "drift_report"]),
  current_score: z.number().int().min(0).max(20).optional(),
  previous_score: z.number().int().min(0).max(20).optional(),
  previous_audit_at: z.string().optional(),
  shifted_pitfalls: z
    .array(
      z.object({
        pitfall_id: z.number().int().min(1).max(20),
        from: AnswerEnum,
        to: AnswerEnum,
      }),
    )
    .optional(),
  unchanged_pitfalls: z.array(z.number().int().min(1).max(20)).optional(),
  one_line_read: z.string(),
  audit_count: z.number().int().min(1),
});

export const PitfallGetPendingNarrationInput = z.object({}).strict();

export const PitfallGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: PitfallNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

export const PitfallStateV1 = z.object({
  schema_version: z.literal(1),
  user_id: z.string(),
  data: z.object({
    audits: z.array(
      z.object({
        timestamp: z.string(),
        answers: z.array(AnswerEnum).length(20),
        score_display: z.number().int().min(0).max(20),
      }),
    ),
  }),
});

export type PitfallStateV1 = z.infer<typeof PitfallStateV1>;

// ───────────────────────────────────────────────────────────
// #53 PM Horoscope schemas
// ───────────────────────────────────────────────────────────

export const HoroscopeArchetypeEnum = z.enum([
  "bet-defender",
  "theatre-director",
  "cornered-resource",
  "pivot-hanged",
  "customer-adjacent",
  "founder-mode-returnee",
  "stakeholder-pleaser",
  "top-1-percent",
  "saying-no",
  "eval-forward",
  "strategy-skeptic",
  "empathy-tourist",
]);
export type HoroscopeArchetypeSlug = z.infer<typeof HoroscopeArchetypeEnum>;

export const HoroscopeIsoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be ISO YYYY-MM-DD");

export const HoroscopeQuizOption = z.object({
  id: z.number().int().min(0).max(3),
  text: z.string(),
});

export const HoroscopeQuizQuestion = z.object({
  id: z.number().int().min(1).max(6),
  text: z.string(),
  options: z.array(HoroscopeQuizOption).min(2).max(6),
});

export const HoroscopeGetQuizInput = z.object({}).strict();

export const HoroscopeGetQuizOutput = z.object({
  questions: z.array(HoroscopeQuizQuestion).length(6),
  archetype_slugs: z.array(HoroscopeArchetypeEnum).length(12),
  note: z.string(),
});

export const HoroscopeReading = z.object({
  aspect_partner_id: z.number().int().min(1).max(12),
  aspect_partner_name: z.string(),
  aspect: z.string(),
  prediction: z.string(),
  nudge: z.string(),
  topic: z.string(),
});

const HoroscopeArchetypeDetailFields = {
  archetype_id: z.number().int().min(1).max(12),
  archetype_slug: HoroscopeArchetypeEnum,
  archetype_name: z.string(),
  archetype_virtue: z.string(),
  archetype_pitfall: z.string(),
} as const;

export const HoroscopeScoreQuizInput = z.object({
  answers: z
    .array(z.number().int().min(0).max(3))
    .length(6),
  user_context: z.string().default(""),
  date: HoroscopeIsoDate.optional(),
});

export const HoroscopeScoreQuizOutput = z.object({
  ...HoroscopeArchetypeDetailFields,
  next_archetype_id: z.number().int().min(1).max(12),
  next_archetype_slug: HoroscopeArchetypeEnum,
  next_archetype_name: z.string(),
  date: HoroscopeIsoDate,
  reading: HoroscopeReading,
  persistence_warning: z.string().optional(),
});

export const HoroscopeReadInput = z.object({
  archetype: HoroscopeArchetypeEnum,
  date: HoroscopeIsoDate.optional(),
  user_context: z.string().default(""),
});

export const HoroscopeReadOutput = z.object({
  ...HoroscopeArchetypeDetailFields,
  date: HoroscopeIsoDate,
  reading: HoroscopeReading,
  persistence_warning: z.string().optional(),
});

export const HoroscopeNarrateInput = z.object({
  archetype: HoroscopeArchetypeEnum,
  date: HoroscopeIsoDate.optional(),
  user_context: z.string().default(""),
});

/**
 * Path 4 narration-brief contract for #53 PM Horoscope. The bundle packages
 * the deterministic reading (aspect / prediction / nudge / topic) + archetype
 * context + corpus chunks + voice rules; the host chat model renders the
 * user-facing horoscope.
 */
export const HoroscopeNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    archetype_id: z.number().int().min(1).max(12),
    archetype_slug: HoroscopeArchetypeEnum,
    archetype_name: z.string(),
    archetype_virtue: z.string(),
    archetype_pitfall: z.string(),
    date: HoroscopeIsoDate,
    reading: HoroscopeReading,
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const HoroscopeGetPendingNarrationInput = z.object({}).strict();

export const HoroscopeGetPendingNarrationOutput = z.discriminatedUnion(
  "status",
  [
    z.object({
      status: z.literal("ready"),
      saved_at: z.string(),
      brief: HoroscopeNarrateOutput,
    }),
    z.object({
      status: z.literal("no_pending"),
      note: z.string(),
    }),
  ],
);

// ───────────────────────────────────────────────────────────
// #3 PM Ladder Self-Assessment schemas
// ───────────────────────────────────────────────────────────

export const LadderDimensionEnum = z.enum([
  "scope",
  "ambiguity",
  "influence",
  "judgment",
  "craft",
]);
export type LadderDimensionSlug = z.infer<typeof LadderDimensionEnum>;

export const LadderLevel = z.number().int().min(1).max(5);

/** The thirty questions in canonical order (Scope=1-6, Ambiguity=7-12, Influence=13-18, Judgment=19-24, Craft=25-30). */
export const LadderQuestion = z.object({
  id: z.number().int().min(1).max(30),
  dimension: LadderDimensionEnum,
  text: z.string(),
  options: z.array(z.string()).length(5),
});

export const LadderGetQuestionsInput = z.object({}).strict();

export const LadderGetQuestionsOutput = z.object({
  questions: z.array(LadderQuestion).length(30),
  dimensions: z.array(LadderDimensionEnum).length(5),
  note: z.string(),
});

/**
 * Per-dimension levels. May be fractional (median of six integer levels —
 * with six values the median between the two middle picks is a .5 value).
 */
export const LadderDimensionLevels = z.object({
  scope: z.number().min(1).max(5),
  ambiguity: z.number().min(1).max(5),
  influence: z.number().min(1).max(5),
  judgment: z.number().min(1).max(5),
  craft: z.number().min(1).max(5),
});
export type LadderDimensionLevelsT = z.infer<typeof LadderDimensionLevels>;

export const LadderScoreInput = z.object({
  /**
   * Thirty answers in question-ID order. Each value is a level (1-5) — the
   * 0-indexed option chosen for that question, plus one.
   */
  answers: z.array(LadderLevel).length(30),
  user_context: z.string().default(""),
});

export const LadderScoreOutput = z.object({
  dimension_levels: LadderDimensionLevels,
  effective_level: LadderLevel,
  /** Floored effective level when the cross-dimension median is fractional. */
  effective_level_display: z.number().min(1).max(5),
  target_level: LadderLevel,
  widest_gap_dimension: LadderDimensionEnum,
  widest_gap_size: z.number().min(0).max(4),
  level_names: z.object({
    current: z.string(),
    target: z.string(),
  }),
  questions: z.array(LadderQuestion).length(30),
  persistence_warning: z.string().optional(),
});

export const LadderNarrateInput = z.object({
  dimension_levels: LadderDimensionLevels,
  user_context: z.string().default(""),
  /** Optional. The user's 30 answers in question order. Lets the brief ground commentary in actual picks. */
  answers: z.array(LadderLevel).length(30).optional(),
});

export const LadderNarrationDimension = z.object({
  dimension: LadderDimensionEnum,
  level: z.number().min(1).max(5),
  target_level: LadderLevel,
  gap: z.number().min(0).max(4),
  corpus_anchors: z.array(z.string()),
});

export const LadderFullAssessmentEntry = z.object({
  question_id: z.number().int().min(1).max(30),
  dimension: LadderDimensionEnum,
  question_text: z.string(),
  user_level: LadderLevel,
});

/** Path 4 narration brief for the gap report + three behaviors. */
export const LadderNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    dimension_levels: LadderDimensionLevels,
    effective_level: LadderLevel,
    target_level: LadderLevel,
    widest_gap_dimension: LadderDimensionEnum,
    level_names: z.object({
      current: z.string(),
      target: z.string(),
    }),
    dimensions: z.array(LadderNarrationDimension).length(5),
    user_context: z.string(),
    full_assessment: z.array(LadderFullAssessmentEntry).length(30).optional(),
  }),
  corpus: z.record(z.string()),
});

export const LadderGetPendingNarrationInput = z.object({}).strict();

export const LadderGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: LadderNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

export const LadderCalibrateInput = z.object({
  dimension_levels: LadderDimensionLevels,
  manager_review_text: z.string().min(50).max(8000),
  user_context: z.string().default(""),
});

/** Path 4 narration brief for the manager-calibration delta. Distinct from LadderNarrateOutput because the inputs and structure differ. */
export const LadderCalibrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    dimension_levels: LadderDimensionLevels,
    manager_review_text: z.string(),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

// ───────────────────────────────────────────────────────────
// #51 PM-ify My Inbox schemas
// ───────────────────────────────────────────────────────────

export const PmifyModeEnum = z.enum(["pm-ify", "de-pm-ify"]);
export type PmifyMode = z.infer<typeof PmifyModeEnum>;

/**
 * Footnote pattern names the translation should pull from. Each maps to a
 * corpus topic (anchor slug) that the host model uses for grounding the
 * single-line diagnosis. The pool is a closed set — if the model wants to
 * cite a pattern not in the list, it should pick the closest one rather than
 * invent.
 */
export const PmifyPatternEnum = z.enum([
  "pm-pitfalls",
  "spotting-bad-pm-behaviors",
  "saying-no",
]);
export type PmifyPattern = z.infer<typeof PmifyPatternEnum>;

export const PmifyGetModesInput = z.object({}).strict();

export const PmifyGetModesOutput = z.object({
  modes: z.array(
    z.object({
      slug: PmifyModeEnum,
      label: z.string(),
      direction: z.string(),
      example: z.string(),
    }),
  ).length(2),
  patterns: z.array(PmifyPatternEnum).length(3),
  note: z.string(),
});

export const PmifyTranslateInput = z.object({
  mode: PmifyModeEnum,
  text: z.string().min(1).max(2000),
  user_context: z.string().default(""),
});

export const PmifyTranslateOutput = z.object({
  mode: PmifyModeEnum,
  text: z.string(),
  persistence_warning: z.string().optional(),
});

export const PmifyNarrateInput = z.object({
  mode: PmifyModeEnum,
  text: z.string().min(1).max(2000),
  user_context: z.string().default(""),
});

/** Path 4 narration brief for the PM-ify translation + footnotes. */
export const PmifyNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    mode: PmifyModeEnum,
    user_text: z.string(),
    pattern_pool: z.array(PmifyPatternEnum).length(3),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const PmifyGetPendingNarrationInput = z.object({}).strict();

export const PmifyGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: PmifyNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ───────────────────────────────────────────────────────────
// #52 How [You] Build Product schemas
// ───────────────────────────────────────────────────────────

export const HowYouBuildModeEnum = z.enum([
  "reverence-profile",
  "linkedin-humblebrag",
  "acquired-cold-open",
]);
export type HowYouBuildMode = z.infer<typeof HowYouBuildModeEnum>;

/** Structured team-composition inputs. Three counts + three short text fields. */
export const HowYouBuildTeam = z.object({
  pm_count: z.number().int().min(0).max(200),
  eng_count: z.number().int().min(0).max(1000),
  des_count: z.number().int().min(0).max(200),
  tools: z.string().min(1).max(400).describe("Comma-separated tools the team uses, e.g. 'Notion, Linear, Slack'"),
  rituals: z.string().min(1).max(400).describe("Comma-separated rituals, e.g. 'Mon/Wed/Fri standups, pinned roadmap, Friday demos'"),
  last_shipped: z.string().min(1).max(400).describe("Short description of the last thing the team shipped."),
});
export type HowYouBuildTeamT = z.infer<typeof HowYouBuildTeam>;

export const HowYouBuildGetModesInput = z.object({}).strict();

export const HowYouBuildGetModesOutput = z.object({
  modes: z.array(
    z.object({
      slug: HowYouBuildModeEnum,
      label: z.string(),
      length_hint: z.string(),
      summary: z.string(),
    }),
  ).length(3),
  fields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      kind: z.enum(["int", "text"]),
      placeholder: z.string(),
    }),
  ).length(6),
  note: z.string(),
});

export const HowYouBuildGenerateInput = z.object({
  mode: HowYouBuildModeEnum,
  team: HowYouBuildTeam,
  user_context: z.string().default(""),
});

export const HowYouBuildGenerateOutput = z.object({
  mode: HowYouBuildModeEnum,
  team: HowYouBuildTeam,
  persistence_warning: z.string().optional(),
});

export const HowYouBuildNarrateInput = z.object({
  mode: HowYouBuildModeEnum,
  team: HowYouBuildTeam,
  user_context: z.string().default(""),
});

/** Path 4 narration brief. No corpus chunks — the parody is voice/structure work, not corpus citation. `corpus` is present (schema-required) but typically an empty record. */
export const HowYouBuildNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    mode: HowYouBuildModeEnum,
    team: HowYouBuildTeam,
    /** Pre-assembled [INPUT] block matching the prompt.md template — saves the host model from re-formatting. */
    input_block: z.string(),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const HowYouBuildGetPendingNarrationInput = z.object({}).strict();

export const HowYouBuildGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: HowYouBuildNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ───────────────────────────────────────────────────────────
// #12-38 Founder PM hire schemas
// ───────────────────────────────────────────────────────────

export const FounderStageEnum = z.enum(["pre-seed", "seed", "series-a", "series-b-plus"]);
export const FounderPMTodayEnum = z.enum([
  "the-founder",
  "doubling-up-engineer",
  "doubling-up-designer",
  "ceo-and-head-eng",
  "nobody",
]);
export const FounderTimeEnum = z.enum([
  "rarely",
  "some-of-the-time",
  "most-of-the-time",
  "full-time",
]);
export const FounderEnjoymentEnum = z.enum(["enjoy", "tolerate", "dislike"]);
export const FounderCEOBandwidthEnum = z.enum([
  "room-to-add-product",
  "stretched-but-functioning",
  "overstretched",
]);
export const FounderProductDensityEnum = z.enum(["light", "moderate", "heavy"]);
export const FounderBottleneckEnum = z.enum([
  "we-dont-know-what-to-build",
  "we-cant-keep-up-with-stakeholders",
  "engineering-builds-wrong-thing",
  "no-time-for-customer-research",
  "no-time-for-strategy",
]);
export const FounderVerdictEnum = z.enum([
  "stay-founder-mode",
  "not-yet",
  "hire-apm",
  "hire-empowered-pm",
  "hire-head-of-product",
]);
export const FounderPlaybookEnum = z.enum([
  "pre-seed-founder-owns-product",
  "seed-early-team",
  "seed-founder-distracted",
  "need-product-clarity-first",
]);
export type FounderVerdict = z.infer<typeof FounderVerdictEnum>;
export type FounderPlaybook = z.infer<typeof FounderPlaybookEnum>;

export const FounderInputs = z.object({
  stage: FounderStageEnum,
  team_size: z.number().int().min(0).max(500),
  pm_today: FounderPMTodayEnum,
  founder_time: FounderTimeEnum,
  enjoyment: FounderEnjoymentEnum,
  ceo_bandwidth: FounderCEOBandwidthEnum,
  product_density: FounderProductDensityEnum,
  bottleneck: FounderBottleneckEnum,
});
export type FounderInputsT = z.infer<typeof FounderInputs>;

export const FounderGetFormInput = z.object({}).strict();
export const FounderGetFormOutput = z.object({
  fields: z.array(z.object({
    key: z.string(),
    label: z.string(),
    kind: z.enum(["enum", "int"]),
    options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    placeholder: z.string().optional(),
  })),
  verdicts: z.array(FounderVerdictEnum).length(5),
  note: z.string(),
});

export const FounderDecideInput = z.object({
  inputs: FounderInputs,
  user_context: z.string().default(""),
});

export const FounderDecideOutput = z.object({
  verdict: FounderVerdictEnum,
  playbook: FounderPlaybookEnum.nullable(),
  inputs: FounderInputs,
  persistence_warning: z.string().optional(),
});

export const FounderNarrateInput = z.object({
  inputs: FounderInputs,
  user_context: z.string().default(""),
});

export const FounderNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    verdict: FounderVerdictEnum,
    playbook: FounderPlaybookEnum.nullable(),
    user_inputs: FounderInputs,
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const FounderGetPendingNarrationInput = z.object({}).strict();
export const FounderGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: FounderNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ───────────────────────────────────────────────────────────
// #2 Strategy Pressure-Tester schemas
// ───────────────────────────────────────────────────────────

export const StrategyDocTypeEnum = z.enum(["strategy", "roadmap", "prd", "mixed"]);
export type StrategyDocType = z.infer<typeof StrategyDocTypeEnum>;

export const StrategyGetFormInput = z.object({}).strict();
export const StrategyGetFormOutput = z.object({
  doc_types: z.array(StrategyDocTypeEnum).length(4),
  corpus_anchors: z.array(z.string()),
  passes: z.array(z.object({
    slug: z.string(),
    label: z.string(),
    summary: z.string(),
  })).length(4),
  note: z.string(),
});

export const StrategyPressureTestInput = z.object({
  strategy_text: z.string().min(200).max(4000),
  user_context: z.string().default(""),
});

export const StrategyPressureTestOutput = z.object({
  doc_type: StrategyDocTypeEnum,
  strategy_text: z.string(),
  persistence_warning: z.string().optional(),
});

export const StrategyNarrateInput = z.object({
  strategy_text: z.string().min(200).max(4000),
  user_context: z.string().default(""),
  doc_type: StrategyDocTypeEnum.optional(),
});

export const StrategyNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    doc_type: StrategyDocTypeEnum,
    strategy_text: z.string(),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const StrategyGetPendingNarrationInput = z.object({}).strict();
export const StrategyGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: StrategyNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ───────────────────────────────────────────────────────────
// #6 AI Eval Coverage Scorecard schemas
// ───────────────────────────────────────────────────────────

export const EvalCategoryEnum = z.enum([
  "correctness",
  "refusal-behavior",
  "latency",
  "hallucination-rate",
  "jailbreak-resistance",
  "regression-set",
  "drift-detection",
]);
export type EvalCategory = z.infer<typeof EvalCategoryEnum>;

export const EvalFeatureInputs = z.object({
  feature_one_liner: z.string().min(1).max(200),
  audience: z.string().min(1).max(200),
  failure_modes: z.string().min(1).max(300),
});
export type EvalFeatureInputsT = z.infer<typeof EvalFeatureInputs>;

export const EvalGetFormInput = z.object({}).strict();
export const EvalGetFormOutput = z.object({
  fields: z.array(z.object({
    key: z.string(),
    label: z.string(),
    placeholder: z.string(),
    max_length: z.number().int().positive(),
  })).length(3),
  categories: z.array(z.object({
    slug: EvalCategoryEnum,
    label: z.string(),
    summary: z.string(),
    common_omission: z.string(),
  })).length(7),
  note: z.string(),
});

export const EvalScoreInput = z.object({
  feature: EvalFeatureInputs,
  user_context: z.string().default(""),
});

export const EvalScoreOutput = z.object({
  feature: EvalFeatureInputs,
  persistence_warning: z.string().optional(),
});

export const EvalNarrateInput = z.object({
  feature: EvalFeatureInputs,
  user_context: z.string().default(""),
});

export const EvalNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    feature: EvalFeatureInputs,
    categories: z.array(z.object({
      slug: EvalCategoryEnum,
      label: z.string(),
      summary: z.string(),
      common_omission: z.string(),
    })).length(7),
    scoring_formula: z.string(),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const EvalGetPendingNarrationInput = z.object({}).strict();
export const EvalGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: EvalNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ───────────────────────────────────────────────────────────
// #9 North Star Metric Finder schemas
// ───────────────────────────────────────────────────────────

export const NSMBusinessShapeEnum = z.enum([
  "b2c-subscription",
  "b2c-transactional",
  "b2b-plg",
  "b2b-sales-led",
  "marketplace",
  "prosumer",
]);
export const NSMMonetizationEnum = z.enum([
  "pay-per-use",
  "subscription",
  "freemium-to-paid",
  "seat-based",
  "consumption-based",
  "ad-supported",
  "other",
]);
export const NSMRevenueBandEnum = z.enum([
  "pre-revenue",
  "0-100k",
  "100k-1m",
  "1m-10m",
  "10m-100m",
  "100m-plus",
]);
export const NSMStageEnum = z.enum(["pre-pmf", "early-pmf", "scaling", "mature"]);
export const NSMMarketplaceSideEnum = z.enum(["supply", "demand", "both"]);
export type NSMBusinessShape = z.infer<typeof NSMBusinessShapeEnum>;

export const NSMInputs = z.object({
  business_shape: NSMBusinessShapeEnum,
  business_unusual: z.string().max(200).default(""),
  primary_user_action: z.string().min(1).max(200),
  monetization: z.array(NSMMonetizationEnum).min(1),
  revenue_band: NSMRevenueBandEnum,
  friction_top: z.string().min(1).max(200),
  stage: NSMStageEnum,
  marketplace_side: NSMMarketplaceSideEnum.optional(),
  dashboard_paste: z.string().max(2000).default(""),
});
export type NSMInputsT = z.infer<typeof NSMInputs>;

export const NSMGetFormInput = z.object({}).strict();
export const NSMGetFormOutput = z.object({
  fields: z.array(z.object({
    key: z.string(),
    label: z.string(),
    kind: z.enum(["enum", "multi-enum", "text", "textarea"]),
    required: z.boolean(),
    options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    placeholder: z.string().optional(),
    max_length: z.number().int().positive().optional(),
    only_when: z.object({ key: z.string(), equals: z.string() }).optional(),
  })),
  nsm_families: z.array(z.object({
    business_shape: NSMBusinessShapeEnum,
    family: z.string(),
  })).length(6),
  note: z.string(),
});

export const NSMRunInput = z.object({
  inputs: NSMInputs,
  user_context: z.string().default(""),
});

export const NSMRunOutput = z.object({
  inputs: NSMInputs,
  nsm_family: z.string(),
  has_dashboard: z.boolean(),
  persistence_warning: z.string().optional(),
});

export const NSMNarrateInput = z.object({
  inputs: NSMInputs,
  user_context: z.string().default(""),
});

export const NSMNarrateOutput = z.object({
  type: z.literal("narration_brief"),
  audience: z.literal("user"),
  directive: z.string(),
  voice_rules: z.array(z.string()),
  structure: z.object({
    sections: z.array(z.string()),
    per_section_template: z.string(),
    length_cap: z.string(),
  }),
  inputs: z.object({
    user_inputs: NSMInputs,
    nsm_family: z.string(),
    has_dashboard: z.boolean(),
    dashboard_lines: z.array(z.string()),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const NSMGetPendingNarrationInput = z.object({}).strict();
export const NSMGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: NSMNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);
