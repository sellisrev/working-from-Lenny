import fs from "node:fs/promises";
import path from "node:path";
import { dataDir } from "./paths";

interface VersionedFile<T> {
  schema_version: number;
  user_id: string;
  data: T;
}

type Migration = (oldData: unknown) => unknown;

const migrations = new Map<string, Map<string, Migration>>();

/**
 * Register a migration from `fromVersion` to `toVersion` for a given app slug.
 * Migrations chain: if a file is at v1 and current is v3, register 1->2 and
 * 2->3 and they'll be applied in order.
 */
export function registerMigration(
  appSlug: string,
  fromVersion: number,
  toVersion: number,
  migrate: Migration,
): void {
  if (!migrations.has(appSlug)) migrations.set(appSlug, new Map());
  const m = migrations.get(appSlug)!;
  m.set(`${fromVersion}->${toVersion}`, migrate);
}

function userDir(userId: string): string {
  if (!/^[a-zA-Z0-9._-]+$/.test(userId)) {
    throw new Error(`Invalid user_id: ${userId}`);
  }
  return path.join(dataDir(), userId);
}

function stateFile(slug: string, userId: string): string {
  return path.join(userDir(userId), `${slug}.json`);
}

export async function loadState<T>(
  slug: string,
  userId: string,
  currentVersion: number,
  defaultValue: T,
): Promise<T> {
  const file = stateFile(slug, userId);
  let raw: string;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return defaultValue;
    throw err;
  }
  const parsed = JSON.parse(raw) as VersionedFile<unknown>;
  if (typeof parsed.schema_version !== "number") {
    throw new Error(`Invalid state file (missing schema_version): ${file}`);
  }
  let version = parsed.schema_version;
  let data = parsed.data;
  while (version < currentVersion) {
    const next = version + 1;
    const key = `${version}->${next}`;
    const m = migrations.get(slug)?.get(key);
    if (!m) {
      throw new Error(
        `No migration registered for ${slug}: ${version} -> ${next}. Refusing to read stale state.`,
      );
    }
    data = m(data);
    version = next;
  }
  return data as T;
}

export async function saveState<T>(
  slug: string,
  userId: string,
  currentVersion: number,
  data: T,
): Promise<void> {
  const dir = userDir(userId);
  await fs.mkdir(dir, { recursive: true });
  const file = stateFile(slug, userId);
  const payload: VersionedFile<T> = {
    schema_version: currentVersion,
    user_id: userId,
    data,
  };
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(payload, null, 2), "utf8");
  await fs.rename(tmp, file);
}
