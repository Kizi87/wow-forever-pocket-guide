import { useState } from 'react';
import { diffSnapshots } from '../../diff/diffSnapshots';
import type { Snapshot } from '../../parser/types';
import { Empty } from '../components';
import { DiffView } from '../DiffView';
import { money } from '../format';

interface Props {
  snapshots: Snapshot[]; // oldest first
  onDelete: (id: string) => Promise<void>;
}

export function HistoryScreen({ snapshots, onDelete }: Props) {
  const newest = [...snapshots].reverse();
  const [fromId, setFromId] = useState<string | null>(null);
  const [toId, setToId] = useState<string | null>(null);
  if (snapshots.length === 0) return <Empty>No snapshots yet.</Empty>;

  const to = snapshots.find((s) => s.id === toId) ?? newest[0];
  const olderThanTo = newest.filter((s) => (s.header.epoch ?? 0) < (to.header.epoch ?? 0));
  const from = olderThanTo.find((s) => s.id === fromId) ?? olderThanTo[0] ?? null;

  const label = (s: Snapshot) => `${s.header.capturedLocal ?? s.importedAt} · ${s.character.name} ${s.character.level}`;

  return (
    <div className="stack">
      <h1>History</h1>
      {from ? (
        <section className="card-plain">
          <label className="field">
            From
            <select value={from.id} onChange={(e) => setFromId(e.target.value)}>
              {olderThanTo.map((s) => (
                <option key={s.id} value={s.id}>
                  {label(s)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            To
            <select value={to.id} onChange={(e) => setToId(e.target.value)}>
              {newest.slice(0, -1).map((s) => (
                <option key={s.id} value={s.id}>
                  {label(s)}
                </option>
              ))}
            </select>
          </label>
          <DiffView diff={diffSnapshots(from, to)} />
        </section>
      ) : (
        <p className="muted">One snapshot so far. Paste another later to see what changed.</p>
      )}

      <h2>All snapshots ({snapshots.length})</h2>
      <ul className="rows">
        {newest.map((s) => (
          <li key={s.id}>
            <span className="row-label">
              {s.header.capturedLocal ?? s.importedAt}
              <br />
              <span className="muted small">
                Level {s.character.level} · {s.character.subzone || s.character.zone} · {money(s.character.moneyCopper)}
              </span>
            </span>
            <button
              type="button"
              className="btn small danger"
              onClick={() => {
                if (confirm(`Delete the snapshot from ${s.header.capturedLocal}? This can't be undone (unless it's in a backup).`)) void onDelete(s.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
