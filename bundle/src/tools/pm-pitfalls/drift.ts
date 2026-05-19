import { z } from "zod";
import type { ToolHandler, ToolMeta } from "../../shared/types";
import { PitfallDriftInput, PitfallDriftOutput } from "../../shared/schemas";
import { loadState, saveState } from "../../lib/persistence";
import { PITFALLS } from "./data";

const SLUG = "pm-pitfalls";
const SCHEMA_VERSION = 1;

interface AuditRow {
  timestamp: string;
  answers: ("always" | "sometimes" | "never")[];
  score_display: number;
}

interface StateData {
  audits: AuditRow[];
}

export const meta: ToolMeta = {
  name: "pm_pitfalls_drift",
  description:
    "Stateful. Records this audit (if current_audit is provided) and reports calibration drift against the prior audit: shifted pitfalls, unchanged pitfalls, and a one-line read. Persists per user_id in the bundle data dir.",
  inputSchema: PitfallDriftInput,
  outputSchema: PitfallDriftOutput,
  annotations: { readOnlyHint: false },
};

type Input = z.infer<typeof PitfallDriftInput>;
type Output = z.infer<typeof PitfallDriftOutput>;

export const invoke: ToolHandler<Input, Output> = async (args) => {
  const { user_id, current_audit } = args;
  const empty: StateData = { audits: [] };
  const state = await loadState<StateData>(SLUG, user_id, SCHEMA_VERSION, empty);

  // If a current audit was supplied, record it before reporting.
  if (current_audit) {
    state.audits.push({
      timestamp: new Date().toISOString(),
      answers: current_audit.answers,
      score_display: current_audit.score_display,
    });
    await saveState<StateData>(SLUG, user_id, SCHEMA_VERSION, state);
  }

  const audits = state.audits;
  if (audits.length < 2) {
    return {
      status: "first_audit",
      audit_count: audits.length,
      one_line_read:
        audits.length === 1
          ? "First audit recorded. Re-take in a quarter to see drift."
          : "No audits recorded yet. Run pm_pitfalls_score first, then pass the result in current_audit to seed history.",
    };
  }

  const latest = audits[audits.length - 1]!;
  const previous = audits[audits.length - 2]!;

  const shifted: Array<{
    pitfall_id: number;
    from: AuditRow["answers"][number];
    to: AuditRow["answers"][number];
  }> = [];
  const unchanged: number[] = [];
  for (let i = 0; i < 20; i++) {
    const from = previous.answers[i]!;
    const to = latest.answers[i]!;
    const id = PITFALLS[i]!.id;
    if (from !== to) {
      shifted.push({ pitfall_id: id, from, to });
    } else {
      unchanged.push(id);
    }
  }

  const delta = latest.score_display - previous.score_display;
  const oneLine = buildOneLineRead(
    previous.score_display,
    latest.score_display,
    delta,
    shifted.length,
  );

  return {
    status: "drift_report",
    current_score: latest.score_display,
    previous_score: previous.score_display,
    previous_audit_at: previous.timestamp,
    shifted_pitfalls: shifted,
    unchanged_pitfalls: unchanged,
    one_line_read: oneLine,
    audit_count: audits.length,
  };
};

function buildOneLineRead(
  prev: number,
  cur: number,
  delta: number,
  shiftedCount: number,
): string {
  if (delta === 0 && shiftedCount === 0) {
    return `Still ${cur}/20 across the board. Either nothing moved, or you answered identically. Worth re-reading the questions.`;
  }
  if (delta === 0) {
    return `Same score (${cur}/20), but ${shiftedCount} pitfalls shifted. Recalibration, not progress.`;
  }
  if (delta < 0) {
    return `You were ${prev}/20 a previous audit, now ${cur}/20 (down ${Math.abs(delta)}). ${shiftedCount} pitfalls moved.`;
  }
  return `You were ${prev}/20 before, now ${cur}/20 (up ${delta}). ${shiftedCount} pitfalls moved. Either things got worse or you got more honest.`;
}
