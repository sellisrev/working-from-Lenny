export const PRESETS = [
  "hire",
  "fire",
  "pricing",
  "pivot",
  "build-vs-buy",
  "hiring-plan",
  "roadmap-bet",
  "other",
] as const;

export type PresetType = (typeof PRESETS)[number];

export const STALE_DAYS = 90;
export const MIN_RESOLVED = 3;
export const GAP_THRESHOLD = 12;
export const DRIFT_THRESHOLD = 15;

export function normalizeType(raw: string): string {
  const normalized = raw.trim().toLowerCase().replace(/\s+/g, " ");
  for (const preset of PRESETS) {
    if (normalized === preset) return preset;
  }
  return normalized;
}

export type BrierBand = "sharp" | "decent" | "coin-flip" | "confidently-wrong";

export function brierBand(score: number): BrierBand {
  if (score <= 0.12) return "sharp";
  if (score <= 0.20) return "decent";
  if (score <= 0.30) return "coin-flip";
  return "confidently-wrong";
}

export type CalibrationVerdict =
  | "overconfident"
  | "underconfident"
  | "well-calibrated"
  | "insufficient-data";

export interface PerTypeCalibration {
  decision_type: string;
  n_resolved: number;
  mean_confidence: number;
  hit_rate: number;
  gap: number;
  verdict: CalibrationVerdict;
}

export interface DecisionEntry {
  id: string;
  created_at: string;
  decision_text: string;
  decision_type: string;
  confidence_pct: number;
  predicted_outcome: string;
  status: "open" | "resolved";
  resolved_at?: string;
  was_right?: boolean;
  resolution_note?: string;
}

export interface CollectionData {
  entries: DecisionEntry[];
}

export const CORPUS_ANCHORS = [
  "decision-making-frameworks",
  "evaluating-product-bets",
  "defending-big-bets",
] as const;

export function computeBrier(entries: DecisionEntry[]): {
  overall_brier: number;
  n_resolved: number;
  per_type: PerTypeCalibration[];
} {
  const resolved = entries.filter((e) => e.status === "resolved" && e.was_right !== undefined);
  const n_resolved = resolved.length;

  let overall_brier = 0;
  if (n_resolved > 0) {
    const sum = resolved.reduce((acc, e) => {
      const outcome = e.was_right ? 1 : 0;
      const diff = e.confidence_pct / 100 - outcome;
      return acc + diff * diff;
    }, 0);
    overall_brier = Math.round((sum / n_resolved) * 10000) / 10000;
  }

  const byType = new Map<string, DecisionEntry[]>();
  for (const e of resolved) {
    const bucket = byType.get(e.decision_type) ?? [];
    bucket.push(e);
    byType.set(e.decision_type, bucket);
  }

  const per_type: PerTypeCalibration[] = [];
  for (const [decision_type, group] of byType) {
    const n = group.length;
    const mean_confidence = Math.round(group.reduce((a, e) => a + e.confidence_pct, 0) / n * 10) / 10;
    const hit_rate = Math.round((group.filter((e) => e.was_right).length / n) * 1000) / 10;
    const gap = Math.round((mean_confidence - hit_rate) * 10) / 10;

    let verdict: CalibrationVerdict;
    if (n < MIN_RESOLVED) {
      verdict = "insufficient-data";
    } else if (gap > GAP_THRESHOLD) {
      verdict = "overconfident";
    } else if (gap < -GAP_THRESHOLD) {
      verdict = "underconfident";
    } else {
      verdict = "well-calibrated";
    }

    per_type.push({ decision_type, n_resolved: n, mean_confidence, hit_rate, gap, verdict });
  }

  per_type.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));

  return { overall_brier, n_resolved, per_type };
}
