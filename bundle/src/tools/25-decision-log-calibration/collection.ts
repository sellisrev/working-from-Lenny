import { loadState, saveState } from "../../lib/persistence";
import type { DecisionEntry, CollectionData } from "./data";

const SLUG = "decision-log";
const USER_ID = "default";
const VERSION = 1;
const DEFAULT: CollectionData = { entries: [] };

export async function loadCollection(): Promise<CollectionData> {
  return loadState<CollectionData>(SLUG, USER_ID, VERSION, DEFAULT);
}

export async function appendEntry(entry: DecisionEntry): Promise<void> {
  const col = await loadCollection();
  col.entries.push(entry);
  await saveState<CollectionData>(SLUG, USER_ID, VERSION, col);
}

export async function updateEntryById(
  id: string,
  patch: Partial<DecisionEntry>,
): Promise<DecisionEntry | null> {
  const col = await loadCollection();
  const idx = col.entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated: DecisionEntry = { ...col.entries[idx]!, ...patch };
  col.entries[idx] = updated;
  await saveState<CollectionData>(SLUG, USER_ID, VERSION, col);
  return updated;
}
