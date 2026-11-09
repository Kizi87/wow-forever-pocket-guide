import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { localStorageStore, openIndexedDbStore, type Store } from './db';
import { BackupError, makeBackup, restoreBackup } from './backup';
import { parseExport } from '../parser/parseExport';
import { L27, L30 } from '../../tests/fixtures';

class MemStorage implements Storage {
  private m = new Map<string, string>();
  get length() {
    return this.m.size;
  }
  clear() {
    this.m.clear();
  }
  getItem(k: string) {
    return this.m.get(k) ?? null;
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.m.delete(k);
  }
  setItem(k: string, v: string) {
    this.m.set(k, v);
  }
}

const stores: [string, () => Promise<Store>][] = [
  ['indexeddb', openIndexedDbStore],
  ['localstorage', async () => localStorageStore(new MemStorage())],
];

describe.each(stores)('%s store + backup', (_, open) => {
  it('round-trips snapshots through a JSON backup', async () => {
    const store = await open();
    await store.clear();
    await store.putSnapshot(parseExport(L27));
    await store.putSnapshot(parseExport(L30));
    const json = JSON.stringify(await makeBackup(store));

    await store.clear();
    expect(await store.allSnapshots()).toHaveLength(0);
    expect(await restoreBackup(store, json)).toBe(2);
    const back = await store.allSnapshots();
    expect(back.map((s) => s.character.level).sort()).toEqual([27, 30]);

    // restoring again replaces rather than duplicates
    await restoreBackup(store, json);
    expect(await store.allSnapshots()).toHaveLength(2);
  });

  it('deletes one snapshot', async () => {
    const store = await open();
    await store.clear();
    const s = parseExport(L30);
    await store.putSnapshot(s);
    await store.deleteSnapshot(s.id);
    expect(await store.allSnapshots()).toHaveLength(0);
  });
});

describe('restore rejects bad input', () => {
  const store = localStorageStore(new MemStorage());
  it.each([
    ['not json', 'nope'],
    ['wrong app', JSON.stringify({ app: 'other', version: 1, snapshots: [] })],
    ['future version', JSON.stringify({ app: 'wow-forever-pocket-guide', version: 99, snapshots: [] })],
    ['bad snapshot', JSON.stringify({ app: 'wow-forever-pocket-guide', version: 1, snapshots: [{ id: 1 }] })],
  ])('%s', async (_, json) => {
    await expect(restoreBackup(store, json)).rejects.toBeInstanceOf(BackupError);
  });
});
