import type { z } from "zod";

export type ToolHandler<TInput, TOutput> = (args: TInput) => Promise<TOutput>;

export interface ToolMeta {
  name: string;
  description: string;
  inputSchema: z.ZodTypeAny;
  outputSchema?: z.ZodTypeAny;
  annotations?: {
    readOnlyHint?: boolean;
    [key: string]: unknown;
  };
  /**
   * MCP Apps binding: when set, the host mounts this `ui://` resource to
   * render the tool's result. Spec ref: `_meta.ui.resourceUri` on tool
   * definition (ext-apps draft). Set on the entry tool that introduces the
   * UI; tools called internally by the UI via window.mcp.callTool do NOT
   * declare this.
   */
  uiResourceUri?: string;
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
