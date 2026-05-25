import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DecisionLogListInput, DecisionLogListOutput } from "../../shared/schemas";
import { loadCollection } from "./collection";
import { STALE_DAYS } from "./data";

export const meta: ToolMeta = {
  name: "decision_log_list",
  description:
    "Reads the user's decision-log collection and returns the open and resolved entries, with stale-open flags on decisions logged 90 or more days ago that are still open. Read-only; does not mutate the collection. Use this to render the running log or to find the id of an entry the user wants to resolve.",
  inputSchema: DecisionLogListInput,
  outputSchema: DecisionLogListOutput,
  annotations: { readOnlyHint: true },
};

type Input = z.infer<typeof DecisionLogListInput>;
type Output = z.infer<typeof DecisionLogListOutput>;

const STALE_MS = STALE_DAYS * 24 * 60 * 60 * 1000;

export const invoke: ToolHandler<Input, Output> = async () => {
  const col = await loadCollection();
  const now = Date.now();

  const open = col.entries
    .filter((e) => e.status === "open")
    .map((e) => ({
      id: e.id,
      created_at: e.created_at,
      decision_text: e.decision_text,
      decision_type: e.decision_type,
      confidence_pct: e.confidence_pct,
      predicted_outcome: e.predicted_outcome,
      is_stale: now - new Date(e.created_at).getTime() >= STALE_MS,
    }));

  const resolved = col.entries
    .filter((e) => e.status === "resolved")
    .map((e) => ({
      id: e.id,
      created_at: e.created_at,
      decision_text: e.decision_text,
      decision_type: e.decision_type,
      confidence_pct: e.confidence_pct,
      was_right: e.was_right ?? false,
      resolved_at: e.resolved_at ?? e.created_at,
      resolution_note: e.resolution_note ?? "",
    }));

  return {
    open,
    resolved,
    open_count: open.length,
    resolved_count: resolved.length,
  };
};
