import { useCallback, useEffect, useState } from 'react';
import { byCapture } from './diff/diffSnapshots';
import type { Snapshot } from './parser/types';
import { openStore, type Store } from './store/db';
import { BackupScreen } from './ui/screens/BackupScreen';
import { CharacterScreen } from './ui/screens/CharacterScreen';
import { HistoryScreen } from './ui/screens/HistoryScreen';
import { ImportScreen } from './ui/screens/ImportScreen';

const TABS = [
  { id: 'character', label: 'Character', icon: '🛡' },
  { id: 'import', label: 'Import', icon: '⇩' },
  { id: 'history', label: 'History', icon: '↺' },
  { id: 'backup', label: 'Backup', icon: '⛁' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const tabFromHash = (): TabId => {
  const h = window.location.hash.replace(/^#\/?/, '');
  return (TABS.find((t) => t.id === h)?.id ?? 'character') as TabId;
};

export function App() {
  const [store, setStore] = useState<Store | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [tab, setTab] = useState<TabId>(tabFromHash);

  const reload = useCallback(async (s: Store) => {
    setSnapshots((await s.allSnapshots()).sort(byCapture));
  }, []);

  useEffect(() => {
    void openStore().then(async (s) => {
      setStore(s);
      await reload(s);
    });
    const onHash = () => setTab(tabFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [reload]);

  // First run: nothing stored yet, so the Import tab is the useful one.
  useEffect(() => {
    if (store && snapshots.length === 0 && !window.location.hash) setTab('import');
  }, [store, snapshots.length]);

  const go = (t: TabId) => {
    window.location.hash = `/${t}`;
    setTab(t);
    window.scrollTo(0, 0);
  };

  if (!store) return <main className="screen muted">Loading…</main>;
  const latest = snapshots.at(-1) ?? null;

  return (
    <>
      <main className="screen">
        {tab === 'character' && <CharacterScreen snap={latest} />}
        {tab === 'import' && (
          <ImportScreen
            snapshots={snapshots}
            onSave={async (s) => {
              await store.putSnapshot(s);
              await reload(store);
            }}
            onDone={() => go('character')}
          />
        )}
        {tab === 'history' && (
          <HistoryScreen
            snapshots={snapshots}
            onDelete={async (id) => {
              await store.deleteSnapshot(id);
              await reload(store);
            }}
          />
        )}
        {tab === 'backup' && <BackupScreen store={store} count={snapshots.length} onChanged={() => reload(store)} />}
      </main>
      <nav className="tabs" aria-label="Main">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={t.id === tab ? 'active' : ''} aria-current={t.id === tab ? 'page' : undefined} onClick={() => go(t.id)}>
            <span aria-hidden="true">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </>
  );
}
