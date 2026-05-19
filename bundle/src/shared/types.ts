import type { z } from "zod";

export type ToolHandler<TInput, TOutput> = (
  args: TInput,
  ctx: ToolContext,
) => Promise<TOutput>;

export interface ToolMeta {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  outputSchema?: z.ZodTypeAny;
  annotations?: {
    readOnlyHint?: boolean;
    [key: string]: unknown;
  };
}

export interface ToolModule {
  meta: ToolMeta;
  invoke: ToolHandler<unknown, unknown>;
}

export interface ResourceModule {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  read(): Promise<string>;
}

export interface ToolContext {
  /** Calls the host's sampling endpoint with a typed-output expectation. */
  sample: (opts: SampleOptions) => Promise<string>;
  /** Loads a per-tool JSON state file (schema-versioned). */
  loadState: <T>(slug: string, userId: string, defaultValue: T) => Promise<T>;
  /** Saves a per-tool JSON state file (schema-versioned). */
  saveState: <T>(slug: string, userId: string, data: T) => Promise<void>;
  /** Loads `apps/<id>/prompt.md`, extracting LLM-relevant blocks. */
  loadPrompt: (appId: string) => Promise<string>;
  /** Loads named corpus chunks by topic slug. */
  loadCorpusChunks: (slugs: string[]) => Promise<Record<string, string>>;
}

export interface SampleOptions {
  systemPrompt?: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
}

export class SamplingUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SamplingUnavailableError";
  }
}
