import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import {
  PitfallNarrateInput,
  PitfallNarrateOutput,
} from "../../shared/schemas";
import { pitfallById } from "./data";
import { requestNarration } from "../../lib/sampling";
import { loadCorpusChunks } from "../../lib/corpus";
import { SamplingUnavailableError } from "../../shared/types";

export const meta: ToolMeta = {
  name: "pm_pitfalls_narrate",
  description:
    "LLM-narrated. Takes the score and top three picks and returns personalized one-paragraph diagnoses plus two concrete behaviors and a corpus example per pitfall. Uses local corpus chunks for grounding.",
  inputSchema: PitfallNarrateInput,
  outputSchema: PitfallNarrateOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof PitfallNarrateInput>;
type Output = z.infer<typeof PitfallNarrateOutput>;

const SYSTEM_PROMPT = [
  "You are a candid PM coach drawing from a synthesized corpus of product, founder, and operator interviews from Lenny's Newsletter and the How I AI show.",
  "The user has just self-audited their PM behavior on twenty pitfalls. Return personalized narration for their three highest-leverage picks.",
  "Be direct. No corporate softening. No em dashes. No 'delve', 'leverage', 'unpack', 'navigate', 'unlock', or 'in today's fast-paced'.",
  "Each pitfall section must contain: one-paragraph diagnosis (why this is harder than it looks), two concrete behaviors to start this quarter, one named example from the corpus chunks.",
  "Keep each pitfall section under 120 words. Total output under 500 words.",
  "Return ONLY a JSON object matching the schema below. Do not wrap it in markdown fences. Do not add prose before or after.",
].join("\n");

const SCHEMA_DESCRIPTION = `{
  "narrations": [
    {
      "pitfall_id": <int 1-20>,
      "diagnosis": "<one paragraph>",
      "behaviors": ["<behavior 1>", "<behavior 2>"],
      "example": "<one named example>"
    },
    ... (three entries total, in the order of top_three_pitfall_ids)
  ]
}`;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { score_display, top_three_pitfall_ids, user_context } = args;

  const pitfalls = top_three_pitfall_ids.map(pitfallById);
  const anchorSlugs = Array.from(new Set(pitfalls.flatMap((p) => p.anchors)));
  const corpus = await loadCorpusChunks(anchorSlugs);

  const corpusBlock = anchorSlugs
    .map((slug) => {
      const body = corpus[slug] ?? "";
      if (!body) return `### ${slug}\n(not found in local corpus)`;
      return `### ${slug}\n${truncate(body, 1500)}`;
    })
    .join("\n\n");

  const pitfallBlock = pitfalls
    .map(
      (p) =>
        `Pitfall ${p.id}: ${p.text}\nExemplar quote (do not rewrite, use only as a reference): ${p.quote}\nCorpus anchors: ${p.anchors.join(", ")}`,
    )
    .join("\n\n");

  const userMessage = [
    `Score: ${score_display}/20`,
    user_context ? `User context: ${user_context}` : "User context: (none provided)",
    "",
    "Top three picks (in this order):",
    pitfallBlock,
    "",
    "Corpus chunks:",
    corpusBlock,
    "",
    "Return JSON only, matching this shape:",
    SCHEMA_DESCRIPTION,
  ].join("\n");

  let text: string;
  try {
    text = await requestNarration({
      systemPrompt: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      maxTokens: 1500,
      temperature: 0.7,
    });
  } catch (err) {
    if (err instanceof SamplingUnavailableError) {
      throw err;
    }
    throw err;
  }

  const parsed = extractJson(text);
  return PitfallNarrateOutput.parse(parsed);
};

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n... (truncated)";
}

function extractJson(text: string): unknown {
  // Strip ```json ... ``` fences if the model added them despite instructions.
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const body = fenceMatch ? fenceMatch[1]! : trimmed;
  try {
    return JSON.parse(body);
  } catch (err) {
    throw new Error(
      `Narration response was not valid JSON: ${(err as Error).message}\nResponse: ${body.slice(0, 500)}`,
    );
  }
}
