import { describe, expect, it } from 'vitest';
import { ExportParseError, parseExport } from './parseExport';
import { isTag } from './tags';
import { L27, L30 } from '../../tests/fixtures';

const s30 = parseExport(L30, '2026-11-09T14:00:00.000Z');
const s27 = parseExport(L27, '2026-11-08T15:00:00.000Z');

describe('header', () => {
  it('reads version, build and epoch', () => {
    expect(s30.header).toMatchObject({ addonVersion: '0.3.0', gameVersion: '1.60.1', build: 70862, interfaceVersion: 16001, epoch: 1794231543, capturedLocal: '2026-11-09 13:39:03' });
    expect(s30.id).toBe('Kiz-CAMWOWEU4Realm7PvE-1794231543');
    expect(s30.warnings).toEqual([]);
    expect(s27.warnings).toEqual([]);
  });
  it('rejects text that is not an export', () => {
    expect(() => parseExport('hello there')).toThrow(ExportParseError);
  });
  it('warns when # end is missing', () => {
    const cut = L30.slice(0, L30.indexOf('## talents'));
    const s = parseExport(cut);
    expect(s.warnings.some((w) => w.includes('truncated'))).toBe(true);
    expect(s.character.level).toBe(30);
  });
});

describe('character (level 30)', () => {
  const c = s30.character;
  it('identity and progress', () => {
    expect(c).toMatchObject({ name: 'Kiz', realm: 'CAMWOW EU4 Realm 7 PvE', race: 'Undead', className: 'Paladin', faction: 'Horde', level: 30 });
    expect(c.xp).toEqual({ current: 2499, max: 47400 });
    expect(c.restedXp).toBe(112);
    expect(c.moneyCopper).toBe(45954);
    expect(c.zone).toBe('Hillsbrad Foothills');
    expect(c.subzone).toBe('Tarren Mill');
    expect(c.hearth).toBe('Undercity');
    expect(c.guild).toEqual({ name: 'Whose Gnome Is It Anyway', rank: 'Initiate' });
    expect(c.playedTotalSec).toBe(175640);
  });
  it('stats', () => {
    expect(c.stats).toEqual({ strength: 99, agility: 51, stamina: 84, intellect: 49, spirit: 68 });
    expect(c.attackPower).toBe(372);
    expect(c.meleeDamage).toEqual({ min: 155.88, max: 192.98 });
    expect(c.attackSpeed).toBe(2.9);
    expect(c.crit).toEqual({ melee: 9.03, spell: 11.03 });
    expect(c.armor).toBe(1706);
    expect(c.healthMax).toBe(1026);
    expect(c.powerMax).toBe(1157);
  });
  it('keeps tags instead of flattening them (level 27 rested XP, no guild)', () => {
    expect(isTag(s27.character.restedXp) && s27.character.restedXp.tag).toBe('empty');
    expect(isTag(s27.character.guild) && s27.character.guild.tag).toBe('empty');
  });
});

describe('equipment', () => {
  it('13 of 19 slots filled, ammo ignored', () => {
    expect(s30.equipment).toHaveLength(19);
    expect(s30.equipment.filter((e) => e.item).length).toBe(13);
    expect(s30.equipment.some((e) => e.slotKey === 'AmmoSlot')).toBe(false);
  });
  it('reads the weapon by id', () => {
    const mh = s30.equipment.find((e) => e.slotKey === 'MainHandSlot')!.item!;
    expect(mh).toMatchObject({ id: 13045, name: 'Viscous Hammer', quality: 3, ilvl: 35, subType: 'Two-Handed Maces', invType: 'INVTYPE_2HWEAPON' });
    expect(mh.durability).toEqual({ cur: 100, max: 100 });
  });
  it('lists empty slots', () => {
    const empty = s30.equipment.filter((e) => !e.item).map((e) => e.slotKey);
    expect(empty).toEqual(['NeckSlot', 'TabardSlot', 'Trinket0Slot', 'Trinket1Slot', 'SecondaryHandSlot', 'RangedSlot']);
  });
});

describe('bags and bank', () => {
  it('bags', () => {
    expect(s30.bags.slotsFree).toBe(39);
    expect(s30.bags.slotsTotal).toBe(66);
    expect(s30.bags.items).toHaveLength(26);
    expect(s30.bags.items.find((i) => i.id === 929)?.count).toBe(8);
  });
  it('bank is stale-tagged at 30', () => {
    const b = s30.bank;
    if (isTag(b)) throw new Error('expected bank contents');
    expect(b.stale).toEqual({ stale: true, capturedAt: '2026-11-09 13:27:55 (client local)' });
    expect(b.items.find((i) => i.name === 'Iron Bar')?.count).toBe(21);
    expect(b.items.find((i) => i.name === 'Rough Grinding Stone')?.count).toBe(49);
  });
  it('bank is unknown (not empty) at 27', () => {
    expect(isTag(s27.bank) && s27.bank.tag).toBe('unknown');
  });
});

describe('quests', () => {
  const q = s30.quests;
  it('log', () => {
    expect(q.log).toHaveLength(28);
    expect(q.slotsUsed).toBe(28);
    expect(q.slotsMax).toBe(40);
    expect(q.log.filter((x) => x.ready).map((x) => x.id).sort((a, b) => a - b)).toEqual([513, 1361, 79007]);
  });
  it('objectives, including ones without a leading count', () => {
    const arikara = q.log.find((x) => x.id === 5088)!;
    expect(arikara.zone).toBe('Thousand Needles');
    expect(arikara.objectives).toEqual([
      { text: 'Arikara Serpent Skin', done: false, have: 0, need: 1 },
      { text: 'Light the Sacred Fire of Life', done: false, have: 0, need: 1 },
    ]);
    const blade = q.log.find((x) => x.id === 95036)!;
    expect(blade.zone).toBe('Paladin');
    expect(Array.isArray(blade.objectives) && blade.objectives.filter((o) => o.done).length).toBe(3);
  });
  it('ready quests with empty objective lists keep the tag', () => {
    const note = q.log.find((x) => x.id === 79007)!;
    expect(note.title).toBe('... and that note you found');
    expect(isTag(note.objectives) && note.objectives.tag).toBe('empty');
  });
  it('completed ids and titles', () => {
    expect(q.completedIds).toHaveLength(282);
    expect(q.completedIds).toContain(567);
    expect(q.completedTitles[99156]).toBe('Rear Guard Patrol');
    expect(Object.keys(q.completedTitles)).toHaveLength(22);
  });
});

describe('talents, spells, skills, rep, flight paths', () => {
  it('talents', () => {
    expect(s30.talents.spent).toBe(21);
    expect(s30.talents.available).toBe(0);
    expect(s30.talents.nodes).toHaveLength(9);
    expect(s30.talents.nodes.find((t) => t.name === 'Vengeance')).toEqual({ name: 'Vengeance', rank: 1, maxRank: 3, spellId: 20049 });
  });
  it('spells', () => {
    expect(s30.spells.length).toBeGreaterThan(50);
    const hs = s30.spells.filter((s) => s.name === 'Holy Strike');
    expect(Math.max(...hs.map((s) => s.rank ?? 0))).toBe(4);
    expect(s30.spells.find((s) => s.name === 'Underwater Breathing')?.passive).toBe(true);
  });
  it('skills deduped', () => {
    expect(s30.skills.professions).toEqual([
      { name: 'Blacksmithing', current: 133, max: 150 },
      { name: 'Mining', current: 146, max: 225 },
    ]);
    expect(s30.skills.secondary).toEqual([{ name: 'Cooking', current: 3, max: 75 }]);
    expect(s30.skills.weapons.find((w) => w.name === 'Two-Handed Maces')).toEqual({ name: 'Two-Handed Maces', current: 89, max: 150 });
  });
  it('reputation', () => {
    expect(s30.reputation.find((r) => r.faction === 'Undercity')).toMatchObject({ standing: 'Honored', group: 'Horde', progress: 6238, progressMax: 12000 });
  });
  it('flight paths', () => {
    const fp = s30.flightPaths;
    if (isTag(fp)) throw new Error('expected flight paths');
    expect(fp.stale?.capturedAt).toContain('2026-11-09 13:32:15');
    expect(fp.continents.map((c) => c.name)).toEqual(['Kalimdor', 'Eastern Kingdoms']);
    expect(fp.continents[0].nodes).toHaveLength(22);
    expect(fp.continents[0].nodes.find((n) => n.id === 69)).toMatchObject({ name: 'Moonglade', zone: null });
    expect(fp.continents[1].nodes.find((n) => n.name === 'Tarren Mill')).toMatchObject({ zone: 'Hillsbrad', state: 'reachable' });
    expect(isTag(s27.flightPaths) && s27.flightPaths.tag).toBe('unknown');
  });
});
