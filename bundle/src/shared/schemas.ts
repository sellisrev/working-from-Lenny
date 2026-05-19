import { z } from "zod";

export const AnswerEnum = z.enum(["always", "sometimes", "never"]);
export type Answer = z.infer<typeof AnswerEnum>;

export const PitfallScoreInput = z.object({
  answers: z.array(AnswerEnum).length(20),
});

export const PitfallScoreOutput = z.object({
  score_display: z.number().int().min(0).max(20),
  top_three_pitfall_ids: z.array(z.number().int().min(1).max(20)).length(3),
  exemplar_quotes: z.array(z.string()).length(3),
  all_never: z.boolean(),
});

export const PitfallNarrateInput = z.object({
  score_display: z.number().int().min(0).max(20),
  top_three_pitfall_ids: z.array(z.number().int().min(1).max(20)).length(3),
  user_context: z.string().default(""),
});

export const PitfallNarrationItem = z.object({
  pitfall_id: z.number().int().min(1).max(20),
  diagnosis: z.string(),
  behaviors: z.array(z.string()).length(2),
  example: z.string(),
});

export const PitfallNarrateOutput = z.object({
  narrations: z.array(PitfallNarrationItem).length(3),
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
