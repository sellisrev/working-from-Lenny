import { z } from "zod";
import { randomUUID } from "node:crypto";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { DecisionLogAddInput, DecisionLogAddOutput } from "../../shared/schemas";
import { normalizeType, computeBrier, DRIFT_THRESHOLD } from "./data";
import { loadCollection } from "./collection";
import { saveState } from "../../lib/persistence";
import type { DecisionEntry } from "./data";

export const meta: ToolMeta = {
  name: "decision_log_add",
  description:
    "Logs a new decision to the user's durable decision-log collection. Validates the inputs, normalizes the decision_type (trim + lowercase + collapse whitespace; a custom value matching a preset merges into that preset; otherwise the custom type is first-class), and appends a new open entry to the collection (never overwrites the collection). Returns the saved entry (with its generated id, created_at, status=open) and, if the user has a calibration record for this decision_type and the new confidence is more than 15 points from their hit rate on that type, a `drift_warning` string. confidence_pct is capped to 1-99 deliberately: 0 and 100 are claims of certainty, not forecasts, and they break the Brier math. STATEFUL: this tool writes durable user data. If `persistence_warning` is set, the entry could not be saved — surface it and ask the user to re-add. After adding, the user can keep logging, resolve open entries with decision_log_resolve, or read their calibration with decision_log_calibrate.",
  inputSchema: DecisionLogAddInput,
  outputSchema: DecisionLogAddOutput,
  annotations: { readOnlyHint: false },
};

type Input = z.infer<typeof DecisionLogAddInput>;
type Output = z.infer<typeof DecisionLogAddOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { entry: raw } = args;
  const decision_type = normalizeType(raw.decision_type);

  const entry: DecisionEntry = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    decision_text: raw.decision_text.trim(),
    decision_type,
    confidence_pct: raw.confidence_pct,
    predicted_outcome: raw.predicted_outcome.trim(),
    status: "open",
  };

  let drift_warning: string | undefined;
  let persistenceWarning: string | undefined;

  try {
    const col = await loadCollection();
    const { per_type } = computeBrier(col.entries);
    const typeRecord = per_type.find((p) => p.decision_type === decision_type);
    if (typeRecord && typeRecord.n_resolved >= 1) {
      const deviation = Math.abs(entry.confidence_pct - typeRecord.hit_rate);
      if (deviation > DRIFT_THRESHOLD) {
        const direction = entry.confidence_pct > typeRecord.hit_rate ? "higher" : "lower";
        drift_warning =
          `Heads up: on ${decision_type} decisions you've averaged ${typeRecord.mean_confidence}% confidence and been right ${typeRecord.hit_rate}% of the time. You're logging this one at ${entry.confidence_pct}% — ${Math.round(deviation)} points ${direction} than your track record.`;
      }
    }
    col.entries.push(entry);
    await saveState("decision-log", "default", 1, col);
  } catch (err) {
    const msg = (err as Error).message;
    // eslint-disable-next-line no-console
    console.error(`[wfl] decision_log_add: failed to save: ${msg}`);
    persistenceWarning = `Entry could not be saved: ${msg}. Please re-add the entry.`;
  }

  return {
    saved_entry: {
      id: entry.id,
      created_at: entry.created_at,
      decision_text: entry.decision_text,
      decision_type: entry.decision_type,
      confidence_pct: entry.confidence_pct,
      predicted_outcome: entry.predicted_outcome,
      status: "open" as const,
    },
    ...(drift_warning ? { drift_warning } : {}),
    ...(persistenceWarning ? { persistence_warning: persistenceWarning } : {}),
  };
};
