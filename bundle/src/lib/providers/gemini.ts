import type { SampleOptions } from "../../shared/types";

const DEFAULT_MODEL = "gemini-2.5-flash";

export async function callGemini(
  apiKey: string,
  opts: SampleOptions,
): Promise<string> {
  const contents = opts.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: opts.maxTokens ?? 1024,
      temperature: opts.temperature ?? 0.7,
    },
  };
  if (opts.systemPrompt) {
    body.systemInstruction = { parts: [{ text: opts.systemPrompt }] };
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API ${res.status}: ${errBody}`);
  }
  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const text =
    json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ??
    "";
  if (!text) throw new Error("Gemini returned empty text content");
  return text;
}
