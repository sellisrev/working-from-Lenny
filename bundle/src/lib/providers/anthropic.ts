import type { SampleOptions } from "../../shared/types";

const DEFAULT_MODEL = "claude-sonnet-4-6";

export async function callAnthropic(
  apiKey: string,
  opts: SampleOptions,
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.7,
      system: opts.systemPrompt,
      messages: opts.messages,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${body}`);
  }
  const json = (await res.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  const text = json.content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("");
  if (!text) throw new Error("Anthropic returned empty text content");
  return text;
}
