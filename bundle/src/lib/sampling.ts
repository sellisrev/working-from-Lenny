import type { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CreateMessageRequestSchema,
  CreateMessageResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { SampleOptions } from "../shared/types";
import { SamplingUnavailableError } from "../shared/types";
import { callAnthropic } from "./providers/anthropic";
import { callGemini } from "./providers/gemini";
import { callOpenAI } from "./providers/openai";

type Provider = "anthropic" | "gemini" | "openai";

interface UserConfig {
  api_key?: string;
  api_provider?: Provider;
}

let serverRef: Server | null = null;
let userConfigRef: UserConfig = {};

export function configureSampling(server: Server, userConfig: UserConfig): void {
  serverRef = server;
  userConfigRef = userConfig;
}

/**
 * Try host sampling first; fall back to a user-configured API key. If both
 * paths fail, throw SamplingUnavailableError so the tool handler can return a
 * structured error pointing the user at the api-key config screen.
 */
export async function requestNarration(opts: SampleOptions): Promise<string> {
  // Path 1: host sampling.
  if (serverRef) {
    try {
      const result = await serverRef.request(
        {
          method: "sampling/createMessage",
          params: {
            messages: opts.messages.map((m) => ({
              role: m.role,
              content: { type: "text", text: m.content },
            })),
            systemPrompt: opts.systemPrompt,
            maxTokens: opts.maxTokens ?? 1024,
            temperature: opts.temperature ?? 0.7,
            includeContext: "none",
          },
        },
        CreateMessageResultSchema,
      );
      const text =
        result.content && result.content.type === "text"
          ? result.content.text
          : "";
      if (text) return text;
      // Empty response from the host — fall through to user_config fallback.
    } catch (err) {
      const code = (err as { code?: number }).code;
      // MethodNotFound (-32601) or any other host-side rejection -> fallback.
      if (code !== undefined && code !== -32601) {
        // Non-MethodNotFound errors still warrant the fallback attempt; the
        // host may have rate-limited, declined consent, or rejected the
        // request. The user_config path gives the user a way through.
      }
    }
  }

  // Path 2: user_config API key.
  const { api_key, api_provider } = userConfigRef;
  if (api_key) {
    const provider: Provider = api_provider ?? "anthropic";
    switch (provider) {
      case "anthropic":
        return callAnthropic(api_key, opts);
      case "gemini":
        return callGemini(api_key, opts);
      case "openai":
        return callOpenAI(api_key, opts);
    }
  }

  throw new SamplingUnavailableError(
    "No inference available. Either run this tool from a host that supports MCP sampling (e.g. Claude Desktop), or set api_key and api_provider in the extension's user_config.",
  );
}

// Re-export the request schema for the server entry to register a no-op handler
// (the SDK requires we declare which methods we'll call into; sampling is
// initiated by the server, not handled by it, so this is metadata only).
export { CreateMessageRequestSchema };
