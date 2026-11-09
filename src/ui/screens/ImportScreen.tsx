import { useState } from 'react';
import { diffSnapshots } from '../../diff/diffSnapshots';
import { ExportParseError, parseExport } from '../../parser/parseExport';
import type { Snapshot } from '../../parser/types';
import { DiffView } from '../DiffView';

interface Props {
  snapshots: Snapshot[]; // oldest first
  onSave: (s: Snapshot) => Promise<void>;
  onDone: () => void;
}

type Result = { kind: 'error'; message: string } | { kind: 'saved'; snap: Snapshot; prev: Snapshot | null; duplicate: boolean };

export function ImportScreen({ snapshots, onSave, onDone }: Props) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);

  async function pasteFromClipboard() {
    try {
      setText(await navigator.clipboard.readText());
    } catch {
      setResult({ kind: 'error', message: 'The browser would not hand over the clipboard. Long-press the box and paste instead.' });
    }
  }

  async function importNow() {
    setBusy(true);
    try {
      const snap = parseExport(text);
      const duplicate = snapshots.some((s) => s.id === snap.id);
      const prev = [...snapshots].reverse().find((s) => s.id !== snap.id && s.character.name === snap.character.name && (s.header.epoch ?? 0) < (snap.header.epoch ?? Infinity)) ?? null;
      await onSave(snap);
      setResult({ kind: 'saved', snap, prev, duplicate });
      setText('');
    } catch (e) {
      setResult({ kind: 'error', message: e instanceof ExportParseError ? e.message : `Could not import: ${(e as Error).message}` });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack">
      <h1>Import</h1>
      <p className="muted small">In game: run ForeverCharacterExport out of combat, copy it all, paste below.</p>
      <textarea
        className="paste"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="# ForeverCharacterExport 0.3.0 | …"
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
      <div className="btn-row">
        <button type="button" className="btn" onClick={pasteFromClipboard}>
          Paste from clipboard
        </button>
        <button type="button" className="btn primary" disabled={!text.trim() || busy} onClick={importNow}>
          Import
        </button>
      </div>

      {result?.kind === 'error' && <div className="alert">{result.message}</div>}
      {result?.kind === 'saved' && (
        <section className="card-plain">
          <h2>
            {result.duplicate ? 'Already had that one — updated it.' : 'Saved.'} {result.snap.character.name}, level {result.snap.character.level}.
          </h2>
          {result.snap.warnings.map((w) => (
            <div key={w} className="alert">
              {w}
            </div>
          ))}
          {result.prev ? (
            <>
              <h3>Since {result.prev.header.capturedLocal ?? 'last time'}</h3>
              <DiffView diff={diffSnapshots(result.prev, result.snap)} />
            </>
          ) : (
            <p className="muted">First snapshot. Nothing to compare with yet.</p>
          )}
          <button type="button" className="btn primary" onClick={onDone}>
            View character
          </button>
        </section>
      )}
    </div>
  );
}
