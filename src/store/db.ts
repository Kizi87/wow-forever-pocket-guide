import { openDB, type IDBPDatabase } from 'idb';
import type { Snapshot } from '../parser/types';

/** Minimal storage interface so IndexedDB and the localStorage fallback are interchangeable. */
export interface Store {
  kind: 'indexeddb' | 'localstorage';
  allSnapshots(): Promise<Snapshot[]>;
  putSnapshot(s: Snapshot): Promise<void>;
  deleteSnapshot(id: string): Promise<void>;
  clear(): Promise<void>;
}

const DB_NAME = 'pocket-guide';
const DB_VERSION = 1;

export async function openIndexedDbStore(): Promise<Store> {
  const db: IDBPDatabase = await openDB(DB_NAME, DB_VERSION, {
    upgrade(d) {
      if (!d.objectStoreNames.contains('snapshots')) d.createObjectStore('snapshots', { keyPath: 'id' });
    },
  });
  return {
    kind: 'indexeddb',
    allSnapshots: () => db.getAll('snapshots'),
    putSnapshot: async (s) => {
      await db.put('snapshots', s);
    },
    deleteSnapshot: (id) => db.delete('snapshots', id),
    clear: () => db.clear('snapshots'),
  };
}

const LS_KEY = 'pocket-guide.snapshots';

export function localStorageStore(ls: Storage = globalThis.localStorage): Store {
  const read = (): Snapshot[] => {
    try {
      return JSON.parse(ls.getItem(LS_KEY) ?? '[]');
    } catch {
      return [];
    }
  };
  const write = (all: Snapshot[]) => ls.setItem(LS_KEY, JSON.stringify(all));
  return {
    kind: 'localstorage',
    allSnapshots: async () => read(),
    putSnapshot: async (s) => write([...read().filter((x) => x.id !== s.id), s]),
    deleteSnapshot: async (id) => write(read().filter((x) => x.id !== id)),
    clear: async () => write([]),
  };
}

/** IndexedDB if it works (it doesn't in some private modes), else localStorage. */
export async function openStore(): Promise<Store> {
  try {
    return await openIndexedDbStore();
  } catch {
    return localStorageStore();
  }
}
