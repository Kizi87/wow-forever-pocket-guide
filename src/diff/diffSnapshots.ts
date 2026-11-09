import { isTag, valueOf } from '../parser/tags';
import type { EquipSlot, QuestEntry, Snapshot } from '../parser/types';

type Item = NonNullable<EquipSlot['item']>;
export interface Change<T> {
  from: T;
  to: T;
}

export interface SnapshotDiff {
  fromId: string;
  toId: string;
  level: Change<number> | null;
  moneyCopper: (Change<number> & { delta: number }) | null;
  guild: Change<string | null> | null;
  location: Change<string> | null;
  gear: { slot: string; from: Item | null; to: Item | null }[];
  quests: {
    added: QuestEntry[];
    /** Left the log and the id is now in the completed list. */
    completed: QuestEntry[];
    /** Left the log but not in the completed list: abandoned, or the completed list is incomplete. */
    removed: QuestEntry[];
    nowReady: QuestEntry[];
  };
  /** Completed ids that were not completed before (includes quests never seen in a log). */
  newlyCompletedIds: number[];
  skills: { name: string; group: 'professions' | 'secondary' | 'weapons'; from: { current: number; max: number } | null; to: { current: number; max: number } | null }[];
  talents: { name: string; from: number; to: number; maxRank: number }[];
  spellsLearned: { name: string; rank: number | null }[];
  reputation: { faction: string; from: string | null; to: string }[];
  flightPathsLearned: string[];
}

const where = (s: Snapshot) => [s.character.subzone, s.character.zone].filter(Boolean).join(', ');

/** Everything that changed between two snapshots, oldest first. */
export function diffSnapshots(a: Snapshot, b: Snapshot): SnapshotDiff {
  const ca = a.character;
  const cb = b.character;

  const gear: SnapshotDiff['gear'] = [];
  for (const slotB of b.equipment) {
    const slotA = a.equipment.find((e) => e.slotKey === slotB.slotKey);
    const idA = slotA?.item?.id ?? null;
    const idB = slotB.item?.id ?? null;
    if (idA !== idB) gear.push({ slot: slotB.slot, from: slotA?.item ?? null, to: slotB.item });
  }

  const logA = new Map(a.quests.log.map((q) => [q.id, q]));
  const logB = new Map(b.quests.log.map((q) => [q.id, q]));
  const doneB = new Set(b.quests.completedIds);
  const doneA = new Set(a.quests.completedIds);
  const gone = a.quests.log.filter((q) => !logB.has(q.id));

  const skills: SnapshotDiff['skills'] = [];
  for (const group of ['professions', 'secondary', 'weapons'] as const) {
    const names = new Set([...a.skills[group], ...b.skills[group]].map((s) => s.name));
    for (const name of names) {
      const sa = a.skills[group].find((s) => s.name === name) ?? null;
      const sb = b.skills[group].find((s) => s.name === name) ?? null;
      // Weapon caps rise with every level; only report a weapon skill when the skill itself moved.
      const changed = group === 'weapons' ? sa?.current !== sb?.current : sa?.current !== sb?.current || sa?.max !== sb?.max;
      if (changed)
        skills.push({ name, group, from: sa && { current: sa.current, max: sa.max }, to: sb && { current: sb.current, max: sb.max } });
    }
  }

  const talents: SnapshotDiff['talents'] = [];
  for (const t of b.talents.nodes) {
    const before = a.talents.nodes.find((x) => x.name === t.name)?.rank ?? 0;
    if (before !== t.rank) talents.push({ name: t.name, from: before, to: t.rank, maxRank: t.maxRank });
  }

  const spellIdsA = new Set(a.spells.map((s) => s.id));
  const spellsLearned = b.spells.filter((s) => !spellIdsA.has(s.id)).map((s) => ({ name: s.name, rank: s.rank }));

  const reputation: SnapshotDiff['reputation'] = [];
  for (const r of b.reputation) {
    const before = a.reputation.find((x) => x.id === r.id);
    if (before?.standing !== r.standing) reputation.push({ faction: r.faction, from: before?.standing ?? null, to: r.standing });
  }

  const fpNames = (s: Snapshot) =>
    isTag(s.flightPaths) ? null : new Set(s.flightPaths.continents.flatMap((c) => c.nodes.filter((n) => n.state !== 'unreachable').map((n) => n.name)));
  const fpA = fpNames(a);
  const fpB = fpNames(b);
  const flightPathsLearned = fpA && fpB ? [...fpB].filter((n) => !fpA.has(n)) : [];

  const guildName = (s: Snapshot) => valueOf(s.character.guild)?.name ?? null;
  const moneyA = ca.moneyCopper;
  const moneyB = cb.moneyCopper;

  return {
    fromId: a.id,
    toId: b.id,
    level: ca.level !== cb.level ? { from: ca.level, to: cb.level } : null,
    moneyCopper: moneyA != null && moneyB != null && moneyA !== moneyB ? { from: moneyA, to: moneyB, delta: moneyB - moneyA } : null,
    guild: guildName(a) !== guildName(b) ? { from: guildName(a), to: guildName(b) } : null,
    location: where(a) !== where(b) ? { from: where(a), to: where(b) } : null,
    gear,
    quests: {
      added: b.quests.log.filter((q) => !logA.has(q.id)),
      completed: gone.filter((q) => doneB.has(q.id)),
      removed: gone.filter((q) => !doneB.has(q.id)),
      nowReady: b.quests.log.filter((q) => q.ready && logA.has(q.id) && !logA.get(q.id)!.ready),
    },
    newlyCompletedIds: b.quests.completedIds.filter((id) => !doneA.has(id)),
    skills,
    talents,
    spellsLearned,
    reputation,
    flightPathsLearned,
  };
}

/** Order two snapshots by capture epoch (falls back to import time). */
export function byCapture(a: Snapshot, b: Snapshot): number {
  const ka = a.header.epoch ?? Date.parse(a.importedAt) / 1000;
  const kb = b.header.epoch ?? Date.parse(b.importedAt) / 1000;
  return ka - kb;
}
