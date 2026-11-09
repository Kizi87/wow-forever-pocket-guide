import { describe, expect, it } from 'vitest';
import { parseExport } from '../parser/parseExport';
import { diffSnapshots } from './diffSnapshots';
import { L27, L30 } from '../../tests/fixtures';

const d = diffSnapshots(parseExport(L27), parseExport(L30));

describe('diff 27 → 30', () => {
  it('level, guild, money, location', () => {
    expect(d.level).toEqual({ from: 27, to: 30 });
    expect(d.guild).toEqual({ from: null, to: 'Whose Gnome Is It Anyway' });
    expect(d.moneyCopper?.to).toBe(45954);
    expect(d.location?.to).toBe('Tarren Mill, Hillsbrad Foothills');
  });

  it('weapon swap', () => {
    const mh = d.gear.find((g) => g.slot === 'Main hand')!;
    expect(mh.from?.name).toBe('Forsaken Greataxe');
    expect(mh.to?.name).toBe('Viscous Hammer');
  });

  it('profession and weapon skill-ups', () => {
    const s = (n: string) => d.skills.find((x) => x.name === n);
    expect(s('Blacksmithing')).toMatchObject({ group: 'professions', from: { current: 113, max: 150 }, to: { current: 133, max: 150 } });
    expect(s('Mining')).toMatchObject({ from: { current: 126 }, to: { current: 146 } });
    expect(s('Two-Handed Axes')).toMatchObject({ from: { current: 133, max: 135 }, to: { current: 144, max: 150 } });
    // cap-only changes on weapon skills are noise
    expect(s('Axes')).toBeUndefined();
    expect(s('Two-Handed Maces')).toBeUndefined();
  });

  it('quests added, completed, dropped', () => {
    const ids = (qs: { id: number }[]) => qs.map((q) => q.id);
    expect(ids(d.quests.added)).toEqual(expect.arrayContaining([93680, 96988, 96986, 528, 546]));
    expect(ids(d.quests.completed)).toEqual(expect.arrayContaining([567, 6921, 6563, 494, 92421]));
    // Grey Silverpine quests Chris was advised to abandon: gone, but not in the completed list
    expect(ids(d.quests.removed)).toEqual(expect.arrayContaining([530, 95981]));
    expect(ids(d.quests.completed)).not.toContain(530);
    expect(d.newlyCompletedIds.length).toBeGreaterThan(0);
  });

  it('talents gained', () => {
    expect(d.talents.find((t) => t.name === 'Two-Handed Weapon Specialization')).toMatchObject({ from: 1, to: 3 });
    expect(d.talents.reduce((n, t) => n + (t.to - t.from), 0)).toBe(3);
  });

  it('new spells learned', () => {
    expect(d.spellsLearned.length).toBeGreaterThan(0);
  });

  it('no changes between a snapshot and itself', () => {
    const s = parseExport(L30);
    const same = diffSnapshots(s, s);
    expect(same.level).toBeNull();
    expect(same.gear).toEqual([]);
    expect(same.skills).toEqual([]);
    expect(same.quests.added).toEqual([]);
  });
});
