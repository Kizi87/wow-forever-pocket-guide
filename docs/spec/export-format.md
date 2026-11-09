# ForeverCharacterExport text format (v0.3.0) — parser notes

Input: Chris copies the addon's export and pastes it into the app. Two real samples are in `samples/exports/` — use them as test fixtures. Write the parser defensively: the addon is at 0.3.0 and will change.

## Shape

```
# ForeverCharacterExport 0.3.0 | WoW 1.60.1 (build 70862, interface 16001)
# captured 2026-11-09 13:39:03 (client local) | epoch 1794231543
...
## character  [api ok=67 empty=0 not_read=2]
-- identity
name: Kiz
level: 30
...
## equipment  [...]
Head (HeadSlot, slot 1): Banded Helm of the Wolf (10408)  quality=2 (Uncommon)  ilvl=32  durability=60/60 (100%)  type=Armor/Mail INVTYPE_HEAD
...
# end
```

- Header lines start with `# `. Capture addon version, client build, interface, **captured timestamp** and **epoch** (use epoch as the snapshot id).
- Sections start with `## <name>  [api ...]`. Sub-sections: `### `, `#### `, and `-- ` group labels.
- Most fields are `key: value`.
- `# end` marks the end. If missing, the paste was truncated — warn.

## Value tags (must be preserved, not flattened to empty)

| Tag | Meaning | Store as |
|---|---|---|
| `<empty: reason>` | API returned a real empty value | `{ status: "empty", reason }` |
| `<not_collected: reason>` | Couldn't read — **not** proof of none | `{ status: "unknown", reason }` |
| `<restricted: …>`, `<unsupported>`, `<error>` | Blocked (e.g. combat "secret values") | `{ status: "restricted", reason }` |
| `[stale snapshot captured … ago; not a live read]` | Bank / flight paths saved earlier | keep `stale: true` + `capturedAt` |

## Sections and the parts the app needs

| Section | Parse |
|---|---|
| character | name, realm, race, class, faction, level, xp current/max, rested xp, money (raw copper), zone/subzone, map position, hearth, guild, played total/this level, primary stats, AP, melee damage range, attack speed, crit, dodge/parry/block, health max, mana max |
| equipment | per slot: slot name, item name, item id, quality, ilvl, durability, type/subtype, inventory type; `<empty slot>` |
| bags / bank | item name, id, count, bag, slot; bank is stale-tagged |
| quests | per quest: zone header, title, id, level, status (`in progress` / `READY TO TURN IN`), objectives `[ ]`/`[x]` with counts; then completed IDs (CSV across lines) and the ID→title list. Note: completed list is "unverified" by the addon |
| talents | points spent/available; purchased nodes: name, rank x/y, spellID |
| spells | grouped by skill line; name, rank, id, passive flag |
| skills | professions (name current/max), weapon skills, defense |
| reputation | faction, standing name, progress |
| flightpaths | per continent, node name, zone, id, reachable/current/unreachable (stale-tagged) |
| auras, actionbars, addons | nice-to-have; parse later |

## Gotchas seen in the samples

- Professions appear twice (parent and child skill line) — dedupe by name.
- `sex` mapping is flagged unverified by the addon — ignore.
- Health/power are restricted (secret); max values are fine.
- Quest objectives can be an `<empty: …>` line for quests that are ready to turn in.
- Completed quest titles are only partly resolved; keep IDs as the key.
- Ammo slot line can show `count=1` with no item — ignore.
- Equipment item names can contain apostrophes and "of the Boar"-style suffixes — match on the `(id)` in brackets, not the name.

## Diffing snapshots

The app should keep every pasted snapshot and show what changed since the last one: level, gear swaps, quests completed/added, skill-ups, gold. The two samples make a good diff test (27 → 30).
