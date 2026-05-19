import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { PitfallScoreInput, PitfallScoreOutput } from "../../shared/schemas";
import { PITFALLS, answerValue, pitfallById } from "./data";

export const meta: ToolMeta = {
  name: "pm_pitfalls_score",
  description:
    "Deterministic. Returns the user's score (0-20) and the three highest-leverage pitfall IDs given their twenty answers, plus the pre-written exemplar quote per pick.",
  inputSchema: PitfallScoreInput,
  outputSchema: PitfallScoreOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PitfallScoreInput>;
type Output = z.infer<typeof PitfallScoreOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { answers } = args;

  let scoreRaw = 0;
  const weighted = PITFALLS.map((p, i) => {
    const av = answerValue(answers[i]);
    scoreRaw += av;
    return { id: p.id, leverage: p.leverage, weight: av * p.leverage };
  });

  const scoreDisplay = Math.round(scoreRaw / 2);
  const allNever = weighted.every((w) => w.weight === 0);

  let topIds: number[];
  if (allNever) {
    // Per spec: "either you're in the top 1% or you're being kind to
    // yourself" — return the three highest-leverage pitfalls (1, 2, 4).
    topIds = [1, 2, 4];
  } else {
    const sorted = weighted.slice().sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      if (b.leverage !== a.leverage) return b.leverage - a.leverage;
      return a.id - b.id;
    });
    topIds = sorted.slice(0, 3).map((s) => s.id);
  }

  const exemplarQuotes = topIds.map((id) => pitfallById(id).quote);

  return {
    score_display: scoreDisplay,
    top_three_pitfall_ids: topIds as [number, number, number],
    exemplar_quotes: exemplarQuotes as [string, string, string],
    all_never: allNever,
  };
};
