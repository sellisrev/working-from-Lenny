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
