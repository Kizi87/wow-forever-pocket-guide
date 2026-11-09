import { useState } from 'react';
import type { Store } from '../../store/db';
import { BackupError, makeBackup, restoreBackup } from '../../store/backup';

interface Props {
  store: Store;
  count: number;
  onChanged: () => Promise<void>;
}

export function BackupScreen({ store, count, onChanged }: Props) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function download() {
    const backup = await makeBackup(store);
    const blob = new Blob([JSON.stringify(backup, null, 1)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pocket-guide-backup-${backup.exportedAt.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ ok: true, text: `Backup of ${backup.snapshots.length} snapshot(s) downloaded.` });
  }

  async function restore(file: File) {
    try {
      const n = await restoreBackup(store, await file.text());
      await onChanged();
      setMsg({ ok: true, text: `Restored ${n} snapshot(s). Existing ones with the same capture time were replaced; others kept.` });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof BackupError ? e.message : `Restore failed: ${(e as Error).message}` });
    }
  }

  return (
    <div className="stack">
      <h1>Backup</h1>
      <p className="muted small">
        Everything lives in this browser only ({store.kind === 'indexeddb' ? 'IndexedDB' : 'localStorage fallback'}), {count} snapshot(s). Phone and PC don't share it — move a backup file
        between them if you need to.
      </p>
      <button type="button" className="btn primary" onClick={download}>
        Download backup (JSON)
      </button>
      <label className="btn file">
        Restore from backup…
        <input
          type="file"
          accept="application/json,.json"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void restore(f);
            e.target.value = '';
          }}
        />
      </label>
      {msg && <div className={msg.ok ? 'note-ok' : 'alert'}>{msg.text}</div>}

      <hr />
      <button
        type="button"
        className="btn danger"
        onClick={async () => {
          if (confirm(`Delete all ${count} snapshot(s) from this browser? Download a backup first if you want them.`)) {
            await store.clear();
            await onChanged();
            setMsg({ ok: true, text: 'All snapshots deleted. Very tidy. Very empty.' });
          }
        }}
      >
        Delete all data
      </button>
    </div>
  );
}
