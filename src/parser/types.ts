/** A value the addon could not give us as a plain value. Never flatten these to "empty". */
export interface Tag {
  tag: 'empty' | 'unknown' | 'restricted';
  reason: string;
}
export type Maybe<T> = T | Tag;

export interface Stale {
  stale: true;
  capturedAt: string; // client local time as written by the addon
}

export interface ExportHeader {
  addonVersion: string;
  gameVersion: string | null;
  build: number | null;
  interfaceVersion: number | null;
  capturedLocal: string | null;
  epoch: number | null;
}

export interface Character {
  name: string;
  realm: string;
  race: string;
  className: string;
  faction: string;
  level: number;
  xp: { current: number; max: number } | null;
  restedXp: Maybe<number>;
  moneyCopper: number | null;
  zone: string | null;
  subzone: string | null;
  mapPosition: { x: number; y: number } | null;
  hearth: string | null;
  guild: Maybe<{ name: string; rank: string }>;
  playedTotalSec: number | null;
  playedLevelSec: number | null;
  stats: Partial<Record<'strength' | 'agility' | 'stamina' | 'intellect' | 'spirit', number>>;
  armor: number | null;
  attackPower: number | null;
  meleeDamage: { min: number; max: number } | null;
  attackSpeed: number | null;
  crit: { melee: number | null; spell: number | null };
  dodge: number | null;
  parry: number | null;
  block: number | null;
  healthMax: number | null;
  powerMax: number | null;
  powerType: string | null;
}

export interface EquipSlot {
  slot: string; // display name, e.g. "Main hand"
  slotKey: string; // e.g. MainHandSlot
  slotId: number;
  item: { id: number; name: string; quality: number | null; qualityName: string | null; ilvl: number | null; durability: { cur: number; max: number } | null; itemClass: string | null; subType: string | null; invType: string | null } | null;
  unresolved?: Tag;
}

export interface ItemStack {
  id: number;
  name: string;
  count: number;
}

export interface Container {
  slotsFree: number | null;
  slotsTotal: number | null;
  items: ItemStack[];
}

export interface Objective {
  text: string;
  done: boolean;
  have: number | null;
  need: number | null;
}

export interface QuestEntry {
  id: number;
  title: string;
  level: number | null;
  zone: string; // log header the quest sits under (a zone, or e.g. "Paladin", "Cooking")
  ready: boolean;
  status: string;
  objectives: Objective[] | Tag;
}

export interface Talent {
  name: string;
  rank: number;
  maxRank: number;
  spellId: number | null;
}

export interface Spell {
  name: string;
  rank: number | null;
  id: number;
  passive: boolean;
  skillLine: string;
}

export interface Skill {
  name: string;
  current: number;
  max: number;
}

export interface Reputation {
  faction: string;
  id: number;
  group: string;
  standing: string;
  progress: number | null;
  progressMax: number | null;
}

export interface FlightNode {
  name: string;
  zone: string | null;
  id: number;
  state: string; // reachable | current | unreachable | ...
}

export interface Snapshot {
  id: string;
  header: ExportHeader;
  warnings: string[];
  character: Character;
  equipment: EquipSlot[];
  bags: Container;
  bank: (Container & { stale: Stale | null }) | Tag;
  quests: {
    log: QuestEntry[];
    slotsUsed: number | null;
    slotsMax: number | null;
    completedIds: number[];
    completedTitles: Record<number, string>;
  };
  talents: { spent: number | null; available: number | null; nodes: Talent[] };
  spells: Spell[];
  skills: { professions: Skill[]; secondary: Skill[]; weapons: Skill[] };
  reputation: Reputation[];
  flightPaths: { stale: Stale | null; continents: { name: string; capturedAt: string | null; nodes: FlightNode[] }[] } | Tag;
  raw: string;
  importedAt: string; // ISO, when the app stored it
}
