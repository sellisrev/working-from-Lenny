import type { SampleOptions } from "../../shared/types";

const DEFAULT_MODEL = "gpt-4o-mini";

export async function callOpenAI(
  apiKey: string,
  opts: SampleOptions,
): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [];
  if (opts.systemPrompt) {
    messages.push({ role: "system", content: opts.systemPrompt });
  }
  for (const m of opts.messages) messages.push(m);
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.7,
      messages,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${body}`);
  }
  const json = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const text = json.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("OpenAI returned empty text content");
  return text;
}
