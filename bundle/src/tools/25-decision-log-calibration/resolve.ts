import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DecisionLogResolveInput, DecisionLogResolveOutput } from "../../shared/schemas";
import { updateEntryById } from "./collection";

export const meta: ToolMeta = {
  name: "decision_log_resolve",
  description:
    "Resolves an open decision in the user's collection by id: marks it right or wrong, records the resolution timestamp and an optional note, and updates the entry in place (the collection is read-modify-written atomically; the entry is not duplicated). Per Annie Duke, decision quality and outcome quality are separate: a good call that went wrong is still resolved as wrong for the Brier math, though the resolution_note can capture process-vs-luck. STATEFUL: this tool writes durable user data. Returns the updated entry. If `persistence_warning` is set, the update could not be saved — surface it and ask the user to retry. After resolving, call decision_log_calibrate to refresh the Brier read.",
  inputSchema: DecisionLogResolveInput,
  outputSchema: DecisionLogResolveOutput,
  annotations: { readOnlyHint: false },
};

type Input = z.infer<typeof DecisionLogResolveInput>;
type Output = z.infer<typeof DecisionLogResolveOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { id, was_right, resolution_note = "" } = args;
  const resolved_at = new Date().toISOString();

  let persistenceWarning: string | undefined;
  let updated: Awaited<ReturnType<typeof updateEntryById>> = null;

  try {
    updated = await updateEntryById(id, {
      status: "resolved",
      was_right,
      resolved_at,
      resolution_note,
    });
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] decision_log_resolve: failed to save: ${msg}`);
    persistenceWarning = `Update could not be saved: ${msg}. Please retry.`;
  }

  if (!updated) {
    if (!persistenceWarning) {
      persistenceWarning = `No entry found with id "${id}". Check decision_log_list for valid ids.`;
    }
    return {
      updated_entry: {
        id,
        created_at: new Date().toISOString(),
        decision_text: "(not found)",
        decision_type: "(not found)",
        confidence_pct: 0,
        predicted_outcome: "(not found)",
        status: "resolved" as const,
        resolved_at,
        was_right,
        resolution_note,
      },
      persistence_warning: persistenceWarning,
    };
  }

  return {
    updated_entry: {
      id: updated.id,
      created_at: updated.created_at,
      decision_text: updated.decision_text,
      decision_type: updated.decision_type,
      confidence_pct: updated.confidence_pct,
      predicted_outcome: updated.predicted_outcome,
      status: "resolved" as const,
      resolved_at: updated.resolved_at!,
      was_right: updated.was_right!,
      resolution_note: updated.resolution_note ?? "",
    },
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
