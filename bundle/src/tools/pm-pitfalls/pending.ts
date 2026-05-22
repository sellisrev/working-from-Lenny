import fs from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import { PitfallNarrateOutput } from "../../shared/schemas";
import { dataDir } from "../../lib/paths";

/**
 * Single source of truth for the PM Pitfalls "pending narration" file —
 * the brief that score persists for chat-side handoff and get-pending reads.
 * Constants used to live in score.ts and get-pending.ts separately; that
 * drift risk is the entire reason this module exists.
 */

export const PENDING_DIR = "_pending";
export const PENDING_FILE = "pm-pitfalls-pending.json";
export const PENDING_SCHEMA_VERSION = 1;

export type PendingBrief = z.infer<typeof PitfallNarrateOutput>;

export interface PendingInputs {
  score_display: number;
  top_three_pitfall_ids: [number, number, number];
  answers: ("always" | "sometimes" | "never")[];
  user_context: string;
}

export interface PendingFile {
  schema_version: number;
  data: {
    brief: PendingBrief;
    saved_at: string;
    inputs: PendingInputs;
  };
}

export function pendingDir(): string {
  return path.join(dataDir(), PENDING_DIR);
}

export function pendingFilePath(): string {
  return path.join(pendingDir(), PENDING_FILE);
}

export async function writePending(
  brief: PendingBrief,
  inputs: PendingInputs,
): Promise<void> {
  const dir = pendingDir();
  await fs.mkdir(dir, { recursive: true });
  const file = pendingFilePath();
  const payload: PendingFile = {
    schema_version: PENDING_SCHEMA_VERSION,
    data: {
      brief,
      saved_at: new Date().toISOString(),
      inputs,
    },
  };
  const tmp = `${file}.tmp`;
  // Best-effort clean up any leftover .tmp from a prior crashed write before
  // we start the new one. Idempotent; ignore ENOENT.
  await fs.rm(tmp, { force: true });
  await fs.writeFile(tmp, JSON.stringify(payload, null, 2), "utf8");
  await fs.rename(tmp, file);
}

export type ReadPendingResult =
  | { kind: "ready"; brief: PendingBrief; saved_at: string; inputs: PendingInputs }
  | { kind: "missing" }
  | { kind: "corrupted"; reason: string }
  | { kind: "schema_mismatch"; reason: string };

export async function readPending(): Promise<ReadPendingResult> {
  const file = pendingFilePath();
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { kind: "missing" };
    return { kind: "corrupted", reason: (err as Error).message };
  }
  let parsed: PendingFile;
  try {
    parsed = JSON.parse(raw) as PendingFile;
  } catch (err) {
    return { kind: "corrupted", reason: (err as Error).message };
  }
  if (parsed.schema_version !== PENDING_SCHEMA_VERSION) {
    return {
      kind: "schema_mismatch",
      reason: `expected schema_version=${PENDING_SCHEMA_VERSION}, got ${String(parsed.schema_version)}`,
    };
  }
  if (!parsed.data?.brief) {
    return { kind: "corrupted", reason: "missing data.brief" };
  }
  const briefCheck = PitfallNarrateOutput.safeParse(parsed.data.brief);
  if (!briefCheck.success) {
    return {
      kind: "schema_mismatch",
      reason: `brief no longer matches PitfallNarrateOutput: ${briefCheck.error.message}`,
    };
  }
  return {
    kind: "ready",
    brief: briefCheck.data,
    saved_at: parsed.data.saved_at,
    inputs: parsed.data.inputs,
  };
}

/**
 * Startup hygiene: remove any leftover .tmp files in the pending dir, which
 * can accumulate if a write was interrupted (crash, kill, OS shutdown)
 * between the writeFile and rename steps. Idempotent; safe to call when
 * the dir doesn't exist yet.
 */
export async function cleanupOrphanedTmp(): Promise<void> {
  const dir = pendingDir();
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
  for (const name of entries) {
    if (name.endsWith(".tmp")) {
      await fs.rm(path.join(dir, name), { force: true });
    }
  }
}
