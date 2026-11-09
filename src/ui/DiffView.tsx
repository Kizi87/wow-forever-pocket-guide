import type { SnapshotDiff } from '../diff/diffSnapshots';
import { Empty } from './components';
import { money } from './format';

function isEmpty(d: SnapshotDiff) {
  return (
    !d.level &&
    !d.moneyCopper &&
    !d.guild &&
    d.gear.length === 0 &&
    d.skills.length === 0 &&
    d.talents.length === 0 &&
    d.spellsLearned.length === 0 &&
    d.reputation.length === 0 &&
    d.flightPathsLearned.length === 0 &&
    d.quests.added.length + d.quests.completed.length + d.quests.removed.length + d.quests.nowReady.length === 0
  );
}

export function DiffView({ diff }: { diff: SnapshotDiff }) {
  if (isEmpty(diff)) return <Empty>Nothing changed. Riveting.</Empty>;
  const q = diff.quests;
  const spells = [...new Map(diff.spellsLearned.map((s) => [s.name, s])).values()];
  return (
    <ul className="diff">
      {diff.level && (
        <li>
          <b>Level</b> {diff.level.from} → {diff.level.to}
        </li>
      )}
      {diff.gear.map((g) => (
        <li key={g.slot}>
          <b>{g.slot}</b> {g.from?.name ?? 'empty'} → {g.to?.name ?? 'empty'}
          {g.from?.ilvl != null && g.to?.ilvl != null && (
            <span className="muted small">
              {' '}
              (ilvl {g.from.ilvl} → {g.to.ilvl})
            </span>
          )}
        </li>
      ))}
      {diff.skills.map((s) => (
        <li key={s.name}>
          <b>{s.name}</b> {s.from ? `${s.from.current}/${s.from.max}` : 'new'} → {s.to ? `${s.to.current}/${s.to.max}` : 'gone'}
        </li>
      ))}
      {diff.talents.map((t) => (
        <li key={t.name}>
          <b>Talent</b> {t.name} {t.from} → {t.to}/{t.maxRank}
        </li>
      ))}
      {spells.length > 0 && (
        <li>
          <b>New spells/ranks</b> {spells.map((s) => (s.rank ? `${s.name} R${s.rank}` : s.name)).join(', ')}
        </li>
      )}
      {diff.guild && (
        <li>
          <b>Guild</b> {diff.guild.from ?? 'none'} → {diff.guild.to ?? 'none'}
        </li>
      )}
      {diff.moneyCopper && (
        <li>
          <b>Gold</b> {money(diff.moneyCopper.from)} → {money(diff.moneyCopper.to)}{' '}
          <span className={diff.moneyCopper.delta < 0 ? 'neg' : 'pos'}>({diff.moneyCopper.delta > 0 ? '+' : ''}{money(diff.moneyCopper.delta)})</span>
        </li>
      )}
      {diff.reputation.map((r) => (
        <li key={r.faction}>
          <b>{r.faction}</b> {r.from ?? 'unknown'} → {r.to}
        </li>
      ))}
      {diff.flightPathsLearned.length > 0 && (
        <li>
          <b>New flight paths</b> {diff.flightPathsLearned.join(', ')}
        </li>
      )}
      {q.nowReady.length > 0 && (
        <li>
          <b>Ready to turn in</b> {q.nowReady.map((x) => x.title).join(', ')}
        </li>
      )}
      {q.completed.length > 0 && (
        <li>
          <b>Quests completed ({q.completed.length})</b> {q.completed.map((x) => x.title).join(', ')}
        </li>
      )}
      {q.added.length > 0 && (
        <li>
          <b>Quests picked up ({q.added.length})</b> {q.added.map((x) => x.title).join(', ')}
        </li>
      )}
      {q.removed.length > 0 && (
        <li>
          <b>Left the log, not in the completed list ({q.removed.length})</b> {q.removed.map((x) => x.title).join(', ')}
          <span className="muted small"> — abandoned, or finished and missing from the addon's completed list (it isn't guaranteed complete).</span>
        </li>
      )}
    </ul>
  );
}
