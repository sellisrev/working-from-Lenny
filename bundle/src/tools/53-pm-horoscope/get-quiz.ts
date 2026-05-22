import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  HoroscopeGetQuizInput,
  HoroscopeGetQuizOutput,
} from "../../shared/schemas";
import { QUIZ_QUESTIONS, ARCHETYPE_SLUGS } from "./data";

export const meta: ToolMeta = {
  name: "pm_horoscope_get_quiz",
  description:
    "Entry tool for the PM Horoscope. Calling this triggers the host to mount the ui://working-from-lenny/horoscope resource (an interactive iframe with the six-question archetype quiz and today's reading). If your host mounts the UI, that IS the quiz — do NOT additionally render the six questions in chat as a duplicate surface; the user will answer in the iframe, which calls pm_horoscope_score_quiz directly. The returned `questions` array is provided only as a fallback for hosts that cannot mount ui:// resources. Scoring is positional against this list — if you do render questions in chat (only when ui:// is unavailable), use these six verbatim; never substitute generic personality questions. If the user already knows their archetype, call pm_horoscope_read instead.",
  inputSchema: HoroscopeGetQuizInput,
  outputSchema: HoroscopeGetQuizOutput,
  annotations: { readOnlyHint: true },
  uiResourceUri: "ui://working-from-lenny/horoscope",
};

type Input = z.infer<typeof HoroscopeGetQuizInput>;
type Output = z.infer<typeof HoroscopeGetQuizOutput>;

export const invoke: ToolHandler<Input, Output> = async () => {
  return {
    questions: QUIZ_QUESTIONS,
    archetype_slugs: ARCHETYPE_SLUGS as Output["archetype_slugs"],
    note: "Six questions, one answer each. Each option maps to one archetype; majority wins, ties broken by lowest archetype id. Submit the six 0-indexed option choices as `answers` to pm_horoscope_score_quiz.",
  };
};
