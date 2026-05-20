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
});

export const PitfallScoreOutput = z.object({
  score_display: z.number().int().min(0).max(20),
  top_three_pitfall_ids: z.array(z.number().int().min(1).max(20)).length(3),
  exemplar_quotes: z.array(z.string()).length(3),
  all_never: z.boolean(),
  questions: z.array(PitfallQuestion).length(20),
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
