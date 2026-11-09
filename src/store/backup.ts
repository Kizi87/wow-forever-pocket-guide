import type { Snapshot } from '../parser/types';
import type { Store } from './db';

export const BACKUP_APP = 'wow-forever-pocket-guide';
export const BACKUP_VERSION = 1;

export interface Backup {
  app: typeof BACKUP_APP;
  version: number;
  exportedAt: string;
  snapshots: Snapshot[];
}

export async function makeBackup(store: Store, now = new Date()): Promise<Backup> {
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: now.toISOString(), snapshots: await store.allSnapshots() };
}

export class BackupError extends Error {}

/** Check a parsed JSON value really is one of our backups. Throws BackupError with a readable reason. */
export function validateBackup(data: unknown): Backup {
  if (typeof data !== 'object' || data === null) throw new BackupError('Not a JSON object.');
  const b = data as Partial<Backup>;
  if (b.app !== BACKUP_APP) throw new BackupError('This JSON is not a Pocket Guide backup.');
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION)
    throw new BackupError(`Backup version ${b.version} is newer than this app understands (${BACKUP_VERSION}). Update the app first.`);
  if (!Array.isArray(b.snapshots)) throw new BackupError('Backup has no snapshots list.');
  for (const s of b.snapshots) {
    if (typeof s?.id !== 'string' || typeof s?.raw !== 'string' || typeof s?.character?.name !== 'string')
      throw new BackupError('Backup contains a snapshot in an unexpected shape.');
  }
  return b as Backup;
}

/** Merge a backup into the store. Snapshots with the same id are replaced. Returns how many were written. */
export async function restoreBackup(store: Store, json: string): Promise<number> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new BackupError('That file is not valid JSON.');
  }
  const backup = validateBackup(parsed);
  for (const s of backup.snapshots) await store.putSnapshot(s);
  return backup.snapshots.length;
}
