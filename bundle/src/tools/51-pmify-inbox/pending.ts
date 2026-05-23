import fs from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import { PmifyNarrateOutput } from "../../shared/schemas";
import type { PmifyMode } from "../../shared/schemas";
import { dataDir } from "../../lib/paths";

export const PENDING_DIR = "_pending";
export const PENDING_FILE = "pm-ify-inbox-pending.json";
export const PENDING_SCHEMA_VERSION = 1;

export type PendingBrief = z.infer<typeof PmifyNarrateOutput>;

export interface PendingInputs {
  mode: PmifyMode;
  user_text: string;
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
  const briefCheck = PmifyNarrateOutput.safeParse(parsed.data.brief);
  if (!briefCheck.success) {
    return {
      kind: "schema_mismatch",
      reason: `brief no longer matches PmifyNarrateOutput: ${briefCheck.error.message}`,
    };
  }
  return {
    kind: "ready",
    brief: briefCheck.data,
    saved_at: parsed.data.saved_at,
    inputs: parsed.data.inputs,
  };
}

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
    if (name.endsWith(".tmp") && name.startsWith(PENDING_FILE)) {
      await fs.rm(path.join(dir, name), { force: true });
    }
  }
}
