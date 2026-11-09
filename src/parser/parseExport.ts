import { parseStale, parseTag } from './tags';
import type {
  Character,
  Container,
  EquipSlot,
  ExportHeader,
  FlightNode,
  ItemStack,
  Maybe,
  Objective,
  QuestEntry,
  Reputation,
  Skill,
  Snapshot,
  Spell,
  Tag,
  Talent,
} from './types';

/** Thrown when the pasted text is not a ForeverCharacterExport at all. */
export class ExportParseError extends Error {}

const KNOWN_ADDON_VERSION = '0.3.0';

type Lines = string[];

const num = (s: string | undefined | null): number | null => {
  if (s == null) return null;
  const n = Number(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
};

/** Split the raw text into the header lines and named `## section` blocks. */
function splitSections(lines: Lines) {
  const header: Lines = [];
  const sections = new Map<string, Lines>();
  let current: Lines | null = null;
  let ended = false;
  for (const line of lines) {
    if (line.trim() === '# end') {
      ended = true;
      break;
    }
    const sec = line.match(/^## (\S[^[]*?)\s*(\[.*)?$/);
    if (sec) {
      current = [];
      if (!sections.has(sec[1])) sections.set(sec[1], current);
      continue;
    }
    if (current) current.push(line);
    else if (line.startsWith('# ')) header.push(line);
  }
  return { header, sections, ended };
}

/** First-wins `key: value` map for a block of lines (top-level lines only). */
function keyValues(lines: Lines): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of lines) {
    const m = line.match(/^([a-z][^:]*?):\s(.*)$/i);
    if (m && !out.has(m[1])) out.set(m[1], m[2].trim());
  }
  return out;
}

/** Lines under each `### ` sub-heading. Lines before the first heading go under ''. */
function subSections(lines: Lines, marker = '### '): { title: string; lines: Lines }[] {
  const out: { title: string; lines: Lines }[] = [{ title: '', lines: [] }];
  for (const line of lines) {
    if (line.startsWith(marker)) out.push({ title: line.slice(marker.length).trim(), lines: [] });
    else out[out.length - 1].lines.push(line);
  }
  return out;
}

function parseHeader(lines: Lines): ExportHeader {
  const first = lines[0] ?? '';
  const m = first.match(/^# ForeverCharacterExport (\S+)(?: \| WoW (\S+) \(build (\d+), interface (\d+)\))?/);
  if (!m) throw new ExportParseError("That doesn't look like a ForeverCharacterExport. The first line should start with \"# ForeverCharacterExport\".");
  const captured = lines.find((l) => l.startsWith('# captured '));
  const c = captured?.match(/^# captured (.+?) \(client local\)(?: \| epoch (\d+))?/);
  return {
    addonVersion: m[1],
    gameVersion: m[2] ?? null,
    build: num(m[3]),
    interfaceVersion: num(m[4]),
    capturedLocal: c?.[1] ?? null,
    epoch: num(c?.[2]),
  };
}

const beforeParen = (s: string | undefined) => (s ?? '').replace(/\s*\(.*$/, '').trim();
const field = (s: string | undefined, key: string) => num(s?.match(new RegExp(`${key}=(-?[\\d.]+)`))?.[1]);
const pct = (s: string | undefined) => num(s?.match(/(-?[\d.]+)%/)?.[1]);
const seconds = (s: string | undefined) => num(s?.match(/\((\d+) seconds\)/)?.[1]);

function maybe<T>(raw: string | undefined, parse: (s: string) => T | null): Maybe<T> {
  if (raw == null) return { tag: 'unknown', reason: 'not in export' };
  const tag = parseTag(raw);
  if (tag) return tag;
  const v = parse(raw);
  return v == null ? { tag: 'unknown', reason: `could not read "${raw}"` } : v;
}

function parseCharacter(lines: Lines): Character {
  const kv = keyValues(lines);
  const xp = kv.get('xp')?.match(/^(\d+)\s*\/\s*(\d+)/);
  const dmg = kv.get('melee damage')?.match(/mainhand ([\d.]+)-([\d.]+)/);
  const pos = kv.get('map position')?.match(/x=([\d.]+) y=([\d.]+)/);
  const stat = (k: string) => field(kv.get(k), 'effective');
  return {
    name: kv.get('name') ?? 'Unknown',
    realm: kv.get('realm') ?? 'Unknown realm',
    race: beforeParen(kv.get('race')),
    className: beforeParen(kv.get('class')),
    faction: beforeParen(kv.get('faction')),
    level: num(kv.get('level')) ?? 0,
    xp: xp ? { current: Number(xp[1]), max: Number(xp[2]) } : null,
    restedXp: maybe(kv.get('rested xp'), (s) => num(s.match(/^(\d+)/)?.[1])),
    moneyCopper: num(kv.get('money (raw copper)')),
    zone: kv.get('zone') ?? null,
    subzone: kv.get('subzone') || null,
    mapPosition: pos ? { x: Number(pos[1]), y: Number(pos[2]) } : null,
    hearth: kv.get('bind location (hearthstone)') ?? null,
    guild: maybe(kv.get('guild'), (s) => {
      const g = s.match(/^(.*?) \| rank ([^(|]+)/);
      return g ? { name: g[1].trim(), rank: g[2].trim() } : null;
    }),
    playedTotalSec: seconds(kv.get('played total')),
    playedLevelSec: seconds(kv.get('played this level')),
    stats: {
      strength: stat('strength') ?? undefined,
      agility: stat('agility') ?? undefined,
      stamina: stat('stamina') ?? undefined,
      intellect: stat('intellect') ?? undefined,
      spirit: stat('spirit') ?? undefined,
    },
    armor: field(kv.get('armor'), 'effective'),
    attackPower: field(kv.get('melee attack power'), 'effective'),
    meleeDamage: dmg ? { min: Number(dmg[1]), max: Number(dmg[2]) } : null,
    attackSpeed: field(kv.get('attack speed'), 'mainhand'),
    crit: { melee: pct(kv.get('crit melee')), spell: pct(kv.get('crit spell')) },
    dodge: pct(kv.get('dodge')),
    parry: pct(kv.get('parry')),
    block: pct(kv.get('block')),
    healthMax: num(kv.get('health max')),
    powerMax: num(kv.get('primary power max')),
    powerType: kv.get('primary power type')?.match(/token (\w+)/)?.[1] ?? null,
  };
}

function parseEquipment(lines: Lines): EquipSlot[] {
  const out: EquipSlot[] = [];
  for (const line of lines) {
    const m = line.match(/^(.+?) \((\w+), slot (\d+)\): (.*)$/);
    if (!m) continue;
    const [, slot, slotKey, slotIdStr, rest] = m;
    if (slotKey === 'AmmoSlot') continue; // ammo line is noise (see export-format.md)
    const base = { slot, slotKey, slotId: Number(slotIdStr) };
    if (rest.trim() === '<empty slot>') {
      out.push({ ...base, item: null });
      continue;
    }
    const it = rest.match(/^(.*) \((\d+)\)\s+quality=(\d+) \(([^)]*)\)/);
    if (!it) {
      const tag = parseTag(rest.match(/^<[^>]*>/)?.[0] ?? '');
      out.push({ ...base, item: null, unresolved: tag ?? { tag: 'unknown', reason: rest } });
      continue;
    }
    const dur = rest.match(/durability=(\d+)\/(\d+)/);
    const type = rest.match(/type=([^/]+)\/(.+?) (INVTYPE_\w+)/);
    out.push({
      ...base,
      item: {
        name: it[1].trim(),
        id: Number(it[2]),
        quality: Number(it[3]),
        qualityName: it[4],
        ilvl: num(rest.match(/ilvl=(\d+)/)?.[1]),
        durability: dur ? { cur: Number(dur[1]), max: Number(dur[2]) } : null,
        itemClass: type?.[1] ?? null,
        subType: type?.[2] ?? null,
        invType: type?.[3] ?? null,
      },
    });
  }
  return out;
}

const ITEM_RE = /^- (.*) \((\d+)\) x(\d+)$/;
function itemLines(lines: Lines): ItemStack[] {
  const items: ItemStack[] = [];
  for (const line of lines) {
    const m = line.match(ITEM_RE);
    if (m) items.push({ name: m[1].trim(), id: Number(m[2]), count: Number(m[3]) });
  }
  return items;
}

function slotsLine(lines: Lines) {
  const s = lines.map((l) => l.match(/^slots: (\d+) free \/ (\d+) total/)).find(Boolean);
  return { slotsFree: num(s?.[1]), slotsTotal: num(s?.[2]) };
}

function parseBags(lines: Lines): Container {
  const top = subSections(lines)[0].lines; // summary list sits before the per-bag ### blocks
  return { ...slotsLine(top), items: itemLines(top) };
}

/** Merge stacks of the same item id. */
function mergeItems(items: ItemStack[]): ItemStack[] {
  const byId = new Map<number, ItemStack>();
  for (const i of items) {
    const prev = byId.get(i.id);
    if (prev) prev.count += i.count;
    else byId.set(i.id, { ...i });
  }
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function parseBank(lines: Lines): Snapshot['bank'] {
  const kv = keyValues(lines);
  const head = kv.get('bank') ?? lines.find((l) => l.trim().startsWith('<'))?.trim();
  const tag = head ? parseTag(head) : null;
  if (tag) return tag;
  const blocks = subSections(lines).filter((b) => !/^Bag -?\d+/.test(b.title));
  const all = blocks.flatMap((b) => b.lines);
  return {
    stale: head ? parseStale(head) : null,
    ...slotsLine(all),
    items: mergeItems(itemLines(all)),
  };
}

function parseObjective(line: string): Objective | null {
  const m = line.match(/^\s+- \[( |x)\] (.*)$/);
  if (!m) return null;
  let text = m[2].trim();
  const counts = text.match(/\((\d+)\/(\d+)\)$/);
  if (counts) text = text.slice(0, counts.index).trim();
  text = text.replace(/^\d+\/\d+\s+/, '');
  return { text, done: m[1] === 'x', have: num(counts?.[1]), need: num(counts?.[2]) };
}

function parseQuests(lines: Lines): Snapshot['quests'] {
  const subs = subSections(lines);
  const logLines = subs.find((s) => s.title === 'Quest log')?.lines ?? [];
  const doneLines = subs.find((s) => s.title === 'Completed quests')?.lines ?? [];

  const log: QuestEntry[] = [];
  let zone = '';
  let current: QuestEntry | null = null;
  for (const line of logLines) {
    const z = line.match(/^#### (.*?) \(\d+ quests?/);
    if (z) {
      zone = z[1];
      continue;
    }
    const q = line.match(/^- (.*) \((\d+)\) \| level (\d+) \| ([^|]+?) \|(.*)$/);
    if (q) {
      current = {
        id: Number(q[2]),
        title: q[1].trim(),
        level: num(q[3]),
        zone,
        status: q[4].trim(),
        ready: /ReadyForTurnIn=yes/.test(q[5]) || /READY TO TURN IN/i.test(q[4]),
        objectives: [],
      };
      log.push(current);
      continue;
    }
    if (!current) continue;
    const empty = line.match(/^\s+objectives: (<.*>)$/);
    if (empty) {
      current.objectives = parseTag(empty[1]) ?? { tag: 'unknown', reason: empty[1] };
      continue;
    }
    const obj = parseObjective(line);
    if (obj && Array.isArray(current.objectives)) current.objectives.push(obj);
  }
  const slots = logLines.map((l) => l.match(/^quest slots: (\d+) used \/ (\d+) max/)).find(Boolean);

  const completedIds = new Set<number>();
  const completedTitles: Record<number, string> = {};
  let mode: 'ids' | 'titles' | null = null;
  for (const line of doneLines) {
    if (/^completed ids/.test(line)) mode = 'ids';
    else if (/^completed \(with titles known\)/.test(line)) mode = 'titles';
    else if (!/^\s/.test(line)) mode = null;
    else if (mode === 'ids') {
      for (const id of line.split(',')) {
        const n = num(id.trim());
        if (n != null) completedIds.add(n);
      }
    } else if (mode === 'titles') {
      const t = line.match(/^\s+(\d+) (.+)$/);
      if (t) completedTitles[Number(t[1])] = t[2].trim();
    }
  }
  return {
    log,
    slotsUsed: num(slots?.[1]),
    slotsMax: num(slots?.[2]),
    completedIds: [...completedIds].sort((a, b) => a - b),
    completedTitles,
  };
}

function parseTalents(lines: Lines): Snapshot['talents'] {
  const pts = lines.map((l) => l.match(/^points: (\d+) spent \/ (\d+) available/)).find(Boolean);
  const nodes: Talent[] = [];
  for (const line of lines) {
    const m = line.match(/node \d+ rank (\d+)\/(\d+): (.+?) \(spellID (\d+)\)/);
    if (m) nodes.push({ name: m[3], rank: Number(m[1]), maxRank: Number(m[2]), spellId: num(m[4]) });
  }
  return { spent: num(pts?.[1]), available: num(pts?.[2]), nodes };
}

function parseSpells(lines: Lines): Spell[] {
  const out: Spell[] = [];
  for (const block of subSections(lines)) {
    const line = block.title.match(/^(.*?) \(skill line/);
    if (!line) continue;
    const text = block.lines.map((l) => l.trim()).join(' ');
    for (const m of text.matchAll(/([^,()]+)\(([^()]*)\)/g)) {
      const parts = m[2].split(',').map((p) => p.trim());
      const id = num(parts.find((p) => p.startsWith('id='))?.slice(3));
      if (id == null) continue; // flyouts etc.
      const rank = num(parts.find((p) => /^Rank \d+$/.test(p))?.slice(5));
      out.push({ name: m[1].trim(), rank, id, passive: parts.includes('passive'), skillLine: line[1] });
    }
  }
  return out;
}

function parseSkills(lines: Lines): Snapshot['skills'] {
  const group = (title: string): Skill[] => {
    const block = subSections(lines).find((b) => b.title.startsWith(title));
    const seen = new Map<string, Skill>();
    for (const l of block?.lines ?? []) {
      const m = l.match(/^- (.+?) (\d+)\/(\d+) \[/);
      if (m && !seen.has(m[1])) seen.set(m[1], { name: m[1], current: Number(m[2]), max: Number(m[3]) });
    }
    return [...seen.values()];
  };
  return { professions: group('Professions'), secondary: group('Secondary Skills'), weapons: group('Weapon Skills') };
}

function parseReputation(lines: Lines): Reputation[] {
  const out: Reputation[] = [];
  for (const block of subSections(lines)) {
    const group = beforeParen(block.title);
    for (const l of block.lines) {
      const m = l.match(/^- (.+?) \((\d+)\): standing=\d+ \(([^)]+)\)(?: progress=(\d+)\/(\d+))?/);
      if (m) out.push({ faction: m[1], id: Number(m[2]), group, standing: m[3], progress: num(m[4]), progressMax: num(m[5]) });
    }
  }
  return out;
}

function parseFlightPaths(lines: Lines): Snapshot['flightPaths'] {
  const blocks = subSections(lines);
  const top = blocks[0].lines;
  const head = keyValues(top).get('flight paths');
  const continents = blocks.slice(1).map((b) => ({
    name: beforeParen(b.title).replace(/,.*$/, ''),
    capturedAt: b.title.match(/captured (.+?\))/)?.[1] ?? null,
    nodes: b.lines
      .map((l) => l.match(/^- (.+?)(?:, (.+))? \((\d+)\) \[(\w+)\]$/))
      .filter((m): m is RegExpMatchArray => !!m)
      .map((m): FlightNode => ({ name: m[1], zone: m[2] ?? null, id: Number(m[3]), state: m[4] })),
  }));
  if (continents.length === 0) {
    const tagLine = top.map((l) => l.trim()).find((l) => l.startsWith('<'));
    return (tagLine && parseTag(tagLine)) || { tag: 'unknown', reason: 'no flight paths in export' };
  }
  return { stale: head ? parseStale(head) : null, continents };
}

/**
 * Parse a pasted ForeverCharacterExport (v0.3.0 format). Defensive: unknown lines are ignored,
 * missing sections produce warnings rather than errors.
 */
export function parseExport(raw: string, importedAt = new Date().toISOString()): Snapshot {
  const text = raw.replace(/^﻿/, '').replace(/\r\n?/g, '\n').trim();
  const lines = text.split('\n');
  const { header: headerLines, sections, ended } = splitSections(lines);
  const header = parseHeader(headerLines);
  const warnings: string[] = [];
  if (!ended) warnings.push('No "# end" line: the paste looks truncated. Some sections may be missing.');
  if (header.addonVersion !== KNOWN_ADDON_VERSION)
    warnings.push(`Export is from addon ${header.addonVersion}; this parser was written for ${KNOWN_ADDON_VERSION}. Check the results.`);

  const sec = (name: string): Lines => {
    const s = sections.get(name);
    if (!s) warnings.push(`Section "${name}" is missing from the export.`);
    return s ?? [];
  };

  const charLines = sec('character');
  const character = parseCharacter(charLines);
  const ckv = keyValues(charLines);
  if (ckv.get('in combat (lockdown)') === 'true' || ckv.get('in combat (unit)') === 'true')
    warnings.push('Export was taken in combat: some values are hidden. Take it out of combat next time.');

  const realmKey = ckv.get('realm (normalized)') ?? character.realm.replace(/\s+/g, '');
  const id = `${character.name}-${realmKey}-${header.epoch ?? Date.parse(importedAt)}`;

  return {
    id,
    header,
    warnings,
    character,
    equipment: parseEquipment(sec('equipment')),
    bags: parseBags(sec('bags')),
    bank: sections.has('bank') ? parseBank(sections.get('bank')!) : ({ tag: 'unknown', reason: 'no bank section' } as Tag),
    quests: parseQuests(sec('quests')),
    talents: parseTalents(sec('talents')),
    spells: parseSpells(sec('spells')),
    skills: parseSkills(sec('skills')),
    reputation: parseReputation(sec('reputation')),
    flightPaths: sections.has('flightpaths')
      ? parseFlightPaths(sections.get('flightpaths')!)
      : { tag: 'unknown', reason: 'no flightpaths section' },
    raw,
    importedAt,
  };
}
