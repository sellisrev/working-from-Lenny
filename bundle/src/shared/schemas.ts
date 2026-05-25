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

/**
 * Per-category eval-practice answers. All optional — a blank string means
 * "the user didn't volunteer a current practice for this category", which the
 * host model treats as evidence that the category is missing (or partial if
 * the methodology_paste mentions it). Cap each at 300 chars; the user is
 * encouraged to use methodology_paste for longer detail.
 */
export const EvalPractice = z.object({
  correctness: z.string().max(300).default(""),
  refusal_behavior: z.string().max(300).default(""),
  latency: z.string().max(300).default(""),
  hallucination_rate: z.string().max(300).default(""),
  jailbreak_resistance: z.string().max(300).default(""),
  regression_set: z.string().max(300).default(""),
  drift_detection: z.string().max(300).default(""),
});
export type EvalPracticeT = z.infer<typeof EvalPractice>;

export const EvalFeatureInputs = z.object({
  feature_one_liner: z.string().min(1).max(200),
  audience: z.string().min(1).max(200),
  failure_modes: z.string().min(1).max(300),
  /**
   * Optional per-category practice answers. Defaults to all blank so the
   * legacy 3-field shape still validates.
   */
  practice: EvalPractice.default({
    correctness: "",
    refusal_behavior: "",
    latency: "",
    hallucination_rate: "",
    jailbreak_resistance: "",
    regression_set: "",
    drift_detection: "",
  }),
  /**
   * Optional eval methodology document the user pastes (or uploads — the
   * iframe reads .md / .txt / .json files client-side via FileReader and
   * populates this field). 8000-char cap matches the manager-review-text
   * cap on #3 calibrate for similar long-doc inputs.
   */
  methodology_paste: z.string().max(8000).default(""),
});
export type EvalFeatureInputsT = z.infer<typeof EvalFeatureInputs>;

export const EvalGetFormInput = z.object({}).strict();
export const EvalGetFormOutput = z.object({
  fields: z.array(z.object({
    key: z.string(),
    label: z.string(),
    placeholder: z.string(),
    max_length: z.number().int().positive(),
    kind: z.enum(["text", "textarea"]),
    section: z.enum(["feature", "practice", "methodology"]),
    required: z.boolean(),
    accepts_file: z.boolean().optional(),
  })),
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

// ───────────────────────────────────────────────────────────
// #24 OKR Critique schemas
// ───────────────────────────────────────────────────────────

export const OkrStanceEnum = z.enum(["orthodox", "skeptical", "hybrid"]);
export const OkrLevelEnum = z.enum(["team", "org"]);
export type OkrStance = z.infer<typeof OkrStanceEnum>;
export type OkrLevel = z.infer<typeof OkrLevelEnum>;

export const OkrParsedObjective = z.object({
  text: z.string(),
  key_results: z.array(z.string()),
});
export const OkrParseResult = z.object({
  objectives: z.array(OkrParsedObjective),
  parsing_confidence: z.enum(["low", "med", "high"]),
});
export type OkrParseResultT = z.infer<typeof OkrParseResult>;

export const OkrGetFormInput = z.object({}).strict();
export const OkrGetFormOutput = z.object({
  stances: z.array(OkrStanceEnum).length(3),
  levels: z.array(OkrLevelEnum).length(2),
  too_many_thresholds: z.object({
    kr_per_objective: z.number().int(),
    objectives_team: z.number().int(),
    objectives_org: z.number().int(),
  }),
  note: z.string(),
});

export const OkrCritiqueInput = z.object({
  okr_text: z.string().min(100).max(3000),
  stance: OkrStanceEnum.default("hybrid"),
  level: OkrLevelEnum.default("team"),
  user_context: z.string().default(""),
});

export const OkrCritiqueOutput = z.object({
  parsed: OkrParseResult,
  stance: OkrStanceEnum,
  level: OkrLevelEnum,
  too_many_overall: z.boolean(),
  persistence_warning: z.string().optional(),
});

export const OkrNarrateInput = z.object({
  okr_text: z.string().min(100).max(3000),
  stance: OkrStanceEnum.default("hybrid"),
  level: OkrLevelEnum.default("team"),
  user_context: z.string().default(""),
});

export const OkrNarrateOutput = z.object({
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
    okr_text: z.string(),
    parsed: OkrParseResult,
    stance: OkrStanceEnum,
    level: OkrLevelEnum,
    too_many_overall: z.boolean(),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const OkrGetPendingNarrationInput = z.object({}).strict();
export const OkrGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: OkrNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ───────────────────────────────────────────────────────────
// #47 Mission / Vision / Strategy Alignment schemas
// ───────────────────────────────────────────────────────────

export const MvsGetFormInput = z.object({}).strict();
export const MvsGetFormOutput = z.object({
  fields: z.array(z.object({
    key: z.enum(["mission_text", "vision_text", "strategy_text"]),
    label: z.string(),
    placeholder: z.string(),
    min_length: z.number().int(),
    max_length: z.number().int(),
  })).length(3),
  note: z.string(),
});

export const MvsAlignInput = z.object({
  mission_text: z.string().min(50).max(500),
  vision_text: z.string().min(50).max(500),
  strategy_text: z.string().min(200).max(3000),
  user_context: z.string().default(""),
});

export const MvsAlignOutput = z.object({
  mission_text: z.string(),
  vision_text: z.string(),
  strategy_text: z.string(),
  pairs_count: z.number().int().min(3).max(3),
  strategy_too_vague: z.boolean(),
  persistence_warning: z.string().optional(),
});

export const MvsNarrateInput = z.object({
  mission_text: z.string().min(50).max(500),
  vision_text: z.string().min(50).max(500),
  strategy_text: z.string().min(200).max(3000),
  user_context: z.string().default(""),
});

export const MvsNarrateOutput = z.object({
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
    mission_text: z.string(),
    vision_text: z.string(),
    strategy_text: z.string(),
    pairs: z.array(z.enum(["mission_vs_vision", "mission_vs_strategy", "vision_vs_strategy"])).length(3),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const MvsGetPendingNarrationInput = z.object({}).strict();
export const MvsGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: MvsNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ───────────────────────────────────────────────────────────
// #37 Activation Metric Finder schemas (Phase 3, paired with #9)
// Reuses NSMBusinessShapeEnum + NSMMonetizationEnum + NSMStageEnum +
// NSMMarketplaceSideEnum from #9. Schemas are intentionally shared so a
// user who runs both apps can exchange input-metrics trees losslessly.
// ───────────────────────────────────────────────────────────

export const ActivationInputs = z.object({
  business_shape: NSMBusinessShapeEnum,
  business_unusual: z.string().max(200).default(""),
  primary_value_action: z.string().min(1).max(200),
  monetization: z.array(NSMMonetizationEnum).min(1),
  stage: NSMStageEnum,
  marketplace_side: NSMMarketplaceSideEnum.optional(),
  current_activation_rate_estimate: z.string().max(20).default(""),
  aha_moment_guess: z.string().max(200).default(""),
  funnel_paste: z.string().max(2000).default(""),
});
export type ActivationInputsT = z.infer<typeof ActivationInputs>;

export const ActivationGetFormInput = z.object({}).strict();
export const ActivationGetFormOutput = z.object({
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
  activation_families: z.array(z.object({
    business_shape: NSMBusinessShapeEnum,
    family: z.string(),
  })).length(6),
  note: z.string(),
});

export const ActivationRunInput = z.object({
  inputs: ActivationInputs,
  user_context: z.string().default(""),
});

export const ActivationRunOutput = z.object({
  inputs: ActivationInputs,
  activation_family: z.string(),
  has_funnel: z.boolean(),
  ai_product_flagged: z.boolean(),
  persistence_warning: z.string().optional(),
});

export const ActivationNarrateInput = z.object({
  inputs: ActivationInputs,
  user_context: z.string().default(""),
});

export const ActivationNarrateOutput = z.object({
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
    user_inputs: ActivationInputs,
    activation_family: z.string(),
    has_funnel: z.boolean(),
    funnel_lines: z.array(z.string()),
    ai_product_flagged: z.boolean(),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const ActivationGetPendingNarrationInput = z.object({}).strict();
export const ActivationGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: ActivationNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// --- #57 Pressure-Test Anything + #58 Hiring Playbook -----------------------
// Single-call Path-4 apps (PHASE2_BUILD #11): the *_ask tool IS the narration
// step, returning a narration_brief directly. No score -> narrate -> get-pending
// spine, no persistence (readOnlyHint: true). Shared corpus-wide retrieval.

/** One retrieved corpus hit carried in a brief's inputs (slug + provenance, not the chunk). */
const CorpusHitRef = z.object({
  slug: z.string(),
  kind: z.enum(["topic", "obsolete", "caution", "book"]),
  ref: z.string(),
  last_updated: z.string().nullable(),
});

/** A soft cross-app routing offer ({id} accepts "12-38" for the merged founder app). */
const SuggestedApp = z.object({
  id: z.union([z.number().int(), z.string()]),
  name: z.string(),
  entry_tool: z.string(),
});

export const PressureTestAskInput = z
  .object({
    plan: z.string().min(1).max(4000),
    k: z.number().int().min(1).max(20).default(10),
  })
  .strict();

export const PressureTestAskOutput = z.object({
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
    plan: z.string(),
    hits: z.array(CorpusHitRef),
    /** Obsolete + caution hits, surfaced so the host flags what changed rather than repeating expired advice. */
    decay: z.array(CorpusHitRef).optional(),
    suggested_app: SuggestedApp.optional(),
  }),
  corpus: z.record(z.string()),
});

export const HirePlaybookAskInput = z
  .object({
    scenario: z.string().min(1).max(4000),
    k: z.number().int().min(1).max(20).default(10),
  })
  .strict();

export const HirePlaybookAskOutput = z.object({
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
    scenario: z.string(),
    hits: z.array(CorpusHitRef),
    /** Caution hits for cited guests with active caution files (the one-line speaker-context aside). */
    caution: z.array(CorpusHitRef).optional(),
    suggested_app: SuggestedApp.optional(),
  }),
  corpus: z.record(z.string()),
});

// ───────────────────────────────────────────────────────────
// #33 7 Powers Self-Classifier schemas (Phase 3, wizard clones #9)
// Novel mechanic: a claim-vs-evidence matrix per power. The deterministic
// engine classifies each power (has-evidence / plausible / absent) from its
// evidence ratings and raises the delusion / overstated / blind-spot flags
// where the claim and the evidence diverge.
// ───────────────────────────────────────────────────────────

export const SevenPowersClaimEnum = z.enum(["have", "maybe", "no"]);
export type SevenPowersClaim = z.infer<typeof SevenPowersClaimEnum>;

export const SevenPowersEvidenceEnum = z.enum(["true", "partly", "false"]);
export type SevenPowersEvidence = z.infer<typeof SevenPowersEvidenceEnum>;

export const SevenPowersPowerEnum = z.enum([
  "scale_economies",
  "network_economies",
  "counter_positioning",
  "switching_costs",
  "branding",
  "cornered_resource",
  "process_power",
]);
export type SevenPowersPowerSlug = z.infer<typeof SevenPowersPowerEnum>;

export const SevenPowersClassificationEnum = z.enum([
  "has-evidence",
  "plausible",
  "absent",
]);
export type SevenPowersClassificationT = z.infer<
  typeof SevenPowersClassificationEnum
>;

export const SevenPowersFlagEnum = z.enum([
  "delusional",
  "overstated",
  "blind-spot",
]);
export type SevenPowersFlagT = z.infer<typeof SevenPowersFlagEnum>;

const sevenPowersAnswer = (n: number) =>
  z.object({
    claim: SevenPowersClaimEnum,
    evidence: z.array(SevenPowersEvidenceEnum).length(n),
  });

/** Per-power claim + evidence. Network / scale / counter-positioning / switching carry 3 evidence questions; branding / cornered resource / process carry 2. */
export const SevenPowersAnswers = z.object({
  scale_economies: sevenPowersAnswer(3),
  network_economies: sevenPowersAnswer(3),
  counter_positioning: sevenPowersAnswer(3),
  switching_costs: sevenPowersAnswer(3),
  branding: sevenPowersAnswer(2),
  cornered_resource: sevenPowersAnswer(2),
  process_power: sevenPowersAnswer(2),
});
export type SevenPowersAnswersT = z.infer<typeof SevenPowersAnswers>;

export const SevenPowersQuestionGroup = z.object({
  power: SevenPowersPowerEnum,
  power_name: z.string(),
  claim_question: z.string(),
  evidence_questions: z.array(z.string()).min(2).max(3),
});

export const SevenPowersGetQuestionsInput = z.object({}).strict();
export const SevenPowersGetQuestionsOutput = z.object({
  powers: z.array(SevenPowersQuestionGroup).length(7),
  claim_options: z.array(SevenPowersClaimEnum).length(3),
  evidence_options: z.array(SevenPowersEvidenceEnum).length(3),
  note: z.string(),
});

export const SevenPowersClassification = z.object({
  power: SevenPowersPowerEnum,
  power_name: z.string(),
  claim: SevenPowersClaimEnum,
  evidence_score: z.number().int().min(0),
  evidence_max: z.number().int().min(0),
  evidence_pct: z.number().min(0).max(1),
  classification: SevenPowersClassificationEnum,
  flag: SevenPowersFlagEnum.nullable(),
});

export const SevenPowersScoreInput = z.object({
  answers: SevenPowersAnswers,
  user_context: z.string().default(""),
});

export const SevenPowersScoreOutput = z.object({
  classifications: z.array(SevenPowersClassification).length(7),
  powers: z.array(SevenPowersQuestionGroup).length(7),
  persistence_warning: z.string().optional(),
});

export const SevenPowersBriefPower = z.object({
  power: SevenPowersPowerEnum,
  power_name: z.string(),
  claim: SevenPowersClaimEnum,
  classification: SevenPowersClassificationEnum,
  flag: SevenPowersFlagEnum.nullable(),
  evidence_pct: z.number().min(0).max(1),
  benefit_barrier: z.string(),
  test_next_quarter: z.string(),
  corpus_anchors: z.array(z.string()),
});

export const SevenPowersPowerMap = z.object({
  has_evidence: z.array(SevenPowersPowerEnum),
  plausible: z.array(SevenPowersPowerEnum),
  absent: z.array(SevenPowersPowerEnum),
  delusional: z.array(SevenPowersPowerEnum),
  overstated: z.array(SevenPowersPowerEnum),
  blind_spot: z.array(SevenPowersPowerEnum),
});

export const SevenPowersNarrateInput = z.object({
  answers: SevenPowersAnswers,
  user_context: z.string().default(""),
});

/** Path 4 narration brief for the 7 Powers map. */
export const SevenPowersNarrateOutput = z.object({
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
    powers: z.array(SevenPowersBriefPower).length(7),
    power_map: SevenPowersPowerMap,
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const SevenPowersGetPendingNarrationInput = z.object({}).strict();
export const SevenPowersGetPendingNarrationOutput = z.discriminatedUnion(
  "status",
  [
    z.object({
      status: z.literal("ready"),
      saved_at: z.string(),
      brief: SevenPowersNarrateOutput,
    }),
    z.object({
      status: z.literal("no_pending"),
      note: z.string(),
    }),
  ],
);

// ───────────────────────────────────────────────────────────
// #34 Crossing-the-Chasm Stage Finder schemas (Phase 3, wizard clones #33/#9)
// Novel mechanic: a categorical rule cascade (not a score sum). Chasm position
// has dispositive signals, so the cascade order is load-bearing and "at the
// chasm" surfaces as its own diagnosis.
// ───────────────────────────────────────────────────────────

export const ChasmAcquisitionEnum = z.enum([
  "accelerating",
  "steady",
  "stalling",
  "lumpy-referral-only",
]);
export const ChasmPainEnum = z.enum([
  "one-sentence-named-pain",
  "broad-value-prop",
  "still-figuring-it-out",
]);
export const ChasmWholeProductEnum = z.enum(["yes-complete", "partial", "no"]);
export const ChasmBeachheadEnum = z.enum([
  "yes-one-segment",
  "several-segments",
  "no-we-sell-to-anyone",
]);
export const ChasmReferenceEnum = z.enum([
  "pragmatist-references-exist",
  "only-visionary-references",
  "none",
]);
export const ChasmStageEnum = z.enum([
  "early-market",
  "at-the-chasm",
  "bowling-alley",
  "tornado",
  "main-street",
]);
export type ChasmStageT = z.infer<typeof ChasmStageEnum>;

export const ChasmCustomerMix = z.object({
  innovators_visionaries: z.number().int().min(0).max(100),
  pragmatists: z.number().int().min(0).max(100),
  dont_know: z.number().int().min(0).max(100),
});

export const ChasmInputs = z.object({
  customer_mix: ChasmCustomerMix,
  acquisition_trend: ChasmAcquisitionEnum,
  pain_specificity: ChasmPainEnum,
  whole_product: ChasmWholeProductEnum,
  beachhead_named: ChasmBeachheadEnum,
  reference_customers: ChasmReferenceEnum.optional(),
});
export type ChasmInputsT = z.infer<typeof ChasmInputs>;

export const ChasmGetFormInput = z.object({}).strict();
export const ChasmGetFormOutput = z.object({
  fields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      kind: z.enum(["enum", "customer-mix"]),
      required: z.boolean(),
      options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
      help: z.string().optional(),
    }),
  ),
  stages: z.array(z.object({ stage: ChasmStageEnum, label: z.string() })).length(5),
  note: z.string(),
});

export const ChasmScoreInput = z.object({
  inputs: ChasmInputs,
  user_context: z.string().default(""),
});

export const ChasmScoreOutput = z.object({
  inputs: ChasmInputs,
  stage: ChasmStageEnum,
  stage_label: z.string(),
  placing_signals: z.array(z.string()),
  next_stage_label: z.string().nullable(),
  persistence_warning: z.string().optional(),
});

export const ChasmNarrateInput = z.object({
  inputs: ChasmInputs,
  user_context: z.string().default(""),
});

/** Path 4 narration brief for the chasm stage diagnosis. */
export const ChasmNarrateOutput = z.object({
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
    user_inputs: ChasmInputs,
    stage: ChasmStageEnum,
    stage_label: z.string(),
    placing_signals: z.array(z.string()),
    why_here: z.string(),
    next_stage_label: z.string().nullable(),
    next_play: z.string(),
    failure_mode: z.string(),
    at_chasm_line: z.string().optional(),
    user_context: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const ChasmGetPendingNarrationInput = z.object({}).strict();
export const ChasmGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: ChasmNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ── #46 Spotting Bad PM Behaviors ──────────────────────────────────────────

export const SpottingAnswerEnum = z.enum(["often", "sometimes", "havent-seen-it"]);
export const SpottingActionRungEnum = z.enum([
  "private_feedback",
  "document_then_feedback",
  "document_and_escalate",
  "reframe_or_leave",
]);
export const SpottingSeverityTierEnum = z.enum(["green", "yellow", "red"]);

export const SpottingBehavior = z.object({
  id: z.number().int().min(1).max(15),
  text: z.string(),
});

export const SpottingTopPattern = z.object({
  behavior_id: z.number().int().min(1).max(15),
  behavior_text: z.string(),
  pattern_weight: z.number().int().min(0),
  action_rung: SpottingActionRungEnum,
});

export const SpottingGetQuestionsInput = z.object({}).strict();
export const SpottingGetQuestionsOutput = z.object({
  behaviors: z.array(SpottingBehavior).length(15),
  note: z.string(),
});

export const SpottingScoreInput = z.object({
  answers: z.array(SpottingAnswerEnum).length(15),
  user_context: z.string().default(""),
});

export const SpottingScoreOutput = z.object({
  severity_tier: SpottingSeverityTierEnum,
  total: z.number().int().min(0),
  top_patterns: z.array(SpottingTopPattern).max(3),
  behaviors: z.array(SpottingBehavior).length(15),
  persistence_warning: z.string().optional(),
});

export const SpottingNarrateInput = z.object({
  severity_tier: SpottingSeverityTierEnum,
  total: z.number().int().min(0),
  top_patterns: z.array(SpottingTopPattern).max(3),
  user_context: z.string().default(""),
  answers: z.array(SpottingAnswerEnum).length(15).optional(),
});

export const SpottingFullAuditItem = z.object({
  behavior_id: z.number().int().min(1).max(15),
  behavior_text: z.string(),
  user_rating: SpottingAnswerEnum,
});

export const SpottingNarrateOutput = z.object({
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
    severity_tier: SpottingSeverityTierEnum,
    total: z.number().int().min(0),
    user_context: z.string(),
    patterns: z.array(
      z.object({
        behavior_id: z.number().int().min(1).max(15),
        behavior_text: z.string(),
        action_rung: SpottingActionRungEnum,
        corpus_anchors: z.array(z.string()),
      }),
    ).max(3),
    full_audit: z.array(SpottingFullAuditItem).length(15).optional(),
  }),
  corpus: z.record(z.string()),
});

export const SpottingGetPendingNarrationInput = z.object({}).strict();
export const SpottingGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: SpottingNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ── #28 Burnout Warning Index ─────────────────────────────────────────────────

export const BurnoutSleepEnum = z.enum(["solid", "uneven", "poor"]);
export const BurnoutLastGoodDayEnum = z.enum(["this-week", "this-month", "cant-remember"]);
export const BurnoutDreadSignalEnum = z.enum(["rarely", "some-mornings", "most-mornings"]);
export const BurnoutTierEnum = z.enum(["green", "yellow", "red"]);

export const BurnoutDriver = z.object({
  key: z.string(),
  label: z.string(),
  weighted_points: z.number(),
});

export const BurnoutInputsSchema = z.object({
  meetings_per_week: z.number().int().min(0).max(100),
  deep_work_blocks_remaining: z.number().int().min(0).max(40),
  after_hours_meeting_pct: z.number().int().min(0).max(100),
  weeks_since_real_vacation: z.number().int().min(0).max(520),
  sleep_self_report: BurnoutSleepEnum,
  last_good_day: BurnoutLastGoodDayEnum,
  dread_signal: BurnoutDreadSignalEnum,
  recovery_capacity: z.string().max(200).optional(),
});

export const BurnoutGetFormInput = z.object({}).strict();
export const BurnoutGetFormOutput = z.object({
  fields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      kind: z.enum(["number", "enum", "text"]),
      required: z.boolean(),
      options: z.array(z.string()).optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      max_length: z.number().optional(),
    }),
  ),
  note: z.string(),
});

export const BurnoutScoreInput = z.object({
  inputs: BurnoutInputsSchema,
  user_context: z.string().default(""),
});
export const BurnoutScoreOutput = z.object({
  index: z.number().int().min(0).max(100),
  tier: BurnoutTierEnum,
  override_fired: z.boolean(),
  top_drivers: z.array(BurnoutDriver).max(2),
  inputs: z.record(z.unknown()),
  persistence_warning: z.string().optional(),
});

export const BurnoutNarrateInput = z.object({
  inputs: z.record(z.unknown()),
  user_context: z.string().default(""),
});
export const BurnoutNarrateOutput = z.object({
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
    index: z.number(),
    tier: BurnoutTierEnum,
    override_fired: z.boolean(),
    top_drivers: z.array(BurnoutDriver),
    recovery_capacity: z.string(),
    user_context: z.string(),
    raw_inputs: z.record(z.unknown()),
  }),
  corpus: z.record(z.string()),
});

export const BurnoutGetPendingNarrationInput = z.object({}).strict();
export const BurnoutGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: BurnoutNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ── #30 Onboarding to PM 101 for Non-PMs ─────────────────────────────────────

export const OnboardingRoleEnum = z.enum([
  "engineer",
  "designer",
  "sales",
  "customer-success",
  "other-cross-functional",
]);
export const OnboardingStageEnum = z.enum(["seed", "series-a-b", "growth", "enterprise"]);
export const OnboardingPmRatioEnum = z.enum(["solo-pm", "pm-per-squad", "heavy-pm-org"]);

export const OnboardingLesson = z.object({
  id: z.number().int().min(1).max(5),
  title: z.string(),
});

export const OnboardingGetModesInput = z.object({}).strict();
export const OnboardingGetModesOutput = z.object({
  lessons: z.array(OnboardingLesson).length(5),
  fields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      kind: z.enum(["enum", "text"]),
      options: z.array(z.string()).optional(),
      optional: z.boolean().optional(),
    }),
  ),
  note: z.string(),
});

export const OnboardingInputsSchema = z.object({
  role: OnboardingRoleEnum,
  company_stage: OnboardingStageEnum,
  pm_ratio: OnboardingPmRatioEnum.optional(),
  biggest_confusion: z.string().max(200).optional(),
});

export const OnboardingGenerateInput = z.object({
  inputs: OnboardingInputsSchema,
  user_context: z.string().default(""),
});
export const OnboardingGenerateOutput = z.object({
  inputs: z.record(z.unknown()),
  persistence_warning: z.string().optional(),
});

export const OnboardingNarrateInput = z.object({
  inputs: z.record(z.unknown()),
  user_context: z.string().default(""),
});
export const OnboardingNarrateOutput = z.object({
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
    role: OnboardingRoleEnum,
    company_stage: OnboardingStageEnum,
    pm_ratio: OnboardingPmRatioEnum.optional(),
    biggest_confusion: z.string(),
    user_context: z.string(),
    role_lens: z.string(),
    stage_calibration: z.string(),
  }),
  corpus: z.record(z.string()),
});

export const OnboardingGetPendingNarrationInput = z.object({}).strict();
export const OnboardingGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: OnboardingNarrateOutput,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);

// ── #25 Decision Log + Brier Calibration ──────────────────────────────────────

export const DecisionLogGetFormInput = z.object({}).strict();
export const DecisionLogGetFormOutput = z.object({
  presets: z.array(z.string()),
  remembered_types: z.array(z.string()),
  fields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      kind: z.enum(["text", "int", "enum-or-custom"]),
    }),
  ),
  note: z.string(),
});

export const DecisionLogAddInput = z.object({
  entry: z.object({
    decision_text: z.string().min(1).max(300),
    decision_type: z.string().min(1).max(80),
    confidence_pct: z.number().int().min(1).max(99),
    predicted_outcome: z.string().min(1).max(300),
  }),
  user_context: z.string().default(""),
});
export const DecisionLogAddOutput = z.object({
  saved_entry: z.object({
    id: z.string(),
    created_at: z.string(),
    decision_text: z.string(),
    decision_type: z.string(),
    confidence_pct: z.number().int(),
    predicted_outcome: z.string(),
    status: z.literal("open"),
  }),
  drift_warning: z.string().optional(),
  persistence_warning: z.string().optional(),
});

export const DecisionLogResolveInput = z.object({
  id: z.string().min(1),
  was_right: z.boolean(),
  resolution_note: z.string().max(300).default(""),
});
export const DecisionLogResolveOutput = z.object({
  updated_entry: z.object({
    id: z.string(),
    created_at: z.string(),
    decision_text: z.string(),
    decision_type: z.string(),
    confidence_pct: z.number().int(),
    predicted_outcome: z.string(),
    status: z.literal("resolved"),
    resolved_at: z.string(),
    was_right: z.boolean(),
    resolution_note: z.string(),
  }),
  persistence_warning: z.string().optional(),
});

export const DecisionLogListInput = z.object({}).strict();
export const DecisionLogListOutput = z.object({
  open: z.array(
    z.object({
      id: z.string(),
      created_at: z.string(),
      decision_text: z.string(),
      decision_type: z.string(),
      confidence_pct: z.number().int(),
      predicted_outcome: z.string(),
      is_stale: z.boolean(),
    }),
  ),
  resolved: z.array(
    z.object({
      id: z.string(),
      created_at: z.string(),
      decision_text: z.string(),
      decision_type: z.string(),
      confidence_pct: z.number().int(),
      was_right: z.boolean(),
      resolved_at: z.string(),
      resolution_note: z.string(),
    }),
  ),
  open_count: z.number().int(),
  resolved_count: z.number().int(),
});

const DecisionLogNarrateOutputBase = z.object({
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
    overall_brier: z.number(),
    brier_band: z.enum(["sharp", "decent", "coin-flip", "confidently-wrong"]),
    n_resolved: z.number().int(),
    per_type: z.array(
      z.object({
        decision_type: z.string(),
        n_resolved: z.number().int(),
        mean_confidence: z.number(),
        hit_rate: z.number(),
        gap: z.number(),
        verdict: z.enum([
          "overconfident",
          "underconfident",
          "well-calibrated",
          "insufficient-data",
        ]),
      }),
    ),
    open_count: z.number().int(),
    oldest_open: z
      .object({
        decision_text: z.string(),
        created_at: z.string(),
      })
      .optional(),
    user_context: z.string(),
    persistence_warning: z.string().optional(),
  }),
  corpus: z.record(z.string()),
});

export const DecisionLogCalibrateInput = z.object({
  user_context: z.string().default(""),
});
export const DecisionLogCalibrateOutput = DecisionLogNarrateOutputBase;

export const DecisionLogGetPendingNarrationInput = z.object({}).strict();
export const DecisionLogGetPendingNarrationOutput = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("ready"),
    saved_at: z.string(),
    brief: DecisionLogNarrateOutputBase,
  }),
  z.object({
    status: z.literal("no_pending"),
    note: z.string(),
  }),
]);
